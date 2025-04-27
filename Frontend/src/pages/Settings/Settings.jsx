import React, { useEffect, useState } from "react";
import { Tabs, Input, Select, Switch, Button, message } from "antd";
import {
  SaveOutlined,
  UserOutlined,
  BellOutlined,
  DatabaseOutlined,
  LockOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { baseURL } from "../../../config.js";
import { useToken } from "../../hooks/TokenContext.jsx";
import useFetch from "../../hooks/useFetch";

const { TabPane } = Tabs;

const Settings = () => {
  const { token } = useToken();
  const [exportData, setExportData] = useState({
    products: [],
    categories: [],
    orders: [],
  });
  const [userData, setUserData] = useState({
    username: " ",
    email: " ",
    phone: " ",
  });
  const { data, error } = useFetch(`${baseURL}/users/dashboard`);

  useEffect(() => {
    if (error) {
      console.error("Error fetching user data:", error);
    }
    if (data) {
      setUserData(data.data);
    }
  }, [data, error]);

  const initialSettings = {
    display: {
      timezone: "UTC-5",
    },
    notifications: {
      lowStock: true,
      orderUpdates: true,
    },
    security: {
      twoFactorEnabled: false,
    },
  };

  const [settings, setSettings] = useState(initialSettings);

  const handleSaveChanges = () => {
    console.log("Settings saved:", settings);
    message.success("Settings saved successfully!");
  };
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
    Promise.all([getAllProducts(), getAllCategories(), getAllOrders()]).then(
      ([products, categories, orders]) => {
        const exportData = {
          products: products.data,
          categories: categories.data,
          orders: orders.data,
        };
        console.log("Exported Data:", exportData);
        setExportData(exportData);
      }
    );

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stockoverflow-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    message.success("Data exported successfully!");
  };

  return (
    <div className='settings-container'>
      <h1 className='settings-title'>Settings</h1>
      <Tabs defaultActiveKey='1'>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Profile Settings
            </span>
          }
          key='1'>
          <div className='form-grid'>
            <div className='form-group'>
              <label>Company Name</label>
              <Input
                value={userData.username}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: { ...settings.company, name: e.target.value },
                  })
                }
                style={{ marginBottom: "1rem" }}
              />
            </div>
            <div className='form-group'>
              <label>Email Address</label>
              <Input
                type='email'
                value={userData.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: { ...settings.company, email: e.target.value },
                  })
                }
                style={{ marginBottom: "1rem" }}
              />
            </div>
            <div className='form-group'>
              <label>Phone Number</label>
              <Input
                type='tel'
                value={userData.phone || "No phone number"}
                disabled
                style={{ marginBottom: "1rem" }}
              />
            </div>
            <div className='form-group'>
              <label>Time Zone</label>
              <Select
                value={settings.display.timezone}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    display: { ...settings.display, timezone: value },
                  })
                }
                style={{ marginBottom: "1rem" }}>
                <Select.Option value='UTC-8'>
                  UTC-8 (Pacific Time)
                </Select.Option>
                <Select.Option value='UTC-5'>
                  UTC-5 (Eastern Time)
                </Select.Option>
                <Select.Option value='UTC+0'>UTC+0 (GMT)</Select.Option>
                <Select.Option value='UTC+1'>
                  UTC+1 (Central European Time)
                </Select.Option>
              </Select>
            </div>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <BellOutlined />
              Notification Preferences
            </span>
          }
          key='2'>
          <div className='settings-options'>
            <div className='toggle-option'>
              <h3>Low Stock Alerts</h3>
              <Switch
                checked={settings.notifications.lowStock}
                onChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      lowStock: checked,
                    },
                  })
                }
              />
            </div>
            <div className='toggle-option'>
              <h3>Order Updates</h3>
              <Switch
                checked={settings.notifications.orderUpdates}
                onChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      orderUpdates: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <DatabaseOutlined />
              Data Management
            </span>
          }
          key='3'>
          <Button onClick={handleExportData}>Export to JSON</Button>
        </TabPane>
        <TabPane
          tab={
            <span>
              <LockOutlined />
              Security Settings
            </span>
          }
          key='4'>
          <div>
            <h3>Two-Factor Authentication</h3>
            <Button
              type={settings.security.twoFactorEnabled ? "default" : "primary"}
              onClick={() =>
                setSettings({
                  ...settings,
                  security: {
                    ...settings.security,
                    twoFactorEnabled: !settings.security.twoFactorEnabled,
                  },
                })
              }>
              {settings.security.twoFactorEnabled
                ? "Disable 2FA"
                : "Enable 2FA"}
            </Button>
          </div>
        </TabPane>
      </Tabs>
      <div className='save-container'>
        <Button
          type='primary'
          icon={<SaveOutlined />}
          onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
