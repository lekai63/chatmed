// components/ChatBox/ChatBox.tsx
import React, { useState, useEffect, useContext } from 'react';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { ChatContext } from '../../contexts/ChatContext';
import axios from 'axios';

const ChatBox = () => {
  const { messages, setMessages } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log(`Establishing SSE connection with userId: ${userId}`);
    const newEventSource = new EventSource(`/api/events?userId=${userId}`);

    newEventSource.onmessage = (event) => {
      console.log("Received SSE data:", event.data);
      const data = JSON.parse(event.data);
      console.log("Parsed SSE data:", data);
      if (data && data.aiMessage && data.userMessage) {
        const now = new Date();
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
        setTimeout(() => connectEventSource(userId), 3000);
      }
    };

    setEventSource(newEventSource);
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [setMessages]);

  const handleSendMessage = async () => {
    const userId = localStorage.getItem('userId');
    console.log(`Sending message: ${newMessage}, userId: ${userId}`);
    if (newMessage.trim()) {
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
