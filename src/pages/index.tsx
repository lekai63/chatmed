// index.tsx
import React from 'react';
import ChatBox from '../components/ChatBox/ChatBox'; // 确保这个路径是正确的

const Home = () => {
  return (
    <div className="chat-container relative">
      <ChatBox />
    </div>
  );
};

export default Home;
