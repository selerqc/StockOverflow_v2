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
  Calendar,
  Clock,
  Activity,
  RefreshCcw,
} from "lucide-react";
import {
  Card,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  Spin,
  Alert,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  OrderedListOutlined,
  FolderAddOutlined,
  BellOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const { token } = useToken();
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchDashboardData();

    // Optional: Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const handleQuickAction = (path) => {
    navigate(path);
  };

  return (
    <div className='dashboard-container'>
      <div className='dashboard-header'>
        <h1 className='dashboard-title'>Dashboard Overview</h1>
        <button
          className='refresh-button'
          onClick={fetchDashboardData}
          disabled={isRefreshing}>
          <RefreshCcw size={16} className={isRefreshing ? "spin" : ""} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
        </button>
      </div>
      <p className='dashboard-date'>{currentDate}</p>

      {isLoading ? (
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Quick Actions with Ant Design */}
          <Card
            title={
              <Space>
                <ThunderboltOutlined style={{ color: "#4F46E5" }} />
                <Typography.Title level={4} style={{ margin: 0 }}>
                  Quick Actions
                </Typography.Title>
              </Space>
            }
            className='quick-actions-card'>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type='primary'
                  ghost
                  icon={<PlusOutlined />}
                  block
                  size='large'
                  onClick={() => handleQuickAction("/products")}
                  className='action-btn'>
                  <div className='action-btn-content'>
                    <Typography.Text strong>Add Product</Typography.Text>
                    <Typography.Text
                      type='secondary'
                      style={{ fontSize: "12px" }}>
                      Create a new product listing
                    </Typography.Text>
                  </div>
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type='primary'
                  ghost
                  icon={<OrderedListOutlined />}
                  block
                  size='large'
                  onClick={() => handleQuickAction("/orders")}
                  className='action-btn'>
                  <div className='action-btn-content'>
                    <Typography.Text strong>New Order</Typography.Text>
                    <Typography.Text
                      type='secondary'
                      style={{ fontSize: "12px" }}>
                      Process a customer order
                    </Typography.Text>
                  </div>
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type='primary'
                  ghost
                  icon={<FolderAddOutlined />}
                  block
                  size='large'
                  onClick={() => handleQuickAction("/categories")}
                  className='action-btn'>
                  <div className='action-btn-content'>
                    <Typography.Text strong>Add Category</Typography.Text>
                    <Typography.Text
                      type='secondary'
                      style={{ fontSize: "12px" }}>
                      Create a product category
                    </Typography.Text>
                  </div>
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type='primary'
                  ghost
                  icon={<BellOutlined />}
                  block
                  size='large'
                  onClick={() => handleQuickAction("/alerts")}
                  className='action-btn'>
                  <div className='action-btn-content'>
                    <Typography.Text strong>View Alerts</Typography.Text>
                    <Typography.Text
                      type='secondary'
                      style={{ fontSize: "12px" }}>
                      Check inventory alerts
                    </Typography.Text>
                  </div>
                </Button>
              </Col>
            </Row>
          </Card>

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

          {/* New Sections: Activities and Calendar */}
          <div className='secondary-grid'>
            <div className='activities-container'>
              <h3 className='section-title'>
                <Activity size={20} className='section-icon' />
                Recent Activities
              </h3>
              <div className='activities-list'>
                {recentActivities.length === 0 ? (
                  <p className='no-data-message'>No recent activities found</p>
                ) : (
                  recentActivities.map((activity) => (
                    <div className='activity-item' key={activity.id}>
                      <div className={`activity-icon ${activity.type}`}>
                        {activity.type === "product" && <Package size={16} />}
                        {activity.type === "order" && (
                          <ShoppingCart size={16} />
                        )}
                        {activity.type === "alert" && (
                          <AlertTriangle size={16} />
                        )}
                        {activity.type === "user" && <Users size={16} />}
                        {activity.type === "transaction" && (
                          <BadgeDollarSign size={16} />
                        )}
                      </div>
                      <div className='activity-details'>
                        <p className='activity-action'>{activity.action}</p>
                        <div className='activity-meta'>
                          <span className='activity-user'>{activity.user}</span>
                          <span className='activity-time'>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className='calendar-container'>
              <h3 className='section-title'>
                <Calendar size={20} className='section-icon' />
                Upcoming Events
              </h3>
              <div className='events-list'>
                {upcomingEvents.length === 0 ? (
                  <p className='no-data-message'>
                    No upcoming events scheduled
                  </p>
                ) : (
                  upcomingEvents.map((event) => (
                    <div className='event-item' key={event.id}>
                      <div className='event-date'>
                        <div className='event-month'>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </div>
                        <div className='event-day'>
                          {new Date(event.date).getDate()}
                        </div>
                      </div>
                      <div className='event-details'>
                        <p className='event-title'>{event.title}</p>
                        <div className='event-time'>
                          <Clock size={14} />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
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
                    <Tooltip
                      formatter={(value) => [`${value} orders`, "Volume"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
