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
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  PlusSquare,
  ListOrdered,
  FolderPlus,
  Bell,
} from "lucide-react";
import DashboardCard from "../../../components/Card/DashboardCard.jsx";
import "./Dashboard.css";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext.jsx";
import { useNavigate } from "react-router-dom";
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
  LineChart,
  Line,
  Legend,
} from "recharts";
import { baseURL } from "../../../../config.js";

// Enhanced chart data with more points
const stockChart = [
  { name: "Jan", value: 400, average: 300 },
  { name: "Feb", value: 300, average: 320 },
  { name: "Mar", value: 600, average: 350 },
  { name: "Apr", value: 800, average: 410 },
  { name: "May", value: 500, average: 380 },
  { name: "Jun", value: 750, average: 400 },
  { name: "Jul", value: 820, average: 450 },
];

const ordersChart = [
  { name: "Jan", orders: 100 },
  { name: "Feb", orders: 80 },
  { name: "Mar", orders: 120 },
  { name: "Apr", orders: 160 },
  { name: "May", orders: 130 },
  { name: "Jun", orders: 180 },
];

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [statusCount, setStatusCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [topCategories, setTopCategories] = useState([]);
  const [salesSummary, setSalesSummary] = useState({
    today: 0,
    week: 0,
    month: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const role = sessionStorage.getItem("role");
  const { token } = useToken();
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getProductStatus(), getStatusCount()])
      .then(([productResponse, statusResponse]) => {
        setProductCount(productResponse.data.productCount);
        setStatusCount(statusResponse.data.pending);
        setLowStockItems(productResponse.data.lowStockCount);

        // Simulate getting top categories
        setTopCategories([
          { name: "Electronics", percent: 75 },
          { name: "Office Supplies", percent: 60 },
          { name: "Furniture", percent: 35 },
        ]);

        // Simulate sales summary data
        setSalesSummary({
          today: 1250,
          week: 8750,
          month: 32500,
        });

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
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

  const handleQuickAction = (path) => {
    navigate(path);
  };

  return (
    <div className='dashboard-container'>
      <h1 className='dashboard-title'>Dashboard Overview</h1>
      <p className='dashboard-date'>{currentDate}</p>

      <div className='dashboard-summary'>
        <p className='summary-text'>
          Welcome back! You have{" "}
          <span className='summary-highlight'>{productCount}</span> products,{" "}
          {""}
          <span className='summary-highlight'>{lowStockItems}</span> items with
          low stock,
          <span className='summary-highlight'> {statusCount}</span> pending
          orders, and your revenue this month is
          <span className='summary-highlight'>
            {" "}
            ${salesSummary.month.toLocaleString()}
          </span>
          .
        </p>
      </div>

      <div className='quick-actions'>
        <h3 className='actions-title'>Quick Actions</h3>
        <div className='actions-grid'>
          <button
            className='action-button'
            onClick={() => handleQuickAction("/products")}>
            <div className='action-icon'>
              <PlusSquare size={20} />
            </div>
            <span className='action-text'>Add Product</span>
          </button>
          <button
            className='action-button'
            onClick={() => handleQuickAction("/orders")}>
            <div className='action-icon'>
              <ListOrdered size={20} />
            </div>
            <span className='action-text'>New Order</span>
          </button>
          <button
            className='action-button'
            onClick={() => handleQuickAction("/categories")}>
            <div className='action-icon'>
              <FolderPlus size={20} />
            </div>
            <span className='action-text'>Add Category</span>
          </button>
          <button
            className='action-button'
            onClick={() => handleQuickAction("/alerts")}>
            <div className='action-icon'>
              <Bell size={20} />
            </div>
            <span className='action-text'>View Alerts</span>
          </button>
        </div>
      </div>

      <div className='card-grid'>
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

      {/* Inventory Category Performance */}
      <div className='inventory-summary'>
        <h3 className='inventory-title'>Inventory Performance by Category</h3>
        {topCategories.map((category, index) => (
          <div className='progress-container' key={index}>
            <div className='progress-label'>
              <span className='progress-name'>{category.name}</span>
              <span className='progress-value'>{category.percent}%</span>
            </div>
            <div className='progress-bar'>
              <div
                className={`progress-fill ${
                  category.percent > 70
                    ? "high"
                    : category.percent > 40
                    ? "medium"
                    : "low"
                }`}
                style={{ width: `${category.percent}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className='chart-grid'>
        <div className='chart-container'>
          <h2 className='chart-title'>
            <LineChartIcon size={20} className='chart-title-icon' />
            Stock Movement Trends
          </h2>
          <div className='chart-box'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={stockChart}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='value'
                  name='Actual Stock'
                  stroke='#4F46E5'
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type='monotone'
                  dataKey='average'
                  name='Target Level'
                  stroke='#10B981'
                  strokeWidth={2}
                  strokeDasharray='5 5'
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='chart-container'>
          <h2 className='chart-title'>
            <PieChartIcon size={20} className='chart-title-icon' />
            Order Volume Trends
          </h2>
          <div className='chart-box'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={ordersChart}
                  dataKey='orders'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill='#8884d8'>
                  {ordersChart.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} orders`, "Volume"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
