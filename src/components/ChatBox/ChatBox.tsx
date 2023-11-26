import React, { useState, useEffect, useContext } from 'react';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { ChatContext } from '../../contexts/ChatContext';
import axios from 'axios'; // 引入 axios 用于发送消息

const ChatBox = () => {
  const { messages, setMessages } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // 初始化 SSE 连接
    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // 假设服务器返回的数据结构是 { text: string, isUser: boolean }
      setMessages(prevMessages => [...prevMessages, data]);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      // 可以在这里添加重连逻辑
      eventSource.close();
    };

    // 清理函数
    return () => {
      eventSource.close();
    };
  }, [setMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      // 发送消息到服务器
      try {
        await axios.post('/api/send-message', { message: newMessage });
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
