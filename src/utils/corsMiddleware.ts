// utils/corsMiddleware.ts
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
// 初始化CORS中间件，根据需要调整配置

const allowedOrigins = [process.env.CDN_URL || 'https://pc.xxhzjk.com',process.env.NEXT_PUBLIC_API_BASE_URL || "https://deeplx.xxhzjk.com"];

const corsOptions: Cors.CorsOptions  = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'HEAD', 'POST'],
};

const cors = Cors(corsOptions);

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
