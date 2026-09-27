---
phase: 9
title: "Xuất bản & nghiệm thu đo đạc thật"
status: completed
priority: P1
effort: "1d"
dependencies: [2, 4, 8]
---

# Phase 9: Xuất bản .docx & chạy toàn bộ giao thức nghiệm thu Bước 6

## Goal
Chạy `scripts/xuat-ban-word.py` để sinh ra file `.docx` thật lần đầu, chuyển sang PDF, đo số
trang/font/lề bằng công cụ thật (không ước lượng), điền lại số trang thật vào mục lục, và lặp
lại cho tới khi mọi con số khớp. Đây là phase thực thi đúng "Bước 6 — Nghiệm thu, dán output
thật" của người dùng — kết quả của phase này phải là output lệnh thật được dán lại, không phải
mô tả bằng lời.

## Context Links
- Script & kiến trúc: `./phase-02-loi-script.md`
- Toàn bộ nội dung nguồn: `docs/bao-cao/00-phan-dau.md` … `08b-phu-luc-api.md`
- Trần số trang, font, lề thật: `docs/bao-cao/quy-dinh.md` (Phase 1)
- Ảnh: `docs/images/bao-cao/*.png` (Phase 3)

## Key Insights
- Vấn đề "con gà quả trứng" của mục lục (đã ghi trong Phase 2): số trang thật chỉ biết được
  SAU khi xuất bản, nhưng mục lục nằm ở đầu file. Giải pháp 2 lượt xuất bản:
  1. Xuất lần 1 với mục lục để placeholder hoặc số trang tạm.
  2. Đo số trang thật của từng heading cấp 1 từ PDF lần 1 (dò bằng cách tìm trang có heading đó
     xuất hiện — có thể dùng `pypdf` trích text từng trang rồi tìm heading, hoặc chèn bookmark
     trong .docx và đọc lại vị trí).
  3. Cập nhật `docs/bao-cao/00-phan-dau.md` (hoặc file trung gian) với số trang thật, xuất bản
     lần 2 — đây mới là bản dùng để nghiệm thu cuối. Không được lấy số trang từ lần xuất đầu
     tiên trở lên làm số cuối vì sau khi điền số trang, tổng số trang có thể lệch đi vài dòng.
- **Cập nhật ở Phase 2:** `pdfinfo`/`pdftoppm` (poppler-utils) ban đầu không có trong sandbox,
  nhưng đã cài được bằng `apt-get install poppler-utils` — `pdfinfo | grep Pages` giờ chạy
  đúng nguyên văn Bước 6, dùng làm công cụ đếm trang CHÍNH. Giữ `pypdf` làm phương án dự phòng
  (đã cài, đã kiểm chứng hoạt động) nếu chạy trên máy khác không cài được poppler-utils.
- Toàn bộ 6 bước của "Bước 6" gốc phải chạy tuần tự và dán output thật:
  1. `python3 scripts/xuat-ban-word.py ...` → xuất `.docx`
  2. `soffice --headless --convert-to pdf ...` rồi `pdfinfo <file>.pdf | grep Pages`
  3. Đối chiếu số trang với trần trong `quy-dinh.md`
  4. `unzip -p output.docx word/document.xml | grep ...` kiểm font/lề/giãn dòng
  5. Đếm lại mọi con số khẳng định trong bài (mục tiêu, use case, use case, hình, bảng) bằng
     lệnh đếm thật (`grep -c` trên các file Markdown nguồn), đối chiếu với số đã ghi trong lời
     văn ở Phase 5-8
  6. Đối chiếu số trang mục lục với bản xuất thật (không gõ tay)
- Nếu bất kỳ bước nào trong 6 bước trên không chạy được trong sandbox (VD: `soffice` lỗi convert,
  thiếu font Times New Roman khiến LibreOffice thay font khác) — PHẢI ghi rõ trong báo cáo
  nghiệm thu bước nào không chạy được và vì sao, không được bỏ qua im lặng hay báo "đã kiểm tra".

## Requirements
- File .docx xuất ra tại đường dẫn do người dùng chỉ định qua CLI (mặc định gợi ý:
  `bao-cao/BaoCaoDoAnChuyenNganh-<shortname>.docx` — thư mục gốc suy từ `__file__`, không
  hard-code).
- Mọi con số trần (số trang nội dung, không tính bìa/cảm ơn/mục lục/tài liệu tham khảo/phụ lục
  — đúng cách đếm mà quy định thật nêu, xem lại `quy-dinh.md` để lấy đúng phạm vi đếm, KHÔNG
  copy cách đếm của quy định Trà Vinh tham khảo) phải nằm trong giới hạn cho phép, hoặc nếu
  vượt, phải báo cáo rõ và đề xuất cắt giảm phần nào (không tự ý cắt nội dung mà không nói).
- Font, lề, giãn dòng đo từ `document.xml` phải khớp chính xác số liệu trong `quy-dinh.md`
  (không phải khớp gần đúng).

## Related Code Files
- Run: `scripts/xuat-ban-word.py`
- Read/verify: `docs/bao-cao/**/*.md`, output `.docx`, PDF chuyển đổi, `word/document.xml`
  (giải nén tạm)

## Implementation Steps
1. Chạy xuất bản lần 1, dán nguyên văn lệnh + output (kể cả nếu có warning).
2. Chuyển PDF bằng `soffice --headless --convert-to pdf`, dán output.
3. Đếm số trang bằng `pdfinfo <file>.pdf | grep Pages`, dán kết quả thật.
4. Trích text từng trang bằng `pypdf` (`PdfReader(...).pages[i].extract_text()`) để xác định
   trang bắt đầu của mỗi heading cấp 1 — `pdfinfo` chỉ cho tổng số trang, không trích được text
   từng trang, nên vẫn cần `pypdf` cho riêng bước này — dựng
   bảng "heading → số trang thật".
5. Cập nhật mục lục trong nguồn Markdown/metadata với số trang thật vừa đo, xuất bản lần 2.
6. Lặp lại bước 2-3 cho bản xuất lần 2, xác nhận số trang mục lục lần 2 khớp bản xuất lần 2
   (nếu lệch do số trang tự dịch chuyển sau khi sửa mục lục, lặp thêm lần 3 cho tới khi ổn định
   — dừng lặp nếu ổn định định sau tối đa 3 lần, nếu vẫn lệch thì báo cáo rõ thay vì lặp vô hạn).
7. Giải nén bản cuối: `unzip -p <file>.docx word/document.xml > /tmp/.../document.xml`, `grep`
   tìm `w:sz` (font size, đơn vị half-point — 13pt = giá trị 26), `w:type="Times New Roman"`
   (hoặc thẻ font tương ứng), `w:pgMar` (lề), `w:spacing` (giãn dòng/before/after) — dán kết
   quả grep thật.
8. Đếm lại mọi con số khẳng định trong Markdown nguồn (mục tiêu, use case, hình, bảng, trích
   dẫn) bằng lệnh đếm thật (`grep -c "^- " docs/bao-cao/01-mo-dau.md` v.v. tùy cấu trúc thật),
   đối chiếu với các con số bằng lời văn tương ứng đã viết ở Phase 5-8 — sửa lại lời văn nếu
   lệch, không sửa số đếm để khớp lời văn.
9. Kiểm tra thư mục có tiến trình `soffice` nào bị treo lại sau khi convert xong (đôi khi
   headless LibreOffice để lại tiến trình nền) — tắt nếu có, theo `process-management.md`.
10. Tổng hợp toàn bộ kết quả 6 bước vào một báo cáo nghiệm thu (dùng cho Phase 10 và cho phản
    hồi cuối cùng gửi người dùng) — mỗi bước ghi rõ: chạy được/không, output thật, kết luận.

## Todo List
- [ ] Xuất bản lần 1 thành công, output đã dán
- [ ] Số trang lần 1 đo bằng `pdfinfo`, đã dán
- [ ] Bảng heading → số trang thật đã dựng từ trích xuất text PDF
- [ ] Mục lục cập nhật số trang thật, xuất bản lần 2 (và lần 3 nếu cần), ổn định
- [ ] Font/lề/giãn dòng grep từ `document.xml` khớp `quy-dinh.md`, output đã dán
- [ ] Mọi con số khẳng định trong bài đã đếm lại bằng lệnh thật, khớp hoặc đã sửa lời văn
- [ ] Số trang tổng đối chiếu với trần quy định, kết luận đạt/vượt rõ ràng
- [ ] Không còn tiến trình `soffice` treo lại sau khi xong

## Success Criteria
- Toàn bộ 6 mục trong "Bước 6" gốc có output thật đã dán, không mục nào bị mô tả suông.
- File `.docx` cuối mở được bằng LibreOffice không lỗi, không có trang trắng thừa do lỗi section
  break, không có `<!-- -->` nào bị in ra giấy.

## Risk Assessment
- **Rủi ro:** LibreOffice không có font Times New Roman thật trong sandbox, tự thay font khác
  khi convert PDF → số đo trang/dòng bị sai lệch. **Giảm thiểu:** kiểm tra
  `fc-list | grep -i "times"` trước khi convert; nếu thiếu, cài `fonts-liberation`/font tương
  thích metric (Liberation Serif thường tương thích Times New Roman) và ghi rõ sự thay thế này
  trong báo cáo nghiệm thu, không giấu.
- **Rủi ro:** vòng lặp cập nhật mục lục không hội tụ (số trang cứ đổi mỗi lần sửa). **Giảm
  thiểu:** giới hạn 3 lần lặp, nếu không ổn định thì báo cáo rõ thay vì lặp vô hạn hoặc gian
  lận số liệu.
- **Rủi ro:** vượt trần số trang quy định sau khi đo thật (nội dung ~45 trang người dùng yêu
  cầu có thể vượt trần thật đọc được từ PDF). **Giảm thiểu:** nếu vượt, báo cáo rõ cho người
  dùng ngay, đề xuất phương án cắt giảm cụ thể (phần nào có thể chuyển xuống phụ lục), không tự
  ý cắt nội dung mà không hỏi.

## Security Considerations
- Không áp dụng.

## Next Steps
- Phase 10 dùng chính bản `.docx` cuối cùng của phase này để chạy rà soát văn phong (đếm in
  đậm/gạch ngang) và tổng hợp danh sách việc phải làm tay.
