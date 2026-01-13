FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://yagaart.shop/backend
ENV NEXT_PUBLIC_ADMIN_LOGIN=transchet
ENV NEXT_PUBLIC_ADMIN_PASSWORD=j!39NSHx
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]