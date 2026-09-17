import React from 'react';
import { Navigate } from 'react-router-dom';
import { validateAdminSession } from '@/lib/admin-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAdminAuthenticated = validateAdminSession();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
