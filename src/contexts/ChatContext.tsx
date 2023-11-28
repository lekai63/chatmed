// contexts/ChatContext.tsx
import React, { createContext, useState } from 'react';

// 定义消息类型
type MessageType = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

// 定义Context的值类型
type ChatContextType = {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
};

// 创建Context
export const ChatContext = createContext<ChatContextType>({
  messages: [],
  setMessages: () => {}, // 默认空实现
});

interface ChatProviderProps {
  children: React.ReactNode; // 明确声明 children 的类型
}
// Context提供者组件
const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
