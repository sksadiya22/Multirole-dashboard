import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { state } = useAuth();

  // Check if user is authenticated
  if (!state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md mx-auto text-center">
          <h2>Access Denied</h2>
          <p className="mt-4">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (requiredRole && state.user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md mx-auto text-center">
          <h2>Access Denied</h2>
          <p className="mt-4">
            You don't have permission to access this page. 
            Required role: <strong>{requiredRole}</strong>
          </p>
          <p className="mt-2">Your role: <strong>{state.user.role}</strong></p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;