// lib/sse.js

export const initSSE = (onMessageCallback) => {
    const eventSource = new EventSource('/api/events');
  
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessageCallback(data);
    };
  
    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      // 处理错误情况，例如重连逻辑
    };
  
    return eventSource;
  };
  