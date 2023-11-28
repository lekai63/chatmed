// index.tsx
import React, { useEffect } from 'react';
import ChatBox from '../components/ChatBox/ChatBox'; // 确保这个路径是正确的
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  useEffect(() => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userId', userId);
    }
    console.log("userId in index.tsx is:",userId);
  }, []);
  return (
    <div className="chat-container relative">
      <ChatBox />
    </div>
  );
};

export default Home;
