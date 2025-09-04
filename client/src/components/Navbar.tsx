import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserIcon, 
  CogIcon, 
  ArrowRightOnRectangleIcon,
  TicketIcon
} from '@heroicons/react/24/outline';

export const Navbar: React.FC = () => {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTheme = () => {
    // Use global Theme manager if present
    if (typeof (window as any).Theme?.toggle === 'function') {
      (window as any).Theme.toggle();
      return;
    }
    // Fallback: toggle class on html
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
      try { localStorage.setItem('theme', 'light'); } catch (_) {}
    } else {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('theme', 'dark'); } catch (_) {}
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-900 dark:border-slate-800 shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <TicketIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-slate-100">TicketSystem</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300" title="Theme umschalten" aria-label="Theme umschalten">🌗</button>
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <UserIcon className="h-4 w-4" />
                  <span className="dark:text-gray-200">{user.firstName} {user.lastName}</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                    {userType === 'support' ? 'Support' : 'Kunde'}
                  </span>
                </div>
                
                {userType === 'user' && (
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-primary-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Meine Tickets
                  </Link>
                )}
                
                {userType === 'support' && (
                  <Link
                    to="/support/dashboard"
                    className="text-gray-700 hover:text-primary-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                  >
                    <CogIcon className="h-4 w-4" />
                    <span>Support Dashboard</span>
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Abmelden</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Anmelden
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Registrieren
                </Link>
                <Link
                  to="/support/login"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 px-3 py-2 rounded-md text-xs"
                >
                  Support-Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};