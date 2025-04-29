import React, { useState, useEffect } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  DownOutlined,
  RightOutlined,
  TagsOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Typography,
  Button,
  Input,
  Card,
  Modal,
  message,
  Flex,
  Empty,
  Skeleton,
  Tooltip,
  Space,
  Divider,
  Badge,
  Tag,
  Row,
  Col,
  Collapse,
  List,
  Avatar,
} from "antd";
import { Package } from "lucide-react";
import axios from "axios";
import CategoryModal from "../../../components/modals/CategoryModal/AddCategoryModal.jsx";
import EditCategoryModal from "../../../components/modals/CategoryModal/EditCategoryModal.jsx";
import "./Categories.css";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";

const { Panel } = Collapse;
const { Title, Text, Paragraph } = Typography;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productCounts, setProductCounts] = useState({});
  const { token } = useToken();
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    fetchCategories();
    const interval = setInterval(fetchCategories, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const fetchCategories = async () => {
    if (role === "Admin") {
      await axios
        .get(`${baseURL}/admin/getAllCategories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCategories(response.data.data);
          fetchProductCounts(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    } else {
      await axios
        .get(`${baseURL}/category/getCategory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCategories(response.data.getCategory);
          fetchProductCounts(response.data.getCategory);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    }
  };

  const fetchProductCounts = async (categories) => {
    try {
      const counts = {};
      // This is a simplified version - in a real application you might fetch this from an endpoint
      for (const category of categories) {
        await axios
          .get(`${baseURL}/product/getProductsByCategory/${category._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            counts[category._id] = response.data?.products?.length || 0;
          })
          .catch(() => {
            counts[category._id] = 0;
          });
      }
      setProductCounts(counts);
    } catch (error) {
      console.error("Error fetching product counts:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setTimeout(() => {
      setRefreshing(false);
      message.success("Categories refreshed successfully");
    }, 800);
  };

  const handleAddCategory = () => {
    setSelectedCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    Modal.confirm({
      title: "Delete Category",
      content:
        "Are you sure you want to delete this category? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      icon: <InfoCircleOutlined style={{ color: "red" }} />,
      onOk: async () => {
        try {
          await axios.delete(
            `${baseURL}/category/deleteCategory/${categoryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCategories(
            categories.filter((category) => category._id !== categoryId)
          );
          message.success("Category deleted successfully");
        } catch (error) {
          message.error("Failed to delete category");
        }
      },
    });
  };

  const handleSaveCategory = (categoryData) => {
    if (categoryData._id) {
      setCategories(
        categories.map((category) =>
          category._id === categoryData._id ? categoryData : category
        )
      );
    } else {
      setCategories([...categories, categoryData]);
    }
    setIsModalOpen(false);
    setSelectedCategory(undefined);
  };

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Panel header render function with action buttons
  const panelHeader = (category) => (
    <div className='category-panel-header'>
      <div className='panel-title'>
        <Avatar
          icon={<TagsOutlined />}
          style={{ backgroundColor: "#1677ff" }}
        />
        <Text strong>{category.name.toUpperCase()}</Text>
      </div>
      <div className='panel-actions'>
        <Badge
          count={productCounts[category._id] || 0}
          overflowCount={99}
          style={{ marginRight: "16px" }}>
          <Tag color='processing'>Products</Tag>
        </Badge>
        <Space>
          <Tooltip title='Edit Category'>
            <Button
              type='text'
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEditCategory(category);
              }}
            />
          </Tooltip>
          <Tooltip title='Delete Category'>
            <Button
              type='text'
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(category._id);
              }}
            />
          </Tooltip>
        </Space>
      </div>
    </div>
  );

  // Custom expand icon
  const expandIcon = ({ isActive }) => {
    return isActive ? <DownOutlined /> : <RightOutlined />;
  };

  return (
    <div className='categories-container'>
      <div className='page-header'>
        <Flex justify='space-between' align='center' className='header-content'>
          <Space direction='vertical' size={1}>
            <Title level={2} style={{ margin: 0 }}>
              Category Management
            </Title>
            <Text type='secondary'>Manage your inventory categories</Text>
          </Space>
        </Flex>
      </div>

      <Card className='search-panel'>
        <Space size='middle' style={{ marginBottom: "16px" }} wrap>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={handleAddCategory}>
            Add Category
          </Button>
          <Tooltip title='Refresh categories'>
            <Button
              icon={<ReloadOutlined spin={refreshing} />}
              onClick={handleRefresh}
              loading={refreshing}>
              {" "}
              Refresh{" "}
            </Button>
          </Tooltip>
        </Space>

        <Input
          size='large'
          placeholder='Search categories by name...'
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </Card>

      {loading ? (
        <Card>
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </Card>
      ) : filteredCategories.length > 0 ? (
        <Collapse
          className='categories-accordion'
          expandIcon={expandIcon}
          defaultActiveKey={[filteredCategories[0]?._id]}>
          {filteredCategories.map((category) => (
            <Panel
              key={category._id}
              header={panelHeader(category)}
              className='category-panel'>
              <div className='category-details'>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card title='Category Information' variant={false}>
                      <List>
                        <List.Item>
                          <Text strong>ID:</Text>
                          <Text copyable>{category._id}</Text>
                        </List.Item>
                        <List.Item>
                          <Text strong>Created:</Text>
                          <Text>
                            {new Date(category.createdAt).toLocaleString()}
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text strong>Last Updated:</Text>
                          <Text>{getTimeAgo(category.updatedAt)}</Text>
                        </List.Item>
                      </List>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title='Description' variant={false}>
                      <Paragraph>
                        {category.description || "No description available"}
                      </Paragraph>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Panel>
          ))}
        </Collapse>
      ) : (
        <div className='empty-state'>
          <Empty
            description={
              searchTerm
                ? "No categories match your search"
                : "No categories found"
            }
          />
        </div>
      )}

      {isModalOpen && selectedCategory ? (
        <EditCategoryModal
          category={selectedCategory}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(undefined);
          }}
        />
      ) : (
        isModalOpen && (
          <CategoryModal
            onSave={handleSaveCategory}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedCategory(undefined);
            }}
          />
        )
      )}
    </div>
  );
};

// Add this component to display stats
const Statistic = ({ title, value, prefix }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "24px", marginBottom: "8px" }}>
        {prefix && <span style={{ marginRight: "8px" }}>{prefix}</span>}
        {value}
      </div>
      <div style={{ fontSize: "14px", color: "#8c8c8c" }}>{title}</div>
    </div>
  );
};

export default Categories;
