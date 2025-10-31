import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    setLoading(true);
    // 模拟登录过程
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>用户登录</Title>
      <Form
        name="login"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              style={{ width: '100%' }}
            >
              登录
            </Button>
            <Button 
              style={{ width: '100%' }}
              onClick={() => navigate('/register')}
            >
              注册账户
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;