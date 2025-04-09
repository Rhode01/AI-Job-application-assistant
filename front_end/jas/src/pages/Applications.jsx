import { useState } from 'react';
import {  Card,  Table,  Tag,  Space,  Button,  Input,
  Row,  Col,  Dropdown,  Select,  Modal,  Form,  DatePicker,
  message} from 'antd';
import {  SearchOutlined,    PlusOutlined,  EditOutlined,  DeleteOutlined,
  EyeOutlined,  DownOutlined,  FileTextOutlined,  ClockCircleOutlined,
  CheckCircleOutlined,  CloseCircleOutlined,  BarChartOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';


const Applications = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    sortBy: 'dateDesc'
  });

  const [applications, setApplications] = useState([
    {
      key: '1',
      company: 'TechCorp',
      position: 'Frontend Developer',
      dateApplied: '2025-04-05',
      status: 'Applied',
      location: 'Remote',
      salary: '$90,000 - $110,000',
      contact: 'recruiter@techcorp.com',
      notes: 'Applied via company website',
      priority: 'High'
    },
    {
      key: '2',
      company: 'Data Systems Inc',
      position: 'React Developer',
      dateApplied: '2025-04-03',
      status: 'Interview',
      location: 'New York, NY',
      salary: '$100,000 - $130,000',
      contact: 'hr@datasystems.com',
      notes: 'First interview scheduled for Apr 10',
      priority: 'High'
    }
  ]);

  const showModal = (application = null, edit = false) => {
    setIsEditMode(edit);
    setCurrentApplication(application);
    setIsModalVisible(true);

    if (application && edit) {
      form.setFieldsValue({
        ...application,
        dateApplied: application.dateApplied ? new Date(application.dateApplied) : null
      });
    } else {
      form.resetFields();
    }
  };

 
  const handleDelete = (key) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this application?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        const updatedApplications = applications.filter(app => app.key !== key);
        setApplications(updatedApplications);
        message.success('Application deleted successfully');
      }
    });
  };

  const handleStatusChange = (key, newStatus) => {
    const updatedApplications = applications.map(app =>
      app.key === key ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);
    message.success(`Status updated to ${newStatus}`);
  };

  const filteredApplications = applications.filter(app => {
    const searchFilter = searchText.toLowerCase() === '' ||
      app.company.toLowerCase().includes(searchText.toLowerCase()) ||
      app.position.toLowerCase().includes(searchText.toLowerCase()) ||
      app.location.toLowerCase().includes(searchText.toLowerCase());

    const statusFilter = filters.status.length === 0 ||
      filters.status.includes(app.status);

    return searchFilter && statusFilter;
  }).sort((a, b) => {
    if (filters.sortBy === 'dateDesc') {
      return new Date(b.dateApplied) - new Date(a.dateApplied);
    } else if (filters.sortBy === 'dateAsc') {
      return new Date(a.dateApplied) - new Date(b.dateApplied);
    }
    else if (filters.sortBy === 'company') {
      return a.company.localeCompare(b.company);
    }

    return 0;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied':
        return <ClockCircleOutlined />;
      case 'Interview':
        return <BarChartOutlined />;
      case 'Offer':
        return <CheckCircleOutlined />;
      case 'Rejected':
        return <CloseCircleOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'blue';
      case 'Interview':
        return 'gold';
      case 'Offer':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'green';
      default:
        return 'blue';
    }
  };

  const statusOptions = [
    { label: 'Applied', value: 'Applied' },
    { label: 'Interview', value: 'Interview' },
    { label: 'Offer', value: 'Offer' },
    { label: 'Rejected', value: 'Rejected' }
  ];

  const columns = [
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text, record) => (
        <div className="flex items-center">
          <div className="font-semibold">{text}</div>
        </div>
      ),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Date Applied',
      dataIndex: 'dateApplied',
      key: 'dateApplied',
      responsive: ['md'],
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      responsive: ['lg'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Dropdown
          menu={{
            items: statusOptions.map(option => ({
              key: option.value,
              label: option.label,
              icon: getStatusIcon(option.value),
              onClick: () => handleStatusChange(record.key, option.value)
            })),
          }}
          trigger={['click']}
        >
          <Tag
            color={getStatusColor(status)}
            icon={getStatusIcon(status)}
            className="cursor-pointer hover:opacity-80"
          >
            {status} <DownOutlined className="ml-1 text-xs" />
          </Tag>
        </Dropdown>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      responsive: ['lg'],
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showModal(record, false)}
            className={isDark ? 'text-white' : ''}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record, true)}
            className={isDark ? 'text-white' : ''}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="applications-container">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Applications
        </h1>
        <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>
          Manage and track your job applications
        </p>
      </div>

      <Card className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}>
        <div className="mb-6">
          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} md={8}>
              <Input
                placeholder="Search companies, positions, locations..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={isDark ? 'bg-[#141414] border-gray-700 text-white' : ''}
              />
            </Col>
            <Col xs={24} md={6}>
              <Select
                mode="multiple"
                placeholder="Filter by status"
                onChange={(values) => setFilters({ ...filters, status: values })}
                style={{ width: '100%' }}
                options={statusOptions}
                className={isDark ? 'ant-select-dark' : ''}
              />
            </Col>
            <Col xs={12} md={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal(null, true)}
                style={{ width: '100%' }}
              >
                Add New
              </Button>
            </Col>
          </Row>

          <div className="text-sm mb-2">
            <span className={isDark ? 'text-gray-300' : 'text-gray-500'}>
              Showing {filteredApplications.length} of {applications.length} applications
            </span>
          </div>

          <Table
            columns={columns}
            dataSource={filteredApplications}
            pagination={{
              pageSize: 10,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
            className={isDark ? 'ant-table-dark' : ''}
            rowClassName={() => 'cursor-pointer'}
            onRow={(record) => ({
              onClick: () => showModal(record, false)
            })}
          />
        </div>
      </Card>
    </div>
  );
};

export default Applications;
