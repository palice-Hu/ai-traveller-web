// 集成阿里云百炼平台大语言模型API
// 通过应用ID调用API

export interface ItineraryRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  preferences: string[];
  specialRequests?: string;
}

export interface ItineraryItem {
  day: number;
  date: string;
  activities: Activity[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  cost?: number;
}

export interface ItineraryResponse {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  estimatedCost: number;
  itinerary: ItineraryItem[];
}

class AIService {
  private apiKey: string;
  private appId: string;

  constructor() {
    // 从环境变量获取API密钥和应用ID
    this.apiKey = import.meta.env.VITE_ALIYUN_DASHSCOPE_API_KEY || '';
    this.appId = import.meta.env.VITE_ALIYUN_DASHSCOPE_APP_ID || '';
    
    if (!this.apiKey) {
      console.warn('未找到阿里云百炼平台API密钥，请在.env文件中设置VITE_ALIYUN_DASHSCOPE_API_KEY');
    }
    
    if (!this.appId) {
      console.warn('未找到阿里云百炼平台应用ID，请在.env文件中设置VITE_ALIYUN_DASHSCOPE_APP_ID');
    }
  }

  // 调用大语言模型API生成行程
  async generateItinerary(request: ItineraryRequest): Promise<ItineraryResponse> {
    try {
      // 构造提示词
      const prompt = this.buildPrompt(request);
      
      // 调用阿里云百炼平台API
      const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/apps/${this.appId}/completion`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: {
            prompt: prompt
          },
          parameters: {
            // temperature: 0.7,
            // max_tokens: 2000
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // 解析响应
      const content = result.output?.text || '{}';
      let itineraryData;
      
      try {
        itineraryData = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON解析失败:', parseError);
        // 如果解析失败，使用备用方案
        itineraryData = this.generateFallbackItineraryData(request);
      }
      
      return {
        id: 'itinerary_' + Date.now(),
        title: `${request.destination}旅行计划`,
        destination: request.destination,
        startDate: request.startDate,
        endDate: request.endDate,
        budget: request.budget,
        estimatedCost: itineraryData.estimatedCost || request.budget,
        itinerary: itineraryData.itinerary || this.generateFallbackItinerary(request)
      };
    } catch (error) {
      console.error('调用大语言模型API失败:', error);
      // 出错时返回模拟数据
      return {
        id: 'itinerary_' + Date.now(),
        title: `${request.destination}旅行计划`,
        destination: request.destination,
        startDate: request.startDate,
        endDate: request.endDate,
        budget: request.budget,
        estimatedCost: Math.round(request.budget * 0.8),
        itinerary: this.generateFallbackItinerary(request)
      };
    }
  }

  // 构造提示词
  private buildPrompt(request: ItineraryRequest): string {
    return `请为用户规划一个详细的旅行行程，具体要求如下：
目的地：${request.destination}
出行日期：${request.startDate} 至 ${request.endDate}
预算：${request.budget}元
出行人数：${request.travelers}人
旅行偏好：${request.preferences.join(', ')}
特殊要求：${request.specialRequests || '无'}

请按照以下JSON格式返回结果：
{
  "estimatedCost": 3000,
  "itinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "09:00",
          "title": "活动标题",
          "description": "活动详细描述",
          "location": "活动地点",
          "duration": "活动时长",
          "cost": 100
        }
      ]
    }
  ]
}

注意事项：
1. 行程安排要合理，符合时间逻辑
2. 活动内容要与用户偏好匹配
3. 费用估算要尽量准确
4. 只返回JSON格式数据，不要包含其他内容，不要使用Markdown格式`;
  }

  // 生成备用行程数据（当API调用失败时使用）
  private generateFallbackItinerary(request: ItineraryRequest): ItineraryItem[] {
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const itinerary: ItineraryItem[] = [];
    
    for (let i = 0; i < daysDiff; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      itinerary.push({
        day: i + 1,
        date: currentDate.toISOString().split('T')[0],
        activities: this.generateFallbackActivities(request.preferences)
      });
    }
    
    return itinerary;
  }

  // 生成备用行程数据对象
  private generateFallbackItineraryData(request: ItineraryRequest): any {
    return {
      estimatedCost: Math.round(request.budget * 0.8),
      itinerary: this.generateFallbackItinerary(request)
    };
  }

  // 生成备用活动数据
  private generateFallbackActivities(preferences: string[]): Activity[] {
    const activities: Activity[] = [];
    
    // 根据偏好生成不同的活动
    if (preferences.includes('美食')) {
      activities.push({
        time: '12:00',
        title: '当地特色餐厅',
        description: '品尝当地特色美食',
        location: '市中心美食街',
        duration: '1.5小时',
        cost: 150
      });
    }
    
    if (preferences.includes('文化')) {
      activities.push({
        time: '10:00',
        title: '博物馆参观',
        description: '了解当地历史文化',
        location: '市立博物馆',
        duration: '2小时',
        cost: 80
      });
    }
    
    if (preferences.includes('自然景观')) {
      activities.push({
        time: '14:00',
        title: '自然公园游览',
        description: '欣赏自然美景',
        location: '城市公园',
        duration: '2小时',
        cost: 0
      });
    }
    
    // 默认活动
    if (activities.length === 0) {
      activities.push({
        time: '09:00',
        title: '城市观光',
        description: '开始一天的城市探索',
        location: '市中心',
        duration: '1小时',
        cost: 0
      });
    }
    
    return activities;
  }
}

export default new AIService();