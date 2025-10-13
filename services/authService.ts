import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  Auth,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { User } from '../types';

// --- FIREBASE CONFIGURATION ---

// IMPORTANT: Replace these placeholder values with your actual Firebase project credentials.
// For security, these should be stored in environment variables (e.g., .env file).
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // process.env.REACT_APP_FIREBASE_API_KEY
  authDomain: "YOUR_AUTH_DOMAIN", // process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
  projectId: "YOUR_PROJECT_ID", // process.env.REACT_APP_FIREBASE_PROJECT_ID
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// This flag allows the app to detect if Firebase is properly configured.
// In a real app, you would check environment variables. Here, we check the placeholders.
export const isFirebaseConfigured = 
  firebaseConfig.apiKey !== "YOUR_API_KEY" && 
  firebaseConfig.authDomain !== "YOUR_AUTH_DOMAIN";


if (!isFirebaseConfigured) {
    console.warn(
        `
        *********************************************************************
        ** ATENÇÃO: As credenciais do Firebase não estão configuradas.      **
        ** A autenticação não funcionará. Por favor, edite o arquivo       **
        ** 'services/authService.ts' com suas credenciais reais.            **
        *********************************************************************
        `
    );
}

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);


// --- USER MAPPING ---

/**
 * Maps a Firebase User object to our application's internal User type.
 * This is where you would implement your role-based access control logic.
 * 
 * !!! SECURITY NOTE !!!
 * In a production environment, user roles should be managed securely on the backend
 * or using Firebase Custom Claims, not determined on the client-side based on email.
 * This implementation is for demonstration purposes only.
 */
export const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser): User => {
  const email = firebaseUser.email || '';
  
  // Demo logic for assigning roles based on email
  if (email.toLowerCase() === 'admin@fitbusiness.com') {
    return {
      id: firebaseUser.uid,
      nome: firebaseUser.displayName || 'Admin FitBusiness',
      email: email,
      papel: 'superadmin',
      avatarUrl: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
    };
  }

  // A mapping for a client RH manager
  if (email.toLowerCase().includes('maria.silva')) {
     return {
      id: firebaseUser.uid,
      nome: firebaseUser.displayName || 'Maria Silva',
      email: email,
      papel: 'Gerente RH',
      avatarUrl: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
      empresaId: 'e1' // Hardcoded for demo
    };
  }

  // Default to 'Funcionário' role
  return {
    id: firebaseUser.uid,
    nome: firebaseUser.displayName || 'Usuário',
    email: email,
    papel: 'Funcionário',
    avatarUrl: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
    empresaId: 'e1' // Hardcoded for demo
  };
};


// --- AUTHENTICATION SERVICE FUNCTIONS ---

export const signInWithEmail = async (email: string, pass: string): Promise<FirebaseUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
};

export const signInWithGoogle = async (): Promise<FirebaseUser> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
}

export const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
};
