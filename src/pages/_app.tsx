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


