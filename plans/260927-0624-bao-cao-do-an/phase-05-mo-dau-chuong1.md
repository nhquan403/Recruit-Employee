---
phase: 5
title: "Viết MỞ ĐẦU + CHƯƠNG 1. TỔNG QUAN"
status: pending
priority: P1
effort: "1d"
dependencies: [3]
---

# Phase 5: Viết MỞ ĐẦU và CHƯƠNG 1 (01-mo-dau.md, 02-chuong-1.md)

## Goal
Viết nội dung MỞ ĐẦU (lý do chọn đề tài, mục tiêu, đối tượng/phạm vi, phương pháp, bố cục
báo cáo) và CHƯƠNG 1. TỔNG QUAN (khảo sát hiện trạng, các hệ thống tương tự, vấn đề đặt ra) —
toàn bộ dựa trên phạm vi thật đã build, không thêm mục tiêu/tính năng không tồn tại trong
`plans/260926-1323-part-time-job-marketplace/plan.md`.

## Context Links
- Nguồn nội dung sản phẩm: `plans/260926-1323-part-time-job-marketplace/plan.md` (Overview,
  Scope Challenge, Tech Stack, Kept Deliberately Simple)
- Nguồn khung nội dung bắt buộc bám sát: đề cương chi tiết đã duyệt —
  `plans/260927-0624-bao-cao-do-an/nguon/de-cuong-chi-tiet-trich-xuat.txt` mục 1 (ĐẶT VẤN ĐỀ),
  mục 2 (MỤC TIÊU, Bảng mục tiêu chung/cụ thể), mục 3 (ĐỐI TƯỢNG VÀ PHẠM VI — Bảng 1 "Phạm vi
  và các lựa chọn", mục 3.3 "Những nội dung không thực hiện"), mục 4 (TỔNG QUAN TÌNH HÌNH
  NGHIÊN CỨU — Bảng 2 so sánh kênh tìm việc). MỞ ĐẦU và CHƯƠNG 1 phải khai triển đầy đủ, bằng
  lời văn báo cáo học thuật, đúng các mục này — KHÔNG chỉ tóm tắt lại ngắn như bản đề cương
  (đề cương là outline ~10 trang tổng; báo cáo thật cần MỞ ĐẦU + CHƯƠNG 1 dài hơn nhiều lần).
- Quy định hình thức: `docs/bao-cao/quy-dinh.md`
- Ảnh hệ thống tương tự dùng minh họa (nếu cần): không chụp trực tiếp TopCV/Vieclam24h (không
  phải sản phẩm của mình, không đưa ảnh chụp màn hình sản phẩm bên thứ ba vào báo cáo nộp —
  chỉ mô tả bằng văn bản, có trích dẫn IEEE nếu tham khảo tài liệu công khai của họ).

## Key Insights
- Plan gốc đã tự ghi rõ ràng buộc phạm vi ở "Scope Challenge (Step 0)": không thanh toán, không
  e-contract, không chatbot, không xác thực CMND/CCCD thật. MỞ ĐẦU/CHƯƠNG 1 phải nêu đúng các
  ràng buộc này như một quyết định phạm vi có chủ đích, không phải thiếu sót.
- "12 mục tiêu", "7 use case", "6 màn hình", "5 bảng" — bất kỳ con số nào được viết ra ở đây
  PHẢI đếm lại đúng bằng số mục thật liệt kê trong văn bản (Bước 4 kỷ luật đo đạc) — không
  chỉ tin theo trí nhớ về plan gốc, phải đếm lại từng gạch đầu dòng khi viết xong.
- Không mở đầu bằng "Trong thời đại công nghệ 4.0" hay các câu mở bài sáo rỗng khác — cấm rõ ở
  Bước 5, áp dụng ngay từ lúc viết, không chỉ khi rà soát ở Phase 10.

## Requirements
- `docs/bao-cao/01-mo-dau.md`: Lý do chọn đề tài (thực tế: nhu cầu việc làm thêm linh hoạt,
  bài toán 3 vai trò), Mục tiêu (liệt kê rõ ràng, đếm số mục tiêu thật), Đối tượng và phạm vi
  nghiên cứu (đúng theo Scope Challenge của plan gốc — nêu cả những gì KHÔNG làm), Phương pháp
  thực hiện (công nghệ + quy trình phát triển thật đã dùng), Bố cục báo cáo (tóm tắt 5 chương).
- `docs/bao-cao/02-chuong-1.md`: Khảo sát hiện trạng (thị trường việc làm thời vụ, các nền
  tảng tương tự — TopCV, Vieclam24h, Instawork, Wonolo — mô tả bằng lời, có trích dẫn IEEE tới
  trang chủ/tài liệu công khai của họ, KHÔNG chèn ảnh chụp màn hình sản phẩm của họ), Phân tích
  ưu/nhược điểm hiện trạng, Vấn đề đặt ra cho đồ án, Giải pháp đề xuất ở mức tổng quan (chi
  tiết kỹ thuật để dành Chương 2/3).
- Mọi trích dẫn dùng định dạng IEEE `[n]` đúng theo mẫu PDF quy định (trích nguyên văn 3 ví dụ
  đã đọc từ PDF trong `quy-dinh.md`) — số thứ tự `[n]` khớp với danh mục tài liệu tham khảo sẽ
  hoàn thiện ở Phase 8.

## Related Code Files
- Create: `docs/bao-cao/01-mo-dau.md`
- Create: `docs/bao-cao/02-chuong-1.md`
- Read (không sửa): `plans/260926-1323-part-time-job-marketplace/plan.md`, `docs/bao-cao/quy-dinh.md`

## Implementation Steps
1. Liệt kê Mục tiêu dạng gạch đầu dòng, đếm ngay khi viết xong — ghi số mục tiêu thật vào
   Todo List bên dưới để đối chiếu ở Phase 10 (không được đổi số này ở nơi khác của báo cáo).
2. Viết Đối tượng và phạm vi — copy ý đúng từ "Scope Challenge" và "Kept Deliberately Simple"
   của plan gốc, diễn đạt lại bằng văn phong báo cáo học thuật (không copy-paste nguyên văn
   tiếng Anh kỹ thuật của plan vào báo cáo).
3. Viết Phương pháp thực hiện — nêu đúng tech stack thật (Next.js 16, NestJS 11, Prisma 6,
   PostgreSQL, JWT, Docker) với version thật đã pin, kèm lý do pin version nếu muốn (đã có sẵn
   lý do thật trong "Tech Stack" của plan gốc, không cần bịa thêm).
4. Viết Chương 1 — với mỗi hệ thống tham khảo, thêm 1 trích dẫn IEEE `[n]` trỏ tới nguồn công
   khai thật (trang chủ sản phẩm) — để trống số trang tài liệu tham khảo nếu không xác định
   được (không bịa).
5. Đếm lại toàn bộ số liệu đã khẳng định trong 2 file (số mục tiêu, số nền tảng tham khảo, số
   vai trò) — ghi log các con số này để Phase 10 đối chiếu chéo với các chương khác.

## Todo List
- [ ] MỞ ĐẦU viết xong, số mục tiêu đã đếm và ghi lại: ___ mục tiêu
- [ ] CHƯƠNG 1 viết xong, số hệ thống tham khảo đã đếm: ___ hệ thống, đều có trích dẫn `[n]`
- [ ] Không có câu mở bài sáo rỗng ("trong thời đại công nghệ 4.0" hoặc tương đương)
- [ ] Không chèn ảnh chụp sản phẩm bên thứ ba

## Success Criteria
- Mọi con số trong 2 file này (mục tiêu, hệ thống tham khảo, vai trò) khớp chính xác với số
  gạch đầu dòng/mục thật đếm được trong cùng file — không lệch giữa lời văn và danh sách.
- Không có khẳng định tính năng nào không tồn tại trong plan gốc.

## Risk Assessment
- **Rủi ro:** liệt kê mục tiêu nhưng viết số khác trong câu dẫn (VD: "có 5 mục tiêu chính"
  nhưng liệt kê 6 gạch đầu dòng) — đúng lỗi người dùng từng gặp (13 so với 17). **Giảm thiểu:**
  bước 5 (đếm lại) là bắt buộc trước khi đánh dấu phase này xong.
- **Rủi ro:** trích dẫn IEEE tới nguồn không thật hoặc thông tin trích dẫn bịa (tên tác giả,
  năm xuất bản không có thật) — gian lận học thuật. **Giảm thiểu:** chỉ trích dẫn trang chủ
  chính thức của sản phẩm tham khảo (URL thật, ngày truy cập thật), không bịa tác giả/bài báo
  không tồn tại.

## Security Considerations
- Không áp dụng.

## Next Steps
- Phase 6 (Chương 2) tiếp nối ngay sau, dùng chung danh sách trích dẫn `[n]` đang được tích
  lũy — Phase 8 sẽ tổng hợp toàn bộ vào danh mục tài liệu tham khảo cuối bài.
