import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const location = useLocation();
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

  return children;
};

export default AuthGuard;
