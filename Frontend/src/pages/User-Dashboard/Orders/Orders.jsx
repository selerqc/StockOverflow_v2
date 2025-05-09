import React, { useState, useEffect } from "react";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  HomeFilled,
} from "@ant-design/icons";
import { Button, Table, Select, Skeleton, Tabs, Tag, Tooltip, Badge, Typography } from "antd";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";
import IncomingOrderModal from "../../../components/modals/OrderModal/IncomingOrderModal";
import OutgoingOrderModal from "../../../components/modals/OrderModal/OutgoingOrderModal";
import ViewOrderDetails from "../../../components/modals/OrderModal/ViewOrderDetails.jsx";
import "./Orders.css";

const { Text } = Typography;

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(undefined);
  const [orderType, setOrderType] = useState("outgoing");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { token } = useToken();
  const role = sessionStorage.getItem("role");

  const getTransactions = async () => {
    if (role === "Admin") {
      await axios
        .get(`${baseURL}/admin/getAllTransactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data.data);
          setOrders(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
        });
    } else {
      await axios
        .get(`${baseURL}/transactions/getTransactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOrders(response.data.data);
        });
    }
  };

  useEffect(() => {
    getTransactions();
    const interval = setInterval(() => {
      getTransactions();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleNewOrder = (type) => {
    setOrderType(type);
    setSelectedOrder(undefined);
    setIsModalOpen(true);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order._id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });

    setOrders(updatedOrders);

    await updateOneTransactions(orderId, newStatus);
  };

  const updateOneTransactions = async (orderId, newStatus) => {
    console.log(orderId);
    await axios
      .patch(
        `${baseURL}/transactions/updateOneTransactions/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((error) => {
        console.error("Error updating transaction:", error);
      });

    const newAlert = {
      type: "info",
      message: `Order #${orderId} status changed to ${newStatus}`,
      date: new Date().toISOString(),
      is_read: false,
      priority: "low",
    };
    addNewAlert(newAlert);
  };

  const addNewAlert = async (newAlert) => {
    await axios
      .post(`${baseURL}/alerts/addAlerts`, newAlert, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.error("Error adding alert:", error);
      });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    return matchesStatus;
  });

  const columns = [
    ...(role === "Admin"
      ? [
        {
          title: "Ordered By",
          dataIndex: "user_id",
          key: "user_id",
          render: (text) => <Tag color='blue'>{`#${text.slice(0, 5)}...`}</Tag>,
        },
      ]
      : []),

    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <Text code>{`#${text.slice(0, 5)}...`}</Text>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (text) => text ? <Text strong>{text}</Text> : "N/A",
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span>
          {type === "incoming" ? (
            <ArrowDownOutlined style={{ color: "green" }} />
          ) : (
            <ArrowUpOutlined style={{ color: "blue" }} />
          )}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "stock_level",
      key: "stock_level",
      render: (stock_level) => (
        <Tooltip title={stock_level <= 20 ? "Low stock" : "Sufficient stock"}>
          <Badge
            count={stock_level}
            style={{
              backgroundColor: stock_level <= 20 ? "#ff4d4f" : "#52c41a",
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) => <Text type='success'>${price}</Text>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => <Text>{date}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record._id, value)}
          style={{ width: 120 }}>
          <Select.Option value='pending'>Pending</Select.Option>
          <Select.Option value='completed'>Completed</Select.Option>
          <Select.Option value='cancelled'>Cancelled</Select.Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type='link' onClick={() => handleViewDetails(record)}>
          View Details
        </Button>
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
    setFilterStatus(key);
  };

  const tabItems = [
    { key: "all", label: "All Orders" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Added a 2 seconds delay
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div className='orders-container'>
      <div className='header'>
        <h1 className='title'>Order Management</h1>

        <div className='action-buttons'>
          <Button
            type='primary'
            icon={<ArrowUpOutlined />}
            onClick={() => handleNewOrder("outgoing")}>
            New Outgoing Order
          </Button>
          <Button
            type='default'
            icon={<ArrowDownOutlined />}
            onClick={() => handleNewOrder("incoming")}>
            New Incoming Order
          </Button>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />

      <div className='orders-panel'>
        {loading ? (
          <Skeleton active />
        ) : (
          <Table
            dataSource={filteredOrders}
            columns={columns}
            rowKey='_id'
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ x: 1200 }} // Adjusted the scroll width to fix table size
          />
        )}
      </div>

      {isModalOpen && orderType === "incoming" && (
        <IncomingOrderModal
          order={selectedOrder}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(undefined);
            getTransactions();
          }}
        />
      )}

      {isModalOpen && orderType === "outgoing" && (
        <OutgoingOrderModal
          order={selectedOrder}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(undefined);
            getTransactions();
          }}
        />
      )}

      {isViewModalOpen && (
        <ViewOrderDetails
          order={selectedOrder}
          visible={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedOrder(undefined);
          }}
        />
      )}
    </div>
  );
};

export default Orders;
