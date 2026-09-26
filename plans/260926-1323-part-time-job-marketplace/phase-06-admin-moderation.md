---
phase: 6
title: "Admin: Moderation & Account Management"
status: pending
priority: P1
effort: "1d"
dependencies: [2, 3, 4, 5]
---

# Phase 6: Admin: Moderation & Account Management (UC06)

## Goal
Give the seeded admin account a dashboard to approve/reject pending job postings and view
platform accounts and basic stats — the gate that keeps every job on the public board
legitimate.

## Context Links
- Overview: `./plan.md`
- Schema (`Job.status`, `Job.rejectReason`): `./phase-01-scaffolding-database.md`
- Screen 6 wireframe: [`docs/design-guidelines.md`](../../docs/design-guidelines.md) §6.6
- Public job visibility rule this phase feeds: `./phase-05-candidate-search-apply.md`

## Key Insights
- Approving a job is the only way it becomes visible via Phase 5's `GET /jobs` — this phase
  is the missing link that makes the whole demo flow end-to-end.
- Rejecting asks for an optional reason (`Job.rejectReason`), shown back to the employer on
  their own "Tin của tôi" list (Phase 4) — closes the loop instead of leaving employers
  guessing.
- User account management is intentionally read-mostly for this scope (list + role + date);
  the design doc flags an account-lock action as a stretch, not required — keep it out
  unless time remains after Phase 8's core checklist is done.

## Requirements

### Functional
- `GET /admin/jobs?status=PENDING` (ADMIN) — paginated list of jobs awaiting review, default
  filter `PENDING`, but accepts `APPROVED`/`REJECTED` too for the admin to audit history.
- `PATCH /admin/jobs/:id/approve` (ADMIN) — sets `status: APPROVED`, clears
  `rejectReason`, creates a `Notification` for the employer (`type: 'JOB_APPROVED'`).
- `PATCH /admin/jobs/:id/reject` (ADMIN) — body `{reason?: string}`, sets
  `status: REJECTED`, stores `rejectReason`, creates a `Notification` for the employer
  (`type: 'JOB_REJECTED'`).
- `GET /admin/users` (ADMIN) — paginated list of all users (id, email, fullName, role,
  isActive, createdAt) — no password data ever included.
- `GET /admin/stats` (ADMIN) — `{ totalJobs, totalUsers, pendingJobs, totalApplications }`
  via 4 `count()` queries (or one `Promise.all`).
- Frontend: `/quan-tri` (Admin dashboard, per §6.6) — stat cards row, "Tin chờ duyệt" table
  with inline Duyệt/Từ chối actions (reject opens a `Modal` for the optional reason),
  "Người dùng" table.

### Non-Functional
- Every `/admin/*` route requires `@Roles('ADMIN')` — verified explicitly in Phase 8's RBAC
  sweep (a candidate or employer token must get 403 on every one of these routes).
- Mobile: stat cards become a horizontally scrollable row and tables become stacked cards
  (per §6.6's mobile note) — desktop-first design is fine since admin usage skews desktop,
  but the page must not be unusable on a phone.

## Architecture

```
backend/src/admin/
├── admin.module.ts
├── admin-jobs.controller.ts    # GET /admin/jobs, PATCH .../approve, PATCH .../reject
├── admin-users.controller.ts   # GET /admin/users
├── admin-stats.controller.ts   # GET /admin/stats
└── admin.service.ts            # shared queries, reuses JobsService/UsersService where possible

frontend/src/
├── app/quan-tri/page.tsx
└── components/
    ├── stat-card.tsx
    └── (reuses Modal, Pagination, StatusBadge, Button from the shared UI kit)
```

## Related Code Files
- Create: all files under `backend/src/admin/`
- Create: `frontend/src/app/quan-tri/page.tsx`, `frontend/src/components/stat-card.tsx`
- Modify: `backend/src/app.module.ts` (register `AdminModule`)
- Modify: `frontend/src/components/navbar.tsx` (add "Quản trị" link, admin-only)

## Implementation Steps
1. Backend: `AdminService.approveJob(id)` / `rejectJob(id, reason)` — thin wrappers around
   `JobsService`'s Prisma calls (reuse, don't duplicate the update logic), plus the
   `Notification` write.
2. Backend: `AdminService.listUsers(pagination)` — `select` explicitly excludes
   `passwordHash` (never rely on a blanket serializer to strip it).
3. Backend: `AdminService.getStats()` — `Promise.all([prisma.job.count(), prisma.user.count(), prisma.job.count({where:{status:'PENDING'}}), prisma.application.count()])`.
4. Backend: apply `@UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')` at the controller
   level (not per-method) so no route under `/admin` can be added later without the guard.
5. Frontend: `Modal`-based "Từ chối" flow — text field for reason (optional), confirm button
   calls `PATCH /admin/jobs/:id/reject`.
6. Frontend: `/quan-tri` — stat cards row (reuses `stat-card.tsx`), pending-jobs table with
   `StatusBadge` + Duyệt/Từ chối buttons, users table below; mobile view swaps `<table>` for
   stacked cards per the design doc's mobile note.
7. Frontend: gate the whole page with `RequireRole(['ADMIN'])` from Phase 3.

## Todo List
- [ ] `GET /admin/jobs` lists jobs by status, paginated
- [ ] `PATCH /admin/jobs/:id/approve` flips status, clears reason, notifies employer
- [ ] `PATCH /admin/jobs/:id/reject` flips status, stores reason, notifies employer
- [ ] `GET /admin/users` never returns `passwordHash`
- [ ] `GET /admin/stats` returns the 4 counts correctly
- [ ] `/quan-tri` renders stats, pending-jobs table with working actions, users table
- [ ] Every `/admin/*` route 403s for non-admin tokens

## Success Criteria
- Approve a job in `/quan-tri` → within seconds it appears in Phase 5's Trang chủ list
  (confirms the Phase 5 ↔ Phase 6 contract holds).
- Reject a job with a reason → the reason is visible on the employer's "Tin của tôi" list
  (Phase 4) via the job's `rejectReason` field.
- `curl` any `/admin/*` route with a candidate or employer token → 403.
- `GET /admin/users` response body, inspected manually, never contains a `passwordHash` key.

## Risk Assessment
- **Risk:** Duplicating job-status-update logic between `JobsService` (Phase 4, owner edits)
  and `AdminService` (approve/reject) causes drift. **Mitigation:** `AdminService` calls into
  a shared `JobsService.setStatus(id, status, rejectReason?)` method rather than writing its
  own Prisma update.
- **Risk:** Forgetting the controller-level `@Roles('ADMIN')` guard on a newly added admin
  route. **Mitigation:** the guard is applied once at the controller class level for each of
  the 3 admin controllers, not per-method, so a new method inherits it automatically.

## Security Considerations
- Admin accounts are never self-registrable (enforced back in Phase 3's DTO `@IsEnum`
  restriction) — only the Phase 1 seed script creates one.
- `GET /admin/users` explicitly excludes password data at the Prisma `select` level, not
  just at the response-serialization level, so it can never leak even via a debug log.

## Next Steps
- Phase 7 wires the `Notification` rows already being written by Phases 4–6 into an actual
  in-app notification UI (bell icon + list) for both candidates and employers.
