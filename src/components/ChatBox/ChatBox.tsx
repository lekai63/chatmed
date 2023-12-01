import React, { useState, useEffect, useContext, useRef } from 'react';
import MessageList from "./MessageList";
import InputBox from "./InputBox";
import { ChatContext } from '../../contexts/ChatContext';
import axios from "axios";
import useSSE from "../../hooks/useSSE";
import { v4 as uuidv4 } from "uuid";

const ChatBox = () => {
  const { messages, setMessages } = useContext(ChatContext); // 使用 useContext 获取 messages 和 setMessages
  const [newMessage, setNewMessage] = useState("");
    // 安全地从 sessionStorage 获取 threadId 和 userId
    const threadId = sessionStorage.getItem("threadId") || "";
    const userId = sessionStorage.getItem("userId") || "";

  useSSE(userId, threadId);

  const handleSendMessage = async () => {
    const userId = sessionStorage.getItem("userId") || "";
    if (newMessage.trim()) {
      const userMessageId = uuidv4();

      // 直接显示用户消息
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: userMessageId,
          text: newMessage,
          isUser: true,
          timestamp: new Date(),
        },
      ]);

      setNewMessage("");

      try {
        // 发送消息到后端
        await axios.post("/api/send-message", {
          message: newMessage,
          userId: userId,
          threadId: threadId,
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };
  

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-box flex flex-col h-full overflow-auto">
      <MessageList messages={messages} />
      <InputBox
        value={newMessage}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewMessage(event.target.value)}
        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Enter') {
            handleSendMessage();
          }
        }}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default ChatBox;
