import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { message } from 'antd';
import axios from "axios"
import api from '../api/api';
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const {
    isLoading,
    isAuthenticated,
    user,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        message.success(`Welcome${user?.name ? `, ${user.name}` : ''}!`);
      }
    }
  }, [isLoading, isAuthenticated, user]);

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
        } catch (error) {
          console.error('Error getting token:', error);
        }
      }
    };

    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);
  useEffect(() => {
    const registerUser = async () => {
      try {
        const existingUser = await axios.get(api.endpoints.GET_USER); 
        if (existingUser) return;
        await axios.post(api.endpoints.USERS,{
          id: user?.sub,
          email: user?.email,
          first_name: user?.given_name || user?.nickname,
          last_name: user?.family_name,
          auth0_metadata: user 
        });
      } catch (error) {
        console.error('Registration failed:', error);
      }
    };
  
    if (isAuthenticated && !isLoading) {
      registerUser();
    }
  }, [isAuthenticated, isLoading]);


  const logout = () => {
    auth0Logout({
      returnTo: window.location.origin
    });
    setToken(null);
    message.info('You have been logged out');
  };

  const contextValue = {
    isLoading,
    isAuthenticated,
    user,
    login: loginWithRedirect,
    logout,
    token
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
