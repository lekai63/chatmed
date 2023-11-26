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
│   └── socket.ts
├── pages
│   ├── api
│   │   └── hello.ts
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   └── index.tsx.origin
├── services
│   └── chatService.ts
├── styles
│   └── globals.css
├── types
│   └── index.ts
└── utils
    └── chatUtils.ts

12 directories, 17 files
```

## Part 2: Code
// pages/index.tsx.origin
```
import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/pages/index.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Discover and deploy boilerplate example Next.js&nbsp;projects.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  )
}
```

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

// pages/api/hello.ts
```
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
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
// ChatBox.tsx
import React, { useState, useContext, useEffect } from 'react';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { ChatContext } from '../../contexts/ChatContext';

const ChatBox = () => {
  const { messages, sendMessage } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage('');
  };

  const handleInput = (event) => {
    setNewMessage(event.target.value);
  };

  // 监听Enter键发送消息
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-box flex flex-col h-full"> {/* Adjusted the class here */}
      <MessageList messages={messages} />
      <div className="pb-24 md:pb-16 lg:pb-10"></div> {/* Add spacing for the input box */}
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

// lib/socket.ts
```
```

// contexts/ChatContext.tsx
```
import React, { createContext, useState, useEffect, useCallback } from 'react';

// 定义消息类型
type MessageType = {
  id: number; // 每条消息的唯一ID
  text: string; // 消息内容
  isUser: boolean; // 是否用户消息
  timestamp: Date; // 消息时间戳
};

// 定义Context的值类型
type ChatContextType = {
  messages: MessageType[];
  sendMessage: (message: string) => void;
  receiveMessage: (message: string) => void;
};

// 初始Context值
const defaultContextValue: ChatContextType = {
  messages: [],
  sendMessage: () => {},
  receiveMessage: () => {},
};

// 创建Context
export const ChatContext = createContext<ChatContextType>(defaultContextValue);

// 消息ID生成器
let nextMessageId = 0;

// Context提供者组件
const ChatProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]); // 消息列表状态

  // 发送消息函数
  const sendMessage = useCallback((text: string) => {
    const newMessage: MessageType = {
      id: nextMessageId++,
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    // 这里可以添加将消息发送到服务器的逻辑
  }, []);

  // 接收消息函数
  const receiveMessage = useCallback((text: string) => {
    const newMessage: MessageType = {
      id: nextMessageId++,
      text,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    // 这里可以添加接收服务器消息的逻辑
  }, []);

  // 使用useEffect来模拟接收AI消息的响应
  // 这只是一个示例，实际上你可能会使用WebSockets或其他方法来实时接收消息
  useEffect(() => {
    // 这里可以设置监听服务器消息的逻辑
    // 假设这是从服务器接收到的消息
    const fakeAImessage = "欢迎使用ChatMed，有什么可以帮到您的吗？";
    receiveMessage(fakeAImessage);
  }, [receiveMessage]);

  // 返回Provider组件
  return (
    <ChatContext.Provider value={{ messages, sendMessage, receiveMessage }}>
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

// services/chatService.ts
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

