---
phase: 1
title: "Project Scaffolding, Database & DevOps Baseline"
status: pending
priority: P1
effort: "1.5d"
dependencies: []
---

# Phase 1: Project Scaffolding, Database & DevOps Baseline

## Goal
Stand up an npm-workspaces monorepo with a Next.js frontend and a NestJS backend, wire the
backend to PostgreSQL through Prisma using the 5-table schema, and make the whole stack
runnable locally with one `docker compose up` for Postgres plus `npm run dev` for the two
apps.

## Context Links
- Overview: `./plan.md`
- No existing code — this repo is empty (fresh git init, branch `claude/intelligent-turing-6u4r33`).

## Key Insights
- Keep the monorepo flat and tool-free: npm workspaces only, no Nx/Turborepo — this is a
  2-app student project, not a platform.
- Prisma migrations are the source of truth for schema; never hand-edit the database.
- Seed script must create one ADMIN account so Phase 6 (admin screens) has someone to log
  in as from day one.

## Requirements

### Functional
- `npm install` at repo root installs both apps via workspaces.
- `docker compose up -d db` starts Postgres with a persisted volume.
- `npx prisma migrate dev` (run from `backend/`) creates all 5 tables + enums.
- `npm run seed` (backend) creates one admin user (`admin@example.com` / a seeded password,
  documented in `README.md`, never checked into git in plaintext anywhere else).
- Backend exposes `GET /health` returning `{ status: "ok" }` once DB connection succeeds.
- Frontend home page renders a placeholder page confirming the app boots.

### Non-Functional
- `.env` files are git-ignored; `.env.example` at repo root and inside `backend/` document
  every required variable (`DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`,
  `NEXT_PUBLIC_API_URL`).
- TypeScript strict mode on in both apps.
- Shared ESLint + Prettier config so both apps format consistently.

## Architecture

```
Recruit-Employee/
├── package.json                 # npm workspaces root: ["frontend", "backend"]
├── docker-compose.yml           # postgres (+ backend/frontend services added fully in Phase 8)
├── .env.example
├── .gitignore
├── README.md
├── frontend/
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── src/app/(placeholder page, layout)
├── backend/
│   ├── package.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── prisma/prisma.module.ts
│       ├── prisma/prisma.service.ts
│       └── health/health.controller.ts
└── plans/                       # this plan
```

### Prisma Schema (all 5 tables)

```prisma
// backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CANDIDATE
  EMPLOYER
  ADMIN
}

enum JobStatus {
  PENDING
  APPROVED
  REJECTED
}

enum ApplicationStatus {
  PENDING
  VIEWED
  INTERVIEW
  REJECTED
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  passwordHash  String
  role          Role
  fullName      String
  phone         String?
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  profile       Profile?
  jobs          Job[]          @relation("EmployerJobs")
  applications  Application[]
  notifications Notification[]
}

model Job {
  id           String        @id @default(uuid())
  title        String
  description  String
  area         String        // khu vực
  shift        String        // khung giờ, e.g. "T2-T6 18:00-22:00"
  salaryMin    Int?
  salaryMax    Int?
  salaryUnit   String        @default("VND/giờ")
  requirements String?
  status       JobStatus     @default(PENDING)
  rejectReason String?
  employerId   String
  employer     User          @relation("EmployerJobs", fields: [employerId], references: [id])
  applications Application[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@index([status, area])
}

model Application {
  id          String            @id @default(uuid())
  jobId       String
  job         Job               @relation(fields: [jobId], references: [id])
  candidateId String
  candidate   User              @relation(fields: [candidateId], references: [id])
  status      ApplicationStatus @default(PENDING)
  message     String?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@unique([jobId, candidateId])
}

model Profile {
  id             String   @id @default(uuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])
  bio            String?
  skills         String[] @default([])
  preferredAreas String[] @default([])
  avatarUrl      String?
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String   // APPLICATION_CREATED | APPLICATION_STATUS_CHANGED | JOB_APPROVED | JOB_REJECTED
  message   String
  link      String?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId, isRead])
}
```

## Related Code Files
- Create: `package.json`, `docker-compose.yml`, `.env.example`, `.gitignore`, `README.md`
- Create: `frontend/*` (Next.js scaffold via `create-next-app` then customized)
- Create: `backend/*` (NestJS scaffold via `nest new` then customized)
- Create: `backend/prisma/schema.prisma`, `backend/prisma/seed.ts`
- Create: `backend/src/prisma/prisma.module.ts`, `backend/src/prisma/prisma.service.ts`
- Create: `backend/src/health/health.controller.ts`

## Implementation Steps
1. `git init` is already done (repo exists); create root `package.json` with
   `"workspaces": ["frontend", "backend"]` and root scripts (`dev`, `build`, `lint`).
2. Scaffold `backend/` with NestJS CLI, TypeScript, add `@nestjs/config`, `@prisma/client`,
   `prisma`, `class-validator`, `class-transformer`, `bcrypt`, `@nestjs/jwt`,
   `@nestjs/passport`, `passport-jwt`.
3. Scaffold `frontend/` with `create-next-app` (App Router, TypeScript, TailwindCSS, ESLint).
4. Write `backend/prisma/schema.prisma` exactly as above; run
   `npx prisma migrate dev --name init` to create the initial migration and generate the
   client.
5. Add `PrismaModule`/`PrismaService` (global module, `onModuleInit` connects,
   `onModuleDestroy` disconnects) so every later module can `@Inject` it.
6. Add `backend/prisma/seed.ts`: creates one ADMIN user with a bcrypt-hashed password;
   wire it via `"prisma": {"seed": "ts-node prisma/seed.ts"}` in `backend/package.json`.
7. Add `GET /health` controller returning `{ status: 'ok', db: <boolean> }` (pings Prisma
   with a trivial query).
8. Write `docker-compose.yml` with a single `db` service (Postgres 15, named volume,
   `POSTGRES_DB/USER/PASSWORD` from `.env`) — backend/frontend services are added in
   Phase 8 once both apps are feature-complete.
9. Write `.env.example` (root) and confirm `backend/.env` (git-ignored) matches
   `DATABASE_URL=postgresql://user:pass@localhost:5432/parttime_jobs`.
10. Write root `README.md`: prerequisites, `docker compose up -d db`, `npm install`,
    `npm run prisma:migrate --workspace=backend`, `npm run seed --workspace=backend`,
    `npm run dev` (both apps), seeded admin credentials.

## Todo List
- [ ] Root workspace `package.json` with `frontend`/`backend` workspaces
- [ ] `backend/` NestJS scaffold + dependencies installed
- [ ] `frontend/` Next.js + TypeScript + Tailwind scaffold
- [ ] `prisma/schema.prisma` with all 5 models + 3 enums, migration applied
- [ ] `PrismaService`/`PrismaModule` wired into `AppModule`
- [ ] `seed.ts` creates 1 admin user
- [ ] `GET /health` returns ok once DB is reachable
- [ ] `docker-compose.yml` with `db` service, `.env.example` documented
- [ ] `README.md` with full local setup steps

## Success Criteria
- From a clean checkout: `docker compose up -d db && npm install && npm run prisma:migrate --workspace=backend && npm run seed --workspace=backend && npm run dev` results in
  the backend on `http://localhost:4000/health` returning `{status:"ok"}` and the frontend
  on `http://localhost:3000` rendering without errors.
- `npx prisma studio` (or `psql`) shows all 5 tables and the seeded admin row.
- `npm run lint` passes in both workspaces.

## Risk Assessment
- **Risk:** Prisma/Postgres version mismatch on the grading machine. **Mitigation:** pin
  Postgres to `postgres:15-alpine` in Docker so the DB is not a host dependency.
- **Risk:** Committing a real `.env`. **Mitigation:** `.gitignore` covers `.env*` except
  `.env.example`; verify with `git status` before the first commit.

## Security Considerations
- No secrets in `.env.example` (placeholder values only).
- `JWT_SECRET` documented as "generate your own, do not reuse the example" in README.

## Next Steps
- Phase 2 (UI/UX) can start in parallel conceptually but its output (design tokens) is
  needed before Phase 3 starts building frontend pages — do Phase 2 next.
