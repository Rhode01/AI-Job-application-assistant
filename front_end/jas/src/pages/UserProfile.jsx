import { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Divider,
  Descriptions,
  Button,
  Tag,
  Tabs,
  Form,
  Input,
  message,
  Row,
  Col,
  Alert
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  IdcardOutlined,
  GithubOutlined,
  GoogleOutlined,
  LinkedinOutlined,
  SaveOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const UserProfile = () => {
  const { user, isLoading, token } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [profileForm] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        name: user.name,
        nickname: user.nickname,
        email: user.email
      });
    }
  }, [user, profileForm]);

  const handleProfileSubmit = (values) => {
    // In a real app, we would make an API call to Auth0 Management API
    // to update the user's profile
    console.log('Updating profile:', values);
    message.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'github':
        return <GithubOutlined />;
      case 'google-oauth2':
        return <GoogleOutlined />;
      case 'linkedin':
        return <LinkedinOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  const getProviderName = (provider) => {
    switch (provider) {
      case 'github':
        return 'GitHub';
      case 'google-oauth2':
        return 'Google';
      case 'linkedin':
        return 'LinkedIn';
      default:
        return provider;
    }
  };

  if (isLoading || !user) {
    return <LoadingSpinner fullScreen tip="Loading user profile..." />;
  }

  return (
    <div className="user-profile-container max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          User Profile
        </h1>
        <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>
          Manage your account information and profile settings
        </p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}>
            <div className="flex flex-col items-center">
              <Avatar
                size={100}
                src={user.picture}
                icon={!user.picture && <UserOutlined />}
                alt={user.name || user.email}
                className={`${isDark ? 'bg-blue-700' : 'bg-blue-500'} mb-4`}
              />
              <Title level={4} className={isDark ? 'text-white' : ''}>
                {user.name || user.nickname || user.email}
              </Title>
              {user.email && (
                <Text type="secondary" className={isDark ? 'text-gray-300' : ''}>
                  <MailOutlined className="mr-1" /> {user.email}
                </Text>
              )}

              <Divider />

              <div className="w-full">
                <Paragraph className={`font-medium mb-2 ${isDark ? 'text-white' : ''}`}>
                  <LockOutlined className="mr-2" /> Identity Providers
                </Paragraph>
                {user.sub ? (
                  <div>
                    <Tag
                      icon={getProviderIcon(user.sub.split('|')[0])}
                      color="blue"
                      className="mb-2"
                    >
                      {getProviderName(user.sub.split('|')[0])}
                    </Tag>
                  </div>
                ) : (
                  <Text type="secondary">No provider information available</Text>
                )}
              </div>

              <Divider />

              <div className="w-full">
                <Paragraph className={`font-medium mb-2 ${isDark ? 'text-white' : ''}`}>
                  <IdcardOutlined className="mr-2" /> User ID
                </Paragraph>
                <Text code copyable className="break-all">
                  {user.sub}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}>
            <Tabs defaultActiveKey="profile">
              <TabPane tab="Profile Details" key="profile">
                <div className="mb-4 flex justify-between items-center">
                  <Title level={4} className={isDark ? 'text-white' : ''}>
                    Profile Information
                  </Title>
                  <Button
                    type={isEditing ? 'primary' : 'default'}
                    icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                    onClick={() => {
                      if (isEditing) {
                        profileForm.submit();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>

                {!isEditing ? (
                  <Descriptions bordered column={1} className={isDark ? 'description-dark' : ''}>
                    <Descriptions.Item label="Name">{user.name || 'Not provided'}</Descriptions.Item>
                    <Descriptions.Item label="Nickname">{user.nickname || 'Not provided'}</Descriptions.Item>
                    <Descriptions.Item label="Email">{user.email || 'Not provided'}</Descriptions.Item>
                    <Descriptions.Item label="Email Verified">
                      {user.email_verified ? (
                        <Tag color="success">Verified</Tag>
                      ) : (
                        <Tag color="error">Not Verified</Tag>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Last Updated">
                      {user.updated_at ? new Date(user.updated_at).toLocaleString() : 'Unknown'}
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={handleProfileSubmit}
                  >
                    <Form.Item
                      name="name"
                      label="Name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="nickname"
                      label="Nickname"
                    >
                      <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="Email"
                    >
                      <Input
                        prefix={<MailOutlined />}
                        disabled
                        tooltip="Email cannot be changed directly"
                      />
                    </Form.Item>

                    {!user.email_verified && (
                      <Alert
                        type="warning"
                        message="Your email is not verified"
                        description="Please check your inbox for a verification email or request a new one."
                        className="mb-4"
                      />
                    )}

                    <Form.Item>
                      <Button
                        type="default"
                        onClick={() => {
                          setIsEditing(false);
                          profileForm.resetFields();
                        }}
                        className="mr-2"
                      >
                        Cancel
                      </Button>
                      <Button type="primary" htmlType="submit">
                        Save Changes
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </TabPane>

              <TabPane tab="Security" key="security">
                <div className="mb-4">
                  <Title level={4} className={isDark ? 'text-white' : ''}>
                    Security Settings
                  </Title>

                  <Alert
                    type="info"
                    message="Password Management"
                    description="Password management is handled by your identity provider. To change your password, please visit your provider's website."
                    className="mb-4"
                  />

                  <Divider />

                  <Title level={5} className={isDark ? 'text-white' : ''}>
                    Multi-Factor Authentication
                  </Title>
                  <Paragraph className={isDark ? 'text-gray-300' : 'text-gray-500'}>
                    Enhance your account security by enabling multi-factor authentication.
                  </Paragraph>
                  <Button type="primary">
                    Set Up MFA
                  </Button>
                </div>
              </TabPane>

              <TabPane tab="Connected Accounts" key="connected">
                <div className="mb-4">
                  <Title level={4} className={isDark ? 'text-white' : ''}>
                    Connected Accounts
                  </Title>

                  <Paragraph className={isDark ? 'text-gray-300' : 'text-gray-500'}>
                    Manage third-party accounts connected to your profile.
                  </Paragraph>

                  <div className="flex flex-col gap-4 mt-6">
                    <Card className={isDark ? 'bg-[#141414]' : 'bg-gray-50'}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Avatar icon={<GoogleOutlined />} className="bg-red-500 mr-4" />
                          <div>
                            <Text strong className={isDark ? 'text-white' : ''}>Google</Text>
                            <div>
                              {user.sub?.startsWith('google-oauth2') ? (
                                <Tag color="success">Connected</Tag>
                              ) : (
                                <Tag color="default">Not Connected</Tag>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button type={user.sub?.startsWith('google-oauth2') ? 'default' : 'primary'}>
                          {user.sub?.startsWith('google-oauth2') ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    </Card>

                    <Card className={isDark ? 'bg-[#141414]' : 'bg-gray-50'}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Avatar icon={<GithubOutlined />} className="bg-gray-800 mr-4" />
                          <div>
                            <Text strong className={isDark ? 'text-white' : ''}>GitHub</Text>
                            <div>
                              {user.sub?.startsWith('github') ? (
                                <Tag color="success">Connected</Tag>
                              ) : (
                                <Tag color="default">Not Connected</Tag>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button type={user.sub?.startsWith('github') ? 'default' : 'primary'}>
                          {user.sub?.startsWith('github') ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    </Card>

                    <Card className={isDark ? 'bg-[#141414]' : 'bg-gray-50'}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Avatar icon={<LinkedinOutlined />} className="bg-blue-600 mr-4" />
                          <div>
                            <Text strong className={isDark ? 'text-white' : ''}>LinkedIn</Text>
                            <div>
                              {user.sub?.startsWith('linkedin') ? (
                                <Tag color="success">Connected</Tag>
                              ) : (
                                <Tag color="default">Not Connected</Tag>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button type={user.sub?.startsWith('linkedin') ? 'default' : 'primary'}>
                          {user.sub?.startsWith('linkedin') ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
