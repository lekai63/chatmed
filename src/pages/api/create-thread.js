import { createThread } from '../../lib/openai';
import devLog from "../../utils/devLog";

export default async function handler(req, res) {
  if (req.method === 'POST') {

    try {
      const threadId = await createThread();
      devLog("threadId has been created:",threadId);
      res.status(200).json({ success: true, threadId: threadId });
    } catch (error) {
      console.error('Error creating thread:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
