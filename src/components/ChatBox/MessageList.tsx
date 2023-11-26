import React, { useRef, useEffect } from 'react';
import Message from './Message';

const MessageList = ({ messages }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-message-list flex-1 overflow-y-auto pb-12"> {/* 添加了 pb-4 (padding-bottom: 1rem) */}
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
