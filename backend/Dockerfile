# Stage 1: Install dependencies
FROM node:24-bookworm-slim AS deps

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY backend/package.json backend/package-lock.json ./


RUN npm ci


# Stage 2: Build
FROM node:24-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY backend/src ./src
COPY backend/package.json backend/tsconfig.json backend/tsconfig.build.json backend/nest-cli.json ./


RUN npm run build


# Stage 3: Production
FROM node:24-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
    && apt-get install -y --no-install-recommends tzdata openssl libssl-dev \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY backend/package.json ./

CMD ["node", "dist/main.js"]
