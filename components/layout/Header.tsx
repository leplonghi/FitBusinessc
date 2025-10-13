import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User, ActivitySquare } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { NAV_LINKS } from '../../constants';
import { authService } from '../../services/authService';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getPageTitle = () => {
    if (location.pathname === '/perfil') {
      return 'Meu Perfil';
    }
    const currentLink = NAV_LINKS.find(link => {
      if (link.href !== '/' && location.pathname.startsWith(link.href)) {
        return true;
      }
      return link.href === location.pathname;
    });
    return currentLink ? currentLink.label : 'Dashboard';
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await authService.signOut();
    navigate('/login');
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
          className="p-2 rounded-full text-fit-gray hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
            <img src={user?.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full" />
            <div className="text-left hidden md:block">
              <p className="font-semibold text-sm">{user?.nome}</p>
              <p className="text-xs text-fit-gray">{user?.papel}</p>
            </div>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border dark:border-gray-700">
              <Link 
                to="/perfil" 
                onClick={() => setDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User size={16} className="mr-2" /> Perfil
              </Link>
              <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                <LogOut size={16} className="mr-2" /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
