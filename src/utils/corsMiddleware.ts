// utils/corsMiddleware.ts
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
// 初始化CORS中间件，根据需要调整配置
const cors = Cors({
  origin: process.env.CDN_URL, // 或者使用您的CDN的URL
  methods: ['GET', 'HEAD', 'POST'], // 根据需要调整允许的HTTP方法
});

// 导出cors对象
export { cors };

// 使用CORS中间件的函数
export function runMiddleware(
  req: NextApiRequest, 
  res: NextApiResponse, 
  fn: (req: NextApiRequest, res: NextApiResponse, callback: (result?: any) => void) => void
)  {
  return new Promise((resolve, reject) => {
    fn(req, res, (result : unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
