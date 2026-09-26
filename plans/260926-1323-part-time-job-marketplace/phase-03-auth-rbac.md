---
phase: 3
title: "Authentication, RBAC & App Shell"
status: pending
priority: P1
effort: "1.5d"
dependencies: [1, 2]
---

# Phase 3: Authentication, RBAC & App Shell

## Goal
Implement UC01 (register/login for candidate + employer) end-to-end with JWT + bcrypt on
the backend, role-based guards protecting every route family added in later phases, and a
frontend app shell (navbar, auth pages, auth context, protected-route wrapper) styled with
the Phase 2 design tokens.

## Context Links
- Overview: `./plan.md`
- Schema: `./phase-01-scaffolding-database.md` (`User`, `Profile`)
- Design tokens & Navbar spec: `./phase-02-uiux-design.md`

## Key Insights
- Registration creates a `User` with role `CANDIDATE` or `EMPLOYER` only — `ADMIN` accounts
  are never self-service (only the Phase 1 seed creates one).
- A `Profile` row is created automatically alongside every `CANDIDATE` registration (empty
  skills/preferredAreas) so Phase 5's profile page never has to null-check a missing row.
- RBAC must be enforced on the backend (guards), not just hidden in the frontend — the
  non-functional requirement is tested explicitly in Phase 8.

## Requirements

### Functional
- `POST /auth/register` — body `{email, password, role: 'CANDIDATE'|'EMPLOYER', fullName, phone?}`;
  hashes password with bcrypt (cost 10+), rejects duplicate email (409), creates `Profile`
  when role is `CANDIDATE`.
- `POST /auth/login` — body `{email, password}`; returns `{ accessToken, user: {id, email, role, fullName} }`
  or 401 on bad credentials.
- `GET /auth/me` — requires JWT, returns the current user.
- `JwtAuthGuard` (validates bearer token) and `RolesGuard` + `@Roles('EMPLOYER')`-style
  decorator, composable on any controller/route from Phase 4 onward.
- Frontend: `/dang-ky` (register, with a role toggle: "Tôi là ứng viên" / "Tôi là nhà tuyển dụng"),
  `/dang-nhap` (login), an `AuthProvider` (React context) storing `{user, accessToken}` and
  exposing `login`, `register`, `logout`, persisted to `localStorage` for refresh survival.
- Route protection: a `useRequireRole(['EMPLOYER'])`-style hook/HOC redirects to `/dang-nhap`
  if not authenticated, or to `/` with a toast if authenticated but wrong role.
- Global `Navbar` (per Phase 2 spec) shows role-appropriate links: Candidate sees
  "Tìm việc" / "Hồ sơ của tôi"; Employer sees "Đăng tin" / "Quản lý ứng viên"; Admin sees
  "Quản trị"; all see a login/logout control.

### Non-Functional
- Passwords never logged or returned in any API response.
- JWT expiry via `JWT_EXPIRES_IN` (default `7d` — short-lived-enough for a demo project,
  documented as a known simplification vs. refresh tokens).
- 401 for missing/invalid token, 403 for valid token but wrong role — never a silent 200.

## Architecture

```
backend/src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts        # register, login, me
│   ├── auth.service.ts           # hashing, token signing, validateUser
│   ├── dto/register.dto.ts
│   ├── dto/login.dto.ts
│   ├── strategies/jwt.strategy.ts
│   ├── guards/jwt-auth.guard.ts
│   ├── guards/roles.guard.ts
│   └── decorators/roles.decorator.ts
└── users/
    ├── users.module.ts
    └── users.service.ts           # findByEmail, createUser (used by auth + admin later)

frontend/src/
├── app/dang-ky/page.tsx
├── app/dang-nhap/page.tsx
├── lib/auth-context.tsx           # AuthProvider, useAuth()
├── lib/api-client.ts              # fetch wrapper injecting Authorization header
├── components/navbar.tsx
└── components/require-role.tsx    # client-side guard wrapper
```

## Related Code Files
- Create: all files listed above under `backend/src/auth/`, `backend/src/users/`
- Create: `frontend/src/app/dang-ky/page.tsx`, `frontend/src/app/dang-nhap/page.tsx`,
  `frontend/src/lib/auth-context.tsx`, `frontend/src/lib/api-client.ts`,
  `frontend/src/components/navbar.tsx`, `frontend/src/components/require-role.tsx`
- Modify: `backend/src/app.module.ts` (register `AuthModule`, `UsersModule`), global
  `ValidationPipe` in `main.ts`
- Modify: `frontend/src/app/layout.tsx` (wrap with `AuthProvider`, render `Navbar`)

## Implementation Steps
1. Backend: `UsersService.createUser()` — hash password, create `User`, and when
   `role === 'CANDIDATE'` create the paired empty `Profile` in the same Prisma transaction.
2. Backend: `AuthService.register()` calls `UsersService.createUser`, then issues a token
   via `AuthService.login()` so registration immediately logs the user in.
3. Backend: `AuthService.login()` — `bcrypt.compare`, sign JWT with `{sub: user.id, role}`.
4. Backend: `JwtStrategy` (passport-jwt) validates the token and attaches `req.user`.
5. Backend: `RolesGuard` reads `@Roles(...)` metadata and compares to `req.user.role`;
   throws `ForbiddenException` on mismatch.
6. Backend: apply `@UseGuards(JwtAuthGuard, RolesGuard)` as the pattern every later
   protected controller follows.
7. Frontend: `api-client.ts` — thin `fetch` wrapper reading the token from `AuthProvider`
   and attaching `Authorization: Bearer <token>`; centralizes error handling for 401/403.
8. Frontend: `AuthProvider` — on mount, rehydrate from `localStorage`; exposes
   `register(payload)`, `login(payload)`, `logout()`.
9. Frontend: build `/dang-ky` and `/dang-nhap` forms (Tailwind, per Phase 2 tokens) with
   client-side validation (required fields, email format, password length) mirroring
   backend DTO rules so users get instant feedback.
10. Frontend: `Navbar` renders conditionally on `useAuth().user?.role`.
11. Frontend: `RequireRole` component/hook wraps employer/candidate/admin pages added in
    later phases; unauthenticated → redirect `/dang-nhap`; wrong role → redirect `/`.

## Todo List
- [ ] `POST /auth/register` creates user (+ profile for candidates), returns token
- [ ] `POST /auth/login` returns token + user or 401
- [ ] `GET /auth/me` returns current user from token
- [ ] `JwtAuthGuard` + `RolesGuard` + `@Roles()` decorator implemented and reusable
- [ ] `/dang-ky`, `/dang-nhap` pages functional against the real API
- [ ] `AuthProvider` persists session across refresh
- [ ] `Navbar` shows role-correct links
- [ ] `RequireRole` blocks the two other roles from a role-specific page

## Success Criteria
- Manual: register as candidate, log out, log in, refresh page → still logged in, correct
  navbar links shown.
- `curl -X POST /auth/register` with a duplicate email returns 409.
- Hitting any later-phase employer-only endpoint with a candidate token returns 403 (this
  becomes a concrete assertion once Phase 4 endpoints exist; stub it here against
  `GET /auth/me` at minimum: no token → 401).
- Unit tests: `AuthService.login` rejects wrong password; `RolesGuard` denies mismatched role.

## Risk Assessment
- **Risk:** Storing JWT in `localStorage` is vulnerable to XSS token theft. **Mitigation:**
  documented as an accepted simplification for a course project (no third-party scripts are
  loaded, and this matches the "no e-contracts/no real payments" reduced threat model — see
  Phase 8 for the explicit non-issue note).
- **Risk:** Forgetting to guard a new controller in a later phase re-opens an RBAC hole.
  **Mitigation:** Phase 8 includes a dedicated cross-role access test sweep over every
  route.

## Security Considerations
- bcrypt cost factor ≥ 10.
- JWT secret from env, never hard-coded.
- DTOs use `class-validator` (`@IsEmail`, `@MinLength(8)`, `@IsEnum(Role, {...} )` limited to
  `CANDIDATE`/`EMPLOYER` only — `ADMIN` is rejected if sent in the register payload).

## Next Steps
- Phase 4 and Phase 5 both build directly on `JwtAuthGuard`/`RolesGuard` and the
  `AuthProvider`/`RequireRole` frontend primitives from this phase.
