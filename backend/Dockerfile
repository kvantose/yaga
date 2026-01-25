FROM node:24-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend/src ./src
COPY backend/tsconfig.json backend/tsconfig.build.json backend/nest-cli.json ./
RUN npm run build

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
