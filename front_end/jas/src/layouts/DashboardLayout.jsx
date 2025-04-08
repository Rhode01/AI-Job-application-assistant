import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  theme as antTheme,
  Drawer
} from 'antd';
import {
  HomeOutlined,
  FileDoneOutlined,
  CalendarOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BellOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Header, Sider, Content } = Layout;

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { token } = antTheme.useToken();
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleCollapsed = () => {
    if (mobileView) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/applications',
      icon: <FileDoneOutlined />,
      label: <Link to="/applications">Applications</Link>,
    },
    {
      key: '/schedule',
      icon: <CalendarOutlined />,
      label: <Link to="/schedule">Schedule</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ];

  const sideMenu = (
    <Menu
      theme={theme}
      mode="inline"
      defaultSelectedKeys={['/']}
      selectedKeys={[location.pathname]}
      items={menuItems}
      className="h-full border-r-0"
    />
  );

  return (
    <Layout className={`min-h-screen ${theme === 'dark' ? 'bg-background-dark text-text-dark' : 'bg-background-light text-text-light'}`}>
      {/* Mobile Drawer for Small Screens */}
      {mobileView && (
        <Drawer
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          closable={false}
          bodyStyle={{ padding: 0 }}
          width={200}
        >
          <div className="p-4 flex justify-between items-center">
            <span className="text-lg font-bold">JobAssist</span>
          </div>
          {sideMenu}
        </Drawer>
      )}

      {/* Regular Sidebar for Desktop */}
      {!mobileView && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
          className={`h-screen fixed left-0 top-0 z-10 ${theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-white'}`}
        >
          <div className="p-4 flex justify-between items-center">
            {!collapsed && <span className="text-lg font-bold">JobAssist</span>}
          </div>
          {sideMenu}
        </Sider>
      )}

      <Layout className={`transition-all duration-300 ${!mobileView && !collapsed ? 'ml-[250px]' : !mobileView ? 'ml-[80px]' : 'ml-0'}`}>
        <Header className={`px-4 flex justify-between items-center sticky top-0 z-10 h-16 ${theme === 'dark' ? 'bg-[#1f1f1f] text-white' : 'bg-white text-black'} shadow`}>
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}
            />
            {mobileView && <span className="ml-2 text-lg font-bold">JobAssist</span>}
          </div>
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<SearchOutlined />}
              className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}
            />
            <Button
              type="text"
              icon={<BellOutlined />}
              className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}
            />
            <Button
              type="text"
              icon={theme === 'dark' ? '🌙' : '☀️'}
              onClick={toggleTheme}
              className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}
            />
            <Button
              type="text"
              icon={<UserOutlined />}
              className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}
            />
          </div>
        </Header>
        <Content className="p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout;
