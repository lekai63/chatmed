# 使用 Node.js 官方镜像作为构建环境
FROM node:latest as builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json (或 yarn.lock)
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .

# 构建应用
RUN npm run build

# 运行阶段使用更轻量的基础镜像
FROM node:alpine

# 设置工作目录
WORKDIR /app

# 复制构建的 Next.js 应用和依赖
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 设置环境变量
ENV NODE_ENV production
ENV PORT 3000

# 暴露 3000 端口
EXPOSE 3000

# 运行 Next.js 应用
CMD ["npm", "start"]
