// components/ChatBox/ChatBox.tsx
import React, { useState, useEffect, useContext } from 'react';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { ChatContext } from '../../contexts/ChatContext';
import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid'; // 导入 uuid 库

let messageIdCounter = 0;
let aiThinkingMessageId: number | null = null; // 新增变量来存储临时 AI 消息的 ID

const generateUniqueId = () => {
  return messageIdCounter++; // 返回当前值并递增计数器
};


const ChatBox = () => {
  const { messages, setMessages } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("No userId found in localStorage");
      return;
    }
    console.log(`Establishing SSE connection with userId: ${userId}`);
    const eventSource = new EventSource(`/api/events?userId=${userId}`);

 // 客户端无法收到data中的换行符，解决办法是对于有空格符的消息添加自定义事件，客户端监听进行空格符的添加
  eventSource.addEventListener('customMessage', (event) => {
      console.log("Received SSE data:", event.data);
      try {
        const data = JSON.parse(event.data);
        console.log("Parsed SSE data:", data);
        setMessages(prevMessages => [
          ...prevMessages,
          { id: generateUniqueId(), text: data.userMessage, isUser: true, timestamp: new Date() },
          { id: generateUniqueId(), text: data.aiMessage, isUser: false, timestamp: new Date() }
        ]);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    });

      // 处理自定义事件  修改 SSE 监听器
  eventSource.addEventListener('customMessage', (event) => {
    console.log("Received SSE data:", event.data);
    try {
      const data = JSON.parse(event.data);
      console.log("Parsed SSE data:", data);

      // 更新消息列表，替换临时 AI 消息
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === aiThinkingMessageId ? { ...msg, text: data.aiMessage, isUser: false, timestamp: new Date() } : msg
      ));

      // 清除 AI 思考消息的 ID
      aiThinkingMessageId = null;
    } catch (error) {
      console.error('Error parsing SSE data:', error);
    }
  });

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
    };

    return () => {
      eventSource.close();
      console.log("EventSource closed");
    };
  }, [setMessages]);

  const handleSendMessage = async () => {
    const userId = localStorage.getItem('userId');
    if (newMessage.trim()) {
       // 在发送请求前立即显示用户消息
    setMessages(prevMessages => [
      ...prevMessages,
      { id: generateUniqueId(), text: newMessage, isUser: true, timestamp: new Date() }
    ]);

    // 为 AI 思考添加临时消息
  let countdown = 30;
  const aiThinkingMessageId = generateUniqueId();
  setMessages(prevMessages => [
    ...prevMessages,
    { id: aiThinkingMessageId, text: `我正在思考中，${countdown}s`, isUser: false, timestamp: new Date() }
  ]);

  const interval = setInterval(() => {
    countdown -= 1;
    setMessages(prevMessages => prevMessages.map(msg => 
      msg.id === aiThinkingMessageId ? { ...msg, text: `我正在思考中，${countdown}s` } : msg
    ));
    if (countdown <= 0) clearInterval(interval);
  }, 1000);


  // 发送请求
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
