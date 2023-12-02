# 使用 Node.js 官方镜像
FROM node:latest
# 使用 Node.js 官方镜像
FROM node:latest

# 设置工作目录
WORKDIR /app

# 拷贝除 package-lock.json 外的所有项目文件
COPY [^package-lock.json]* ./

# 安装依赖
RUN npm config set registry https://mirrors.tencent.com/npm
RUN npm install

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
