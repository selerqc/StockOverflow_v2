import React, { useState, useEffect } from "react";
import { Package, ShoppingCart, AlertTriangle, TrendingUp } from "lucide-react";
import DashboardCard from "./../../../components/Card/DashboardCard";
import "../Dashboard/Dashboard.css";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { baseURL } from "../../../../config.js";

const chart = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
];

const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [statusCount, setStatusCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const { token } = useToken();
  useEffect(() => {
    Promise.all([getProductStatus(), getStatusCount()])
      .then(([productResponse, statusResponse]) => {
        setProductCount(productResponse.data.productCount);
        setStatusCount(statusResponse.data.pending);
        setLowStockItems(productResponse.data.lowStockCount);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const getProductStatus = async () => {
    return await axios.get(`${baseURL}/products/getProductStatus`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const getStatusCount = async () => {
    return await axios.get(`${baseURL}/transactions/getTransactionStatus`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  return (
    <div className='dashboard-container'>
      <h1 className='dashboard-title'>Dashboard Overview</h1>
      <div className='card-grid'>
        <DashboardCard
          title='Total Products'
          value={productCount}
          icon={Package}
          trend={{ value: productCount, isPositive: productCount > 50 }}
        />
        <DashboardCard
          title='Pending Orders'
          value={statusCount}
          icon={ShoppingCart}
          trend={{ value: statusCount, isPositive: statusCount > 20 }}
        />
        <DashboardCard
          title='Low Stock Items'
          value={lowStockItems}
          icon={AlertTriangle}
          trend={{
            value: lowStockItems,
            isPositive: lowStockItems < 20 || false,
          }}
        />
        <DashboardCard
          title='Monthly Revenue'
          value='$45,678'
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className='chart-container'>
        <h2 className='chart-title'>Stock Movement Trends</h2>
        <div className='chart-box'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='value' fill='#4F46E5' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
