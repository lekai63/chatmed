import { createClient, RedisClientType } from "redis";

const redisUrl = process.env.REDIS_URL;
let pubClient: RedisClientType | null = null;
let subClient: RedisClientType | null = null;
// 创建 Redis 客户端的函数
const createRedisClient = (): RedisClientType => {
  const client: RedisClientType = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: false
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

export const getPubClient = () => {
  if (!pubClient) {
    pubClient = createRedisClient();
  }
  return pubClient;
};


export const getSubClient = () => {
  if (!subClient) {
    subClient = createRedisClient();
  }
  return subClient;
};
