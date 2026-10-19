# thesis/ — tài liệu đồ án nộp theo quy định mục 4.3

Thư mục này tổ chức theo đúng hướng dẫn mục 4.3 của quy định trình bày đồ án
(`b0651a67-MauQuyDinhLuanVan_v1.1.pdf`): "thesis: [bắt buộc] chứa các tập tin tài liệu văn bản
của Đồ án". Nguồn thật của báo cáo là Markdown ở `docs/bao-cao/*.md` — các file trong `doc/` và
`pdf/` dưới đây là **bản xuất**, sinh bằng `python3 scripts/xuat-ban-word.py` (xem
`docs/bao-cao/quy-dinh.md` để biết quy trình xuất bản đầy đủ). Khi nội dung báo cáo thay đổi,
chạy lại script rồi copy đè file mới vào đây — không sửa tay file trong `doc/`/`pdf/`.

## Các thư mục con

- **`doc/`** — bản `.docx` cuối cùng (`BaoCao-CSN-DX23TT11-BuiAnhKhoa.docx`).
- **`pdf/`** — bản `.pdf` cuối cùng, chuyển từ `.docx` bằng LibreOffice headless
  (`BaoCao-CSN-DX23TT11-BuiAnhKhoa.pdf`).
- **`refs/`** — xem `refs/README.md`: 14 tài liệu tham khảo đều là nguồn trực tuyến (RFC,
  trang sản phẩm, tài liệu framework), trỏ thẳng tới `docs/bao-cao/07-tai-lieu-tham-khao.md`
  thay vì sao chép lại nội dung bên thứ ba vào repo.
- **`abs/`** — `demo-user-admin.mp4` (~117 giây): video demo quay THẬT bằng Playwright điều
  khiển trình duyệt thật trên ứng dụng đang chạy (không dựng/ghép ảnh tĩnh), đủ ba vai trò:
  (1) ứng viên — tìm việc, lọc, xem chi tiết, đăng nhập, ứng tuyển thật, xem thông báo, hồ sơ;
  (2) nhà tuyển dụng — đăng tin tuyển dụng mới (điền form thật), xem "Tin của tôi", cập nhật
  trạng thái một ứng viên; (3) quản trị viên — tổng quan thống kê, duyệt tin thật (gồm tin nhà
  tuyển dụng vừa đăng), xem lại trạng thái sau khi duyệt, danh sách người dùng. Có con trỏ
  chuột hiển thị trong video (tiêm qua `context.addInitScript`, Playwright không vẽ cursor theo
  mặc định) và gõ form từng ký tự như người thật (`locator.pressSequentially`, không dùng
  `.fill()`). Script quay: `scripts/bao_cao_hinh/quay-demo.ts`.

## Không tạo (nêu rõ lý do, không bỏ sót)

- **`html/`** — quy định liệt kê thư mục này cho "tài liệu dạng web"; đồ án này không có bản
  xuất HTML riêng (chỉ có `.docx`/`.pdf`), nên không tạo thư mục rỗng.

## Hai thư mục thêm 19/10 — KHÔNG thuộc danh sách bắt buộc mục 4.3 ở trên

Phục vụ một yêu cầu nộp bài RIÊNG của học phần (mục 6.3 hướng dẫn học phần: nộp 1 file nén gồm
báo cáo Word + bản thuyết trình PowerPoint có link video + mã nguồn lên LMS) — không nhầm với
cấu trúc `thesis/` mục 4.3 ở trên.

- **`pptx/`** — bản thuyết trình `.pptx`, dựng từ `scripts/noi-dung-slide.py` (nguồn nội dung
  duy nhất) bằng `scripts/tao-slide.py`.
- **`kich-ban/`** — kịch bản nói (`.md`/`.docx`/`.pdf`), dựng từ cùng nguồn bằng
  `scripts/tao-kich-ban.py` + `scripts/xuat-kich-ban-in.py`.

Xem `docs/huong-dan-nop-bai.md` cho quy trình nộp bài đầy đủ, và
`scripts/dong-goi-nop-bai.sh` để đóng gói file nén nộp LMS.
