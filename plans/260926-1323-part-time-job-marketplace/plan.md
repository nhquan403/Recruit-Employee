---
title: "Part-Time Job Marketplace (Việc Làm Thêm)"
description: "Full-stack web app connecting part-time/shift job seekers with small-business employers, with admin moderation, built on Next.js + NestJS + PostgreSQL/Prisma"
status: pending
priority: P1
effort: 10.5d
issue: null
branch: claude/intelligent-turing-6u4r33
tags: [fullstack, nextjs, nestjs, prisma, postgresql, jwt, marketplace, capstone, uiux]
blockedBy: []
blocks: []
created: 2026-09-26
---

# Part-Time Job Marketplace — Implementation Plan

## Overview

A capstone (đồ án cơ sở ngành) web application connecting **candidates** looking for
short-term/flexible work (part-time, by shift, seasonal) with **employers** (shops,
restaurants, small businesses) who need to fill those shifts fast. An **admin** moderates
every job posting before it appears publicly, to keep the board free of fake listings.

The product is deliberately narrow: no payroll, no e-contracts, no chatbot, no ID
verification, no real payment gateway. Three roles (candidate / employer / admin), email +
password auth with JWT, and a review-then-publish workflow for job posts are the whole
system. Mobile-first responsive UI, since most candidates will use this from a phone.

Real-world reference points used to shape the UI (see Phase 2 for the full spec): TopCV.vn
and Vieclam24h.vn (Vietnamese job boards — filter-first search, salary shown up front on
every card) and gig/shift apps like Instawork and Wonolo (pay + hours visible on the card,
one-tap apply, simple status tracking). This project borrows the *information layout*
patterns from those products, not their business features (no staffing-agency matching,
no instant pay).

## Scope Challenge (Step 0)

- **What already exists:** The repository (`Recruit-Employee`) is empty — no prior commits,
  no scaffolding. Nothing to reuse; this is a greenfield build.
- **What was actually asked for:** Everything in the user's brief is in scope and delivered
  in full — 3 roles, JWT auth, 5-table schema, all 7 use cases, all 6 screens, the exact
  apply → notify → review → notify-back flow, unit + integration tests, and a working local
  demo (Docker). Nothing beyond that brief was added, except one design phase (Phase 2),
  because the user explicitly asked to also use the UI/UX skill.
- **Complexity check:** This plan spans ~8 phases and both a frontend and backend app —
  more than the "keep it under 3 phases" default, but that is inherent to a real full-stack
  capstone with 3 roles and 7 use cases, and it matches the user's own 7-step ordered
  checklist almost 1:1 (see mapping below). Each phase stays single-purpose and is scoped to
  avoid extra abstractions (no microservices, no GraphQL, no state-management library beyond
  React context — see "Kept deliberately simple" below).
- **Selected mode:** HOLD SCOPE — the user's brief is precise and complete; the plan
  delivers it as specified, prioritizing correct RBAC, a clean apply-flow, and test coverage
  over adding anything extra.

## Kept Deliberately Simple (per "làm đơn giản nhất có thể")

- **Monorepo, not microservices**: one `frontend/` (Next.js) and one `backend/` (NestJS) app
  in an npm-workspaces monorepo. No Nx/Turborepo tooling.
- **Notifications = DB row + short-interval polling**, not a WebSocket gateway. The spec
  explicitly allows this simpler fallback ("hoặc email nếu đơn giản hơn"); Phase 7 documents
  Socket.IO as an optional stretch, not the default build.
- **State management = React Context + fetch/SWR**, no Redux/Zustand.
- **Styling = TailwindCSS utility classes** with a small shared token set (Phase 2), not a
  component library like Ant Design, to keep the bundle and the learning curve small.
- **Deployment = docker-compose** as the primary, graded demo target. Vercel/Render/Railway
  is called out as an optional public-URL stretch, not required for the plan to be "done."

## Tech Stack (as specified by the user)

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + TailwindCSS |
| Backend | NestJS (Node.js) + TypeScript, REST |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (access token) + bcrypt password hashing + role-based guards |
| Notifications | DB-backed + polling (MVP); Socket.IO gateway noted as optional stretch |
| Tests | Jest (unit) + Nest's e2e/integration harness + Testing Library for FE |
| Source control | Git — this repo, branch `claude/intelligent-turing-6u4r33` |
| Deploy (demo) | Docker Compose (Postgres + backend + frontend) |

## Database Schema (5 tables, Prisma)

`User`, `Job`, `Application`, `Profile`, `Notification` — full field-level design and the
Prisma schema itself are in **Phase 1**. Relationships: one `User` (employer) → many `Job`;
one `User` (candidate) → one `Profile`; `Application` is the join between a candidate `User`
and a `Job`, unique per (job, candidate); `Notification` belongs to one `User`.

## Use Case → Phase Map

| Use case | Phase |
|---|---|
| UC01 — Register/Login (candidate + employer) | Phase 3 |
| UC02 — Post a job (employer) | Phase 4 |
| UC03 — Search & filter jobs (candidate) | Phase 5 |
| UC04 — Apply to a job (candidate) | Phase 5 |
| UC05 — Manage applicants, update status (employer) | Phase 4 |
| UC06 — Approve/reject job postings (admin) | Phase 6 |
| UC07 — Notifications (candidate + employer) | Phase 7 |

## Apply-Flow Contract (must hold end-to-end from Phase 5 onward)

```
Candidate searches/filters → opens job detail → clicks "Ứng tuyển"
  → POST /applications creates Application(status=PENDING)
  → Notification row created for the job's employer
Employer opens "Quản lý ứng viên" → sees applicant → application auto-marks VIEWED
  → employer sets status to INTERVIEW or REJECTED
  → Notification row created for the candidate
Candidate sees the status change on their profile page / notification bell
```

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Project Scaffolding, Database & DevOps Baseline](./phase-01-scaffolding-database.md) | Pending |
| 2 | [UI/UX Design System & Screen Wireframes](./phase-02-uiux-design.md) | Pending |
| 3 | [Authentication, RBAC & App Shell](./phase-03-auth-rbac.md) | Pending |
| 4 | [Employer: Job Posting & Applicant Management](./phase-04-employer-jobs-applicants.md) | Pending |
| 5 | [Candidate: Search, Job Detail & Apply](./phase-05-candidate-search-apply.md) | Pending |
| 6 | [Admin: Moderation & Account Management](./phase-06-admin-moderation.md) | Pending |
| 7 | [Notifications](./phase-07-notifications.md) | Pending |
| 8 | [Responsive Polish, Testing & Demo Deployment](./phase-08-polish-tests-deploy.md) | Pending |

Phases are sequential by design (each depends on the previous one's data model or auth
layer being in place) — do not parallelize them.

## Non-Functional Requirements Tracking

| Requirement | Where it's enforced |
|---|---|
| Responsive, mobile-first | Phase 2 (design system) + Phase 8 (audit pass) |
| Home page loads < 3s in demo | Phase 8 (measured with Docker demo running locally) |
| Passwords hashed (bcrypt), never plaintext | Phase 3 (auth module) |
| No cross-role access without correct login | Phase 3 (guards) + Phase 8 (dedicated RBAC test suite) |

## Dependencies

- PostgreSQL 15+ (via Docker) — no external SaaS dependency required for the demo.
- Node.js 20 LTS for both apps.
- No third-party paid services (no real payment gateway, no SMS/email provider required —
  Phase 7 notifications are in-app only).

## Next Recommended Step

```bash
/ak:cook plans/260926-1323-part-time-job-marketplace/plan.md
```
