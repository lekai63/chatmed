// pages/api/end-thread.js

import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { threadId } = req.body;

    // 初始化 OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://oai.hconeai.com/v1",
      defaultHeaders: {
        "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
      },
    });

    try {
      console.log("Attempting to end thread with ID:", threadId);
      // 调用 OpenAI API 结束 thread
      const response = await openai.beta.threads.del(threadId);
      res.status(200).json({ success: true, message: 'Thread ended successfully' });
    } catch (error) {
      console.error('Error ending thread:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
