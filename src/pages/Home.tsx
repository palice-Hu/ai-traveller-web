import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100%',
      width: '100%',
      padding: '24px'
    }}>
      <Card style={{ 
        maxWidth: 800, 
        width: '100%',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px'
      }}>
        <Title level={2} style={{ textAlign: 'center' }}>
          欢迎使用 AI 旅行规划师
        </Title>
        
        {currentUser ? (
          <>
            <Paragraph style={{ textAlign: 'center', fontSize: '16px' }}>
              您好，{currentUser.email}！
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              AI 旅行规划师是一款基于人工智能技术的智能旅行规划应用程序，
              旨在简化您的旅行规划流程，提供个性化的旅行路线和建议。
              通过我们的服务，您可以轻松创建旅行计划、管理预算、发现新的景点和体验。
            </Paragraph>
            <Space direction="vertical" style={{ width: '100%', marginTop: '24px' }}>
              <Button type="primary" size="large" style={{ width: '100%' }} onClick={() => navigate('/planner')}>
                开始规划旅行
              </Button>
              <Button size="large" style={{ width: '100%' }} onClick={() => navigate('/profile')}>
                查看我的行程
              </Button>
            </Space>
          </>
        ) : (
          <>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              AI 旅行规划师是一款基于人工智能技术的智能旅行规划应用程序，
              旨在简化您的旅行规划流程，提供个性化的旅行路线和建议。
              通过我们的服务，您可以轻松创建旅行计划、管理预算、发现新的景点和体验。
            </Paragraph>
            <Paragraph style={{ textAlign: 'center', fontSize: '16px' }}>
              请登录或注册账户以开始使用我们的服务。
            </Paragraph>
            <Space direction="vertical" style={{ width: '100%', marginTop: '24px' }}>
              <Button type="primary" size="large" style={{ width: '100%' }} onClick={() => navigate('/login')}>
                登录账户
              </Button>
              <Button size="large" style={{ width: '100%' }} onClick={() => navigate('/register')}>
                注册账户
              </Button>
            </Space>
          </>
        )}
      </Card>
    </div>
  );
};

export default Home;