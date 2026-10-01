# Báo cáo tiến độ — 2026-09-26 — Xây dựng ứng dụng (Phase 1-8)

Nguồn: lịch sử commit thật, `git log --date=format:"%Y-%m-%d %H:%M"`.

| Giờ | Commit | Nội dung |
|---|---|---|
| 13:33 | `2cd2bc7` | Viết kế hoạch triển khai (`plans/260926-1323-part-time-job-marketplace/plan.md`) |
| 13:50 | `32f9d8c` | Phase 1 — scaffold monorepo NestJS + Next.js, schema Prisma, baseline DB |
| 13:59 | `3bb3ded` | Phase 2 — design token + component dùng chung (UI/UX) |
| 14:07 | `5e2c01c` | Phase 3 — xác thực JWT, guard phân quyền theo vai trò, app shell |
| 14:15 | `0c906c2` | Phase 4 — đăng tin tuyển dụng, quản lý ứng viên (nhà tuyển dụng) |
| 14:23 | `bdf4776` | Phase 5 — tìm kiếm, chi tiết tin, ứng tuyển, hồ sơ (ứng viên) |
| 14:27 | `aa7112e` | Phase 6 — duyệt tin, quản lý tài khoản (quản trị viên) |
| 14:33 | `610d65e` | Phase 7 — thông báo trong ứng dụng (polling) |
| 14:54 | `9e43cef` | Phase 8 (phần 1) — kiểm thử đơn vị/tích hợp backend, smoke test frontend |
| 15:00 | `cf93ef9` | Phase 8 (phần 2) — Docker Compose demo full-stack, hoàn thiện tài liệu |

## Kết quả đạt được trong phiên này

Toàn bộ 7 use case đã đặc tả trong đề cương (đăng ký/đăng nhập, đăng tin, tìm kiếm/lọc, ứng
tuyển, quản lý ứng viên, duyệt tin, nhận thông báo) được cài đặt và có kiểm thử tự động đi kèm.
Hệ thống chạy được đầy đủ ba vai trò (ứng viên, nhà tuyển dụng, quản trị viên) trên Next.js +
NestJS + PostgreSQL/Prisma, đóng gói bằng Docker Compose.

Chi tiết kỹ thuật đầy đủ: xem Chương 3 (Hiện thực hóa nghiên cứu) và Chương 4 (Kết quả nghiên
cứu) trong [`thesis/doc/`](../thesis/doc/).
