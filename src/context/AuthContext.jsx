import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  authenticateWithGoogle, 
  generateSecureOTP, 
  hashOTP, 
  hashPassword,
  sendOtpToEmail,
  findUserByEmail,
  registerUserInDb,
  updateUserPasswordInDb
} from '../services/firebase';

const AuthContext = createContext();

const SESSION_KEY = 'funrado_auth_session_v2';
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_SEC = 60; // 60 seconds
const MAX_ATTEMPTS = 5;

export function validatePasswordStrength(password) {
  const errors = [];
  if (!password || password.length < 8) {
    errors.push('At least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('One uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('One lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('One number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('One special character (!@#$%^&*)');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState('login'); // 'login' | 'register' | 'otp' | 'forgot-password' | 'reset-password' | 'verified'
  const [isAuthOverlayOpen, setIsAuthOverlayOpen] = useState(false); // Controls login overlay visibility
  const [pendingAuthAction, setPendingAuthAction] = useState(null); // Callback after successful login
  const [authReasonMessage, setAuthReasonMessage] = useState(null); // Custom message e.g. "Please sign in to buy"

  const [isResetFlow, setIsResetFlow] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const [targetEmail, setTargetEmail] = useState('');
  const [pendingRegistration, setPendingRegistration] = useState(null);
  
  const [otpCodePreview, setOtpCodePreview] = useState('');
  const [htmlEmailPreview, setHtmlEmailPreview] = useState('');
  
  const [otpExpiryTime, setOtpExpiryTime] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(MAX_ATTEMPTS);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY) || localStorage.getItem('kiddigo_auth_session_v2');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          setUser(parsed.user);
          setAuthStep('verified');
          setIsAuthOverlayOpen(false);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    }
  }, []);

  // 5-Minute OTP Expiry Countdown Timer
  useEffect(() => {
    if (authStep !== 'otp' || !otpExpiryTime) return;

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((otpExpiryTime - Date.now()) / 1000));
      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        setError('OTP has expired after 5 minutes. Please click "Resend OTP" to request a new code.');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [authStep, otpExpiryTime]);

  // 60-Second Resend Cooldown Timer
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const setTemporarySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  /**
   * Trigger Login Overlay when user tries to buy/checkout or sign in
   */
  const openAuthOverlay = (step = 'login', reasonMsg = null, onVerifiedCallback = null) => {
    setAuthStep(step);
    setAuthReasonMessage(reasonMsg);
    if (onVerifiedCallback) {
      setPendingAuthAction(() => onVerifiedCallback);
    }
    setIsAuthOverlayOpen(true);
  };

  const closeAuthOverlay = () => {
    setIsAuthOverlayOpen(false);
    setAuthReasonMessage(null);
  };

  /**
   * Action guard: Returns true if user is verified. If unverified, opens login page!
   */
  const requireAuth = (onSuccessCallback, reasonMsg = "Please Sign In or Register to buy this product") => {
    if (user && user.isVerified) {
      onSuccessCallback();
      return true;
    } else {
      openAuthOverlay('login', reasonMsg, onSuccessCallback);
      return false;
    }
  };

  /**
   * Helper to execute pending action post-verification
   */
  const executePendingAction = () => {
    if (pendingAuthAction) {
      try {
        pendingAuthAction();
      } catch (e) {
        console.error("Failed to execute post-login action:", e);
      }
      setPendingAuthAction(null);
    }
  };

  /**
   * Dispatch 6-digit OTP to target email
   */
  const dispatchOtp = async (email, customerName = '', resetMode = false) => {
    setIsLoading(true);
    setError(null);

    const cleanEmail = email.toLowerCase().trim();
    const newOtp = generateSecureOTP();

    try {
      const response = await sendOtpToEmail(cleanEmail, newOtp, customerName, resetMode);
      
      setTargetEmail(cleanEmail);
      setIsResetFlow(resetMode);
      setOtpCodePreview(newOtp);
      setHtmlEmailPreview(response.htmlEmail || '');
      
      const expiry = Date.now() + OTP_EXPIRY_MS;
      setOtpExpiryTime(expiry);
      setSecondsRemaining(300);
      setOtpAttemptsLeft(MAX_ATTEMPTS);
      setResendCooldown(RESEND_COOLDOWN_SEC);
      
      setAuthStep('otp');
      setIsAuthOverlayOpen(true);
      setTemporarySuccess(`6-digit OTP code sent to ${cleanEmail}`);
    } catch (err) {
      setError(err.message || 'Failed to send OTP email.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with Email OTP Directly
   */
  const loginWithEmailOtp = async (email) => {
    setError(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = findUserByEmail(cleanEmail);
    
    if (existing) {
      setPendingRegistration(existing);
      await dispatchOtp(cleanEmail, existing.fullName, false);
    } else {
      const defaultUser = {
        fullName: cleanEmail.split('@')[0],
        email: cleanEmail,
        mobile: 'N/A',
        hashedPassword: 'EMAIL_OTP_USER',
        isVerified: true
      };
      setPendingRegistration(defaultUser);
      await dispatchOtp(cleanEmail, defaultUser.fullName, false);
    }
    return true;
  };

  /**
   * Customer Registration Handler
   */
  const registerCustomer = async ({ fullName, email, mobile, password, confirmPassword }) => {
    setError(null);

    if (!fullName || !fullName.trim()) {
      setError('Please enter your full name.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile || !mobileRegex.test(mobile.trim().replace(/[- ]/g, ''))) {
      setError('Please enter a valid 10-digit mobile number.');
      return false;
    }

    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      setError(`Password must include: ${passwordCheck.errors.join(', ')}`);
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return false;
    }

    const existing = findUserByEmail(email);
    if (existing && existing.isVerified && existing.hashedPassword !== 'EMAIL_OTP_USER') {
      setError('An account with this email address already exists. Please login instead.');
      return false;
    }

    setIsLoading(true);
    try {
      const hashedPassword = await hashPassword(password, email);
      const registrationData = {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        mobile: mobile.trim(),
        hashedPassword,
        isVerified: false,
        registeredAt: new Date().toISOString()
      };

      setPendingRegistration(registrationData);
      await dispatchOtp(email, fullName, false);
      return true;
    } catch (err) {
      setError('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Customer Login Handler (Email + Password)
   */
  const loginCustomer = async ({ email, password }) => {
    setError(null);

    if (!email || !email.trim()) {
      setError('Please enter your email address.');
      return false;
    }

    if (!password) {
      setError('Please enter your password.');
      return false;
    }

    setIsLoading(true);
    try {
      const cleanEmail = email.toLowerCase().trim();
      const existingUser = findUserByEmail(cleanEmail);

      if (!existingUser) {
        setError('Incorrect email address or password.');
        return false;
      }

      const inputHashed = await hashPassword(password, cleanEmail);
      if (inputHashed !== existingUser.hashedPassword) {
        setError('Incorrect email address or password.');
        return false;
      }

      if (!existingUser.isVerified) {
        setPendingRegistration(existingUser);
        await dispatchOtp(cleanEmail, existingUser.fullName, false);
        setTemporarySuccess('Please verify your email address to log in.');
        return true;
      }

      const sessionUser = {
        fullName: existingUser.fullName,
        email: existingUser.email,
        mobile: existingUser.mobile,
        isVerified: true,
        isGuest: false
      };

      const sessionPayload = {
        user: sessionUser,
        createdAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
      setUser(sessionUser);
      setAuthStep('verified');
      setIsAuthOverlayOpen(false);
      executePendingAction();
      setTemporarySuccess(`Welcome back, ${sessionUser.fullName}!`);
      return true;
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Google OAuth Handler
   */
  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const googleRes = await authenticateWithGoogle();
      if (googleRes.success && googleRes.email) {
        const existing = findUserByEmail(googleRes.email);
        const googleUser = {
          fullName: existing?.fullName || googleRes.displayName,
          email: googleRes.email,
          mobile: existing?.mobile || 'Not provided',
          photoURL: googleRes.photoURL,
          isVerified: true,
          isGuest: false
        };

        registerUserInDb({
          ...googleUser,
          hashedPassword: 'GOOGLE_OAUTH_ACCOUNT'
        });

        const sessionPayload = {
          user: googleUser,
          createdAt: Date.now(),
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
        setUser(googleUser);
        setAuthStep('verified');
        setIsAuthOverlayOpen(false);
        executePendingAction();
        setTemporarySuccess(`Welcome, ${googleUser.fullName}! Logged in via Google.`);
      } else {
        setError('Google authentication was cancelled.');
      }
    } catch (err) {
      setError('Google Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify 6-digit OTP Code
   */
  const verifyOtp = async (enteredOtp) => {
    setError(null);

    if (secondsRemaining <= 0) {
      setError('OTP has expired. Please click "Resend OTP" to request a new code.');
      return false;
    }

    if (otpAttemptsLeft <= 0) {
      setError('Maximum OTP attempts reached. Please request a new OTP code.');
      return false;
    }

    const cleanCode = String(enteredOtp).trim();
    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      setError('Please enter a valid 6-digit code.');
      return false;
    }

    setIsLoading(true);
    try {
      const enteredHash = await hashOTP(cleanCode, targetEmail);
      const sessionRaw = sessionStorage.getItem('funrado_otp_session') || sessionStorage.getItem('kiddigo_otp_session');

      let isValid = false;
      if (sessionRaw) {
        const sessionData = JSON.parse(sessionRaw);
        if (sessionData.hashedOtp === enteredHash && Date.now() < sessionData.expiresAt) {
          isValid = true;
        }
      }

      if (cleanCode === String(otpCodePreview).trim()) {
        isValid = true;
      }

      if (isValid) {
        if (isResetFlow) {
          setAuthStep('reset-password');
          setTemporarySuccess('OTP verified. Please create your new password.');
          return true;
        }

        const baseObj = pendingRegistration || findUserByEmail(targetEmail);
        const finalUserData = {
          fullName: baseObj?.fullName || targetEmail.split('@')[0],
          email: targetEmail.toLowerCase().trim(),
          mobile: baseObj?.mobile || 'N/A',
          hashedPassword: baseObj?.hashedPassword || 'OTP_VERIFIED_USER',
          isVerified: true
        };

        registerUserInDb(finalUserData);

        const sessionUser = {
          fullName: finalUserData.fullName,
          email: finalUserData.email,
          mobile: finalUserData.mobile,
          isVerified: true,
          isGuest: false
        };

        const sessionPayload = {
          user: sessionUser,
          createdAt: Date.now(),
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
        sessionStorage.removeItem('funrado_otp_session');
        sessionStorage.removeItem('kiddigo_otp_session');

        setUser(sessionUser);
        setAuthStep('verified');
        setIsAuthOverlayOpen(false);
        executePendingAction();
        setTemporarySuccess('OTP verified successfully! Welcome to FUNRADO.');
        return true;
      } else {
        const remaining = otpAttemptsLeft - 1;
        setOtpAttemptsLeft(remaining);

        if (remaining > 0) {
          setError(`Incorrect OTP. Please check the code and try again. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`);
        } else {
          setError('Incorrect OTP. Maximum attempts exceeded. Please request a new OTP.');
        }
        return false;
      }
    } catch (err) {
      setError('Verification error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend OTP
   */
  const resendOtp = async () => {
    if (resendCooldown > 0) {
      setError(`Please wait ${resendCooldown} seconds before requesting another OTP.`);
      return;
    }

    const name = pendingRegistration?.fullName || '';
    await dispatchOtp(targetEmail, name, isResetFlow);
  };

  /**
   * Request Password Reset
   */
  const requestPasswordReset = async (email) => {
    setError(null);
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail) {
      setError('Please enter your registered email address.');
      return false;
    }

    const userInDb = findUserByEmail(cleanEmail);
    if (!userInDb) {
      setError('No FUNRADO account found with this email address.');
      return false;
    }

    await dispatchOtp(cleanEmail, userInDb.fullName, true);
    return true;
  };

  /**
   * Reset Password
   */
  const resetPassword = async (newPassword, confirmPassword) => {
    setError(null);

    const check = validatePasswordStrength(newPassword);
    if (!check.isValid) {
      setError(`Password must include: ${check.errors.join(', ')}`);
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    setIsLoading(true);
    try {
      const newHashed = await hashPassword(newPassword, targetEmail);
      const updatedUser = updateUserPasswordInDb(targetEmail, newHashed);

      if (updatedUser) {
        const sessionUser = {
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
          isVerified: true,
          isGuest: false
        };

        const sessionPayload = {
          user: sessionUser,
          createdAt: Date.now(),
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
        setUser(sessionUser);
        setAuthStep('verified');
        setIsResetFlow(false);
        setIsAuthOverlayOpen(false);
        executePendingAction();
        setTemporarySuccess('Password successfully reset! You are now logged in.');
        return true;
      } else {
        setError('Failed to update password.');
        return false;
      }
    } catch (err) {
      setError('Password reset failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Skip Login for Guest Access
   */
  const skipLogin = () => {
    setIsAuthOverlayOpen(false);
    setTemporarySuccess('You can explore FUNRADO as a Guest. Log in anytime when ready to buy!');
  };

  /**
   * Logout
   */
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('kiddigo_auth_session_v2');
    sessionStorage.removeItem('funrado_otp_session');
    sessionStorage.removeItem('kiddigo_otp_session');
    setUser(null);
    setAuthStep('login');
    setIsAuthOverlayOpen(false);
    setTargetEmail('');
    setPendingRegistration(null);
    setOtpCodePreview('');
    setHtmlEmailPreview('');
    setIsResetFlow(false);
    setIsAccountModalOpen(false);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authStep,
        setAuthStep,
        isAuthOverlayOpen,
        openAuthOverlay,
        closeAuthOverlay,
        requireAuth,
        authReasonMessage,
        targetEmail,
        isResetFlow,
        isAccountModalOpen,
        setIsAccountModalOpen,
        otpCodePreview,
        htmlEmailPreview,
        secondsRemaining,
        resendCooldown,
        otpAttemptsLeft,
        isLoading,
        error,
        successMsg,
        registerCustomer,
        loginCustomer,
        loginWithEmailOtp,
        loginWithGoogle,
        verifyOtp,
        resendOtp,
        requestPasswordReset,
        resetPassword,
        skipLogin,
        logout,
        setError,
        setSuccessMsg: setTemporarySuccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
