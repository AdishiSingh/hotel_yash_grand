# HOTEL YASH GRAND — Production Multi-Stage Dockerfile
# Optimized for Next.js 16 Standalone Output & Minimum Security Footprint

# Stage 1: Base Image & Dependencies
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-libc6-compat

# Stage 2: Install Production Dependencies
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

# Stage 3: Build Application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js Web App
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 4: Production Runner (Minimalist Image)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Non-root user security execution
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["node", "scripts/scan-rooms.js", "&&", "node", "scripts/scan-gallery.js", "&&", "npm", "run", "start"]
