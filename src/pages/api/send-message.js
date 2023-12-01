// pages/api/send-message.js
import {
  createThread,
  addMessageToThread,
  runThread,
  waitForResponse,
} from "../../lib/openai";
import devLog from "../../utils/devLog";

import { RedisClient } from "redis";

const redisClient = new RedisClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on("error", function (error) {
  console.error(error);
});

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { message, aiThinkingMessageId, userId } = req.body;
      let { threadId } = req.body;

      const assistantId = process.env.OPENAI_ASSISTANT_ID;

      // 检查是否有提供 thread ID，如果没有则创建新的线程
      if (!threadId) {
        // TODO 返回，调用 createThread 函数来创建新的线程
        threadId = await createThread(openai);
      }

      await addMessageToThread(threadId, message);

      const runId = await runThread(threadId, assistantId);
      const completedRun = await waitForResponse(threadId, runId);
      const threadMessages = await openai.beta.threads.messages.list(threadId);

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
