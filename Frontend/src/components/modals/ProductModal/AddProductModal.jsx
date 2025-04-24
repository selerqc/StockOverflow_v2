import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Space,
  message,
} from "antd";
import axios from "axios";
import useFetch from "../../../hooks/useFetch";
import { useToken } from "../../../hooks/TokenContext";

import { baseURL } from "../../../../config.js";

const { Title } = Typography;
const { Option } = Select;

const ProductModal = ({ onClose }) => {
  const [form] = Form.useForm();
  const [productOptions, setProductOptions] = useState([]);
  const { data } = useFetch(`${baseURL}/category/getCategory`);
  const { token } = useToken();
  useEffect(() => {
    if (data) {
      setProductOptions(data.getCategory);
      console.log(data.getCategory);
    }
  }, [data]);

  const handleSubmit = async (values) => {
    const { name, category, price, stock_level, sku } = values;

    try {
      console.log(values);
      const response = await axios.post(
        `${baseURL}/products/addProduct`,
        {
          name: name,
          category_id: category,
          price: price,
          stock_level: stock_level,
          sku: sku,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newAlert = {
        type: "info",
        message: `Product ${values.name} added successfully`,
        date: response.data?.product || new Date(),
        priority: "medium",
      };

      await axios.post(`${baseURL}/alerts/addAlerts`, newAlert, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success(`Product ${values.name} added successfully`);
      onClose();
    } catch (error) {
      message.error(
        error.response?.data?.error || error.message || "An error occurred"
      );
      console.log(error);
    }
  };

  return (
    <Modal
      title={<Title level={4}>Add New Product</Title>}
      open={true}
      onCancel={onClose}
      footer={null}>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          name: "",
          category: "",
          price: 0,
          stock_level: 0,
          sku: "",
        }}
        onFinish={handleSubmit}>
        <Form.Item
          label='Product Name'
          name='name'
          rules={[{ required: true, message: "Please enter the product name" }]}
          style={{ marginBottom: "1rem" }}>
          <Input placeholder='Enter product name' />
        </Form.Item>

        <Form.Item
          label='Category'
          name='category'
          rules={[{ required: true, message: "Please select a category" }]}
          style={{ marginBottom: "1rem" }}>
          <Select placeholder='Select a category'>
            {productOptions.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label='Price'
          name='price'
          rules={[{ required: true, message: "Please enter the price" }]}
          style={{ marginBottom: "1rem" }}>
          <Input type='number' placeholder='Enter price' min={0} step={1} />
        </Form.Item>

        <Form.Item
          label='Stock Level'
          name='stock_level'
          rules={[{ required: true, message: "Please enter the stock level" }]}
          style={{ marginBottom: "1rem" }}>
          <Input
            type='number'
            placeholder='Enter stock level'
            min={0}
            step={1}
          />
        </Form.Item>

        <Form.Item
          label='SKU'
          name='sku'
          rules={[
            { required: true, message: "Please enter the SKU" },
            { min: 3, message: "SKU must be at least 3 characters" },
          ]}
          style={{ marginBottom: "1rem" }}>
          <Input placeholder='Enter SKU' />
        </Form.Item>

        <Form.Item>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type='primary' htmlType='submit'>
              Add Product
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;
