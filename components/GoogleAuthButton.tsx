'use client';

import React, { useEffect, useState } from 'react';
import { initAuth, googleSignIn, logoutGoogle } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { CheckCircle2, LogOut, ShieldCheck, RefreshCw } from 'lucide-react';

interface GoogleAuthButtonProps {
  onTokenChange?: (token: string | null, user: User | null) => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onTokenChange }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        if (onTokenChange) onTokenChange(currentToken, currentUser);
      },
      () => {
        setUser(null);
        setToken(null);
        if (onTokenChange) onTokenChange(null, null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [onTokenChange]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        if (onTokenChange) onTokenChange(res.accessToken, res.user);
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setError(err?.message || 'Authentication failed. Please check popup permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logoutGoogle();
      setUser(null);
      setToken(null);
      if (onTokenChange) onTokenChange(null, null);
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="max-w-[140px] truncate">{user.displayName || user.email}</span>
          <span className="bg-emerald-200 text-emerald-900 text-[10px] px-1.5 py-0.5 rounded font-semibold">
            Workspace Linked
          </span>
        </div>
        <button
          onClick={handleSignOut}
          disabled={loading}
          title="Sign out of Google"
          className="p-1.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors text-xs flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white border border-zinc-300 rounded-full shadow-xs hover:bg-zinc-50 transition-colors text-xs font-medium text-zinc-700 disabled:opacity-50"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin text-zinc-600" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
        )}
        <span>Connect Google Workspace</span>
      </button>
      {error && <span className="text-[11px] text-red-600 mt-1 max-w-[200px] truncate">{error}</span>}
    </div>
  );
};
