---
phase: 7
title: "Notifications"
status: pending
priority: P2
effort: "1d"
dependencies: [3, 4, 5, 6]
---

# Phase 7: Notifications (UC07)

## Goal
Surface the `Notification` rows already being written by Phases 4–6 (new application, job
approved/rejected, application status changed) as an in-app bell + list for candidates and
employers, using simple polling — the MVP option the user's own spec explicitly allows
("hoặc email nếu đơn giản hơn khi thiếu thời gian").

## Context Links
- Overview & apply-flow contract: `./plan.md`
- Schema (`Notification`): `./phase-01-scaffolding-database.md`
- Notification-writing call sites: `./phase-04-employer-jobs-applicants.md` (status change),
  `./phase-05-candidate-search-apply.md` (new application), `./phase-06-admin-moderation.md`
  (job approved/rejected)
- `NotificationBell` spec: [`docs/design-guidelines.md`](../../docs/design-guidelines.md) §2

## Key Insights
- No new business logic is created here — every notification-triggering event already
  writes a `Notification` row from Phases 4–6. This phase is purely "read and display."
- Polling every 20–30s is enough for a demo/capstone context and avoids the complexity of a
  WebSocket gateway, connection lifecycle, and reconnection handling. Socket.IO is documented
  below as an optional stretch, not the default deliverable.
- Keep the unread count and the read/unread toggle server-authoritative (`isRead` on the
  row) — don't fake it in frontend state only, or it desyncs across tabs/devices.

## Requirements

### Functional
- `GET /notifications/mine?unreadOnly=false` (any authenticated role) — list of the
  caller's notifications, newest first, paginated.
- `GET /notifications/mine/unread-count` (any authenticated role) — `{count: number}`, used
  to badge the bell icon without pulling the full list every poll tick.
- `PATCH /notifications/:id/read` (owner only) — marks one notification read.
- `PATCH /notifications/read-all` (any authenticated role) — marks all of the caller's
  notifications read (used by a "Đánh dấu tất cả đã đọc" action in the dropdown).
- Frontend: `NotificationBell` in `Navbar` — badge count from the unread-count endpoint,
  polled every 20s (`setInterval`, cleared on unmount); clicking opens a dropdown/list of the
  last ~10 notifications with each item's `message` and relative time, linking to `link`
  (e.g. the relevant job or application) via Next.js router.

### Non-Functional
- Polling interval is a named constant (`NOTIFICATION_POLL_MS = 20000`) in one place, not
  scattered across components, so it's trivial to tune or later swap for a WebSocket push.
- No polling while the tab is hidden (`document.visibilityState !== 'visible'`) to avoid
  wasting requests when the tab is backgrounded.

## Architecture

```
backend/src/notifications/
├── notifications.module.ts
├── notifications.controller.ts  # GET /notifications/mine, GET .../unread-count,
│                                  # PATCH /notifications/:id/read, PATCH .../read-all
├── notifications.service.ts     # find/markRead/markAllRead — also exports create() for
│                                  # Phases 4-6 to call (import NotificationsService there)
└── dto/list-notifications.dto.ts

frontend/src/
├── components/notification-bell.tsx
└── lib/use-polling-notifications.ts   # hook: unread count + list, visibility-aware interval
```

## Related Code Files
- Create: all files under `backend/src/notifications/`
- Create: `frontend/src/components/notification-bell.tsx`,
  `frontend/src/lib/use-polling-notifications.ts`
- Modify: `backend/src/app.module.ts` (register `NotificationsModule`, export
  `NotificationsService` so Jobs/Applications/Admin modules can inject it)
- Modify: `backend/src/jobs/jobs.module.ts`, `backend/src/applications/applications.module.ts`,
  `backend/src/admin/admin.module.ts` (import `NotificationsModule` if not already wired
  ad-hoc in Phases 4–6 — reconcile here into one shared `NotificationsService.create()` call
  if those phases left inline Prisma writes)
- Modify: `frontend/src/components/navbar.tsx` (mount `NotificationBell`)

## Implementation Steps
1. Backend: `NotificationsService.create({userId, type, message, link})` — the single write
   path; if Phases 4–6 wrote `Notification` rows directly via Prisma, refactor those call
   sites to call this service instead (DRY — one place owns notification creation).
2. Backend: `findMine`, `countUnread`, `markRead(id, ownerId)` (403 if not the owner),
   `markAllRead(ownerId)`.
3. Frontend: `use-polling-notifications.ts` — fetches unread count on mount and every
   `NOTIFICATION_POLL_MS` while `document.visibilityState === 'visible'`; exposes
   `{unreadCount, notifications, refetch, markRead, markAllRead}`.
4. Frontend: `NotificationBell` — icon + badge (per §2's `NotificationBell` states: 0 unread
   / N unread), dropdown list on click, "Đánh dấu tất cả đã đọc" action, each item links to
   `notification.link` and calls `markRead` on click.
5. Mount `NotificationBell` in `Navbar` for all three roles (candidate/employer/admin all
   receive notifications per the schema, even though the brief's UC07 names candidate +
   employer specifically — admin gets none written today, so the bell will just show 0,
   which is correct and requires no special-casing).

## Todo List
- [ ] `NotificationsService.create()` is the single write path (Phases 4–6 refactored to use it)
- [ ] `GET /notifications/mine` and `/unread-count` work and are owner-scoped
- [ ] `PATCH /notifications/:id/read` and `/read-all` work and are owner-scoped
- [ ] `NotificationBell` polls only while tab is visible, shows correct badge count
- [ ] Clicking a notification navigates to its `link` and marks it read

## Success Criteria
- Full manual replay of the apply-flow contract from `plan.md`, this time watching the bell:
  candidate applies → employer's bell shows +1 unread within one poll interval → employer
  changes status → candidate's bell shows +1 unread within one poll interval.
- Marking one notification read does not affect the read state of others; "read-all" clears
  the whole badge.
- Network tab shows polling stops when the browser tab is backgrounded and resumes when it's
  focused again.

## Risk Assessment
- **Risk:** Polling from every open tab of every logged-in user could add up under load.
  **Mitigation:** acceptable for a capstone demo's traffic; documented as the reason a real
  production version would move to WebSocket/SSE push — noted as a stretch, not built now.
- **Risk:** Refactoring Phases 4–6's inline notification writes into the shared service could
  introduce a regression if done carelessly. **Mitigation:** re-run each phase's own
  "Success Criteria" apply-flow check after the refactor, not just this phase's.

## Security Considerations
- `markRead`/`markAllRead` and `findMine` are always scoped to `req.user.id` — one user can
  never read or mark another user's notifications.

## Next Steps
- Phase 8 does the final responsive/security/test pass across everything built in Phases 1–7
  and produces the deployable demo.
