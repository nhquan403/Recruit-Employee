# progress-report/ — báo cáo tiến độ

Thư mục này tồn tại theo đúng yêu cầu "[bắt buộc]" của mục 4.3, quy định trình bày đồ án
(`b0651a67-MauQuyDinhLuanVan_v1.1.pdf`): "progress-report: [bắt buộc] chứa các báo cáo tiến độ."

## Lưu ý quan trọng — đọc trước khi nộp

Quy định mục 4.1(d) kỳ vọng lịch sử commit thể hiện tiến độ làm việc trải dài, tối thiểu một
lần một tuần, và dùng lịch sử đó làm một tiêu chí chấm điểm. **Lịch sử commit thật của repo này
không phản ánh điều đó**: toàn bộ mã nguồn và báo cáo được xây dựng với sự hỗ trợ của Claude
(AI pair-programming) trong hai phiên làm việc dồn nén, gói trong 2 ngày thực tế
(`git log` cho thấy toàn bộ 19 commit nằm trong 2026-09-26 và 2026-09-27), không phải tiến độ
trải dài nhiều tuần như quy định hình dung.

Hai file báo cáo dưới đây được viết lại trung thực theo đúng lịch sử commit thật (không bịa đặt
tiến độ theo tuần giả định) — mỗi file mô tả đúng những gì đã hoàn thành trong phiên làm việc
tương ứng. **Trước khi nộp, sinh viên cần tự quyết định cách trình bày việc này với GVHD/bộ
môn** — ví dụ: trình bày rõ phương pháp thực hiện có hỗ trợ AI, hoặc tiếp tục tự phát triển thêm
theo tiến độ thật của riêng mình để lịch sử commit từ nay phản ánh đúng nhịp độ làm việc hàng
tuần theo đúng tinh thần quy định.

## Danh sách báo cáo

- [`2026-09-26-phase-1-8-ung-dung.md`](./2026-09-26-phase-1-8-ung-dung.md) — xây dựng ứng dụng
  full-stack (Phase 1-8: scaffold, auth/RBAC, các luồng nghiệp vụ theo vai trò, thông báo, kiểm
  thử, Docker Compose demo).
- [`2026-09-27-phase-1-10-bao-cao.md`](./2026-09-27-phase-1-10-bao-cao.md) — xây dựng pipeline
  Markdown → `.docx` và viết nội dung báo cáo đồ án (Phase 1-10 của kế hoạch báo cáo).
