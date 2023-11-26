// pages/api/events.js
export default function handler(req, res) {
    res.status(200).setHeader('Content-Type', 'text/event-stream')
      .setHeader('Cache-Control', 'no-cache')
      .setHeader('Connection', 'keep-alive')
      .write('\n');
  
    // 将消息发送到客户端
    const intervalId = setInterval(() => {
      res.write(`data: ${JSON.stringify({ message: "Hello from the server!" })}\n\n`);
    }, 1000);
  
    // 当客户端关闭连接时清理
    req.on('close', () => {
      clearInterval(intervalId);
      res.end();
    });
  }
  