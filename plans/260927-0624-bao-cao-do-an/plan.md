---
title: "Quy trình sinh Báo cáo Đồ án Cơ sở ngành từ Markdown → .docx"
description: "Markdown-as-source pipeline (python-docx) sinh bản .docx ~45 trang cho đồ án Việc Làm Thêm, đúng quy định trình bày của khoa (đã đọc từ PDF) và bám sát đề cương chi tiết đã duyệt"
status: pending
priority: P1
effort: 6d
issue: null
branch: claude/intelligent-turing-6u4r33
tags: [docs, docx, python-docx, bao-cao, capstone, markdown-pipeline]
blockedBy: []
blocks: []
created: 2026-09-27
---

# Quy trình sinh Báo cáo Đồ án Cơ sở ngành — Kế hoạch triển khai

## Tổng quan

Dựng một pipeline "Markdown là nguồn, Word là bản xuất": toàn bộ nội dung báo cáo đồ án
cơ sở ngành cho dự án **Việc Làm Thêm** (đã code xong 8 phase — xem
`plans/260926-1323-part-time-job-marketplace/`) được viết bằng Markdown trong
`docs/bao-cao/`, và một script Python (`scripts/xuat-ban-word.py`, dùng `python-docx`)
dựng ra file `.docx` nộp được — đúng font/lề/giãn dòng/đánh số/mục lục/bảng biểu theo quy
định của khoa, không sửa tay trong Word, và bám sát nội dung/cấu trúc của đề cương chi tiết
đã duyệt (xem mục "Nguồn tham chiếu thứ hai" bên dưới).

Đây KHÔNG phải là kế hoạch viết code sản phẩm (đã xong) — đây là kế hoạch viết **tài liệu
học thuật** (~45 trang, có hình ảnh chụp thật từ hệ thống, có công thức kỹ thuật) và
**công cụ xuất bản** nó, dựa 100% trên mã nguồn/schema/API/test đã tồn tại trong repo —
không bịa số liệu, không suy diễn tính năng chưa build.

**Đối chiếu số trang mục tiêu:** người dùng yêu cầu ~45 trang; PDF quy định cho phép 30-50
trang nội dung; đề cương tự ước lượng ~55 trang (đề cương ghi rõ đây chỉ là ước lượng, "sẽ
điều chỉnh theo quy định của khoa"). Dùng ~45 trang của người dùng làm mục tiêu thật (nằm
trong khung PDF), và dùng tỷ trọng trang giữa các chương trong đề cương (mục 11: Mở đầu 3 ·
Chương 1 7 · Chương 2 12 · Chương 3+4 gộp 25 · Kết luận 3, tổng 50/55 ≈ đã bỏ phần dư) làm tỷ
lệ tương đối khi phân bổ ~45 trang thật cho từng chương ở Phase 5-8, không copy nguyên số
trang tuyệt đối của đề cương.

## Nguồn quy định (đã đọc trực tiếp, trích dẫn nguyên văn — không suy đoán)

File: `b0651a67-MauQuyDinhLuanVan_v1.1.pdf` — "MỘT SỐ QUY ĐỊNH VỀ HÌNH THỨC TRÌNH BÀY
THỰC TẬP ĐỒ ÁN CƠ SỞ NGÀNH & CHUYÊN NGÀNH" (5 trang, đọc toàn bộ).

### 1. Cấu trúc (mục 1 của PDF)
Bìa chính (theo mẫu) → Bìa phụ (theo mẫu) → Trang nhận xét GVHD (theo mẫu) → Lời cám ơn →
Mục lục → Bảng các hình vẽ/ký hiệu/chữ viết tắt (nếu có, **xếp theo bảng chữ cái**) →
Tóm tắt Đồ án → Nội dung.

### 2. Bố cục nội dung (mục 2)
- Tóm tắt: vấn đề nghiên cứu, hướng tiếp cận, cách giải quyết, một số kết quả đạt được.
- **Nội dung tối thiểu 30 trang, không nên vượt quá 50 trang** (không kể bìa, lời cám ơn,
  mục lục, TLTK...). Mục tiêu người dùng đặt ra: ~45 trang — nằm giữa khung, có biên độ an
  toàn cả hai phía.
- Trình tự bắt buộc — **đây là 5 chương, không phải cấu trúc đồ án phần mềm thông thường**:
  1. MỞ ĐẦU — lý do chọn đề tài, mục đích, đối tượng và phạm vi nghiên cứu.
  2. CHƯƠNG 1. TỔNG QUAN — tổng quan vấn đề nghiên cứu/giải quyết.
  3. CHƯƠNG 2. NGHIÊN CỨU LÝ THUYẾT — cơ sở lý thuyết, công cụ/công nghệ/phần mềm dùng.
  4. CHƯƠNG 3. HIỆN THỰC HÓA NGHIÊN CỨU — các bước đã làm, thiết kế, cài đặt; đề tài có
     sản phẩm phần mềm **phải có hồ sơ thiết kế dạng lược đồ/mô hình phổ biến trong ngành**.
  5. CHƯƠNG 4. KẾT QUẢ NGHIÊN CỨU — kết quả đạt được, có thể đánh giá hiệu năng/UX/giao diện.
  6. CHƯƠNG 5. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN — kết quả, đóng góp mới, đề xuất mới; **kết
     luận ngắn gọn, không bàn luận thêm**; hướng phát triển ghi kiến nghị nghiên cứu tiếp.
  7. DANH MỤC TÀI LIỆU THAM KHẢO — chỉ tài liệu thực sự được trích dẫn/dùng/bàn luận.
  8. PHỤ LỤC.

### 3. Hình thức trình bày (mục 3 — mọi con số dùng trong script PHẢI khớp đúng đây)
| Hạng mục | Giá trị (trích nguyên văn PDF) |
|---|---|
| Font | Unicode Times New Roman, 13pt |
| Giãn dòng | 1.5 lines |
| Cách đoạn | Before 6pt, After 6pt |
| Lề | trên 2cm · dưới 2cm · **trái 3.0cm** · phải 2cm |
| Số trang | góc phải dưới (PDF không nói rõ bắt đầu từ đâu — xem Câu hỏi cần bạn quyết) |
| Đánh số mục | Số Ả-rập, không La Mã; nhóm 2-3 chữ số cách nhau dấu chấm: `Chương 3` → `3.1.` → `3.1.1.` → `3.1.2.` → `3.2.` |
| Tài liệu tham khảo | Định dạng IEEE; **đánh số theo thứ tự từ điển** (PDF không yêu cầu tách Tiếng Việt/Tiếng Anh riêng — không tự thêm luật đó) |

Mẫu trích dẫn IEEE theo đúng 3 ví dụ trong PDF (tạp chí, hội nghị, sách) — dùng làm khuôn
cho DTO nội bộ của script khi format từng tài liệu tham khảo trong Chương 2/3.

**Những gì PDF này KHÔNG quy định** (không được tự suy ra từ bảng tham chiếu trường khác đã
đưa ở lượt trước — bảng đó chỉ là ví dụ, không phải quy định thật):
- Không nói chân trang phải có nội dung gì (không có luật "GVHD trái · SVTH phải").
- Không nói mục lục tối đa mấy cấp, không nói tiêu đề chương có phải in đậm/in hoa.
- Không nói hình/bảng bắt buộc phải có dòng "Nguồn:" (dù đây là thực hành tốt, không viện
  dẫn nó như một điều khoản của quy định khi trình bày với người chấm).
- Không nói số trang bắt đầu đếm từ đâu.

Ba điểm này cần bạn quyết định trước khi Phase 4 (phần đầu) chạy — xem mục "Câu hỏi cần
bạn quyết" ở cuối. Cover/bìa chính, bìa phụ, trang nhận xét đều ghi "theo mẫu" nhưng PDF
này không kèm file mẫu — cũng cần bạn xác nhận.

### 4-5. Thực hiện/nộp & Tổ chức báo cáo (mục 4-5)
Quy định về quản lý GitHub repo (mời GVHD làm Collaborator, `progress-report/`, cấu trúc
`thesis/`) và quy trình Hội đồng chấm — không ảnh hưởng đến script/định dạng .docx, nhưng
Phase 10 sẽ đối chiếu repo hiện tại (`Recruit-Employee`) với cấu trúc thư mục này và báo cáo
phần nào khớp/thiếu, vì đây cũng là một phần "quy định" của cùng tài liệu.

**Tên GitHub repo (mục 4.1 PDF, trích nguyên văn 2 cú pháp):**
- Cơ sở ngành: `<csn>-<malop>-<hotenkhongdau>-<shortname>` — ví dụ PDF cho:
  `csn-da21tta-nguyenngocduyen-doixe-nodejs`
- Chuyên ngành: `<cn>-<malop>-<hotenkhongdau>-<shortname>` — ví dụ PDF cho:
  `cn-da20tta-letuananh-eshop-springboot`

Đồ án này đã được xác nhận (sau khi đối chiếu với đề cương chi tiết — xem mục dưới) là
**đồ án cơ sở ngành** → dùng tiền tố `csn-`, KHÔNG phải `cn-` như bản nháp đầu tiên của kế
hoạch này từng giả định.

## Nguồn tham chiếu thứ hai: Đề cương chi tiết đã có (đọc toàn bộ, trích nguyên văn)

File: `Bui_Anh_Khoa_-_170123594.docx` — "ĐỀ CƯƠNG CHI TIẾT — XÂY DỰNG WEBSITE KẾT NỐI NGƯỜI
TÌM VIỆC LÀM THÊM VỚI NHÀ TUYỂN DỤNG" (12 mục, đã đọc toàn bộ qua trích xuất XML thật, lưu
bản sao tại `./nguon/de-cuong-chi-tiet-trich-xuat.txt` và 2 hình nhúng tại
`./nguon/de-cuong-hinh-1.jpeg` (logo Trường Đại học Trà Vinh) và `./nguon/de-cuong-hinh-2.png`
(sơ đồ kiến trúc gốc trong đề cương)). Người dùng yêu cầu rõ: báo cáo cuối "đừng làm khác
[đề cương] quá" — đề cương này là khung nội dung bắt buộc phải bám sát, PDF quy định (mục
trên) là khung hình thức trình bày bắt buộc. Hai nguồn không mâu thuẫn nhau về hình
thức/font/lề — chỉ khác nhau ở cách chia chương, đã ánh xạ ở bảng dưới.

**Thông tin cá nhân/đề tài (trích nguyên văn từ trang bìa đề cương — dùng thẳng cho
`quy-dinh.md` ở Phase 1, không cần hỏi lại người dùng):**

| Trường | Giá trị (nguyên văn đề cương) |
|---|---|
| Trường | TRƯỜNG ĐẠI HỌC TRÀ VINH (logo xác nhận qua `de-cuong-hinh-1.jpeg`) — đơn vị trực thuộc: TRƯỜNG KỸ THUẬT VÀ CÔNG NGHỆ |
| Khoa | KHOA CÔNG NGHỆ THÔNG TIN |
| Tên đề tài | XÂY DỰNG WEBSITE KẾT NỐI NGƯỜI TÌM VIỆC LÀM THÊM VỚI NHÀ TUYỂN DỤNG |
| SVTH | Bùi Anh Khoa |
| MSSV | 170123594 |
| Lớp | DX23TT11 |
| GVHD | ThS. Trầm Hoàng Nam |
| Địa điểm - thời gian | Vĩnh Long, tháng 9 năm 2026 |
| Loại đồ án | Cơ sở ngành (xác nhận qua AskUserQuestion sau khi đề cương gợi ý điều này ở mục 1 — xem "Điều đã sửa lại" bên dưới) |

**Đề xuất shortname repo:** đề cương không tự đặt shortname — cần hỏi người dùng riêng nếu
họ muốn khác gợi ý `vieclamthem` (repo thật đang tên `Recruit-Employee`, không nhất thiết
phải trùng tên GitHub repo yêu cầu của quy định — đây là 2 repo khác mục đích: một cái nộp
theo yêu cầu môn học, một cái là repo code thật đang dùng. Cần hỏi người dùng có tạo repo
riêng theo đúng cú pháp `csn-...` để nộp, hay dùng lại chính `Recruit-Employee` và đổi tên).

**Ánh xạ cấu trúc đề cương (mục 11, 4 chương) → cấu trúc PDF bắt buộc (5 chương):**

| Đề cương (đã duyệt) | PDF bắt buộc | Ghi chú |
|---|---|---|
| Mở đầu (~3tr) | MỞ ĐẦU | Khớp thẳng |
| Chương 1. Tổng quan (~7tr) | CHƯƠNG 1. TỔNG QUAN | Khớp thẳng — dùng lại mục 4.1-4.4 đề cương |
| Chương 2. Cơ sở lý thuyết (~12tr) | CHƯƠNG 2. NGHIÊN CỨU LÝ THUYẾT | Khớp thẳng — dùng lại mục 5.1-5.6 đề cương |
| Chương 3. Phân tích và thiết kế hệ thống (~13tr) | CHƯƠNG 3. HIỆN THỰC HÓA NGHIÊN CỨU (phần kiến trúc — `04a`) | PDF gộp thiết kế+cài đặt vào 1 chương; đề cương tách 2 chương — giữ đúng đề cương bằng cách chia CHƯƠNG 3 của PDF thành 2 file `04a`/`04b` (đã có sẵn trong kiến trúc thư mục dưới đây), KHÔNG đổi tên chương trên bìa/mục lục so với PDF |
| Chương 4. Cài đặt và kiểm thử (~12tr) | CHƯƠNG 3 (phần cài đặt — `04b`) + CHƯƠNG 4. KẾT QUẢ NGHIÊN CỨU (phần kết quả kiểm thử) | Phần "cài đặt" → `04b`; phần "kết quả kiểm thử" (đề cương mục 7.4, 10.2) → tách sang CHƯƠNG 4 PDF |
| Kết luận và hướng phát triển (~3tr) | CHƯƠNG 5. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN | Khớp thẳng — dùng lại hướng phát triển đã liệt kê ở mục 11 đề cương |
| Tài liệu tham khảo, phụ lục | DANH MỤC TÀI LIỆU THAM KHẢO + PHỤ LỤC | Đề cương đã có sẵn 12 tài liệu tham khảo thật, dùng lại nguyên văn — xem dưới |

**Tài liệu tham khảo đã có sẵn trong đề cương (12 mục, IEEE, IETF RFC thật, sách thật) — dùng
lại NGUYÊN VĂN ở Phase 8, không tự bịa thêm hay đổi nội dung, chỉ được thêm citation mới nếu
Chương 1-3 cần trích dẫn nguồn mà 12 mục này chưa đủ:**
Fielding (luận án REST) · Fowler (*Patterns of Enterprise Application Architecture*) ·
NestJS Docs · Next.js Docs · OWASP Top 10:2021 · PostgreSQL 16 Docs · Prisma Docs ·
Fette & Melnikov (IETF RFC 6455, WebSocket) · Schwaber & Sutherland (Scrum Guide) ·
Sommerville (*Software Engineering*, 10th ed) · Jones/Bradley/Sakimura (IETF RFC 7519, JWT) ·
Martin (*Clean Architecture*). Toàn văn 12 mục nằm trong
`./nguon/de-cuong-chi-tiet-trich-xuat.txt` (mục 12).

**Chỉ tiêu định lượng đề xuất trong đề cương (mục 10.2) — CHƯƠNG 4 phải đối chiếu số liệu
THẬT với đúng các chỉ tiêu này, không tự đặt chỉ tiêu khác:**

| Chỉ tiêu (đề cương đề xuất) | Mức đề xuất |
|---|---|
| Số use case hoàn thành (trên 7 use case mục 7.2) | Tối thiểu 6/7 |
| Thời gian tải trang chủ (demo) | Không quá 3 giây |
| Tỷ lệ kịch bản kiểm thử pass | Từ 90% trở lên |
| Khả năng dùng trên điện thoại | Hiển thị đúng, thao tác được |

**Điều đã sửa lại so với bản nháp đầu của kế hoạch này (do đề cương cung cấp bằng chứng
mới, không phải suy đoán):**
1. Loại đồ án: đề cương ghi "phù hợp quy mô một đồ án **cơ sở ngành**" ở mục 1 — khác với
   giả định "chuyên ngành" ở bản nháp đầu. Đã hỏi lại người dùng qua AskUserQuestion và được
   xác nhận: **đúng là đồ án cơ sở ngành** → toàn bộ tham chiếu `cn-` trong kế hoạch này đã
   sửa thành `csn-`.
2. Kiến trúc thông báo: sơ đồ gốc trong đề cương (`de-cuong-hinh-2.png`) vẽ "Dịch vụ thông
   báo (WebSocket / email)" — nhưng hệ thống ĐÃ XÂY DỰNG THẬT dùng DB-backed polling (xem
   "Kept Deliberately Simple" trong `plans/260926-1323-part-time-job-marketplace/plan.md`),
   không dùng WebSocket lẫn email. Sơ đồ kiến trúc trong báo cáo (Phase 3, `hinh-2-1`) PHẢI vẽ
   lại đúng cơ chế polling thật đã cài đặt, không dùng lại nguyên sơ đồ đề cương — đây là một
   quyết định kỹ thuật đã thay đổi hợp lệ trong quá trình làm (đề cương mục 9 tự dự trù
   trường hợp này: "Nếu tiến độ chậm, chức năng thông báo thời gian thực sẽ được thay bằng
   thông báo hiển thị ngay trên giao diện thay vì đẩy tức thời"), Chương 3/4 nên nêu rõ đây là
   một thay đổi có chủ đích so với đề cương ban đầu, không phải sai sót.
3. Công nghệ UI: đề cương đề xuất "Ant Design hoặc TailwindCSS" — thực tế đã chọn TailwindCSS
   3.4.19 (không dùng Ant Design). Chương 2/3 ghi đúng lựa chọn thật, có thể nhắc ngắn gọn lý
   do chọn Tailwind thay vì liệt kê cả hai như đang cân nhắc.
4. Triển khai: đề cương đề xuất "Vercel hoặc máy chủ ảo miễn phí" — thực tế dùng Docker
   Compose làm mục tiêu demo chính (xem Tech Stack trong plan gốc). Ghi đúng lựa chọn thật.

## Scope Challenge (Bước 0 của kế hoạch)

- **Đã có sẵn:** toàn bộ hệ thống Việc Làm Thêm đã code xong và test qua (98 test pass,
  Docker Compose, 8 phase trong `plans/260926-1323-part-time-job-marketplace/`). Đây là
  nguồn sự thật duy nhất cho nội dung Chương 2-4 — không viết lại từ trí nhớ, mọi khẳng định
  kỹ thuật trong báo cáo trích lại từ code/test/plan đã có.
- **Yêu cầu thực sự:** (1) một script Python xuất Markdown → .docx đúng định dạng khoa,
  chịu đúng 3 bẫy OOXML người dùng đã liệt kê; (2) nội dung đầy đủ ~45 trang, có hình ảnh
  thật (chụp từ hệ thống đang chạy) và công thức kỹ thuật, không rỗng không giữ chỗ.
  Giao đủ cả hai, không cắt bớt phần nào.
- **Độ phức tạp:** 10 phase, vượt mức "giữ dưới 3 phase" mặc định — nhưng đây là ánh xạ
  trực tiếp cấu trúc 5-chương-bắt-buộc-của-quy-định cộng với 1 phase công cụ + 1 phase hình
  ảnh + 1 phase xuất bản/nghiệm thu + 1 phase rà văn phong. Không phải phình phạm vi.
- **Chế độ:** HOLD SCOPE — giao đúng những gì yêu cầu, không thêm (không tự ý làm slide,
  không tự ý làm poster dù mục 5 PDF có nhắc tới poster — đó là lựa chọn cộng điểm, không
  phải yêu cầu bắt buộc, không làm trừ khi được yêu cầu).

## Kiến trúc thư mục (theo đúng thiết kế bạn đưa ở lượt trước)

```
docs/bao-cao/
  00-phan-dau.md            ← bìa, nhận xét, lời cảm ơn, mục lục, danh mục, tóm tắt
  01-mo-dau.md
  02-chuong-1.md            ← TỔNG QUAN
  03-chuong-2.md            ← NGHIÊN CỨU LÝ THUYẾT
  04a-chuong-3-kien-truc.md ← HIỆN THỰC HÓA (phần kiến trúc/thiết kế) — chương dài nhất, tách 2 file
  04b-chuong-3-cai-dat.md   ← HIỆN THỰC HÓA (phần cài đặt/quy trình)
  05-chuong-4.md            ← KẾT QUẢ NGHIÊN CỨU
  06-chuong-5.md            ← KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
  07-tai-lieu-tham-khao.md
  08a-phu-luc-schema.md
  08b-phu-luc-api.md
  README.md                 ← bảng đối chiếu tệp ↔ chương ↔ số từ ↔ số trang (đo thật)
docs/images/bao-cao/
  hinh-<chuong>-<so>-<mo-ta-khong-dau>.png
  README.md                 ← mỗi hình tạo BẰNG CÁCH NÀO (screenshot Playwright / vẽ sơ đồ / v.v.)
scripts/xuat-ban-word.py
```

## Môi trường xuất bản — đã kiểm tra thật trong sandbox này

| Công cụ | Trạng thái | Ghi chú |
|---|---|---|
| `python-docx` | Chưa cài, `pip install` dry-run xác nhận tải được bản `1.2.0` | Cài ở Phase 2 |
| `soffice`/`libreoffice` | **Đã có** (`/usr/bin/soffice`) | Dùng để .docx → .pdf đo số trang thật |
| `pdfinfo` (poppler-utils) | **Không có** binary này (chỉ có thư viện `libpoppler134`) | Thay bằng `pypdf` (pip, thuần Python) để đếm trang — tương đương về bản chất "đo trên bản xuất thật", chỉ khác công cụ đo |

## Bảng phase

| Phase | Tên | Sản phẩm chính |
|-------|-----|----------------|
| 1 | [Chốt thông tin còn thiếu & đặc tả quy định máy đọc được](./phase-01-chot-thong-tin.md) | `docs/bao-cao/quy-dinh.md`, câu trả lời của bạn cho 3+ câu hỏi mở |
| 2 | [Dựng khung thư mục & lõi script chuyển đổi](./phase-02-loi-script.md) | `scripts/xuat-ban-word.py` (style, section bìa, TOC dot-leader, bảng, 3 bẫy OOXML) |
| 3 | [Sinh tài sản hình ảnh thật](./phase-03-hinh-anh.md) | `docs/images/bao-cao/*.png` + `README.md` đối chiếu nguồn |
| 4 | [Viết phần đầu: bìa/nhận xét/lời cảm ơn/mục lục/danh mục/tóm tắt](./phase-04-phan-dau.md) | `00-phan-dau.md` |
| 5 | [Viết MỞ ĐẦU + CHƯƠNG 1. TỔNG QUAN](./phase-05-mo-dau-chuong1.md) | `01-mo-dau.md`, `02-chuong-1.md` |
| 6 | [Viết CHƯƠNG 2. NGHIÊN CỨU LÝ THUYẾT](./phase-06-chuong2.md) | `03-chuong-2.md` |
| 7 | [Viết CHƯƠNG 3. HIỆN THỰC HÓA NGHIÊN CỨU](./phase-07-chuong3.md) | `04a-chuong-3-kien-truc.md`, `04b-chuong-3-cai-dat.md` |
| 8 | [Viết CHƯƠNG 4, CHƯƠNG 5, TLTK, Phụ lục](./phase-08-chuong4-5-tltk.md) | `05-chuong-4.md`, `06-chuong-5.md`, `07-tai-lieu-tham-khao.md`, `08a/08b-phu-luc-*.md` |
| 9 | [Xuất bản & nghiệm thu đo đạc thật](./phase-09-xuat-ban-nghiem-thu.md) | `.docx` cuối cùng, log đo đạc dán thật (không mô tả) |
| 10 | [Rà văn phong chống giọng AI + hoàn thiện đối chiếu + việc phải làm tay](./phase-10-ra-soat-van-phong.md) | Báo cáo đếm số liệu, `README.md` đối chiếu, danh sách việc làm tay |

Thứ tự tuần tự: Phase 1 mở khóa mọi phase khác (không có thông tin/quyết định thì không thể
viết bìa/nhận xét đúng). Phase 2-3 độc lập với nhau, có thể làm song song, nhưng Phase 4+
cần cả hai đã xong (nội dung tham chiếu hình `[Hình X.Y]` cần hình đã tồn tại; script cần
sẵn để mỗi phase nội dung có thể xuất thử ngay, tránh dồn lỗi định dạng đến cuối).

## Câu hỏi đã hỏi và đã chốt (không còn câu nào mở ở cuối vòng lập kế hoạch này)

1. Bìa chính/bìa phụ/trang nhận xét "theo mẫu" — **đã chốt: chờ bạn gửi file mẫu (BM...) sau**;
   Phase 4 tạm bỏ qua 3 trang này khi viết, ghi rõ "chờ mẫu BM chính thức" trong `quy-dinh.md`.
2. Số trang bắt đầu đếm từ đâu — **đã chốt: bắt đầu từ MỞ ĐẦU = trang 1**, các trang trước đó
   không đánh số.
3. Nội dung chân trang — **đã chốt: GVHD bên trái · SVTH bên phải** (quy ước bạn chọn thêm,
   không phải điều khoản bắt buộc của PDF quy định này — ghi rõ điều này trong `quy-dinh.md`).
4. Thông tin cá nhân/đề tài — **đã có đủ từ đề cương chi tiết đã gửi** (xem bảng ở mục
   "Nguồn tham chiếu thứ hai" phía trên): tên đề tài, SVTH, MSSV, lớp, GVHD, khoa, trường,
   thời gian. Không cần hỏi lại.
5. Loại đồ án — **đã chốt: Cơ sở ngành** (đề cương gợi ý, bạn xác nhận qua AskUserQuestion) →
   tiền tố GitHub repo `csn-`.

**Còn đúng 1 điểm chưa chốt, không thuộc phạm vi định dạng/nội dung nên không chặn Phase 1-8:**
shortname cho tên GitHub repo nộp bài (`csn-<malop>-<hotenkhongdau>-<shortname>`) — repo code
thật hiện đang tên `Recruit-Employee`. Cần bạn xác nhận: dùng lại chính repo này (đổi tên/thêm
remote) hay tạo repo nộp riêng, và tên shortname cụ thể muốn dùng — hỏi ở đầu Phase 10 (không
ảnh hưởng tới việc viết nội dung .docx trước đó).

## Next Recommended Step

```bash
/ak:cook plans/260927-0624-bao-cao-do-an/plan.md
```
Toàn bộ thông tin chặn Phase 1-9 đã có đủ — cook có thể chạy thẳng từ Phase 1. Chỉ Phase 10
(đối chiếu quy ước đặt tên GitHub repo nộp bài) cần hỏi thêm 1 câu về shortname repo trước khi
hoàn tất.
