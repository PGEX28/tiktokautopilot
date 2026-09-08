# ==========================================
# Base Image com Node.js + FFmpeg nativo
# ==========================================
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache ffmpeg fontconfig freetype ttf-dejavu

# ==========================================
# Stage 1: Dependências e Build
# ==========================================
FROM base AS builder
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY packages/queue/package.json ./packages/queue/
COPY packages/database/package.json ./packages/database/
COPY packages/tiktok/package.json ./packages/tiktok/
COPY packages/ai/package.json ./packages/ai/
COPY packages/video/package.json ./packages/video/

RUN npm install

COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN npm run build --workspace=@autopilot/shared && \
    npm run build --workspace=@autopilot/queue && \
    npm run build --workspace=@autopilot/database && \
    npm run build --workspace=@autopilot/tiktok && \
    npm run build --workspace=@autopilot/ai && \
    npm run build --workspace=@autopilot/video && \
    npm run build --workspace=@autopilot/api

# ==========================================
# Stage 2: Produção Runner
# ==========================================
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/

USER node
EXPOSE 3000

CMD ["node", "apps/api/dist/index.js"]
