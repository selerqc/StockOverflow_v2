import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config.js";

const AddUserModal = ({ onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const { token } = useToken();
  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { username, email, phone, password, confirm_password } = values;

        await axios
          .post(
            `${baseURL}/users/addNewUser`,
            {
              username: username,
              email: email,
              phone: phone,
              password: password,
              confirm_password: confirm_password,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            message.success(response.data.message);
            form.resetFields();
            onSubmit(response.data.user);
            onClose();
          })
          .catch((error) => {
            console.error("Error adding user:", error);
          });
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
      });
  };

  return (
    <Modal
      title='Add New User'
      open={true}
      onCancel={onClose}
      footer={[
        <Button key='cancel' onClick={onClose}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleSubmit}>
          Add User
        </Button>,
      ]}>
      <Form form={form} layout='vertical'>
        <Form.Item
          label='Username'
          name='username'
          rules={[{ required: true, message: "Please enter a username!" }]}
          style={{ marginBottom: "1rem" }}>
          <Input placeholder='Enter username' />
        </Form.Item>
        <Form.Item
          label='Email'
          name='email'
          rules={[
            { required: true, message: "Please enter an email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
          style={{ marginBottom: "1rem" }}>
          <Input placeholder='Enter email' />
        </Form.Item>
        <Form.Item
          label='Phone'
          name='phone'
          rules={[{ required: true, message: "Please enter a phone number!" }]}
          style={{ marginBottom: "1rem" }}>
          <Input placeholder='Enter phone number' />
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: "Please enter a password!" }]}
          style={{ marginBottom: "1rem" }}>
          <Input.Password placeholder='Enter password' />
        </Form.Item>

        <Form.Item
          label='Confirm Password'
          name='confirm_password'
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
          style={{ marginBottom: "1rem" }}>
          <Input.Password placeholder='Confirm password' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
