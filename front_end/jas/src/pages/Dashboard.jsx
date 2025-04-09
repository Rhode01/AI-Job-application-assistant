import { useState } from 'react';
import {  Row,  Col,  Card,  Statistic,  Progress,
  Button,  Table,  Tag,  Space,  Segmented} from 'antd';
import {  FileDoneOutlined,  ClockCircleOutlined,  CheckCircleOutlined,
  CloseCircleOutlined,  BarChartOutlined,  LineChartOutlined,  PieChartOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('week');
  const isDark = theme === 'dark';

  const recentApplications = [
    {
      key: '1',
      company: 'TechCorp',
      position: 'Frontend Developer',
      date: '2025-04-05',
      status: 'Applied',
    }
  ];
  const upcomingEvents = [
    {
      key: '1',
      event: 'Technical Interview',
      company: 'Data Systems Inc',
      date: '2025-04-10 10:00 AM',
    }
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
      </Row>
    </div>
  );
};

export default Dashboard;
