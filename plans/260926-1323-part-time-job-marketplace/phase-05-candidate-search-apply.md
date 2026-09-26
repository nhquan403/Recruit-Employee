---
phase: 5
title: "Candidate: Search, Job Detail, Apply & Profile"
status: pending
priority: P1
effort: "2d"
dependencies: [2, 3, 4]
---

# Phase 5: Candidate: Search, Job Detail, Apply & Profile (UC03 + UC04)

## Goal
Let a candidate search/filter the public list of **approved** jobs, view a job's detail
page, apply, and manage their own profile (screen 5, "Trang hồ sơ cá nhân") — completing the
candidate side of the apply-flow contract in `plan.md` (employer side already exists from
Phase 4).

## Context Links
- Overview & apply-flow contract: `./plan.md`
- Schema (`Job`, `Application`, `Profile`): `./phase-01-scaffolding-database.md`
- Employer-side application endpoints: `./phase-04-employer-jobs-applicants.md`
- Screens 1, 2 & 5 wireframes: [`docs/design-guidelines.md`](../../docs/design-guidelines.md) §6.1, §6.2, §6.5

## Key Insights
- The public job list/detail must only ever expose `status: APPROVED` jobs to
  unauthenticated visitors and candidates — this is the "chống tin giả" (anti-fake-listing)
  guarantee and is tested explicitly in Phase 8.
- Per the design spec, every `JobCard` shows salary and shift up front — this is a query
  concern too: `GET /jobs` must return `salaryMin/salaryMax/shift` in the list payload, not
  just in the detail payload, or the frontend can't honor the "no click-through needed" rule.
- The apply button has 6 distinct states (see §6.2 of the design doc) — implement it as one
  component branching on auth state + role + existing-application lookup, not six separate
  buttons.

## Requirements

### Functional
- `GET /jobs` (public) — query params `q` (keyword, matches title/description), `area`,
  `shift`, `salaryMin`, `salaryMax`, `page`, `limit` (default 10); always filters
  `status: APPROVED`; sorted by `createdAt desc` (per Phase 2's "recency, not a manual
  featured flag" decision).
- `GET /jobs/:id` (public) — 404 if not found; if the job's `status !== APPROVED`, only the
  owning employer or an admin may view it (reuse Phase 4's `JobOwnerGuard` logic or an
  equivalent public-detail rule) — everyone else gets 404 (not 403, to avoid leaking
  existence of non-public jobs).
- `POST /applications` (CANDIDATE) — body `{jobId, message?}`; rejects (409) if the job is
  not `APPROVED`, rejects (409) on duplicate `(jobId, candidateId)`, creates
  `Application(status: PENDING)`, creates a `Notification` for the job's employer
  (`type: 'APPLICATION_CREATED'`).
- `GET /applications/mine` (CANDIDATE) — own applications joined with job summary; used here
  to compute the job-detail "already applied" state, and reused as-is by Phase 6's candidate
  profile page ("Việc đã ứng tuyển" list).
- Frontend: `/` (Trang chủ) — search bar + `FilterBar` + `JobCard` grid, per §6.1
  (mobile: filters in a bottom sheet; desktop `lg:`: sticky sidebar + 3-column grid).
- Frontend: `/viec-lam/:id` (Job detail) — full detail + the 6-state apply button, per §6.2.
- `GET /profiles/me` (CANDIDATE) — returns the caller's `Profile` (created empty at
  registration by Phase 3).
- `PATCH /profiles/me` (CANDIDATE) — body `{bio?, skills?: string[], preferredAreas?: string[], avatarUrl?}`.
- Frontend: `/ho-so` (Candidate profile, per §6.5) — view/edit basic info + skills/preferred-area
  `Tag` chips, plus the "Việc đã ứng tuyển" list (reuses `ApplicationRow` in read-only mode,
  backed by `GET /applications/mine`) with status filter tabs (Tất cả/Đang chờ/Phỏng vấn/Kết quả).

### Non-Functional
- `GET /jobs` responds fast enough to keep the home page under the 3s NFR — add the
  `@@index([status, area])` from Phase 1's schema to the query's `WHERE` plan (Prisma will
  use it automatically for `status`/`area` filters) and cap `limit` at 50 server-side to
  prevent an unbounded response.
- Duplicate-apply and closed-job attempts must fail loudly (409 + a clear message), never
  silently no-op.

## Architecture

```
backend/src/jobs/
├── jobs.controller.ts        # extend: GET /jobs (public, filtered+paginated), GET /jobs/:id (public rule)
└── jobs.service.ts           # extend: findPublic(filters), findOneForViewer(id, viewer)

backend/src/applications/
├── applications.controller.ts # extend: POST /applications, GET /applications/mine
└── applications.service.ts    # extend: create(), findMine()

backend/src/profiles/
├── profiles.module.ts
├── profiles.controller.ts     # GET /profiles/me, PATCH /profiles/me
├── profiles.service.ts
└── dto/update-profile.dto.ts

frontend/src/
├── app/page.tsx                # Trang chủ
├── app/viec-lam/[id]/page.tsx  # Job detail
├── app/ho-so/page.tsx          # Candidate profile
└── components/
    ├── filter-bar.tsx          # per docs/design-guidelines.md §2 + §6.1
    └── apply-button.tsx        # the 6-state button from §6.2's state matrix
```

## Related Code Files
- Modify: `backend/src/jobs/jobs.controller.ts`, `backend/src/jobs/jobs.service.ts`
- Modify: `backend/src/applications/applications.controller.ts`,
  `backend/src/applications/applications.service.ts`
- Create: all files under `backend/src/profiles/`
- Create: `frontend/src/app/page.tsx`, `frontend/src/app/viec-lam/[id]/page.tsx`,
  `frontend/src/app/ho-so/page.tsx`, `frontend/src/components/filter-bar.tsx`,
  `frontend/src/components/apply-button.tsx`
- Reuse: `frontend/src/components/job-card.tsx`, `frontend/src/components/application-row.tsx`
  (built in Phase 4)
- Modify: `backend/src/app.module.ts` (register `ProfilesModule`)

## Implementation Steps
1. Backend: `JobsService.findPublic(filters)` — Prisma `where: { status: 'APPROVED', ...(area && {area}), ...(shift && {shift}), ...(q && {OR: [{title: {contains: q, mode: 'insensitive'}}, {description: {contains: q, mode: 'insensitive'}}]}), salaryMin: {gte: filters.salaryMin}, salaryMax: {lte: filters.salaryMax} }`,
   `skip/take` for pagination, return `{items, total, page, limit}`.
2. Backend: `JobsService.findOneForViewer(id, user)` — fetch job; if `APPROVED` return it to
   anyone; else only return it if `user` exists and (`user.id === job.employerId` or
   `user.role === 'ADMIN'`), otherwise throw `NotFoundException`.
3. Backend: `ApplicationsService.create(candidateId, dto)` — fetch job, assert
   `status === 'APPROVED'` (409 otherwise), attempt create, catch Prisma's unique-constraint
   error on `(jobId, candidateId)` and rethrow as 409 with a clear message, then write the
   `Notification` for `job.employerId`.
4. Backend: `ApplicationsService.findMine(candidateId)` — join `job` for title/area/shift so
   the frontend doesn't need a second round trip.
5. Frontend: `FilterBar` — keyword input + khu vực dropdown + khung giờ chip multi-select +
   salary min/max inputs; on mobile renders inside a bottom sheet triggered by a "Bộ lọc"
   button (per §6.1); syncs to the URL query string so filtered results are shareable/
   bookmarkable and survive a refresh.
6. Frontend: `/` — server component fetches `GET /jobs` with the current query string,
   renders `JobCard` grid + `EmptyState` when `items.length === 0`.
7. Frontend: `apply-button.tsx` — implement exactly the 6-row state matrix from §6.2
   (not logged in / candidate-not-applied / candidate-applied / wrong role / admin /
   closed job); on submit, call `POST /applications`, show a success `Toast`
   ("Ứng tuyển thành công!") and flip the button to the "Đã ứng tuyển" state without a full
   page reload.
8. Frontend: `/viec-lam/:id` — fetch `GET /jobs/:id`; fetch `GET /applications/mine` (if
   logged in as candidate) to determine whether this job is already applied to, and pass
   that into `apply-button`.
9. Backend: `ProfilesService.findMe()`/`updateMe()` — simple `findUnique`/`update` scoped to
   `req.user.id`; reject the call with a clear error if somehow no `Profile` row exists
   (should never happen given Phase 3 creates one at registration).
10. Frontend: `/ho-so` — view mode renders bio/skills/preferredAreas as text and `Tag` chips;
    edit mode swaps in `Input`/`Textarea`/a simple tag-input reusing the `Tag` component;
    below that, the "Việc đã ứng tuyển" section lists `GET /applications/mine` via
    `ApplicationRow` (read-only — candidates see status, they don't change it) with status
    filter tabs, per §6.5.

## Todo List
- [ ] `GET /jobs` returns only `APPROVED` jobs, respects all 4 filters + pagination
- [ ] `GET /jobs/:id` 404s a non-approved job for anyone but its owner/admin
- [ ] `POST /applications` creates the row, 409s on non-approved job and on duplicate
- [ ] `GET /applications/mine` returns the candidate's own applications with job info
- [ ] `GET/PATCH /profiles/me` read and update the candidate's own profile
- [ ] Trang chủ: search + filters work and are reflected in the URL
- [ ] Job detail: apply button correctly renders all 6 documented states
- [ ] Successful apply shows a Toast and updates button state without reload
- [ ] `/ho-so` shows and edits profile info and lists applied jobs with correct statuses

## Success Criteria
- End-to-end manual run of the full apply-flow contract from `plan.md`: candidate searches
  → opens detail → applies → employer's `/nha-tuyen-dung/tin/:id/ung-vien` (Phase 4) shows
  the new applicant → employer changes status → candidate's `/applications/mine` reflects it
  (full notification UI lands in Phase 7, but the data flow must be correct now).
- Trying to apply twice to the same job returns 409 both from `curl` and via the UI (button
  already shows "Đã ứng tuyển", so the UI path is really "button is disabled," but the API
  guard must hold regardless).
- A direct `GET /jobs/:id` for a `PENDING` job's id, as an anonymous request, returns 404.

## Risk Assessment
- **Risk:** Keyword search via `contains` is a full scan without a text index; fine at
  student-project data volumes, but call this out as a known limitation. **Mitigation:**
  document as an accepted simplification; revisit with Postgres full-text search only if
  performance testing in Phase 8 shows it's actually slow.
- **Risk:** Filter state and `apply-button` auth state can drift out of sync after login
  happens on another tab. **Mitigation:** re-fetch `applications/mine` on window focus (a
  simple `visibilitychange` listener is enough — no need for a full data-sync library).

## Security Considerations
- `candidateId` on `POST /applications` always comes from the JWT, never the request body.
- Non-approved job detail returns 404, not 403, to avoid confirming a pending job's
  existence to an unauthorized viewer.

## Next Steps
- Phase 6 builds the admin approval screen that flips a job from `PENDING` to `APPROVED`,
  which is what makes it appear in this phase's `GET /jobs` results.
