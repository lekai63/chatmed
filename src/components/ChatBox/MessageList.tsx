import React, { useRef, useEffect } from 'react';
import Message from './Message';
import { MessageType } from '../../contexts/ChatContext';

interface MessageListProps {
  messages: MessageType[]; // 使用导入的MessageType
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-message-list flex-1 overflow-y-auto pb-16">
      {messages
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .map((message, index) => (
        <Message key={index} {...message} />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
