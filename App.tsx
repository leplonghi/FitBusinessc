import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';

import VisaoGeral from './pages/VisaoGeral';
import { EmpresasMonitoradas } from './pages/EmpresasMonitoradas';
import MeuPainel from './pages/MeuPainel';
import CentralAlertas from './pages/CentralAlertas';
import RegistroAtividades from './pages/RegistroAtividades';
import Integracoes from './pages/Integracoes';
import PainelAnalitico from './pages/PainelAnalitico';
import Perfil from './pages/Perfil';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login'; // Import the new Login page
import { Empresa, Funcionario } from './types';
import { generateMockEmpresas, generateMockFuncionarios } from './lib/mockData';

// Component to handle role-based redirection from the root path
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
      return <VisaoGeral />;
  }
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You can render a loading spinner here while checking auth state
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AuthenticatedApp: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  useEffect(() => {
    // Initialize data once a user is authenticated
    setEmpresas(generateMockEmpresas());
    setFuncionarios(generateMockFuncionarios());
  }, []);
  
  return (
      <Layout>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/meu-painel" element={<MeuPainel />} />
          <Route path="/empresas" element={<EmpresasMonitoradas allEmpresas={empresas} setAllEmpresas={setEmpresas} allFuncionarios={funcionarios} setAllFuncionarios={setFuncionarios} />} />
          <Route path="/alertas" element={<CentralAlertas />} />
          <Route path="/painel-analitico" element={<PainelAnalitico />} />
          <Route path="/auditoria" element={<RegistroAtividades />} />
          <Route path="/integracoes" element={<Integracoes />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/onboarding" element={<Onboarding setEmpresas={setEmpresas} setFuncionarios={setFuncionarios} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
  )
}


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
