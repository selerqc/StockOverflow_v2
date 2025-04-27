import React, { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  BadgeDollarSign,
  Users,
  BanknoteArrowDown,
  ChartCandlestick,
} from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { baseURL } from "../../../../config.js";

// Dummy chart data (can be fetched from API too)
const stockChart = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
];

const ordersChart = [
  { name: "Jan", orders: 100 },
  { name: "Feb", orders: 80 },
  { name: "Mar", orders: 120 },
  { name: "Apr", orders: 160 },
  { name: "May", orders: 130 },
];

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [statusCount, setStatusCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const role = sessionStorage.getItem("role");
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
    if (role === "Admin") {
      return await axios.get(`${baseURL}/admin/getAllProducts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      return await axios.get(`${baseURL}/products/getProductStatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  const getStatusCount = async () => {
    if (role === "Admin") {
      return await axios.get(`${baseURL}/admin/getAllTransactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      return await axios.get(`${baseURL}/transactions/getTransactionStatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  return (
    <div className='dashboard-container'>
      <h1 className='dashboard-title'>Dashboard Overview</h1>
      {role === "Admin" && (
        <div className='card-grid'>
          <DashboardCard
            title='Total Products'
            value={productCount}
            icon={Package}
            trend={{ value: productCount, isPositive: productCount >= 50 }}
          />
          <DashboardCard
            title='Pending Orders'
            value={statusCount}
            icon={ShoppingCart}
            trend={{ value: statusCount, isPositive: statusCount > 5 }}
          />
          <DashboardCard
            title='Low Stock Items'
            value={lowStockItems}
            icon={AlertTriangle}
            trend={{
              value: lowStockItems,
              isPositive: lowStockItems < 20,
            }}
          />
          <DashboardCard
            title='Monthly Revenue'
            value='$45,678'
            icon={TrendingUp}
            trend={{ value: 15, isPositive: true }}
          />
          <DashboardCard
            title='Active Users'
            value='1,234'
            icon={Users}
            trend={{ value: 10, isPositive: true }}
          />
          <DashboardCard
            title='Total Sales'
            value='$100,125'
            icon={BadgeDollarSign}
            trend={{ value: 10, isPositive: true }}
          />
          <DashboardCard
            title='Refund Requests'
            value='5'
            icon={BanknoteArrowDown}
            trend={{ value: 10, isPositive: true }}
          />
          <DashboardCard
            title='Inventory Value'
            value='$50,000'
            icon={ChartCandlestick}
            trend={{ value: 10, isPositive: true }}
          />
        </div>
      )}

      {role === "Business Owner" || role === "Employee" ? (
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
              isPositive: lowStockItems < 20,
            }}
          />
          <DashboardCard
            title='Monthly Revenue'
            value='$45,678'
            icon={TrendingUp}
            trend={{ value: 15, isPositive: true }}
          />
        </div>
      ) : null}
      <div className='chart-grid'>
        <div className='chart-container'>
          <h2 className='chart-title'>Stock Movement Trends</h2>
          <div className='chart-box'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={stockChart}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='value' fill='#4F46E5' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='chart-container'>
          <h2 className='chart-title'>Order Volume Trends</h2>
          <div className='chart-box'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={ordersChart}
                  dataKey='orders'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={100}
                  fill='#8884d8'>
                  {ordersChart.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
