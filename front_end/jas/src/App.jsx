import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { Auth0Provider } from '@auth0/auth0-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import DashboardLayout from './layouts/DashboardLayout';
import config from './config';

// Import pages
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile'; // Added UserProfile import

// Theme configurator for Ant Design
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
        {/* Public route for login */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes for authenticated users */}
        <Route path="/" element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }>
          <Route index element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<UserProfile />} /> {/* Added UserProfile route */}
        </Route>

        {/* Redirect all other routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Auth0Provider
      domain={config.auth0.domain}
      clientId={config.auth0.clientId}
      authorizationParams={{
        redirect_uri: config.auth0.redirectUri,
        scope: config.auth0.scope,
        ...(config.auth0.audience ? { audience: config.auth0.audience } : {})
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
