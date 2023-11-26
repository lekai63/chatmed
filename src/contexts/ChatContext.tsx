import React, { createContext, useState, useEffect, useCallback } from 'react';
import socket from '../lib/socket';
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
  receiveMessage: (message: MessageType) => void;
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
    socket.emit('chat message', newMessage); // 发送消息到服务器
  }, []);

  // 接收消息函数
 const receiveMessage = useCallback((message: MessageType) => {
  setMessages((prevMessages) => [...prevMessages, message]);
}, []);

// 使用useEffect来监听来自服务器的消息
useEffect(() => {
  socket.on('chat message', receiveMessage);

  // 清理函数
  return () => {
    socket.off('chat message', receiveMessage);
  };
}, [receiveMessage]);

  // 返回Provider组件
  return (
    <ChatContext.Provider value={{ messages, sendMessage, receiveMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
