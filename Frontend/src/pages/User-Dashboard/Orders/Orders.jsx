import React, { useState, useEffect } from "react";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Button, Table, Select, Input, Skeleton, Modal } from "antd";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";
import IncomingOrderModal from "../../../components/modals/OrderModal/IncomingOrderModal";
import OutgoingOrderModal from "../../../components/modals/OrderModal/OutgoingOrderModal";
import ViewOrderDetails from "../../../components/modals/OrderModal/ViewOrderDetails.jsx";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(undefined);
  const [orderType, setOrderType] = useState("outgoing");
  const [loading, setLoading] = useState(true);
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
    }, 1000);
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

    const newAlert = {
      type: "info",
      message: `Order #${orderId} status changed to ${newStatus}`,
      date: new Date().toISOString(),
      is_read: false,
      priority: "low",
    };

    await axios.post(`${baseURL}/alerts/addAlerts`, newAlert, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await axios.patch(
      `${baseURL}/transactions/updateOneTransactions/${orderId}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
            title: "User ID",
            dataIndex: "user_id",
            key: "user_id",
            render: (text) => `#${text.slice(0, 5)}...`,
          },
        ]
      : []),

    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => `#${text}`,
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span>
          {type === "incoming" ? (
            <ArrowUpOutlined style={{ color: "green" }} />
          ) : (
            <ArrowDownOutlined style={{ color: "blue" }} />
          )}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "stock_level",
      key: "stock_level",
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) => `$${price}`,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div className='orders-container'>
      <div className='header'>
        <h1 className='title'>Order Management</h1>
        <div className='action-buttons'>
          <Button
            type='primary'
            icon={<ArrowDownOutlined />}
            onClick={() => handleNewOrder("outgoing")}>
            New Outgoing Order
          </Button>
          <Button
            type='default'
            icon={<ArrowUpOutlined />}
            onClick={() => handleNewOrder("incoming")}>
            New Incoming Order
          </Button>
        </div>
      </div>

      <div className='orders-panel'>
        <div className='order-filters'>
          <Input
            placeholder='Search orders...'
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", marginRight: 16 }}
          />
          <Select
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            style={{ width: 200 }}
            suffixIcon={<FilterOutlined />}>
            <Select.Option value='all'>All Status</Select.Option>
            <Select.Option value='pending'>Pending</Select.Option>
            <Select.Option value='completed'>Completed</Select.Option>
            <Select.Option value='cancelled'>Cancelled</Select.Option>
          </Select>
        </div>
        {loading ? (
          <Skeleton active />
        ) : (
          <Table
            dataSource={filteredOrders}
            columns={columns}
            rowKey='_id'
            pagination={{ pageSize: 10 }}
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
