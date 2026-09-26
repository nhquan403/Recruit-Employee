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
# NEXT_PUBLIC_* values are inlined into the client bundle at build time.
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build --workspace=frontend

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /repo
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/frontend/.next ./frontend/.next
COPY --from=build /repo/frontend/public ./frontend/public
COPY --from=build /repo/frontend/package.json ./frontend/package.json
COPY --from=build /repo/frontend/next.config.ts ./frontend/next.config.ts
COPY --from=build /repo/package.json ./package.json

WORKDIR /repo/frontend
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
