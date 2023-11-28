// components/ChatBox/ChatBox.tsx
import React, { useState, useEffect, useContext } from 'react';
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
          setMessages(prevMessages => prevMessages.map(msg =>
            msg.id === aiThinkingMessageId ? { ...msg, text: data.aiMessage, isUser: false, timestamp: new Date() } : msg
          ));
          aiThinkingMessageId = 0; // Reset the aiThinkingMessageId
        } else {
          setMessages(prevMessages => [
            ...prevMessages,
            { id: generateUniqueId(), text: data.aiMessage, isUser: false, timestamp: new Date() }
          ]);
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

  const handleSendMessage = async () => {
    const userId = localStorage.getItem('userId');
    if (newMessage.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: generateUniqueId(), text: newMessage, isUser: true, timestamp: new Date() }
      ]);

      aiThinkingMessageId = generateUniqueId();
      setMessages(prevMessages => [
        ...prevMessages,
        { id: aiThinkingMessageId, text: "AI is thinking...", isUser: false, timestamp: new Date() }
      ]);

      try {
        await axios.post('/api/send-message', { message: newMessage, userId: userId });
        setNewMessage(''); // Clear the input box after sending the message
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
