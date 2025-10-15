import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Sun, Moon, ActivitySquare } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { NAV_LINKS } from '../../constants';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    // Specific titles first for dynamic routes
    if (location.pathname.startsWith('/funcionarios/')) {
        return 'Detalhes do Funcionário';
    }
    
    // Then check nav links
    const currentLink = NAV_LINKS.find(link => {
      // Exact match for root
      if (link.href === '/') {
        return location.pathname === '/';
      }
      // For other links, check if the path starts with the link's href.
      return location.pathname.startsWith(link.href);
    });

    return currentLink ? currentLink.label : 'Dashboard'; // Fallback
  };

  return (
    <header className="h-20 bg-white dark:bg-gray-800 flex-shrink-0 flex items-center justify-between px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <Link to="/" className="lg:hidden">
          <ActivitySquare size={28} className="text-fit-dark-blue dark:text-white" />
        </Link>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">{getPageTitle()}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;