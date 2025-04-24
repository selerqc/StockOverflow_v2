import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";
import { useToken } from "../../hooks/TokenContext";
import { baseURL } from "../../../config";

const CategoryModal = ({ category, onClose, onSave }) => {
  const [form] = Form.useForm();
  const { token } = useToken();

  const handleSubmit = async (values) => {
    const url = category
      ? `${baseURL}/category/updateCategory/${category._id}`
      : `${baseURL}/category/addCategory`;

    const method = category ? "put" : "post";

    try {
      await axios[method](url, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success(
        category
          ? "Category updated successfully"
          : "Category added successfully"
      );
      form.resetFields();
      onSave(values);
      onClose();
    } catch (error) {
      console.error("Error adding/updating category:", error);
    }
  };

  return (
    <Modal
      title={category ? "Edit Category" : "Add New Category"}
      open={true}
      onCancel={onClose}
      footer={null}>
      <Form
        form={form}
        layout='vertical'
        initialValues={category || { name: "", description: "" }}
        onFinish={handleSubmit}>
        <Form.Item
          label='Category Name'
          name='name'
          rules={[
            { required: true, message: "Please enter the category name" },
          ]}>
          <Input placeholder='Enter category name' />
        </Form.Item>

        <Form.Item label='Description' name='description'>
          <Input.TextArea placeholder='Enter category description' rows={3} />
        </Form.Item>

        <Form.Item>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type='primary' htmlType='submit'>
              {category ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
