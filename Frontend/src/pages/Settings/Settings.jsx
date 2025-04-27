import React, { useEffect, useState } from "react";
import { Input, Select, Switch, Button, message, Card, Row, Col } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import axios from "axios";
import { baseURL } from "../../../config.js";
import { useToken } from "../../hooks/TokenContext.jsx";
import useFetch from "../../hooks/useFetch";

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

      <Row gutter={[16, 16]}>
        {/* Profile Settings */}
        <Col xs={24} sm={12} md={8}>
          <Card title='Profile Settings' variant={false} hoverable>
            <div className='form-grid'>
              <div className='form-group'>
                <label>Username</label>
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
            </div>
          </Card>
        </Col>

        {/* Notification Preferences */}
        <Col xs={24} sm={12} md={8}>
          <Card title='Notification Preferences' variant={false} hoverable>
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
          </Card>
        </Col>

        {/* Data Management */}
        <Col xs={24} sm={12} md={8}>
          <Card
            title='Data Management'
            variant={true}
            hoverable
            style={{ marginBottom: "2rem" }}>
            <Button onClick={handleExportData}>Export to JSON</Button>
          </Card>

          <Card title='Security Settings' variant={false} hoverable>
            <div>
              <h3>Two-Factor Authentication</h3>
              <Button
                type={
                  settings.security.twoFactorEnabled ? "default" : "primary"
                }
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
          </Card>
        </Col>

        {/* Theme Customization */}
      </Row>

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
