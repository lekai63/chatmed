// ChatBox.tsx
import React, { useState, useContext, useEffect } from 'react';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { ChatContext } from '../../contexts/ChatContext';

const ChatBox = () => {
  const { messages, sendMessage } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage('');
  };

  const handleInput = (event) => {
    setNewMessage(event.target.value);
  };

  // 监听Enter键发送消息
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-box flex flex-col h-full"> {/* Adjusted the class here */}
      <MessageList messages={messages} />
      <div className="pb-24 md:pb-16 lg:pb-10"></div> {/* Add spacing for the input box */}
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
