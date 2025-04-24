import React from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";

const EditUserModal = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const { token } = useToken();
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const { username, email, role } = values;

        axios
          .patch(
            `${baseURL}/users/updateUser/${initialValues._id}`,
            {
              username,
              email,
              role,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            onSubmit(response.data.data);
            message.success(response.data.message);
          });

        form.resetFields();
      })
      .catch((info) => {
        console.error("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title='Edit User'
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleOk}>
          Submit
        </Button>,
      ]}>
      <Form form={form} layout='vertical' initialValues={initialValues}>
        <Form.Item
          name='username'
          label='Username'
          rules={[{ required: true, message: "Please input the username!" }]}
          style={{ marginBottom: "1rem" }}>
          <Input />
        </Form.Item>

        <Form.Item
          name='email'
          label='Email'
          rules={[
            { required: true, message: "Please input the email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
          style={{ marginBottom: "1rem" }}>
          <Input />
        </Form.Item>

        <Form.Item
          name='role'
          label='Role'
          rules={[{ required: true, message: "Please select the role!" }]}
          style={{ marginBottom: "1rem" }}>
          <Select>
            <Select.Option value='Employee'>Employee</Select.Option>
            <Select.Option value='Business Owner'>Business Owner</Select.Option>
            <Select.Option value='Guest'>Guest</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
