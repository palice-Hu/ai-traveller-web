import { useState } from 'react';
import { Button, Space, Typography, Card, Layout, Menu } from 'antd';
import { HomeOutlined, LoginOutlined, FormOutlined } from '@ant-design/icons';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  const [count, setCount] = useState(0);

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header>
        <div className="logo" style={{ float: 'left', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
          AI 旅行规划师
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          items={[
            {
              key: 'home',
              icon: <HomeOutlined />,
              label: '首页',
            },
            {
              key: 'login',
              icon: <LoginOutlined />,
              label: '登录',
            },
            {
              key: 'register',
              icon: <FormOutlined />,
              label: '注册',
            },
          ]}
          style={{ float: 'right' }}
        />
      </Header>
      
      <Content style={{ padding: '50px' }}>
        <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Card title="欢迎使用 AI 旅行规划师" style={{ width: '100%' }}>
            <Title level={3}>智能旅行规划助手</Title>
            <Paragraph>
              通过人工智能技术，我们为您提供个性化的旅行路线规划服务。
              只需简单描述您的旅行需求，即可获得详细的行程安排。
            </Paragraph>
            
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Button type="primary" size="large" style={{ width: '100%' }}>
                开始规划行程
              </Button>
              
              <div style={{ textAlign: 'center' }}>
                <Button onClick={() => setCount((count) => count + 1)}>
                  计数器: {count}
                </Button>
                <p>
                  Edit <code>src/App.tsx</code> and save to test HMR
                </p>
              </div>
            </Space>
          </Card>
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        AI 旅行规划师 ©2025 Created by AI Travel Team
      </Footer>
    </Layout>
  );
}

export default App;