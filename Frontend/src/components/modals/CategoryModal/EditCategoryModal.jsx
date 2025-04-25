import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config";

const EditCategoryModal = ({ category, onClose }) => {
  const [form] = Form.useForm();
  const { token } = useToken();

  const handleSubmit = async (values) => {
    console.log(values);

    try {
      await axios.patch(
        `${baseURL}/category/updateCategory/${category._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Category updated successfully");
      form.resetFields();

      onClose();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <Modal title='Edit Category' open={true} onCancel={onClose} footer={null}>
      <Form
        form={form}
        layout='vertical'
        initialValues={category}
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
              Update Category
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;
