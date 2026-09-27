---
phase: 3
title: "Sinh tài sản hình ảnh thật"
status: pending
priority: P1
effort: "1d"
dependencies: []
---

# Phase 3: Sinh tài sản hình ảnh thật

## Goal
Tạo toàn bộ file ảnh `.png` sẽ được nhúng vào báo cáo — screenshot thật chụp từ ứng dụng
Việc Làm Thêm đang chạy, và sơ đồ kiến trúc/ERD/tuần tự vẽ từ đúng schema/luồng đã cài đặt
trong repo. Không dùng ảnh giữ chỗ (placeholder), không vẽ sơ đồ tưởng tượng khác với code
thật. Mỗi ảnh phải truy được nguồn: chụp màn hình thật (ghi lại thao tác tạo ra nó) hoặc sinh
từ script (ghi lại script/nguồn dữ liệu).

## Context Links
- Quy ước đặt tên & vị trí: `./plan.md` (mục Kiến trúc thư mục)
- Schema/luồng cần vẽ: `plans/260926-1323-part-time-job-marketplace/plan.md` (Database Schema,
  Apply-Flow Contract), `backend/prisma/schema.prisma`
- Sơ đồ kiến trúc gốc trong đề cương (tham khảo bố cục, KHÔNG dùng nguyên vì đã lỗi thời so
  với cài đặt thật — xem "Điều đã sửa lại" trong `./plan.md`): `./nguon/de-cuong-hinh-2.png`
- Playwright đã dùng thành công trong dự án gốc ở Phase 8 của plan Việc Làm Thêm (screenshot
  responsive audit) — tái dùng đúng cấu hình đó, không dựng lại từ đầu.

## Key Insights
- Ứng dụng cần đang **chạy thật** (backend + frontend + Postgres có dữ liệu mẫu) để chụp được
  screenshot thật — đây là điều kiện tiên quyết, không phải tùy chọn.
- Theo `.claude/rules/process-management.md`: trước khi khởi động `docker compose up` hay
  `npm run dev`, phải kiểm tra cổng 3000/3001/5432 (hoặc cổng đã cấu hình) chưa bị chiếm bởi
  tiến trình orphan từ phiên trước; dùng đúng tiến trình đã khởi động, tắt nó khi phase này
  xong (không để chạy nền qua các phase sau nếu không còn cần).
- Sơ đồ kiến trúc/ERD/tuần tự KHÔNG chụp màn hình từ công cụ vẽ tay — sinh từ mô tả văn bản
  (Mermaid/PlantUML hoặc script Python) để có thể tái tạo lại giống hệt nếu schema đổi, và để
  không lệch với code thật theo thời gian.
- Đồ án cơ sở ngành không có yêu cầu "mỗi hình phải có dòng Nguồn" trong PDF gốc (khác quy
  định Trà Vinh ở lượt trước) — nhưng người dùng đã tự yêu cầu điều này ở Bước 2 của chỉ dẫn,
  nên đây là yêu cầu của **người dùng cho quy trình**, áp dụng dù PDF trường không bắt buộc.

## Requirements

### Nhóm 1 — Screenshot thật từ ứng dụng đang chạy
Dùng Playwright (đã cấu hình `executablePath` riêng cho sandbox trong lượt trước:
`/opt/pw-browsers/chromium` theo tài liệu môi trường hiện tại — kiểm tra lại đường dẫn thật
tại thời điểm chạy, vì tên thư mục Chromium có thể đổi theo version).

| # | File | Màn hình chụp | Vai trò cần đăng nhập |
|---|---|---|---|
| 1 | `hinh-1-1-trang-chu.png` | Trang chủ / danh sách tin | Khách hoặc candidate |
| 2 | `hinh-1-2-tim-kiem-loc.png` | Tìm kiếm + bộ lọc kết quả | candidate |
| 3 | `hinh-1-3-chi-tiet-tin.png` | Trang chi tiết một tin tuyển dụng | candidate |
| 4 | `hinh-3-1-dang-tin.png` | Form đăng tin (employer) | employer |
| 5 | `hinh-3-2-quan-ly-ung-vien.png` | Danh sách ứng viên của một tin | employer |
| 6 | `hinh-3-3-duyet-tin-admin.png` | Trang duyệt tin chờ admin | admin |
| 7 | `hinh-3-4-thong-bao.png` | Chuông thông báo mở ra danh sách | candidate hoặc employer |
| 8 | `hinh-3-5-ho-so-ung-vien.png` | Trang hồ sơ candidate | candidate |

Số lượng và tên chính xác sẽ khớp lại với nội dung Chương 3 ở Phase 7 — danh sách này là đề
xuất ban đầu bám theo 6 màn hình + apply-flow đã liệt kê trong plan gốc; nếu Phase 7 cần thêm
hoặc bớt ảnh khi viết, quay lại phase này bổ sung, không tự chèn ảnh chưa có trong bảng
`README.md`.

### Nhóm 2 — Sơ đồ kỹ thuật (sinh từ mô tả, không chụp tay)
| # | File | Nội dung | Nguồn dựng |
|---|---|---|---|
| 9 | `hinh-2-1-kien-truc-tong-quan.png` | Sơ đồ khối FE/BE/DB/Docker | Vẽ tay bằng script (matplotlib/graphviz) dựa trên `docker-compose.yml` thật — **KHÔNG copy nguyên sơ đồ trong đề cương** (`plans/260927-0624-bao-cao-do-an/nguon/de-cuong-hinh-2.png`): sơ đồ đó vẽ "Dịch vụ thông báo (WebSocket / email)", nhưng hệ thống thật cài đặt DB-backed polling, không dùng WebSocket lẫn email — vẽ lại đúng cơ chế polling thật, có thể giữ bố cục tổng thể tương tự cho dễ đối chiếu |
| 10 | `hinh-2-2-erd.png` | ERD 5 bảng (User/Job/Application/Profile/Notification) | Sinh từ `backend/prisma/schema.prisma` bằng `prisma-erd-generator` nếu cài được, hoặc vẽ tay đúng field/quan hệ đọc trực tiếp từ file schema |
| 11 | `hinh-2-3-luong-ung-tuyen.png` | Sequence diagram luồng apply → notify → review → notify-back | Vẽ từ đúng "Apply-Flow Contract" trong plan gốc, không thêm bước không có trong code |

### Ràng buộc chung
- Mọi ảnh xuất ra `.png`, độ phân giải đủ đọc khi in (tối thiểu 1280px chiều ngang cho
  screenshot, vector-to-raster ở DPI ≥150 cho sơ đồ).
- Mỗi ảnh có đúng một dòng trong `docs/images/bao-cao/README.md`: tên file, mô tả, cách tạo
  (lệnh Playwright cụ thể hoặc script sơ đồ dùng), ngày tạo.
- Không chỉnh sửa nội dung giao diện thật để "đẹp hơn" (không ẩn lỗi, không giả dữ liệu demo
  khác với seed data thật của dự án) — ảnh phải phản ánh đúng sản phẩm đã build.

## Architecture / Related Code Files
- Create: `docs/images/bao-cao/*.png` (11 file theo bảng trên)
- Create: `docs/images/bao-cao/README.md`
- Create: `scripts/bao_cao_hinh/chup-man-hinh.ts` (hoặc `.js`) — script Playwright điều khiển
  bằng CLI, nhận danh sách route + vai trò đăng nhập, xuất theo đúng tên file quy ước.
- Create: `scripts/bao_cao_hinh/ve-so-do.py` — script sinh 3 sơ đồ kỹ thuật.
- Read (không sửa): `backend/prisma/schema.prisma`, `docker-compose.yml`,
  `plans/260926-1323-part-time-job-marketplace/plan.md`.

## Implementation Steps
1. Kiểm tra cổng 3000 (frontend) / 3001 (backend, hoặc cổng thật đã cấu hình) / 5432
   (Postgres) — nếu có tiến trình orphan từ phiên trước đang giữ cổng, dừng nó trước; nếu
   chưa có gì chạy, khởi động bằng `docker compose up -d` hoặc `npm run dev` (workspace).
   Ghi lại PID/cổng đã dùng.
2. Seed dữ liệu mẫu đủ để mỗi screenshot có nội dung thật (ít nhất: 1 tin đang chờ duyệt, 1
   tin đã duyệt có ứng viên, 1 thông báo chưa đọc) — dùng lại `npm run seed` nếu script seed
   đã có từ dự án gốc; nếu seed hiện tại không tạo đủ các trạng thái này, mở rộng seed script
   tối thiểu cho đủ, không login thủ công nhập tay từng lần.
3. Viết `chup-man-hinh.ts`: đăng nhập bằng JWT có sẵn (gọi thẳng API login lấy token, set
   `localStorage`/cookie qua `page.evaluate` hoặc `context.addCookies`, KHÔNG click qua form
   login mỗi lần — nhanh và ổn định hơn), điều hướng route, `page.screenshot()` xuất đúng tên.
4. Chạy script, kiểm tra 8 ảnh nhóm 1 sinh ra đúng kích thước, đúng nội dung (mở thử bằng
   `Read` tool để xem hình).
5. Viết `ve-so-do.py` cho 3 sơ đồ nhóm 2 — đọc trực tiếp field/quan hệ từ
   `backend/prisma/schema.prisma` bằng regex/parser đơn giản cho ERD, không gõ tay danh sách
   field (tránh lệch nếu schema đổi sau này).
6. Chạy script sơ đồ, kiểm tra 3 ảnh xuất ra đúng, đối chiếu bằng mắt với schema thật.
7. Viết `docs/images/bao-cao/README.md` — bảng 11 dòng như yêu cầu.
8. Dừng mọi tiến trình dev/docker đã khởi động riêng cho phase này nếu không còn phase nào
   khác trong quy trình này cần app đang chạy (Phase 7 viết Chương 3 chỉ cần ảnh đã có, không
   cần app chạy lại) — tuân theo `process-management.md`: không để tiến trình chạy nền mồ côi.

## Todo List
- [ ] Xác nhận không có tiến trình dev/docker orphan chiếm cổng trước khi khởi động
- [ ] Seed dữ liệu đủ trạng thái cho 8 screenshot
- [ ] 8 ảnh nhóm 1 (screenshot) sinh ra, mở kiểm tra bằng mắt
- [ ] 3 ảnh nhóm 2 (sơ đồ) sinh ra, đối chiếu đúng schema/luồng thật
- [ ] `docs/images/bao-cao/README.md` đủ 11 dòng, mỗi dòng có cách tạo lại được
- [ ] Tiến trình dev/docker khởi động riêng cho phase này đã được dừng

## Success Criteria
- Toàn bộ 11 file `.png` tồn tại đúng tên trong `docs/images/bao-cao/`, mở được, không rỗng.
- Không có tiến trình nào của phase này còn chạy sau khi phase kết thúc (kiểm bằng `ps`/`lsof`
  trên cổng đã dùng).
- ERD khớp 100% với `schema.prisma` thật (đối chiếu tên bảng, field, khóa ngoại).

## Risk Assessment
- **Rủi ro:** Playwright `executablePath` sai đường dẫn nếu version Chromium khác thời điểm
  trước → **Giảm thiểu:** kiểm tra `ls /opt/pw-browsers/` trước khi chạy, không copy nguyên
  đường dẫn cũ nếu thư mục đã đổi tên.
- **Rủi ro:** seed data không đủ trạng thái (VD: không có tin nào "chờ duyệt" để chụp màn hình
  admin) → **Giảm thiểu:** kiểm tra DB thật qua Prisma Studio hoặc query trước khi chụp, không
  giả định seed cũ đã đủ.
- **Rủi ro:** để tiến trình `npm run dev`/`docker compose` chạy nền quên tắt, lặp lại lỗi mà
  `process-management.md` cảnh báo → **Giảm thiểu:** bước 8 là bắt buộc, không tùy chọn.

## Security Considerations
- Không chụp màn hình chứa token/password thật hiện rõ trên UI (kiểm tra DevTools/URL bar
  không lộ JWT trong ảnh chụp toàn màn hình nếu trình duyệt hiển thị address bar).
- Dữ liệu seed dùng cho ảnh phải là dữ liệu giả lập, không phải thông tin cá nhân thật.

## Next Steps
- Phase 5, 6, 7 (viết nội dung các chương) tham chiếu trực tiếp các file ảnh này qua placeholder
  `[Hình X.Y]` trong Markdown — không tạo thêm ảnh mới ở các phase đó; nếu thiếu ảnh, quay lại
  bổ sung ở đây.
