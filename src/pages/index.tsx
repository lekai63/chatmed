// pages/index.tsx

import React, { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox/ChatBox';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const [userIdReady, setUserIdReady] = useState(false);

  useEffect(() => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userId', userId);
    }
    setUserIdReady(true);
  }, []);

  return (
    <div className="chat-container relative">
      {userIdReady && <ChatBox />}
    </div>
  );
};

export default Home;
