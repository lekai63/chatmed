/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  env: {
    REDIS_URL: process.env.REDIS_URL,
    // 其他需要的环境变量
  },

  // deploy - 设置静态资源的基础 URL
  assetPrefix: isProd ? 'https://deeplx.xxhzjk.com' : '',
  
  // 使用docker 部署在服务器
  output: 'standalone',
  // 导出静态资源 放到对象存储
  // output: 'export',
}

module.exports = nextConfig
