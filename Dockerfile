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

# 使用 nginx 作为生产环境服务器
FROM nginx:alpine

# 复制构建结果到 nginx 服务器
COPY --from=build /app/dist /usr/share/nginx/html

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]