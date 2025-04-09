import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { Auth0Provider } from '@auth0/auth0-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import DashboardLayout from './layouts/DashboardLayout';
import config from './config';

import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile'; 

import Callback from './components/CallBack';
function ThemeConfigurator({ children }) {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark'
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#f5222d',
          borderRadius: 6,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/" element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }>
          <Route index element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<UserProfile />} /> 
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_APP_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${config.auth0.redirectUri}/callback`
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <ThemeConfigurator>
            <AppRoutes />
          </ThemeConfigurator>
        </AuthProvider>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
