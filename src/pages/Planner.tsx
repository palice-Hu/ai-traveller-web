import React, { useState, useRef } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button, Card, Typography, Space, message, Switch, Spin } from 'antd';
import { AudioOutlined, AudioFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import aiService, { type ItineraryRequest, type ItineraryResponse } from '../services/aiService';
import speechService from '../services/speechService';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Planner: React.FC = () => {
  const [form] = Form.useForm();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [useVoiceInput, setUseVoiceInput] = useState(false);
  const listeningTimeout = useRef<any>(null);

  const startListening = () => {
    if (!speechService.isSupported()) {
      message.error('当前浏览器不支持语音识别功能');
      return;
    }

    setIsListening(true);
    
    // 设置5秒后自动停止录音
    if (listeningTimeout.current) {
      clearTimeout(listeningTimeout.current);
    }
    listeningTimeout.current = setTimeout(() => {
      stopListening();
    }, 5000);

    speechService.startRecording(
      (text) => {
        // 成功识别语音
        message.success('语音识别成功');
        // 这里可以将识别结果填充到表单中
        // 为了演示，我们使用模拟数据
        const mockText = speechService.getMockSpeechResult();
        message.info(`识别结果: ${mockText}`);
        stopListening();
      },
      (error) => {
        // 识别出错
        message.error(`语音识别失败: ${error}`);
        stopListening();
      }
    );
  };

  const stopListening = () => {
    setIsListening(false);
    speechService.stopRecording();
    
    if (listeningTimeout.current) {
      clearTimeout(listeningTimeout.current);
      listeningTimeout.current = null;
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const [startDate, endDate] = values.dateRange;
      
      const request: ItineraryRequest = {
        destination: values.destination,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        budget: values.budget,
        travelers: values.travelers,
        preferences: values.preferences,
        specialRequests: values.specialRequests
      };
      
      // 调用AI服务生成行程
      const response: ItineraryResponse = await aiService.generateItinerary(request);
      
      // 显示成功消息
      message.success('行程规划生成成功！');
      
      // 跳转到行程详情页面，并传递行程数据
      navigate('/itinerary', { state: { itinerary: response } });
    } catch (error) {
      console.error('创建行程失败:', error);
      message.error('行程规划生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (listeningTimeout.current) {
        clearTimeout(listeningTimeout.current);
      }
    };
  }, []);

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
        maxWidth: 600, 
        width: '100%',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px'
      }}>
        <Title level={2} style={{ textAlign: 'center' }}>
          创建新行程
        </Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="destination"
            label="目的地"
            rules={[{ required: true, message: '请输入目的地' }]}
          >
            <Input placeholder="例如：北京、上海、杭州..." />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="出行日期"
            rules={[{ required: true, message: '请选择出行日期' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="budget"
            label="预算（元）"
            rules={[{ required: true, message: '请输入预算' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入预算金额"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="travelers"
            label="出行人数"
            rules={[{ required: true, message: '请输入出行人数' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入出行人数"
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="preferences"
            label="旅行偏好"
            rules={[{ required: true, message: '请选择旅行偏好' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择您的旅行偏好"
              optionLabelProp="label"
            >
              <Option value="美食" label="美食">美食</Option>
              <Option value="文化" label="文化">文化</Option>
              <Option value="自然景观" label="自然景观">自然景观</Option>
              <Option value="购物" label="购物">购物</Option>
              <Option value="历史遗迹" label="历史遗迹">历史遗迹</Option>
              <Option value="娱乐活动" label="娱乐活动">娱乐活动</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="specialRequests"
            label="特殊要求"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input.TextArea 
                placeholder="例如：有儿童同行、需要无障碍设施、饮食禁忌等"
                rows={3}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>使用语音输入:</span>
                <Switch 
                  checked={useVoiceInput}
                  onChange={setUseVoiceInput}
                />
                {useVoiceInput && (
                  <Button 
                    icon={isListening ? <AudioFilled /> : <AudioOutlined />} 
                    onClick={isListening ? stopListening : startListening}
                    type={isListening ? 'primary' : 'default'}
                  >
                    {isListening ? '停止录音' : '开始录音'}
                  </Button>
                )}
              </div>
            </Space>
          </Form.Item>

          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                style={{ width: '100%' }}
                loading={loading}
              >
                {loading ? <span><Spin size="small" style={{ marginRight: 8 }} /> 生成行程计划中...</span> : '生成行程计划'}
              </Button>
              <Button 
                size="large" 
                style={{ width: '100%' }}
                onClick={() => navigate('/')}
              >
                返回首页
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Planner;