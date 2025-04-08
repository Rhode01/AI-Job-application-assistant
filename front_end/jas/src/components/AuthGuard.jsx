import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const location = useLocation();

  // Trigger login if not authenticated and not loading
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      login({
        appState: { returnTo: location.pathname }
      });
    }
  }, [isAuthenticated, isLoading, login, location.pathname]);

  if (isLoading) {
    return <LoadingSpinner tip="Checking authentication..." fullScreen />;
  }

  if (!isAuthenticated) {
    // This navigate won't execute in normal conditions because
    // login will be triggered in the useEffect, but it's a safety measure
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
