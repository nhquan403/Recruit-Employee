---
phase: 4
title: "Viết phần đầu: bìa/nhận xét/lời cảm ơn/mục lục/danh mục/tóm tắt"
status: pending
priority: P1
effort: "0.5d"
dependencies: [1]
---

# Phase 4: Viết phần đầu (00-phan-dau.md)

## Goal
Viết toàn bộ nội dung Markdown cho các trang trước MỞ ĐẦU — bìa chính, bìa phụ, trang nhận
xét GVHD (nếu không bị loại theo quyết định Phase 1), lời cảm ơn, mục lục (khung, số trang
điền sau ở Phase 9), danh mục hình/bảng/từ viết tắt, và tóm tắt (abstract) tiếng Việt (kèm
bản tiếng Anh nếu quy định/người dùng yêu cầu). Toàn bộ số liệu cá nhân/đề tài lấy nguyên văn
từ `docs/bao-cao/quy-dinh.md` do Phase 1 tạo ra — không tự đặt tên/MSSV/GVHD khác.

## Context Links
- Nguồn thông tin cá nhân/quyết định hình thức: `docs/bao-cao/quy-dinh.md` (Phase 1) — toàn bộ
  thông tin (trường, khoa, đề tài, SVTH, GVHD...) đã có sẵn từ đề cương, xem bảng trong
  `plan.md` mục "Nguồn tham chiếu thứ hai" và `./phase-01-chot-thong-tin.md`.
- Cấu trúc bố cục 5 chương xác nhận từ PDF quy định: `./plan.md`
- Nội dung tổng quan dự án dùng cho tóm tắt: `plans/260926-1323-part-time-job-marketplace/plan.md`
  và mục 1-2 của `./nguon/de-cuong-chi-tiet-trich-xuat.txt` (ĐẶT VẤN ĐỀ, MỤC TIÊU) — tóm tắt
  nên khớp giọng văn và trọng tâm với đoạn ĐẶT VẤN ĐỀ đã có trong đề cương, không lệch hướng.

## Key Insights
- Đây là phase **chặn cứng** bởi Phase 1 — không có tên đề tài/SVTH/GVHD thật thì không viết
  được bìa, và viết bìa với tên giả rồi "sửa sau" đúng là kiểu lỗi người dùng đã từng gặp
  (thông tin sai lọt vào bản nộp).
- **CẬP NHẬT sau khi có biểu mẫu BM5 chính thức** (`../nguon/bieu-mau-bm5-trich-xuat.txt`,
  đọc toàn bộ) — không còn "chờ mẫu" nữa:
  - Bìa chính/bìa phụ dùng ĐÚNG bố cục và câu chữ BM5 (trường/khoa in đậm size 16 → tên đề
    tài in đậm size 18-30 tùy độ dài → GVHD/SVTH/MSSV/Lớp/**Khóa** in hoa đậm size 14 → địa
    điểm-thời gian size 13). BM5 ghi "ĐỒ ÁN THỰC TẬP CHUYÊN NGÀNH"/"CƠ SỞ NGÀNH" tùy trang mẫu
    — đồ án này là **cơ sở ngành** nên dùng "ĐỒ ÁN THỰC TẬP CƠ SỞ NGÀNH" ở CẢ bìa chính và bìa
    phụ (BM5 dùng 2 chữ khác nhau ở 2 trang mẫu chỉ vì đó là ví dụ minh họa chung, không phải
    2 loại bìa khác nhau).
  - KHÔNG thêm trang "NHẬN XÉT của cơ quan thực tập" (BM5 ghi "nếu có" — đồ án không thực tập
    doanh nghiệp, người dùng xác nhận bỏ).
  - Thêm ĐỦ CẢ 2 kiểu trang nhận xét GVHD: (a) văn xuôi ngắn "NHẬN XÉT" và (b) biểu mẫu đầy đủ
    "BẢN NHẬN XÉT ĐỒ ÁN THỰC TẬP CƠ SỞ NGÀNH (Của giảng viên hướng dẫn)" có tiêu đề "UBND TỈNH
    TRÀ VINH / TRƯỜNG ĐẠI HỌC TRÀ VINH — CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM / Độc lập – Tự do
    – Hạnh Phúc" và 8 mục chấm điểm — CẢ HAI để TRỐNG hoàn toàn phần nội dung nhận xét/điểm/ký
    tên, chỉ có khung + nhãn mục, GVHD tự điền tay. Tương tự cho "NHẬN XÉT của giảng viên chấm"
    (văn xuôi) + "BẢN NHẬN XÉT... (Của cán bộ chấm đồ án)" (biểu mẫu I-III).
  - Mục lục: tối đa 4 cấp tiểu mục; tiêu đề chương và mục lớn (cấp 1) in đậm in hoa — khớp với
    những gì `docx_builder.py`/`muc_luc.py` (Phase 2) đã làm (bold cấp 1, heading gõ sẵn hoa).
  - Danh mục hình: dòng "Nguồn:" dưới mỗi hình là **bắt buộc thật theo BM5**, không chỉ là yêu
    cầu tự thêm của người dùng như ghi nhầm ở bản nháp `quy-dinh.md` đầu tiên.
- Mục lục ở bước này chỉ là khung (danh sách heading, chưa có số trang) — số trang thật chỉ
  có được sau khi xuất bản lần đầu ở Phase 9 (vấn đề "con gà quả trứng" đã ghi trong Phase 2).
  Không điền số trang đoán trước ở đây.
- Tóm tắt phải mô tả đúng phạm vi đã build (3 vai trò, 5 bảng, 7 use case, không có thanh
  toán/e-contract/chatbot) — không phóng đại tính năng chưa có (không tự thêm "AI gợi ý việc
  làm" hay "tích hợp thanh toán" vào tóm tắt vì hệ thống không có).

## Requirements
- `docs/bao-cao/00-phan-dau.md` chứa các mục theo đúng thứ tự bố cục PDF (trích trong
  `plan.md`): trang bìa chính, trang bìa phụ, (trang nhận xét GVHD nếu áp dụng), lời cảm ơn,
  mục lục (khung heading), danh mục hình, danh mục bảng, danh mục từ viết tắt (nếu có từ viết
  tắt dùng trong bài — liệt kê sau khi rà toàn bộ nội dung ở các phase sau, tạm để trống hoặc
  điền sau khi Phase 5–8 xong), tóm tắt.
- Toàn bộ tên riêng (SVTH, MSSV, lớp, GVHD, khoa, trường, học kỳ-năm học, tên đề tài) copy
  nguyên văn từ `quy-dinh.md`, không viết tắt hay đổi cách trình bày tự ý.
- Trang bìa dùng `\pagebreak` (chỉ thị riêng từ Bước 2) sau mỗi trang để tách section — nhưng
  việc tách section thật (`is_linked_to_previous=False`) là việc của script ở Phase 2/9, phase
  này chỉ cần đánh dấu ranh giới đúng bằng chỉ thị Markdown.
- Tóm tắt dài khoảng nửa trang đến 1 trang, nêu: bài toán, giải pháp (3 vai trò + quy trình
  duyệt tin), công nghệ chính, kết quả kiểm thử tóm lược (số liệu thật: 21+77+8 test theo
  Completion Summary của plan gốc — sẽ đối chiếu lại số liệu mới nhất ở Phase 8/10, không chốt
  cứng con số này nếu quy trình kiểm thử thay đổi trước lúc xuất bản).

## Related Code Files
- Create: `docs/bao-cao/00-phan-dau.md`
- Read (không sửa): `docs/bao-cao/quy-dinh.md`, `plans/260926-1323-part-time-job-marketplace/plan.md`

## Implementation Steps
1. Đọc lại `docs/bao-cao/quy-dinh.md` — xác nhận Phase 1 đã điền đủ, không còn placeholder.
2. Viết trang bìa chính + bìa phụ theo đúng cấu trúc phổ biến (tên trường/khoa trên cùng, tên
   đề tài giữa trang, SVTH/GVHD dưới, học kỳ-năm học cuối) — nếu Phase 1 xác nhận có mẫu BM
   chính thức, dùng đúng bố cục mẫu đó thay vì bố cục "hợp lý phổ biến".
3. Viết trang nhận xét GVHD (nếu không bị loại) — để trống phần chữ ký/điểm số/ngày tháng
   (đây là phần GVHD tự điền tay sau khi in, không phải nội dung sinh tự động).
4. Viết lời cảm ơn — ngắn gọn, thật, không dùng giọng văn sáo rỗng kiểu AI (tuân Bước 5, áp
   dụng từ phase này chứ không chỉ ở Phase 10 rà soát cuối).
5. Dựng khung mục lục — liệt kê đúng thứ tự heading sẽ có (dựa trên bố cục 5 chương xác nhận
   từ PDF), số trang để placeholder `{{page}}` mà script Phase 2 sẽ thay bằng số thật ở lần
   xuất bản; không gõ số tay.
6. Dựng khung danh mục hình/bảng — sẽ đối chiếu lại danh sách thật sau khi Phase 5–8 viết xong
   (mỗi hình/bảng thật trong bài phải có mặt ở đây, không thiếu không thừa).
7. Viết tóm tắt — đối chiếu số liệu với plan gốc, không tự suy diễn số liệu mới.

## Todo List
- [ ] Bìa chính/bìa phụ viết xong, mọi tên riêng khớp `quy-dinh.md`
- [ ] Trang nhận xét xử lý đúng theo quyết định Phase 1 (viết đủ / để trống chờ mẫu / bỏ hẳn)
- [ ] Lời cảm ơn viết xong, không sáo rỗng
- [ ] Khung mục lục + danh mục hình/bảng dựng xong (placeholder số trang, chưa điền số thật)
- [ ] Tóm tắt viết xong, số liệu đối chiếu đúng plan gốc

## Success Criteria
- Không còn tên/MSSV/ngày tháng giả định trong file — mọi giá trị truy được về `quy-dinh.md`.
- Mục lục liệt kê đúng và đủ toàn bộ heading cấp 1–3 dự kiến của báo cáo (đối chiếu lại lần
  cuối sau khi Phase 5–8 viết xong nội dung thật).

## Risk Assessment
- **Rủi ro:** viết bìa trước khi Phase 1 thật sự có câu trả lời (tự đặt tên tạm "sẽ sửa sau")
  → chính là lỗi người dùng đã từng gặp. **Giảm thiểu:** phase này declare dependency cứng vào
  Phase 1, không bắt đầu nếu `quy-dinh.md` chưa tồn tại hoặc còn placeholder.
- **Rủi ro:** danh mục từ viết tắt liệt kê thiếu vì viết trước khi biết nội dung đầy đủ các
  chương → **Giảm thiểu:** đánh dấu rõ "cần rà lại sau Phase 8" thay vì coi là hoàn tất.

## Security Considerations
- Không áp dụng — chỉ có tên riêng công khai trên bìa báo cáo học thuật, không phải dữ liệu
  nhạy cảm.

## Next Steps
- Phase 9 (xuất bản) điền số trang thật vào mục lục sau lần export đầu; Phase 10 rà lại danh
  mục hình/bảng/từ viết tắt cho khớp nội dung cuối cùng.
