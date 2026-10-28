'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, clearToken, getToken, setToken } from './api';

export type User = { id: string; name: string; email: string | null; phone: string | null; role: 'ADMIN' | 'STAFF' };
type Ctx = { user: User | null; loading: boolean; login: (id: string, pw: string) => Promise<User>; logout: () => void };

const AuthContext = createContext<Ctx>(null as unknown as Ctx);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) return setLoading(false);
    api<User>('/auth/me').then(setUser).catch(() => clearToken()).finally(() => setLoading(false));
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await api<{ accessToken: string; user: User }>('/auth/login', { method: 'POST', body: { identifier, password } });
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  };
  const logout = () => { clearToken(); setUser(null); window.location.href = '/login'; };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
