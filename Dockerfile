# ---------- Build Stage ----------
FROM node:25 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------- Production Stage ----------
FROM nginx:1.28.0

COPY --from=builder /app/dist /usr/share/nginx/html

# 覆盖默认 Nginx 配置，允许 SPA 路由
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
