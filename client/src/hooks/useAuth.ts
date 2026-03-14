'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { saveAuth, clearAuth, getStoredUser } from '@/lib/auth';
import { User } from '@/types/user';

export function useAuth() {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, data } = res.data;
    saveAuth(token, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(
    async (payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }) => {
      const res = await api.post('/auth/register', payload);
      const { token, data } = res.data;
      saveAuth(token, data.user);
      setUser(data.user);
      return data.user;
    },
    []
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    router.push('/login');
  }, [router]);

  const isAdmin = user?.role === 'admin';

  return { user, loading, isAdmin, login, register, logout };
}
