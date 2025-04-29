import React, { useState } from "react";
import "../Login/Login.css";
import { useNavigate, Link } from "react-router-dom";
import { Package, Mail, Lock } from "lucide-react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Layout,
  Space,
  message,
} from "antd";
import axios from "axios";
const { Title, Text } = Typography;
const { Content, Sider } = Layout;
import { useToken } from "../../../hooks/TokenContext";
import { baseURL } from "../../../../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, token } = useToken();
  const role = sessionStorage.getItem("role");
  const handleLogin = async () => {
    setLoading(true);

    await axios
      .post(`${baseURL}/users/login`, {
        email: email,
        password: password,
      })
      .then((response) => {
        setEmail("");
        setPassword("");
        setLoading(false);

        setToken(response.data.accessToken);
        sessionStorage.setItem("user", response.data.data.username);
        message.success(
          `Login successful, Welcome back ${response.data.data.username}`
        );
        updateLastLogin(response.data.data._id);
        setTimeout(() => {
          const userRole = response.data.data.role;
          switch (userRole) {
            case "Admin":
              navigate("/admin-dashboard");
              break;
            case "Business Owner":
              navigate("/businessowner-dashboard");
              break;
            case "Employee":
              navigate("/employee-dashboard");
              break;
            default:
              navigate("/login");
              break;
          }
        }, 3000);
      })
      .catch((error) => {
        message.error(`Login failed, ${error.response.data.error}`);

        setLoading(false);
      });
  };

  const onFinish = (values) => {
    setEmail(values.email);
    setPassword(values.password);
    handleLogin();
  };
  const updateLastLogin = async (id) => {
    await axios
      .patch(`${baseURL}/users/updateLastLogin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <Layout style={{ height: "100vh" }}>
      <Content style={{ backgroundColor: "white", padding: "3rem" }}>
        <div className='login-logo-container'>
          <div className='login-logo'>
            <Package className='login-icon-large' />
          </div>
          <Title
            level={3}
            style={{
              fontWeight: 700,
              margin: 0,
              display: "flex",
              alignItems: "center",
            }}>
            StockOverflow
          </Title>
        </div>
        <Row justify='center' align='middle' style={{ height: "100%" }}>
          <Col xs={20}>
            <div className='login-box'>
              <Title level={3} style={{ fontWeight: 700, fontSize: "2.5rem" }}>
                Welcome back!
              </Title>
              <Text type='secondary' style={{ fontSize: "1rem" }}>
                Enter your email and password to access your account.
              </Text>
            </div>

            <div className='login-form-container'>
              <div className='login-form-box'>
                <Space direction='vertical' style={{ width: "100%" }}>
                  <Form
                    name='login'
                    initialValues={{ remember: true }}
                    layout='vertical'
                    onFinish={onFinish}
                    autoComplete='on'>
                    <Form.Item
                      name='email'
                      label='Email'
                      style={{ marginBottom: "0.5rem" }}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your email address",
                          type: "email",
                        },
                      ]}
                      hasFeedback>
                      <Input
                        size='large'
                        prefix={<Mail className='login-icon-small' />}
                        placeholder='Enter your email address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      name='password'
                      label='Password'
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password",
                        },
                        {
                          min: 8,
                          message: "Password must be at least 8 characters",
                        },
                      ]}
                      style={{ marginBottom: "1rem" }}
                      hasFeedback>
                      <Input.Password
                        size='large'
                        prefix={<Lock className='login-icon-small' />}
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: "1rem" }}>
                      <Row justify='space-between' align='middle'>
                        <Col>
                          <Form.Item
                            name='remember'
                            valuePropName='checked'
                            noStyle>
                            <Checkbox>Remember me</Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        block
                        htmlType='submit'
                        loading={loading}
                        style={{
                          backgroundColor: "#4f46e5",
                          color: "#fff",
                          borderRadius: "0.5rem",
                          height: "2.5rem",
                          fontSize: "1rem",
                          fontWeight: 600,
                        }}>
                        {loading ? "Logging in..." : "Log in"}
                      </Button>
                    </Form.Item>
                  </Form>
                  <hr />
                  <Text
                    type='secondary'
                    style={{ fontSize: "0.9rem", color: "gray" }}>
                    Don't have an account?{"  "}
                    <span>
                      <Link
                        to='/register'
                        style={{ color: "#4f46e5", fontWeight: 600 }}>
                        Create a new account
                      </Link>
                    </span>
                  </Text>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </Content>
      <Sider
        width='60%'
        breakpoint='xs'
        collapsedWidth='0'
        style={{
          background: "url('../src/assets/loginbg.png') ",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain", // Changed from "cover" to "contain"
          backgroundPosition: "center",
          backgroundColor: "#6c46f3",
        }}></Sider>
    </Layout>
  );
}

export default Login;
