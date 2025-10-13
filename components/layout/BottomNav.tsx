import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';

const BottomNav: React.FC = () => {
  const { user } = useAuth();

  // Define priority routes that should always try to be visible on mobile
  const PRIORITY_HREFS = ['/', '/meu-painel', '/empresas'];
  const MAX_LINKS = 5;

  // 1. Get all links visible to the current user
  const allVisibleLinks = NAV_LINKS.filter(
    (link) => user && link.roles.includes(user.papel)
  );

  // 2. Separate into priority and other links
  const priorityLinks = allVisibleLinks.filter(link => PRIORITY_HREFS.includes(link.href));
  const otherLinks = allVisibleLinks.filter(link => !PRIORITY_HREFS.includes(link.href));

  // 3. Combine them, ensuring priority links come first, then slice
  const visibleLinks = [...priorityLinks, ...otherLinks].slice(0, MAX_LINKS);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around py-2">
      {visibleLinks.map((link) => (
        <NavLink
          key={link.label}
          to={link.href}
          end={link.href === '/' || link.href === '/meu-painel'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full text-xs transition-colors ${
              isActive ? 'text-fit-dark-blue dark:text-fit-orange' : 'text-fit-gray'
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