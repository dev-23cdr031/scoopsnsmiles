'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface AuthUser {
  name: string;
  email: string;
}

type StoredAccount = AuthUser & {
  password: string;
};

type AuthActionResult = {
  ok: boolean;
  message?: string;
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  signIn: (email: string, password: string) => AuthActionResult;
  signUp: (name: string, email: string, password: string) => AuthActionResult;
  signOut: () => void;
}

const STORAGE_USER_KEY = 'sakthi_auth_user_v1';
const STORAGE_ACCOUNTS_KEY = 'sakthi_auth_accounts_v1';

const AuthContext = createContext<AuthContextType | null>(null);

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function readAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as StoredAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function writeUser(user: AuthUser | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!user) {
    localStorage.removeItem(STORAGE_USER_KEY);
    return;
  }

  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed?.email) {
          setUser({ name: parsed.name || 'User', email: normalizeEmail(parsed.email) });
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_USER_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const signIn = useCallback((email: string, password: string): AuthActionResult => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password.trim()) {
      return { ok: false, message: 'Email and password are required.' };
    }

    const account = readAccounts().find((item) => item.email === normalizedEmail);
    if (!account || account.password !== password) {
      return { ok: false, message: 'Invalid email or password.' };
    }

    const nextUser: AuthUser = {
      name: account.name,
      email: account.email,
    };

    setUser(nextUser);
    writeUser(nextUser);
    return { ok: true };
  }, []);

  const signUp = useCallback((name: string, email: string, password: string): AuthActionResult => {
    const safeName = name.trim();
    const normalizedEmail = normalizeEmail(email);
    const safePassword = password.trim();

    if (!safeName || !normalizedEmail || !safePassword) {
      return { ok: false, message: 'Name, email and password are required.' };
    }

    if (safePassword.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters.' };
    }

    const accounts = readAccounts();
    if (accounts.some((item) => item.email === normalizedEmail)) {
      return { ok: false, message: 'An account already exists for this email.' };
    }

    const createdAccount: StoredAccount = {
      name: safeName,
      email: normalizedEmail,
      password: safePassword,
    };

    writeAccounts([...accounts, createdAccount]);

    const nextUser: AuthUser = {
      name: createdAccount.name,
      email: createdAccount.email,
    };

    setUser(nextUser);
    writeUser(nextUser);
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    writeUser(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isHydrated,
      signIn,
      signUp,
      signOut,
    }),
    [user, isHydrated, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
