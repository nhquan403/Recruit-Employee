# Việc Làm Thêm — Part-Time Job Marketplace

Website kết nối người tìm việc làm thêm (bán thời gian, theo ca, thời vụ) với nhà tuyển
dụng (cửa hàng, quán ăn, doanh nghiệp nhỏ). Quản trị viên duyệt tin trước khi hiển thị công
khai. Xem kế hoạch triển khai đầy đủ tại
[`plans/260926-1323-part-time-job-marketplace/plan.md`](./plans/260926-1323-part-time-job-marketplace/plan.md),
tài liệu thiết kế UI/UX tại [`docs/design-guidelines.md`](./docs/design-guidelines.md), và
kịch bản UAT tại [`docs/uat-script.md`](./docs/uat-script.md).

## Thông tin đồ án

Đồ án Thực tập Cơ sở ngành — Trường Đại học Trà Vinh, Trường Kỹ thuật và Công nghệ, Khoa
Công nghệ Thông tin.

| | |
|---|---|
| Tên đề tài | Xây dựng website kết nối người tìm việc làm thêm với nhà tuyển dụng |
| Sinh viên thực hiện | Bùi Anh Khoa — MSSV 170123594 — Lớp DX23TT11 — Khóa 2023–2027 |
| Giảng viên hướng dẫn | ThS. Trầm Hoàng Nam |
| Liên hệ | nghong.quan403@gmail.com · điện thoại: _[cần bổ sung]_ |

Bản báo cáo đồ án đầy đủ (`.docx`/`.pdf`, sinh tự động từ Markdown nguồn ở `docs/bao-cao/`):
xem [`thesis/`](./thesis/). Báo cáo tiến độ: xem [`progress-report/`](./progress-report/)
— **lưu ý đọc `progress-report/README.md` trước khi nộp**, có ghi chú quan trọng về lịch sử
commit.

## Tech stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + TailwindCSS 3
- **Backend**: NestJS 11 + TypeScript, REST API
- **Database**: PostgreSQL + Prisma ORM 6
- **Auth**: JWT (access token) + bcrypt + role-based guards (candidate / employer / admin)
- **Notifications**: in-app, DB-backed, polled every 20s (no WebSocket server)

## Prerequisites

- Node.js 20+ (developed with Node 22)
- PostgreSQL 16 reachable locally (via Docker, or a local install)
- Docker + Docker Compose, if you want the full-stack container demo instead of local `npm run dev`

## Local setup (without Docker)

1. **Start Postgres** — either:
   - `docker compose up -d db`, or
   - a local PostgreSQL server with a database/role matching `DATABASE_URL` below.
2. **Configure env vars**:
   ```bash
   cp .env.example backend/.env
   # edit backend/.env if your local Postgres credentials differ
   ```
   Default dev credentials (matching `docker-compose.yml`): user `parttime`, password
   `parttime_dev_pw`, database `parttime_jobs`, port `5432`.
3. **Install dependencies** (root, installs both workspaces):
   ```bash
   npm install
   ```
4. **Run the database migration**:
   ```bash
   npm run prisma:migrate
   ```
5. **Seed an admin account** (default `admin@example.com` / `Admin@12345` — override via
   `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `backend/.env` before seeding):
   ```bash
   npm run seed
   ```
6. **Run both apps**:
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:4000 (health check at `/health`)
   - Frontend: http://localhost:3000

## Docker demo (full stack — the primary/graded demo target)

```bash
docker compose up --build
```

This builds and runs all three services (`db`, `backend`, `frontend`) from a clean
checkout — no other setup steps needed. The backend container runs migrations and the
idempotent admin seed automatically on every start, before the API starts listening.

- Frontend: http://localhost:3000
- Backend health check: http://localhost:4000/health
- Seeded admin login: `admin@example.com` / `Admin@12345`

Stop everything with `docker compose down` (add `-v` to also drop the Postgres volume).

Deploying `frontend/` to Vercel and `backend/` + a managed Postgres to Render/Railway is
documented here as an optional stretch — it is not required for the project to be
considered complete.

**Note on this repository's dev environment:** the Docker Compose setup was written and
reviewed carefully, but the container this project was built in has no Docker daemon
available, so `docker compose up --build` itself could not be executed end-to-end here.
Everything it runs (`npm ci`, `nest build`, `next build`, `prisma migrate deploy`, the seed
script, `next start`, `node dist/src/main.js`) was verified directly against a local
Postgres install instead. Please run the actual `docker compose up --build` once in an
environment with Docker before treating the container demo as verified.

## Project layout

```
backend/           NestJS API (Prisma schema in backend/prisma/schema.prisma)
frontend/          Next.js app (App Router, TailwindCSS)
docs/              Design guidelines, UAT script, bao-cao/ (báo cáo đồ án, Markdown nguồn)
plans/             Implementation plans (phase-by-phase)
scripts/           Pipeline sinh báo cáo .docx (scripts/xuat-ban-word.py) + script dựng ảnh
thesis/            Bản .docx/.pdf cuối cùng của báo cáo đồ án (mục 4.3 quy định nộp bài)
progress-report/   Báo cáo tiến độ (mục 4.3 quy định nộp bài)
```

### Đối chiếu với cấu trúc nộp bài mục 4.3 (quy định đồ án)

Quy định trình bày đồ án gợi ý một cấu trúc thư mục cho repo nộp bài. Repo này là code của
sản phẩm thật (không phải repo nộp bài tạo riêng), nên bảng dưới đối chiếu cấu trúc gợi ý đó
với vị trí tương ứng thật trong repo, thay vì tạo thêm thư mục trùng lặp không có nội dung:

| Thư mục gợi ý (mục 4.3) | Trạng thái | Vị trí thật trong repo |
|---|---|---|
| `progress-report/` _(bắt buộc)_ | Có | [`progress-report/`](./progress-report/) |
| `thesis/` _(bắt buộc)_ | Có | [`thesis/`](./thesis/) (`doc/`, `pdf/`, `refs/` — xem `thesis/README.md` để biết vì sao không có `html/`, `abs/`) |
| `setup` | Tương đương | Mục "Local setup" / "Docker demo" trong README này + `.env.example` |
| `scr` (mã nguồn) | Tương đương | `backend/`, `frontend/` |
| `soft` | Không áp dụng | Không có phần mềm/thư viện ngoài cần đính kèm riêng |
| `docker` | Tương đương | `docker-compose.yml` ở thư mục gốc |

## Testing

```bash
npm run test              # backend unit tests + frontend tests
npm run test:e2e          # backend integration tests, incl. the RBAC sweep
```

`test:e2e` needs a second, disposable Postgres database (never the dev one — tests write
and delete real rows). One-time setup:

```bash
# create the DB (adjust user/host to match your Postgres install)
psql -c "CREATE DATABASE parttime_jobs_test OWNER parttime;"
DATABASE_URL="postgresql://parttime:parttime_dev_pw@localhost:5432/parttime_jobs_test?schema=public" \
  npm run prisma:migrate --workspace=backend -- deploy
```

`backend/test/setup-env.ts` points `DATABASE_URL` at that database automatically (override
with `TEST_DATABASE_URL` if yours differs) — nothing further to configure.

## Security notes

- Passwords are hashed with bcrypt; plaintext is never stored or logged.
- Every role-restricted route is enforced server-side (guards), not just hidden in the UI —
  see `backend/test/rbac.e2e-spec.ts` for the automated proof.
- `ADMIN` is never a self-service registration role; the only admin account comes from the
  seed script.
