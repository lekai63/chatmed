import React from 'react';
import { User, Mask } from '@icon-park/react';

interface MessageProps {
  isUser: boolean;
  text: string;
}

const Message: React.FC<MessageProps> = ({ isUser, text }) => {
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'ai-message'}`}>
      {isUser ? (
        <>
          <div className="icon-container ml-2"><User theme="outline" size="24" fill="#2d3748"/></div> {/* User icon on the left */}
          <div className="message-content">{text}</div>
        </>
      ) : (
        <>
          <div className="message-content">{text}</div>
          <div className="icon-container mr-2"><Mask theme="outline" size="24" fill="#4A5568"/></div> {/* AI icon on the right */}
        </>
      )}
    </div>
  );
};

export default Message;
