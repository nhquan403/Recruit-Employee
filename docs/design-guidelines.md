# UI/UX Design Specification — Job Matching Platform (Part-time/Shift/Seasonal)

**Product**: Website connecting ứng viên (part-time/shift/seasonal job seekers) with nhà tuyển dụng (small-business employers: shops, restaurants, small businesses) in Vietnam, with admin moderation of postings before publication.

**Stack context**: Next.js + TailwindCSS (TypeScript) frontend, NestJS + PostgreSQL + Prisma backend. Mobile-first — most ứng viên will use phones.

**Design philosophy**: KISS. This is a student capstone, not a commercial product — no dark patterns, no heavy motion, no decorative complexity. Every screen should be understandable at a glance, usable one-handed on a phone, and buildable with plain Tailwind utility classes + shadcn/ui-style primitives.

**Reference patterns used** (documented for traceability, not literal copying):
- **TopCV.vn** — job card density (title, company, salary, location visible without opening detail), sidebar filter panel on desktop.
- **Vieclam24h.vn** — prominent salary range and "cập nhật gần đây" recency signals on cards; simple category/khu vực chips.
- **Instawork / Wonolo** (gig-shift apps) — pay and shift hours shown upfront on every card (no need to click through to learn "would I want this shift"), one-tap "Ứng tuyển" apply flow, clear application status tracker (applied → viewed → confirmed/rejected) instead of a black box after applying.

---

## 1. Design Tokens

### 1.1 Color System

Base palette selected from the "Job Board/Recruitment" design-intelligence profile (Professional Blue + Success Green + Neutral), which matches the "trustworthy job platform" brief and has verified WCAG AA/AAA contrast pairs.

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#0369A1` (sky-700) | Primary buttons, links, active nav, focus ring |
| `--color-primary-hover` | `#075985` (sky-800) | Primary button hover/active |
| `--color-secondary` | `#0EA5E9` (sky-500) | Secondary accents, info badges, highlights on hover |
| `--color-accent` | `#16A34A` (green-600) | "Ứng tuyển" CTA success confirmation, approved states |
| `--color-bg` | `#F8FAFC` (slate-50) | Page background |
| `--color-surface` | `#FFFFFF` | Cards, modals, form panels |
| `--color-foreground` | `#0F172A` (slate-900) | Primary text |
| `--color-muted` | `#64748B` (slate-500) | Secondary text, placeholders, metadata (posted date, area) |
| `--color-border` | `#E2E8F0` (slate-200) | Card borders, dividers, input borders |
| `--color-destructive` | `#DC2626` (red-600) | Errors, "Từ chối" (reject) actions |

**Semantic status colors** (application & job-posting lifecycle — used only for `StatusBadge`):

| Status | Background | Text | Notes |
|---|---|---|---|
| `pending` (Chờ duyệt / Đang chờ) | `#FEF3C7` (amber-100) | `#92400E` (amber-800) | Job awaiting admin approval, or application not yet viewed |
| `viewed` (Đã xem) | `#E0F2FE` (sky-100) | `#075985` (sky-800) | Employer opened the candidate's application |
| `interview` (Mời phỏng vấn) | `#EDE9FE` (violet-100) | `#5B21B6` (violet-800) | Candidate invited to interview |
| `approved` (Đã duyệt) | `#DCFCE7` (green-100) | `#166534` (green-800) | Job posting live, or candidate accepted |
| `rejected` (Từ chối / Không phù hợp) | `#FEE2E2` (red-100) | `#991B1B` (red-800) | Application or job posting rejected |

All status pairs meet ≥4.5:1 text contrast on their background.

### 1.2 Typography

Pairing: **"Vietnamese Friendly"** — verified full Vietnamese diacritic coverage.

- **Heading font**: `Be Vietnam Pro` (weights 500/600/700)
- **Body font**: `Noto Sans` (weights 400/500/600)
- Tailwind config: `fontFamily: { sans: ['Be Vietnam Pro', 'Noto Sans', 'sans-serif'] }` (single stack is fine for a student project — use Be Vietnam Pro everywhere and skip the dual-family complexity unless time allows).
- Google Fonts import: `Be+Vietnam+Pro:wght@400;500;600;700` + `Noto+Sans:wght@400;500;600`

**Type scale** (Tailwind default scale, mobile-first — base size grows slightly at `md:`):

| Role | Mobile | Desktop (`md:`) | Weight |
|---|---|---|---|
| H1 (page title) | `text-2xl` (24px) | `text-3xl` (30px) | 700 |
| H2 (section title) | `text-lg` (18px) | `text-xl` (20px) | 600 |
| H3 (card title / job title) | `text-base` (16px) | `text-lg` (18px) | 600 |
| Body | `text-sm` (14px) | `text-base` (16px) | 400 |
| Caption / metadata | `text-xs` (12px) | `text-sm` (14px) | 400 |
| Line height | `leading-relaxed` (1.6) for body, `leading-snug` (1.3) for headings | | |

### 1.3 Spacing Scale

Standard Tailwind 4px base unit — no custom scale needed (KISS):

`1 (4px) · 2 (8px) · 3 (12px) · 4 (16px) · 6 (24px) · 8 (32px) · 12 (48px) · 16 (64px)`

- Card internal padding: `p-4` (mobile) / `p-6` (desktop)
- Section vertical rhythm: `py-8 md:py-12`
- Form field gap: `gap-4`
- Page horizontal gutter: `px-4 md:px-6 lg:px-8`

### 1.4 Border Radius & Elevation

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `4px` (`rounded`) | Badges, chips |
| `--radius-md` | `8px` (`rounded-lg`) | Buttons, inputs |
| `--radius-lg` | `12px` (`rounded-xl`) | Cards, modals |
| Shadow | `shadow-sm` on cards at rest, `shadow-md` on hover/focus | Keep flat — no heavy drop shadows or glassmorphism |

### 1.5 Motion

Minimal by design:
- Transitions: `transition-colors duration-150` on buttons/links, `transition-shadow duration-200` on cards.
- No parallax, no page-transition animation, no skeleton shimmer beyond a simple pulsing gray block (`animate-pulse`) for loading states.
- Respect `prefers-reduced-motion: reduce` — disable the `animate-pulse` and hover-shadow transition when set.

---

## 2. Reusable UI Component List

| Component | Purpose | Key states |
|---|---|---|
| `Navbar` | Role-aware top nav (guest / ứng viên / nhà tuyển dụng / admin show different links) | logged-out, ứng viên, employer, admin |
| `BottomTabBar` | Mobile primary navigation (see §4) | active tab, badge count (thông báo) |
| `JobCard` | Compact job summary: title, employer, khu vực, khung giờ, mức lương, posted date | default, saved/bookmarked (optional stretch) |
| `FilterBar` | Keyword input + khu vực / khung giờ / mức lương filters | collapsed (mobile sheet) / expanded (desktop sidebar) |
| `StatusBadge` | Small pill showing status (pending/viewed/interview/approved/rejected) | 5 semantic variants (§1.1) |
| `ApplicationRow` | One applicant row in employer's candidate list, or one applied-job row in candidate profile | with inline status control |
| `Button` | Primary / secondary / destructive / ghost | default, hover, active, disabled, loading |
| `Input` / `Select` / `Textarea` | Form fields with label + helper/error text | default, focus, error, disabled |
| `EmptyState` | Illustration-free placeholder ("Chưa có tin tuyển dụng nào phù hợp") + CTA | used on empty search results, empty applicant list, empty applied-jobs list |
| `Toast` | Transient success/error feedback (e.g. "Ứng tuyển thành công!") | success, error, info |
| `NotificationBell` | Icon + unread count in navbar, opens dropdown/list | 0 unread, N unread |
| `Modal/Dialog` | Confirm actions (reject job, reject applicant) | default, destructive |
| `Pagination` | Simple prev/next + page numbers for job list, applicant list, admin tables | — |
| `Tag`/`Chip` | Skill tags on candidate profile, khu vực chips in filters | selected, unselected |
| `Avatar` | Initials-based circular avatar (no photo upload required for MVP) | — |

Keep the component count intentionally small — everything above is reused across at least 2 of the 6 screens.

---

## 3. Mobile Navigation Pattern

**Decision: Bottom Tab Bar for ứng viên (candidate) mobile experience; simple hamburger/drawer for nhà tuyển dụng (employer) and admin dashboards.**

Rationale:
- Candidates are the majority mobile audience and have a small, fixed set of top-level destinations (Trang chủ, Tìm việc/Bộ lọc, Hồ sơ, Thông báo) — a bottom tab bar keeps these one thumb-tap away, matching Instawork/Wonolo shift-app conventions.
- Employers and admin manage denser, table-heavy screens (candidate lists, admin approval queues) that don't fit a 4-icon tab metaphor well; a hamburger drawer with named menu items (Đăng tin, Quản lý tin, Quản lý ứng viên, Thống kê) scales better for that smaller, more desktop-leaning audience without adding a second navigation paradigm to learn.
- Both patterns collapse into a single top Navbar with the same links on desktop (`md:` and up) — bottom tab bar and hamburger both hide at `md:` breakpoint in favor of horizontal nav links.

**Candidate bottom tab bar** (4 items, fixed to viewport bottom, `h-16`, `shadow-sm` top border):
```
┌──────────┬──────────┬──────────┬──────────┐
│  🏠      │  🔍      │  📋      │  👤      │
│ Trang chủ│ Tìm việc │ Đơn ứng  │ Hồ sơ    │
│          │          │ tuyển    │          │
└──────────┴──────────┴──────────┴──────────┘
```
Active tab: `text-primary` + filled icon. Inactive: `text-muted`. Minimum tap target `44x44px` per icon+label block.

---

## 4. Responsive Breakpoints Strategy

Mobile-first Tailwind defaults, used as-is (no custom breakpoints — KISS):

| Breakpoint | Width | Layout behavior |
|---|---|---|
| base (no prefix) | 360px–639px | Single column. Bottom tab bar / hamburger visible. FilterBar collapses into a "Bộ lọc" button opening a bottom sheet. JobCard list is a vertical stack. |
| `sm:` | ≥640px | Slightly wider padding, 2-column forms where sensible (e.g. Đăng tin form fields pair up). |
| `md:` | ≥768px | Top Navbar with inline links replaces bottom tab bar/hamburger. FilterBar becomes a persistent left sidebar (Trang chủ) or inline horizontal bar. JobCard grid becomes 2 columns. |
| `lg:` | ≥1024px | JobCard grid becomes 3 columns. Two-pane layouts (e.g. Quản lý ứng viên: job list + applicant panel side-by-side). Max content width `max-w-6xl mx-auto`. |

Test explicitly at 360px (smallest common Android width), 768px (tablet), and 1280px (desktop).

---

## 5. Accessibility Basics

- **Color contrast**: all text/background pairs in §1.1 verified ≥4.5:1 (body text) / ≥3:1 (large text, icons). Never convey status by color alone — `StatusBadge` always pairs color with a text label.
- **Tap targets**: minimum 44×44px for all buttons, tab bar icons, and form controls on mobile.
- **Forms**: every input has a visible `<label>` (not placeholder-only), required fields marked with text ("Bắt buộc") not color alone, inline error text below the field (not just red border), `aria-invalid` + `aria-describedby` wired to error text.
- **Focus states**: visible focus ring (`ring-2 ring-primary ring-offset-2`) on all interactive elements for keyboard navigation — important since some employers may use desktop + keyboard/mouse.
- **Semantic HTML**: use `<button>` for actions, `<a>` for navigation, proper heading hierarchy (one `<h1>` per page), `<nav>` landmarks for Navbar/BottomTabBar.
- **Alt text**: any employer logo or avatar image gets descriptive `alt`; decorative icons get `aria-hidden="true"`.
- **Motion**: honor `prefers-reduced-motion` as noted in §1.5.

---

## 6. Screen-by-Screen Specifications

### 6.1 Trang chủ (Home)

**Goal**: Let ứng viên search/filter and browse approved job postings fast, with pay and hours visible without opening detail (Instawork/Wonolo pattern) — the core discovery screen.

**Mobile wireframe (base, 360–767px)**:
```
┌─────────────────────────────────┐
│ ☰ Logo            🔔(2)  👤     │  Navbar
├─────────────────────────────────┤
│ 🔍 [ Tìm việc làm...          ] │  Search input, full width
├─────────────────────────────────┤
│ [ Bộ lọc: Khu vực, Giờ, Lương ▾]│  Tap → opens bottom sheet filter
├─────────────────────────────────┤
│  Việc làm nổi bật                │  Section heading
│ ┌─────────────────────────────┐ │
│ │ [Logo] Phục vụ quán cà phê   │ │  JobCard
│ │ Highlands Coffee · Q.1       │ │
│ │ 25.000đ/giờ · Ca tối 18-22h  │ │
│ │ Đăng 2 giờ trước    [Xem >]  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ... (repeat JobCard) ...     │ │
│ └─────────────────────────────┘ │
│                                  │
│  Tin mới đăng                    │
│  (more JobCards, infinite        │
│   scroll or "Xem thêm" button)  │
├─────────────────────────────────┤
│  🏠   🔍   📋   👤              │  Bottom tab bar
└─────────────────────────────────┘
```

**Desktop wireframe (`lg:`, ≥1024px)**:
```
┌────────────────────────────────────────────────────────────┐
│  Logo   Trang chủ  Việc làm  (role links)      🔔  👤       │  Navbar (horizontal)
├───────────────┬──────────────────────────────────────────────┤
│ FilterBar      │  🔍 [ Tìm việc làm...                    ]  │
│ (sticky        ├──────────────────────────────────────────────┤
│  sidebar)      │  Việc làm nổi bật                            │
│ ☐ Khu vực      │  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  ☐ Q.1         │  │ JobCard  │ │ JobCard  │ │ JobCard  │      │  3-col grid
│  ☐ Q.3         │  └──────────┘ └──────────┘ └──────────┘      │
│ ☐ Khung giờ    │  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  ☐ Sáng        │  │ JobCard  │ │ JobCard  │ │ JobCard  │      │
│  ☐ Chiều/Tối   │  └──────────┘ └──────────┘ └──────────┘      │
│ Mức lương      │       [ Xem thêm / Pagination ]               │
│ [====slider==] │                                              │
│ [Áp dụng]      │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

**JobCard content (every instance, list or grid)**:
- Employer logo/avatar (initials fallback), Job title (H3), Employer name
- Khu vực (area/district) with location pin icon
- **Mức lương** — always shown, formatted as range (e.g. "22.000–28.000đ/giờ") — never hidden behind a click, matching the gig-app transparency pattern
- **Khung giờ** (shift/time window, e.g. "Ca sáng 6-12h" or "Cuối tuần")
- Posted-time relative label ("Đăng 2 giờ trước")
- Tap/click target: entire card navigates to Job Detail

**Filter fields**: Khu vực (multi-select checkboxes or dropdown), Khung giờ (chip multi-select: Sáng/Chiều/Tối/Cuối tuần/Toàn thời gian), Mức lương (min-max range slider or two number inputs). On mobile, filters live in a bottom sheet triggered by the "Bộ lọc" button, with an "Áp dụng" (Apply) button and result count preview.

**Empty state**: `EmptyState` component — "Không tìm thấy việc làm phù hợp. Thử điều chỉnh bộ lọc." + "Xóa bộ lọc" button.

---

### 6.2 Trang chi tiết tin (Job Detail)

**Goal**: Give full job info and a single clear apply action, with the button state adapting to auth/role/application-status — the conversion moment.

**Wireframe (mobile, scales to a 2-column layout at `lg:` with sticky apply panel on the right)**:
```
┌─────────────────────────────────┐
│ ← Quay lại                       │
├─────────────────────────────────┤
│ [Logo]  Phục vụ quán cà phê       │  H1 job title
│ Highlands Coffee · Quận 1        │  Employer + khu vực
│ 25.000–30.000đ/giờ               │  Salary, prominent, bold, primary color
│ Ca tối: 18:00–22:00, T2–T6       │  Shift/hours
│ [StatusBadge: Đã duyệt] (if any) │
├─────────────────────────────────┤
│  Mô tả công việc                 │
│  Lorem ipsum mô tả chi tiết...   │
│                                  │
│  Yêu cầu ứng viên                │
│  • Giao tiếp tốt                 │
│  • Có thể làm ca tối             │
│  • Không yêu cầu kinh nghiệm     │
│                                  │
│  Thông tin nhà tuyển dụng        │
│  Highlands Coffee — Quận 1       │
├─────────────────────────────────┤
│  [   Ứng tuyển ngay   ]          │  Sticky bottom CTA bar (mobile)
└─────────────────────────────────┘
```

**Apply button state matrix** (single button, label/behavior changes — no separate screens):

| Context | Button label | Behavior |
|---|---|---|
| Not logged in | "Đăng nhập để ứng tuyển" | Redirects to login, returns to this page after |
| Logged in as ứng viên, not yet applied | "Ứng tuyển ngay" (primary, accent green) | Opens confirm dialog → submits application → success Toast + button updates to "Đã ứng tuyển" |
| Logged in as ứng viên, already applied | "Đã ứng tuyển" (disabled, muted) + `StatusBadge` showing current status | No action; links to their application status in Hồ sơ |
| Logged in as nhà tuyển dụng (wrong role) | Button hidden; inline note: "Tài khoản nhà tuyển dụng không thể ứng tuyển" | — |
| Logged in as admin | Button hidden; "Xem với vai trò quản trị" note only | — |
| Job posting expired/closed | "Tin đã đóng" (disabled) | — |

**Desktop (`lg:`) layout**: main content (description, requirements, employer info) in left ~65% column; right ~35% column is a sticky card repeating title/salary/shift + the Apply button, so the CTA is always visible without scrolling back up.

---

### 6.3 Trang đăng tin (Employer — Post a Job)

**Goal**: Simple single-page form; submission goes to admin queue as `pending`, not live immediately.

**Wireframe (mobile; fields stack single-column; `sm:` pairs some fields)**:
```
┌─────────────────────────────────┐
│ ← Đăng tin tuyển dụng             │  H1
├─────────────────────────────────┤
│ Tiêu đề công việc *               │
│ [ VD: Nhân viên phục vụ ca tối ]  │
│                                  │
│ Mô tả công việc *                 │
│ [ Textarea, 4-6 rows          ]  │
│                                  │
│ Khu vực *                         │
│ [ Dropdown: Quận/Huyện        ▾] │
│                                  │
│ Khung giờ làm việc *              │
│ [ Chips: Sáng / Chiều / Tối /    │
│   Cuối tuần / Tùy chọn ]         │
│                                  │
│ Mức lương *                       │
│ [ Từ: 20.000 ] [ Đến: 30.000 ]   │  đ/giờ, side-by-side even on mobile
│ [ ⌄ Theo giờ / Theo ca / Cố định]│  unit selector
│                                  │
│ Yêu cầu ứng viên                  │
│ [ Textarea, bullet-style hint  ] │
│                                  │
│ ℹ️ Tin đăng sẽ được admin duyệt   │  Inline notice, muted background
│    trước khi hiển thị công khai. │
│                                  │
│ [   Hủy   ]   [   Đăng tin   ]   │  Secondary + Primary buttons
└─────────────────────────────────┘
```

**Field notes**:
- `*` marks required fields; error text appears inline below field on blur/submit, not just red border (accessibility).
- After submit: success Toast "Tin đăng đã được gửi, đang chờ duyệt" → redirect to employer's "Quản lý tin" list showing the new posting with `StatusBadge: pending`.
- No image/logo upload required for MVP (keep KISS) — employer name/avatar reuses account profile initials.

---

### 6.4 Trang quản lý ứng viên (Employer — Manage Applicants per Job)

**Goal**: Employer reviews everyone who applied to one specific job posting and moves them through a status pipeline.

**Wireframe (mobile — list of `ApplicationRow`, each expandable)**:
```
┌─────────────────────────────────┐
│ ← Ứng viên: Phục vụ ca tối        │  H1 = job title context
│   3 ứng viên                     │
├─────────────────────────────────┤
│ [Filter chips: Tất cả / Chờ xử lý│
│  / Đã xem / Phỏng vấn / Từ chối] │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ 👤 Nguyễn Văn A               │ │  ApplicationRow
│ │ Ứng tuyển: 2 giờ trước        │ │
│ │ [StatusBadge: Chờ xử lý ▾]    │ │  Tap badge → dropdown to change status
│ │ [ Xem hồ sơ ]                 │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 👤 Trần Thị B                 │ │
│ │ Ứng tuyển: 1 ngày trước       │ │
│ │ [StatusBadge: Phỏng vấn ▾]    │ │
│ │ [ Xem hồ sơ ]                 │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Status dropdown options** (single-select, changes trigger a Toast confirmation): `Chờ xử lý (pending) → Đã xem (viewed) → Mời phỏng vấn (interview) → Từ chối (rejected)`. Modeled as a simple forward-moving pipeline (candidate can also be set directly to Từ chối from any state) rather than a strict linear wizard — matches how a small-business owner would actually triage applicants.

**Desktop (`lg:`) layout**: two-pane — left pane is a list of the employer's own job postings (to switch context between jobs); right pane is the `ApplicationRow` list for the selected job. Clicking "Xem hồ sơ" opens the candidate's public profile info (skills, bio, preferred areas) in a modal/drawer rather than a full navigation, to keep the employer in triage flow.

---

### 6.5 Trang hồ sơ cá nhân (Candidate Profile)

**Goal**: Ứng viên manages their basic info/skills and sees the status of every job they've applied to (Instawork/Wonolo-style application tracker).

**Wireframe (mobile)**:
```
┌─────────────────────────────────┐
│ Hồ sơ của tôi           [Sửa]    │  H1 + edit toggle
├─────────────────────────────────┤
│         👤 (avatar/initials)     │
│      Nguyễn Văn A                │
│      0987 xxx xxx · Quận 1       │
│                                  │
│ Giới thiệu ngắn                  │
│ "Sinh viên năm 3, có thể làm     │
│  ca tối và cuối tuần..."         │
│                                  │
│ Kỹ năng                          │
│ [Pha chế] [Giao tiếp] [Excel]    │  Tag/Chip list
│                                  │
│ Khu vực mong muốn                │
│ [Quận 1] [Quận 3] [Bình Thạnh]   │  Tag/Chip list
├─────────────────────────────────┤
│ Việc đã ứng tuyển (4)             │  Section heading
│ [Tabs: Tất cả / Đang chờ /       │
│  Phỏng vấn / Kết quả]            │
│ ┌─────────────────────────────┐ │
│ │ Phục vụ ca tối                │ │  ApplicationRow
│ │ Highlands Coffee · Q.1        │ │
│ │ [StatusBadge: Phỏng vấn]      │ │
│ │ Ứng tuyển: 3 ngày trước [Xem >]│ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ... (more ApplicationRow) ... │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│  🏠   🔍   📋   👤              │  Bottom tab bar (Hồ sơ active)
└─────────────────────────────────┘
```

**Notes**:
- Edit mode swaps display text for form `Input`/`Textarea`/`Tag` selector, reusing the same components as Đăng tin form.
- Applied-jobs list reuses `ApplicationRow` + `StatusBadge` (read-only from candidate's side — they see status, they don't change it) with a status filter tab bar for quick triage of "which jobs are still pending vs. which need my attention."
- Desktop (`md:`+): profile info and applied-jobs list can sit side-by-side (profile card ~35% left, applied jobs ~65% right) or stack — either is acceptable; stacking is simpler to build and is the recommended default for KISS.

---

### 6.6 Trang quản trị (Admin Dashboard)

**Goal**: Admin approves/rejects pending job postings, oversees user accounts, and sees basic platform health at a glance. Table-dense, desktop-leaning, uses hamburger/drawer nav on mobile.

**Wireframe (desktop-first for this screen, since admin usage skews desktop; mobile collapses stat cards to a horizontal scroll and tables to stacked cards)**:
```
┌────────────────────────────────────────────────────────────┐
│ ☰ Admin   Tổng quan  Duyệt tin  Người dùng          👤       │  Navbar/drawer
├────────────────────────────────────────────────────────────┤
│  Tổng quan                                                   │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│ │ 128       │ │ 342       │ │ 15        │ │ 891       │      │  Stat cards
│ │ Tin tuyển │ │ Người dùng│ │ Chờ duyệt │ │ Lượt ứng  │      │
│ │ dụng      │ │           │ │           │ │ tuyển     │      │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘      │
├────────────────────────────────────────────────────────────┤
│  Tin chờ duyệt (15)                                           │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Tiêu đề        Nhà tuyển dụng   Khu vực   Ngày đăng      │ │
│ ├────────────────────────────────────────────────────────┤ │
│ │ Phục vụ ca tối  Highlands Coffee  Q.1     2 giờ trước    │ │
│ │ [StatusBadge: Chờ duyệt]      [Duyệt]  [Từ chối]         │ │
│ ├────────────────────────────────────────────────────────┤ │
│ │ ... (more rows) ...                                      │ │
│ └────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│  Người dùng                                                   │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Tên          Email            Vai trò     Ngày tạo        │ │
│ ├────────────────────────────────────────────────────────┤ │
│ │ Nguyễn Văn A  a@mail.com      Ứng viên    01/03/2026     │ │
│ │ Highlands Coffee coffee@x.com Nhà TD      15/02/2026     │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

**Interaction notes**:
- "Duyệt" (approve) → job posting status becomes `approved`, immediately visible on Trang chủ; "Từ chối" opens a `Modal` asking for an optional reason, then sets status to `rejected` (job author sees this in their "Quản lý tin" list).
- Người dùng table is read-mostly for MVP (view role/date); a stretch action could be "Khóa tài khoản" (disable account) — not required for the core scope but the table layout should leave room for an actions column.
- Mobile: stat cards become a horizontally scrollable row (`overflow-x-auto`, `snap-x`); tables become stacked `ApplicationRow`-style cards (one card per pending job / per user) instead of a `<table>`, since raw tables don't work well under 480px.

---

## Unresolved Questions

- Whether "Việc làm nổi bật" (featured) is a manually curated admin flag or simply "most recent approved" — affects whether Trang chủ needs a `featured: boolean` field or just sorts by `createdAt`. Recommend defaulting to sort-by-recency only for MVP simplicity, and treat "featured" as a stretch goal.
- Whether candidates can bookmark/save jobs without applying (would add a `SavedJobCard` state) — not in the original 6-screen scope, flagged here as an easy future addition using the existing `JobCard` component.
