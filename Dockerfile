# 使用 Node.js 官方镜像作为基础镜像
FROM node:20.18.1

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建项目
RUN npm run build

# 暴露端口
EXPOSE 9000

# 根据环境变量加载对应的 .env 文件
ARG ENV=production
COPY .env.${ENV} .env

# 启动项目
CMD ["npm", "run", "start:prod"]
