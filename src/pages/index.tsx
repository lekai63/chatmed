// pages/index.tsx

import React, { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox/ChatBox';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


const Home = () => {
  const [userIdReady, setUserIdReady] = useState(false);
  const [threadId, setThreadId] = useState('');

  useEffect(() => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userId', userId);
    }

  // 创建一个新的 thread ID
  const createNewThread = async () => {
    try {
      // 发送请求到后端创建新的 thread
      const response = await axios.post('/api/create-thread', { userId });
      if (response.data.success) {
        const newThreadId = response.data.threadId;
        localStorage.setItem('threadId', newThreadId); // 保存 thread ID
        setThreadId(newThreadId);
      }
    } catch (error) {
      console.error('Error creating new thread:', error);
      // 可能需要添加错误处理逻辑
    }
  };

  createNewThread();
  setUserIdReady(true);
  }, []);

  return (
    <div className="chat-container relative">
      {userIdReady && <ChatBox />}
    </div>
  );
};

export default Home;
