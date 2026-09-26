# Build context is the repo root (see docker-compose.yml) so npm workspaces resolve.
FROM node:22-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate --workspace=backend
RUN npm run build --workspace=backend

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /repo
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/backend/dist ./backend/dist
COPY --from=build /repo/backend/prisma ./backend/prisma
COPY --from=build /repo/backend/package.json ./backend/package.json
COPY --from=build /repo/package.json ./package.json

WORKDIR /repo/backend
EXPOSE 4000
# Seeding is idempotent (skips if the admin account already exists), so it's safe to
# run on every container start.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node dist/src/main.js"]
