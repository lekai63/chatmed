// components/ChatBox/ChatBox.tsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { ChatContext } from '../../contexts/ChatContext';
import axios from 'axios';

let messageIdCounter = 0;
const generateUniqueId = () => messageIdCounter++;

const ChatBox = () => {
  const { messages, setMessages } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');
  const aiThinkingTimer = useRef<number | null>(null);
  const aiThinkingTimeLimit = 30; // 30 seconds countdown
  const threadId = sessionStorage.getItem('threadId');
  const userId = sessionStorage.getItem('userId');


  useEffect(() => {
    if (!userId) {
      console.error("No userId found in sessionStorage");
      return;
    }

    if (!threadId) {
      console.error("No threadId found in sessionStorage");
      return;
    }
    console.log(`Establishing SSE connection with userId: ${userId}`);
    const eventSource = new EventSource(`/api/events?userId=${userId}`);

    eventSource.addEventListener('customMessage', (event) => {
      console.log("Received SSE data:", event.data);
      try {
        const data = JSON.parse(event.data);
    
        if (data.aiThinkingMessageId) {

          if (aiThinkingTimer.current !== null) {
            window.clearInterval(aiThinkingTimer.current);
        aiThinkingTimer.current = null;
          }
          
          setMessages(prevMessages => prevMessages.map(msg =>
            msg.id === data.aiThinkingMessageId ? { ...msg, text: data.aiMessage, isUser: false, timestamp: new Date() } : msg
          ));
      
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    });

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
    };

     // 处理网页关闭   
     const handleWindowClose = () => {
      console.log("Window is closing");
      // 这里可以放置其他需要在窗口关闭前执行的逻辑
    };

  window.addEventListener('beforeunload', handleWindowClose);

 // 在组件卸载时执行的清理操作
 return () => {
  window.removeEventListener('beforeunload', handleWindowClose);
  eventSource.close();
  console.log("EventSource closed");

  // 结束线程
  const endThread = async () => {
    try {
      const threadId = sessionStorage.getItem('threadId');
      if (threadId) {
        await axios.post('/api/end-thread', { threadId });
        console.log("Thread ended successfully");
      }
    } catch (error) {
      console.error("Error ending thread:", error);
    }
  };
  endThread();
};
}, [userId, threadId, setMessages]);

  const handleSendMessage = async () => {
    const userId = sessionStorage.getItem('userId');
    if (newMessage.trim()) {
      const userMessageId = generateUniqueId();
      // Display user message immediately
      setMessages(prevMessages => [
        ...prevMessages,
        { id: userMessageId, text: newMessage, isUser: true, timestamp: new Date() }
      ]);

      setNewMessage('');

      const aiThinkingMessageId = generateUniqueId();

     // Display AI thinking message
    setMessages(prevMessages => [
      ...prevMessages,
      { id: aiThinkingMessageId, text: "AI is thinking... "+ aiThinkingTimeLimit, isUser: false, timestamp: new Date() }
    ]);

    let countdown = aiThinkingTimeLimit;
    aiThinkingTimer.current =  window.setInterval(() => {
      countdown--;
      setMessages(prevMessages => prevMessages.map(msg =>
        msg.id === aiThinkingMessageId ? { ...msg, text: `AI is thinking... ${countdown}` } : msg
      ));

      if (countdown <= 0) {
        if (aiThinkingTimer.current !== null) {
          window.clearInterval(aiThinkingTimer.current);
      aiThinkingTimer.current = null;
        }
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== aiThinkingMessageId));
      }
    }, 1000);

      try {
        await axios.post('/api/send-message', { message: newMessage, userId: userId, aiThinkingMessageId: aiThinkingMessageId,threadId: threadId });
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
    <div className="chat-box flex flex-col h-full overflow-auto"> {/* Ensure overflow-auto for scrolling */}
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
