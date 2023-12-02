// pages/api/message-confirmation.ts
import { NextApiRequest, NextApiResponse } from 'next';
import devLog from "../../utils/devLog";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { messageId, threadId } = req.body;

    // 在这里添加您的逻辑，例如更新数据库记录，或者记录到日志文件
    devLog(`Confirmation received for message ${messageId} in thread ${threadId}`);

    res.status(200).json({ success: true, message: `Confirmation received for message ${messageId}` });
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
