import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Received values:', values);
    setLoading(true);
    // 模拟注册过程
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>用户注册</Title>
      <Form
        name="register"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址!' },
            { type: 'email', message: '请输入有效的邮箱地址!' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="邮箱地址" />
        </Form.Item>

        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码!' },
            { min: 6, message: '密码至少6位字符!' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
        </Form.Item>

        <Form.Item>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              style={{ width: '100%' }}
            >
              注册
            </Button>
            <Button 
              style={{ width: '100%' }}
              onClick={() => navigate('/login')}
            >
              已有账户，直接登录
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Register;