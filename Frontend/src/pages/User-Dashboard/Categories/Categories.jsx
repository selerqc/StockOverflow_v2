import React, { useState, useEffect } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
import { Button, Input, Card, Modal, message, Flex, Switch } from "antd";
import { Package } from "lucide-react";
import axios from "axios";
import CategoryModal from "../../../components/modals/CategoryModal/AddCategoryModal.jsx";
import EditCategoryModal from "../../../components/modals/CategoryModal/EditCategoryModal.jsx";
import "./Categories.css";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const { token } = useToken();
  const { Title, Text } = Typography;
  const role = sessionStorage.getItem("role");
  useEffect(() => {
    fetchCategories();
    const interval = setInterval(fetchCategories, 1000);
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
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    }
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
      title: "Are you sure you want to delete this category?",
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

  return (
    <div className='categories-container'>
      <div className='header'>
        <h1 className='title'>Category Management</h1>
        <button
          className='add-category-button'
          style={{ backgroundColor: "#2563eb", border: "none", color: "white" }}
          icon={<PlusOutlined />}
          onClick={handleAddCategory}>
          Add Category
        </button>
      </div>

      <div className='categories-panel'>
        <Input
          placeholder='Search categories...'
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "1.5rem" }}
        />

        <div className='categories-grid'>
          {filteredCategories.map((category) => (
            <Card
              hoverable
              variant='borderless'
              loading={loading}
              key={category._id}
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}>
                  <Package size={20} />
                  {category.name.toUpperCase()}
                </div>
              }
              extra={
                <>
                  <Button
                    type='link'
                    icon={<EditOutlined />}
                    onClick={() => handleEditCategory(category)}
                  />
                  <Button
                    type='link'
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteCategory(category._id)}
                  />
                </>
              }>
              <Title level={5} style={{ marginTop: "0rem" }}>
                Product Description: {category.description}
              </Title>
              <Text type='secondary'>
                Updated: {new Date(category.updatedAt).toLocaleDateString()}
              </Text>
            </Card>
          ))}
        </div>
      </div>

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

export default Categories;
