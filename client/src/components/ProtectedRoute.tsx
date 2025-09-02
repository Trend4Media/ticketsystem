import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredType: 'user' | 'support';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredType 
}) => {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user || !userType) {
    const redirectPath = requiredType === 'support' ? '/support/login' : '/login';
    return <Navigate to={redirectPath} replace />;
  }

  if (userType !== requiredType) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};