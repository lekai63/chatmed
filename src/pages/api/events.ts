import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'redis';


const redisClient = createClient({
  url: `rediss://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`, // 使用环境变量
  socket: {
    tls: true, // 开启 TLS
    rejectUnauthorized: false // 在本地开发时可能需要设置为 false
  },
  username: process.env.REDIS_USER, // 如果有用户名
  password: process.env.REDIS_PASSWORD, // 如果有密码
});
redisClient.on("error", function (error) {
  console.error("Redis Client Error:", error);
});
// 尝试连接
redisClient.connect().catch(console.error);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId; // 从请求中获取用户ID
  console.log(`Received userId: ${userId}`); // 日志用户ID

  redisClient.on("message", (channel, message) => {
    const content = JSON.parse(message);
    if (content.userId === userId) {
      // 在nextjs中使用SSE 需要注意 客户端无法接收到数据，需设置'no-cache, no-transform'，因为nextjs默认会压缩内容。
      res.writeHead(200, {
        "Content-Type": "text/event-stream;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "X-Accel-Buffering": "no",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      });
      res.write("\n");
      res.write(`event: customMessage\ndata: ${JSON.stringify(content)}\n\n`);
    }
  });

  req.on("close", () => {
    res.end();
    redisClient.unsubscribe();
  });
}
