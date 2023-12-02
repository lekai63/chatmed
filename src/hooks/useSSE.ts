import { useEffect, useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';
import devLog from "../utils/devLog";

const useSSE = (userId:string, threadId:string) => {
  const { setMessages } = useContext(ChatContext);

  useEffect(() => {
    if (!userId || !threadId) return;

    const eventSource = new EventSource(`/api/events?userId=${userId}`);

    eventSource.addEventListener('customMessage', (event) => {
      devLog("sse customMessage arrived");
      try {
        const data = JSON.parse(event.data);
        setMessages(prevMessages => prevMessages.map(msg =>
          msg.id === data.aiThinkingMessageId ? { ...msg, text: data.aiMessage, isUser: false, timestamp: new Date() } : msg
        ));
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
