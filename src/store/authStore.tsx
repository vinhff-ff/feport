import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '../types/AuthState';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      setToken: (accessToken, refreshToken, role) => set({ accessToken, refreshToken, role }),
      logout: () => set({ accessToken: null, refreshToken: null, role: null }),
    }),
    { name: 'auth-storage' }
  )
);