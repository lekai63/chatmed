import { NextApiRequest, NextApiResponse } from 'next';
import redisClient from '../../lib/redisClient';
import devLog from "../../utils/devLog";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId; // 从请求中获取用户ID
  console.log(`Received userId: ${userId}`); // 日志用户ID

  // 订阅频道，并提供一个回调函数
  const channel = process.env.REDIS_CHANNEL || "chatmed";
redisClient.subscribe(channel, (err, count) => {
  if (err) {
    console.error('Failed to subscribe: ', err);
  } else {
    console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
  }
});


  redisClient.on("message", (channel, message) => {
    devLog("SSE request received");
    const content = JSON.parse(message);
    if (content.userId === userId) {
      devLog("aiMessage subscribed from redis is forwarding to client:",content)
      // 在nextjs中使用SSE 需要注意 客户端无法接收到数据，需设置'no-cache, no-transform'，因为nextjs默认会压缩内容。
      res.writeHead(200, {
        "Content-Type": "text/event-stream;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "X-Accel-Buffering": "no",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      });
     
      res.write(`event: customMessage\ndata: ${JSON.stringify(content)}\n\n`);
    }
  });

  req.on("close", () => {
    res.end();
    redisClient.unsubscribe();
  });
}
