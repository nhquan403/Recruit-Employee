---
title: "Quy trình sinh Báo cáo Đồ án Chuyên ngành từ Markdown → .docx"
description: "Markdown-as-source pipeline (python-docx) sinh bản .docx ~45 trang cho đồ án Việc Làm Thêm, đúng quy định trình bày của khoa (đã đọc từ PDF, không suy đoán)"
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

# Quy trình sinh Báo cáo Đồ án Chuyên ngành — Kế hoạch triển khai

## Tổng quan

Dựng một pipeline "Markdown là nguồn, Word là bản xuất": toàn bộ nội dung báo cáo đồ án
chuyên ngành cho dự án **Việc Làm Thêm** (đã code xong 8 phase — xem
`plans/260926-1323-part-time-job-marketplace/`) được viết bằng Markdown trong
`docs/bao-cao/`, và một script Python (`scripts/xuat-ban-word.py`, dùng `python-docx`)
dựng ra file `.docx` nộp được — đúng font/lề/giãn dòng/đánh số/mục lục/bảng biểu theo quy
định của khoa, không sửa tay trong Word.

Đây KHÔNG phải là kế hoạch viết code sản phẩm (đã xong) — đây là kế hoạch viết **tài liệu
học thuật** (~45 trang, có hình ảnh chụp thật từ hệ thống, có công thức kỹ thuật) và
**công cụ xuất bản** nó, dựa 100% trên mã nguồn/schema/API/test đã tồn tại trong repo —
không bịa số liệu, không suy diễn tính năng chưa build.

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
Quy định về quản lý GitHub repo (đặt tên `cn-<malop>-<hotenkhongdau>-<shortname>` vì đây là
đồ án **chuyên ngành**, mời GVHD làm Collaborator, `progress-report/`, cấu trúc `thesis/`)
và quy trình Hội đồng chấm — không ảnh hưởng đến script/định dạng .docx, nhưng Phase 10 sẽ
đối chiếu repo hiện tại (`Recruit-Employee`) với cấu trúc thư mục này và báo cáo phần nào
khớp/thiếu, vì đây cũng là một phần "quy định" của cùng tài liệu.

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

## Câu hỏi cần bạn quyết (không suy đoán, hỏi ở cuối theo đúng chuẩn ak-plan)

Xem chi tiết và lựa chọn ở Phase 1 — tóm tắt:
1. Bìa chính/bìa phụ/trang nhận xét "theo mẫu" — bạn có file mẫu (BM...) để gửi không?
2. Số trang bắt đầu đếm từ đâu (PDF không nói)?
3. Chân trang có cần nội dung gì không (PDF không yêu cầu)?
4. Thông tin cá nhân/đề tài: tên đề tài chính thức, họ tên SVTH (kèm MSSV, lớp), họ tên
   GVHD (kèm học hàm/học vị nếu có), tên khoa/trường, học kỳ - năm học, shortname dự án
   dùng cho tên GitHub repo (`cn-<malop>-<hotenkhongdau>-<shortname>`).

## Next Recommended Step

```bash
/ak:cook plans/260927-0624-bao-cao-do-an/plan.md
```
(sau khi trả lời các câu hỏi ở Phase 1 — cook sẽ dừng lại hỏi lại nếu chưa có).
