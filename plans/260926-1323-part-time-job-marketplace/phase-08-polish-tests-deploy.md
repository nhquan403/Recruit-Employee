---
phase: 8
title: "Responsive Polish, Testing & Demo Deployment"
status: pending
priority: P1
effort: "1.5d"
dependencies: [1, 2, 3, 4, 5, 6, 7]
---

# Phase 8: Responsive Polish, Testing & Demo Deployment

## Goal
Close out the non-functional requirements (responsive audit, <3s home-page load, RBAC
correctness) with real test coverage (unit + integration), then package the app for a
one-command local demo via Docker, matching the exact test plan the user specified.

## Context Links
- Overview & NFR tracking table: `./plan.md`
- All prior phases (this is the integration/verification pass across everything)

## Key Insights
- This is the phase that turns "it works on my screen" into "it's provably correct" — the
  brief calls out unit tests, integration tests, a UAT step, and a dedicated cross-role
  security test explicitly; none of that is optional polish.
- The RBAC test sweep is the single highest-value test in the whole plan given the brief's
  explicit non-functional requirement: "Không được truy cập chức năng của vai trò khác khi
  chưa đăng nhập đúng quyền (test kỹ phần này)."

## Requirements

### Functional test coverage (Jest)
- **Unit tests** (backend, `*.spec.ts` colocated per Nest convention):
  - `AuthService`: register hashes password, rejects duplicate email; login rejects wrong
    password; JWT payload shape.
  - `JobsService`: `create()` always forces `PENDING` regardless of client-supplied status;
    `findPublic()` never returns non-`APPROVED` jobs; salary filter boundaries.
  - `ApplicationsService`: rejects apply to non-approved job; rejects duplicate application;
    `updateStatus()` rejects an invalid status string.
  - `RolesGuard`: allows matching role, denies mismatched role.
- **Integration tests** (Nest's e2e harness, `test/*.e2e-spec.ts`, against a test database
  or an in-memory/test schema via a disposable Prisma test DB):
  - `POST /auth/register` → `POST /auth/login` → `GET /auth/me` full round trip.
  - `POST /jobs` (employer) → job is `PENDING` and absent from `GET /jobs` public list.
  - `PATCH /admin/jobs/:id/approve` → job now appears in `GET /jobs` public list.
  - `POST /applications` (candidate) → appears in `GET /jobs/:id/applications` (employer).
  - `PATCH /applications/:id/status` (employer) → reflected in candidate's
    `GET /applications/mine`.
- **Cross-role security sweep** (dedicated `test/rbac.e2e-spec.ts` — this is the "test kỹ
  phần này" requirement made concrete): for every protected route added in Phases 3–7, assert
  (a) no token → 401, (b) wrong-role token → 403, (c) right role but not the resource owner
  (jobs, applications, notifications) → 403/404 per that route's documented rule. Build this
  as a small table-driven test (`[{method, path, allowedRole}, ...]`) rather than one-off
  copies, so adding a new protected route later means adding one table row.
- **Frontend**: minimally, Testing Library smoke tests for `apply-button`'s 6 states and the
  register/login forms' validation messages — matches the brief's emphasis on backend logic
  testing without skipping the frontend's one genuinely stateful component.

### UAT
- Prepare a short written UAT script (`docs/uat-script.md`) with 2 personas (candidate,
  employer) and ~8 concrete steps each (register → search → apply → check status; register
  → post job → wait for approval → view applicants → change status), for a few real people
  to run through the Docker demo and report issues.

### Responsive & performance
- Manually verify all 6 screens at 360px, 768px, and 1280px against the wireframes in
  `docs/design-guidelines.md` §6.
- Measure home page load time against the Docker demo stack (not `next dev`) using browser
  devtools' Network/Performance tab; confirm < 3s repeatedly, and if not, check the obvious
  culprits first (missing `@@index`, unbounded `GET /jobs` payload, unoptimized images).
- Remove or gate the Phase 2 `/design-preview` route before this phase's success criteria
  are considered met.

### Demo deployment (Docker Compose)
- Extend Phase 1's `docker-compose.yml` with `backend` and `frontend` services (each with a
  `Dockerfile`, multi-stage build: install → build → slim runtime image), wired to the
  existing `db` service via a shared network and `.env`.
- `docker compose up --build` from a clean checkout must bring up all three services and
  serve the working app on the frontend's published port.
- Document optional public-URL deployment (Vercel for `frontend/`, Render/Railway free tier
  for `backend/` + managed Postgres) in `README.md` as a stretch, not a requirement — the
  graded/demo target is the local Docker Compose stack.

## Architecture

```
Recruit-Employee/
├── docker-compose.yml         # extended: db + backend + frontend services
├── backend/Dockerfile
├── backend/test/
│   ├── auth.e2e-spec.ts
│   ├── jobs.e2e-spec.ts
│   ├── applications.e2e-spec.ts
│   └── rbac.e2e-spec.ts       # table-driven cross-role sweep
├── frontend/Dockerfile
├── frontend/src/**/*.test.tsx # Testing Library smoke tests
└── docs/uat-script.md
```

## Related Code Files
- Create: `backend/Dockerfile`, `frontend/Dockerfile`, `backend/test/*.e2e-spec.ts`,
  frontend `*.test.tsx` files, `docs/uat-script.md`
- Modify: `docker-compose.yml` (add `backend`, `frontend` services)
- Modify: `README.md` (Docker demo instructions, optional public-deploy notes)
- Modify: any file flagged by the responsive audit or the RBAC sweep's failures

## Implementation Steps
1. Write the unit test list above first — they're fast and catch the most obvious logic
   bugs before the slower integration suite.
2. Stand up a disposable test database (either a second `docker-compose` Postgres service on
   a different port, or Prisma's recommended pattern of resetting a schema between test
   runs) and wire `backend/test/jest-e2e.json`'s setup to point at it.
3. Write the integration specs, one per apply-flow milestone listed above.
4. Write `rbac.e2e-spec.ts` as a table of `{method, path, expectedRoleOrNull, setupFixture}`
   entries covering every route from Phases 3–7; iterate the table in a single `it.each(...)`.
5. Write the frontend smoke tests for `apply-button` and the auth forms.
6. Run the full 360/768/1280 manual responsive pass against `docs/design-guidelines.md` §6;
   fix any drift found (log each fix as a one-line note in this phase's Todo list, don't
   create a separate tracking doc for it).
7. Write `backend/Dockerfile` and `frontend/Dockerfile` (multi-stage: `deps` → `build` →
   `runner`), extend `docker-compose.yml`, and verify a clean `docker compose up --build`.
8. Measure and record home-page load time against the Compose stack; fix if over 3s.
9. Write `docs/uat-script.md` and (outside the scope of code changes) ask a few real people
   to run it against the Docker demo; log any reported issues as quick fixes if time allows.
10. Final cleanup pass: remove `/design-preview`, remove any leftover console.log/debug code,
    confirm `.env` is not committed, confirm README setup steps work from a truly clean
    checkout.

## Todo List
- [ ] Backend unit tests for Auth/Jobs/Applications/RolesGuard pass
- [ ] Integration tests for the 5 milestone flows pass
- [ ] `rbac.e2e-spec.ts` table-driven sweep covers every protected route and passes
- [ ] Frontend smoke tests for apply-button states and auth form validation pass
- [ ] `docs/uat-script.md` written; at least one real person has run it against the demo
- [ ] All 6 screens verified at 360px/768px/1280px against the design doc
- [ ] Home page loads < 3s against the Docker Compose stack
- [ ] `docker compose up --build` works from a clean checkout
- [ ] `/design-preview` removed or gated out of production
- [ ] README documents the full local + optional public-deploy setup

## Success Criteria
- `npm run test --workspace=backend` and `npm run test:e2e --workspace=backend` both pass.
- `npm run test --workspace=frontend` passes.
- `docker compose up --build` from `git clone` → `docker compose up --build` (no other setup
  steps) results in a fully working app.
- Every row in the RBAC test table passes with the exact status code its route's phase file
  documented (401 unauthenticated, 403 wrong role/non-owner).
- Recorded home-page load time is under 3 seconds on the Docker demo, noted in `README.md`
  or `docs/uat-script.md`.

## Risk Assessment
- **Risk:** Integration tests against a real Postgres are slower and flakier in CI-less
  local runs than mocked tests. **Mitigation:** acceptable trade-off for this project's
  size — the brief explicitly asks for real integration tests, not mocks, for the main API
  flows.
- **Risk:** Docker build time/image size balloons if `node_modules` isn't excluded properly.
  **Mitigation:** `.dockerignore` at repo root excluding `node_modules`, `.git`, `.next`.

## Security Considerations
- This phase is where the security requirement gets proven, not just implemented: the
  RBAC sweep is the acceptance test for "Không được truy cập chức năng của vai trò khác khi
  chưa đăng nhập đúng quyền."
- Confirm no seeded/demo password or `JWT_SECRET` value ends up in a committed file other
  than `.env.example` (with an obviously-fake placeholder).

## Next Steps
- None — this is the final phase. Once its Success Criteria are met, the plan is complete
  and the app is demo-ready.
