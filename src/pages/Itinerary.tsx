import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Space, Button, Tag, Descriptions, message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import mapService, { type MapLocation } from '../services/mapService';
import type { ItineraryResponse, ItineraryItem, Activity } from '../services/aiService';

const { Title, Text } = Typography;

const Itinerary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDay, setActiveDay] = useState(0);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 从location.state获取行程数据，如果没有则使用模拟数据
  useEffect(() => {
    const locationState: any = location.state;
    if (locationState?.itinerary) {
      setItinerary(locationState.itinerary);
      setLoading(false);
    } else {
      // 使用模拟数据
      const mockItinerary: ItineraryResponse = {
        id: 'itinerary_12345',
        title: '北京三日游',
        destination: '北京',
        startDate: '2025-11-10',
        endDate: '2025-11-12',
        budget: 5000,
        estimatedCost: 4200,
        itinerary: [
          {
            day: 1,
            date: '2025-11-10',
            activities: [
              {
                time: '09:00',
                title: '天安门广场',
                description: '参观世界上最大的城市广场，感受历史的厚重',
                location: '天安门广场',
                duration: '2小时',
                cost: 0
              },
              {
                time: '12:00',
                title: '故宫博物院',
                description: '游览明清两代的皇家宫殿，了解中国古代文化',
                location: '故宫博物院',
                duration: '3小时',
                cost: 60
              }
            ]
          },
          {
            day: 2,
            date: '2025-11-11',
            activities: [
              {
                time: '09:30',
                title: '颐和园',
                description: '游览皇家园林，欣赏昆明湖和万寿山美景',
                location: '颐和园',
                duration: '4小时',
                cost: 30
              },
              {
                time: '15:00',
                title: '北京动物园',
                description: '参观熊猫馆和其他珍稀动物',
                location: '北京动物园',
                duration: '2小时',
                cost: 50
              }
            ]
          },
          {
            day: 3,
            date: '2025-11-12',
            activities: [
              {
                time: '10:00',
                title: '长城',
                description: '登临万里长城，体验世界文化遗产的雄伟',
                location: '慕田峪长城',
                duration: '4小时',
                cost: 45
              },
              {
                time: '16:00',
                title: '798艺术区',
                description: '欣赏当代艺术作品，感受创意文化氛围',
                location: '798艺术区',
                duration: '2小时',
                cost: 0
              }
            ]
          }
        ]
      };
      
      setItinerary(mockItinerary);
      setLoading(false);
    }
  }, [location.state]);

  useEffect(() => {
    // 初始化地图服务
    const initMap = async () => {
      try {
        const result = await mapService.initialize();
        if (result) {
          setMapInitialized(true);
          // 渲染第一天的第一个地点的地图
          if (itinerary?.itinerary[0]?.activities[0]) {
            setTimeout(() => {
              const location = itinerary.itinerary[0].activities[0].location;
              renderMapForLocation(location);
            }, 500);
          }
        }
      } catch (error) {
        console.error('地图初始化失败:', error);
        message.error('地图服务初始化失败');
      }
    };

    if (itinerary) {
      initMap();
    }
  }, [itinerary]);

  const renderMapForLocation = async (locationName: string) => {
    if (!mapInitialized) return;

    try {
      const locations = await mapService.searchPlaces(locationName);
      if (locations.length > 0) {
        const location = locations[0];
        mapService.renderMap('map-container', {
          latitude: location.latitude,
          longitude: location.longitude
        });
      }
    } catch (error) {
      console.error('地图渲染失败:', error);
      message.error('地图渲染失败');
    }
  };

  const handleLocationClick = (locationName: string) => {
    renderMapForLocation(locationName);
  };

  // 渲染活动列表
  const renderActivities = (activities: Activity[]) => {
    return (
      <List
        style={{ marginTop: 16 }}
        dataSource={activities}
        renderItem={(activity) => (
          <List.Item
            key={activity.time}
            style={{ 
              flexDirection: 'column',
              alignItems: 'flex-start',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleLocationClick(activity.location);
            }}
          >
            <Space>
              <Tag color="blue">{activity.time}</Tag>
              <Text strong>{activity.title}</Text>
            </Space>
            <Text type="secondary" style={{ marginTop: 8 }}>
              {activity.description}
            </Text>
            <Space style={{ marginTop: 8 }}>
              <Text type="secondary">地点: {activity.location}</Text>
              <Text type="secondary">时长: {activity.duration}</Text>
              {activity.cost !== undefined && (
                <Text type="danger">费用: ¥{activity.cost}</Text>
              )}
            </Space>
          </List.Item>
        )}
      />
    );
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="加载行程中..." />
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>未找到行程数据</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 0 }}>
            {itinerary.title}
          </Title>
          
          <Descriptions bordered column={{ xs: 1, sm: 2, md: 4 }} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="目的地">{itinerary.destination}</Descriptions.Item>
            <Descriptions.Item label="出行日期">
              {itinerary.startDate} 至 {itinerary.endDate}
            </Descriptions.Item>
            <Descriptions.Item label="预算">
              ¥{itinerary.budget}
            </Descriptions.Item>
            <Descriptions.Item label="预估费用">
              <Text type="success">¥{itinerary.estimatedCost}</Text>
            </Descriptions.Item>
          </Descriptions>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 16 }}>行程安排</Text>
              </div>
              
              {itinerary.itinerary.map((day, index) => (
                <Card 
                  key={day.day}
                  style={{ 
                    marginBottom: 16,
                    borderColor: activeDay === index ? '#1890ff' : undefined,
                    cursor: 'pointer'
                  }}
                  onClick={() => setActiveDay(index)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <Text strong>第{day.day}天</Text>
                      <Tag>{day.date}</Tag>
                    </Space>
                    {activeDay === index && (
                      <Tag color="blue">当前</Tag>
                    )}
                  </div>
                  
                  {activeDay === index && renderActivities(day.activities)}
                </Card>
              ))}
            </div>
            
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 16 }}>位置地图</Text>
              </div>
              <Card>
                <div 
                  id="map-container" 
                  style={{ 
                    width: '100%', 
                    height: 400, 
                    backgroundColor: '#f0f0f0',
                    borderRadius: 4
                  }}
                >
                  {!mapInitialized ? (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      地图加载中...
                    </div>
                  ) : null}
                </div>
              </Card>
              
              <Space style={{ marginTop: 16, width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => navigate('/')}>
                  返回首页
                </Button>
                <Button type="primary" onClick={() => message.success('行程已保存')}>
                  保存行程
                </Button>
              </Space>
            </div>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Itinerary;