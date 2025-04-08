import { useState } from 'react';
import {  Card,  Tabs,  Form,  Input,  Button,  Switch,  Select,  Divider,
  Row,  Col,  message,  Upload,  Avatar,  Radio,  Tag,  Tooltip,  List,  Empty,
  Typography  } from 'antd';
import {  UserOutlined,  MailOutlined,  PhoneOutlined,  HomeOutlined,  BellOutlined,
  KeyOutlined,  CloudUploadOutlined,  DeleteOutlined,  PlusOutlined,  QuestionCircleOutlined,
  GlobalOutlined,  TeamOutlined} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';
const { TabPane } = Tabs;
const { Option } = Select;
const { Text } = Typography;

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [profileForm] = Form.useForm();
  const [resumeForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [userSettings, setUserSettings] = useState({
    profile: {
      name: 'Rhode01',
      email: 'Rhode01@example.com',
      phone: '(+265) 123-4567',
      location: 'Lilongwe',
      about: 'Frontend Developer with 3 years of experience in React and UI/UX design.',
      avatar: null
    },
    preferences: {
      darkMode: theme === 'dark',
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: true,
      defaultView: 'dashboard'
    },
    resumes: [
      {
        id: '1',
        name: 'Frontend Developer Resume',
        lastUpdated: '2025-03-25',
        tags: ['Frontend', 'React', 'UI/UX'],
        isDefault: true
      },
      {
        id: '2',
        name: 'Full Stack Developer Resume',
        lastUpdated: '2025-03-10',
        tags: ['Full Stack', 'Node.js', 'MongoDB'],
        isDefault: false
      }
    ],
    skills: [
      { id: '1', name: 'React.js', level: 'Expert' },
      { id: '2', name: 'JavaScript', level: 'Expert' },
      { id: '3', name: 'HTML/CSS', level: 'Expert' },
      { id: '4', name: 'Node.js', level: 'Intermediate' },
      { id: '5', name: 'TypeScript', level: 'Intermediate' },
      { id: '6', name: 'UI/UX Design', level: 'Intermediate' },
      { id: '7', name: 'MongoDB', level: 'Beginner' },
    ]
  });
  const [fileList, setFileList] = useState([]);

  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });
  const [showSkillInput, setShowSkillInput] = useState(false);

  const handleProfileSubmit = (values) => {
    setUserSettings({
      ...userSettings,
      profile: { ...userSettings.profile, ...values }
    });
    message.success('Profile updated successfully');
  };

  const handlePasswordSubmit = (values) => {
    // In a real app, this would call an API to update the password
    console.log('Password update values:', values);
    passwordForm.resetFields();
    message.success('Password updated successfully');
  };

  const handlePreferenceChange = (key, value) => {
    setUserSettings({
      ...userSettings,
      preferences: { ...userSettings.preferences, [key]: value }
    });

    // Special handling for dark mode
    if (key === 'darkMode') {
      toggleTheme();
    }

    message.success('Preference updated');
  };

  const handleDeleteResume = (id) => {
    const updatedResumes = userSettings.resumes.filter(resume => resume.id !== id);
    setUserSettings({ ...userSettings, resumes: updatedResumes });
    message.success('Resume deleted successfully');
  };

  const handleSetDefaultResume = (id) => {
    const updatedResumes = userSettings.resumes.map(resume => ({
      ...resume,
      isDefault: resume.id === id
    }));
    setUserSettings({ ...userSettings, resumes: updatedResumes });
    message.success('Default resume updated');
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim() === '') {
      message.error('Skill name cannot be empty');
      return;
    }

    const skillId = (Math.max(...userSettings.skills.map(skill => parseInt(skill.id))) + 1).toString();

    setUserSettings({
      ...userSettings,
      skills: [...userSettings.skills, { id: skillId, ...newSkill }]
    });

    setNewSkill({ name: '', level: 'Beginner' });
    setShowSkillInput(false);
    message.success('Skill added successfully');
  };

  const handleDeleteSkill = (id) => {
    const updatedSkills = userSettings.skills.filter(skill => skill.id !== id);
    setUserSettings({ ...userSettings, skills: updatedSkills });
    message.success('Skill removed');
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'blue';
      case 'Intermediate':
        return 'purple';
      case 'Expert':
        return 'green';
      default:
        return 'default';
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
    listType: 'text',
    maxCount: 1,
    accept: '.pdf,.doc,.docx'
  };

  const handleResumeSubmit = (values) => {
    if (fileList.length === 0) {
      message.error('Please upload a resume file');
      return;
    }

    const newResumeId = (Math.max(...userSettings.resumes.map(resume => parseInt(resume.id))) + 1).toString();
    const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];

    const newResume = {
      id: newResumeId,
      name: values.name,
      lastUpdated: new Date().toISOString().split('T')[0],
      tags: tags,
      isDefault: userSettings.resumes.length === 0 // Make default if it's the first resume
    };

    setUserSettings({
      ...userSettings,
      resumes: [...userSettings.resumes, newResume]
    });

    setFileList([]);
    resumeForm.resetFields();
    message.success('Resume uploaded successfully');
  };

  return (
    <div className="settings-container">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Settings
        </h1>
        <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>
          Manage your account and preferences
        </p>
      </div>

      <Card className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}>
        <Tabs defaultActiveKey="profile" className={isDark ? 'text-white' : ''}>
          {/* Profile Settings */}
          <TabPane
            tab={<span><UserOutlined /> Profile</span>}
            key="profile"
          >
            <div className="max-w-3xl">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  src={userSettings.profile.avatar}
                  className={isDark ? 'bg-blue-700' : 'bg-blue-500'}
                />
                <div className="flex-1">
                  <h2 className={`text-xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>{userSettings.profile.name}</h2>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>{userSettings.profile.about}</p>
                  <div className="mt-2">
                    <Upload
                      name="avatar"
                      showUploadList={false}
                      beforeUpload={() => false}
                      onChange={(info) => {
                        if (info.file) {
                          // In a real app, this would upload the file to a server
                          // and get back a URL to store in the user profile
                          message.success('Avatar uploaded successfully');
                        }
                      }}
                    >
                      <Button icon={<CloudUploadOutlined />} size="small">
                        Change Avatar
                      </Button>
                    </Upload>
                  </div>
                </div>
              </div>

              <Form
                form={profileForm}
                layout="vertical"
                initialValues={userSettings.profile}
                onFinish={handleProfileSubmit}
              >
                <Row gutter={16}>
                  <Col span={24} md={12}>
                    <Form.Item
                      name="name"
                      label="Full Name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input prefix={<UserOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' }
                      ]}
                    >
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                    >
                      <Input prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={24} md={12}>
                    <Form.Item
                      name="location"
                      label="Location"
                    >
                      <Input prefix={<HomeOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="about"
                  label="About"
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save Profile
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </TabPane>

          {/* Resume and Skills */}
          <TabPane
            tab={<span><FileOutlined /> Resumes & Skills</span>}
            key="resume"
          >
            <Row gutter={[24, 24]}>
              {/* Resumes Section */}
              <Col span={24} lg={12}>
                <div className={`p-5 rounded-lg mb-6 ${isDark ? 'bg-[#141414]' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      My Resumes
                    </h3>
                    <Tooltip title="Upload different versions of your resume for different types of jobs">
                      <QuestionCircleOutlined className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    </Tooltip>
                  </div>

                  {userSettings.resumes.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {userSettings.resumes.map(resume => (
                        <div
                          key={resume.id}
                          className={`p-4 rounded-lg ${isDark ? 'bg-[#1f1f1f]' : 'bg-white'} ${resume.isDefault ? isDark ? 'border border-blue-600' : 'border border-blue-500' : ''}`}
                        >
                          <div className="flex justify-between">
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium">{resume.name}</span>
                                {resume.isDefault && (
                                  <Tag color="blue" className="ml-2">Default</Tag>
                                )}
                              </div>
                              <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Last Updated: {resume.lastUpdated}
                              </div>
                              <div className="mt-2">
                                {resume.tags.map((tag, idx) => (
                                  <Tag key={idx} className="mr-1 mb-1">{tag}</Tag>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-start">
                              {!resume.isDefault && (
                                <Button
                                  type="text"
                                  size="small"
                                  className="text-blue-500"
                                  onClick={() => handleSetDefaultResume(resume.id)}
                                >
                                  Set as Default
                                </Button>
                              )}
                              <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                                onClick={() => handleDeleteResume(resume.id)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty
                      description="No resumes uploaded yet"
                      className="my-8"
                    />
                  )}

                  <Divider>Upload New Resume</Divider>

                  <Form
                    form={resumeForm}
                    layout="vertical"
                    onFinish={handleResumeSubmit}
                  >
                    <Form.Item
                      name="name"
                      label="Resume Name"
                      rules={[{ required: true, message: 'Please name your resume' }]}
                    >
                      <Input placeholder="e.g., Software Developer Resume" />
                    </Form.Item>
                    <Form.Item
                      name="tags"
                      label="Tags (comma separated)"
                    >
                      <Input placeholder="e.g., Frontend, React, JavaScript" />
                    </Form.Item>
                    <Form.Item
                      label="Resume File"
                      required
                    >
                      <Upload {...uploadProps}>
                        <Button icon={<CloudUploadOutlined />}>
                          Select File
                        </Button>
                      </Upload>
                      <Text className="block mt-1 text-xs" type="secondary">
                        Supported formats: PDF, DOC, DOCX (max 5MB)
                      </Text>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Upload Resume
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </Col>

              {/* Skills Section */}
              <Col span={24} lg={12}>
                <div className={`p-5 rounded-lg ${isDark ? 'bg-[#141414]' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Skills
                    </h3>
                    <Tooltip title="Add skills to highlight on your profile and resumes">
                      <QuestionCircleOutlined className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    </Tooltip>
                  </div>

                  <div className="mb-4">
                    {userSettings.skills.map(skill => (
                      <Tag
                        key={skill.id}
                        color={getSkillLevelColor(skill.level)}
                        className="mr-2 mb-2 py-1 px-2"
                        closable
                        onClose={() => handleDeleteSkill(skill.id)}
                      >
                        {skill.name} [{skill.level}]
                      </Tag>
                    ))}

                    {showSkillInput ? (
                      <div className="mt-3 flex items-end gap-2">
                        <Form.Item
                          className="mb-0 flex-1"
                          label="Skill Name"
                          required
                        >
                          <Input
                            value={newSkill.name}
                            onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                            placeholder="e.g., React, JavaScript, UI/UX"
                          />
                        </Form.Item>
                        <Form.Item
                          className="mb-0"
                          label="Level"
                        >
                          <Select
                            value={newSkill.level}
                            onChange={(value) => setNewSkill({...newSkill, level: value})}
                            style={{ width: 130 }}
                          >
                            <Option value="Beginner">Beginner</Option>
                            <Option value="Intermediate">Intermediate</Option>
                            <Option value="Expert">Expert</Option>
                          </Select>
                        </Form.Item>
                        <Button
                          type="primary"
                          onClick={handleAddSkill}
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => setShowSkillInput(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => setShowSkillInput(true)}
                        className="mt-2"
                      >
                        Add Skill
                      </Button>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </TabPane>

          {/* Preferences */}
          <TabPane
            tab={<span><BellOutlined /> Preferences</span>}
            key="preferences"
          >
            <div className="max-w-2xl">
              <List
                className={`${isDark ? 'bg-[#141414] text-white' : 'bg-gray-50'} rounded-lg p-4`}
                itemLayout="horizontal"
                dataSource={[
                  {
                    key: 'darkMode',
                    title: 'Dark Mode',
                    description: 'Switch between light and dark theme',
                    icon: <GlobalOutlined />,
                    value: userSettings.preferences.darkMode,
                  },
                  {
                    key: 'emailNotifications',
                    title: 'Email Notifications',
                    description: 'Receive notifications about application status changes',
                    icon: <MailOutlined />,
                    value: userSettings.preferences.emailNotifications,
                  },
                  {
                    key: 'pushNotifications',
                    title: 'Push Notifications',
                    description: 'Receive browser notifications for upcoming events',
                    icon: <BellOutlined />,
                    value: userSettings.preferences.pushNotifications,
                  },
                  {
                    key: 'weeklyDigest',
                    title: 'Weekly Digest',
                    description: 'Receive a weekly summary of your job application activities',
                    icon: <MailOutlined />,
                    value: userSettings.preferences.weeklyDigest,
                  },
                ]}
                renderItem={(item) => (
                  <List.Item
                    className={`p-4 rounded-lg mb-2 ${isDark ? 'hover:bg-[#1f1f1f]' : 'hover:bg-gray-100'}`}
                    actions={[
                      <Switch
                        checked={item.value}
                        onChange={(checked) => handlePreferenceChange(item.key, checked)}
                      />
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={item.icon} className={isDark ? 'bg-blue-700' : 'bg-blue-500'} />}
                      title={<span className="font-medium">{item.title}</span>}
                      description={<span className={isDark ? 'text-gray-400' : ''}>{item.description}</span>}
                    />
                  </List.Item>
                )}
              />

              <Divider />

              <div className={`${isDark ? 'bg-[#141414] text-white' : 'bg-gray-50'} rounded-lg p-4`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Default View
                </h3>
                <Radio.Group
                  value={userSettings.preferences.defaultView}
                  onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                  className="mb-4"
                >
                  <Space direction="vertical">
                    <Radio value="dashboard">Dashboard</Radio>
                    <Radio value="applications">Applications</Radio>
                    <Radio value="schedule">Schedule</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </TabPane>

          {/* Security */}
          <TabPane
            tab={<span><KeyOutlined /> Security</span>}
            key="security"
          >
            <div className="max-w-md">
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Change Password
              </h3>
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handlePasswordSubmit}
              >
                <Form.Item
                  name="currentPassword"
                  label="Current Password"
                  rules={[{ required: true, message: 'Please enter your current password' }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[
                    { required: true, message: 'Please enter your new password' },
                    { min: 8, message: 'Password must be at least 8 characters' }
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm New Password"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: 'Please confirm your new password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords do not match'));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Update Password
                  </Button>
                </Form.Item>
              </Form>

              <Divider />

              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Privacy Settings
              </h3>
              <List
                className={`${isDark ? 'bg-[#141414] text-white' : 'bg-gray-50'} rounded-lg p-4`}
                itemLayout="horizontal"
                dataSource={[
                  {
                    key: 'dataSharing',
                    title: 'Data Sharing',
                    description: 'Allow anonymous usage data to improve the service',
                    value: true,
                  },
                  {
                    key: 'profileVisibility',
                    title: 'Profile Visibility',
                    description: 'Allow your profile to be visible to potential employers',
                    value: false,
                  },
                ]}
                renderItem={(item) => (
                  <List.Item
                    className={`p-4 rounded-lg mb-2 ${isDark ? 'hover:bg-[#1f1f1f]' : 'hover:bg-gray-100'}`}
                    actions={[
                      <Switch
                        checked={item.value}
                        onChange={() => {
                          // In a real app this would update the state
                          message.success(`${item.title} setting updated`);
                        }}
                      />
                    ]}
                  >
                    <List.Item.Meta
                      title={<span className="font-medium">{item.title}</span>}
                      description={<span className={isDark ? 'text-gray-400' : ''}>{item.description}</span>}
                    />
                  </List.Item>
                )}
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

const FileOutlined = () => (
  <svg
    viewBox="64 64 896 896"
    focusable="false"
    data-icon="file"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M534 352V136H232v752h560V394H576a42 42 0 01-42-42z"></path>
    <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM602 137.8L790.2 326H602V137.8zM792 888H232V136h302v216a42 42 0 0042 42h216v494z"></path>
  </svg>
);

export default Settings;
