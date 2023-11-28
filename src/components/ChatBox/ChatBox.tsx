// components/ChatBox/ChatBox.tsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { ChatContext } from '../../contexts/ChatContext';
import axios from 'axios';

let messageIdCounter = 0;
let aiThinkingMessageId = 0;
const generateUniqueId = () => messageIdCounter++;

const ChatBox = () => {
  const { messages, setMessages } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const aiThinkingTimer = useRef<NodeJS.Timeout | null>(null);


  const aiThinkingTimeLimit = 30; // 30 seconds countdown

  // 建立与服务器的SSE连接，监听新消息
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("No userId found in localStorage");
      return;
    }

    console.log(`Establishing SSE connection with userId: ${userId}`);
    const eventSource = new EventSource(`/api/events?userId=${userId}`);


    eventSource.addEventListener('customMessage', (event) => {
      console.log("Received SSE data:", event.data);
      try {
        const data = JSON.parse(event.data);
        console.log("Parsed SSE data:", data);

        if (aiThinkingMessageId !== 0) {
          setAiThinking(false); // Stop displaying AI thinking message
          if (aiThinkingTimer.current !== null) {
            clearTimeout(aiThinkingTimer.current);
          } // Clear the countdown timer
          setMessages(prevMessages => prevMessages.map(msg =>
            msg.id === aiThinkingMessageId ? { ...msg, text: data.aiMessage, isUser: false, timestamp: new Date() } : msg
          ));
          aiThinkingMessageId = 0; // Reset the aiThinkingMessageId
        } 
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

   // 处理发送消息的逻辑
   const handleSendMessage = async () => {
    if (aiThinkingMessageId !== 0) return; // Prevent sending if AI is thinking

    const userId = localStorage.getItem('userId');
    if (newMessage.trim()) {
      // 先在界面上显示用户消息
      setMessages(prevMessages => [
        ...prevMessages,
        { id: generateUniqueId(), text: newMessage, isUser: true, timestamp: new Date() }
      ]);
  
      // 清空输入框
      setNewMessage('');

      // 模拟AI正在思考的消息
      aiThinkingMessageId = generateUniqueId();

      setMessages(prevMessages => [
        ...prevMessages,
        { id: aiThinkingMessageId, text: "AI is thinking...", isUser: false, timestamp: new Date() }
      ]);
  
      try {
        // 向服务器发送消息
        await axios.post('/api/send-message', { message: newMessage, userId: userId });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }

    setAiThinking(true); // Start displaying AI thinking message
    aiThinkingTimer.current = setTimeout(() => {
      setAiThinking(false); // Stop displaying AI thinking message after 30 seconds
    }, aiThinkingTimeLimit * 1000);
  };

  // 处理输入框变化
  const handleInput = (event) => {
    setNewMessage(event.target.value);
  };

  // 处理键盘按键事件
const handleKeyPress = (event) => {
  if (event.key === 'Enter' && aiThinkingMessageId === 0) {
    handleSendMessage();
  }
};

return (
  <div className="chat-box flex flex-col h-full overflow-auto"> {/* Added overflow-auto */}
    <MessageList messages={messages} />
      <InputBox
        value={newMessage}
        onChange={handleInput}
        onKeyPress={handleKeyPress}
        onSend={handleSendMessage}
      />
        {aiThinking && <div className="ai-thinking-message">AI is thinking... {aiThinkingTimeLimit} seconds</div>}
    </div>
  );
};

export default ChatBox;
