/**
 * ProtectedRoute Component
 * Guards admin routes - requires authentication and admin role
 * Frontend authorization gate (server-side enforcement in Phase 1)
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStudioStore } from '../store.ts';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'client';
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole = 'admin',
  children,
}) => {
  const { auth } = useStudioStore();
  const location = useLocation();

  // Not authenticated
  if (!auth.isAuthenticated) {
    console.warn('ProtectedRoute: User not authenticated, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Wrong role
  if (requiredRole === 'admin' && auth.role !== 'admin') {
    console.warn('ProtectedRoute: User is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole === 'client' && auth.role !== 'client') {
    console.warn('ProtectedRoute: User is not client, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
