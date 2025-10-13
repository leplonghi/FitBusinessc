import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';

import VisaoGeral from './pages/VisaoGeral';
import EmpresasMonitoradas from './pages/EmpresasMonitoradas';
import MeuPainel from './pages/MeuPainel';
import CentralAlertas from './pages/CentralAlertas';
import RegistroAtividades from './pages/RegistroAtividades';
import Integracoes from './pages/Integracoes';
import PainelAnalitico from './pages/PainelAnalitico';
import Perfil from './pages/Perfil';


// Component to handle role-based redirection from the root path
const HomeRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <VisaoGeral />; // Fallback to a general page or login

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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/meu-painel" element={<MeuPainel />} />
              <Route path="/empresas" element={<EmpresasMonitoradas />} />
              <Route path="/alertas" element={<CentralAlertas />} />
              <Route path="/painel-analitico" element={<PainelAnalitico />} />
              <Route path="/auditoria" element={<RegistroAtividades />} />
              <Route path="/integracoes" element={<Integracoes />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;