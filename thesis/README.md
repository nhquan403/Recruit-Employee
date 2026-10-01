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

## Không tạo (nêu rõ lý do, không bỏ sót)

- **`html/`** — quy định liệt kê thư mục này cho "tài liệu dạng web"; đồ án này không có bản
  xuất HTML riêng (chỉ có `.docx`/`.pdf`), nên không tạo thư mục rỗng.
- **`abs/`** — quy định dùng cho slide thuyết trình (`.PPT`, `.AVI`); chưa có slide thuyết
  trình nào được yêu cầu/soạn trong phạm vi công việc đã làm. Nếu cần, hãy yêu cầu tạo riêng.
