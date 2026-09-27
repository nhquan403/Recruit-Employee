# Danh mục hình — nguồn & cách tạo lại

Mọi ảnh trong thư mục này đều là ảnh thật, sinh ra bằng script, có thể tái tạo lại nguyên
văn bằng đúng lệnh ghi ở cột "Cách tạo". Không có ảnh giữ chỗ.

| File | Mô tả | Cách tạo |
|---|---|---|
| `hinh-1-1-trang-chu.png` | Trang chủ, danh sách tin tuyển dụng + bộ lọc | `npx ts-node scripts/bao_cao_hinh/chup-man-hinh.ts` (route `/`, không đăng nhập) |
| `hinh-1-2-tim-kiem-loc.png` | Trang tìm việc `/viec-lam` | như trên (route `/viec-lam`) |
| `hinh-1-3-chi-tiet-tin.png` | Trang chi tiết một tin tuyển dụng | như trên (route `/viec-lam/:id`) |
| `hinh-2-1-kien-truc-tong-quan.png` | Sơ đồ kiến trúc tổng quan (frontend/backend/CSDL + cơ chế polling thông báo) | `python3 scripts/bao_cao_hinh/ve_so_do.py` — vẽ tay theo đúng `docker-compose.yml` và `frontend/src/lib/use-polling-notifications.ts` (KHÔNG dùng lại sơ đồ WebSocket cũ trong đề cương vì hệ thống thật dùng polling) |
| `hinh-2-2-erd.png` | Sơ đồ quan hệ thực thể (ERD), 5 bảng | như trên — tên bảng/field trích trực tiếp bằng regex từ `backend/prisma/schema.prisma`, không gõ tay |
| `hinh-2-3-luong-ung-tuyen.png` | Sơ đồ tuần tự luồng ứng tuyển đầu-cuối | như trên — theo đúng Apply-Flow Contract của `plans/260926-1323-part-time-job-marketplace/plan.md` |
| `hinh-3-1-dang-tin.png` | Form đăng tin tuyển dụng (nhà tuyển dụng) | `chup-man-hinh.ts` (route `/nha-tuyen-dung/dang-tin`, đăng nhập employer) |
| `hinh-3-2-quan-ly-ung-vien.png` | Danh sách ứng viên của một tin, đổi trạng thái hồ sơ | như trên (route `/nha-tuyen-dung/tin/:id/ung-vien`) |
| `hinh-3-3-duyet-tin-admin.png` | Trang quản trị: tổng quan + tin chờ duyệt + danh sách người dùng | như trên (route `/quan-tri`, đăng nhập admin) |
| `hinh-3-4-thong-bao.png` | Chuông thông báo mở ra danh sách (candidate) | như trên (route `/`, đăng nhập candidate, click nút "Thông báo") |
| `hinh-3-5-ho-so-ung-vien.png` | Trang hồ sơ cá nhân candidate | như trên (route `/ho-so`, đăng nhập candidate) |

## Điều kiện để chạy lại `chup-man-hinh.ts`

1. Postgres 16 chạy ở `localhost:5432` (hoặc đổi `DATABASE_URL` trong `backend/.env`).
2. Backend đang chạy ở `:4000` (`npm run dev:backend`), frontend ở `:3000` (`npm run dev:frontend`).
3. Đã chạy `cd backend && npx ts-node prisma/seed-demo.ts` — script này idempotent, tạo/cập
   nhật đúng 3 tài khoản demo (`demo.employer@vieclamthem.local`,
   `demo.candidate1@vieclamthem.local`, `demo.candidate2@vieclamthem.local`, mật khẩu
   `Demo@12345`), 4 tin tuyển dụng (1 chờ duyệt, 3 đã duyệt), 2 hồ sơ ứng tuyển (VIEWED,
   INTERVIEW), 2 thông báo chưa đọc.
4. Dữ liệu test cũ từ các lần chạy Playwright e2e trước đó (`e2e-*@test.com`, tin tên không
   dấu kiểu `Ban hang thoi vu`) đã được dọn khỏi CSDL trước khi chụp — ảnh gốc trước khi dọn
   bị lẫn dữ liệu test không trình bày được, đã chụp lại sau khi dọn.
