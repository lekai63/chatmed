import { useEffect, useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';
import devLog from "../utils/devLog";
import axios from 'axios';

const useSSE = (userId:string, threadId:string) => {
  const { setMessages } = useContext(ChatContext);

  useEffect(() => {
    if (!userId || !threadId) return;

    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events?userId=${userId}`);

    eventSource.addEventListener('customMessage',async (event) => {
      devLog("sse customMessage arrived");
      try {
        const data = JSON.parse(event.data);
        setMessages(prevMessages => prevMessages.map(msg =>
          msg.id === data.aiThinkingMessageId ? { ...msg, text: data.aiMessage, isUser: false, timestamp: new Date() } : msg
        ));

           // 日志记录接收到的消息
           devLog(`Received message: ${data.aiMessage}`);
             // 发送确认信号到服务器
        await axios.post('${process.env.NEXT_PUBLIC_API_BASE_URL}/api/message-confirmation', {
          messageId: data.aiThinkingMessageId,
          threadId: threadId
        });
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    });

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
    };

    return () => {
      eventSource.close();
    };
  }, [userId, threadId, setMessages]);
};

export default useSSE;
