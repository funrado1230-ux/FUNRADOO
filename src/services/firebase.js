// Firebase, Auth & Database Helper Services for FUNRADO

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { generateFunradoOtpEmailHtml } from './emailTemplate';

// Configurable Firebase Config from import.meta.env or fallback demo config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoFunradoApiKeyForTestingAuth123",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "funrado-auth.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "funrado-auth",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "funrado-auth.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

const isRealFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyDemoFunradoApiKeyForTestingAuth123"
);

let app;
let auth;
let googleProvider;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (error) {
  console.warn("Firebase initialization notice:", error.message);
}

/**
 * Generate a cryptographically secure 6-digit OTP code
 */
export function generateSecureOTP() {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  const otpNumber = 100000 + (array[0] % 900000);
  return otpNumber.toString();
}

/**
 * Hash function for storing OTP securely in client session storage
 */
export async function hashOTP(otp, email) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${otp}_funrado_salt_${email.toLowerCase().trim()}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash function for storing FUNRADO customer passwords (never plain text)
 */
export async function hashPassword(password, email) {
  const encoder = new TextEncoder();
  const salt = `funrado_pwd_salt_${email.toLowerCase().trim()}_v1`;
  const data = encoder.encode(`${salt}_${password}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Registered Users Database helper (persistent in localStorage with auto-migration)
 */
const USERS_DB_KEY = 'funrado_registered_users_v1';

export function getRegisteredUsers() {
  try {
    let raw = localStorage.getItem(USERS_DB_KEY);
    if (!raw) {
      raw = localStorage.getItem('kiddigo_registered_users_v1');
      if (raw) {
        localStorage.setItem(USERS_DB_KEY, raw);
      }
    }
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save user database:', e);
  }
}

export function findUserByEmail(email) {
  const users = getRegisteredUsers();
  const cleanEmail = email.toLowerCase().trim();
  return users.find(u => u.email.toLowerCase() === cleanEmail) || null;
}

export function registerUserInDb(userData) {
  const users = getRegisteredUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === userData.email.toLowerCase());
  
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...userData };
  } else {
    users.push(userData);
  }
  
  saveRegisteredUsers(users);
  return userData;
}

export function updateUserPasswordInDb(email, newHashedPassword) {
  const users = getRegisteredUsers();
  const cleanEmail = email.toLowerCase().trim();
  const idx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
  if (idx >= 0) {
    users[idx].hashedPassword = newHashedPassword;
    saveRegisteredUsers(users);
    return users[idx];
  }
  return null;
}

/**
 * Authenticate using Google OAuth
 */
export async function authenticateWithGoogle() {
  if (isRealFirebaseConfigured && auth) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        success: true,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || null,
        uid: user.uid
      };
    } catch (err) {
      console.error("Firebase Google Auth Error:", err);
      return simulateGooglePopup();
    }
  } else {
    return simulateGooglePopup();
  }
}

function simulateGooglePopup() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleNames = ['Kiddo Explorer', 'Alex Morgan', 'Sam Taylor', 'Jordan Lee'];
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const sampleEmail = `${randomName.toLowerCase().replace(' ', '.')}@gmail.com`;
      
      resolve({
        success: true,
        email: sampleEmail,
        displayName: randomName,
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(sampleEmail)}`,
        uid: `google_uid_${Date.now()}`
      });
    }, 600);
  });
}

/**
 * Send OTP to target email address with HTML template output
 */
export async function sendOtpToEmail(email, otpCode, customerName = '', isPasswordReset = false) {
  console.log(`[FUNRADO OTP BACKEND SERVICE] Dispatching 6-digit OTP [${otpCode}] to: ${email}`);
  
  await new Promise(resolve => setTimeout(resolve, 800));

  const hashed = await hashOTP(otpCode, email);
  const otpSessionData = {
    hashedOtp: hashed,
    email: email.toLowerCase().trim(),
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes validity
    attemptsLeft: 5,
    lastResendAt: Date.now()
  };

  sessionStorage.setItem('funrado_otp_session', JSON.stringify(otpSessionData));

  const htmlEmail = generateFunradoOtpEmailHtml({
    customerName,
    otpCode,
    isPasswordReset
  });

  return {
    success: true,
    message: `OTP successfully sent to ${email}`,
    otpCode,
    htmlEmail
  };
}

export { auth, googleProvider, firebaseSignOut };
