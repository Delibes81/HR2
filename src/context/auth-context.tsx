
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, isConfigured } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const firebaseIsConfigured = isConfigured();

  useEffect(() => {
    // This effect runs once on mount to check the initial state.
    // It helps prevent flashes of login page for already authenticated admins.
    if (auth?.currentUser) {
        setUser(auth.currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) {
        throw new Error("Firebase is not configured. Please check your .env file.");
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
  };

  const logout = async () => {
    if (!auth) {
        throw new Error("Firebase is not configured.");
    }
    await signOut(auth);
    setUser(null);
  };

  const value = { user, loading, login, logout, isFirebaseConfigured: firebaseIsConfigured };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
