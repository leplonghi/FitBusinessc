import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { User } from '../types';
import { 
  auth, 
  signInWithEmail, 
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
    // onAuthStateChanged is the recommended way to get the current user.
    // It's a real-time listener that fires on sign-in and sign-out.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in.
        const appUser = mapFirebaseUserToAppUser(firebaseUser);
        setUser(appUser);
      } else {
        // User is signed out.
        setUser(null);
      }
      setLoading(false); // Initial auth check is complete.
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignInWithEmail = async (email: string, pass: string): Promise<User | null> => {
    const firebaseUser = await signInWithEmail(email, pass);
    if (firebaseUser) {
      const appUser = mapFirebaseUserToAppUser(firebaseUser);
      setUser(appUser);
      return appUser;
    }
    return null;
  };

  // Fix: The function expressions `handleSignInWithGoogle` and `handleSignOut` were missing the `const` keyword,
  // causing a syntax error that led to subsequent parsing issues.
  const handleSignInWithGoogle = async (): Promise<User | null> => {
    const firebaseUser = await signInWithGoogleService();
     if (firebaseUser) {
      const appUser = mapFirebaseUserToAppUser(firebaseUser);
      setUser(appUser);
      return appUser;
    }
    return null;
  };

  const handleSignOut = async () => {
    await signOutService();
    setUser(null);
  };

  // Fix: The AuthProvider component was not returning a valid ReactNode.
  // Added the return statement with AuthContext.Provider to wrap the children,
  // which resolves the "Type '{}' is not assignable to type 'ReactNode'" error
  // and the related parsing errors.
  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail: handleSignInWithEmail, signInWithGoogle: handleSignInWithGoogle, signOut: handleSignOut }}>
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
