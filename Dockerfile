# 阶段 1: 构建
FROM node:latest as builder

WORKDIR /app

COPY package*.json ./

# 安装依赖，不包括devDependencies
RUN npm install --production

COPY . .

RUN npm run build

# 清理npm缓存
RUN npm cache clean --force

# 阶段 2: 运行
FROM node:alpine

WORKDIR /app

# 只复制构建产物和运行时需要的依赖
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["npm", "start"]
