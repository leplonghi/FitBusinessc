import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import Layout from './components/layout/Layout';

import VisaoGeral from './pages/VisaoGeral';
import { EmpresasMonitoradas } from './pages/EmpresasMonitoradas';
import MeuPainel from './pages/MeuPainel';
import CentralAlertas from './pages/CentralAlertas';
import RegistroAtividades from './pages/RegistroAtividades';
import Integracoes from './pages/Integracoes';
import PainelAnalitico from './pages/PainelAnalitico';
import GestaoEmpresas from './pages/GestaoEmpresas';
import Perfil from './pages/Perfil';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login'; // Import the new Login page
import { Empresa, Funcionario } from './types';
import { generateMockEmpresas, generateMockFuncionarios } from './lib/mockData';
import FuncionarioDetalhe from './pages/FuncionarioDetalhe';

/**
 * Handles the initial redirection after a user logs in.
 * This component inspects the user's role and navigates them to the 
 * appropriate starting page, fulfilling the role-based redirection requirement.
 */
const HomeRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />; 

  switch (user.papel) {
    case 'superadmin':
      return <VisaoGeral />;
    case 'Funcionário':
      return <Navigate to="/meu-painel" replace />;
    case 'Gerente RH':
      return <Navigate to="/empresas" replace />;
    default:
      // Fallback to a safe default page.
      return <VisaoGeral />;
  }
};

/**
 * A wrapper component that protects routes from unauthenticated access.
 * If a user is not logged in, they are redirected to the /login page.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Render a loading indicator while the authentication state is being checked.
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  if (!user) {
    // Redirect unauthenticated users to the login page, saving the location they tried to access.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * The main application component rendered for authenticated users.
 * It sets up the primary layout and routes, and initializes application data.
 */
const AuthenticatedApp: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  useEffect(() => {
    // Initialize mock data once a user is authenticated.
    setEmpresas(generateMockEmpresas());
    setFuncionarios(generateMockFuncionarios());
  }, []);
  
  return (
      <Layout>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/meu-painel" element={<MeuPainel allFuncionarios={funcionarios} setAllFuncionarios={setFuncionarios} />} />
          <Route path="/empresas" element={<EmpresasMonitoradas allEmpresas={empresas} setAllEmpresas={setEmpresas} allFuncionarios={funcionarios} setAllFuncionarios={setFuncionarios} />} />
          <Route path="/funcionarios/:id" element={<FuncionarioDetalhe allFuncionarios={funcionarios} setAllFuncionarios={setFuncionarios} />} />
          <Route path="/alertas" element={<CentralAlertas />} />
          <Route path="/painel-analitico" element={<PainelAnalitico />} />
          <Route path="/auditoria" element={<RegistroAtividades />} />
          <Route path="/gestao/empresas" element={<GestaoEmpresas allEmpresas={empresas} setAllEmpresas={setEmpresas} allFuncionarios={funcionarios} setAllFuncionarios={setFuncionarios} />} />
          <Route path="/integracoes" element={<Integracoes />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/onboarding" element={<Onboarding setEmpresas={setEmpresas} setFuncionarios={setFuncionarios} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
  )
}

/**
 * The root component of the application.
 * It sets up the theme, authentication context, and main router,
 * distinguishing between public routes (like /login) and protected routes.
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/*"
              element={
                <ProtectedRoute>
                  <AuthenticatedApp />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;