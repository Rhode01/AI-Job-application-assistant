import { useState } from 'react';
import {  Card,  Table,  Tag,  Space,  Button,  Input,
  Row,  Col,  Dropdown,  Select,  Modal,  Form,  DatePicker,
  message} from 'antd';
import {  SearchOutlined,    PlusOutlined,  EditOutlined,  DeleteOutlined,
  EyeOutlined,  DownOutlined,  FileTextOutlined,  ClockCircleOutlined,
  CheckCircleOutlined,  CloseCircleOutlined,  BarChartOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Option } = Select;

const Applications = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    sortBy: 'dateDesc'
  });

  // Sample applications data
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
    },
    {
      key: '3',
      company: 'Creative Solutions',
      position: 'UI/UX Designer',
      dateApplied: '2025-04-01',
      status: 'Offer',
      location: 'San Francisco, CA',
      salary: '$115,000 - $135,000',
      contact: 'jane@creativesolutions.com',
      notes: 'Received offer letter, need to respond by Apr 15',
      priority: 'Medium'
    },
    {
      key: '4',
      company: 'Cloud Innovations',
      position: 'Full Stack Developer',
      dateApplied: '2025-03-28',
      status: 'Rejected',
      location: 'Austin, TX',
      salary: '$95,000 - $120,000',
      contact: 'tech@cloudinnovations.com',
      notes: 'Rejected after final round',
      priority: 'Low'
    },
    {
      key: '5',
      company: 'Smart Software',
      position: 'JavaScript Engineer',
      dateApplied: '2025-03-25',
      status: 'Applied',
      location: 'Chicago, IL',
      salary: '$85,000 - $105,000',
      contact: 'careers@smartsoftware.com',
      notes: 'Applied through LinkedIn',
      priority: 'Medium'
    },
    {
      key: '6',
      company: 'Quantum Computing',
      position: 'Frontend Lead',
      dateApplied: '2025-03-22',
      status: 'Interview',
      location: 'Seattle, WA',
      salary: '$130,000 - $160,000',
      contact: 'recruiting@quantum.io',
      notes: 'Second round interview scheduled for Apr 12',
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

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        const formattedValues = {
          ...values,
          dateApplied: values.dateApplied ? values.dateApplied.format('YYYY-MM-DD') : '',
        };

        if (isEditMode && currentApplication) {
          // Edit existing application
          const updatedApplications = applications.map(app =>
            app.key === currentApplication.key ? { ...formattedValues, key: app.key } : app
          );
          setApplications(updatedApplications);
          message.success('Application updated successfully');
        } else {
          // Add new application
          const newKey = (Math.max(...applications.map(app => parseInt(app.key))) + 1).toString();
          setApplications([...applications, { ...formattedValues, key: newKey }]);
          message.success('Application added successfully');
        }

        setIsModalVisible(false);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
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

  // Filter applications based on search text and filters
  const filteredApplications = applications.filter(app => {
    // Search text filter
    const searchFilter = searchText.toLowerCase() === '' ||
      app.company.toLowerCase().includes(searchText.toLowerCase()) ||
      app.position.toLowerCase().includes(searchText.toLowerCase()) ||
      app.location.toLowerCase().includes(searchText.toLowerCase());

    // Status filter
    const statusFilter = filters.status.length === 0 ||
      filters.status.includes(app.status);

    return searchFilter && statusFilter;
  }).sort((a, b) => {
    // Sort by date
    if (filters.sortBy === 'dateDesc') {
      return new Date(b.dateApplied) - new Date(a.dateApplied);
    } else if (filters.sortBy === 'dateAsc') {
      return new Date(a.dateApplied) - new Date(b.dateApplied);
    }
    // Sort by company name
    else if (filters.sortBy === 'company') {
      return a.company.localeCompare(b.company);
    }
    // Sort by priority
    else if (filters.sortBy === 'priority') {
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
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

  // Table columns configuration
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
            <Col xs={12} md={6}>
              <Select
                placeholder="Sort by"
                defaultValue="dateDesc"
                onChange={(value) => setFilters({ ...filters, sortBy: value })}
                style={{ width: '100%' }}
                className={isDark ? 'ant-select-dark' : ''}
              >
                <Option value="dateDesc">Newest first</Option>
                <Option value="dateAsc">Oldest first</Option>
                <Option value="company">Company name</Option>
                <Option value="priority">Priority</Option>
              </Select>
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

      {/* Add/Edit Application Modal */}
      <Modal
        title={isEditMode ? 'Edit Application' : 'Application Details'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEditMode ? 'Save' : 'OK'}
        okButtonProps={{
          style: { display: isEditMode ? 'inline-block' : 'none' }
        }}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          disabled={!isEditMode}
          className="mt-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="company"
                label="Company"
                rules={[{ required: true, message: 'Please enter company name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label="Position"
                rules={[{ required: true, message: 'Please enter position' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateApplied"
                label="Date Applied"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Option value="Applied">Applied</Option>
                  <Option value="Interview">Interview</Option>
                  <Option value="Offer">Offer</Option>
                  <Option value="Rejected">Rejected</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Location"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salary"
                label="Salary Range"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contact"
                label="Contact Information"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Priority"
              >
                <Select>
                  <Option value="High">High</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Low">Low</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Applications;
