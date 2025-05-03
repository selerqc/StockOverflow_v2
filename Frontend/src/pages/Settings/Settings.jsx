import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  Switch,
  Button,
  message,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Avatar,
  Form,
  Space,
  Tabs,
  List,
  Upload,
  Badge,
  Spin,
  Tooltip,
  Alert,
  Skeleton,
} from "antd";
import {
  SaveOutlined,
  UserOutlined,
  BellOutlined,
  DownloadOutlined,
  LockOutlined,
  SettingOutlined,
  ExportOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  PictureOutlined,
  LogoutOutlined,
  EditOutlined,
  SecurityScanOutlined,
  SyncOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { baseURL } from "../../../config.js";
import { useToken } from "../../hooks/TokenContext.jsx";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import Lanyard from "../../components/Lanyard/Lanyard.jsx";
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
import { Link } from "react-router-dom";

const Settings = () => {
  const { token, setToken } = useToken();
  const [exportLoading, setExportLoading] = useState(false);
  const [form] = Form.useForm();

  const [exportData, setExportData] = useState({
    products: [],
    categories: [],
    orders: [],
  });

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    _id: "",
    role: "",
  });

  const { data, error, isLoading } = useFetch(`${baseURL}/users/dashboard`);
  const navigate = useNavigate(); // Import and use the useNavigate hook for redirection

  useEffect(() => {
    if (error) {
      message.error("Error fetching user data. Please try again.");
      console.error("Error fetching user data:", error);
    }
    if (data) {
      setUserData({
        username: data.data.username,
        email: data.data.email,
        phone: data.data.phone || "",
        _id: data.data._id || "",
        role: data.data.role || "",
      });
      form.setFieldsValue({
        username: data.data.username,
        email: data.data.email,
        phone: data.data.phone || "No phone number",
        role: data.data.role || "",
      });
    }
  }, [data, error, form]);

  const handleLogout = async () => {
    try {
      const userId = userData._id; // Get the user ID from userData
      if (userId) {
        await axios.patch(
          `${baseURL}/users/updateUserLogout/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }


      setToken(null);
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("user");
      localStorage.removeItem("token");
      message.success("Successfully logged out");


    } catch (error) {
      console.error("Logout error:", error);
      message.error("Error logging out. Please try again.");
    }
  };

  const initialSettings = {
    notifications: {
      lowStock: true,
      orderUpdates: true,
      priceAlerts: false,
      systemNotifications: true,
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: "30min",
      passwordChangeRequired: false,
    },
    display: {
      theme: "light",
      compactMode: false,
      highContrast: false,
    },
  };

  const [settings, setSettings] = useState(initialSettings);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/getAllProducts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/getAllCategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  const getAllOrders = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/getAllTransactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };

  const handleExportData = () => {
    setExportLoading(true);

    Promise.all([getAllProducts(), getAllCategories(), getAllOrders()])
      .then(([products, categories, orders]) => {
        setExportData({
          products: products.data,
          categories: categories.data,
          orders: orders.data,
        });

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `stockoverflow-export-${new Date().toISOString().split("T")[0]
          }.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        message.success("Data exported successfully!");
        setExportLoading(false);
      })
      .catch((err) => {
        message.error("Failed to export data. Please try again.");
        setExportLoading(false);
      });
  };

  const notificationItems = [
    {
      title: "Low Stock Alerts",
      description: "Get notified when products reach low stock levels",
      checked: settings.notifications.lowStock,
      onChange: (checked) =>
        setSettings({
          ...settings,
          notifications: {
            ...settings.notifications,
            lowStock: checked,
          },
        }),
    },
    {
      title: "Order Updates",
      description: "Receive notifications for new orders and status changes",
      checked: settings.notifications.orderUpdates,
      onChange: (checked) =>
        setSettings({
          ...settings,
          notifications: {
            ...settings.notifications,
            orderUpdates: checked,
          },
        }),
    },
    {
      title: "Price Alerts",
      description: "Get notified when product prices change significantly",
      checked: settings.notifications.priceAlerts,
      onChange: (checked) =>
        setSettings({
          ...settings,
          notifications: {
            ...settings.notifications,
            priceAlerts: checked,
          },
        }),
    },
    {
      title: "System Notifications",
      description: "Receive updates about system maintenance and new features",
      checked: settings.notifications.systemNotifications,
      onChange: (checked) =>
        setSettings({
          ...settings,
          notifications: {
            ...settings.notifications,
            systemNotifications: checked,
          },
        }),
    },
  ];

  const securitySettings = [
    {
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      value: settings.security.twoFactorEnabled,
      action: (
        <Button
          type={settings.security.twoFactorEnabled ? "default" : "primary"}
          icon={<SecurityScanOutlined />}
          onClick={() =>
            setSettings({
              ...settings,
              security: {
                ...settings.security,
                twoFactorEnabled: !settings.security.twoFactorEnabled,
              },
            })
          }>
          {settings.security.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
        </Button>
      ),
    },
    {
      title: "Session Timeout",
      description: "Set how long until inactive sessions are logged out",
      value: settings.security.sessionTimeout,
      action: (
        <Select
          defaultValue='30min'
          style={{ width: 120 }}
          onChange={(value) =>
            setSettings({
              ...settings,
              security: {
                ...settings.security,
                sessionTimeout: value,
              },
            })
          }>
          <Select.Option value='15min'>15 minutes</Select.Option>
          <Select.Option value='30min'>30 minutes</Select.Option>
          <Select.Option value='60min'>1 hour</Select.Option>
          <Select.Option value='never'>Never</Select.Option>
        </Select>
      ),
    },
    {
      title: "Password Change",
      description: "Change your account password",
      action: (
        <Button
          icon={<LockOutlined />}
          onClick={() =>
            message.info("Password change functionality would open here")
          }>
          Change Password
        </Button>
      ),
    },
  ];

  const dataManagementOptions = [
    {
      title: "Export All Data",
      description: "Export your inventory, orders, and categories as JSON",
      action: (
        <Button
          type='primary'
          icon={<DownloadOutlined />}
          onClick={handleExportData}
          loading={exportLoading}>
          Export Data
        </Button>
      ),
    },
    {
      title: "Backup Settings",
      description: "Save a backup of your system settings",
      action: (
        <Button
          icon={<DatabaseOutlined />}
          onClick={() => message.info("Settings backup would run here")}>
          Backup Settings
        </Button>
      ),
    },
    {
      title: "Import Data",
      description: "Import data from a JSON file",
      action: (
        <Upload
          beforeUpload={(file) => {
            message.info(`Would import data from ${file.name}`);
            return false;
          }}
          showUploadList={false}>
          <Button icon={<UploadOutlined />}>Import JSON</Button>
        </Upload>
      ),
    },
  ];

  const displaySettings = [
    {
      title: "Theme",
      description: "Choose between light and dark theme",
      action: (
        <Select
          defaultValue='light'
          style={{ width: 120 }}
          onChange={(value) =>
            setSettings({
              ...settings,
              display: {
                ...settings.display,
                theme: value,
              },
            })
          }>
          <Select.Option value='light'>Light</Select.Option>
          <Select.Option value='dark'>Dark</Select.Option>
        </Select>
      ),
    },
    {
      title: "Compact Mode",
      description: "Use compact view for more content on screen",
      checked: settings.display.compactMode,
      action: (
        <Switch
          checked={settings.display.compactMode}
          onChange={(checked) =>
            setSettings({
              ...settings,
              display: {
                ...settings.display,
                compactMode: checked,
              },
            })
          }
        />
      ),
    },
    {
      title: "High Contrast",
      description: "Enable high contrast mode for better accessibility",
      checked: settings.display.highContrast,
      action: (
        <Switch
          checked={settings.display.highContrast}
          onChange={(checked) =>
            setSettings({
              ...settings,
              display: {
                ...settings.display,
                highContrast: checked,
              },
            })
          }
        />
      ),
    },
  ];

  return (
    <div className='settings-container'>
      <div className='settings-header'>
        <div>
          <Title level={2}>
            <SettingOutlined /> Settings
          </Title>
          <Text type='secondary'>
            Manage your account settings and preferences
          </Text>
        </div>
      </div>

      <Tabs defaultActiveKey='1' type='card' className='settings-tabs'>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Profile
            </span>
          }
          key='1'>
          <Skeleton loading={isLoading} active>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card className='profile-card' variant={false}>
                  <div className='user-avatar-container'>

                    <Lanyard />
                    <Title level={4}>{userData.username || "User"}</Title>
                    <Text type='secondary'>{userData.email}</Text>
                  </div>

                  <Divider />

                  <div className='account-actions'>
                    <Button
                      icon={<LogoutOutlined />}
                      danger
                      onClick={handleLogout}>
                      Sign Out
                    </Button>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={16}>
                <Card title='Account Information' variant={false}>
                  <Form
                    form={form}
                    layout='vertical'
                    initialValues={{
                      username: userData.username,
                      email: userData.email,
                      phone: userData.phone || "No phone number",
                    }}>
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name='username'
                          label='Username'
                        >
                          <Input
                            prefix={<UserOutlined />}
                            placeholder='Username'
                            disabled
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          name='email'
                          label='Email Address'
                        >
                          <Input type='email' placeholder='Email address' disabled />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item name='phone' label='Phone Number'>
                          <Input
                            type='tel'
                            placeholder='Phone number'
                            disabled
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name='role' label='Role'>
                          <Input
                            type='text'
                            placeholder='Role'
                            disabled
                          />
                        </Form.Item>
                      </Col>
                    </Row>


                  </Form>
                </Card>
              </Col>
            </Row>
          </Skeleton>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BellOutlined />
              Notifications
            </span>
          }
          key='2'>
          <Card bordered={false}>
            <List
              itemLayout='horizontal'
              dataSource={notificationItems}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Switch checked={item.checked} onChange={item.onChange} />,
                  ]}>
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <LockOutlined />
              Security
            </span>
          }
          key='3'>
          <Card bordered={false}>
            <List
              itemLayout='horizontal'
              dataSource={securitySettings}
              renderItem={(item) => (
                <List.Item actions={[item.action]}>
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <DatabaseOutlined />
              Data Management
            </span>
          }
          key='4'>
          <Card bordered={false}>
            <Alert
              message='Data Management'
              description='These actions will affect your stored data. Make sure to create backups regularly.'
              type='info'
              showIcon
              style={{ marginBottom: 16 }}
            />

            <List
              itemLayout='horizontal'
              dataSource={dataManagementOptions}
              renderItem={(item) => (
                <List.Item actions={[item.action]}>
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>


      </Tabs>
    </div>
  );
};

export default Settings;
