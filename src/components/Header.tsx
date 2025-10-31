import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, LoginOutlined, FormOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  current?: string;
  onClick?: (e: any) => void;
}

const Header: React.FC<HeaderProps> = ({ current = 'home', onClick }) => {
  const navigate = useNavigate();

  const handleMenuClick = (e: any) => {
    if (onClick) {
      onClick(e);
    }
    
    switch (e.key) {
      case 'home':
        navigate('/');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'register':
        navigate('/register');
        break;
      default:
        break;
    }
  };

  return (
    <AntHeader>
      <div className="logo" style={{ float: 'left', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
        AI 旅行规划师
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        onClick={handleMenuClick}
        selectedKeys={[current]}
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
    </AntHeader>
  );
};

export default Header;