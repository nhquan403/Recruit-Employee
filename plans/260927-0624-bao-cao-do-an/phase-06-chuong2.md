---
phase: 6
title: "Viết CHƯƠNG 2. NGHIÊN CỨU LÝ THUYẾT"
status: pending
priority: P1
effort: "1d"
dependencies: [5]
---

# Phase 6: Viết CHƯƠNG 2. NGHIÊN CỨU LÝ THUYẾT (03-chuong-2.md)

## Goal
Trình bày nền tảng lý thuyết/công nghệ thật sự được dùng để xây dựng hệ thống — không viết một
chương lý thuyết chung chung tách rời khỏi lựa chọn kỹ thuật thật của dự án. Mỗi công nghệ nêu
ra phải có mặt thật trong `package.json`/`backend`/`frontend`, kèm công thức/khái niệm kỹ
thuật liên quan khi có (băm mật khẩu, JWT, chuẩn hóa quan hệ CSDL).

## Context Links
- Danh sách công nghệ thật: `plans/260926-1323-part-time-job-marketplace/plan.md` (Tech Stack)
- Khung nội dung bắt buộc bám sát: đề cương chi tiết —
  `plans/260927-0624-bao-cao-do-an/nguon/de-cuong-chi-tiet-trich-xuat.txt` mục 5.1-5.6 (kiến
  trúc client-server, REST API, framework front-end/back-end, CSDL quan hệ và ORM, xác thực
  JWT/RBAC, tìm kiếm-lọc-thông báo) — 6 mục con của Chương 2 trong file này ánh xạ 1:1 với 6
  mục con đã liệt kê ở Requirements, khai triển đầy đủ hơn bản đề cương, không chỉ diễn giải
  lại nguyên câu ngắn.
- Chi tiết cài đặt để đối chiếu lý thuyết ↔ thực hành: `backend/src/auth/`,
  `backend/prisma/schema.prisma`
- Quy định trích dẫn IEEE: `docs/bao-cao/quy-dinh.md`; 12 tài liệu tham khảo đã có sẵn trong
  đề cương (mục 12 của file trích xuất trên) — ưu tiên dùng lại các nguồn này khi trích dẫn
  NestJS/Next.js/PostgreSQL/Prisma/JWT/OWASP, không tự tìm nguồn khác cho cùng một khái niệm
  đã có sẵn trích dẫn thật trong đề cương.

## Key Insights
- Chương lý thuyết trong đồ án cấp trường thường bị viết lan man, sao chép
  Wikipedia — rủi ro "giọng văn AI" cao nhất nằm ở chương này. Phải neo mọi đoạn lý thuyết vào
  một quyết định thiết kế cụ thể của dự án (VD: nói về bcrypt vì dự án dùng bcrypt, không nói
  chung chung về "các thuật toán băm phổ biến").
- Công thức kỹ thuật hợp lệ để đưa vào (không bịa để "cho có công thức"): độ phức tạp thời gian
  của thuật toán băm bcrypt (hàm work factor `2^cost`), công thức tính độ phức tạp truy vấn
  phân trang (`OFFSET`/`LIMIT`) nếu bàn về tối ưu tìm kiếm, cấu trúc JWT (`header.payload.signature`,
  HMAC-SHA256). Đây đều là kiến thức chuẩn ngành, không phải số liệu đo đạc của riêng dự án nên
  không cần "đếm lại bằng máy" như Bước 4 yêu cầu với số liệu dự án — nhưng vẫn phải trích dẫn
  nguồn IEEE cho từng khái niệm không hiển nhiên.
- Công thức trình bày bằng ảnh render từ matplotlib mathtext (theo kiến trúc Phase 2) hoặc
  Unicode có định dạng — quyết định cụ thể (ảnh riêng hay text) để ở Phase 2/9 lúc build script,
  phase này chỉ cần viết đúng cú pháp Markdown công thức mà `markdown_parser.py` sẽ nhận diện
  (thống nhất cú pháp: `$$...$$` cho công thức khối, ghi rõ trong `docs/bao-cao/README.md`).

## Requirements
- `docs/bao-cao/03-chuong-2.md` gồm các mục con tương ứng đúng những công nghệ/kỹ thuật THẬT
  đã dùng, tối thiểu:
  1. Kiến trúc ứng dụng web hiện đại (SPA/SSR, REST API) — lý do chọn Next.js App Router.
  2. NestJS và kiến trúc module/dependency injection — lý do chọn cho backend có RBAC.
  3. PostgreSQL và Prisma ORM — mô hình quan hệ, migration.
  4. Xác thực JWT + băm mật khẩu bcrypt — kèm công thức/cấu trúc kỹ thuật liên quan.
  5. Kiểm soát truy cập theo vai trò (RBAC) — mô hình 3 vai trò của dự án.
  6. (Nếu Chương 3 cần) Cơ chế polling cho thông báo — so sánh ngắn gọn với WebSocket, lý do
     chọn polling cho MVP (đã có sẵn lý do thật trong plan gốc).
- Mỗi mục có ít nhất 1 trích dẫn IEEE `[n]` tới tài liệu chính thức (docs.nestjs.com,
  nextjs.org/docs, prisma.io/docs, jwt.io, RFC liên quan nếu trích chuẩn IETF) — không trích
  dẫn blog cá nhân không rõ tác giả làm nguồn duy nhất cho một khái niệm nền tảng.

## Related Code Files
- Create: `docs/bao-cao/03-chuong-2.md`
- Read (không sửa): `backend/src/auth/*`, `backend/prisma/schema.prisma`,
  `plans/260926-1323-part-time-job-marketplace/plan.md`

## Implementation Steps
1. Với mỗi công nghệ, mở đúng file cài đặt thật trong repo trước khi viết đoạn lý thuyết tương
   ứng (VD: mở `backend/src/auth/` để xác nhận cơ chế guard thật trước khi viết đoạn RBAC).
2. Viết công thức/khái niệm kỹ thuật bằng cú pháp `$$...$$` (khối) hoặc `$...$` (inline) —
   thống nhất một cú pháp duy nhất xuyên suốt toàn bộ `docs/bao-cao/`.
3. Thêm trích dẫn `[n]` liên tục từ số tiếp theo sau Chương 1 (không đánh số lại từ 1).
4. Đọc lại toàn chương, xóa mọi đoạn lý thuyết không neo được vào một quyết định thiết kế thật
   của dự án (dấu hiệu: đoạn văn không nhắc tên biến/file/module nào trong repo).

## Todo List
- [ ] Đủ 5-6 mục lý thuyết, mỗi mục neo vào code thật (đã mở file xác nhận trước khi viết)
- [ ] Có ít nhất 1 công thức/cấu trúc kỹ thuật trình bày đúng cú pháp `$$...$$`
- [ ] Mỗi mục có ≥1 trích dẫn IEEE `[n]` tới nguồn chính thức
- [ ] Không có đoạn lý thuyết "trôi nổi" không liên hệ dự án

## Success Criteria
- Mọi khái niệm nêu trong chương này xuất hiện lại (được áp dụng) ở Chương 3 — không có lý
  thuyết "cho đủ trang" rồi không dùng tới.
- Số thứ tự trích dẫn `[n]` tiếp nối đúng thứ tự xuất hiện, không trùng/nhảy số so với Chương 1.

## Risk Assessment
- **Rủi ro:** copy nguyên đoạn giải thích JWT/bcrypt từ tài liệu chính thức mà không diễn đạt
  lại — đạo văn. **Giảm thiểu:** viết lại bằng lời riêng, chỉ trích dẫn `[n]` cho ý tưởng/số
  liệu, không copy nguyên câu.
- **Rủi ro:** bịa số liệu benchmark (VD: "bcrypt nhanh hơn X% so với MD5") không có nguồn thật.
  **Giảm thiểu:** chỉ nêu tính chất định tính (one-way, salted) trừ khi có nguồn IEEE thật cho
  con số định lượng.

## Security Considerations
- Đoạn viết về bcrypt/JWT là mô tả kỹ thuật học thuật, không phải hướng dẫn khai thác — giữ
  đúng mục đích trình bày kiến thức nền, không viết thành hướng dẫn bypass xác thực.

## Next Steps
- Phase 7 (Chương 3) áp dụng trực tiếp các khái niệm chương này vào mô tả kiến trúc/cài đặt
  thật, dùng chung mạch trích dẫn `[n]`.
