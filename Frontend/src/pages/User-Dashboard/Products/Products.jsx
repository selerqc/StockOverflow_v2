import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Badge,
  Card,
  Space,
  Typography,
  Tooltip,
  Tag,
  Dropdown,
  message,
  Spin,
  Row,
  Col,
  Statistic,
} from "antd";
import AddProductModal from "../../../components/modals/ProductModal/AddProductModal";
import EditProductModal from "../../../components/modals/ProductModal/EditProductModal";
import axios from "axios";
import "./Products.css";
import { useToken } from "../../../hooks/TokenContext";

import { baseURL } from "../../../../config";

const { Option } = Select;
const { Title, Text } = Typography;
const { confirm } = Modal;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [productStats, setProductStats] = useState({
    total: 0,
    lowStock: 0,
    categories: 0,
  });
  const { token } = useToken();
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 10000); // Reduced polling frequency
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    if (role === "Admin") {
      await axios
        .get(`${baseURL}/admin/getAllProducts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const productsData = response.data.data;
          setProducts(productsData);
          calculateStats(productsData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          message.error("Failed to fetch products");
        });
    } else {
      await axios
        .get(`${baseURL}/products/getProduct`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const productsData = response.data.product;
          setProducts(productsData);
          calculateStats(productsData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          message.error("Failed to fetch products");
        });
    }
  };

  const calculateStats = (productsData) => {
    const uniqueCategories = new Set(
      productsData.filter((p) => p.category_id).map((p) => p.category_id._id)
    );

    setProductStats({
      total: productsData.length,
      lowStock: productsData.filter((p) => p.stock_level <= 20).length,
      categories: uniqueCategories.size,
    });
  };

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (productId, productName) => {
    confirm({
      title: "Are you sure you want to delete this product?",
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete ${productName} from your inventory.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setProducts(products.filter((p) => p._id !== productId));
        await axios
          .delete(`${baseURL}/products/deleteProduct/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(async () => {
            message.success(`Product ${productName} deleted successfully`);
            const newAlert = {
              type: "info",
              message: `Product ${productName} deleted successfully`,
              date: new Date(),
              priority: "medium",
            };

            await axios.post(`${baseURL}/alerts/addAlerts`, newAlert, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
            message.error("Failed to delete product");
          });
      },
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchProducts();
    message.success("Products refreshed");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category_id?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { _id: "all", name: "All Categories" },
    ...new Map(
      products
        .filter((p) => p.category_id)
        .map((p) => [p.category_id._id, p.category_id])
    ).values(),
  ];

  const columns = [
    ...(role === "Admin"
      ? [
        {
          title: "Added by",
          dataIndex: "user_id",
          key: "user_id",
          render: (text) => (
            <Tag color='blue'>{`#${text?.slice(0, 5)}...`}</Tag>
          ),
        },
      ]
      : []),

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Category",
      dataIndex: ["category_id", "name"],
      key: "category",
      sorter: (a, b) =>
        (a.category_id?.name || "").localeCompare(b.category_id?.name || ""),
      render: (text) =>
        text ? (
          <Tag color='purple'>{text}</Tag>
        ) : (
          <Tag color='default'>Unknown</Tag>
        ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => <Text type='success'>${price?.toFixed(2)}</Text>,
    },
    {
      title: "Stock Level",
      dataIndex: "stock_level",
      key: "stock_level",
      sorter: (a, b) => a.stock_level - b.stock_level,
      render: (stock_level) => (
        <Tooltip title={stock_level <= 20 ? "Low stock" : "Sufficient stock"}>
          <Badge
            count={stock_level}
            style={{
              backgroundColor: stock_level <= 20 ? "#ff4d4f" : "#52c41a",
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      render: (sku) => <Text code>{sku}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, product) => (
        <Space>
          <Tooltip title='Edit Product'>
            <Button
              icon={<EditOutlined />}
              type='primary'
              ghost
              onClick={() => handleEditProduct(product)}
            />
          </Tooltip>
          <Tooltip title='Delete Product'>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDeleteProduct(product._id, product.name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className='inventory-container'>
      <Title level={2} className='inventory-title'>
        <Space>
          Inventory Management
          <Tooltip title='Last updated just now'>
            <InfoCircleOutlined
              style={{ fontSize: "16px", color: "#8c8c8c" }}
            />
          </Tooltip>
        </Space>
      </Title>

      <Row gutter={[16, 16]} className='stats-row'>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title='Total Products'
              value={productStats.total}
              prefix={<span style={{ color: "#1890ff" }}>📦</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title='Low Stock Items'
              value={productStats.lowStock}
              valueStyle={{
                color: productStats.lowStock > 5 ? "#cf1322" : "#3f8600",
              }}
              prefix={<span style={{ color: "#cf1322" }}>⚠️</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title='Categories'
              value={productStats.categories}
              prefix={<span style={{ color: "#722ed1" }}>🔖</span>}
            />
          </Card>
        </Col>
      </Row>

      <Card className='inventory-panel'>
        <Space style={{ marginBottom: 16 }} size='middle' wrap>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={handleAddProduct}>
            Add Product
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            Refresh
          </Button>
        </Space>

        <Row gutter={[16, 16]} className='search-filter-container'>
          <Col xs={24} md={16}>
            <Input
              placeholder='Search products by name or SKU...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              style={{ width: "100%" }}
              placeholder='Filter by category'
              prefix={<FilterOutlined />}>
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey='_id'
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
          }}
          bordered
          scroll={{ x: "max-content" }}
        />
      </Card>

      {isAddModalOpen && (
        <AddProductModal
          onClose={() => {
            setIsAddModalOpen(false);
            fetchProducts(); // Refresh products after adding
          }}
        />
      )}

      {isEditModalOpen && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(undefined);
            fetchProducts(); // Refresh products after editing
          }}
        />
      )}
    </div>
  );
};

export default Products;
