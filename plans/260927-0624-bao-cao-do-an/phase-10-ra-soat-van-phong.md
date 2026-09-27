---
phase: 10
title: "Rà văn phong chống giọng AI + hoàn thiện đối chiếu + việc phải làm tay"
status: pending
priority: P1
effort: "0.5d"
dependencies: [9]
---

# Phase 10: Rà soát văn phong (Bước 5) + tổng kết việc phải làm tay (Bước 7)

## Goal
Đo (không đoán) các dấu hiệu "giọng văn AI" thật trong bản `.docx` cuối cùng của Phase 9, cắt
giảm nếu vượt ngưỡng đáng ngờ, rà lại danh mục hình/bảng/từ viết tắt cho khớp nội dung cuối
cùng, và liệt kê rõ ràng cho người dùng mọi việc script không làm được mà họ phải tự làm tay
trong Word (theo đúng "Bước 7" của yêu cầu gốc).

## Context Links
- Bản xuất cuối: output của `./phase-09-xuat-ban-nghiem-thu.md`
- Bài học đo đạc của người dùng: cụm "chứ không phải" KHÔNG phải dấu hiệu thật (chỉ 3 lần trong
  ví dụ của họ); dấu hiệu THẬT là số cụm in đậm và số dấu gạch ngang dài (—) — ví dụ thật của
  người dùng: 105 in đậm + 31 em-dash trong một quyển là vấn đề.

## Key Insights
- Không giả định trước ngưỡng "bao nhiêu là quá nhiều" — đếm thật trong tài liệu NÀY rồi đánh
  giá theo mật độ trên số trang thật (VD: >2-3 cụm in đậm/trang hoặc >1 em-dash/trang là dấu
  hiệu đáng xem lại, nhưng đây là kinh nghiệm tham khảo, không phải ngưỡng cứng — quyết định
  cuối dựa trên đọc lại thực tế đoạn văn, không chỉ dựa con số).
- Không kiểm tra cụm "chứ không phải" như một tiêu chí chính vì người dùng đã tự đo và xác nhận
  nó KHÔNG phải vấn đề thật — nếu muốn kiểm, chỉ nêu tham khảo, không dùng làm tiêu chí quyết
  định cắt sửa.
- Cấm câu mở đoạn kết bằng "Tóm lại", "Nhìn chung", "Có thể thấy rằng" và câu mở bài "Trong
  thời đại công nghệ 4.0" — đếm số lần xuất hiện thật, sửa hết nếu có (không phải "giảm bớt").
- Rà soát này chạy trên TEXT THẬT trích từ file `.docx` cuối (dùng `python-docx` đọc lại toàn
  bộ `paragraph.runs` để đếm `run.bold` và đếm ký tự `—` trong `paragraph.text`) — không đếm
  trên file Markdown nguồn, vì định dạng in đậm có thể khác giữa Markdown (`**text**`) và cách
  nó thực sự render thành `run.bold=True` trong OOXML.

## Requirements
- Script hoặc lệnh đếm thật: số đoạn có `run.bold=True`, tổng số cụm in đậm, số ký tự `—`
  (em-dash) trong toàn bộ `.docx` cuối — chạy bằng `python-docx`, dán kết quả thật.
- Với mỗi chương vượt mật độ đáng ngờ, đọc lại đoạn văn thật và quyết định giữ/cắt từng cụm in
  đậm hay từng em-dash (không cắt máy móc theo tỷ lệ) — sửa tại nguồn Markdown, xuất bản lại
  (không sửa trực tiếp vào `.docx`, đúng nguyên tắc "Markdown là nguồn" xuyên suốt toàn bộ quy
  trình).
- Sau khi sửa xong văn phong, phải chạy lại toàn bộ hoặc một phần "Bước 6" (Phase 9) để xác
  nhận số trang/mục lục không bị lệch do nội dung thay đổi — không giả định sửa văn phong không
  ảnh hưởng số trang.
- Trước các bước đo văn phong, hỏi người dùng câu còn thiếu duy nhất của toàn bộ kế hoạch
  (xem `plan.md` mục "Câu hỏi đã hỏi và đã chốt"): `shortname` cho tên GitHub repo nộp bài
  theo cú pháp `csn-<malop>-<hotenkhongdau>-<shortname>` (mục 4.1 PDF — malop=DX23TT11,
  hotenkhongdau=buianhkhoa), và có tạo repo nộp riêng hay dùng lại chính `Recruit-Employee`.
  Đối chiếu luôn repo hiện tại với cấu trúc thư mục PDF mục 4.3 yêu cầu (`setup/`, `scr/`,
  `progress-report/` [bắt buộc], `thesis/` [bắt buộc, có `doc/pdf/html/abs/refs/`], `soft/`,
  `docker/`) — báo cáo phần nào khớp/thiếu so với `Recruit-Employee` hiện tại, không tự tạo
  lại toàn bộ cấu trúc này nếu người dùng không yêu cầu (đây là quy định nộp bài, không phải
  yêu cầu bắt buộc phải tái cấu trúc repo code).
- Tổng hợp danh sách "việc phải làm tay" — tối thiểu:
  - Ghép trang bìa/biểu mẫu chính thức của trường (nếu Phase 1 chọn phương án chờ mẫu/không có
    mẫu chính thức).
  - Trang nhận xét GVHD cần chữ ký tay thật, không thể tự động.
  - In bìa cứng theo yêu cầu nộp của trường (không kiểm chứng được trong sandbox này).
  - Tạo/đổi tên GitHub repo theo đúng cú pháp `csn-...` và mời GVHD (ThS. Trầm Hoàng Nam) làm
    Collaborator (mục 4.1b PDF) — đây là thao tác trên GitHub thật, không tự động hóa được.
  - Nộp link GitHub repo qua Google Form của bộ môn (mục 4.2b PDF) khi có link biểu mẫu.
  - Bất kỳ trường tài liệu tham khảo còn để trống `[cần bổ sung]` từ Phase 8 — liệt kê đầy đủ
    tại đây để người dùng biết cần điền gì trước khi nộp.
  - Bất kỳ bước trong Phase 9 không chạy được (VD: font Times New Roman không có thật trong máy
    người dùng nếu khác sandbox này) — nhắc người dùng tự kiểm lại trên máy họ trước khi in.

## Related Code Files
- Create (tạm thời, dùng 1 lần, không phải phần script chính thức):
  `scripts/bao_cao_hinh/dem-van-phong.py` — đọc `.docx` cuối, đếm bold/em-dash theo chương
  (dùng section hoặc heading để chia chương khi đếm).
- Update: file(s) Markdown trong `docs/bao-cao/` bị phát hiện vượt mật độ đáng ngờ.

## Implementation Steps
0. Hỏi người dùng câu shortname repo còn lại (xem Requirements) trước khi viết phần đối chiếu
   cấu trúc GitHub repo của báo cáo tổng kết.
1. Viết `dem-van-phong.py`: mở `.docx` cuối bằng `python-docx`, duyệt `document.paragraphs`,
   với mỗi paragraph đếm số `run` có `run.bold`, đếm `paragraph.text.count("—")`, gom theo
   chương (dựa vào heading style `Heading 1`).
2. Chạy script, dán bảng kết quả thật: chương nào có bao nhiêu in đậm, bao nhiêu em-dash, mật
   độ trên số trang chương đó (dùng số trang thật đo ở Phase 9).
3. Grep thêm các cụm mở đầu/kết đoạn bị cấm: `grep -rn "Tóm lại\|Nhìn chung\|Có thể thấy rằng\|thời đại công nghệ 4.0" docs/bao-cao/*.md`
   — dán kết quả, sửa hết nếu có.
4. Với chương có mật độ in đậm/em-dash cao bất thường, đọc lại đoạn văn thật, quyết định
   cắt/giữ từng chỗ theo ngữ cảnh — sửa file Markdown nguồn.
5. Nếu có sửa ở bước 4, quay lại Phase 9 chạy lại xuất bản + đo số trang/mục lục, xác nhận vẫn
   đạt trần quy định.
6. Rà lại `docs/bao-cao/00-phan-dau.md` — danh mục hình/bảng/từ viết tắt khớp chính xác nội
   dung cuối cùng (đếm số hình/bảng thật xuất hiện trong toàn bài, đối chiếu với danh mục).
7. Viết bản tổng kết "việc phải làm tay" — đây là nội dung sẽ đưa thẳng vào phản hồi cuối cùng
   gửi người dùng, không chỉ là ghi chú nội bộ.

## Todo List
- [ ] Đếm bold/em-dash thật theo từng chương, kết quả đã dán
- [ ] Grep cụm mở đầu/kết đoạn cấm, đã sửa hết nếu có
- [ ] Các chỗ mật độ cao đã đọc lại và quyết định cắt/giữ có chủ đích (không cắt máy móc)
- [ ] Nếu có sửa nội dung, đã chạy lại Phase 9 và số trang/mục lục vẫn đúng
- [ ] Danh mục hình/bảng/từ viết tắt khớp 100% nội dung cuối
- [ ] Danh sách "việc phải làm tay" đầy đủ, cụ thể, sẵn sàng gửi người dùng

## Success Criteria
- Có số liệu đo thật (không phải ước lượng) cho in đậm và em-dash trước và sau khi sửa.
- Không còn cụm mở đầu/kết đoạn bị cấm nào trong toàn bộ `docs/bao-cao/*.md`.
- Danh sách việc làm tay đủ chi tiết để người dùng có thể hoàn tất bản nộp mà không cần đoán.

## Risk Assessment
- **Rủi ro:** lặp lại đúng sai lầm cũ của người dùng — đoán dấu hiệu văn phong AI thay vì đo.
  **Giảm thiểu:** toàn bộ quyết định cắt/giữ ở bước 4 dựa trên số đếm thật từ bước 2-3, không
  dựa cảm giác.
- **Rủi ro:** sửa văn phong làm lệch số trang đã chốt ở Phase 9 mà không phát hiện. **Giảm
  thiểu:** bước 5 bắt buộc nếu có bất kỳ sửa nội dung nào, không được coi Phase 9 là "đã xong
  vĩnh viễn" một khi còn sửa văn bản sau đó.

## Security Considerations
- Không áp dụng.

## Next Steps
- Đây là phase cuối cùng của quy trình. Sau phase này: báo cáo lại toàn bộ kết quả (đường dẫn
  `.docx` cuối, số trang, các con số đã đối chiếu, danh sách việc làm tay) cho người dùng theo
  đúng "Bước 6" — dán output thật, không mô tả suông.
