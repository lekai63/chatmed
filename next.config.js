/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REDIS_URL: process.env.REDIS_URL,
    // 其他需要的环境变量
  },
}

module.exports = nextConfig
