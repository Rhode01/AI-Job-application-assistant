import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      
      navigate("/login")
    }
  }, [isAuthenticated, isLoading, login, location.pathname]);

  if (isLoading) {
    return <LoadingSpinner tip="Checking authentication..." fullScreen={true} />;
  }

  return children;
};

export default AuthGuard;
