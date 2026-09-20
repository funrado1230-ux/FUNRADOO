import React from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';

export const ProtectedRoute = ({ children, fallback = null }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback;
  }

  return children;
};

export default ProtectedRoute;
