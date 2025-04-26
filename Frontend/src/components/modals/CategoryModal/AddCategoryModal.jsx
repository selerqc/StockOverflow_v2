import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config";

const AddCategoryModal = ({ onClose, onSave }) => {
  const [form] = Form.useForm();
  const { token } = useToken();

  const handleSubmit = async (values) => {
    console.log(values);
    const url = `${baseURL}/category/addCategory`;

    try {
      await axios.post(url, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Category added successfully");
      form.resetFields();
      onSave(values);
      onClose();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to add category");
    }
  };

  return (
    <Modal
      title='Add New Category'
      open={true}
      onCancel={onClose}
      footer={null}>
      <Form
        form={form}
        layout='vertical'
        initialValues={{ name: "", description: "" }}
        onFinish={handleSubmit}>
        <Form.Item
          label='Category Name'
          name='name'
          rules={[
            { required: true, message: "Please enter the category name" },
          ]}
          style={{ marginBottom: "1rem" }}>
          <Input placeholder='Enter category name' />
        </Form.Item>

        <Form.Item
          label='Description'
          name='description'
          style={{ marginBottom: "1rem" }}>
          <Input.TextArea placeholder='Enter category description' rows={3} />
        </Form.Item>

        <Form.Item>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type='primary' htmlType='submit'>
              Create Category
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
