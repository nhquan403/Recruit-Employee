# Việc Làm Thêm — Part-Time Job Marketplace

Website kết nối người tìm việc làm thêm (bán thời gian, theo ca, thời vụ) với nhà tuyển
dụng (cửa hàng, quán ăn, doanh nghiệp nhỏ). Quản trị viên duyệt tin trước khi hiển thị công
khai. Xem kế hoạch triển khai đầy đủ tại
[`plans/260926-1323-part-time-job-marketplace/plan.md`](./plans/260926-1323-part-time-job-marketplace/plan.md)
và tài liệu thiết kế UI/UX tại [`docs/design-guidelines.md`](./docs/design-guidelines.md).

## Tech stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + TailwindCSS 3
- **Backend**: NestJS 12 + TypeScript, REST API
- **Database**: PostgreSQL + Prisma ORM 6
- **Auth**: JWT (access token) + bcrypt + role-based guards (candidate / employer / admin)

## Prerequisites

- Node.js 20+ (developed with Node 22)
- PostgreSQL 16 reachable locally (via Docker, or a local install)

## Local setup

1. **Start Postgres** — either:
   - `docker compose up -d db`, or
   - a local PostgreSQL server with a database/role matching `DATABASE_URL` below.
2. **Configure env vars**:
   ```bash
   cp .env.example backend/.env
   # edit backend/.env if your local Postgres credentials differ
   ```
   Default dev credentials (matching `docker-compose.yml`): user `parttime`, password
   `parttime_dev_pw`, database `parttime_jobs`, port `5432`.
3. **Install dependencies** (root, installs both workspaces):
   ```bash
   npm install
   ```
4. **Run the database migration**:
   ```bash
   npm run prisma:migrate
   ```
5. **Seed an admin account** (default `admin@example.com` / `Admin@12345` — override via
   `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `backend/.env` before seeding):
   ```bash
   npm run seed
   ```
6. **Run both apps**:
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:4000 (health check at `/health`)
   - Frontend: http://localhost:3000

## Project layout

```
backend/    NestJS API (Prisma schema in backend/prisma/schema.prisma)
frontend/   Next.js app (App Router, TailwindCSS)
docs/       Design guidelines and other reference docs
plans/      Implementation plan (phase-by-phase)
```

## Testing

```bash
npm run test              # backend unit tests + frontend tests
npm run test:e2e          # backend integration tests (see backend/test/)
```

## Docker demo (full stack)

Once Phase 8 adds `backend`/`frontend` services to `docker-compose.yml`:

```bash
docker compose up --build
```

This is the primary graded/demo target. Deploying `frontend/` to Vercel and `backend/` +
a managed Postgres to Render/Railway is documented as an optional stretch, not required.
