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

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <TicketIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">TicketSystem</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <UserIcon className="h-4 w-4" />
                  <span>{user.firstName} {user.lastName}</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                    {userType === 'support' ? 'Support' : 'Kunde'}
                  </span>
                </div>
                
                {userType === 'user' && (
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Meine Tickets
                  </Link>
                )}
                
                {userType === 'support' && (
                  <Link
                    to="/support/dashboard"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                  >
                    <CogIcon className="h-4 w-4" />
                    <span>Support Dashboard</span>
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Abmelden</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
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
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-xs"
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