import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { User } from '../types';
import { 
  auth, 
  isFirebaseConfigured,
  signInWithEmail as signInWithEmailService, 
  signInWithGoogle as signInWithGoogleService, 
  signOut as signOutService, 
  mapFirebaseUserToAppUser 
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn("Firebase not configured. Using mock superadmin user for development.");
      setUser({
        id: 'dev-superadmin',
        nome: 'Admin FitBusiness',
        email: 'admin@fitbusiness.com',
        papel: 'superadmin',
        avatarUrl: `https://i.pravatar.cc/150?u=dev-superadmin`,
      });
      setLoading(false);
      return; 
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser = mapFirebaseUserToAppUser(firebaseUser);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignInWithEmail = useCallback(async (email: string, pass: string): Promise<User | null> => {
    const firebaseUser = await signInWithEmailService(email, pass);
    if (firebaseUser) {
      const appUser = mapFirebaseUserToAppUser(firebaseUser);
      setUser(appUser);
      return appUser;
    }
    return null;
  }, []);

  const handleSignInWithGoogle = useCallback(async (): Promise<User | null> => {
    const firebaseUser = await signInWithGoogleService();
     if (firebaseUser) {
      const appUser = mapFirebaseUserToAppUser(firebaseUser);
      setUser(appUser);
      return appUser;
    }
    return null;
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOutService();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ 
    user, 
    loading, 
    signInWithEmail: handleSignInWithEmail, 
    signInWithGoogle: handleSignInWithGoogle, 
    signOut: handleSignOut 
  }), [user, loading, handleSignInWithEmail, handleSignInWithGoogle, handleSignOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};