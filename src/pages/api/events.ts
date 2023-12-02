import { NextApiRequest, NextApiResponse } from 'next';
import getRedisClient from '../../lib/redisClient';
import devLog from "../../utils/devLog";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId; // 从请求中获取用户ID
  console.log(`Received userId: ${userId}`); // 日志用户ID

//  在nextjs中使用SSE 需要注意 客户端无法接收到数据，需设置'no-cache, no-transform'，因为nextjs默认会压缩内容。
//  若多次发送响应头，会报[ERR_HTTP_HEADERS_SENT]
//  为避免多次发送响应头，您需要确保 res.writeHead 只在第一次建立连接时调用。一旦头部被发送，后续只需使用 res.write 发送数据。
  
  res.writeHead(200, {
    "Content-Type": "text/event-stream;charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "X-Accel-Buffering": "no",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
  });

  const messageHandler = (message: string) => {
    const content = JSON.parse(message);
    if (content.userId === userId) {
      devLog("messageHandler func log,content send:",content);
      res.write(`event: customMessage\ndata: ${JSON.stringify(content)}\n\n`);
    }
  };

  // 订阅频道，并提供一个回调函数
  const channel = process.env.REDIS_CHANNEL || "chatmed";
  const  redisClient = getRedisClient();
  if (!redisClient) {
    // 处理 redisClient 为 null 的情况
    return res.status(500).send('Redis client is not initialized');
  }
  
  redisClient.subscribe(channel, messageHandler);

  req.on("close", () => {
    devLog("Closing SSE connection");
    redisClient.unsubscribe(channel, messageHandler);
    res.end();
  });
}
