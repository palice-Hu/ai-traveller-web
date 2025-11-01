import React, { useState, useEffect, useCallback } from 'react';
import { Card, Typography, List, Space, Button, Tag, Descriptions, message, Spin, Collapse } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import mapService, { type MapLocation } from '../services/mapService';
import type { ItineraryResponse, ItineraryItem, Activity } from '../services/aiService';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const Itinerary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDay, setActiveDay] = useState(0);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationsCache, setLocationsCache] = useState<Record<string, MapLocation>>({});

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

  // 初始化地图服务
  useEffect(() => {
    const initMap = async () => {
      try {
        const result = await mapService.initialize();
        if (result) {
          setMapInitialized(true);
        }
      } catch (error) {
        console.error('地图初始化失败:', error);
        message.error('地图服务初始化失败');
      }
    };

    initMap();
  }, []);

  // 获取地点坐标
  const fetchLocation = useCallback(async (locationName: string): Promise<MapLocation | null> => {
    if (locationsCache[locationName]) {
      return locationsCache[locationName];
    }

    try {
      const locations = await mapService.searchPlaces(locationName);
      if (locations.length > 0) {
        const location = locations[0];
        setLocationsCache(prev => ({ ...prev, [locationName]: location }));
        return location;
      }
    } catch (error) {
      console.error('地点搜索失败:', error);
    }
    return null;
  }, [locationsCache]);

  // 当地图初始化完成且有行程数据时，渲染当前天的行程地图
  useEffect(() => {
    if (mapInitialized && itinerary?.itinerary[activeDay]) {
      renderDayOnMap(activeDay);
    }
  }, [mapInitialized, itinerary, activeDay]);

  // 在地图上渲染指定天的行程
  const renderDayOnMap = async (dayIndex: number) => {
    if (!mapInitialized || !itinerary) return;

    try {
      // 显示地图加载动画
      const loadingOverlay = document.getElementById('map-loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.opacity = '1';
      }

      const dayItinerary = itinerary.itinerary[dayIndex];
      const locations: MapLocation[] = [];
      
      // 获取所有地点的坐标
      for (const activity of dayItinerary.activities) {
        const location = await fetchLocation(activity.location);
        if (location) {
          locations.push({
            ...location,
            title: activity.title,
            description: activity.description
          });
        }
      }
      
      // 渲染地图，显示标记和路线
      mapService.renderMapWithRoute('map-container', locations);
    } catch (error) {
      console.error('地图渲染失败:', error);
      message.error('地图渲染失败');
      
      // 隐藏地图加载动画
      setTimeout(() => {
        const loadingOverlay = document.getElementById('map-loading-overlay');
        if (loadingOverlay) {
          loadingOverlay.style.opacity = '0';
          setTimeout(() => {
            loadingOverlay.style.display = 'none';
          }, 300);
        }
      }, 500);
    }
  };

  // 处理地点点击事件
  const handleLocationClick = async (locationName: string) => {
    if (!mapInitialized) return;

    try {
      const location = await fetchLocation(locationName);
      if (location) {
        mapService.focusOnLocation('map-container', location);
      }
    } catch (error) {
      console.error('定位地点失败:', error);
      message.error('定位地点失败');
    }
  };

  // 渲染活动列表
  const renderActivities = (activities: Activity[]) => {
    return (
      <List
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部标题和基本信息 */}
      <Card style={{ borderRadius: 0 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 0 }}>
          {itinerary.title}
        </Title>
        
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 4 }} style={{ marginBottom: 0 }}>
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
      </Card>

      {/* 主体部分 - 左侧行程详情，右侧地图 */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* 左侧行程详情 - 固定宽度 */}
        <div style={{ width: 350, overflowY: 'auto', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 16 }}>行程安排</Text>
            </div>
            
            {itinerary.itinerary.map((day, index) => (
              <Collapse 
                key={day.day}
                activeKey={activeDay === index ? String(index) : undefined}
                onChange={() => setActiveDay(index)}
                style={{ marginBottom: 8 }}
                items={[
                  {
                    key: index.toString(),
                    label: (
                      <Space>
                        <Text strong>第{day.day}天</Text>
                        <Tag>{day.date}</Tag>
                      </Space>
                    ),
                    children: renderActivities(day.activities)
                  }
                ]}
              />
            ))}
          </div>
          
          {/* 底部操作按钮 */}
          <div style={{ padding: '0 16px 16px', position: 'sticky', bottom: 0, backgroundColor: '#fff' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/')}>
                返回首页
              </Button>
              <Button type="primary" onClick={() => message.success('行程已保存')}>
                保存行程
              </Button>
            </Space>
          </div>
        </div>

        {/* 右侧地图区域 - 占据剩余空间并向下铺满 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 0, height: '100%' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 16
            }}>
              <Text strong style={{ fontSize: 16 }}>
                行程地图 - 第{itinerary.itinerary[activeDay]?.day}天 ({itinerary.itinerary[activeDay]?.date})
              </Text>
            </div>
            
            <div 
              id="map-container" 
              style={{ 
                flex: 1,
                backgroundColor: '#f0f0f0',
                borderRadius: 4,
                minHeight: '100%',
                position: 'relative'
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
                  <div>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>地图加载中...</div>
                  </div>
                </div>
              ) : null}
              {/* 地图加载动画遮罩 */}
              {mapInitialized && (
                <div 
                  id="map-loading-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    borderRadius: 4,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>正在渲染地图...</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;