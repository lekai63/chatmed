# doc  https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:18-alpine AS base

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY package.json package-lock.json* ./
# 环境变量需要在action中写入 https://www.hyperxiao.top/zh-CN/posts/5
# 复制.env文件用于运行时
COPY .env ./
# 安装生产依赖
RUN npm ci --only=production

# 复制生产代码
COPY . .

# 暴露端口
EXPOSE 3000

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"


# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
