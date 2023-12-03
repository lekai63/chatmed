/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REDIS_URL: process.env.REDIS_URL,
    // 其他需要的环境变量
  },

  // deploy - 设置静态资源的基础 URL
  assetPrefix: 'https://chatmed.xxhzjk.com',

  // deploy - 配置 Image 组件支持的外部域名
  images: {
    domains: ['chatmed.xxhzjk.com'],
  },
}

module.exports = nextConfig
