import React, { useEffect, useState } from "react";
import ChatBox from "../components/ChatBox/ChatBox";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const [userIdReady, setUserIdReady] = useState(false);
  const [threadId, setThreadId] = useState("");

  useEffect(() => {
    let userId = sessionStorage.getItem("userId");
    if (!userId) {
      userId = uuidv4();
      sessionStorage.setItem("userId", userId);
    }

    const fetchThreadId = async () => {
      try {
        const response = await axios.post("${process.env.NEXT_PUBLIC_API_BASE_URL}/api/create-thread", {
          userId: sessionStorage.getItem("userId"),
        });
        if (response.data.success) {
          const newThreadId = response.data.threadId;
          sessionStorage.setItem("threadId", newThreadId);
          setThreadId(newThreadId);
        }
      } catch (error) {
        console.error("Error creating new thread:", error);
      }
    };
    const existingThreadId = sessionStorage.getItem("threadId");
    if (!existingThreadId) {
      fetchThreadId();
    }

    setUserIdReady(true);
  }, []);

  return (
    <div className="chat-container relative">{userIdReady && <ChatBox />}</div>
  );
};

export default Home;
