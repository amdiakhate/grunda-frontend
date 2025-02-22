import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { User, LoginDto, LoginResponse } from '@/interfaces/user';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (credentials: LoginDto) => Promise<LoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 