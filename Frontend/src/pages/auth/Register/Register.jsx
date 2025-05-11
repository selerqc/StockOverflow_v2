import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Package, CircleUserRound, BookUser } from "lucide-react";
import {
  Form,
  Input,
  Button,
  Typography,
  Layout,
  Row,
  Col,
  message,
} from "antd";
import axios from "axios";
import { baseURL } from "../../../../config.js";

const { Title, Text } = Typography;
const { Content, Sider } = Layout;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    const { username, email, phone, password, confirm_password } = values;
    setLoading(true);

    await axios
      .post(`${baseURL}/users/register`, {
        username,
        email,
        phone,
        password,
        confirm_password,
      })
      .then(() => {
        message.success("Registration successful!");
        setTimeout(() => {
          setLoading(false);
          navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        message.error(error.response.data.error);
        setLoading(false);
      });
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Content style={{ padding: "2rem" }}>
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
        <Row justify='center' align='middle' style={{ height: "100%" }}>
          <Col xs={20} sm={16} md={12} lg={8} xl={8} style={{
            boxShadow: "0 0 20px rgba(79, 70, 229, 0.1)",
            borderRadius: "1rem",
            padding: "2.5rem",
            backgroundColor: "white",
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
          }} className="registration-card">
            <div className='registration-box'>
              <Title
                level={3}
                style={{
                  fontWeight: 700,
                  fontSize: "2.5rem",
                  background: "linear-gradient(45deg, #4f46e5, #6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                Create an account
              </Title>
              <Text style={{
                marginTop: "0.5rem",
                fontSize: "1.1rem"
              }}>
                <Text style={{ color: "#6b7280" }}>
                  Already have an account?{" "}
                </Text>
                <Text>
                  <Link
                    to='/login'
                    style={{
                      color: "#4f46e5",
                      fontWeight: 600,
                      transition: "color 0.3s ease"
                    }}
                    onMouseOver={(e) => e.target.style.color = "#6366f1"}
                    onMouseOut={(e) => e.target.style.color = "#4f46e5"}>
                    Log in
                  </Link>
                </Text>
              </Text>
            </div>

            <div className='registration-form-container'>
              <Form
                layout='vertical'
                onFinish={handleRegister}
                autoComplete='on'
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}>
                <Row gutter={16} style={{ marginBottom: "-1rem" }}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label='Username'
                      name='username'
                      rules={[
                        {
                          required: true,
                          message: "Please enter your username!",
                        },
                      ]}>
                      <Input
                        size='large'
                        prefix={
                          <CircleUserRound className='registration-input-icon' />
                        }
                        placeholder='Enter your username'
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label='Email address'
                      name='email'
                      rules={[
                        { required: true, message: "Please enter your email!" },
                        {
                          type: "email",
                          message: "Please enter a valid email!",
                        },
                      ]}>
                      <Input
                        size='large'
                        prefix={<Mail className='registration-input-icon' />}
                        placeholder='Enter your email'
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginBottom: "-1rem" }}>
                  <Col xs={24}>
                    <Form.Item
                      label='Phone Number'
                      name='phone'
                      rules={[
                        {
                          required: true,
                          message: "Please enter your phone number!",
                        },
                      ]}>
                      <Input
                        size='large'
                        prefix={
                          <BookUser className='registration-input-icon' />
                        }
                        placeholder='Enter your phone number'
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginBottom: "-1rem" }}>
                  <Col xs={24} >
                    <Form.Item
                      label='Password'
                      name='password'
                      rules={[
                        {
                          required: true,
                          message: "Please create a password!",
                        },
                      ]}>
                      <Input.Password
                        size='large'
                        prefix={<Lock className='registration-input-icon' />}
                        placeholder='Create a password'
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginBottom: "-1rem" }}>
                  <Col xs={24}>
                    <Form.Item
                      label='Confirm Password'
                      name='confirm_password'
                    >
                      <Input.Password
                        size='large'
                        prefix={<Lock className='registration-input-icon' />}
                        placeholder='Confirm your password'
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>                    <Button
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
                  }}
                  type='primary'
                  htmlType='submit'
                  block
                  loading={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </Content>
      {/* <Sider
        width='60%'
        style={{
          backgroundImage: "url('../src/assets/register.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundColor: "#4f46e5",
        }}
        breakpoint='md'
        collapsedWidth='0'
      /> */}
    </Layout>
  );
};

export default Register;
