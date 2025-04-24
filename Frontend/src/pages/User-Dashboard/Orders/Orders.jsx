import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import IncomingOrderModal from "../../../components/modals/OrderModal/IncomingOrderModal";
import OutgoingOrderModal from "../../../components/modals/OrderModal/OutgoingOrderModal";
import ViewOrderDetails from "../../../components/modals/ViewOrderDetails";
import "./Orders.css";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";

const Orders = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(undefined);
  const [orderType, setOrderType] = useState("outgoing");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useToken();

  const getTransactions = async () => {
    await axios
      .get(`${baseURL}/transactions/getTransactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrders(response.data.data);
      });
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

    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={18} className='status-icon completed' />;
      case "pending":
        return <Clock size={18} className='status-icon pending' />;
      case "cancelled":
        return <XCircle size={18} className='status-icon cancelled' />;
      default:
        return null;
    }
  };
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
          <button
            onClick={() => handleNewOrder("outgoing")}
            className='btn primary'>
            <ArrowDownRight size={20} />
            <span>New Outgoing Order</span>
          </button>
          <button
            onClick={() => handleNewOrder("incoming")}
            className='btn secondary'>
            <ArrowUpRight size={20} />
            <span>New Incoming Order</span>
          </button>
        </div>
      </div>

      <div className='orders-panel'>
        <div className='order-filters'>
          <div className='order-search-box'>
            <Search className='order-search-icon' size={20} />
            <input
              type='text'
              placeholder='Search orders...'
              className='order-search-input'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className='status-filter'>
            <Filter size={20} className='filter-icon' />
            <select
              className='status-select'
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}>
              <option value='all'>All Status</option>
              <option value='pending'>Pending</option>
              <option value='completed'>Completed</option>
              <option value='cancelled'>Cancelled</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className='skeleton-loading'>
            <Skeleton variant='text' width={1100} height={100} />
            <Skeleton variant='rounded' width={1100} height={200} />
          </div>
        ) : (
          <div className='table-container'>
            <table className='orders-table'>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className='order-id'>#{order._id}</td>
                    <td>{order.name}</td>
                    <td>
                      <span className={`order-type ${order.type}`}>
                        {order.type === "incoming" ? (
                          <ArrowUpRight size={18} />
                        ) : (
                          <ArrowDownRight size={18} />
                        )}
                        <span>
                          {order.type.charAt(0).toUpperCase() +
                            order.type.slice(1)}
                        </span>
                      </span>
                    </td>
                    <td>{order.stock_level}</td>
                    <td>${order.total_price}</td>
                    <td>{order.createdAt}</td>
                    <td>
                      <div className='status-selector'>
                        {getStatusIcon(order.status)}
                        <select
                          className='status-dropdown'
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }>
                          <option value='pending'>Pending</option>
                          <option value='completed'>Completed</option>
                          <option value='cancelled'>Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewDetails(order)}
                        className='btn secondary small'>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
