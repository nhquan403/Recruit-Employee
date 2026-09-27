# CHƯƠNG 3. HIỆN THỰC HÓA NGHIÊN CỨU

## 3.1. Kiến trúc tổng quan hệ thống

Hình 2.1 thể hiện kiến trúc tổng quan của hệ thống Việc Làm Thêm.

[Hình 2.1]
Nguồn: tự vẽ dựa trên docker-compose.yml và frontend/src/lib/use-polling-notifications.ts

Hệ thống gồm ba thành phần triển khai độc lập, đóng gói bằng Docker Compose: dịch vụ `db`
(PostgreSQL 16), dịch vụ `backend` (NestJS, lắng nghe cổng 4000) và dịch vụ `frontend` (Next.js,
lắng nghe cổng 3000). Trình duyệt của người dùng chỉ giao tiếp trực tiếp với `frontend`; các
thao tác cần dữ liệu (đăng nhập, tìm kiếm, ứng tuyển...) được `frontend` gọi tiếp sang `backend`
qua REST API có JWT đính kèm. `backend` là thành phần duy nhất truy cập cơ sở dữ liệu, thông qua
Prisma Client.

Riêng chức năng thông báo không dùng kết nối riêng: `frontend` gọi định kỳ `GET
/notifications/mine` và `GET /notifications/mine/unread-count` mỗi 20 giây (lý do chọn cơ chế
này thay vì WebSocket đã trình bày ở mục 2.6).

## 3.2. Thiết kế cơ sở dữ liệu

Hình 2.2 thể hiện sơ đồ quan hệ thực thể (ERD) của hệ thống, trích trực tiếp từ
`backend/prisma/schema.prisma`.

[Hình 2.2]
Nguồn: tự vẽ dựa trên backend/prisma/schema.prisma

Cơ sở dữ liệu gồm 5 bảng. Bảng 3.1 đến Bảng 3.5 mô tả chi tiết từng bảng, copy nguyên trạng
tên field và kiểu dữ liệu từ `schema.prisma`, không diễn giải lại theo suy đoán.

Bảng 3.1. Bảng `User`

| Field | Kiểu dữ liệu | Ràng buộc |
|---|---|---|
| id | String | Khóa chính, mặc định uuid() |
| email | String | Duy nhất (unique) |
| passwordHash | String | Bắt buộc — lưu mật khẩu đã băm bcrypt, không lưu văn bản thuần |
| role | Role (enum) | `CANDIDATE`, `EMPLOYER`, hoặc `ADMIN` |
| fullName | String | Bắt buộc |
| phone | String | Tùy chọn |
| isActive | Boolean | Mặc định `true` |
| createdAt / updatedAt | DateTime | Tự động gán |

Bảng 3.2. Bảng `Job`

| Field | Kiểu dữ liệu | Ràng buộc |
|---|---|---|
| id | String | Khóa chính |
| title, description, area, shift | String | Bắt buộc |
| salaryMin, salaryMax | Int | Tùy chọn |
| salaryUnit | String | Mặc định `"VND/giờ"` |
| requirements | String | Tùy chọn |
| status | JobStatus (enum) | `PENDING`, `APPROVED`, hoặc `REJECTED`; mặc định `PENDING` |
| rejectReason | String | Tùy chọn — lý do khi admin từ chối |
| employerId | String | Khóa ngoại tới `User` (quan hệ `EmployerJobs`) |

Bảng 3.3. Bảng `Application`

| Field | Kiểu dữ liệu | Ràng buộc |
|---|---|---|
| id | String | Khóa chính |
| jobId | String | Khóa ngoại tới `Job` |
| candidateId | String | Khóa ngoại tới `User` |
| status | ApplicationStatus (enum) | `PENDING`, `VIEWED`, `INTERVIEW`, hoặc `REJECTED`; mặc định `PENDING` |
| message | String | Tùy chọn |
| — | — | Ràng buộc duy nhất trên cặp `(jobId, candidateId)` — một ứng viên chỉ ứng tuyển một lần cho một tin |

Bảng 3.4. Bảng `Profile`

| Field | Kiểu dữ liệu | Ràng buộc |
|---|---|---|
| id | String | Khóa chính |
| userId | String | Khóa ngoại tới `User`, duy nhất (quan hệ 1-1) |
| bio | String | Tùy chọn |
| skills | String[] | Mặc định mảng rỗng |
| preferredAreas | String[] | Mặc định mảng rỗng |
| avatarUrl | String | Tùy chọn |

Bảng 3.5. Bảng `Notification`

| Field | Kiểu dữ liệu | Ràng buộc |
|---|---|---|
| id | String | Khóa chính |
| userId | String | Khóa ngoại tới `User` |
| type | String | Loại thông báo, ví dụ `NEW_APPLICATION` |
| message | String | Nội dung hiển thị |
| link | String | Tùy chọn — đường dẫn điều hướng khi bấm vào |
| isRead | Boolean | Mặc định `false` |
| createdAt | DateTime | Tự động gán |

## 3.3. Thiết kế API

Bảng 3.6 liệt kê các endpoint chính, đối chiếu trực tiếp với các file controller thật trong
`backend/src/`.

Bảng 3.6. Danh sách API chính theo module

| Phương thức | Endpoint | Vai trò yêu cầu | Mô tả |
|---|---|---|---:|
| POST | `/auth/register` | Công khai | Đăng ký tài khoản (ứng viên hoặc nhà tuyển dụng) |
| POST | `/auth/login` | Công khai | Đăng nhập, trả về JWT |
| GET | `/auth/me` | Đã đăng nhập | Lấy thông tin tài khoản đang đăng nhập |
| GET | `/jobs` | Công khai | Tìm kiếm/lọc tin theo `q`, `area`, `shift`, `salaryMin`, `salaryMax`, phân trang `page`/`limit` |
| GET | `/jobs/:id` | Công khai | Xem chi tiết một tin |
| POST | `/jobs` | EMPLOYER | Đăng tin mới (trạng thái khởi tạo `PENDING`) |
| GET | `/jobs/mine` | EMPLOYER | Danh sách tin của chính nhà tuyển dụng đang đăng nhập |
| PATCH | `/jobs/:id` | EMPLOYER (chủ tin) | Sửa tin — có thêm `JobOwnerGuard` kiểm tra đúng chủ tin |
| DELETE | `/jobs/:id` | EMPLOYER (chủ tin) | Xoá tin — cùng `JobOwnerGuard` |
| POST | `/applications` | CANDIDATE | Ứng tuyển vào một tin |
| GET | `/applications/mine` | CANDIDATE | Danh sách hồ sơ đã ứng tuyển của ứng viên |
| GET | `/jobs/:id/applications` | EMPLOYER (chủ tin) | Danh sách ứng viên của một tin — cùng `JobOwnerGuard` |
| PATCH | `/applications/:id/status` | EMPLOYER | Cập nhật trạng thái hồ sơ (VIEWED/INTERVIEW/REJECTED) |
| GET | `/notifications/mine` | Đã đăng nhập | Danh sách thông báo của người dùng |
| GET | `/notifications/mine/unread-count` | Đã đăng nhập | Số thông báo chưa đọc |
| PATCH | `/notifications/:id/read` | Đã đăng nhập | Đánh dấu một thông báo đã đọc |
| PATCH | `/notifications/read-all` | Đã đăng nhập | Đánh dấu tất cả đã đọc |
| GET | `/profiles/me` | CANDIDATE | Lấy hồ sơ cá nhân |
| PATCH | `/profiles/me` | CANDIDATE | Cập nhật hồ sơ cá nhân |
| GET | `/admin/jobs` | ADMIN | Danh sách tin chờ duyệt |
| PATCH | `/admin/jobs/:id/approve` | ADMIN | Duyệt tin |
| PATCH | `/admin/jobs/:id/reject` | ADMIN | Từ chối tin |
| GET | `/admin/users` | ADMIN | Danh sách người dùng |
| GET | `/admin/stats` | ADMIN | Số liệu tổng quan cho trang quản trị |

Ngoài `RolesGuard` mô tả ở mục 2.5.3, hai route sửa/xoá tin và xem danh sách ứng viên còn được
bảo vệ thêm bởi `JobOwnerGuard` (`backend/src/jobs/guards/job-owner.guard.ts`) để đảm bảo một
nhà tuyển dụng chỉ thao tác được trên tin do chính mình đăng, không thao tác được trên tin của
nhà tuyển dụng khác dù cùng vai trò `EMPLOYER`.

## 3.4. Luồng ứng tuyển chi tiết

Hình 2.3 thể hiện sơ đồ tuần tự luồng ứng tuyển đầu-cuối.

[Hình 2.3]
Nguồn: tự vẽ dựa trên luồng nghiệp vụ cài đặt trong backend/src/applications/

Luồng gồm các bước sau, đúng theo hợp đồng luồng (Apply-Flow Contract) đã xác lập từ giai đoạn
thiết kế hệ thống:

1. Ứng viên tìm kiếm/lọc tin, mở trang chi tiết, bấm "Ứng tuyển".
2. Frontend gọi `POST /applications`; backend tạo một bản ghi `Application` với
   `status = PENDING`, đồng thời tạo một `Notification` gửi cho nhà tuyển dụng sở hữu tin đó.
3. Nhà tuyển dụng mở trang "Quản lý ứng viên" (`GET /jobs/:id/applications`); lần xem đầu tiên
   này được đánh dấu chuyển trạng thái ứng dụng sang `VIEWED`.
4. Nhà tuyển dụng chọn "Mời phỏng vấn" hoặc "Từ chối", frontend gọi `PATCH
   /applications/:id/status`; backend cập nhật `status` thành `INTERVIEW` hoặc `REJECTED`, đồng
   thời tạo một `Notification` gửi cho ứng viên.
5. Ứng viên thấy cập nhật thông qua vòng poll `GET /notifications/mine` tiếp theo (tối đa 20
   giây sau khi nhà tuyển dụng thao tác).

Chi tiết cài đặt từng use case, kèm ảnh chụp giao diện thật, được trình bày ở mục tiếp theo
(`04b-chuong-3-cai-dat.md`).
