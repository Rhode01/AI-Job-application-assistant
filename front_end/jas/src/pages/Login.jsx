import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Button,  Card,  Divider,  Typography,  Space,  Row,  Col} from 'antd';
import {  LockOutlined,  UserOutlined,  GoogleOutlined,  GithubOutlined,
  LinkedinOutlined} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';

const { Title, Text, Paragraph } = Typography;

const Login = () => {
  const {isAuthenticated, isLoading, login,logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = () => {
    login();
  };
  const handlelogout = () => {
    logout();
  };

  const bgStyles = isDark
    ? 'bg-gray-900'
    : 'bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-100';

  if (isLoading) {
    return <LoadingSpinner fullScreen tip="Loading..." />;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${bgStyles}`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold mb-2 text-blue-600">
            <LockOutlined className="mr-2" />
            JobAssist
          </div>
          <Text className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Your personal job application assistant
          </Text>
        </div>

        <Card
          className={`w-full shadow-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : ''}`}
          bordered={!isDark}
        >
          <div className="text-center mb-6">
            <Title level={3} className={isDark ? 'text-white' : ''}>
              Sign In
            </Title>
            <Paragraph className={isDark ? 'text-gray-300' : 'text-gray-500'}>
              Please sign in to access your dashboard
            </Paragraph>
          </div>

          <Space direction="vertical" className="w-full">
            <Button
              type="primary"
              size="large"
              block
              icon={<UserOutlined />}
              onClick={handleLogin}
            >
              Sign in / Sign up
            </Button>

            <Divider plain>
              <Text className={isDark ? 'text-gray-400' : 'text-gray-400'}>
                Or continue with
              </Text>
            </Divider>

            <Row gutter={16}>
              <Col span={8}>
                <Button
                  block
                  icon={<GoogleOutlined />}
                  onClick={handleLogin}
                  className="flex items-center justify-center"
                >
                  Google
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  block
                  icon={<GithubOutlined />}
                  onClick={handleLogin}
                  className="flex items-center justify-center"
                >
                  GitHub
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  block
                  icon={<LinkedinOutlined />}
                  onClick={handleLogin}
                  className="flex items-center justify-center"
                >
                  LinkedIn
                </Button>
              </Col>
            </Row>
          </Space>

          <div className="mt-6 text-center">
            <Text className={isDark ? 'text-gray-300' : 'text-gray-500'}>
              By signing in, you agree to our{' '}
              <a href="#terms" className="text-blue-500">Terms of Service</a>{' '}
              and{' '}
              <a href="#privacy" className="text-blue-500">Privacy Policy</a>
            </Text>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            &copy; {new Date().getFullYear()} JobAssist. All rights reserved.
          </Text>
          <Button onClick={handlelogout} >Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
