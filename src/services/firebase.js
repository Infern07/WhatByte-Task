/**
 * Firebase initialization and auth helpers.
 * Replace firebaseConfig with values from your Firebase project (Project settings → General).
 */
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase web app config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: "whatbyte-task.firebaseapp.com",
  projectId: "whatbyte-task",
  storageBucket: "whatbyte-task.firebasestorage.app",
  messagingSenderId: "233636536113",
  appId: "1:233636536113:web:eabdc6bdb8a2287ecf1a10",
  measurementId: "G-NGBYZL2GF8"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Register a new user with email and password.
 */
export async function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email.trim(), password);
}

/**
 * Sign in an existing user.
 */
export async function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

/**
 * Sign out the current user.
 */
export async function logOut() {
  return signOut(auth);
}

/**
 * Send password reset email (login screen "Forgot password").
 */
export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email.trim());
}

/**
 * Map Firebase Auth error codes to short user-facing messages.
 */
export function getAuthErrorMessage(error) {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return error?.message || 'Something went wrong. Please try again.';
  }
}

/** Errors when sending password reset email */
export function getPasswordResetErrorMessage(error) {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/missing-email':
      return 'Enter your email first.';
    case 'auth/user-not-found':
      return 'No account found for this email.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    default:
      return error?.message || 'Could not send reset email.';
  }
}
