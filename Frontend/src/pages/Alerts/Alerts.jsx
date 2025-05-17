import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { Table, Select, Button, Badge, Space } from "antd";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import "../Alerts/Alerts.css";
import { useToken } from "../../hooks/TokenContext";
import { baseURL } from "../../../config";

const Alerts = () => {
  const [filter, setFilter] = useState("all");
  const [alerts, setAlerts] = useState([]);
  const { token } = useToken();
  const { data } = useFetch(`${baseURL}/alerts/getAlerts`);

  useEffect(() => {


    if (data) {
      setAlerts(data.data);
    }
  }, [data]);

  const handleMarkAsRead = async (alertId) => {
    await axios
      .patch(
        `${baseURL}/alerts/updateOneAlert/${alertId}`,
        { is_read: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setAlerts((prevAlerts) =>
          prevAlerts.map((alert) =>
            alert._id === alertId ? { ...alert, is_read: true } : alert
          )
        );
      });
  };

  const handleMarkAllAsRead = async () => {
    await axios
      .patch(
        `${baseURL}/alerts/updateManyAlert`,
        {
          ids: alerts
            .filter((alert) => !alert.is_read)
            .map((alert) => alert._id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setAlerts((prevAlerts) =>
          prevAlerts.map((alert) => ({ ...alert, is_read: true }))
        );
      });
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className='alert-icon warning' size={20} />;
      case "success":
        return <CheckCircle className='alert-icon success' size={20} />;
      case "info":
        return <Info className='alert-icon info' size={20} />;
      case "error":
        return <XCircle className='alert-icon error' size={20} />;
      default:
        return <Info className='alert-icon info' size={20} />;
    }
  };

  const filteredAlerts = alerts.filter(
    (alert) => filter === "all" || (filter === "unread" && !alert.is_read)
  );

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => getAlertIcon(type),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        !record.is_read && (
          <Button type='link' onClick={() => handleMarkAsRead(record._id)}>
            Mark as Read
          </Button>
        ),
    },
  ];

  return (
    <div className='alerts-container'>
      <div className='alerts-header'>
        <Space className='alerts-title-container'>
          <h1 className='alerts-title'>Alerts</h1>
          {unreadCount > 0 && (
            <Badge count={unreadCount} className='unread-badge' />
          )}
        </Space>
        <Space className='alerts-actions'>
          <Select
            className='filter-select'
            value={filter}
            onChange={(value) => setFilter(value)}
            options={[
              { value: "all", label: "All Alerts" },
              { value: "unread", label: "Unread Only" },
            ]}
          />
          <Button
            type='primary'
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}>
            Mark All as Read
          </Button>
        </Space>
      </div>
      <Table
        className='alerts-list'
        dataSource={filteredAlerts}
        columns={columns}
        rowKey='_id'
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Alerts;
