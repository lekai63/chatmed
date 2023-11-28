import React, { useState, useEffect, useContext } from 'react';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { ChatContext } from '../../contexts/ChatContext';
import axios from 'axios'; // 引入 axios 用于发送消息

const ChatBox = () => {
  const { messages, setMessages } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');
 // 明确 eventSource 的类型为 EventSource | null
 const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log(`Establishing SSE connection with userId: ${userId}`);
    connectEventSource(userId);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [setMessages]); 

  const connectEventSource = (userId) => {
    const newEventSource = new EventSource(`/api/events?userId=${userId}`);

    newEventSource.onmessage = (event) => {
      console.log("Received SSE data:", event.data); // 打印从 SSE 接收到的原始数据
      const data = JSON.parse(event.data);
    
      if (data && data.aiMessage && data.userMessage) {
        console.log("Parsed SSE data:", data);
    
        // 使用当前时间作为消息的时间戳
        const now = new Date();
    
        // 更新状态，添加新消息
        setMessages(prevMessages => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: data.userMessage, isUser: true, timestamp: now },
          { id: prevMessages.length + 2, text: data.aiMessage, isUser: false, timestamp: now }
        ]);
      } else {
        console.error('Unexpected message format:', data);
      }
    };

    newEventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      if (newEventSource.readyState === EventSource.CLOSED) {
        console.log("Attempting to reconnect...");
        setTimeout(() => connectEventSource(userId), 3000); // 3秒后尝试重新连接
      }
    };
    setEventSource(newEventSource);
  };

  const handleSendMessage = async () => {
    const userId = localStorage.getItem('userId'); // 获取用户ID
    console.log(`Sending message: ${newMessage}, userId: ${userId}`); // 日志发送的消息和用户ID
    const eventSource = new EventSource(`/api/events?userId=${userId}`);
    if (newMessage.trim()) {
      // 发送消息到服务器
      try {
        await axios.post('/api/send-message', { message: newMessage, userId: userId });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleInput = (event) => {
    setNewMessage(event.target.value);
  };

  // 监听 Enter 键发送消息
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-box flex flex-col h-full">
      <MessageList messages={messages} />
      <InputBox
        value={newMessage}
        onChange={handleInput}
        onKeyPress={handleKeyPress}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default ChatBox;
