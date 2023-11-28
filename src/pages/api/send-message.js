import OpenAI from 'openai';
const { Kafka } = require('kafkajs');

// Reading Kafka broker address from environment variables
const kafkaBrokerAddress = process.env.KAFKA_BROKER_ADDRESS || 'ip.quarkmed.com:9094';
// Kafka setup
const kafka = new Kafka({
  clientId: 'chat-app',
  brokers: [kafkaBrokerAddress]
});
const producer = kafka.producer();

// Connect the Kafka producer
producer.connect();

// 创建一个等待函数
function waitForResponse(openai, threadId, runId) {
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const runStatus = await openai.beta.threads.runs.retrieve(
          threadId,
          runId,
        );

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
      const { message } = req.body;
      console.log("Received message:", message); // 日志接收到的消息

      // 配置 OpenAI
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: "https://oai.hconeai.com/v1",
        defaultHeaders: {
          "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
        },
      });

      // 设置 Assistant ID
      const assistantId = process.env.OPENAI_ASSISTANT_ID;

      console.log("Sending message to OpenAI:", message); // 日志发送给OpenAI的消息
      const run = await openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
          messages: [
            { role: "user", content: message },
          ],
        },
      });

      const threadId = run.thread_id;

      const completedRun = await waitForResponse(openai, threadId, run.id);
 
      const threadMessages = await openai.beta.threads.messages.list(threadId);

      if (threadMessages?.data?.length > 0) {
        const latestMessage = threadMessages.data[0];
        console.log("Received response from OpenAI:", latestMessage.content[0].text.value); // 日志从OpenAI接收到的响应

       // After getting the AI response
       await producer.send({
          topic: 'chatmed',
          messages: [{ value: JSON.stringify({ userMessage: message, aiMessage: latestMessage.content[0].text.value }) }],
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
