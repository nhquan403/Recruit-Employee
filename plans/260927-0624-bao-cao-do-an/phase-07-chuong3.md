---
phase: 7
title: "Viết CHƯƠNG 3. HIỆN THỰC HÓA NGHIÊN CỨU"
status: completed
priority: P1
effort: "1.5d"
dependencies: [3, 6]
---

# Phase 7: Viết CHƯƠNG 3 (chia 2 file 04a/04b theo kiến trúc đã định)

## Goal
Viết chương trọng tâm nhất của báo cáo (thường chiếm 40-50% tổng số trang nội dung): kiến trúc
hệ thống, thiết kế CSDL, và mô tả cài đặt từng chức năng thật, minh họa bằng đúng ảnh đã chụp ở
Phase 3. Chia thành `04a-chuong-3-kien-truc.md` (kiến trúc + CSDL + thiết kế) và
`04b-chuong-3-cai-dat.md` (cài đặt chi tiết từng use case + giao diện) theo đúng kiến trúc thư
mục đã chốt ở `plan.md`.

## Context Links
- Ảnh minh họa: `docs/images/bao-cao/README.md` (Phase 3) — dùng đúng 11 ảnh đã có, không thêm
  placeholder ảnh chưa tồn tại.
- Lý thuyết áp dụng: `docs/bao-cao/03-chuong-2.md` (Phase 6)
- Khung nội dung bắt buộc bám sát: đề cương chi tiết —
  `plans/260927-0624-bao-cao-do-an/nguon/de-cuong-chi-tiet-trich-xuat.txt`:
  - mục 6 (NỘI DUNG VÀ PHƯƠNG PHÁP NGHIÊN CỨU: quy trình Agile rút gọn 6.1, thu thập/phân
    tích yêu cầu 6.2, Bảng 3 vai trò-quyền hạn 6.3, Bảng 4 các bảng CSDL 6.4, công cụ/môi
    trường 6.5) → dùng cho `04a-chuong-3-kien-truc.md`.
  - mục 7 (THIẾT KẾ HỆ THỐNG: use case tổng quát 7.1, Bảng 5 danh sách UC01-07 7.2, quy trình
    ứng tuyển 7.3, kế hoạch kiểm thử 7.4) → dùng cho `04a` (thiết kế) và `04b` (áp dụng vào
    từng use case thật).
  - mục 8 (THIẾT KẾ GIAO DIỆN: Bảng 6 chức năng theo vai trò 8.1, màn hình chính 8.2, luồng sử
    dụng tiêu biểu 8.3, Bảng 7 công nghệ triển khai 8.4) → dùng cho `04b` (giao diện + ảnh).
  - Bảng UC01-07 trong đề cương (mục 7.2) khớp gần như nguyên văn với bảng "Use Case → Phase
    Map" của `plans/260926-1323-part-time-job-marketplace/plan.md` — dùng đúng 7 mã UC01-07
    này xuyên suốt 04a/04b, không đặt mã use case khác.
- Nguồn kỹ thuật thật: `backend/prisma/schema.prisma`, `backend/src/`, `frontend/src/`,
  `plans/260926-1323-part-time-job-marketplace/phase-*.md` (toàn bộ 8 phase file đã Completed)

## Key Insights
- Đây là chương dễ "phồng trang giả" nhất nếu mô tả lan man không kèm chứng cứ — mọi khẳng
  định về chức năng phải trỏ tới đúng file/route/API thật (VD: "API `POST /applications` tạo
  Application với status PENDING" phải đúng với code thật trong `backend/src/`).
- Ảnh dùng theo placeholder `[Hình X.Y]` — chú thích tự động lấy từ câu dẫn "Hình X.Y thể hiện
  ..." ngay trước đó trong văn bản (theo cơ chế Phase 2 mô tả) — nghĩa là câu dẫn PHẢI tồn tại
  đúng cú pháp này ngay trước mỗi placeholder, nếu không script sẽ không tìm được chú thích.
- Bảng trong chương này (VD: bảng API endpoint, bảng cấu trúc CSDL) phải dùng cú pháp Markdown
  chuẩn có dòng phân cách `---`/`:---:`/`---:` đúng để `docx_builder.py` (Phase 2) đọc được
  căn lề cột.
- Số trang ước tính cho riêng chương này: đây là chương dài nhất, cần chiếm phần lớn trong
  tổng ~45 trang nội dung (30-50 trang theo trần đã đọc từ PDF, phần này KHÔNG áp dụng trực
  tiếp — trần trong PDF của trường này là con số cần lấy lại đúng nguyên văn từ `quy-dinh.md`,
  không dùng lại con số 30-50 trang của quy định Trà Vinh tham khảo).

## Requirements

### 04a-chuong-3-kien-truc.md
- Kiến trúc tổng quan hệ thống — dùng `[Hình 2.1]` (đã sinh ở Phase 3).
- Thiết kế CSDL — ERD `[Hình 2.2]`, kèm bảng mô tả từng bảng (tên, field, kiểu dữ liệu, ràng
  buộc) copy chính xác từ `schema.prisma`, không viết lại field tự suy diễn.
- Thiết kế API tổng quan — bảng liệt kê endpoint chính theo module (auth, jobs, applications,
  notifications, admin) — đối chiếu đúng route thật trong `backend/src/*/*.controller.ts`.
- Luồng ứng tuyển chi tiết — `[Hình 2.3]` (sequence diagram), mô tả từng bước đúng
  "Apply-Flow Contract" của plan gốc.

### 04b-chuong-3-cai-dat.md
- Cài đặt xác thực & RBAC — tham chiếu Chương 2, không lặp lại lý thuyết, chỉ mô tả áp dụng
  thật (guard nào, decorator nào).
- Cài đặt từng use case (UC01-UC07 theo bảng "Use Case → Phase Map" của plan gốc) — mỗi use
  case: mô tả luồng, ảnh minh họa tương ứng (`[Hình 1.x]`/`[Hình 3.x]` từ Phase 3), đoạn code
  tiêu biểu nếu cần (ngắn, thật, copy từ file thật kèm đường dẫn file:dòng).
- Giao diện — với mỗi ảnh nhóm 1 còn lại chưa dùng ở trên, chèn kèm câu dẫn + chú thích.
- Mỗi hình PHẢI có dòng "Nguồn: chụp từ hệ thống" (screenshot) hoặc "Nguồn: tự vẽ dựa trên
  [schema.prisma/docker-compose.yml]" (sơ đồ) — đúng yêu cầu Bước 2 của người dùng.

## Related Code Files
- Create: `docs/bao-cao/04a-chuong-3-kien-truc.md`
- Create: `docs/bao-cao/04b-chuong-3-cai-dat.md`
- Read (không sửa): toàn bộ `backend/src/`, `backend/prisma/schema.prisma`, `frontend/src/`,
  `docs/images/bao-cao/README.md`, 8 phase file của plan gốc.

## Implementation Steps
1. Liệt kê trước danh sách hình sẽ dùng trong chương này (11 ảnh từ Phase 3), phân bổ hình nào
   vào 04a, hình nào vào 04b — không hình nào bị bỏ sót, không hình nào dùng 2 lần với 2 số thứ
   tự khác nhau.
2. Viết 04a trước (kiến trúc/CSDL) — mở `schema.prisma` song song, copy chính xác tên bảng/field.
3. Viết bảng API endpoint — mở từng `*.controller.ts` thật, liệt kê đúng method + route + mô
   tả ngắn, không suy đoán route chưa xác nhận trong code.
4. Viết 04b theo từng use case UC01-UC07 — với mỗi use case, viết câu dẫn có cú pháp
   "Hình X.Y thể hiện ..." ngay trước placeholder `[Hình X.Y]` tương ứng.
5. Đối chiếu: mọi ảnh trong `docs/images/bao-cao/README.md` phải xuất hiện ít nhất 1 lần trong
   04a hoặc 04b; mọi placeholder `[Hình X.Y]` trong 04a/04b phải có ảnh thật tương ứng trong
   README — chạy đối chiếu 2 chiều bằng tay hoặc script nhỏ trước khi đóng phase.
6. Kiểm tra mọi bảng Markdown có dòng phân cách đúng cú pháp căn lề.

## Todo List
- [ ] 04a viết xong: kiến trúc, CSDL (đúng schema thật), API tổng quan, luồng ứng tuyển
- [ ] 04b viết xong: xác thực/RBAC áp dụng, đủ 7 use case, giao diện
- [ ] Đối chiếu 2 chiều ảnh ↔ placeholder hoàn tất, không thiếu không thừa
- [ ] Mỗi hình có dòng "Nguồn:" đúng loại (chụp hệ thống / tự vẽ)
- [ ] Mọi bảng Markdown có dòng phân cách căn lề hợp lệ

## Success Criteria
- Không có khẳng định kỹ thuật nào (route, field, guard) không đối chiếu được với code thật.
- Đối chiếu ảnh ↔ placeholder khớp 100% (script Phase 2 sẽ báo lỗi nếu placeholder trỏ tới
  ảnh không tồn tại — mục tiêu là không để lỗi này xảy ra khi xuất bản ở Phase 9).

## Risk Assessment
- **Rủi ro lớn nhất của toàn báo cáo:** mô tả sai lệch code thật (do viết theo trí nhớ về plan
  thay vì mở lại file). **Giảm thiểu:** bước 2-3 bắt buộc mở file thật song song, không viết
  từ trí nhớ về nội dung plan gốc.
- **Rủi ro:** câu dẫn chú thích hình sai cú pháp khiến script Phase 9 không tự lấy được chú
  thích, phải rà lại toàn chương. **Giảm thiểu:** thống nhất mẫu câu cố định "Hình X.Y thể
  hiện ..." áp dụng nhất quán, kiểm bằng grep trước khi đóng phase.

## Security Considerations
- Đoạn code trích dẫn trong báo cáo không được chứa secret thật (JWT secret, DB password) dù
  là trong file `.env.example` — chỉ trích đoạn logic, không trích giá trị cấu hình nhạy cảm.

## Next Steps
- Phase 8 viết Chương 4 (Kiểm thử/Đánh giá — dùng lại số liệu test thật), Chương 5 (Kết luận),
  Tài liệu tham khảo (tổng hợp toàn bộ `[n]` đã tích lũy từ Chương 1-3), và Phụ lục.
