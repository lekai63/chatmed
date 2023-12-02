// pages/api/send-message.js
import { NextApiRequest, NextApiResponse } from 'next';
import {
  addMessageToThread,
  runThread,
  waitForResponse,
  threadMessagesList
} from "../../lib/openai";
import redisClient from '../../lib/redisClient';
import devLog from "../../utils/devLog";

const channel = process.env.REDIS_CHANNEL || "chatmed";

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
          channel,
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
