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
// It checks if the placeholder values are still present.
export const isFirebaseConfigured = 
  firebaseConfig.apiKey !== "YOUR_API_KEY" && 
  firebaseConfig.authDomain !== "YOUR_AUTH_DOMAIN";


if (!isFirebaseConfigured) {
    console.warn(
        `
        *********************************************************************
        ** ATENÇÃO: As credenciais do Firebase não estão configuradas.      **
        ** O app usará um usuário 'superadmin' mock para desenvolvimento.    **
        ** Edite 'services/authService.ts' com suas credenciais para      **
        ** testar a autenticação real.                                     **
        *********************************************************************
        `
    );
}

// Initialize Firebase only if it's configured.
const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);


// --- MOCK USER DEFINITIONS ---
// This map centralizes the definitions for special mock users, making it cleaner
// than a series of 'if' statements. It's used for mapping specific Firebase accounts
// to predefined roles in this demo environment.
const specialUserMap: { [email: string]: Partial<User> } = {
  'admin@fitbusiness.com': {
    papel: 'superadmin',
    nome: 'Admin FitBusiness',
  },
  'maria.silva@inova.tech': {
    papel: 'Gerente RH',
    nome: 'Maria Silva',
    empresaId: 'e1',
  },
  'bruno.costa@inova.tech': {
    id: 'f2', // Matching an ID from mockData for MeuPainel
    papel: 'Funcionário',
    nome: 'Bruno Costa',
    empresaId: 'e1'
  }
};


// --- USER MAPPING ---

/**
 * Maps a Firebase User object to our application's internal User type.
 * !!! SECURITY NOTE !!!
 * In a production environment, user roles should be managed securely on the backend
 * or using Firebase Custom Claims, not determined on the client-side.
 * This implementation is for demonstration purposes only.
 */
export const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser): User => {
  const email = firebaseUser.email?.toLowerCase() || '';
  const specialUser = specialUserMap[email];

  if (specialUser) {
    return {
      id: specialUser.id || firebaseUser.uid,
      email: firebaseUser.email || '',
      avatarUrl: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
      ...specialUser,
    } as User;
  }

  // Default to 'Funcionário' role for any other authenticated user
  return {
    id: firebaseUser.uid,
    nome: firebaseUser.displayName || 'Usuário Padrão',
    email: firebaseUser.email || '',
    papel: 'Funcionário',
    avatarUrl: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
    empresaId: 'e2', // Default company for generic users
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