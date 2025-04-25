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

const EditProductModal = ({ product, onClose }) => {
  const [form] = Form.useForm();
  const [productOptions, setProductOptions] = useState([]);
  const { data } = useFetch(`${baseURL}/category/getCategory`);
  const { token } = useToken();
  useEffect(() => {
    if (data) {
      setProductOptions(data.getCategory);
    }
    if (product) {
      form.setFieldsValue({
        name: product.name,
        category: product.category_id._id,
        price: product.price,
        stock_level: product.stock_level,
        sku: product.sku,
      });
    }
  }, [data, product, form]);

  const handleSubmit = async (values) => {
    try {
      const { name, price, category, stock_level, sku } = values;
      console.log(values);
      const response = await axios.patch(
        `${baseURL}/products/updateProduct/${product._id}`,
        {
          name: name,
          category_id: category,
          price: price.toString(),
          stock_level: stock_level.toString(),
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
        message: `Product ${values.name} updated successfully`,
        date: response.data.product,
        priority: "medium",
      };

      await axios.post(`${baseURL}/alerts/addAlerts`, newAlert, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success(`Product ${values.name} updated successfully`);
      onClose();
    } catch (error) {
      message.error(error.response?.data?.error || "An error occurred");
      console.log(error);
    }
  };

  return (
    <Modal
      title={<Title level={4}>Edit Product</Title>}
      open={true}
      onCancel={onClose}
      footer={null}>
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
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
              Update Product
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
