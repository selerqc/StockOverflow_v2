import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import axios from "axios";
import useFetch from "../../../hooks/useFetch";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";

const { Option } = Select;

const OutgoingOrderModal = ({ order, onClose }) => {
  const [productOptions, setProductOptions] = useState([]);
  const [form] = Form.useForm();
  const { token } = useToken();
  const { data, error } = useFetch(`${baseURL}/transactions/getTransactions`);

  useEffect(() => {
    if (error) console.log(error);
    if (data) {
      setProductOptions(data.products);
    }
  }, [data, error]);

  const handleSubmit = async (values) => {
    const formData = {
      ...values,
      product_id:
        productOptions.find((product) => product.name === values.name)?._id ||
        "",
    };

    try {
      await axios.post(`${baseURL}/transactions/outgoingOrder`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const alertMessage = `Outgoing Order ${values.name} created successfully`;

      const newAlert = {
        type: "success",
        message: alertMessage,
        date: new Date().toISOString(),
        is_read: false,
        priority: "low",
      };

      await axios.post(`${baseURL}/alerts/addAlerts`, newAlert, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success(alertMessage);
      onClose();
    } catch (error) {
      console.error("Error creating outgoing order:", error);
      message.error(
        error.response.data.error || "Error creating outgoing order"
      );
    }
  };

  return (
    <Modal
      title={"New Outgoing Order"}
      open={true}
      onCancel={onClose}
      footer={null}>
      <Form
        form={form}
        layout='vertical'
        initialValues={
          order || {
            product_id: "",
            user_id: "",
            name: "",
            customer: "",
            stock_level: 0,
            total_price: 0,
            status: "pending",
          }
        }
        onFinish={handleSubmit}>
        <Form.Item
          label='Product Name'
          name='name'
          rules={[{ required: true, message: "Please select a product" }]}
          style={{ marginBottom: "1rem" }}>
          <Select placeholder='Select a product'>
            {productOptions.map((product) => (
              <Option key={product._id} value={product.name}>
                {product.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label='customer'
          name='customer'
          rules={[{ required: true, message: "Please enter the customer name" }]}

          style={{ marginBottom: "1rem" }}>
          <Input type='text' min='0' step='0.01' />
        </Form.Item>
        <Form.Item
          label='Quantity'
          name='stock_level'
          rules={[{ required: true, message: "Please enter the quantity" }]}
          style={{ marginBottom: "1rem" }}>
          <Input type='number' min='1' />
        </Form.Item>

        <Form.Item
          label='Total Price ($)'
          name='total_price'
          rules={[{ required: true, message: "Please enter the total price" }]}
          style={{ marginBottom: "1rem" }}>
          <Input type='number' min='0' step='0.01' />
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
            }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type='primary' htmlType='submit'>
              {"Create Order"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OutgoingOrderModal;
