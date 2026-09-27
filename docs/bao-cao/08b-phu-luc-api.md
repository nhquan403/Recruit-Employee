# PHỤ LỤC B. TOÀN VĂN DANH SÁCH API

Bảng dưới đây liệt kê đầy đủ mọi endpoint thật trong `backend/src/`, đối chiếu trực tiếp với
từng file `*.controller.ts` — không suy đoán route chưa xác nhận trong code.

| Phương thức | Endpoint | File controller | Vai trò yêu cầu |
|---|---|---|---|
| GET | `/health` | health/health.controller.ts | Công khai |
| POST | `/auth/register` | auth/auth.controller.ts | Công khai |
| POST | `/auth/login` | auth/auth.controller.ts | Công khai |
| GET | `/auth/me` | auth/auth.controller.ts | Đã đăng nhập |
| POST | `/jobs` | jobs/jobs.controller.ts | EMPLOYER |
| GET | `/jobs/mine` | jobs/jobs.controller.ts | EMPLOYER |
| GET | `/jobs` | jobs/jobs.controller.ts | Công khai |
| GET | `/jobs/:id` | jobs/jobs.controller.ts | Công khai (có nhận diện người xem nếu đã đăng nhập) |
| PATCH | `/jobs/:id` | jobs/jobs.controller.ts | EMPLOYER, chỉ chủ tin (`JobOwnerGuard`) |
| DELETE | `/jobs/:id` | jobs/jobs.controller.ts | EMPLOYER, chỉ chủ tin (`JobOwnerGuard`) |
| POST | `/applications` | applications/applications.controller.ts | CANDIDATE |
| GET | `/applications/mine` | applications/applications.controller.ts | CANDIDATE |
| GET | `/jobs/:id/applications` | applications/applications.controller.ts | EMPLOYER, chỉ chủ tin (`JobOwnerGuard`) |
| PATCH | `/applications/:id/status` | applications/applications.controller.ts | EMPLOYER |
| GET | `/notifications/mine` | notifications/notifications.controller.ts | Đã đăng nhập |
| GET | `/notifications/mine/unread-count` | notifications/notifications.controller.ts | Đã đăng nhập |
| PATCH | `/notifications/:id/read` | notifications/notifications.controller.ts | Đã đăng nhập |
| PATCH | `/notifications/read-all` | notifications/notifications.controller.ts | Đã đăng nhập |
| GET | `/profiles/me` | profiles/profiles.controller.ts | CANDIDATE |
| PATCH | `/profiles/me` | profiles/profiles.controller.ts | CANDIDATE |
| GET | `/admin/jobs` | admin/admin-jobs.controller.ts | ADMIN |
| PATCH | `/admin/jobs/:id/approve` | admin/admin-jobs.controller.ts | ADMIN |
| PATCH | `/admin/jobs/:id/reject` | admin/admin-jobs.controller.ts | ADMIN |
| GET | `/admin/users` | admin/admin-users.controller.ts | ADMIN |
| GET | `/admin/stats` | admin/admin-stats.controller.ts | ADMIN |

Tổng cộng 24 endpoint (không tính `/health`), phân bổ trên 8 controller.
