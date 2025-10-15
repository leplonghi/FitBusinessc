import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';

const BottomNav: React.FC = () => {
  const MAX_LINKS = 5;
  const visibleLinks = NAV_LINKS.slice(0, MAX_LINKS);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around py-2">
      {visibleLinks.map((link) => (
        <NavLink
          key={link.label}
          to={link.href}
          end={link.href === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full text-xs transition-colors ${
              isActive ? 'text-fit-dark-blue dark:text-fit-orange' : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          {link.icon}
          <span className="mt-1 text-center">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;