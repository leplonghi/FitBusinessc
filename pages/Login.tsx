import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ActivitySquare, Mail, Key, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import Spinner from '../components/ui/Spinner';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuthError = (err: any) => {
        if (err.code === 'auth/api-key-not-valid') {
            setError('Configuração do Firebase inválida. Verifique suas credenciais de API no ambiente.');
        } else if (err.code === 'auth/invalid-credential') {
            setError('Email ou senha inválidos. Tente novamente.');
        }
        else {
            setError(err.message || 'Ocorreu um erro durante o login.');
        }
        setLoading(false);
    }

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            await authService.signInWithGoogle();
            navigate(from, { replace: true });
        } catch (err: any) {
            handleAuthError(err);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await authService.signInWithEmail(email, password);
            navigate(from, { replace: true });
        } catch (err: any) {
             handleAuthError(err);
        }
    };
    
    return (
        <div className="min-h-screen bg-fit-light-gray flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                <div className="flex justify-center items-center mb-6">
                    <ActivitySquare size={40} className="text-fit-dark-blue" />
                    <h1 className="ml-3 text-3xl font-bold text-fit-dark-blue">FitBusiness</h1>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg border">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">Bem-vindo(a) de volta!</h2>
                    <p className="text-center text-fit-gray mb-6">Acesse seu painel para monitorar a saúde da sua equipe.</p>
                    
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center mb-4">{error}</p>}
                    
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                        <div>
                           <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                            <div className="relative mt-1">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input 
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu.email@empresa.com"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fit-dark-blue"
                                />
                            </div>
                        </div>
                        <div>
                           <label htmlFor="password"className="text-sm font-medium text-gray-700">Senha</label>
                           <div className="relative mt-1">
                                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input 
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Sua senha"
                                    required
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fit-dark-blue"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={16}/> : <Eye size={16} />}
                                </button>
                           </div>
                        </div>
                         <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-fit-dark-blue text-white py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors flex justify-center items-center disabled:bg-gray-400"
                        >
                            {loading ? <Spinner /> : 'Entrar'}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">OU</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleGoogleSignIn} 
                        disabled={loading}
                        className="w-full flex justify-center items-center py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                         <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5 mr-3" />
                         Entrar com Google
                    </button>
                </div>
                 <p className="text-center text-xs text-fit-gray mt-6">
                    Ao fazer login, você concorda com nossos Termos de Serviço e Política de Privacidade.
                </p>
            </div>
        </div>
    );
};

export default Login;