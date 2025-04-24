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

import useFetch from "../../hooks/useFetch";

const { TabPane } = Tabs;

const Settings = () => {
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
    company: {
      name: "StockOverflow Inc.",
      email: "contact@stockoverflow.com",
      phone: "(555) 123-4567",
    },
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

  const handleExportData = () => {
    const data = {
      products: [
        { id: "1", name: "Office Chair", stock: 24, price: 199.99 },
        { id: "2", name: "Standing Desk", stock: 15, price: 349.99 },
      ],
      categories: [
        { id: "1", name: "Furniture" },
        { id: "2", name: "Electronics" },
      ],
      orders: [{ id: "ORD-001", date: "2025-04-10", status: "completed" }],
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
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
              />
            </div>
            <div className='form-group'>
              <label>Phone Number</label>
              <Input
                type='tel'
                value={userData.phone || "No phone number"}
                disabled
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
                }>
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
