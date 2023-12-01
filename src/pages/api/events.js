import { RedisClient } from "redis";

const redisClient = new RedisClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
export default async function handler(req, res) {
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
