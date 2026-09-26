---
phase: 2
title: "UI/UX Design System & Screen Wireframes"
status: pending
priority: P1
effort: "0.5d"
dependencies: [1]
---

# Phase 2: UI/UX Design System & Screen Wireframes

## Goal
Turn the full UI/UX specification (produced with the `ui-ux-designer` skill, informed by
TopCV.vn, Vieclam24h.vn, and gig-shift apps Instawork/Wonolo) into a Tailwind config and a
small set of shared components so every later frontend phase builds against one consistent,
mobile-first design language instead of improvising styles per screen.

## Context Links
- Full design spec (authoritative): [`docs/design-guidelines.md`](../../docs/design-guidelines.md)
  — design tokens, 15-item component list, mobile nav decision, breakpoints, accessibility
  rules, and ASCII wireframes for all 6 required screens.
- Overview: `./plan.md`

## Key Insights (from the design spec)
- **Color**: Professional Blue `#0369A1` primary + Success Green `#16A34A` accent, chosen
  for the "trustworthy job platform" brief; a 5-state `StatusBadge` palette
  (pending/viewed/interview/approved/rejected) is shared by both the job-moderation flow
  (Phase 4/6) and the application-tracking flow (Phase 4/5).
- **Typography**: `Be Vietnam Pro` (headings) — full Vietnamese diacritic coverage; simplest
  build option is to use it as the single font stack everywhere.
- **Navigation**: bottom tab bar (Trang chủ / Tìm việc / Đơn ứng tuyển / Hồ sơ) for
  candidates on mobile; hamburger/drawer for employer and admin's denser, table-heavy
  screens; both collapse into one horizontal `Navbar` at `md:` and above.
- **Job cards always show salary + shift hours up front** — no click-through needed to learn
  the two things a candidate cares about most. This one rule shapes `JobCard` everywhere it
  appears (Phase 5 home page, Phase 4/6 admin/employer lists).
- Component list is deliberately capped at 15 primitives, each reused on ≥2 screens — no
  screen gets a one-off component.

## Requirements

### Functional
- `frontend/tailwind.config.ts` encodes the color tokens, font family, and border-radius
  tokens from `docs/design-guidelines.md` §1.
- Google Fonts (`Be Vietnam Pro`, `Noto Sans`) loaded once in the root layout.
- A `frontend/src/components/ui/` folder with the foundational primitives needed before any
  screen work starts: `Button`, `Input`, `Select`, `Textarea`, `Tag`, `Avatar`, `StatusBadge`,
  `EmptyState`, `Toast` (a simple toast provider/hook is enough — no need for a full library).
  The remaining components (`JobCard`, `FilterBar`, `ApplicationRow`, `Navbar`,
  `BottomTabBar`, `NotificationBell`, `Modal`, `Pagination`) are built in the phase that
  first needs them (Phase 3 builds `Navbar`/`BottomTabBar`; Phase 4/5 build `JobCard`,
  `FilterBar`, `ApplicationRow`; Phase 6 builds `Modal`, `Pagination`; Phase 7 builds
  `NotificationBell`) but MUST follow the token/props contract fixed here.
- A `/design-preview` route (dev-only, can be deleted before final submission) renders every
  primitive component with its documented states, so later phases can visually confirm
  against the spec without re-reading the whole markdown file each time.

### Non-Functional
- Every color pair used for text-on-background meets the contrast ratios documented in
  `docs/design-guidelines.md` §5 (already verified in that spec — just don't override the
  hex values when wiring Tailwind).
- Minimum 44×44px tap targets on all interactive primitives (`Button`, tab bar icons).
- `prefers-reduced-motion: reduce` disables the `animate-pulse` skeleton and hover-shadow
  transitions (Tailwind: wrap with `motion-safe:`/`motion-reduce:` variants).

## Architecture

```
frontend/
├── tailwind.config.ts            # colors, fontFamily, borderRadius from design-guidelines.md §1
├── src/
│   ├── app/layout.tsx             # Google Fonts <link>/next/font, global CSS import
│   ├── app/globals.css            # CSS custom properties mirroring the token table (optional,
│   │                               # only if a component needs a raw var() outside Tailwind)
│   ├── app/design-preview/page.tsx  # dev-only kitchen-sink page (Todo: remove before submission)
│   └── components/ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── textarea.tsx
│       ├── tag.tsx
│       ├── avatar.tsx
│       ├── status-badge.tsx       # props: status: 'pending'|'viewed'|'interview'|'approved'|'rejected'
│       ├── empty-state.tsx
│       └── toast.tsx              # ToastProvider + useToast()
```

## Related Code Files
- Create: `frontend/tailwind.config.ts` (or extend the one scaffolded in Phase 1)
- Create: every file under `frontend/src/components/ui/` listed above
- Create: `frontend/src/app/design-preview/page.tsx`
- Modify: `frontend/src/app/layout.tsx` (font loading), `frontend/src/app/globals.css`

## Implementation Steps
1. Read `docs/design-guidelines.md` §1 (tokens) and encode `colors`, `fontFamily`,
   `borderRadius` into `tailwind.config.ts` exactly as specified (do not invent new values).
2. Load `Be Vietnam Pro` + `Noto Sans` via `next/font/google` in `app/layout.tsx`; apply as
   the default `font-sans`.
3. Build the 9 foundational primitives listed under Functional Requirements. Each takes
   `className` passthrough and the states documented in `docs/design-guidelines.md` §2
   (default/hover/active/disabled/loading for `Button`; default/focus/error/disabled for
   form fields; the 5 semantic variants for `StatusBadge`).
4. Build `ToastProvider` (React context + a fixed-position stack) and `useToast()` hook —
   used first for "Ứng tuyển thành công!" in Phase 5 and "Tin đăng đã được gửi" in Phase 4.
5. Build `/design-preview` rendering every primitive in every documented state, so a quick
   visual check replaces re-reading the spec during Phases 3–8.
6. Spot-check the three breakpoints called out in the spec (360px, 768px, 1280px) using
   browser devtools against `/design-preview`.

## Todo List
- [ ] `tailwind.config.ts` matches `docs/design-guidelines.md` §1 token-for-token
- [ ] Fonts load and apply as the default sans stack
- [ ] `Button`, `Input`, `Select`, `Textarea`, `Tag`, `Avatar`, `StatusBadge`, `EmptyState`,
      `Toast` implemented with documented states
- [ ] `/design-preview` renders all of the above
- [ ] Reduced-motion variants applied where animation exists

## Success Criteria
- `/design-preview` loads and visually matches the token table (colors, radii, type scale)
  in `docs/design-guidelines.md`.
- `StatusBadge` renders all 5 states with correct copy (Chờ duyệt/Đang chờ, Đã xem, Mời
  phỏng vấn, Đã duyệt, Từ chối) and passes a manual contrast check (browser devtools or
  a contrast checker) on at least the `pending` and `rejected` pairs.
- No screen built in Phases 3–8 introduces a color, font, or radius value outside this
  token set (spot-checked during Phase 8's polish pass).

## Risk Assessment
- **Risk:** Design spec is large (6 screens); building every component up front would delay
  Phase 3. **Mitigation:** this phase only builds the 9 components needed immediately
  (buttons/inputs/badges/toast); screen-specific composite components (`JobCard`,
  `FilterBar`, etc.) are built lazily in the phase that first needs them, still against the
  fixed token/props contract from `docs/design-guidelines.md`.
- **Risk:** `/design-preview` accidentally ships in the graded demo. **Mitigation:** tracked
  explicitly as a Todo in Phase 8's polish pass to delete or gate behind
  `NODE_ENV !== 'production'`.

## Security Considerations
- None specific to this phase (no data handling yet).

## Next Steps
- Phase 3 consumes `Button`/`Input`/`Textarea` immediately for the register/login forms and
  builds `Navbar`/`BottomTabBar` against the nav pattern decided in
  `docs/design-guidelines.md` §3.
