import { createClient, RedisClientType } from "redis";

const redisUrl = process.env.REDIS_URL;
let redisClient: RedisClientType | null = null;

// 创建 Redis 客户端的函数
const createRedisClient = (): RedisClientType => {
  const client: RedisClientType = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: process.env.NODE_ENV === "production",
      rejectUnauthorized: false,
    },
  });

  client.on("error", (error) => {
    console.error("Redis Client Error:", error);
  });

  client
    .connect()
    .then(() => console.log("Redis client connected"))
    .catch((error) => console.error("Redis connection error:", error));

  return client;
};

const getRedisClient = () => {
  if (!redisClient) {
    redisClient = createRedisClient();
  }
  return redisClient;
};

export default getRedisClient;
