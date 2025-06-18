import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/signin" replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to home if not admin but admin access is required
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 