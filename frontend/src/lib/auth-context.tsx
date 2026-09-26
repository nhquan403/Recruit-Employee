'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from './api-client';
import { AuthResponse, AuthUser } from './auth-types';

const STORAGE_KEY = 'vlt_auth';

interface RegisterPayload {
  email: string;
  password: string;
  role: 'CANDIDATE' | 'EMPLOYER';
  fullName: string;
  phone?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function persist(auth: AuthResponse | null) {
  try {
    if (auth) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable (private mode, SSR) — session just won't persist.
  }
}

function readPersisted(): AuthResponse | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // One-time hydration from localStorage: unavoidable here since it's a
  // browser-only API that can't be read during SSR or a lazy useState initializer.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const persisted = readPersisted();
    if (persisted) {
      setUser(persisted.user);
      setAccessToken(persisted.accessToken);
    }
    setIsLoading(false);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const applyAuth = useCallback((auth: AuthResponse) => {
    setUser(auth.user);
    setAccessToken(auth.accessToken);
    persist(auth);
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const auth = await apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: payload,
      });
      applyAuth(auth);
    },
    [applyAuth],
  );

  const login = useCallback(
    async (payload: LoginPayload) => {
      const auth = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: payload,
      });
      applyAuth(auth);
    },
    [applyAuth],
  );

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    persist(null);
  }, []);

  const value = useMemo(
    () => ({ user, accessToken, isLoading, register, login, logout }),
    [user, accessToken, isLoading, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
