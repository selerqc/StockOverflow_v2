import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { TrendingUp, Package, ShoppingCart, AlertTriangle } from "lucide-react";
import DashboardCard from "../../../components/Card/DashboardCard";
import "./Analytics.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";
const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 2000 },
  { month: "Apr", sales: 2780 },
  { month: "May", sales: 1890 },
  { month: "Jun", sales: 2390 },
];

const stockData = [
  { name: "Electronics", value: 100 },
  { name: "Office Supplies", value: 80 },
  { name: "Furniture", value: 50 },
  { name: "Others", value: 150 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Analytics = () => {
  const [productCount, setProductCount] = useState(0);
  const [statusCount, setStatusCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const { token } = useToken();
  const role = sessionStorage.getItem("role");
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
    <div className='analytics-container'>
      <h1 className='analytics-title'>Analytics Dashboard</h1>

      <div className='card-grid'>
        <DashboardCard
          title='Total Revenue'
          value='$45,678'
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title='Total Products'
          value={productCount}
          icon={Package}
          trend={{ value: productCount, isPositive: productCount > 50 }}
        />
        <DashboardCard
          title='Total Orders'
          value={statusCount}
          icon={ShoppingCart}
          trend={{ value: statusCount, isPositive: statusCount > 20 }}
        />
        <DashboardCard
          title='Low Stock Items'
          value={lowStockItems}
          icon={AlertTriangle}
          trend={{ value: lowStockItems, isPositive: lowStockItems < 20 }}
        />
      </div>

      <div className='chart-grid'>
        <div className='analytics-chart-box'>
          <h2 className='analytics-chart-title'>Monthly Sales</h2>
          <div className='analytics-chart-container'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Line type='monotone' dataKey='sales' stroke='#4F46E5' />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='analytics-chart-box'>
          <h2 className='analytics-chart-title'>Stock Distribution</h2>
          <div className='analytics-chart-container'>
            <ResponsiveContainer width='100%' height='100%'>
              <RadarChart cx='50%' cy='50%' outerRadius='80%' data={stockData}>
                <PolarGrid />
                <PolarAngleAxis dataKey='name' />
                <PolarRadiusAxis />
                <Radar
                  name='Stock'
                  dataKey='value'
                  stroke='#4F46E5'
                  fill='#4F46E5'
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
