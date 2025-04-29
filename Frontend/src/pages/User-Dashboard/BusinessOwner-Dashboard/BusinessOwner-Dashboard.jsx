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
  Button,
  Space,
  Divider,
  DatePicker,
  Tabs,
  List,
  Avatar,
  Select,
  Alert,
  Tooltip,
} from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
  UserOutlined,
  WarningOutlined,
  ShopOutlined,
  DownloadOutlined,
  PieChartOutlined,
  LineChartOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";
import "./BusinessOwner-Dashboard.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Mock revenue data
const revenueData = [
  { name: "Jan", value: 30000 },
  { name: "Feb", value: 25000 },
  { name: "Mar", value: 38000 },
  { name: "Apr", value: 45000 },
  { name: "May", value: 40000 },
  { name: "Jun", value: 50000 },
  { name: "Jul", value: 55000 },
];

// Mock product category distribution
const categoryData = [
  { name: "Electronics", value: 45 },
  { name: "Office Supplies", value: 25 },
  { name: "Furniture", value: 20 },
  { name: "Other", value: 10 },
];

// Mock profit margin by category
const profitMarginData = [
  { name: "Electronics", margin: 22 },
  { name: "Office Supplies", margin: 35 },
  { name: "Furniture", margin: 18 },
  { name: "Other", margin: 28 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const BusinessOwnerDashboard = () => {
  const [businessMetrics, setBusinessMetrics] = useState({
    totalRevenue: 0,
    monthlyGrowth: 0,
    averageOrderValue: 0,
    customerRetentionRate: 0,
  });
  const [financialHealth, setFinancialHealth] = useState({
    cashOnHand: 0,
    accountsReceivable: 0,
    accountsPayable: 0,
    profitMargin: 0,
  });
  const [inventoryHealth, setInventoryHealth] = useState({
    totalValue: 0,
    turnoverRate: 0,
    totalItems: 0,
    lowStockItems: 0,
  });
  const [topPerformers, setTopPerformers] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
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
      fetchBusinessMetrics(),
      fetchFinancialHealth(),
      fetchInventoryHealth(),
      fetchTopPerformers(),
      fetchTopCustomers(),
    ])
      .then(
        ([
          metricsData,
          financialData,
          inventoryData,
          performersData,
          customersData,
        ]) => {
          setBusinessMetrics(metricsData);
          setFinancialHealth(financialData);
          setInventoryHealth(inventoryData);
          setTopPerformers(performersData);
          setTopCustomers(customersData);
          setIsLoading(false);
        }
      )
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      });
  }, [timeRange]);

  // Mock fetch functions - replace with actual API calls
  const fetchBusinessMetrics = async () => {
    // In production: return await axios.get(`${baseURL}/analytics/business-metrics?timeRange=${timeRange}`...
    return {
      totalRevenue: 283500,
      monthlyGrowth: 18.5,
      averageOrderValue: 750,
      customerRetentionRate: 85,
    };
  };

  const fetchFinancialHealth = async () => {
    return {
      cashOnHand: 125000,
      accountsReceivable: 45000,
      accountsPayable: 30000,
      profitMargin: 28.5,
    };
  };

  const fetchInventoryHealth = async () => {
    return {
      totalValue: 425000,
      turnoverRate: 4.2,
      totalItems: 1250,
      lowStockItems: 15,
    };
  };

  const fetchTopPerformers = async () => {
    return [
      {
        id: 1,
        name: "Wireless Keyboard",
        category: "Electronics",
        sales: 420,
        profitMargin: 25,
      },
      {
        id: 2,
        name: "Office Desk",
        category: "Furniture",
        sales: 350,
        profitMargin: 18,
      },
      {
        id: 3,
        name: "Premium Paper",
        category: "Office Supplies",
        sales: 280,
        profitMargin: 40,
      },
      {
        id: 4,
        name: "External Hard Drive",
        category: "Electronics",
        sales: 275,
        profitMargin: 22,
      },
      {
        id: 5,
        name: "Ergonomic Chair",
        category: "Furniture",
        sales: 250,
        profitMargin: 20,
      },
    ];
  };

  const fetchTopCustomers = async () => {
    return [
      {
        id: 1,
        name: "Acme Corp",
        totalSpent: 28500,
        orderCount: 45,
        lastPurchase: "2025-04-25",
      },
      {
        id: 2,
        name: "TechStart Inc",
        totalSpent: 22000,
        orderCount: 32,
        lastPurchase: "2025-04-27",
      },
      {
        id: 3,
        name: "Global Services",
        totalSpent: 18500,
        orderCount: 28,
        lastPurchase: "2025-04-20",
      },
      {
        id: 4,
        name: "Innovate LLC",
        totalSpent: 15200,
        orderCount: 25,
        lastPurchase: "2025-04-28",
      },
      {
        id: 5,
        name: "Prime Solutions",
        totalSpent: 12800,
        orderCount: 18,
        lastPurchase: "2025-04-15",
      },
    ];
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  const generateReport = (reportType) => {
    console.log(`Generating ${reportType} report`);
    // Implement report generation logic
  };

  const topPerformerColumns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Sales",
      dataIndex: "sales",
      key: "sales",
      render: (sales) => `$${sales.toLocaleString()}`,
    },
    {
      title: "Profit Margin",
      dataIndex: "profitMargin",
      key: "profitMargin",
      render: (margin) => {
        let color = "green";
        if (margin < 20) {
          color = "red";
        } else if (margin < 25) {
          color = "orange";
        }
        return <Tag color={color}>{margin}%</Tag>;
      },
    },
  ];

  return (
    <Layout className='business-owner-dashboard'>
      <div className='dashboard-header'>
        <div>
          <Title level={2}>Business Overview</Title>
          <Text type='secondary'>{currentDate}</Text>
        </div>
        <div className='dashboard-actions'>
          <Space size='middle'>
            <Select
              defaultValue='month'
              style={{ width: 120 }}
              onChange={handleTimeRangeChange}
              className='time-selector'>
              <Option value='week'>This Week</Option>
              <Option value='month'>This Month</Option>
              <Option value='quarter'>This Quarter</Option>
              <Option value='year'>This Year</Option>
            </Select>
            <Button
              type='primary'
              icon={<DownloadOutlined />}
              onClick={() => generateReport("financial")}>
              Export Report
            </Button>
          </Space>
        </div>
      </div>

      {/* Executive Summary Alert */}
      <Alert
        message='Executive Summary'
        description={
          <Paragraph>
            Your business has seen{" "}
            <Text strong>{businessMetrics.monthlyGrowth}% growth</Text> this
            month with total revenue of{" "}
            <Text strong>${businessMetrics.totalRevenue.toLocaleString()}</Text>
            . Current profit margin is at{" "}
            <Text strong>{financialHealth.profitMargin}%</Text> with{" "}
            <Text strong>{inventoryHealth.lowStockItems}</Text> items needing
            attention. Customer retention is strong at{" "}
            <Text strong>{businessMetrics.customerRetentionRate}%</Text>.
          </Paragraph>
        }
        type='info'
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* Key Business Metrics */}
      <Row gutter={[16, 16]} className='stats-row'>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title={
                <Space>
                  <span>Total Revenue</span>
                  <Tooltip title='Total earnings before expenses'>
                    <QuestionCircleOutlined style={{ color: "#8c8c8c" }} />
                  </Tooltip>
                </Space>
              }
              value={businessMetrics.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#3f8600" }}
              suffix={<small>.00</small>}
              formatter={(value) => `${value.toLocaleString()}`}
            />
            <div className='stat-trend positive'>
              <RiseOutlined />
              <Text type='secondary'>
                {businessMetrics.monthlyGrowth}% vs. last period
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title={
                <Space>
                  <span>Profit Margin</span>
                  <Tooltip title='Net profit as percentage of revenue'>
                    <QuestionCircleOutlined style={{ color: "#8c8c8c" }} />
                  </Tooltip>
                </Space>
              }
              value={financialHealth.profitMargin}
              precision={1}
              prefix={<BarChartOutlined />}
              suffix='%'
              valueStyle={{
                color:
                  financialHealth.profitMargin > 25 ? "#3f8600" : "#faad14",
              }}
            />
            <div className='stat-trend positive'>
              <RiseOutlined />
              <Text type='secondary'>2.5% vs. last period</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title={
                <Space>
                  <span>Average Order Value</span>
                  <Tooltip title='Average revenue per order'>
                    <QuestionCircleOutlined style={{ color: "#8c8c8c" }} />
                  </Tooltip>
                </Space>
              }
              value={businessMetrics.averageOrderValue}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#1890ff" }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <div className='stat-trend positive'>
              <RiseOutlined />
              <Text type='secondary'>5.2% vs. last period</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title={
                <Space>
                  <span>Customer Retention</span>
                  <Tooltip title='Percentage of repeat customers'>
                    <QuestionCircleOutlined style={{ color: "#8c8c8c" }} />
                  </Tooltip>
                </Space>
              }
              value={businessMetrics.customerRetentionRate}
              prefix={<UserOutlined />}
              suffix='%'
              valueStyle={{
                color:
                  businessMetrics.customerRetentionRate > 80
                    ? "#3f8600"
                    : "#faad14",
              }}
            />
            <div className='stat-trend positive'>
              <RiseOutlined />
              <Text type='secondary'>3.1% vs. last period</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Financial Overview Section */}
      <Card
        title={
          <Space>
            <DollarOutlined />
            <span>Financial Health</span>
          </Space>
        }
        className='section-card'
        extra={
          <Button type='link' icon={<FileTextOutlined />}>
            Full Financial Report
          </Button>
        }>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card className='inner-card' title='Cash Flow Overview'>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title='Cash on Hand'
                    value={financialHealth.cashOnHand}
                    precision={0}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title='Accounts Receivable'
                    value={financialHealth.accountsReceivable}
                    precision={0}
                    formatter={(value) => `$${value.toLocaleString()}`}
                    valueStyle={{
                      color:
                        financialHealth.accountsReceivable > 50000
                          ? "#faad14"
                          : "#3f8600",
                    }}
                  />
                </Col>
              </Row>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title='Accounts Payable'
                    value={financialHealth.accountsPayable}
                    precision={0}
                    formatter={(value) => `$${value.toLocaleString()}`}
                    valueStyle={{
                      color:
                        financialHealth.accountsPayable > 40000
                          ? "#faad14"
                          : "#3f8600",
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title='Cash Ratio'
                    value={(
                      financialHealth.cashOnHand /
                      financialHealth.accountsPayable
                    ).toFixed(2)}
                    suffix=':1'
                    valueStyle={{
                      color:
                        financialHealth.cashOnHand /
                          financialHealth.accountsPayable >
                        3
                          ? "#3f8600"
                          : "#faad14",
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card className='inner-card' title='Profit Margin by Category'>
              <ResponsiveContainer width='100%' height={200}>
                <BarChart data={profitMarginData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(value) => [`${value}%`, "Profit Margin"]}
                  />
                  <Bar dataKey='margin' fill='#8884d8'>
                    {profitMarginData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Revenue Trends Section */}
      <Card
        title={
          <Space>
            <LineChartOutlined />
            <span>Revenue Trends</span>
          </Space>
        }
        className='section-card'>
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <RechartsTooltip
              formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
            />
            <Area
              type='monotone'
              dataKey='value'
              stroke='#8884d8'
              fill='#8884d8'
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Performers and Inventory Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ShopOutlined />
                <span>Top Performing Products</span>
              </Space>
            }
            className='section-card'>
            <Table
              columns={topPerformerColumns}
              dataSource={topPerformers}
              rowKey='id'
              pagination={false}
              size='middle'
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <span>Category Distribution</span>
              </Space>
            }
            className='section-card'>
            <ResponsiveContainer width='100%' height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  fill='#8884d8'
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }>
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Inventory Health */}
      <Card
        title={
          <Space>
            <WarningOutlined />
            <span>Inventory Health</span>
          </Space>
        }
        className='section-card'
        extra={
          <Button type='link' danger={inventoryHealth.lowStockItems > 10}>
            {inventoryHealth.lowStockItems} Items Need Attention
          </Button>
        }>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className='inner-card'>
              <Statistic
                title='Total Inventory Value'
                value={inventoryHealth.totalValue}
                precision={0}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className='inner-card'>
              <Statistic
                title='Inventory Turnover'
                value={inventoryHealth.turnoverRate}
                precision={1}
                suffix='x yearly'
                valueStyle={{
                  color:
                    inventoryHealth.turnoverRate > 4 ? "#3f8600" : "#faad14",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className='inner-card'>
              <Statistic
                title='Total Items'
                value={inventoryHealth.totalItems}
                precision={0}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className='inner-card'>
              <Statistic
                title='Days of Inventory'
                value={Math.round(365 / inventoryHealth.turnoverRate)}
                suffix='days'
                valueStyle={{
                  color:
                    365 / inventoryHealth.turnoverRate < 100
                      ? "#3f8600"
                      : "#faad14",
                }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Customer Insights */}
      <Card
        title={
          <Space>
            <TeamOutlined />
            <span>Top Customer Accounts</span>
          </Space>
        }
        className='section-card'>
        <List
          itemLayout='horizontal'
          dataSource={topCustomers}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.name}
                description={`${
                  item.orderCount
                } orders • Last purchase: ${new Date(
                  item.lastPurchase
                ).toLocaleDateString()}`}
              />
              <div className='customer-value'>
                <div className='customer-spent'>
                  <Text strong>${item.totalSpent.toLocaleString()}</Text>
                </div>
                <Button size='small' type='link'>
                  View History
                </Button>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </Layout>
  );
};

export default BusinessOwnerDashboard;
