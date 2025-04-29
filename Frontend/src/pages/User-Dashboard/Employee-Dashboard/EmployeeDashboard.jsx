import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Progress,
  List,
  Button,
  Space,
  Badge,
  Divider,
  Timeline,
  Alert,
  Calendar,
} from "antd";
import {
  ShoppingCartOutlined,
  FileSearchOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  InboxOutlined,
  SyncOutlined,
  DownloadOutlined,
  BarChartOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";
import "./EmployeeDashboard.css";

const { Title, Text } = Typography;

const EmployeeDashboard = () => {
  const [ordersToProcess, setOrdersToProcess] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [taskStats, setTaskStats] = useState({
    completed: 0,
    pending: 0,
    processing: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useToken();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      fetchOrdersToProcess(),
      fetchLowStockItems(),
      fetchRecentActivity(),
      fetchTaskStats(),
    ])
      .then(([ordersData, stockData, activityData, statsData]) => {
        setOrdersToProcess(ordersData);
        setLowStockItems(stockData);
        setRecentActivity(activityData);
        setTaskStats(statsData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      });
  }, []);

  // Mock fetch functions - replace with actual API calls in production
  const fetchOrdersToProcess = async () => {
    return await axios
      .get(`${baseURL}/transactions/getTransactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data.data)
      .catch((error) => {
        console.error("Error fetching orders to process:", error);
        return [];
      });
  };

  const fetchLowStockItems = async () => {
    return await axios
      .get(`${baseURL}/products/getProductStatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data.getProductsThatHaveLowStock)
      .catch((error) => {
        console.error("Error fetching low stock items:", error);
        return [];
      });
  };

  const fetchRecentActivity = async () => {
    return await axios
      .get(`${baseURL}/alerts/getAlerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data.data)
      .catch((error) => {
        console.error("Error fetching recent activity:", error);
        return [];
      });
  };

  const fetchTaskStats = async () => {
    // Mock data for development
    return {
      completed: 24,
      pending: 8,
      processing: 3,
    };
  };

  const processOrder = (orderId) => {
    console.log(`Processing order ${orderId}`);
    // Implement order processing logic here
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => `#${text}`,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "pending" ? "gold" : "blue"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type='primary'
          size='small'
          onClick={() => processOrder(record.id)}>
          Process
        </Button>
      ),
    },
  ];

  return (
    <Layout className='employee-dashboard'>
      <div className='dashboard-header'>
        <div>
          <Title level={2}>Employee Dashboard</Title>
          <Text type='secondary'>{currentDate}</Text>
        </div>
        <div className='welcome-message'>
          <Alert
            message='Welcome back!'
            description={`You have ${taskStats.pending} pending tasks, ${
              lowStockItems.length
            } inventory alerts, and ${
              ordersToProcess.filter((o) => o.status === "pending").length
            } orders to process today.`}
            type='info'
            showIcon
          />
        </div>
      </div>

      {/* Task Stats Section */}
      <Row gutter={[16, 16]} className='stats-row'>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic
              title='Tasks Completed'
              value={taskStats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#3f8600" }}
              suffix={<small>today</small>}
            />
            <div className='stat-trend'>
              <CaretUpOutlined style={{ color: "#3f8600" }} />
              <Text type='secondary'>15% vs yesterday</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic
              title='Pending Orders'
              value={
                ordersToProcess.filter((o) => o.status === "pending").length
              }
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
            <div className='stat-trend'>
              <CaretDownOutlined style={{ color: "#3f8600" }} />
              <Text type='secondary'>3 fewer than yesterday</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic
              title='Low Stock Alerts'
              value={lowStockItems.length}
              prefix={<AlertOutlined />}
              valueStyle={{
                color: lowStockItems > 5 ? "#cf1322" : "#faad14",
              }}
            />
            <div className='stat-trend'>
              <CaretUpOutlined style={{ color: "#cf1322" }} />
              <Text type='secondary'>2 more than yesterday</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Orders Table */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Card
            title='Orders To Process'
            extra={
              <Badge
                count={
                  ordersToProcess.filter((o) => o.status === "pending").length
                }
              />
            }
            variant={false}>
            <Table
              columns={columns}
              dataSource={ordersToProcess}
              rowKey='id'
              pagination={{ pageSize: 5 }}
              size='middle'
            />
          </Card>
        </Col>
      </Row>

      {/* Inventory and Activity Section */}
      <Row gutter={[16, 16]} className='inventory-activity-row'>
        <Col xs={24} lg={12}>
          <Card title='Low Stock Items' variant={false}>
            <List
              itemLayout='horizontal'
              dataSource={lowStockItems}
              renderItem={(item) => (
                <List.Item.Meta
                  title={<Space>{item.name}</Space>}
                  description={`Sku: ${item.sku}  • Current Stock: ${item.stock_level} `}
                />
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title='Recent Activity' bordered={false}>
            <Timeline
              items={recentActivity.map((activity) => ({
                children: (
                  <>
                    <div>{activity.message}</div>
                    <div>
                      <Text type='secondary'>{activity.createdAt}</Text>
                    </div>
                  </>
                ),
                color: activity.is_read ? "green" : "red",
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Productivity and Upcoming Tasks */}
      <Row gutter={[16, 16]} className='productivity-row'>
        <Col xs={24} lg={16}>
          <Card title='Your Task Calendar' bordered={false}>
            <Calendar fullscreen={false} />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default EmployeeDashboard;
