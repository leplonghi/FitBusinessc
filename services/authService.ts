// This file encapsulates all Firebase authentication logic.
// In a real application, the Firebase configuration would be stored in secure environment variables.
// For this project, we'll use placeholder values.

import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    signOut,
    User as FirebaseUser
} from 'firebase/auth';
import { User, Papel } from '../types';

// Check for environment variables and warn the developer if they are missing.
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
if (!apiKey) {
    console.warn(
        "Firebase API Key is missing from environment variables (e.g., .env). " +
        "Using placeholder keys which will cause authentication to fail. " +
        "Please provide your Firebase project credentials."
    );
}

// IMPORTANT: Replace with your actual Firebase configuration
// and store it securely in environment variables (e.g., .env file).
// The values below are syntactically valid placeholders to prevent initialization errors.
const firebaseConfig = {
  apiKey: apiKey || "AIzaSyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "fitbusiness-comet.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "fitbusiness-comet",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "fitbusiness-comet.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789012:web:1234567890abcdef"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

// This function maps a Firebase User to your application's User type.
// In a real app, you would fetch the user's role and companyId from your database (e.g., Firestore)
// based on the firebaseUser.uid. For this demo, we'll assign roles based on the email.
export const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser): User => {
    let papel: Papel = 'Funcionário'; // Default role
    let empresaId: string | undefined = undefined;

    // Demo logic to assign roles based on email domain or specific emails.
    if (firebaseUser.email?.endsWith('@fitbusiness.com')) {
        papel = 'superadmin';
    } else if (firebaseUser.email?.endsWith('@empresa.com')) {
        papel = 'Gerente RH';
        empresaId = 'e1'; // Assign to a default company for demo
    } else {
        papel = 'Funcionário';
        empresaId = 'e1'; // Assign to a default company for demo
    }
    
    return {
        id: firebaseUser.uid,
        nome: firebaseUser.displayName || 'Usuário',
        email: firebaseUser.email || 'N/A',
        papel,
        avatarUrl: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
        empresaId,
    };
};


export const authService = {
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      throw error;
    }
  },

  signInWithEmail: async (email: string, password: string) => {
     try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error("Error during email sign-in:", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },
};