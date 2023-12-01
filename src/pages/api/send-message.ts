// pages/api/send-message.js
import { NextApiRequest, NextApiResponse } from 'next';
import {
  addMessageToThread,
  runThread,
  waitForResponse,
  threadMessagesList
} from "../../lib/openai";
import devLog from "../../utils/devLog";

import { createClient } from 'redis';


const redisClient = createClient({
  url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`, // 使用环境变量
  socket: {
    tls: true, // 开启 TLS
    rejectUnauthorized: false // 在本地开发时可能需要设置为 false
  },
});

redisClient.on("error", function (error) {
  console.error("Redis Client Error:", error);
});
// 尝试连接
redisClient.connect().catch(console.error);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { message, aiThinkingMessageId, userId } = req.body;
      let { threadId } = req.body;

      const assistantId = process.env.OPENAI_ASSISTANT_ID;

      if (!threadId || !assistantId ) {
      // 如果没有 threadId，则返回错误
      return res.status(400).json({ success: false, message: "Missing threadId" });
      }

      await addMessageToThread(threadId, message);

      const runId = await runThread(threadId, assistantId);
      const completedRun = await waitForResponse(threadId, runId);
      const threadMessages = await threadMessagesList(threadId);

      if (threadMessages?.data?.length > 0) {
        const latestMessage = threadMessages.data[0];
        devLog("aiMessage publish:",latestMessage.content[0].text.value)
        // 使用 Redis 发布消息
        redisClient.publish(
          "chatmed",
          JSON.stringify({
            userId,
            userMessage: message,
            aiMessage: latestMessage.content[0].text.value,
            aiThinkingMessageId,
            threadId,
          })
        );

        res.status(200).json({ success: true });
      } else {
        res
          .status(404)
          .json({ success: false, message: "No messages found in the thread" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res
        .status(405)
        .json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Error interacting with OpenAI:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
