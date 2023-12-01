import { useEffect, useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';

const useSSE = (userId, threadId) => {
  const { setMessages } = useContext(ChatContext);

  useEffect(() => {
    if (!userId || !threadId) return;

    const eventSource = new EventSource(`/api/events?userId=${userId}`);

    eventSource.addEventListener('customMessage', (event) => {
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
