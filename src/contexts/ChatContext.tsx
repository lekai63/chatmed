import React, { createContext, useState, useEffect, useCallback } from 'react';
import { setupMessageListener, sendMessage as sendWebSocketMessage } from '../lib/socket';

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
};

// 初始Context值
const defaultContextValue: ChatContextType = {
  messages: [],
  sendMessage: () => {},
};

// 创建Context
export const ChatContext = createContext<ChatContextType>(defaultContextValue);

// 消息ID生成器
let nextMessageId = 0;

// Context提供者组件
const ChatProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  // 发送消息函数
  const sendMessage = useCallback((text: string) => {
    const newMessage: MessageType = {
      id: nextMessageId++,
      // id: nextMessageId.toString(), // 将id转换为字符串
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    sendWebSocketMessage(JSON.stringify({ ...newMessage, id: newMessage.id.toString() })); // 将id转换为字符串
  }, []);

  // 接收消息函数
  const onMessageReceived = useCallback((message) => {
    const parsedMessage = JSON.parse(message.content); // 假设消息内容是JSON字符串
    if (!parsedMessage.isUser) {
      setMessages((prevMessages) => [...prevMessages, { ...parsedMessage, id: parseInt(parsedMessage.id, 10) }]); // 将id转换回数字
    }
  }, []);

  // 使用useEffect来设置监听器
  useEffect(() => {
    setupMessageListener(onMessageReceived);
  }, [onMessageReceived]);

  // 返回Provider组件
  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
