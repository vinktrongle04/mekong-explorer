# Base image
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy the monorepo configuration
COPY package.json package-lock.json ./
COPY api/package.json ./api/
COPY web/package.json ./web/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies using npm workspaces
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
WORKDIR /app/api
RUN npx prisma generate

# Build the API
RUN npm run build -w api

# Production image, copy all the files and run nest
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy root node_modules
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
# Copy api folder
COPY --from=builder --chown=nestjs:nodejs /app/api ./api

WORKDIR /app/api

USER nestjs

EXPOSE 3000
ENV PORT=3000

# Run using the start:prod script (now updated to dist/src/main)
CMD ["npm", "run", "start:prod"]
