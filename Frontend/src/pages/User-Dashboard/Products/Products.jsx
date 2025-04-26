import React, { useState, useEffect } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Table, Button, Input, Select, Modal, Badge } from "antd";
import AddProductModal from "../../../components/modals/ProductModal/AddProductModal";
import EditProductModal from "../../../components/modals/ProductModal/EditProductModal";
import axios from "axios";
import "./Products.css";
import { useToken } from "../../../hooks/TokenContext";

import { baseURL } from "../../../../config";

const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const { token } = useToken();
  const role = sessionStorage.getItem("role");
  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 1000);
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
          setProducts(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    } else {
      await axios
        .get(`${baseURL}/products/getProduct`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setProducts(response.data.product);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
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
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      onOk: async () => {
        setProducts(products.filter((p) => p._id !== productId));
        await axios
          .delete(`${baseURL}/products/deleteProduct/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(async () => {
            const newAlert = {
              type: "info",
              message: `Product ${productName} Deleted successfully`,
              date: new Date(),
              priority: "medium",
            };

            await axios.post(`${baseURL}/alerts/addAlerts`, newAlert, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          });
      },
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
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
            render: (text) => `#${text.slice(0, 5)}...`,
          },
        ]
      : []),

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: ["category_id", "name"],
      key: "category",
      render: (text) => text || "Unknown",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Stock Level",
      dataIndex: "stock_level",
      key: "stock_level",
      render: (stock_level) => (
        <Badge
          count={stock_level}
          style={{
            backgroundColor: stock_level <= 20 ? "#ff4d4f" : "#52c41a",
          }}
        />
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, product) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(product)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteProduct(product._id, product.name)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className='inventory-container'>
      <div className='inventory-header'>
        <h1 className='inventory-title'>Inventory Management</h1>
        <button className='add-product-button' onClick={handleAddProduct}>
          Add Product
        </button>
      </div>

      <div className='inventory-panel'>
        <div className='search-filter-container'>
          <Input
            placeholder='Search products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%" }}
          />
          <Select
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            style={{ width: "200px" }}>
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey='_id'
          loading={loading}
        />
      </div>

      {isAddModalOpen && (
        <AddProductModal
          onClose={() => {
            setIsAddModalOpen(false);
          }}
        />
      )}

      {isEditModalOpen && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(undefined);
          }}
        />
      )}
    </div>
  );
};

export default Products;
