// pages/api/create-thread.js
import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId } = req.body;

    // 初始化 OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://oai.hconeai.com/v1",
      defaultHeaders: {
        "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
      },
    });

    try {
      // 创建新的线程
      const threadResponse = await openai.beta.threads.create();

      const threadId = threadResponse.id;

      res.status(200).json({ success: true, threadId: threadId });
    } catch (error) {
      console.error('Error creating thread:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
