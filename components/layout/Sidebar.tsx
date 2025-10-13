import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import { Settings, LifeBuoy, MessageSquarePlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import FeedbackModal from '../ui/FeedbackModal';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const visibleLinks = NAV_LINKS.filter(
    (link) => user && link.roles.includes(user.papel)
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="h-20 flex items-center px-6">
          <h1 className="text-2xl font-bold text-fit-dark-blue dark:text-white">FitBusiness</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              end={link.href === '/' || link.href === '/meu-painel'}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-fit-dark-blue text-white shadow-sm'
                    : 'text-fit-gray hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-fit-gray hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <MessageSquarePlus size={20} className="mr-3" />
            Dar Feedback
          </button>
          <a href="#" className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-fit-gray hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
              <Settings size={20} className="mr-3" />
              Configurações
          </a>
           <a href="#" className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-fit-gray hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
              <LifeBuoy size={20} className="mr-3" />
              Suporte
          </a>
        </div>
      </aside>
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
