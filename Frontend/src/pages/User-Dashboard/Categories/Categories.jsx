import React, { useState, useEffect } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  TagsOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
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
  Badge,
  Tag,
  Row,
  Col,
  List,
  Avatar,
  Select,
  Segmented,
  Statistic,
  Progress,
  Spin,
  Drawer,
  Popconfirm,
} from "antd";
import axios from "axios";
import CategoryModal from "../../../components/modals/CategoryModal/AddCategoryModal.jsx";
import EditCategoryModal from "../../../components/modals/CategoryModal/EditCategoryModal.jsx";
import "./Categories.css";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productCounts, setProductCounts] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailsCategory, setDetailsCategory] = useState(null);

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
  }, [categories, productCounts]);

  const fetchCategories = async () => {
    if (role === "Admin") {
      await axios
        .get(`${baseURL}/admin/getAllCategories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const categoriesData = response.data.data;
          setCategories(categoriesData);


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
          const categoriesData = response.data.getCategory;
          setCategories(categoriesData);

          // Simulate product counts for display purposes
          const mockProductCounts = {};
          categoriesData.forEach(cat => {
            mockProductCounts[cat._id] = Math.floor(Math.random() * 20);
          });
          setProductCounts(mockProductCounts);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
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
    confirm({
      title: "Delete Category",
      icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
      content: "Are you sure you want to delete this category? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
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

  const handleViewDetails = (category) => {
    setDetailsCategory(category);
    setDetailsVisible(true);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

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


  // Filter and sort categories
  const filteredCategories = categories
    .filter((category) => category.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        comparison = new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'products') {
        comparison = (productCounts[b._id] || 0) - (productCounts[a._id] || 0);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Grid view renderer
  const renderGridView = () => {
    return (
      <Row gutter={[16, 16]}>
        {filteredCategories.map(category => (
          <Col xs={24} sm={12} md={8} lg={6} key={category._id}>

            <Card
              hoverable
              className="category-card"
              actions={[
                <Tooltip title="View Details">
                  <Text type="secondary" strong onClick={() => handleViewDetails(category)}>View Details</Text>

                </Tooltip>,

              ]}
            >
              <Card.Meta
                title={category.name.toUpperCase()}
                description={
                  <Space direction="vertical" size={0}>
                    <Text type="secondary" ellipsis>
                      {category.description || "No description"}
                    </Text>
                    <Text type="secondary">Updated:{getTimeAgo(category.updatedAt)}</Text>
                  </Space>
                }
              />
            </Card>

          </Col>
        ))}
      </Row>
    );
  };

  // List view renderer
  const renderListView = () => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={filteredCategories}
        renderItem={(category) => (
          <List.Item
            key={category._id}
            actions={[
              <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetails(category)}>
                View
              </Button>,
              <Button type="text" icon={<EditOutlined />} onClick={() => handleEditCategory(category)}>
                Edit
              </Button>,
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteCategory(category._id)}>
                Delete
              </Button>
            ]} >
            <List.Item.Meta

              title={<a onClick={() => handleViewDetails(category)}>{category.name.toUpperCase()}</a>}
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary" ellipsis style={{ maxWidth: 500 }}>
                    {category.description || "No description available"}
                  </Text>
                  <Space>
                    <Tag>Created: {new Date(category.createdAt).toLocaleDateString()}</Tag>
                    <Tag>Updated: {getTimeAgo(category.updatedAt)}</Tag>
                  </Space>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  return (
    <div className="categories-container">
      {/* Page Header */}
      <Card className="page-header-card">
        <Flex justify="space-between" align="center" wrap="wrap">
          <Space direction="vertical" size={0}>
            <Title level={2} style={{ margin: 0 }}>
              Category Management
            </Title>
            <Text type="secondary">Manage your inventory categories</Text>
          </Space>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="middle"
              onClick={handleAddCategory}
            >
              Add Category
            </Button>
            <Button
              icon={<ReloadOutlined spin={refreshing} />}
              onClick={handleRefresh}
              loading={refreshing}
            >
              Refresh
            </Button>
          </Space>
        </Flex>
      </Card>

      <Card className="search-filter-card" style={{ marginBottom: 16 }}>
        <Flex gap={16} justify="space-between" align="center" wrap="wrap">
          <Input.Search
            allowClear
            placeholder="Search categories..."
            style={{ maxWidth: 400, flexGrow: 1 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
          />

          <Space>
            <Select
              defaultValue="name"
              style={{ width: 120 }}
              onChange={handleSortChange}
              value={sortBy}
            >
              <Option value="name">Name</Option>
              <Option value="date">Date</Option>
              <Option value="products">Products</Option>
            </Select>
            <Button
              icon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortAscendingOutlined rotate={180} />}
              onClick={handleOrderChange}
            />
            <Segmented
              options={[
                {
                  value: 'grid',
                  icon: <AppstoreOutlined />,
                },
                {
                  value: 'list',
                  icon: <UnorderedListOutlined />,
                },
              ]}
              value={viewMode}
              onChange={setViewMode}
            />
          </Space>
        </Flex>
      </Card>


      {loading ? (
        <Card>
          <Flex justify="center" align="center" style={{ padding: 40 }}>
            <Spin size="large" tip="Loading categories..." />
          </Flex>
        </Card>
      ) : filteredCategories.length > 0 ? (
        <Card bodyStyle={{ padding: viewMode === 'grid' ? 30 : 30 }}>
          {viewMode === 'grid' ? renderGridView() : renderListView()}
        </Card>
      ) : (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchTerm
                ? "No categories match your search"
                : "No categories found"
            }
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
              Add Category
            </Button>
          </Empty>
        </Card>
      )}

      {/* Category Modal */}
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


      <Drawer
        title={detailsCategory?.name?.toUpperCase() || "Category Details"}
        placement="right"
        onClose={() => setDetailsVisible(false)}
        open={detailsVisible}
        width={500}
        extra={
          <Space>
            <Button onClick={() => detailsCategory && handleEditCategory(detailsCategory)} icon={<EditOutlined />}>Edit</Button>
            <Button onClick={() => handleDeleteCategory(detailsCategory._id)} icon={<DeleteOutlined />} danger>Delete</Button>
          </Space>
        }
      >
        {detailsCategory && (
          <>
            <Card title="Details" style={{ marginBottom: 16 }}>
              <List>
                <List.Item>
                  <Text strong>Category ID:</Text>
                  <Text copyable>{detailsCategory._id}</Text>
                </List.Item>
                <List.Item>
                  <Text strong>Created:</Text>
                  <Text>{new Date(detailsCategory.createdAt).toLocaleString()}</Text>
                </List.Item>
                <List.Item>
                  <Text strong>Last Updated:</Text>
                  <Text>{getTimeAgo(detailsCategory.updatedAt)}</Text>
                </List.Item>

              </List>
            </Card>

            <Card title="Description">
              <Paragraph>{detailsCategory.description || "No description available"}</Paragraph>
            </Card>


          </>
        )}
      </Drawer>
    </div>
  );
};

export default Categories;
