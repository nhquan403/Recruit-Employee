---
phase: 4
title: "Employer: Job Posting & Applicant Management"
status: pending
priority: P1
effort: "1.5d"
dependencies: [2, 3]
---

# Phase 4: Employer: Job Posting & Applicant Management (UC02 + UC05)

## Goal
Let an employer post a job (goes to `PENDING`, invisible to the public until admin approval
in Phase 6) and manage the list of candidates who apply to each of their jobs, moving each
applicant through pending → viewed → interview / rejected.

## Context Links
- Overview & apply-flow contract: `./plan.md`
- Schema (`Job`, `Application`): `./phase-01-scaffolding-database.md`
- Auth/RBAC primitives: `./phase-03-auth-rbac.md`
- Screens 3 & 4 wireframes: [`docs/design-guidelines.md`](../../docs/design-guidelines.md) §6.3, §6.4

## Key Insights
- Per the user's own step order, this phase ships before the candidate can actually apply
  (Phase 5). The applicant-management endpoints and UI are built and testable with seeded
  fixture data now; they become end-to-end reachable once Phase 5 adds the candidate-side
  `POST /applications`.
- An employer can only ever see/edit their own jobs and their own jobs' applicants —
  ownership checks are as important here as the role check.
- Opening the applicant list for a job auto-marks that job's `PENDING` applications as
  `VIEWED` (matches the wireframe's "Đã xem" default) — cheap and matches real triage
  behavior; no separate "mark as viewed" click needed.

## Requirements

### Functional
- `POST /jobs` (EMPLOYER) — body `{title, description, area, shift, salaryMin?, salaryMax?, salaryUnit?, requirements?}`;
  creates `Job` with `status: PENDING`, `employerId` = current user.
- `GET /jobs/mine` (EMPLOYER) — lists the caller's own jobs regardless of status, with an
  applicant count per job.
- `GET /jobs/:id` (EMPLOYER, owner only, in addition to the public rule added in Phase 5) —
  full detail including `status`/`rejectReason`.
- `PATCH /jobs/:id` (EMPLOYER, owner only) — edit fields; if the job was `REJECTED`, editing
  and resubmitting resets `status` to `PENDING` and clears `rejectReason`.
- `DELETE /jobs/:id` (EMPLOYER, owner only) — hard delete is acceptable for this scope (no
  soft-delete requirement in the brief); cascades to its `Application` rows.
- `GET /jobs/:id/applications` (EMPLOYER, owner of the job only) — list of `Application`
  joined with candidate `User`/`Profile` summary (name, phone, bio, skills, preferredAreas);
  as a side effect, flips any `PENDING` rows in the result to `VIEWED`.
- `PATCH /applications/:id/status` (EMPLOYER, owner of the parent job only) — body
  `{status: 'VIEWED'|'INTERVIEW'|'REJECTED'}`; creates a `Notification` for the candidate
  (wired fully in Phase 7, but the write happens here since this is where the state change
  occurs).
- Frontend: `/nha-tuyen-dung/dang-tin` (post-job form, per §6.3 wireframe), `/nha-tuyen-dung/tin-cua-toi`
  (list of own jobs with `StatusBadge`), `/nha-tuyen-dung/tin/:id/ung-vien` (applicant list
  per job, per §6.4 wireframe, two-pane at `lg:`).

### Non-Functional
- Ownership checks return 403 (not 404) when a non-owner employer hits another employer's
  job — deliberate choice so employers get a clear "not yours" signal during development;
  Phase 8's security test suite asserts this explicitly.
- Server-side validation mirrors the form: `title`/`description`/`area`/`shift` required,
  `salaryMin <= salaryMax` when both present.

## Architecture

```
backend/src/
├── jobs/
│   ├── jobs.module.ts
│   ├── jobs.controller.ts        # POST /jobs, GET /jobs/mine, GET /jobs/:id, PATCH, DELETE
│   ├── jobs.service.ts
│   ├── dto/create-job.dto.ts
│   ├── dto/update-job.dto.ts
│   └── guards/job-owner.guard.ts # loads job by :id param, compares employerId to req.user
└── applications/
    ├── applications.module.ts
    ├── applications.controller.ts # GET /jobs/:id/applications, PATCH /applications/:id/status
    ├── applications.service.ts
    └── dto/update-application-status.dto.ts

frontend/src/
├── app/nha-tuyen-dung/dang-tin/page.tsx
├── app/nha-tuyen-dung/tin-cua-toi/page.tsx
├── app/nha-tuyen-dung/tin/[id]/ung-vien/page.tsx
└── components/
    ├── job-card.tsx               # composite; per docs/design-guidelines.md §2
    └── application-row.tsx        # composite; per docs/design-guidelines.md §2
```

## Related Code Files
- Create: all files listed above under `backend/src/jobs/`, `backend/src/applications/`
- Create: the 3 frontend pages + `job-card.tsx`, `application-row.tsx`
- Modify: `backend/src/app.module.ts` (register `JobsModule`, `ApplicationsModule`)

## Implementation Steps
1. Backend: `JobsService.create()` — force `status: PENDING`, `employerId` from `req.user.id`
   (never trust a client-supplied `employerId`).
2. Backend: `JobOwnerGuard` — reusable guard that loads the `Job` by the `:id` route param
   and throws 403 if `job.employerId !== req.user.id` (used by `PATCH/DELETE /jobs/:id` and
   `GET /jobs/:id/applications`).
3. Backend: `JobsService.findMine()` — `include: { _count: { select: { applications: true } } }`
   for the applicant-count badge on the "Tin của tôi" list.
4. Backend: `ApplicationsService.findByJob()` — join candidate + profile, then
   `updateMany` any `PENDING` rows for that job to `VIEWED` before returning.
5. Backend: `ApplicationsService.updateStatus()` — validate the target status is one of
   `VIEWED|INTERVIEW|REJECTED` (candidates never set `PENDING` manually), persist, create a
   `Notification` row `{userId: application.candidateId, type: 'APPLICATION_STATUS_CHANGED', ...}`.
6. Frontend: build `JobCard` (title, area, shift, salary range, posted-time, `StatusBadge`)
   and reuse it on `/nha-tuyen-dung/tin-cua-toi`.
7. Frontend: build `/nha-tuyen-dung/dang-tin` form exactly per §6.3 wireframe (chips for
   khung giờ, paired salary min/max inputs, inline "sẽ được admin duyệt" notice), wrapped in
   `RequireRole(['EMPLOYER'])` from Phase 3.
8. Frontend: build `ApplicationRow` (candidate name, applied-time, `StatusBadge` as a status
   dropdown, "Xem hồ sơ" opening a `Modal`/drawer with profile detail) and the
   `/nha-tuyen-dung/tin/:id/ung-vien` page, two-pane layout at `lg:` per §6.4.

## Todo List
- [ ] `POST /jobs` creates a `PENDING` job owned by the caller
- [ ] `GET /jobs/mine` lists own jobs + applicant counts, any status
- [ ] `PATCH/DELETE /jobs/:id` enforce ownership via `JobOwnerGuard`
- [ ] `GET /jobs/:id/applications` returns applicants and flips `PENDING` → `VIEWED`
- [ ] `PATCH /applications/:id/status` updates status + writes a `Notification` row
- [ ] `/nha-tuyen-dung/dang-tin` posts successfully and redirects to "Tin của tôi"
- [ ] `/nha-tuyen-dung/tin-cua-toi` shows correct `StatusBadge` per job
- [ ] `/nha-tuyen-dung/tin/:id/ung-vien` lists applicants with working status dropdown

## Success Criteria
- Seed 2 employer accounts and cross-check: Employer A cannot see or edit Employer B's job
  (403), confirmed both via `curl` and by trying the UI URL directly.
- Manual: post a job as employer → confirm row exists with `status = PENDING` in the DB
  (or via `GET /jobs/mine`) → it is NOT present in the (not-yet-built, but stubbed) public
  `GET /jobs` filter for approved-only once Phase 5 exists.
- Unit tests: `JobsService.create` always forces `PENDING` regardless of client input;
  `ApplicationsService.updateStatus` rejects an invalid status string.

## Risk Assessment
- **Risk:** Without Phase 5's candidate-side apply endpoint yet, this phase's UI has nothing
  to display. **Mitigation:** verify with a Prisma seed/fixture script that inserts 2-3 fake
  `Application` rows directly, so the applicant-management screen is checkable in isolation
  before Phase 5 lands.
- **Risk:** Ownership guard forgotten on a new route added later. **Mitigation:** Phase 8's
  RBAC test sweep includes "employer B cannot touch employer A's resources" as a standing
  case.

## Security Considerations
- `employerId` and `candidateId` are always derived from the JWT, never from request body.
- `JobOwnerGuard` runs after `JwtAuthGuard`/`RolesGuard` in the guard chain.

## Next Steps
- Phase 5 adds the candidate-facing `POST /applications`, which is what actually populates
  the applicant list this phase renders.
