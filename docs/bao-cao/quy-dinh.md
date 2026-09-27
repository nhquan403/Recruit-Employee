# Quy định trình bày & thông tin đề tài — nguồn sự thật duy nhất

File này là **input duy nhất** mà `scripts/xuat-ban-word.py` và mọi file `docs/bao-cao/*.md`
tham chiếu. Không lặp lại các con số này ở nơi khác trong repo — nếu cần đổi, đổi ở đây rồi
xuất bản lại.

Nguồn: `b0651a67-MauQuyDinhLuanVan_v1.1.pdf` (quy định hình thức, 5 trang, đọc toàn bộ),
`plans/260927-0624-bao-cao-do-an/nguon/de-cuong-chi-tiet-trich-xuat.txt` (đề cương chi tiết đã
duyệt, thông tin cá nhân/đề tài, 12 mục, đọc toàn bộ), và
`plans/260927-0624-bao-cao-do-an/nguon/bieu-mau-bm5-trich-xuat.txt` (biểu mẫu trình bày chính
thức BM5 do người dùng gửi, đọc toàn bộ — nguồn có thẩm quyền cao nhất cho các mục PDF ghi
"theo mẫu" hoặc bỏ ngỏ).

## 1. Thông tin đề tài (trích nguyên văn từ đề cương đã duyệt)

| Mục | Giá trị |
|---|---|
| Trường | Trường Đại học Trà Vinh |
| Đơn vị trực thuộc | Trường Kỹ thuật và Công nghệ |
| Khoa | Khoa Công nghệ Thông tin |
| Tên đề tài | XÂY DỰNG WEBSITE KẾT NỐI NGƯỜI TÌM VIỆC LÀM THÊM VỚI NHÀ TUYỂN DỤNG |
| Sinh viên thực hiện (SVTH) | Bùi Anh Khoa |
| MSSV | 170123594 |
| Lớp | DX23TT11 |
| Khóa | 2023–2027 |
| Giảng viên hướng dẫn (GVHD) | ThS. Trầm Hoàng Nam |
| Địa điểm - thời gian | Vĩnh Long, tháng 9 năm 2026 |
| Loại đồ án | Cơ sở ngành |

**Tiêu đề ngắn cho đầu trang** (để tránh bẫy OOXML #3 — tab stop hỏng nếu tiêu đề dài xuống 2
dòng): "Website kết nối việc làm thêm" (30 ký tự, không xuống dòng ở khổ A4/Times 13pt).

## 2. Hình thức trình bày (trích nguyên văn PDF mục 3)

| Hạng mục | Giá trị |
|---|---|
| Font | Unicode Times New Roman, 13pt |
| Giãn dòng | 1.5 lines |
| Cách đoạn | Before 6pt, After 6pt |
| Lề trên | 2 cm |
| Lề dưới | 2 cm |
| Lề trái | 3.0 cm |
| Lề phải | 2 cm |
| Vị trí số trang | Góc phải dưới |
| Đánh số chương/mục | Số Ả-rập, không La Mã; `Chương 3` → `3.1.` → `3.1.1.` → `3.1.2.` → `3.2.` |
| Định dạng tài liệu tham khảo | IEEE, đánh số theo **thứ tự từ điển** (alphabet theo tên tác giả/tổ chức đầu mục) |
| Số trang nội dung | Tối thiểu 30, không nên vượt quá 50 (không kể bìa/cảm ơn/mục lục/TLTK) — mục tiêu người dùng: ~45 |

## 3. Các quyết định đã chốt (một số đã ĐỔI LẠI sau khi có biểu mẫu BM5 chính thức)

| Quyết định | Lựa chọn đã chốt | Ghi chú |
|---|---|---|
| Bìa chính/bìa phụ/trang nhận xét GVHD ("theo mẫu") | **Đã có mẫu chính thức BM5** — dùng đúng bố cục/chữ trong `bieu-mau-bm5-trich-xuat.txt` | Không còn "chờ mẫu" — Phase 4 dùng nguyên văn BM5 |
| Số trang bắt đầu đếm từ đâu | **ĐÃ ĐỔI: bắt đầu từ CHƯƠNG 1 = trang 1** (theo đúng BM5: "Bắt đầu đánh số trang từ chương 1") | Quyết định cũ ("từ MỞ ĐẦU") đã bị BM5 phủ định trực tiếp — mọi trang trước Chương 1 (bìa, nhận xét, cảm ơn, mục lục, danh mục, **MỞ ĐẦU**) đều không đánh số |
| Nội dung chân trang | **GVHD bên trái · SVTH bên phải** | Xác nhận ĐÚNG theo mẫu trang nội dung của BM5 ("GVHD: ThS Nguyễn văn A .... SVTH: Trần Thị B") — không còn là lựa chọn tự thêm, là yêu cầu thật của biểu mẫu |
| Trang "NHẬN XÉT của cơ quan thực tập" (BM5 ghi "nếu có") | **Không thêm** | Đồ án không thực tập tại doanh nghiệp nào |
| Trang "NHẬN XÉT của GVHD" | **Thêm cả 2 kiểu** — (a) trang văn xuôi ngắn "NHẬN XÉT" và (b) biểu mẫu đầy đủ "BẢN NHẬN XÉT ĐỒ ÁN..." có tiêu đề UBND/Trường + 8 mục chấm điểm | Cả hai để TRỐNG phần nội dung/chữ ký — GVHD tự điền tay, script không tự sinh nhận xét |
| Trang "NHẬN XÉT của giảng viên chấm/cán bộ chấm" | **Thêm cả 2 kiểu**, cùng logic như trên | Theo đúng BM5 |

### Các quy tắc mới rút ra từ BM5 (không có trong PDF b0651a67, không mâu thuẫn với PDF đó)

- Mục lục tối đa **4 cấp** tiểu mục.
- Trong mục lục: tiêu đề chương và mục lớn phải **in đậm và in hoa**.
- Dòng ghi chú/nguồn ở cuối mỗi bảng/sơ đồ/hình là **bắt buộc thật** theo BM5 ("phải có ghi
  chú, giải thích, nêu rõ nguồn trích hoặc sao chụp") — không còn là quy ước riêng của quy
  trình này như ghi nhầm ở bản `quy-dinh.md` trước đó, đây là yêu cầu thật của trường.
- BM5 dùng 3 danh mục riêng: BẢNG, SƠ ĐỒ, HÌNH (đánh số riêng theo từng loại trong mỗi chương).
  **Quyết định đơn giản hóa** (đã dùng từ Phase 3 trước khi có BM5, giữ nguyên để không phải
  làm lại): gộp "sơ đồ" (kiến trúc/ERD/tuần tự) vào chung danh mục "Hình" — không tách riêng
  "Sơ đồ" — ghi rõ đây là lựa chọn đơn giản hóa, không phải sai lệch nghiêm trọng.
- **Mâu thuẫn CHƯA GIẢI QUYẾT, không chặn tiến độ:** BM5 minh họa "DANH MỤC TÀI LIỆU THAM
  KHẢO" theo kiểu Việt Nam/APA (Tên tác giả (năm), "tên bài", nơi xuất bản...), xếp theo ABC
  tên tác giả (người Việt xếp theo TÊN, không phải HỌ) — khác với PDF b0651a67 ("Sử dụng định
  dạng của IEEE"). PDF b0651a67 là văn bản quy định chính thức, nêu tên chuẩn cụ thể (IEEE);
  BM5 chỉ là ví dụ minh họa chung trong một tài liệu hướng dẫn nhiều mẫu. **Quyết định: giữ
  IEEE** (đúng PDF quy định + khớp 12 tài liệu tham khảo đã có sẵn trong đề cương, vốn đã viết
  theo IEEE) — nếu muốn chắc chắn hơn, nên hỏi trực tiếp GVHD trước khi nộp.

## 4. Mẫu trích dẫn IEEE (trích nguyên văn PDF mục 3)

- Bài đăng tạp chí: `Tên tác giả, tên bài báo, tên tạp chí, tập, số, năm và các trang.`
  Ví dụ: *S. Kumar, Superconvergence of a ..., IMA Journal of Numerial Analysis (7), 1987,
  pp. 313-325.*
- Bài báo cáo hội nghị: `Tên tác giả, Tên bài báo, Tên hội nghị, Tên tuyển tập các báo cáo,
  nơi và thời gian tổ chức các trang.` Ví dụ: *B.K. Paradopop, Fuzzy sets and fuzzy realational
  structures as Chu spaces, Proceedings of the First International Workshop on ...,
  Thessaloniki, Greece, Oct. 16-20, 1998, pp….*
- Sách: `Tên tác giả, tên sách, lần xuất bản, nhà xuất bản, nơi xuất bản, năm xuất bản.`
  Ví dụ: *A.N.Tikhonov, Solutions of Ill-Posed Problems, Willey, NewYork, 1997.*

## 5. Tên GitHub repo nộp bài (mục 4.1 PDF)

Cú pháp cơ sở ngành: `csn-<malop>-<hotenkhongdau>-<shortname>` → `csn-dx23tt11-buianhkhoa-<shortname>`.

**Còn thiếu:** `shortname` cụ thể và việc dùng lại repo `Recruit-Employee` hay tạo repo nộp
riêng — hỏi người dùng ở đầu Phase 10, không chặn Phase 1-9.

## 6. Những gì PDF b0651a67 KHÔNG tự quy định (đã được BM5 làm rõ — xem mục 3)

- Nội dung chân trang → BM5 xác nhận GVHD trái/SVTH phải.
- Mục lục tối đa mấy cấp, tiêu đề chương có in đậm/in hoa không → BM5: tối đa 4 cấp, chương/mục
  lớn in đậm in hoa.
- Dòng "Nguồn:" dưới hình/bảng có bắt buộc không → BM5: bắt buộc thật.
- Số trang bắt đầu đếm từ đâu → BM5: từ Chương 1.

Không còn điểm nào trong 4 mục trên là "tự suy đoán" nữa — tất cả đã có bằng chứng trực tiếp
từ biểu mẫu chính thức BM5. Điểm còn lại chưa giải quyết dứt điểm: định dạng tài liệu tham khảo
(xem "Mâu thuẫn CHƯA GIẢI QUYẾT" ở mục 3).
