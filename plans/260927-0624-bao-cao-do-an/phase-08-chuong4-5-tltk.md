---
phase: 8
title: "Viết CHƯƠNG 4 (Kết quả nghiên cứu), CHƯƠNG 5, Tài liệu tham khảo, Phụ lục"
status: completed
priority: P1
effort: "1d"
dependencies: [7]
---

# Phase 8: Viết phần còn lại của nội dung (05, 06, 07, 08a/08b)

## Goal
Hoàn tất toàn bộ nội dung Markdown còn lại: CHƯƠNG 4. KẾT QUẢ NGHIÊN CỨU (tên chương đúng
nguyên văn PDF — "kết quả đạt được, có thể đánh giá hiệu năng/UX/giao diện"; kết quả kiểm thử
tự động là một phần bằng chứng cho chương này, không phải tên chương), CHƯƠNG 5. KẾT LUẬN VÀ
HƯỚNG PHÁT TRIỂN, Tài liệu tham khảo (IEEE, sắp xếp đúng theo yêu cầu thật của PDF — xem Key
Insights), và Phụ lục. Đây là phase cuối cùng tạo ra nội dung — sau phase này, toàn bộ 08 file
Markdown trong `docs/bao-cao/` (00 đến 08b) phải hoàn chỉnh và sẵn sàng cho Phase 9 xuất bản thật.

## Context Links
- Số liệu kiểm thử thật: `plans/260926-1323-part-time-job-marketplace/plan.md` (Completion
  Summary), và kết quả chạy `npm run test` / `npm run test:e2e` thật tại thời điểm viết (không
  dùng số liệu cũ nếu test suite đã đổi từ lúc đó).
- Chỉ tiêu định lượng phải đối chiếu: đề cương chi tiết mục 10.2 (Bảng 9) — xem bảng đầy đủ đã
  trích lại trong `plan.md` (mục "Nguồn tham chiếu thứ hai"): tối thiểu 6/7 use case, tải
  trang chủ ≤3s, ≥90% kịch bản kiểm thử pass, dùng được trên điện thoại. CHƯƠNG 4 phải nêu rõ
  từng chỉ tiêu này đã đạt/chưa đạt bằng số liệu thật, không đặt chỉ tiêu khác.
- Kết luận/hướng phát triển phải đối chiếu: đề cương mục 11 (đoạn cuối, sau Bảng 10) đã liệt
  kê sẵn 4 hướng phát triển dự kiến (app di động, gợi ý việc làm theo lịch sử tìm kiếm, xác
  thực danh tính, đánh giá hai chiều ứng viên-nhà tuyển dụng) — CHƯƠNG 5 dùng lại đúng 4 hướng
  này làm khung, có thể bổ sung thêm hướng khác nếu có nhưng không được bỏ sót 4 hướng đã đề
  xuất trong đề cương đã duyệt.
- Toàn bộ trích dẫn `[n]` tích lũy từ Chương 1-3 (Phase 5-7).
- Danh mục tài liệu tham khảo: đề cương đã có sẵn ĐÚNG 12 tài liệu thật (mục 12 của
  `plans/260927-0624-bao-cao-do-an/nguon/de-cuong-chi-tiet-trich-xuat.txt`) — đây là danh mục
  gốc phải dùng lại nguyên văn (tên tác giả, năm, NXB, URL), chỉ bổ sung thêm mục mới nếu
  Chương 1-3 trích dẫn nguồn nào ngoài 12 mục này. Không tự bịa thêm dữ liệu cho 12 mục đã có.
- Danh mục tài liệu tham khảo phải tuân IEEE + không bịa dữ liệu (Bước 4 và Bước 6 của
  chỉ dẫn gốc).

## Key Insights
- Số liệu kiểm thử PHẢI chạy lại thật ở thời điểm viết phase này, không copy nguyên số cũ từ
  Completion Summary nếu có khả năng code đã đổi — "đo trên bản xuất thật, không ước lượng" áp
  dụng cho mọi con số, kể cả số lượng test case.
- Tài liệu tham khảo: với mỗi mục `[n]` đã dùng ở Chương 1-3, phải có đủ thông tin thật (tác
  giả/tổ chức, tên tài liệu, nơi xuất bản hoặc URL, ngày truy cập). Nếu thiếu bất kỳ trường nào
  (VD: không rõ ngày xuất bản của một trang docs), để trống trường đó hoặc hỏi người dùng — ghi
  chú rõ ràng, KHÔNG bịa. Đây là điều khoản nghiêm ngặt nhất trong toàn bộ yêu cầu gốc.
- **Sắp xếp danh mục tài liệu tham khảo:** PDF quy định thật ghi rõ "đánh số theo thứ tự từ
  điển" (tức bảng chữ cái) — KHÁC với thói quen IEEE thông thường (đánh số theo thứ tự xuất
  hiện trong bài). Phải làm đúng theo PDF: sắp xếp danh mục theo alphabet (tên tác giả/tổ chức
  đầu mục), sau đó gán số `[1], [2], [3]...` theo vị trí alphabet đó — rồi cập nhật lại toàn bộ
  trích dẫn `[n]` trong Chương 1-3 cho khớp số mới (thứ tự trích dẫn trong bài sẽ KHÔNG còn là
  `[1], [2], [3]` liên tục theo mạch đọc, và đó là đúng theo quy định, không phải lỗi). PDF
  không yêu cầu tách riêng danh mục Tiếng Việt/Tiếng Anh — không tự thêm luật tách đó (khác với
  quy định Trà Vinh tham khảo ở lượt trước, quy định đó không áp dụng ở đây).
- Phụ lục (08a/08b) chứa nội dung phụ trợ không cần đưa vào thân bài chính để giữ số trang thân
  bài trong tầm kiểm soát — ứng viên tự nhiên cho phụ lục: schema Prisma đầy đủ, danh sách toàn
  bộ API endpoint chi tiết, hướng dẫn cài đặt/chạy demo (README gốc).

## Requirements

### 05-chuong-4.md (CHƯƠNG 4. KẾT QUẢ NGHIÊN CỨU)
- Chạy lại thật `npm run test` (unit) và `npm run test:e2e` (integration) từ thư mục gốc repo,
  dán số liệu thật vào bài (số test pass/fail, không làm tròn).
- Đánh giá theo Non-Functional Requirements Tracking của plan gốc (responsive, tải trang <3s,
  bcrypt, RBAC) — đối chiếu bằng số liệu đo thật nếu có (thời gian tải trang đã đo trong plan
  gốc: ~15-190ms).
- Nêu rõ các giới hạn đã biết (Known simplifications trong plan gốc) — không giấu giới hạn.

### 06-chuong-5.md (Kết luận & Hướng phát triển)
- Kết luận: tóm tắt kết quả đạt được, đối chiếu với Mục tiêu đã nêu ở MỞ ĐẦU (đếm lại: đạt
  bao nhiêu trên tổng số mục tiêu đã liệt kê ở Phase 5).
- Hướng phát triển: dùng đúng "Suggested next steps" của plan gốc (docker compose thật, UAT
  thật, bottom tab bar, Modal, deploy công khai) — không bịa thêm hướng phát triển không liên
  quan tới dự án thật.

### 07-tai-lieu-tham-khao.md
- Tổng hợp toàn bộ nguồn đã trích từ Chương 1, 2, 3, sắp xếp theo thứ tự từ điển (alphabet
  theo tên tác giả/tổ chức) — đúng nguyên văn yêu cầu PDF ("đánh số theo thứ tự từ điển"), rồi
  gán lại số `[1]`...`[n]` theo vị trí alphabet đó.
- Sau khi gán số mới, quay lại từng chỗ trích dẫn `[n]` trong Chương 1-3 và sửa cho khớp đúng
  số đã gán lại ở đây (không được để hai nơi lệch số).
- Mỗi mục đủ trường theo IEEE hoặc để trống trường không xác định kèm ghi chú `[cần bổ sung]`
  — KHÔNG điền giá trị đoán.

### 08a-phu-luc-schema.md / 08b-phu-luc-api.md (đặt tên theo đúng quy ước `phu-luc-*`)
- Phụ lục A: toàn bộ `schema.prisma` (copy nguyên văn, định dạng code block).
- Phụ lục B: bảng đầy đủ toàn bộ API endpoint (method, route, mô tả, role yêu cầu) — đối chiếu
  đúng routing thật trong `backend/src/`.

## Related Code Files
- Create: `docs/bao-cao/05-chuong-4.md`
- Create: `docs/bao-cao/06-chuong-5.md`
- Create: `docs/bao-cao/07-tai-lieu-tham-khao.md`
- Create: `docs/bao-cao/08a-phu-luc-schema.md`
- Create: `docs/bao-cao/08b-phu-luc-api.md`
- Read (không sửa): toàn bộ `backend/src/`, `backend/prisma/schema.prisma`,
  `plans/260926-1323-part-time-job-marketplace/plan.md`

## Implementation Steps
1. Chạy `npm run test` và `npm run test:e2e` từ gốc repo, ghi lại output thật (số pass/fail).
2. Viết Chương 4 với số liệu vừa chạy — nếu số liệu khác Completion Summary cũ, dùng số liệu
   MỚI (thật tại thời điểm viết) và ghi chú ngày chạy.
3. Viết Chương 5 — đối chiếu từng mục tiêu ở Phase 5 xem đã đạt hay chưa, không tự nhận "đạt
   100%" nếu có mục tiêu chưa hoàn thành thật (VD: "docker compose up --build" plan gốc ghi rõ
   chưa chạy end-to-end trong sandbox — Chương 5 phải nêu đúng giới hạn này).
4. Duyệt lại Chương 1-3 theo thứ tự, gom toàn bộ nguồn đã trích `[n]` (bất kể số cũ) vào một
   danh sách duy nhất — với mỗi nguồn, điền đủ trường có thể xác minh, để trống + ghi chú
   trường không thể xác minh mà không hỏi được người dùng ngay lúc viết.
5. Sắp xếp danh sách đó theo thứ tự từ điển (alphabet theo tên tác giả/tổ chức đầu mục), gán
   số `[1]`...`[n]` mới theo vị trí alphabet — đây là số cuối cùng dùng trong
   `07-tai-lieu-tham-khao.md`.
6. Quay lại từng file Chương 1-3, thay mọi trích dẫn `[n]` cũ bằng số mới vừa gán ở bước 5 —
   dùng tìm-thay có đối chiếu từng chỗ (không thay hàng loạt theo số mà không kiểm tra ngữ
   cảnh, vì số cũ/mới có thể trùng ngẫu nhiên ở một vài chỗ).
7. Copy `schema.prisma` nguyên văn vào Phụ lục A.
8. Liệt kê toàn bộ route thật từ các controller vào Phụ lục B (đối chiếu từng file, không dựa
   trí nhớ về route đã liệt kê sơ bộ ở Phase 7).

## Todo List
- [ ] Số liệu test Chương 4 lấy từ lần chạy thật, có ghi ngày chạy
- [ ] Chương 5 đối chiếu đúng số mục tiêu đạt/tổng mục tiêu đã liệt kê ở MỞ ĐẦU
- [ ] Danh mục tài liệu tham khảo đủ số `[n]` khớp với số trích dẫn thật dùng trong Chương 1-3
- [ ] Không có trường tài liệu tham khảo nào bị điền giá trị đoán (chỉ để trống + ghi chú)
- [ ] Phụ lục A/B đối chiếu đúng code thật

## Success Criteria
- Danh mục tài liệu tham khảo sắp xếp đúng thứ tự từ điển (alphabet), số `[1]`...`[n]` liên
  tục không trùng, và mọi trích dẫn `[n]` trong Chương 1-3 khớp chính xác số đã gán lại ở đây
  (không còn số cũ theo thứ tự xuất hiện sót lại).
- Không còn một con số "khẳng định" nào trong Chương 4/5 chưa được chạy/đếm lại thật.

## Risk Assessment
- **Rủi ro nghiêm trọng nhất:** bịa trường thiếu trong tài liệu tham khảo (đúng cảnh báo gay
  gắt nhất của người dùng — "gian lận học thuật, không phải tiện tay"). **Giảm thiểu:** mọi
  trường không xác minh được để trống + `[cần bổ sung]`, liệt kê rõ trong Todo/Next Steps để
  hỏi người dùng ở bước nghiệm thu cuối, không tự chế.
- **Rủi ro:** số liệu test đổi giữa lúc viết Chương 4 và lúc xuất bản thật ở Phase 9 (nếu có
  sửa code ở giữa) → **Giảm thiểu:** Phase 9/10 phải chạy lại test và đối chiếu số liệu Chương
  4 với kết quả cuối cùng trước khi nộp, không tin số liệu Phase 8 là số liệu cuối.

## Security Considerations
- Phụ lục B (API) không được để lộ endpoint nội bộ nhạy cảm không có trong scope công khai của
  đồ án (không áp dụng ở đây vì toàn bộ API là của chính dự án học thuật này).

## Next Steps
- Phase 9 xuất bản lần đầu, đo số trang thật, đối chiếu với trần quy định trong `quy-dinh.md`.
