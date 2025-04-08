import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';

// Import pages (we'll create these next)
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';

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
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeConfigurator>
        <AppRoutes />
      </ThemeConfigurator>
    </ThemeProvider>
  );
}

export default App;
