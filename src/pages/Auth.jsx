import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { authenticateUser } from "../api/authApi";

const Auth = ({ setToken, setUserTeam }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticateUser(values.email, values.password);
      // Store auth data
      localStorage.setItem("token", response.token);
      localStorage.setItem("teamId", response.teamId);
      setToken(response.token);
      setUserTeam(response.teamId);
      message.success(
        'Welcome to Football Manager!'
      );

      navigate("/my-team", { replace: true });
    } catch (err) {
      console.error('Auth error:', err);
      
      const errorType = err.response?.data?.error;
      const errorMessage = err.response?.data?.message;

      switch (errorType) {
        case "INVALID_PASSWORD":
          setError({
            type: "error",
            message: "Incorrect Password",
            description: "The password you entered is incorrect. Please try again."
          });
          break;
        default:
          setError({
            type: "error",
            message: "Authentication Failed",
            description: errorMessage || "An unexpected error occurred. Please try again."
          });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', marginTop: 50 }}>
      <Card title={
        <div style={{ textAlign: 'center' }}>
          <h2>⚽ Football Manager</h2>
          <p style={{ margin: 0 }}>Login or Create Account</p>
        </div>
      }>
        {error && (
          <Alert
            message={error.message}
            description={error.description}
            type={error.type}
            showIcon
            style={{ marginBottom: 16 }}
            closable
            onClose={() => setError(null)}
          />
        )}
        
        <Form
          form={form}
          name="auth"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email" 
              type="email"
              size="large"
              onChange={() => setError(null)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              onChange={() => setError(null)}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              size="large"
            >
              Login/Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Auth;