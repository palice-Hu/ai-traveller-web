import React from 'react';
import { Button, Space, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card title="欢迎使用 AI 旅行规划师" style={{ width: '100%' }}>
      <Title level={3}>智能旅行规划助手</Title>
      <Paragraph>
        通过人工智能技术，我们为您提供个性化的旅行路线规划服务。
        只需简单描述您的旅行需求，即可获得详细的行程安排。
      </Paragraph>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Button 
          type="primary" 
          size="large" 
          style={{ width: '100%' }}
          onClick={() => navigate('/login')}
        >
          开始规划行程
        </Button>
      </Space>
    </Card>
  );
};

export default Home;