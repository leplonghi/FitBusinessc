import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ActivitySquare, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { FirebaseError } from 'firebase/app';
import { isFirebaseConfigured } from '../services/authService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const from = location.state?.from?.pathname || '/';

  // Check if Firebase is configured. If not, disable login and show a warning.
  const isConfigured = isFirebaseConfigured;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) return;
    setError('');
    setLoading(true);

    try {
      const user = await signInWithEmail(email, password);
      if (user) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
          switch (err.code) {
              case 'auth/user-not-found':
              case 'auth/wrong-password':
              case 'auth/invalid-credential':
                  setError('Email ou senha inválidos. Por favor, tente novamente.');
                  break;
              case 'auth/too-many-requests':
                  setError('Acesso bloqueado temporariamente. Tente novamente mais tarde.');
                  break;
              case 'auth/network-request-failed':
                  setError('Erro de conexão. Verifique sua internet e tente novamente.');
                  break;
              default:
                   setError('Ocorreu um erro ao fazer login. Por favor, tente mais tarde.');
          }
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isConfigured) return;
    setError('');
    setLoading(true);
    try {
        const user = await signInWithGoogle();
        if (user) {
            navigate(from, { replace: true });
        }
    } catch (err) {
        if (err instanceof FirebaseError) {
             // This error occurs when the user intentionally closes the Google popup.
             // It is a user action, not a system error, so we don't show a message.
             if (err.code === 'auth/popup-closed-by-user') {
                // Silently ignore this error.
             } else {
                setError('Falha ao autenticar com o Google. Tente novamente.');
             }
        } else {
             setError('Ocorreu um erro inesperado durante o login com o Google.');
        }
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <ActivitySquare size={48} className="mx-auto text-fit-dark-blue dark:text-white" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">FitBusiness</h1>
            <p className="mt-2 text-sm text-fit-gray">
              Acesse sua conta para gerenciar o bem-estar da sua equipe.
            </p>
        </div>

        {!isConfigured && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-300 p-4 rounded-md" role="alert">
                <div className="flex items-center">
                    <AlertTriangle size={20} className="mr-3" />
                    <div>
                        <p className="font-bold">Configuração Incompleta</p>
                        <p className="text-sm">As credenciais do Firebase não foram configuradas. A autenticação está desativada.</p>
                    </div>
                </div>
            </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border dark:border-gray-700">
          <button
            onClick={handleGoogleSignIn}
            disabled={!isConfigured || loading}
            className="group relative flex w-full justify-center items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-fit-dark-blue focus:ring-offset-2 disabled:opacity-50"
          >
             <svg className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 24.5 172.4 64.2L361.3 128C330.5 100.3 291.6 84 248 84c-83.8 0-152.3 68.5-152.3 152S164.2 410 248 410c95.7 0 146.5-74.5 150.7-111.7H248v-84.1h236.5c2.3 12.7 3.5 25.8 3.5 39.7z"></path></svg>
             Entrar com Google
          </button>
           <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">ou</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

          <form className="space-y-6" onSubmit={handleEmailSubmit}>
            <div className="space-y-4">
              <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" placeholder="Email"/>
              <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" placeholder="Senha"/>
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <div>
              <button type="submit" disabled={!isConfigured || loading} className="group relative flex w-full justify-center rounded-md border border-transparent bg-fit-dark-blue py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-fit-dark-blue focus:ring-offset-2 disabled:bg-gray-400">
                {loading ? 'Entrando...' : 'Entrar com Email'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
