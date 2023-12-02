import { createClient } from 'redis';
import devLog from "../utils/devLog";

// 根据环境变量确定是否使用 TLS
const isProduction = process.env.NODE_ENV === 'production';

const redisUrl = process.env.REDIS_URL;

devLog('Redis URL:', process.env.REDIS_URL,"\nNODE_ENV:", process.env.NODE_ENV); 

const redisClient = createClient({
  url: redisUrl,
  socket: isProduction ? {
    tls: true,
    rejectUnauthorized: false // 根据需要配置
  } : {
    tls: false
  }
});

redisClient.on("error", function (error) {
  console.error("Redis Client Error:", error);
});
// 尝试连接
redisClient.connect().catch(console.error);

export default redisClient;