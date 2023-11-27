## Part 1: Project Directory Structure
```
./src
├── components
│   ├── Background
│   │   └── Background.tsx
│   └── ChatBox
│       ├── ChatBox.tsx
│       ├── InputBox.tsx
│       ├── MessageList.tsx
│       └── Message.tsx
├── contexts
│   └── ChatContext.tsx
├── hooks
│   └── useChat.ts
├── lib
│   └── sse.js
├── pages
│   ├── api
│   │   ├── events.js
│   │   └── send-message.js
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx
├── styles
│   └── globals.css
├── types
│   └── index.ts
└── utils
    └── chatUtils.ts

11 directories, 16 files
```

## Part 2: Code
// pages/index.tsx
```
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
```

// pages/_app.tsx
```
import '@/styles/globals.css'
import React from 'react';
import ChatProvider from '../contexts/ChatContext';
import Background from '../components/Background/Background';
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  // return <Component {...pageProps} />

  return (
    

      <ChatProvider>
      <Background />
      <Component {...pageProps} />
    </ChatProvider>

  );
}


```

// pages/_document.tsx
```
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

// pages/api/send-message.js
```
import OpenAI from 'openai';
const { Kafka } = require('kafkajs');

// Reading Kafka broker address from environment variables
const kafkaBrokerAddress = process.env.KAFKA_BROKER_ADDRESS || 'localhost:9092';
// Kafka setup
const kafka = new Kafka({
  clientId: 'chat-app',
  brokers: [kafkaBrokerAddress]
});
const producer = kafka.producer();

// Connect the Kafka producer
producer.connect();

// 创建一个等待函数
function waitForResponse(openai, threadId, runId) {
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const runStatus = await openai.beta.threads.runs.retrieve(
          threadId,
          runId,
        );

        if (runStatus.status !== 'queued' && runStatus.status !== 'in_progress') {
          resolve(runStatus);
        } else {
          setTimeout(checkStatus, 500);
        }
      } catch (error) {
        console.error(`Error while checking status for runId: ${runId}`, error);
        reject(error);
      }
    };

    checkStatus();
  });
}


export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { message } = req.body;
      console.log("req.body:", message);

      // 配置 OpenAI
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: "https://oai.hconeai.com/v1",
        defaultHeaders: {
          "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
        },
      });

      // 设置 Assistant ID
      const assistantId = process.env.OPENAI_ASSISTANT_ID;

      const run = await openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
          messages: [
            { role: "user", content: message },
          ],
        },
      });

      const threadId = run.thread_id;

      const completedRun = await waitForResponse(openai, threadId, run.id);
 
      const threadMessages = await openai.beta.threads.messages.list(threadId);

      if (threadMessages?.data?.length > 0) {
        const latestMessage = threadMessages.data[0];
        console.log("latestMessage.content[0]:",latestMessage.content[0])

       // After getting the AI response
       await producer.send({
          topic: 'chat-messages',
          messages: [{ value: JSON.stringify({ userMessage: message, aiMessage: latestMessage.content[0].text.value }) }],
          });

        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ success: false, message: 'No messages found in the thread' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error interacting with OpenAI:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
```

// pages/api/events.js
```
const { Kafka } = require('kafkajs');

// Reading Kafka broker address from environment variables
const kafkaBrokerAddress = process.env.KAFKA_BROKER_ADDRESS || 'localhost:9092';

// Kafka setup
const kafka = new Kafka({
  clientId: 'chat-app',
  brokers: [kafkaBrokerAddress]
});
const consumer = kafka.consumer({ groupId: 'chat-group' });

// Connecting the Kafka consumer
consumer.connect();
consumer.subscribe({ topic: 'chat-messages', fromBeginning: true });

export default function handler(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.write('\n');

  // Kafka consumer messages
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const content = JSON.parse(message.value.toString());
      res.write(`data: ${JSON.stringify(content)}\n\n`);
    },
  });

  req.on('close', () => {
    // Handle client disconnect
    res.end();
  });
}
```

// components/ChatBox/Message.tsx
```
import React from 'react';
import { User, Mask } from '@icon-park/react';

const Message = ({ isUser, text }) => {
  return (
<div className={`chat-message ${isUser ? 'user-message' : 'ai-message'}`}>
  {isUser ? (
    <>
      <div className="icon-container ml-2"><User theme="outline" size="24" fill="#ffffff"/></div> {/* User icon on the left */}
      <div className="message-content">{text}</div>
    </>
  ) : (
    <>
      <div className="message-content">{text}</div>
      <div className="icon-container mr-2"><Mask theme="outline" size="24" fill="#ffffff"/></div> {/* AI icon on the right */}
    </>
  )}
</div>
  );
};

export default Message;
```

// components/ChatBox/InputBox.tsx
```
import React from 'react';

const InputBox = ({ value, onChange, onKeyPress, onSend }) => {
  return (

// InputBox.tsx
<div className="fixed bottom-0 left-0 right-0 p-4 bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg shadow-inner rounded-t-lg border-t-2 border-gray-200">
  <div className="flex items-center justify-between max-w-3xl mx-auto">
    <input
      type="text"
      className="flex-grow border-2 border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-75"
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder="请输入乳腺癌相关的问题"
    />
    <button
      className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
      onClick={onSend}
    >
      发送
    </button>
  </div>
</div>

  );
};

export default InputBox;
```

// components/ChatBox/MessageList.tsx
```
import React, { useRef, useEffect } from 'react';
import Message from './Message';

const MessageList = ({ messages }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-message-list flex-1 overflow-y-auto pb-12"> {/* 添加了 pb-4 (padding-bottom: 1rem) */}
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
```

// components/ChatBox/ChatBox.tsx
```
import React, { useState, useEffect, useContext } from 'react';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { ChatContext } from '../../contexts/ChatContext';
import axios from 'axios'; // 引入 axios 用于发送消息

const ChatBox = () => {
  const { messages, setMessages } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // 初始化 SSE 连接
    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // 假设服务器返回的数据结构是 { text: string, isUser: boolean }
      setMessages(prevMessages => [...prevMessages, data]);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      // 可以在这里添加重连逻辑
      eventSource.close();
    };

    // 清理函数
    return () => {
      eventSource.close();
    };
  }, [setMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      // 发送消息到服务器
      try {
        await axios.post('/api/send-message', { message: newMessage });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleInput = (event) => {
    setNewMessage(event.target.value);
  };

  // 监听 Enter 键发送消息
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-box flex flex-col h-full">
      <MessageList messages={messages} />
      <InputBox
        value={newMessage}
        onChange={handleInput}
        onKeyPress={handleKeyPress}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default ChatBox;
```

// components/Background/Background.tsx
```
import React from 'react';

const Background = () => {
  const backgroundStyle = {
    width: '100%',               // 宽度为100%
    height: '100vh',             // 高度为视窗的100%
    backgroundImage: 'url(/images/background.png)', // 使用图片路径
    backgroundSize: 'cover',     // 覆盖整个区域
    backgroundPosition: 'center', // 居中背景图片
    backgroundRepeat: 'no-repeat', // 不重复背景图片
    position: 'fixed',           // 固定定位
    top: 0,                      // 从顶部开始
    left: 0,                     // 从左侧开始
    zIndex: -1                   // 确保背景在内容之下
  };

  return <div style={backgroundStyle} />;
};

export default Background;
```

// lib/sse.js
```
// lib/sse.js

export const initSSE = (onMessageCallback) => {
    const eventSource = new EventSource('/api/events');
  
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessageCallback(data);
    };
  
    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      // 处理错误情况，例如重连逻辑
    };
  
    return eventSource;
  };
  ```

// contexts/ChatContext.tsx
```
// contexts/ChatContext.tsx
import React, { createContext, useState } from 'react';

// 定义消息类型
type MessageType = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

// 定义Context的值类型
type ChatContextType = {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
};

// 创建Context
export const ChatContext = createContext<ChatContextType>({
  messages: [],
  setMessages: () => {}, // 默认空实现
});

// Context提供者组件
const ChatProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
```

// utils/chatUtils.ts
```
```

// hooks/useChat.ts
```
```

// types/index.ts
```
```

// styles/globals.css
```
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}


/* globals.css */
@layer components {
  .chat-container {
    @apply min-h-screen flex flex-col items-center justify-between mx-auto;
    width: 90%; /* 根据你的设计调整宽度 */
    height: 85%; /* 根据你的设计调整高度 */
    background-color: rgba(255, 255, 255, 0.85); /* 调整透明度 */
    /* 确保背景颜色只应用到该容器，而不影响子组件 */
    isolation: isolate; 
  }

  .chat-box {
    @apply w-full h-full p-[2px]; /* w-full 和 h-full 使得组件尽可能大，p-[2px] 在周围留下2像素的内边距 */
  }

  .chat-message-list {
    @apply overflow-y-auto flex-1 w-full p-4;
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* 使得消息在右边对齐 */
  }

  .chat-input-box {
    @apply border-t-2 border-gray-200 p-2;
  }

  .chat-message {
    @apply mb-2 flex items-center p-2 rounded-lg;
    max-width: 70%;  /* 限制最大宽度 */
    display: flex; /* 使用flex布局 */
    align-items: center; /* 垂直居中对齐 */
  }

  .user-message {
    @apply bg-blue-500 text-white self-end justify-end rounded-lg; 
    @apply flex-row justify-start items-center; /* 图标在左，内容在右 */
  }
  

  /* 图标容器样式，用于用户消息 */
  .user-message .icon-container {
  @apply order-1 ml-2; /* 用户图标在内容的右侧，加上左边距 */
}

  .ai-message {
    @apply bg-gray-200 text-gray-800 self-start justify-start rounded-lg; 
    @apply flex-row; /* 当AI发消息时，图标在左，内容在右 */
  }

  /* 图标容器样式，用于AI消息 */
  .ai-message .icon-container {
    @apply order-first mr-2; /* AI图标在内容的左侧，加上右边距 */
}

  .icon-container {
    flex-shrink: 0; /* 防止图标压缩 */
  }

/* 消息内容样式 */
  .message-content {
  @apply flex-grow break-words; /* 让文本内容占满剩余空间，自动换行 */
}


}

```

