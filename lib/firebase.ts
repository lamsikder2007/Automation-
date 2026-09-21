'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google Auth Provider with requested Workspace Scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');

// In-memory token cache (Do NOT store in localStorage per Workspace skill requirements)
let cachedAccessToken: string | null = null;
let isSigningIn = false;
const tokenListeners: ((token: string | null) => void)[] = [];

export const subscribeToTokenChanges = (listener: (token: string | null) => void) => {
  tokenListeners.push(listener);
  listener(cachedAccessToken);
  return () => {
    const idx = tokenListeners.indexOf(listener);
    if (idx !== -1) tokenListeners.splice(idx, 1);
  };
};

const notifyTokenListeners = (token: string | null) => {
  tokenListeners.forEach((l) => l(token));
};

export const getStoredGoogleToken = (): string | null => {
  return cachedAccessToken;
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) {
        onAuthSuccess(user, cachedAccessToken);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }
    cachedAccessToken = credential.accessToken;
    notifyTokenListeners(cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: unknown) {
    console.error('Google Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
  notifyTokenListeners(cachedAccessToken);
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  notifyTokenListeners(null);
};
