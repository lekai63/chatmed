// pages/api/send-message.js
import OpenAI from 'openai';
const { Kafka } = require('kafkajs');

const kafkaBrokerAddress = process.env.KAFKA_BROKER_ADDRESS || 'deeplx.xxhzjk.com:9094';

const kafka = new Kafka({
  clientId: 'chat-app',
  brokers: [kafkaBrokerAddress]
});
const producer = kafka.producer();

producer.connect();

async function createThread(openai) {
  const thread = await openai.beta.threads.create();
  return thread.id;
}

async function addMessageToThread(openai, threadId, message) {
  await openai.beta.threads.messages.create(
    threadId,
    {role: "user",
    content: message}
  );
}

async function runThread(openai, threadId, assistantId) {
  const run = await openai.beta.threads.runs.create(
    threadId,
    {assistant_id: assistantId}
  );
  return run.id;
}

// Function to wait for OpenAI response
function waitForResponse(openai, threadId, runId) {
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

        if (runStatus.status !== 'queued' && runStatus.status !== 'in_progress') {
          resolve(runStatus);
        } else {
          setTimeout(checkStatus, 500);
        }
      } catch (error) {
        console.error(`Error while checking status for runId: ${runId}`, error);
        reject(error);
      }
    };

    checkStatus();
  });
}

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { message, aiThinkingMessageId, userId } = req.body;

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: "https://oai.hconeai.com/v1",
        defaultHeaders: {
          "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
        },
      });

      const assistantId = process.env.OPENAI_ASSISTANT_ID;

  // 检查是否有提供 thread ID，如果没有则创建新的线程
  let threadId = req.body.threadId;
  if (!threadId) {
    // 调用 createThread 函数来创建新的线程
    threadId = await createThread(openai);
  }

  await addMessageToThread(openai, threadId, message);

      const runId = await runThread(openai, threadId, assistantId);
      const completedRun = await waitForResponse(openai, threadId, runId);
      const threadMessages = await openai.beta.threads.messages.list(threadId);

      if (threadMessages?.data?.length > 0) {
        const latestMessage = threadMessages.data[0];

        // After getting the AI response, send it to Kafka
        await producer.send({
          topic: 'chatmed',
          messages: [{
            value: JSON.stringify({
              userMessage: message,
              aiMessage: latestMessage.content[0].text.value,
              aiThinkingMessageId
            })
          }],
        });

        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ success: false, message: 'No messages found in the thread' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error interacting with OpenAI:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
