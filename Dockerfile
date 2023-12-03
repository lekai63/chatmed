# 阶段 1: 构建
FROM node:latest as builder

WORKDIR /app

COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production

COPY . .

RUN npm run build

# 阶段 2: 运行
FROM node:alpine

WORKDIR /app

# 从构建阶段拷贝必要文件
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["npm", "start"]
