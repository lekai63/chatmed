import React, { createContext, useState, useEffect, useCallback } from 'react';

// 定义消息类型
type MessageType = {
  id: number; // 每条消息的唯一ID
  text: string; // 消息内容
  isUser: boolean; // 是否用户消息
  timestamp: Date; // 消息时间戳
};

// 定义Context的值类型
type ChatContextType = {
  messages: MessageType[];
  sendMessage: (message: string) => void;
  receiveMessage: (message: string) => void;
};

// 初始Context值
const defaultContextValue: ChatContextType = {
  messages: [],
  sendMessage: () => {},
  receiveMessage: () => {},
};

// 创建Context
export const ChatContext = createContext<ChatContextType>(defaultContextValue);

// 消息ID生成器
let nextMessageId = 0;

// Context提供者组件
const ChatProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]); // 消息列表状态

  // 发送消息函数
  const sendMessage = useCallback((text: string) => {
    const newMessage: MessageType = {
      id: nextMessageId++,
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    // 这里可以添加将消息发送到服务器的逻辑
  }, []);

  // 接收消息函数
  const receiveMessage = useCallback((text: string) => {
    const newMessage: MessageType = {
      id: nextMessageId++,
      text,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    // 这里可以添加接收服务器消息的逻辑
  }, []);

  // 使用useEffect来模拟接收AI消息的响应
  // 这只是一个示例，实际上你可能会使用WebSockets或其他方法来实时接收消息
  useEffect(() => {
    // 这里可以设置监听服务器消息的逻辑
    // 假设这是从服务器接收到的消息
    const fakeAImessage = "欢迎使用ChatMed，有什么可以帮到您的吗？";
    receiveMessage(fakeAImessage);
  }, [receiveMessage]);

  // 返回Provider组件
  return (
    <ChatContext.Provider value={{ messages, sendMessage, receiveMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
