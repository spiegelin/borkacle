"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, login as authLogin, signup as authSignup, logout as authLogout, isAuthenticated, getCurrentUser } from '@/lib/auth';

// Define context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { nombre: string; email: string; password: string; rol?: string; }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  signup: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => {},
  checkAuth: () => {},
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  // Function to check authentication status
  const checkAuth = () => {
    setIsLoading(true);
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authLogin(email, password);
      setUser(userData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (userData: { nombre: string; email: string; password: string; rol?: string; }) => {
    setIsLoading(true);
    try {
      const result = await authSignup(userData);
      return result;
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authLogout();
    setUser(null);
    router.push('/landing');
  };

  // Provider value
  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 