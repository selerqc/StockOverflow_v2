import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, Badge, Space } from "antd";
import { PlusOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";

import AddUserModal from "../../../components/modals/UserModal/AddUserModal";
import EditUserModal from "../../../components/modals/UserModal/EditUserModal";
import useFetch from "../../../hooks/useFetch";
import { baseURL } from "../../../../config";

const { Option } = Select;

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [users, setUsers] = useState([]);

  const { data } = useFetch(`${baseURL}/users/getUsers`);

  useEffect(() => {
    if (data) {
      setUsers(data.data);
    }
  }, [data]);

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setIsAddModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? { ...user, ...updatedUser } : user
      )
    );
    setIsEditModalOpen(false);
  };

  const handleAddSubmit = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setIsAddModalOpen(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const colors = {
      Admin: "purple",
      "Business owner": "blue",
      Employee: "green",
    };
    return <Badge color={colors[role] || "gray"} text={role} />;
  };

  const getStatusBadge = (status) => {
    return (
      <Badge
        color={status === "active" ? "green" : "red"}
        text={status.charAt(0).toUpperCase() + status.slice(1)}
      />
    );
  };

  const columns = [
    {
      title: "User",
      dataIndex: "email",
      key: "email",
      render: (email, record) => (
        <Space direction='vertical'>
          <span>{email}</span>
          <span style={{ fontSize: "12px", color: "#888" }}>
            ID: {record._id}
          </span>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => getRoleBadge(role),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusBadge(status),
    },
    {
      title: "Last Login",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type='link'
          icon={<EditOutlined />}
          onClick={() => handleEditUser(record)}
        />
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}>
        <h1>User Management</h1>
        <Button type='primary' icon={<PlusOutlined />} onClick={handleAddUser}>
          Add User
        </Button>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <Input
          placeholder='Search users...'
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={roleFilter}
          onChange={(value) => setRoleFilter(value)}
          style={{ width: 200 }}>
          <Option value='all'>All Roles</Option>
          <Option value='Admin'>Admin</Option>
          <Option value='Business Owner'>Business Owner</Option>
          <Option value='Employee'>Employee</Option>
        </Select>
      </div>

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey='_id'
        pagination={{ pageSize: 5 }}
      />

      {isAddModalOpen && (
        <AddUserModal
          visible={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
        />
      )}

      {isEditModalOpen && (
        <EditUserModal
          visible={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          initialValues={selectedUser}
        />
      )}
    </div>
  );
};

export default ManageUsers;
