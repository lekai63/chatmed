import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;
    console.log("req.body:", message);

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

    try {
      const run = await openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
          messages: [
            { role: "user", content: message },
          ],
        },
      });
      
      console.log(run);

      // 修正后的代码
      if (run?.thread_id) {
        const threadId = run.thread_id;
        const threadMessages = await openai.beta.threads.messages.list(threadId);
        console.log("all messages in thread ", threadId, "are:\n", threadMessages.data);

        if (threadMessages?.data?.length > 0) {
          const latestMessage = threadMessages.data[0];
          res.status(200).json({ success: true, response: latestMessage.content.text.value });
        } else {
          res.status(404).json({ success: false, error: 'No messages found in the thread' });
        }
      } else {
        res.status(404).json({ success: false, error: 'Thread ID not found' });
      }
    } catch (error) {
      console.error('Error interacting with OpenAI:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
