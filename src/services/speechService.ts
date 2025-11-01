// 语音识别服务 - 集成科大讯飞Web SDK
// 需要在.env文件中配置以下环境变量：
// VITE_IFLYTEK_APP_ID: 科大讯飞应用ID
// VITE_IFLYTEK_API_KEY: 科大讯飞API密钥
// VITE_IFLYTEK_SECRET_KEY: 科大讯飞密钥

// 暂时注释掉语音服务实现，以便优先调试大模型API
/*
class SpeechService {
  private isRecording = false;
  private recognition: any = null;

  // 检查浏览器是否支持语音识别
  isSupported(): boolean {
    // 在实际应用中，这里会检查科大讯飞SDK是否可用
    // 由于科大讯飞SDK需要在浏览器环境中动态加载，这里简单返回true
    return true;
  }

  // 初始化科大讯飞SDK
  private async initIFlytekSDK(): Promise<any> {
    // 在实际项目中，这里需要加载科大讯飞的Web SDK
    // 例如通过动态插入script标签加载SDK
    // 由于SDK集成较为复杂，这里暂时使用浏览器原生API进行演示
    
    return new Promise((resolve, reject) => {
      if ((window as any).webkitSpeechRecognition) {
        resolve((window as any).webkitSpeechRecognition);
      } else if ((window as any).SpeechRecognition) {
        resolve((window as any).SpeechRecognition);
      } else {
        reject(new Error('浏览器不支持语音识别功能'));
      }
    });
  }

  // 开始录音
  startRecording(onResult: (text: string) => void, onError?: (error: string) => void): void {
    if (this.isRecording) {
      console.warn('录音已经在进行中');
      return;
    }

    try {
      // 在实际应用中，这里会调用科大讯飞SDK开始录音
      // 暂时使用浏览器原生的语音识别API进行模拟
      
      if ((window as any).webkitSpeechRecognition) {
        this.recognition = new (window as any).webkitSpeechRecognition();
      } else if ((window as any).SpeechRecognition) {
        this.recognition = new (window as any).SpeechRecognition();
      } else {
        throw new Error('浏览器不支持语音识别功能');
      }

      this.recognition.lang = 'zh-CN';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        this.isRecording = false;
      };

      this.recognition.onerror = (event: any) => {
        console.error('语音识别错误:', event.error);
        onError?.(event.error);
        this.isRecording = false;
      };

      this.recognition.onend = () => {
        this.isRecording = false;
      };

      this.recognition.start();
      this.isRecording = true;
      console.log('开始录音...');
    } catch (error) {
      console.error('启动录音失败:', error);
      onError?.('启动录音失败: ' + (error as Error).message);
    }
  }

  // 停止录音
  stopRecording(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
      console.log('停止录音');
    }
  }

  // 获取语音输入的文本结果（实际项目中会通过科大讯飞SDK获取）
  getSpeechResult(): Promise<string> {
    // 在实际项目中，这里会通过科大讯飞SDK获取识别结果
    return new Promise((resolve) => {
      // 模拟异步获取结果
      setTimeout(() => {
        const mockResults = [
          "我想去北京旅行，时间是下个月，预算5000元",
          "计划去上海迪士尼游玩，时间三天两夜，和家人一起",
          "需要一个关于杭州西湖的旅游计划，喜欢自然景观和美食",
          "我要去成都吃火锅，顺便游览市区景点，预算3000元"
        ];
        
        const randomIndex = Math.floor(Math.random() * mockResults.length);
        resolve(mockResults[randomIndex]);
      }, 1000);
    });
  }
}
*/

// 简化版本的语音服务，用于调试大模型API
class SpeechService {
  isSupported(): boolean {
    return false;
  }

  startRecording(onResult: (text: string) => void, onError?: (error: string) => void): void {
    console.log('语音识别功能已被注释，无法启动录音');
    onError?.('语音识别功能暂不可用');
  }

  stopRecording(): void {
    console.log('语音识别功能已被注释，无法停止录音');
  }

  getMockSpeechResult(): string {
    const mockResults = [
      "我想去北京旅行，时间是下个月，预算5000元",
      "计划去上海迪士尼游玩，时间三天两夜，和家人一起",
      "需要一个关于杭州西湖的旅游计划，喜欢自然景观和美食",
      "我要去成都吃火锅，顺便游览市区景点，预算3000元"
    ];
    
    const randomIndex = Math.floor(Math.random() * mockResults.length);
    return mockResults[randomIndex];
  }
}

export default new SpeechService();