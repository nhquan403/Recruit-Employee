---
phase: 2
title: "Dựng khung thư mục & lõi script chuyển đổi"
status: pending
priority: P1
effort: "1.5d"
dependencies: [1]
---

# Phase 2: Dựng khung thư mục & lõi script chuyển đổi

## Goal
Viết `scripts/xuat-ban-word.py` — bộ chuyển đổi Markdown → `.docx` xử lý đúng toàn bộ yêu
cầu định dạng ở `docs/bao-cao/quy-dinh.md`, và tránh đúng 3 bẫy OOXML đã biết trước, thay vì
phát hiện chúng qua trial-and-error lúc xuất bản thật.

## Context Links
- Đặc tả quy định: `docs/bao-cao/quy-dinh.md` (Phase 1)
- Ba bẫy OOXML & yêu cầu chỉ thị riêng: `./plan.md` (mục "Bước 2/3" trong yêu cầu gốc)

## Key Insights (nhắc lại nguyên nhân kỹ thuật, không lặp lại lỗi)
- **Bộ đếm danh sách đánh số nằm ở `w:abstractNum`, không phải `w:num`.** Nhiều `w:num` trỏ
  chung một `abstractNum` vẫn đếm tiếp một dãy — phải gắn
  `<w:lvlOverride><w:startOverride w:val="1"/></w:lvlOverride>` vào từng `w:num` muốn bắt
  đầu lại từ 1.
- **Thứ tự phần tử con trong `w:pPr` là bắt buộc theo schema.** Append trực tiếp XML sẽ làm
  LibreOffice từ chối mở file — luôn dùng `paragraph_format.element.get_or_add_numPr()` của
  `python-docx`, không tự tay dựng `w:numPr` rồi `append`.
- **Tab stop phải ở header sẽ vỡ nếu tiêu đề chương dài xuống 2 dòng.** Header dùng một tiêu
  đề NGẮN riêng (khai trong `quy-dinh.md`/frontmatter mỗi chương), không dùng nguyên tên
  chương dài.
- Bìa phải là section riêng, KHÔNG có header/footer — chỉ đạt được khi section kế tiếp đặt
  `header.is_linked_to_previous = False` và `footer.is_linked_to_previous = False` (Word mặc
  định nối ngược lên section đầu).
- Mục lục dùng dấu chấm dẫn thật (`tab_stops.add_tab_stop(pos, WD_TAB_ALIGNMENT.RIGHT,
  WD_TAB_LEADER.DOTS)`), không gõ chuỗi ký tự `.` — một chuỗi dấu chấm là một "từ" liền khối,
  không co giãn, dừng nửa chừng dòng.

## Requirements

### Cài đặt môi trường (đã xác nhận khả thi trong sandbox)
- `pip install "python-docx>=1.2.0"` — dry-run đã xác nhận tải được `1.2.0`.
- `soffice` đã có sẵn (`/usr/bin/soffice`) — dùng ở Phase 9 để xuất PDF đo trang, không cần
  cài thêm.
- `pdfinfo` (poppler-utils) **không có** trong sandbox này — dùng `pip install pypdf` thay
  thế để đếm trang từ PDF xuất ra bằng Python thuần, không cần gọi binary ngoài.

### Chức năng bắt buộc của script
1. **Đối số dòng lệnh:** phần cần xuất (đường dẫn thư mục hoặc danh sách file Markdown theo
   thứ tự), đường dẫn `.docx` xuất ra, tên GVHD, tên SVTH (và các trường khác đọc từ
   `quy-dinh.md` mặc định, cho phép override qua đối số). Đường dẫn gốc suy từ
   `Path(__file__).resolve().parent.parent` — không ghi cứng đường dẫn tuyệt đối nào.
2. **Style toàn cục:** áp Times New Roman 13pt, line spacing 1.5, space before/after 6pt,
   margin trên/dưới/trái/phải = 2/2/3.0/2 cm — đọc từ `quy-dinh.md`, không hard-code lần hai
   trong code.
3. **Section bìa riêng biệt**, không đầu/chân trang; section nội dung chính có header (tiêu
   đề ngắn) + footer (số trang góc phải dưới, dùng field `PAGE`; nội dung chân trang khác
   theo quyết định Phase 1).
4. **Đánh số trang bắt đầu** đúng theo quyết định Phase 1 (dùng `w:pgNumType` với
   `w:start` nếu cần reset về 1 tại section Mở đầu).
5. **Heading tự động đánh số** theo đúng mẫu `Chương 3` → `3.1.` → `3.1.1.` — mỗi heading
   Markdown (`#`, `##`, `###`) ánh xạ sang style Word tương ứng đã gắn `numPr` với
   `abstractNum`/`lvlOverride` đúng như Key Insights.
6. **Mục lục** dựng bằng tab stop dot-leader thật (không phải trường TOC tự động của Word
   — dựng thủ công từ danh sách heading đã parse, để kiểm soát chính xác được nội dung, và vì
   trường TOC tự động của Word cần người mở file bấm "Update Field" mới hiện đúng, không phù
   hợp cho một file nộp thẳng).
7. **Bảng:** parse dòng phân cách Markdown (`:---:` giữa, `---:` phải, mặc định trái); hàng
   tiêu đề lặp lại khi tràn trang qua `w:tblHeader`.
8. **Hình:** thay thế placeholder `[Hình X.Y]` trong Markdown bằng ảnh tương ứng từ
   `docs/images/bao-cao/`; tự lấy caption từ câu dẫn `Hình X.Y thể hiện ...` xuất hiện ngay
   trong đoạn văn phía trên/dưới; chèn dòng nguồn ngay dưới ảnh (không phải điều khoản bắt
   buộc của quy định, nhưng là thực hành được giữ nguyên vì đã có trong yêu cầu gốc của
   người dùng — ghi rõ trong `README.md` đây là lựa chọn trình bày).
9. **Bỏ qua dòng `<!-- ... -->`** khi parse — đây là metadata riêng của bộ chuyển đổi (VD:
   đánh dấu số từ ước tính, ghi chú cho người viết), không in ra giấy.
10. **Chỉ thị riêng** không có cú pháp Markdown chuẩn: `\pagebreak` (ngắt trang tường minh)
    và `\khoiky` (khối ký tên nửa phải trang, dùng cho lời cam đoan/chữ ký cuối chương/phụ
    lục nếu cần).
11. **Công thức:** hỗ trợ chèn công thức dạng ảnh (render từ LaTeX đơn giản qua matplotlib
    `mathtext`, không cần cài LaTeX đầy đủ) HOẶC văn bản công thức có định dạng in nghiêng +
    ký hiệu Unicode khi công thức đơn giản (VD: `Chi phí bcrypt = 2^cost`). Quyết định theo
    từng công thức cụ thể khi viết nội dung Phase 6/8 — script chỉ cần hỗ trợ cả hai đường.

## Architecture

```
scripts/
  xuat-ban-word.py          # entrypoint, argparse
  bao_cao/
    __init__.py
    cau_hinh.py             # đọc docs/bao-cao/quy-dinh.md → dataclass hằng số
    markdown_parser.py      # parse .md → cây node (heading/paragraph/table/image/directive)
    docx_builder.py         # cây node → python-docx Document (style, section, numbering)
    numbering.py            # tạo abstractNum/num XML đúng 2 bẫy đầu, cache theo cấp heading
    muc_luc.py              # dựng mục lục dot-leader từ danh sách heading đã parse
```

## Related Code Files
- Create: toàn bộ cây `scripts/` ở trên
- Create: `requirements.txt` hoặc khai trong `README.md` gốc (thêm `python-docx`, `pypdf`
  vào một nơi duy nhất — kiểm tra `backend`/`frontend` là Node nên không có `requirements.txt`
  sẵn trong repo; tạo mới ở thư mục gốc, phạm vi riêng cho tooling Python).

## Implementation Steps
1. `pip install "python-docx>=1.2.0" pypdf` — ghi vào `requirements.txt` mới ở gốc repo.
2. Viết `cau_hinh.py` đọc `docs/bao-cao/quy-dinh.md` (parse bảng Markdown đơn giản bằng
   regex/`re` — không cần thư viện Markdown đầy đủ cho riêng file này) → dataclass
   `QuyDinh(font, size_pt, line_spacing, space_before_pt, space_after_pt, margin_top_cm, ...)`.
3. Viết `numbering.py`: hàm `tao_danh_sach_moi(document, level) -> numId` tạo một
   `abstractNum` mới + một `w:num` mang `lvlOverride/startOverride=1` cho mỗi danh sách/heading
   cần tự bắt đầu lại — viết test thủ công: 2 danh sách liên tiếp, xác nhận danh sách thứ hai
   thực sự bắt đầu lại từ 1 sau khi mở bằng LibreOffice.
4. Viết `markdown_parser.py`: parse heading (`#`/`##`/`###`), đoạn văn, bảng (kèm căn lề cột
   từ dòng phân cách), ảnh placeholder `[Hình X.Y]`, chỉ thị `\pagebreak`/`\khoiky`, bỏ qua
   `<!-- -->`. Output là danh sách node có kiểu rõ ràng (dataclass/Enum), không phải chuỗi.
5. Viết `docx_builder.py`: duyệt cây node, gọi đúng API `python-docx` cho từng loại; áp style
   toàn cục từ `QuyDinh`; dựng section bìa riêng biệt (`document.add_section()`, sau đó
   `section.header.is_linked_to_previous = False` và tương tự cho `footer`); áp `numPr` qua
   `paragraph.paragraph_format.element.get_or_add_numPr()` — không tự dựng XML tay.
6. Viết `muc_luc.py`: sau khi `markdown_parser` đã có danh sách heading kèm số trang ước
   lượng ban đầu (số trang thật chỉ biết sau khi xuất — xem Phase 9 về việc phải xuất 2 lần:
   lần 1 lấy số trang, lần 2 dựng mục lục đúng số trang thật), dựng mục lục bằng tab stop
   `WD_TAB_LEADER.DOTS`.
7. Viết `xuat-ban-word.py` (entrypoint): argparse nhận `--input-dir docs/bao-cao`,
   `--output <file>.docx`, `--gvhd "<tên>"`, `--svth "<tên>"`; gọi các module trên theo đúng
   thứ tự file (tên file `00-`, `01-`, `02-`... quyết định thứ tự ghép).
8. Chạy thử với nội dung rỗng/giữ chỗ tối thiểu (1-2 heading, 1 bảng, 1 ảnh giả) để xác nhận
   toàn bộ pipeline chạy hết không lỗi trước khi Phase 4+ đổ nội dung thật vào — tách lỗi
   công cụ khỏi lỗi nội dung.

## Todo List
- [ ] `requirements.txt` tạo, cài đặt xác nhận chạy được trong sandbox
- [ ] `cau_hinh.py` đọc đúng mọi con số từ `quy-dinh.md`, không hard-code trùng
- [ ] `numbering.py`: 2 danh sách liên tiếp xác nhận bắt đầu lại từ 1 (test thủ công qua
      LibreOffice, không chỉ nhìn XML)
- [ ] `markdown_parser.py` xử lý đủ: heading, bảng+căn lề cột, ảnh placeholder, `\pagebreak`,
      `\khoiky`, bỏ qua comment
- [ ] `docx_builder.py`: bìa là section riêng không header/footer; mọi `numPr` qua
      `get_or_add_numPr()`
- [ ] `muc_luc.py`: mục lục dùng tab stop dot-leader thật, không chuỗi ký tự `.`
- [ ] Chạy thử end-to-end với nội dung giữ chỗ, file `.docx` mở được bằng LibreOffice không
      báo lỗi cấu trúc

## Success Criteria
- `python3 scripts/xuat-ban-word.py --input-dir docs/bao-cao --output /tmp/thu.docx ...`
  chạy xong không exception, sinh ra file `.docx`.
- Mở file bằng `soffice --headless --convert-to pdf` thành công (không lỗi structural).
- Kiểm tra bằng `unzip -p thu.docx word/document.xml` thấy đúng font/size/margin theo
  `quy-dinh.md` (đối chiếu bằng `grep`, không tin comment code).
- Danh sách heading thứ hai trở đi bắt đầu số đúng 1 (test cụ thể: 2 danh sách con dưới 2
  heading cấp 3 khác nhau).

## Risk Assessment
- **Rủi ro:** `python-docx` 1.2.0 thay đổi API so với bản cũ hơn thường được tài liệu hóa
  trên mạng (nhiều ví dụ online dùng bản cũ). **Giảm thiểu:** kiểm tra `help(docx.Document)`
  và mã nguồn cài đặt thật trong sandbox trước khi viết, không copy mẫu code từ trí nhớ.
- **Rủi ro:** mục lục cần số trang thật nhưng số trang chỉ biết sau khi xuất — vòng lặp
  "gà và trứng". **Giảm thiểu:** chấp nhận quy trình xuất 2 lần ở Phase 9 (lần 1 để đo, lần 2
  để chốt mục lục đúng số) thay vì cố tính trước bằng ước lượng — đúng tinh thần "đo trên bản
  xuất thật, không ước lượng" của Bước 4 gốc.

## Security Considerations
- Không áp dụng.

## Next Steps
- Phase 4 trở đi dùng script này để xuất thử sau mỗi phase nội dung, không dồn đến cuối mới
  phát hiện lỗi định dạng.
