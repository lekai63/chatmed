// pages/api/create-thread.js
import { createThread } from '../../lib/openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {

    try {
      const threadId = await createThread();

      res.status(200).json({ success: true, threadId: threadId });
    } catch (error) {
      console.error('Error creating thread:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
