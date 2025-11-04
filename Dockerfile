# 使用 Node.js 作为基础镜像
FROM node:20-alpine

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 复制源代码（除了.env文件）
COPY . .dockerignore ./
# .env 文件不会被复制，使用者需要自己提供

# 暴露开发服务器端口
EXPOSE 5173

# 设置默认命令
CMD ["pnpm", "dev", "--host"]