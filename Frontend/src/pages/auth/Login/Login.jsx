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
  const [email, setEmail] = useState(() => sessionStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, token } = useToken();
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    if (rememberMe) {
      sessionStorage.setItem("email", email);
    } else {
      sessionStorage.removeItem("email");
    }
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
        sessionStorage.setItem("email", email);
        message.success(
          `Login successful, Welcome back ${response.data.data.username}`
        );
        updateLastLogin(response.data.data._id);
        setTimeout(() => {
          const userRole = response.data.data.role;
          sessionStorage.setItem("role", userRole);
          if (userRole === "Admin") {
            navigate("/admin-dashboard");
          } else if (userRole === "Business Owner") {
            navigate("/businessowner-dashboard");
          } else if (userRole === "Employee") {
            navigate("/employee-dashboard");
          } else {
            navigate("/login");
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
    const remember = values.remember || false;
    setRememberMe(remember);
    if (!remember) {
      sessionStorage.removeItem("email");
    }
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
      <Content style={{ padding: "3rem" }}>
        <div className='login-logo-container'>

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
        <Row justify='center' align='middle' style={{ height: "100%" }}>          <Col xs={20} sm={16} md={12} lg={8} xl={8} style={{
          boxShadow: "0 0 20px rgba(79, 70, 229, 0.1)",
          borderRadius: "1rem",
          padding: "2.5rem",
          backgroundColor: "white",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
        }}>
          <div className='login-box'>
            <Title level={3} style={{
              fontWeight: 700,
              fontSize: "2.5rem",
              background: "linear-gradient(45deg, #4f46e5, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Welcome back!
            </Title>
            <Text type='secondary' style={{
              fontSize: "1.1rem",
              color: "#6b7280"
            }}>
              Enter your email and password to access your account.
            </Text>
          </div>

          <div className='login-form-container'>
            <div className='login-form-box'>
              <Space direction='vertical' style={{ width: "100%" }}>                  <Form
                name='login'
                initialValues={{
                  remember: true,
                  email: sessionStorage.getItem("email") || ""
                }}
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
                      whitespace: true,
                    },
                  ]}
                  hasFeedback>
                  <Input
                    size='large'
                    prefix={<Mail className='login-icon-small' />}
                    type='email'
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
                        noStyle
                      >
                        <Checkbox onChange={(e) => setRememberMe(e.target.checked)}>Remember me</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>


                <Form.Item>                    <Button
                  block
                  htmlType='submit'
                  loading={loading}
                  style={{
                    background: "linear-gradient(45deg, #4f46e5, #6366f1)",
                    color: "#fff",
                    borderRadius: "0.75rem",
                    height: "3rem",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    border: "none",
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(79, 70, 229, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.2)";
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
      {/* <Sider
        width='60%'
        breakpoint='xs'
        collapsedWidth='0'
        style={{
          background: "url('../src/assets/loginbg.png') ",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain", // Changed from "cover" to "contain"
          backgroundPosition: "center",
          backgroundColor: "#6c46f3",
        }}></Sider> */}
    </Layout >
  );
}

export default Login;
