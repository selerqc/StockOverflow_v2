import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Badge,
  Space,
  Card,
  Row,
  Col,
  Popconfirm,
  message,
  Tag,
  Avatar,
  Tooltip,
  Statistic,
  Divider,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
  UserOutlined,
  FilterOutlined,
  ReloadOutlined,
  UserSwitchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import AddUserModal from "../../../components/modals/UserModal/AddUserModal";
import EditUserModal from "../../../components/modals/UserModal/EditUserModal";
import { baseURL } from "../../../../config";
import axios from "axios";

const { Option } = Select;
import { useToken } from "../../../hooks/TokenContext";

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useToken();
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["5", "10", "20", "50"],
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
    },
    sortField: "updatedAt",
    sortOrder: "descend",
  });


  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    axios.get(`${baseURL}/users/getUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setUsers(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  };
  // User statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "active").length;
  const inactiveUsers = users.filter(
    (user) => user.status === "inactive"
  ).length;

  const usersByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

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
    message.success("User updated successfully");
  };

  const handleAddSubmit = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setIsAddModalOpen(false);
    message.success("User added successfully");
  };

  const handleDeleteUser = (userId) => {
    // Here you would typically call an API to delete the user
    // For now, we'll just update the UI
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    message.success("User deleted successfully");
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    refetch();
    message.info("Refreshing user data");
  };

  const handleExport = () => {
    message.success("User data exported successfully");
    // Implement CSV/Excel export functionality here
  };

  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    message.info("Filters reset");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    const colors = {
      Admin: "purple",
      "Business owner": "blue",
      Employee: "green",
    };
    return <Tag color={colors[role] || "default"}>{role}</Tag>;
  };

  const getStatusBadge = (status) => {
    return (
      <Tag color={status === "active" ? "success" : "error"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Tag>
    );
  };

  const columns = [
    {
      title: "User",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (email, record) => (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            style={{
              backgroundColor:
                record.status === "active" ? "#1890ff" : "#d9d9d9",
            }}
          />
          <Space direction='vertical' size={0}>
            <span>{email}</span>
            <span style={{ fontSize: "12px", color: "#888" }}>
              ID: {record._id}
            </span>
          </Space>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Admin", value: "Admin" },
        { text: "Business owner", value: "Business owner" },
        { text: "Employee", value: "Employee" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => getRoleBadge(role),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => getStatusBadge(status),
    },
    {
      title: "Last Login",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      defaultSortOrder: "descend",
      render: (updatedAt) => new Date(updatedAt).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title='Edit User'>
            <Button
              type='primary'
              size='small'
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title='Delete User'>
            <Popconfirm
              title='Are you sure you want to delete this user?'
              onConfirm={() => handleDeleteUser(record._id)}
              okText='Yes'
              cancelText='No'
              placement='left'>
              <Button
                type='primary'
                danger
                size='small'
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}>
              <Space direction='vertical' size={1}>
                <h1 style={{ margin: 0 }}>User Management</h1>
                <span style={{ color: "#8c8c8c" }}>
                  Manage all system users and their permissions
                </span>
              </Space>
              <Space>
                <Button
                  onClick={handleRefresh}
                  icon={<ReloadOutlined />}
                  loading={loading}>
                  Refresh
                </Button>
                <Button onClick={handleExport} icon={<DownloadOutlined />}>
                  Export
                </Button>
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  onClick={handleAddUser}>
                  Add User
                </Button>
              </Space>
            </div>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card style={{ background: "#f5f5f5" }}>
                  <Statistic
                    title='Total Users'
                    value={totalUsers}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card style={{ background: "#f6ffed" }}>
                  <Statistic
                    title='Active Users'
                    value={activeUsers}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card style={{ background: "#fff1f0" }}>
                  <Statistic
                    title='Inactive Users'
                    value={inactiveUsers}
                    valueStyle={{ color: "#ff4d4f" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card style={{ background: "#e6f7ff" }}>
                  <Statistic
                    title='User Roles'
                    value={Object.keys(usersByRole).length}
                    prefix={<UserSwitchOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
            </Row>

            <Card
              title={
                <Space>
                  <FilterOutlined /> Filter Users
                </Space>
              }
              style={{ marginBottom: 16 }}
              extra={
                <Button size='small' onClick={resetFilters}>
                  Reset
                </Button>
              }>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={8} lg={18}>
                  <Input
                    placeholder='Search users by email...'
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={5}>
                  <Select
                    value={roleFilter}
                    onChange={(value) => setRoleFilter(value)}
                    style={{ width: "100%" }}
                    placeholder='Filter by role'>
                    <Option value='all'>All Roles</Option>
                    <Option value='Admin'>Admin</Option>
                    <Option value='Business Owner'>Business Owner</Option>
                    <Option value='Employee'>Employee</Option>
                  </Select>
                </Col>
              </Row>
            </Card>

            <Table
              dataSource={filteredUsers}
              columns={columns}
              rowKey='_id'
              loading={loading}
              onChange={handleTableChange}
              pagination={tableParams.pagination}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

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
