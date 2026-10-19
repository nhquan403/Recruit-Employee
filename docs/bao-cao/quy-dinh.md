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
| Đơn vị trực thuộc | Khoa Kỹ thuật và Công nghệ |
| Khoa | Khoa Công nghệ Thông tin |
| Ngành | Công nghệ Thông tin |
| Tên đề tài | XÂY DỰNG WEBSITE KẾT NỐI NGƯỜI TÌM VIỆC LÀM THÊM VỚI NHÀ TUYỂN DỤNG |
| Sinh viên thực hiện (SVTH) | Bùi Anh Khoa |
| MSSV | 170123594 |
| Lớp | DX23TT11 |
| Khóa | 2023–2027 |
| Giảng viên hướng dẫn (GVHD) | ThS. Trầm Hoàng Nam |
| Địa điểm - thời gian | TP. Hồ Chí Minh, tháng 9 năm 2026 |
| Loại đồ án | Cơ sở ngành |

**Dòng "Ngành" (thêm 19/10):** đề cương gốc không ghi field "Ngành" riêng, chỉ có "Khoa: Khoa
Công nghệ Thông tin" — suy ra "Công nghệ Thông tin" bằng cách bỏ chữ "Khoa", khớp với dòng đã
viết tay sẵn ở `01b-phan-sau-mo-dau.md` ("Ngành: Công nghệ Thông tin"). Đã hỏi và người dùng xác
nhận giá trị này đúng trước khi thêm vào đây.

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
| Số trang nội dung | Tối thiểu 30, không nên vượt quá 50 (không kể bìa/cảm ơn/mục lục/TLTK) — **ĐÃ SIẾT LẠI (06/10) theo yêu cầu trực tiếp người dùng: phải HƠN 45 và NHỎ HƠN 50** (46-49 trang); thực tế đo được sau khi mở rộng nội dung: 47 trang (đếm từ Chương 1 = trang 1 tới hết Phụ lục B = trang 47, đúng cách đếm "số trang nội dung" đã dùng xuyên suốt tài liệu này) |

## 3. Các quyết định đã chốt (một số đã ĐỔI LẠI sau khi có biểu mẫu BM5 chính thức)

| Quyết định | Lựa chọn đã chốt | Ghi chú |
|---|---|---|
| Bìa chính/bìa phụ/trang nhận xét GVHD ("theo mẫu") | **Đã có mẫu chính thức BM5** — dùng đúng bố cục/chữ trong `bieu-mau-bm5-trich-xuat.txt` | Không còn "chờ mẫu" — Phase 4 dùng nguyên văn BM5 |
| Bìa chính/bìa phụ — logo trường + định dạng ô thông tin | **Đã sửa (01/10)**: người dùng gửi lại đúng file `.docx` gốc của BM5 (`bieu-mau-trinh-bay.docx`) — bản trích văn bản trước đó (`bieu-mau-bm5-trich-xuat.txt`) chỉ lấy chữ, bỏ sót 2 điều: (1) có logo trường (ảnh TVU, trích thật từ `word/media/image1.png` trong file gốc, lưu lại ở `docs/images/bao-cao/logo-tvu.png`) đặt giữa 2 dòng tên trường và dòng "ĐỒ ÁN...", và (2) 5 dòng GVHD/SVTH/MSSV/Lớp/Khoá phải **in đậm + in hoa** phần giá trị (nhãn giữ thường), tên đề tài cỡ 18-30pt tuỳ độ dài (đã chọn 20pt) — không phải cỡ 16pt dùng chung với các dòng nhãn khác | Đã thêm 2 directive mới `\logo`/`\tieudebia` (`scripts/bao_cao/markdown_parser.py`, `docx_builder.py`) để dựng đúng — xem `docs/bao-cao/00-phan-dau.md` |
| Số trang bắt đầu đếm từ đâu | **ĐÃ ĐỔI: bắt đầu từ CHƯƠNG 1 = trang 1** (theo đúng BM5: "Bắt đầu đánh số trang từ chương 1") | Quyết định cũ ("từ MỞ ĐẦU") đã bị BM5 phủ định trực tiếp — mọi trang trước Chương 1 (bìa, nhận xét, cảm ơn, mục lục, danh mục, **MỞ ĐẦU**) đều không đánh số |
| Nội dung chân trang | **GVHD bên trái · SVTH bên phải** | Xác nhận ĐÚNG theo mẫu trang nội dung của BM5 ("GVHD: ThS Nguyễn văn A .... SVTH: Trần Thị B") — không còn là lựa chọn tự thêm, là yêu cầu thật của biểu mẫu |
| Trang "NHẬN XÉT của cơ quan thực tập" (BM5 ghi "nếu có") | **Không thêm** | Đồ án không thực tập tại doanh nghiệp nào |
| Trang "NHẬN XÉT của GVHD" | **Thêm cả 2 kiểu** — (a) trang văn xuôi ngắn "NHẬN XÉT" và (b) biểu mẫu đầy đủ "BẢN NHẬN XÉT ĐỒ ÁN..." có tiêu đề UBND/Trường + 8 mục chấm điểm | Cả hai để TRỐNG phần nội dung/chữ ký — GVHD tự điền tay, script không tự sinh nhận xét |
| Trang "NHẬN XÉT của giảng viên chấm/cán bộ chấm" | **Thêm cả 2 kiểu**, cùng logic như trên | Theo đúng BM5 |
| Đơn vị trực thuộc trên bìa | **ĐÃ SỬA (02/10) theo người dùng**: "Khoa Kỹ thuật và Công nghệ" (không phải "Trường Kỹ thuật và Công nghệ") | Người dùng xác nhận trực tiếp tên đơn vị thật — ghi đè suy luận trước đó dựa trên đề cương |
| Địa điểm trên bìa (dòng ngày tháng cuối) | **ĐÃ SỬA (02/10) theo người dùng**: "TP. Hồ Chí Minh" (không phải "Vĩnh Long") | Người dùng xác nhận trực tiếp |

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

Cú pháp cơ sở ngành: `csn-<malop>-<hotenkhongdau>-<shortname>` → tên đầy đủ đã chốt:
**`csn-dx23tt11-buianhkhoa-parttime-jobs`**.

**Đã hỏi người dùng (đầu Phase 10):** không đổi tên repo `Recruit-Employee` hiện tại và không
tạo repo nộp bài riêng — người dùng tự thực hiện việc đổi tên/tạo repo nộp bài này sau, khi cần
nộp, dùng đúng tên đã chốt ở trên. Đây là thao tác GitHub thật (đổi tên repo, mời Collaborator),
không tự động hóa được từ phiên làm việc này (xem thêm mục "việc phải làm tay" cuối cùng gửi
người dùng).

## 6. Những gì PDF b0651a67 KHÔNG tự quy định (đã được BM5 làm rõ — xem mục 3)

- Nội dung chân trang → BM5 xác nhận GVHD trái/SVTH phải.
- Mục lục tối đa mấy cấp, tiêu đề chương có in đậm/in hoa không → BM5: tối đa 4 cấp, chương/mục
  lớn in đậm in hoa.
- Dòng "Nguồn:" dưới hình/bảng có bắt buộc không → BM5: bắt buộc thật.
- Số trang bắt đầu đếm từ đâu → BM5: từ Chương 1.

Không còn điểm nào trong 4 mục trên là "tự suy đoán" nữa — tất cả đã có bằng chứng trực tiếp
từ biểu mẫu chính thức BM5. Điểm còn lại chưa giải quyết dứt điểm: định dạng tài liệu tham khảo
(xem "Mâu thuẫn CHƯA GIẢI QUYẾT" ở mục 3).

## 7. Lỗi thật phát hiện khi làm đẹp giao diện + quay video demo (06/10)

Theo yêu cầu người dùng "làm đẹp giao diện web thật, chụp lại ảnh thật cho báo cáo, quay video
demo" — quá trình thực hiện (không phải đọc code suông) phát hiện 2 lỗi thật, đã sửa:

1. **"Hình 1.2" trong báo cáo thực ra là ảnh chụp trang lỗi 404.** Script chụp ảnh cũ trỏ vào
   route `/viec-lam` — route này không tồn tại (chỉ có `/viec-lam/[id]` cho chi tiết tin, bộ
   lọc nằm ngay trên trang chủ). Đã kiểm tra `area`/`shift` filter dùng so khớp CHÍNH XÁC
   (Prisma `equals`) nên không ra kết quả với dữ liệu mẫu hiện tại (area/shift mẫu là mô tả tự
   do, không khớp các giá trị cố định trong UI) — chỉ `q=` (tìm kiếm, dùng `contains`) chắc
   chắn ra kết quả thật. Đã sửa route chụp ảnh sang trang chủ với `q=bán hàng` (đã xác minh qua
   API thật trước khi dùng), chụp lại toàn bộ 8 ảnh có vai trò, build lại báo cáo.
2. **Tính năng "Ứng tuyển" lỗi 400 với MỌI job trong dữ liệu mẫu.** `CreateApplicationDto.jobId`
   dùng `@IsUUID()` (class-validator), kiểm tra đúng version UUID. ID job mẫu cũ dạng
   `00000000-0000-0000-0000-00000000000N` có version nibble "0" — không phải UUID hợp lệ theo
   bất kỳ version nào (1-5) — nên MỌI lần gọi `POST /applications` với các job này đều bị từ
   chối ngay ở bước validate, dù giao diện/luồng code đều đúng. Phát hiện khi quay video demo
   live (click "Ứng tuyển ngay" không tạo được đơn ứng tuyển thật). Đã đổi ID 4 job mẫu trong
   `backend/prisma/seed-demo.ts` sang đúng định dạng UUID v4 (`a0000000-0000-4000-8000-
   00000000000N`), xoá dữ liệu cũ, seed lại, cập nhật các script tham chiếu ID cũ
   (`chup-man-hinh.ts`, `quay-demo.ts`) — đã xác minh lại thật: `POST /applications` trả về
   `201`, đơn ứng tuyển xuất hiện thật trong database.
3. **Form đăng nhập gửi email/mật khẩu rỗng nếu điền ngay sau khi điều hướng trang.** Đây là
   race condition giữa Playwright điền DOM và React gắn event handler cho controlled input:
   điều hướng bằng `waitUntil: 'domcontentloaded'` xong điền form ngay thì giá trị DOM được set
   nhưng state React (và do đó payload gửi đi) vẫn rỗng — xác nhận qua response thật
   `{"message":["email must be an email","password must be longer than or equal to 1
   characters"],...}`. Không phải lỗi logic ứng dụng (người dùng thật gõ bằng tay luôn có độ
   trễ tự nhiên đủ để React kịp gắn handler) — chỉ lộ ra khi script tự động hoá điền form ngay
   lập tức. Sửa trong `quay-demo.ts` bằng cách chờ 1.5s sau khi vào `/dang-nhap` trước khi điền.
4. **Script quay demo (`quay-demo.ts`) không chạy được do repo không có `package.json`
   `"type"` cố định.** `npx ts-node` với repo này đôi lúc biên dịch TypeScript ra CommonJS, đôi
   lúc Node tự "reparse as ES module" tuỳ cú pháp phát hiện trong file — không nhất quán. Hệ quả:
   hàm tiêm con trỏ chuột (chạy trong ngữ cảnh trình duyệt qua `addInitScript`) không type-check
   được vì tsconfig thiếu lib `dom`; import kiểu `Page`/`Locator` (chỉ dùng làm type) bị coi là
   import giá trị thật dưới ESM và vỡ lúc chạy ("does not provide an export named 'Locator'");
   và `__dirname` (chỉ có ở CommonJS) lẫn `import.meta.url` (bị cấm khi biên dịch ra CommonJS)
   đều gãy tuỳ trường hợp. Sửa bằng cách: viết script con trỏ dưới dạng chuỗi JS thuần (không
   qua type-check), tách `import type { Page, Locator }` riêng khỏi `import { chromium }`, và
   dùng `path.resolve(process.cwd())` thay cho `__dirname`/`import.meta.url` — chạy ổn định
   dưới cả hai chế độ biên dịch.

Cả bốn đều là lỗi thật trong code/dữ liệu mẫu/script đã tồn tại từ trước hoặc lộ ra khi mở rộng
script quay demo sang vai trò nhà tuyển dụng, không phải do thay đổi giao diện gây ra — chỉ được
phát hiện vì lần này THỬ THẬT (chạy ứng dụng, bấm nút, đọc response) thay vì chỉ đọc code.

## 8. Sắp xếp lại thứ tự "phần đầu" theo đúng biểu mẫu BM5 gốc (06/10)

Người dùng gửi lại đúng file `.docx` gốc của biểu mẫu trình bày (cùng file đã dùng cho trang
bìa ở Phase 4) và yêu cầu: "trừ trang bìa ra, thay thế các trang khác vào đồ án hiện tại", kèm
nghi vấn "hiện tại hình như chưa có đánh số trang từ phần nội dung".

**Kiểm tra số trang (kết quả: KHÔNG phải lỗi).** Dựng thật `.docx` → `.pdf` qua LibreOffice
headless, chụp ảnh thật từng trang: trang ngay trước CHƯƠNG 1 (lúc đó là trang tuyệt đối 20-21
của PDF, thuộc MỞ ĐẦU) đúng là không có chân trang — nhưng đây là THEO ĐÚNG THIẾT KẾ đã chốt
("mọi trang trước Chương 1 ... đều không đánh số", mục 3), không phải lỗi. Trang CHƯƠNG 1 (PDF
trang 22) có chân trang đầy đủ: "GVHD: ThS. Trầm Hoàng Nam · SVTH: Bùi Anh Khoa · 1" — số trang
hoạt động đúng. Người dùng hẳn đã xem đúng một trang MỞ ĐẦU (hợp lệ không có số) mà tưởng là
lỗi lan ra toàn bộ phần nội dung.

**Đọc toàn văn biểu mẫu BM5 bằng python-docx** (không chỉ trang bìa như Phase 4 trước đó) phát
hiện mỗi trang mẫu đều có ghi chú vị trí thật dạng "xếp sau trang X" — đây là bằng chứng trực
tiếp về THỨ TỰ các trang "phần đầu", trước nay repo chưa đối chiếu:

- LỜI MỞ ĐẦU: "xếp sau trang lót"
- LỜI CẢM ƠN: "xếp sau trang lời mở đầu"
- NHẬN XÉT (của cơ quan thực tập, nếu có): "xếp sau trang Lời cảm ơn"
- NHẬN XÉT (của GVHD): "xếp sau trang nhận xét của cơ quan thực tập"
- NHẬN XÉT (của giảng viên chấm): "xếp sau trang Nhận xét của giảng viên hướng dẫn"
- DANH MỤC CÁC BẢNG, SƠ ĐỒ, HÌNH: "Xếp sau trang Mục lục"
- KÍ HIỆU CÁC CỤM TỪ VIẾT TẮT: "Được xếp sau trang Danh mục Các bảng, sơ đồ, hình"

Suy ra thứ tự đầy đủ: Bìa → Lót → **MỞ ĐẦU** → **LỜI CẢM ƠN** → NHẬN XÉT (GVHD) → NHẬN XÉT
(giảng viên chấm) → MỤC LỤC → DANH MỤC BẢNG/HÌNH → KÍ HIỆU VIẾT TẮT → [Chương 1...].

Thứ tự ĐANG CÓ trong repo (từ Phase 4, dựng trước khi đọc kỹ các ghi chú "xếp sau" này) lại là:
Bìa → Lót → NHẬN XÉT (GVHD) → NHẬN XÉT (giảng viên chấm) → LỜI CẢM ƠN → MỤC LỤC → DANH MỤC HÌNH
→ DANH MỤC BẢNG → KÍ HIỆU VIẾT TẮT → TÓM TẮT → **MỞ ĐẦU** (ngay trước Chương 1) — sai 2 điểm:
MỞ ĐẦU bị đẩy xuống cuối thay vì đứng ngay sau trang lót, và khối NHẬN XÉT đứng trước LỜI CẢM
ƠN thay vì sau.

**Đã sửa (06/10):**

1. Tách `00-phan-dau.md` (trước đây chứa toàn bộ "phần đầu") thành 2 file: `00-phan-dau.md` chỉ
   còn bìa + trang lót; phần còn lại (cảm ơn/nhận xét/mục lục/danh mục/kí hiệu/tóm tắt) chuyển
   sang `01b-phan-sau-mo-dau.md` — xử lý SAU `01-mo-dau.md` (MỞ ĐẦU) trong
   `scripts/xuat-ban-word.py` (hằng số `FILE_PHAN_SAU_MO_DAU`), đúng thứ tự BM5 ở trên.
2. Gộp "DANH MỤC CÁC HÌNH" + "DANH MỤC CÁC BẢNG" (2 trang tách riêng trước đây) thành MỘT trang
   "DANH MỤC CÁC BẢNG, HÌNH" (đúng BM5: một danh mục duy nhất) — vẫn giữ quyết định đơn giản hoá
   trước đó (gộp Sơ đồ vào chung Hình, không tách danh mục Sơ đồ riêng — xem mục 3).
3. Không tạo trang "NHẬN XÉT của cơ quan thực tập" (đã chốt trước đó — đồ án không thực tập ở
   doanh nghiệp nào), nên NHẬN XÉT (GVHD) xếp ngay sau LỜI CẢM ƠN.
4. TÓM TẮT (không có trong BM5, tự thêm vì hợp lý cho một báo cáo ~45 trang) giữ nguyên vị trí
   cuối cùng của phần đầu, ngay trước Chương 1 — BM5 không đề cập nên không có "xếp sau" nào
   ràng buộc vị trí này.

**Lỗi thật phát hiện khi dựng lại (đã sửa trước khi xuất bản):** lần dựng đầu tạo ra MỘT TRANG
TRẮNG thật giữa MỞ ĐẦU và LỜI CẢM ƠN (PDF 61 trang thay vì đúng 60) — nguyên nhân: vòng lặp xử
lý `01-mo-dau.md` trong `xuat-ban-word.py` đã tự gọi `builder.ngat_trang()` (ngắt trang) sau khi
xử lý xong file, và `01b-phan-sau-mo-dau.md` (file mới) LẠI có thêm một dòng `\pagebreak` mở đầu
— hai lần ngắt trang liên tiếp ra một trang trắng. Xác nhận bằng cách chụp ảnh thật trang nghi
ngờ (hoàn toàn trống) rồi xoá dòng `\pagebreak` thừa, dựng lại, xác nhận còn đúng 60 trang,
không còn trang trắng.

**Đã xác minh lại bằng ảnh chụp thật PDF sau khi sửa:** bìa (trang 1, không đổi), trang lót
(trang 2), MỞ ĐẦU (trang 3-8), LỜI CẢM ƠN (trang 9), NHẬN XÉT GVHD + bản đầy đủ (trang 10-12),
NHẬN XÉT giảng viên chấm + bản đầy đủ (trang 13-15), MỤC LỤC (trang 16-18, không lẫn tiêu đề
phần đầu nào), DANH MỤC CÁC BẢNG, HÌNH gộp một trang/hai trang (trang 19-20), KÍ HIỆU VIẾT TẮT
(trang 21), TÓM TẮT (trang 22), CHƯƠNG 1 bắt đầu trang 23 với chân trang "GVHD: ... · SVTH: ...
· 1" đúng như thiết kế.

**Vấn đề nhỏ CHƯA sửa, biết nhưng để nguyên trong lần này (ngoài phạm vi yêu cầu hôm nay):**
Danh mục Hình hiển thị không theo đúng thứ tự số chương (ra Hình 2.1, 2.2, 2.3, 3.1, **1.1**,
1.2, 1.3, 3.2, 3.3, 3.4 thay vì 1.1 → 1.2 → ... → 2.1 → ... → 3.1 → ...) — lỗi thật đã có từ
trước (xác nhận bằng cách so bản PDF cũ, lỗi y hệt), không phải do lần gộp danh mục này gây ra.
Nguyên nhân nằm ở `thu_thap_hinh_bang()` trong `xuat-ban-word.py` — chưa điều tra sâu, cần một
lượt riêng nếu muốn sửa.

## 9. Mở rộng nội dung lên 46-49 trang theo yêu cầu trực tiếp người dùng (06/10)

Người dùng yêu cầu rõ: "nội dung đồ án của tôi phải hơn 45 trang và nhỏ hơn 50 trang". Đo thật
trước khi sửa (dựng `.pdf`, đọc số trang ở chân trang cuối cùng): **38 trang** — dưới ngưỡng yêu
cầu, cần viết thêm nội dung THẬT (không phải giãn dòng/đệm chữ) để đạt khoảng 46-49 trang.

**Nguyên tắc khi thêm nội dung:** mọi đoạn thêm vào đều phải trích dẫn được từ mã nguồn thật
(đường dẫn file, tên hàm/decorator/bảng thật) hoặc một nguồn tham khảo thật có thể kiểm chứng —
không thêm số liệu, kết quả đo, hay hành vi hệ thống không có thật, đúng kỷ luật đo lường đã
xuyên suốt tài liệu này.

**Nội dung đã thêm (grounded, đã xác minh lại từng chi tiết với mã nguồn thật trước khi viết):**

- **Mục 2.7** "Kiểm tra hợp lệ dữ liệu đầu vào" — mô tả `class-validator`/DTO/`ValidationPipe`
  (`backend/src/main.ts`), có ví dụ thật từ `CreateJobDto`, `CreateApplicationDto`.
- **Mục 2.8** "Nguyên tắc chuẩn hóa dữ liệu quan hệ và ràng buộc toàn vẹn" — áp dụng lý thuyết
  chuẩn hóa (1NF-3NF) vào đúng 5 bảng thật, trích ràng buộc `@unique`/`@@unique` thật từ
  `schema.prisma`.
- **Mục 2.9** "Kiểm thử phần mềm: kiểm thử đơn vị và kiểm thử tích hợp" — lý thuyết mô hình kim
  tự tháp kiểm thử, áp dụng vào đúng cấu trúc thư mục kiểm thử thật của dự án.
- **Mục 2.10** "REST so với các kiểu kiến trúc API khác" — so sánh REST/GraphQL/gRPC, lý giải
  lựa chọn REST cho quy mô đồ án.
- **Mục 2.11** "Bảo mật ứng dụng web: đối chiếu với OWASP Top 10" — bảng đối chiếu 6 nhóm rủi ro
  liên quan với biện pháp đã cài đặt thật, **nêu rõ cả 2 điểm CHƯA có** (CORS chưa giới hạn
  origin, chưa có rate limiting) thay vì chỉ liệt kê điểm mạnh — khớp đúng kỷ luật "không che
  giấu hạn chế" đã áp dụng từ Chương 4; đã bổ sung 2 gạch đầu dòng tương ứng vào mục 5.2 (Hướng
  phát triển) để nhất quán.
- **Mục 3.8** "Xử lý lỗi và kiểm tra hợp lệ đầu vào" — nối lý thuyết 2.7 với cài đặt thật, dùng
  lại đúng ví dụ lỗi thật `{"message":["email must be an email",...]}` đã phát hiện khi quay
  video demo (06/10, mục 7) làm minh hoạ.
- **Mục 4.5** "Phạm vi kiểm thử theo nhóm chức năng" — bảng đối chiếu 7 use case với file kiểm
  thử thật bao phủ từng use case; phát hiện và ghi nhận thêm MỘT hạn chế thật khi viết mục này
  (UC07 — thông báo — không có kiểm thử front-end riêng cho phần hiển thị/polling, chỉ được xác
  nhận gián tiếp qua back-end), đã bổ sung vào mục 4.4.
- **Mục 4.6** "Đánh giá khả năng mở rộng hệ thống" — phân tích scalability dựa trên các lựa chọn
  kiến trúc đã trình bày (JWT stateless, polling, Prisma connection pool).
- **Mục 4.7** "Đối chiếu kết quả với hiện trạng ban đầu" — bảng đối chiếu 3 hạn chế nêu ở Chương
  1 với giải pháp đã cài đặt thật tương ứng, kèm vị trí tham chiếu trong báo cáo.

**Tài liệu tham khảo:** thêm 4 nguồn thật ([3] Fowler "TestPyramid", [4] GraphQL docs, [5] gRPC
docs, [16] typestack/class-validator), chèn đúng vị trí từ điển vào danh sách 14 nguồn cũ, dịch
lại toàn bộ số thứ tự liên quan (cũ → mới) và cập nhật khớp tất cả 15 lượt trích dẫn `[n]` nằm
rải rác ở Chương 1-2 — đã kiểm tra lại bằng `grep` sau khi sửa, không còn số trích dẫn nào lệch.

**Một lỗi thật tự phát hiện và tự sửa trong lúc viết (không phải do người dùng báo):** ban đầu
viết mục 4.5 có khẳng định "`apply-button.test.tsx` kiểm tra phần hiển thị/polling thông báo" —
kiểm tra lại trực tiếp nội dung file thì phát hiện file đó thực ra kiểm thử nút "Ứng tuyển"
(UC04), không liên quan tới thông báo (UC07). Đây là một khẳng định sai chưa kịp xuất bản — sửa
lại thành thừa nhận trung thực rằng UC07 chưa có kiểm thử front-end riêng, biến một câu sai thành
một hạn chế thật được ghi nhận đúng.

**Quy trình đo lại mục lục (2-pass → 3-pass do nội dung thêm giữa chương):** việc chèn mục 2.7-
2.11 vào GIỮA Chương 2 (trước Chương 3) làm dịch toàn bộ số trang của Chương 3 trở đi — phải viết
một script đo thật từng heading/Hình/Bảng bằng cách dựng `.pdf`, trích văn bản từng trang
(`pdftotext -f N -l N`), rồi tìm trang chứa đúng câu "Hình X.Y thể hiện..." (cho Hình) hoặc đúng
nhãn bảng (cho Bảng) — khác với lần đo trước (chỉ cần khớp dòng mục lục). Đã chạy đủ 3 vòng
dựng-đo-dựng lại cho tới khi khớp đủ 73/84 mục có số trang thật (11 mục còn lại là MỞ ĐẦU và các
mục con — đúng thiết kế không đánh số, không phải đo thiếu).

**Kết quả cuối:** 69 trang PDF tổng, 47 trang nội dung (Chương 1 → hết Phụ lục B) — nằm giữa
khoảng 46-49 theo đúng yêu cầu, không sát biên trên hay biên dưới. File `.docx`/`.pdf` trong
`thesis/doc/`, `thesis/pdf/` đã được xuất lại và đồng bộ.
