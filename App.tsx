import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// FIX: Add .tsx extension to component/hook imports
import { ThemeProvider } from './hooks/useTheme.tsx';
import { DataProvider } from './hooks/useData.tsx';
import Layout from './components/layout/Layout.tsx';

import VisaoGeral from './pages/VisaoGeral.tsx';
import { EmpresasMonitoradas } from './pages/EmpresasMonitoradas.tsx';
import CentralAlertas from './pages/CentralAlertas.tsx';
import RegistroAtividades from './pages/RegistroAtividades.tsx';
import Integracoes from './pages/Integracoes.tsx';
import PainelAnalitico from './pages/PainelAnalitico.tsx';
import GestaoEmpresas from './pages/GestaoEmpresas.tsx';
import Onboarding from './pages/Onboarding.tsx';
import FuncionarioDetalhe from './pages/FuncionarioDetalhe.tsx';

/**
 * A wrapper component for routes that will require authentication in the future.
 * As authentication is currently removed, it allows access to all child routes.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Since authentication has been removed, we simulate an authenticated state.
  // In a future implementation, this would check a real authentication context.
  const isAuthenticated = true; 

  // If not authenticated, you would typically redirect to a login page.
  // This logic is prepared but currently inactive.
  if (!isAuthenticated) {
    // return <Navigate to="/login" replace />;
  }

  // Render the protected routes if authenticated.
  return <>{children}</>;
};


/**
 * The root component of the application.
 * Sets up the theme provider, the global data provider, and the main router.
 */
function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <Layout>
            <ProtectedRoute>
              <Routes>
                {/* Set VisaoGeral as the default home page */}
                <Route path="/" element={<VisaoGeral />} />
                <Route path="/empresas" element={<EmpresasMonitoradas />} />
                <Route path="/funcionarios/:id" element={<FuncionarioDetalhe />} />
                <Route path="/alertas" element={<CentralAlertas />} />
                <Route path="/painel-analitico" element={<PainelAnalitico />} />
                <Route path="/auditoria" element={<RegistroAtividades />} />
                <Route path="/gestao/empresas" element={<GestaoEmpresas />} />
                <Route path="/integracoes" element={<Integracoes />} />
                <Route path="/onboarding" element={<Onboarding />} />
                {/* Redirect any unknown path to the home page */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ProtectedRoute>
          </Layout>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;