/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  // deploy - 设置静态资源的基础 URL
  assetPrefix: isProd ? process.env.CDN_URL : '',
  
  // 使用docker 部署在服务器
  output: 'standalone',
  // 导出静态资源 放到对象存储
  // output: 'export',
}

module.exports = nextConfig
