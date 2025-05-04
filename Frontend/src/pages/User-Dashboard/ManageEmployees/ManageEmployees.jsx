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


import { baseURL } from "../../../../config";
import axios from "axios";

const { Option } = Select;
import { useToken } from "../../../hooks/TokenContext";

const ManageEmployees = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

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
        axios.get(`${baseURL}/users/getEmployee`, {
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




    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    const handleRefresh = () => {
        setLoading(true);
        message.info("Refreshing employee data");
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
            title: "Employees",
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
                                <h1 style={{ margin: 0 }}>Employee Management</h1>
                                <span style={{ color: "#8c8c8c" }}>
                                    Manage all system employees and their permissions
                                </span>
                            </Space>
                            <Space>
                                <Button
                                    onClick={handleRefresh}
                                    icon={<ReloadOutlined />}
                                    loading={loading}>
                                    Refresh
                                </Button>


                            </Space>
                        </div>

                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col xs={24} sm={12} md={6} lg={6}>
                                <Card style={{ background: "#f5f5f5" }} >
                                    <Statistic
                                        title='Total Employees'
                                        value={totalUsers}
                                        prefix={<UserOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6} lg={6}>
                                <Card style={{ background: "#f6ffed" }}>
                                    <Statistic
                                        title='Active Employees'
                                        value={activeUsers}
                                        valueStyle={{ color: "#52c41a" }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6} lg={6}>
                                <Card style={{ background: "#fff1f0" }}>
                                    <Statistic
                                        title='Inactive Employees'
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
                                    <FilterOutlined /> Filter Employees
                                </Space>
                            }
                            style={{ marginBottom: 16 }}
                            extra={
                                <Button size='small' onClick={resetFilters} type="primary" style={{ padding: "0 8px" }}>
                                    Reset
                                </Button>
                            }>
                            <Row gutter={16}>
                                <Col xs={24} sm={24} md={8} lg={25}>
                                    <Input
                                        placeholder='Search users by email...'
                                        prefix={<SearchOutlined />}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        allowClear
                                    />
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


        </div>
    );
};

export default ManageEmployees;
