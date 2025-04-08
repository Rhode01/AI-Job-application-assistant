import { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Button,
  Table,
  Tag,
  Space,
  Segmented
} from 'antd';
import {
  FileDoneOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('week');
  const isDark = theme === 'dark';

  // Mock data for recent applications
  const recentApplications = [
    {
      key: '1',
      company: 'TechCorp',
      position: 'Frontend Developer',
      date: '2025-04-05',
      status: 'Applied',
    },
    {
      key: '2',
      company: 'Data Systems Inc',
      position: 'React Developer',
      date: '2025-04-03',
      status: 'Interview',
    },
    {
      key: '3',
      company: 'Creative Solutions',
      position: 'UI/UX Designer',
      date: '2025-04-01',
      status: 'Offer',
    },
    {
      key: '4',
      company: 'Cloud Innovations',
      position: 'Full Stack Developer',
      date: '2025-03-28',
      status: 'Rejected',
    },
  ];

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      key: '1',
      event: 'Technical Interview',
      company: 'Data Systems Inc',
      date: '2025-04-10 10:00 AM',
    },
    {
      key: '2',
      event: 'HR Interview',
      company: 'Creative Solutions',
      date: '2025-04-15 2:30 PM',
    },
  ];

  // Table columns for recent applications
  const applicationsColumns = [
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Date Applied',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color;
        let icon;

        switch (status) {
          case 'Applied':
            color = 'blue';
            icon = <ClockCircleOutlined />;
            break;
          case 'Interview':
            color = 'gold';
            icon = <BarChartOutlined />;
            break;
          case 'Offer':
            color = 'green';
            icon = <CheckCircleOutlined />;
            break;
          case 'Rejected':
            color = 'red';
            icon = <CloseCircleOutlined />;
            break;
          default:
            color = 'default';
        }

        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button type="text" size="small">View</Button>
          <Button type="text" size="small">Edit</Button>
        </Space>
      ),
    },
  ];

  // Table columns for upcoming events
  const eventsColumns = [
    {
      title: 'Event',
      dataIndex: 'event',
      key: 'event',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button type="text" size="small">Details</Button>
          <Button type="text" size="small">Prepare</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Dashboard
        </h1>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
          Overview of your job application progress
        </p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card
            className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}
            hoverable
          >
            <Statistic
              title={<span className={isDark ? 'text-gray-300' : ''}>Total Applications</span>}
              value={24}
              prefix={<FileDoneOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}
            hoverable
          >
            <Statistic
              title={<span className={isDark ? 'text-gray-300' : ''}>Interviews</span>}
              value={8}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}
            hoverable
          >
            <Statistic
              title={<span className={isDark ? 'text-gray-300' : ''}>Offers</span>}
              value={2}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}
            hoverable
          >
            <Statistic
              title={<span className={isDark ? 'text-gray-300' : ''}>Rejections</span>}
              value={6}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress & Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card
            title="Application Progress"
            className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}
            extra={
              <Segmented
                options={[
                  { label: 'Week', value: 'week' },
                  { label: 'Month', value: 'month' },
                  { label: 'Year', value: 'year' },
                ]}
                value={timeRange}
                onChange={setTimeRange}
                size="small"
              />
            }
          >
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Response Rate</span>
                <span className="font-semibold">41.7%</span>
              </div>
              <Progress percent={41.7} status="active" />
            </div>

            <div className="mb-5">
              <div className="flex justify-between mb-2">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Interview Success</span>
                <span className="font-semibold">62.5%</span>
              </div>
              <Progress percent={62.5} status="active" strokeColor="#faad14" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Offer Rate</span>
                <span className="font-semibold">25%</span>
              </div>
              <Progress percent={25} status="active" strokeColor="#52c41a" />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Application Insights"
            className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Most Applied Role
                  </span>
                  <PieChartOutlined className="text-blue-500" />
                </div>
                <p className="text-lg font-semibold">Front-end Developer</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  8 Applications
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Best Response
                  </span>
                  <LineChartOutlined className="text-green-500" />
                </div>
                <p className="text-lg font-semibold">UI/UX Designer</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  67% Response Rate
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Avg. Response Time
                  </span>
                  <ClockCircleOutlined className="text-purple-500" />
                </div>
                <p className="text-lg font-semibold">5.3 Days</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  From application to first response
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Application Trend
                  </span>
                  <BarChartOutlined className="text-orange-500" />
                </div>
                <p className="text-lg font-semibold">Increasing</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  +15% from last month
                </p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Applications Table */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={24}>
          <Card
            title="Recent Applications"
            className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}
            extra={<Button type="primary" size="small">View All</Button>}
          >
            <Table
              columns={applicationsColumns}
              dataSource={recentApplications}
              pagination={false}
              size="small"
              className={isDark ? 'ant-table-dark' : ''}
            />
          </Card>
        </Col>
      </Row>

      {/* Upcoming Events Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Upcoming Events"
            className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}
            extra={<Button type="primary" size="small">View All</Button>}
          >
            <Table
              columns={eventsColumns}
              dataSource={upcomingEvents}
              pagination={false}
              size="small"
              className={isDark ? 'ant-table-dark' : ''}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
