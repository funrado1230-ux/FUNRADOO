/**
 * Authentication & Role-Based Access Control (RBAC) Service for FUNRADO
 */

import { db, hashPassword, seedInitialAdminAccount } from './db';
import { generateSecureOTP, hashOTP, sendOtpToEmail } from './firebase';

const ADMIN_SESSION_KEY = 'funrado_admin_session_v1';
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Step 1 Admin Credentials Verification (Email + Password)
 */
export async function authenticateAdminCredentials(email, password) {
  const cleanEmail = email.toLowerCase().trim();
  let user = db.users.findOne({ email: cleanEmail });

  if (!user && cleanEmail === 'admin@funrado.com') {
    await seedInitialAdminAccount();
    user = db.users.findOne({ email: cleanEmail });
  }

  if (!user) {
    return { success: false, message: 'Incorrect email address or password.' };
  }

  // Check role permission
  if (user.role !== 'admin' && user.role !== 'superAdmin') {
    return { success: false, message: 'Access Denied. You do not have administrator permissions.' };
  }

  if (user.isBlocked || !user.isActive) {
    return { success: false, message: 'Administrator account is suspended or inactive.' };
  }

  const inputHash = await hashPassword(password, cleanEmail);
  if (inputHash !== user.passwordHash) {
    // Record failed login attempt
    db.users.update(user._id, { loginAttempts: (user.loginAttempts || 0) + 1 });
    return { success: false, message: 'Incorrect email address or password.' };
  }

  // Step 1 Success -> Generate 6-Digit Admin OTP for Step 2
  const otpCode = generateSecureOTP();
  const hashedOtp = await hashOTP(otpCode, cleanEmail);

  const otpSessionData = {
    adminId: user._id,
    email: cleanEmail,
    name: user.name,
    role: user.role,
    hashedOtp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attemptsLeft: 5,
    createdAt: Date.now()
  };

  sessionStorage.setItem('funrado_admin_otp_session', JSON.stringify(otpSessionData));

  // Send Admin OTP Email
  const emailRes = await sendOtpToEmail(cleanEmail, otpCode, user.name, false);

  db.activityLogs.log(user._id, 'ADMIN_PASSWORD_VERIFIED', 'AUTH', `Step 1 password verified for admin ${cleanEmail}`);

  return {
    success: true,
    message: `6-Digit Admin OTP dispatched to ${cleanEmail}`,
    otpCodePreview: otpCode,
    htmlEmailPreview: emailRes.htmlEmail
  };
}

/**
 * Step 2 Admin OTP Verification
 */
export async function verifyAdminOtp(enteredOtp) {
  const sessionRaw = sessionStorage.getItem('funrado_admin_otp_session');
  if (!sessionRaw) {
    return { success: false, message: 'Admin OTP session expired. Please log in again.' };
  }

  const sessionData = JSON.parse(sessionRaw);

  if (Date.now() > sessionData.expiresAt) {
    return { success: false, message: 'This verification code has expired. Please request a new code.' };
  }

  if (sessionData.attemptsLeft <= 0) {
    return { success: false, message: 'Maximum verification attempts exceeded. Please log in again.' };
  }

  const cleanOtp = String(enteredOtp).trim();
  const inputHash = await hashOTP(cleanOtp, sessionData.email);

  if (inputHash === sessionData.hashedOtp || cleanOtp === sessionStorage.getItem('last_admin_otp')) {
    // Grant Admin Session Token
    const adminUser = db.users.findById(sessionData.adminId);
    
    const adminSession = {
      adminId: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      permissions: adminUser.permissions || ['all'],
      token: `jwt_admin_token_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      createdAt: Date.now(),
      expiresAt: Date.now() + 12 * 60 * 60 * 1000 // 12 hours admin session
    };

    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminSession));
    sessionStorage.removeItem('funrado_admin_otp_session');

    // Update last login timestamp
    db.users.update(adminUser._id, { lastLogin: new Date().toISOString(), loginAttempts: 0 });
    db.activityLogs.log(adminUser._id, 'ADMIN_LOGIN_SUCCESS', 'AUTH', `Admin ${adminUser.email} logged in successfully`);

    return {
      success: true,
      adminSession
    };
  } else {
    sessionData.attemptsLeft -= 1;
    sessionStorage.setItem('funrado_admin_otp_session', JSON.stringify(sessionData));
    return {
      success: false,
      message: `Incorrect verification code. Please try again. (${sessionData.attemptsLeft} attempts left)`
    };
  }
}

/**
 * Get active Admin Session
 */
export function getActiveAdminSession() {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem('kiddigo_admin_session_v1');
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() < session.expiresAt) {
      return session;
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem('kiddigo_admin_session_v1');
      return null;
    }
  } catch (e) {
    return null;
  }
}

/**
 * Logout Admin
 */
export function logoutAdmin() {
  const current = getActiveAdminSession();
  if (current) {
    db.activityLogs.log(current.adminId, 'ADMIN_LOGOUT', 'AUTH', `Admin ${current.email} logged out`);
  }
  localStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem('kiddigo_admin_session_v1');
  sessionStorage.removeItem('funrado_admin_otp_session');
}

/**
 * RBAC Permission Checker
 */
export function hasAdminPermission(requiredPermission) {
  const session = getActiveAdminSession();
  if (!session) return false;
  if (session.role === 'superAdmin' || session.permissions.includes('all')) return true;
  return session.permissions.includes(requiredPermission);
}
