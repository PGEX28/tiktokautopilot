# ==========================================
# Stage 1: Build do Frontend React Vite
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/queue/package.json ./packages/queue/
COPY packages/database/package.json ./packages/database/
COPY packages/tiktok/package.json ./packages/tiktok/
COPY packages/ai/package.json ./packages/ai/
COPY packages/video/package.json ./packages/video/

RUN npm install

COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN npm run build --workspace=@autopilot/web

# ==========================================
# Stage 2: Nginx Web Server
# ==========================================
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
