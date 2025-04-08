import { useState } from 'react';
import {
  Card,
  Calendar,
  Badge,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Tooltip,
  List,
  Typography,
  Tabs,
  Tag,
  Dropdown,
  message,
  Space
} from 'antd';
import {
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  BuildOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  MoreOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Schedule = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [form] = Form.useForm();
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Sample events data
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Technical Interview with Data Systems Inc',
      company: 'Data Systems Inc',
      date: '2025-04-10',
      time: '10:00',
      duration: '1 hour',
      type: 'interview',
      location: 'Virtual (Zoom)',
      notes: 'Prepare for system design and React questions',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'HR Interview with Creative Solutions',
      company: 'Creative Solutions',
      date: '2025-04-15',
      time: '14:30',
      duration: '45 minutes',
      type: 'interview',
      location: 'Virtual (Microsoft Teams)',
      notes: 'Prepare to discuss salary expectations and benefits',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Submit Portfolio to Quantum Computing',
      company: 'Quantum Computing',
      date: '2025-04-08',
      time: '09:00',
      duration: '30 minutes',
      type: 'task',
      location: 'N/A',
      notes: 'Need to finalize the portfolio and case studies',
      status: 'completed'
    },
    {
      id: '4',
      title: 'Follow-up with TechCorp',
      company: 'TechCorp',
      date: '2025-04-12',
      time: '11:00',
      duration: '15 minutes',
      type: 'followup',
      location: 'Email/Phone',
      notes: 'Ask about timeline for next steps',
      status: 'scheduled'
    },
    {
      id: '5',
      title: 'Final Interview with Smart Software',
      company: 'Smart Software',
      date: '2025-04-20',
      time: '13:00',
      duration: '2 hours',
      type: 'interview',
      location: 'On-site: Chicago, IL',
      notes: 'Meet with the team, technical assessment, and culture fit',
      status: 'scheduled'
    },
    {
      id: '6',
      title: 'Review Cloud Innovations Job Offer',
      company: 'Cloud Innovations',
      date: '2025-04-18',
      time: '16:00',
      duration: '1 hour',
      type: 'task',
      location: 'N/A',
      notes: 'Compare benefits and salary with other offers',
      status: 'scheduled'
    }
  ]);

  const showModal = (event = null, edit = false) => {
    setIsEditMode(edit);
    setCurrentEvent(event);
    setIsModalVisible(true);

    if (event && edit) {
      form.setFieldsValue({
        ...event,
        date: dayjs(event.date),
        time: dayjs(event.time, 'HH:mm')
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        date: selectedDate,
        time: dayjs('09:00', 'HH:mm'),
        type: 'interview',
        duration: '1 hour',
        status: 'scheduled'
      });
    }
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        const formattedValues = {
          ...values,
          date: values.date.format('YYYY-MM-DD'),
          time: values.time.format('HH:mm')
        };

        if (isEditMode && currentEvent) {
          // Edit existing event
          const updatedEvents = events.map(event =>
            event.id === currentEvent.id ? { ...formattedValues, id: event.id } : event
          );
          setEvents(updatedEvents);
          message.success('Event updated successfully');
        } else {
          // Add new event
          const newId = (parseInt(Math.max(...events.map(event => parseInt(event.id)))) + 1).toString();
          setEvents([...events, { ...formattedValues, id: newId }]);
          message.success('Event added successfully');
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

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this event?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        const updatedEvents = events.filter(event => event.id !== id);
        setEvents(updatedEvents);
        message.success('Event deleted successfully');
      }
    });
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedEvents = events.map(event =>
      event.id === id ? { ...event, status: newStatus } : event
    );
    setEvents(updatedEvents);
    message.success(`Event marked as ${newStatus}`);
  };

  const getListData = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    return events.filter(event => event.date === formattedDate);
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);

    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.id} className="mb-1">
            <Tooltip title={item.title}>
              <Badge
                status={getBadgeStatus(item.type)}
                text={
                  <span
                    className={`text-xs ${item.status === 'completed' ? 'line-through opacity-60' : ''}`}
                  >
                    {getShortTitle(item)}
                  </span>
                }
                className="cursor-pointer"
                onClick={() => showModal(item, false)}
              />
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  const getShortTitle = (event) => {
    if (event.title.length > 20) {
      return `${event.title.substring(0, 18)}...`;
    }
    return event.title;
  };

  const getBadgeStatus = (type) => {
    switch (type) {
      case 'interview':
        return 'processing';
      case 'task':
        return 'warning';
      case 'followup':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'interview':
        return 'blue';
      case 'task':
        return 'orange';
      case 'followup':
        return 'green';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'interview':
        return <BuildOutlined />;
      case 'task':
        return <CheckOutlined />;
      case 'followup':
        return <ClockCircleOutlined />;
      default:
        return <CalendarOutlined />;
    }
  };

  const getStatusStyle = (status) => {
    return status === 'completed' ? 'opacity-60 line-through' : '';
  };

  // Filter upcoming events (from today onwards)
  const upcomingEvents = events
    .filter(event => dayjs(event.date).isSameOrAfter(dayjs().format('YYYY-MM-DD')) && event.status !== 'completed')
    .sort((a, b) => {
      // Sort by date and time
      const dateA = dayjs(`${a.date} ${a.time}`);
      const dateB = dayjs(`${b.date} ${b.time}`);
      return dateA - dateB;
    });

  // Filter events for the selected date
  const eventsForSelectedDate = events
    .filter(event => event.date === selectedDate.format('YYYY-MM-DD'))
    .sort((a, b) => {
      // Sort by time
      const timeA = dayjs(a.time, 'HH:mm');
      const timeB = dayjs(b.time, 'HH:mm');
      return timeA - timeB;
    });

  return (
    <div className="schedule-container">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Schedule
        </h1>
        <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>
          Manage your interviews and follow-ups
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {/* Calendar/List View Toggle */}
        <Col span={24} className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <Tabs
                activeKey={viewMode}
                onChange={setViewMode}
                className={isDark ? 'text-white' : ''}
              >
                <TabPane
                  tab={<span><CalendarOutlined /> Calendar View</span>}
                  key="calendar"
                />
                <TabPane
                  tab={<span><UnorderedListOutlined /> List View</span>}
                  key="list"
                />
              </Tabs>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal(null, true)}
            >
              Add Event
            </Button>
          </div>
        </Col>

        {viewMode === 'calendar' ? (
          // Calendar View
          <Col span={24}>
            <Card className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}>
              <Calendar
                onSelect={setSelectedDate}
                value={selectedDate}
                dateCellRender={dateCellRender}
                className={isDark ? 'ant-calendar-dark' : ''}
              />
            </Card>
          </Col>
        ) : (
          // List View
          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Card
                  title={`Events for ${selectedDate.format('MMMM D, YYYY')}`}
                  className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}
                  extra={
                    <DatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      allowClear={false}
                      className={isDark ? 'bg-[#141414] border-gray-700' : ''}
                    />
                  }
                >
                  {eventsForSelectedDate.length > 0 ? (
                    <List
                      dataSource={eventsForSelectedDate}
                      renderItem={item => (
                        <List.Item
                          className={`${getStatusStyle(item.status)} rounded-lg p-3 mb-2 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                          actions={[
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: '1',
                                    icon: <EditOutlined />,
                                    label: 'Edit',
                                    onClick: () => showModal(item, true)
                                  },
                                  {
                                    key: '2',
                                    icon: item.status === 'completed' ? <ClockCircleOutlined /> : <CheckOutlined />,
                                    label: item.status === 'completed' ? 'Mark as Scheduled' : 'Mark as Completed',
                                    onClick: () => handleStatusChange(
                                      item.id,
                                      item.status === 'completed' ? 'scheduled' : 'completed'
                                    )
                                  },
                                  {
                                    key: '3',
                                    icon: <DeleteOutlined />,
                                    label: 'Delete',
                                    danger: true,
                                    onClick: () => handleDelete(item.id)
                                  }
                                ]
                              }}
                            >
                              <Button type="text" icon={<MoreOutlined />} />
                            </Dropdown>
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <div className="flex justify-between">
                                <span className="font-semibold">{item.title}</span>
                                <Tag color={getTypeColor(item.type)} icon={getTypeIcon(item.type)}>
                                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                </Tag>
                              </div>
                            }
                            description={
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                <div className="flex items-center">
                                  <ClockCircleOutlined className="mr-2 text-gray-500" />
                                  <span>{item.time} ({item.duration})</span>
                                </div>
                                {item.company && (
                                  <div className="flex items-center">
                                    <BuildOutlined className="mr-2 text-gray-500" />
                                    <span>{item.company}</span>
                                  </div>
                                )}
                                {item.location && item.location !== 'N/A' && (
                                  <div className="flex items-center">
                                    <EnvironmentOutlined className="mr-2 text-gray-500" />
                                    <span>{item.location}</span>
                                  </div>
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <div className="text-center py-10">
                      <Text type="secondary">No events scheduled for this day</Text>
                      <div className="mt-4">
                        <Button type="primary" onClick={() => showModal(null, true)}>
                          Add Event
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card
                  title="Upcoming Events"
                  className={isDark ? 'bg-[#1f1f1f] text-white border-gray-700' : ''}
                >
                  {upcomingEvents.length > 0 ? (
                    <List
                      dataSource={upcomingEvents.slice(0, 5)}
                      renderItem={item => (
                        <List.Item
                          className={`rounded-lg px-3 py-2 mb-2 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                          onClick={() => showModal(item, false)}
                        >
                          <List.Item.Meta
                            title={
                              <div className="flex justify-between">
                                <span className="font-semibold text-sm">{getShortTitle(item)}</span>
                                <Tag color={getTypeColor(item.type)} className="text-xs">
                                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                </Tag>
                              </div>
                            }
                            description={
                              <div className="flex items-center mt-1 justify-between">
                                <span className="text-xs">
                                  <CalendarOutlined className="mr-1" />
                                  {dayjs(item.date).format('MMM D')} at {item.time}
                                </span>
                                <span className="text-xs">{item.company}</span>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <div className="text-center py-6">
                      <Text type="secondary">No upcoming events</Text>
                    </div>
                  )}

                  {upcomingEvents.length > 5 && (
                    <div className="text-center mt-4">
                      <Button type="link" onClick={() => setViewMode('list')}>
                        View all ({upcomingEvents.length})
                      </Button>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </Col>
        )}
      </Row>

      {/* Add/Edit Event Modal */}
      <Modal
        title={isEditMode ? 'Edit Event' : 'Event Details'}
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
            <Col span={24}>
              <Form.Item
                name="title"
                label="Event Title"
                rules={[{ required: true, message: 'Please enter event title' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="company"
                label="Company"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Event Type"
                rules={[{ required: true, message: 'Please select event type' }]}
              >
                <Select>
                  <Option value="interview">Interview</Option>
                  <Option value="task">Task</Option>
                  <Option value="followup">Follow-up</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="time"
                label="Time"
                rules={[{ required: true, message: 'Please select time' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="duration"
                label="Duration"
              >
                <Select>
                  <Option value="15 minutes">15 minutes</Option>
                  <Option value="30 minutes">30 minutes</Option>
                  <Option value="45 minutes">45 minutes</Option>
                  <Option value="1 hour">1 hour</Option>
                  <Option value="1.5 hours">1.5 hours</Option>
                  <Option value="2 hours">2 hours</Option>
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
                name="status"
                label="Status"
              >
                <Select>
                  <Option value="scheduled">Scheduled</Option>
                  <Option value="completed">Completed</Option>
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

export default Schedule;
