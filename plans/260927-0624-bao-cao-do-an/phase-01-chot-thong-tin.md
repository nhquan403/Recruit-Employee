---
phase: 1
title: "Chốt thông tin còn thiếu & đặc tả quy định máy đọc được"
status: pending
priority: P1
effort: "0.5d"
dependencies: []
---

# Phase 1: Chốt thông tin còn thiếu & đặc tả quy định máy đọc được

## Goal
Trước khi viết bất kỳ nội dung hay code nào: (1) hỏi và nhận đủ các quyết định/thông tin mà
file quy định KHÔNG có sẵn, và (2) đúc toàn bộ con số đã đọc được từ PDF quy định thành một
file `docs/bao-cao/quy-dinh.md` duy nhất — nguồn sự thật cho cả script lẫn người viết nội
dung, để không có chỗ nào trong dự án tự diễn giải khác nhau về cùng một con số.

## Context Links
- Tổng quan & bảng trích quy định: `./plan.md`
- Nguồn: `b0651a67-MauQuyDinhLuanVan_v1.1.pdf` (đã đọc toàn bộ 5 trang, trích trong plan.md)

## Key Insights
- File quy định chỉ có 5 trang và không kèm file mẫu bìa/nhận xét — đây là khoảng trống thật,
  không phải do đọc thiếu.
- Ba mục hình thức phổ biến trong các trường khác (chân trang GVHD/SVTH, mục lục tối đa 4
  cấp in đậm in hoa, bắt buộc dòng "Nguồn:" dưới hình/bảng) **không xuất hiện** trong văn bản
  đã đọc. Không tự thêm các luật đó rồi trình bày như thể chúng có trong quy định — nếu muốn
  áp dụng cho đẹp, phải nói rõ đó là lựa chọn trình bày, không phải điều khoản bắt buộc.
- Đồ án này thuộc loại **chuyên ngành** (người dùng xác nhận ở yêu cầu) → dùng tiền tố
  `cn-` khi đối chiếu quy ước đặt tên GitHub repo ở Phase 10, không phải `csn-`.

## Requirements

### Câu hỏi cần hỏi qua AskUserQuestion (chọn 1 trong các lựa chọn, không suy đoán)
1. **Bìa chính/bìa phụ/trang nhận xét GVHD** — quy định ghi "theo mẫu" nhưng không kèm file:
   - (a) Người dùng sẽ gửi file mẫu (BM...) sau, phase này tạm bỏ qua 3 trang đó
   - (b) Không có file mẫu, tự thiết kế hợp lý theo chuẩn học thuật phổ biến, ghi rõ trong
     `README.md` là "chưa đối chiếu mẫu chính thức của trường"
   - (c) Bỏ hẳn 3 trang này khỏi Markdown/script, người dùng tự ghép tay vào bản `.docx` cuối
2. **Số trang bắt đầu đếm từ đâu** (PDF chỉ nói "góc phải dưới", không nói điểm bắt đầu):
   - (a) Bắt đầu từ MỞ ĐẦU = trang 1; các trang trước đó không đánh số (phổ biến nhất)
   - (b) Số La Mã (i, ii...) cho phần trước Mở đầu, số Ả Rập bắt đầu lại từ Mở đầu
   - (c) Đánh số liên tục từ trang bìa phụ
3. **Nội dung chân trang** (PDF không yêu cầu gì):
   - (a) Để trống — bám sát đúng những gì quy định thực sự yêu cầu
   - (b) Thêm GVHD bên trái · SVTH bên phải (quy ước phổ biến ở trường khác, không phải yêu
     cầu của quy định này)
   - (c) Nội dung khác do người dùng chỉ định

### Thông tin cần hỏi bằng văn bản tự do (không phải trắc nghiệm)
- Tên đề tài chính thức (tiếng Việt, có thể kèm tiếng Anh)
- Họ tên sinh viên thực hiện (SVTH), MSSV, lớp (mã lớp, VD `da21tta`)
- Họ tên giảng viên hướng dẫn (GVHD), học hàm/học vị nếu có
- Tên khoa, tên trường đầy đủ
- Học kỳ - năm học thực hiện đồ án
- `shortname` dự án dùng để đối chiếu quy ước tên GitHub repo ở mục 4.1 PDF
  (`cn-<malop>-<hotenkhongdau>-<shortname>`) — có thể đề xuất `vieclamthemn` hoặc tương tự,
  để người dùng xác nhận hoặc đổi

### File đặc tả `docs/bao-cao/quy-dinh.md` cần tạo (sau khi có câu trả lời)
Một bảng/checklist duy nhất liệt kê: font, size, line spacing, before/after spacing, 4 lề,
vị trí số trang, quy tắc đánh số chương/mục, format IEEE (kèm 3 mẫu ví dụ nguyên văn từ PDF),
cộng với 3 quyết định vừa chốt ở trên (bìa, số trang bắt đầu, chân trang) và toàn bộ thông
tin cá nhân/đề tài. File này là input duy nhất mà Phase 2 (script) và Phase 4 (viết bìa/nhận
xét) đọc — không lặp lại các con số này rải rác ở nơi khác trong repo.

## Related Code Files
- Create: `docs/bao-cao/quy-dinh.md`

## Implementation Steps
1. Gọi `AskUserQuestion` với 3 câu hỏi trắc nghiệm ở trên (mỗi câu có lựa chọn khuyến nghị
   được đánh dấu, nhưng để người dùng tự chọn — không tự quyết thay).
2. Hỏi bằng văn bản thường (không phải trắc nghiệm) toàn bộ thông tin cá nhân/đề tài liệt kê
   ở trên trong cùng một lượt.
3. Sau khi có đủ trả lời, viết `docs/bao-cao/quy-dinh.md` tổng hợp — mọi con số copy nguyên
   văn từ PDF (không làm tròn, không đổi đơn vị), mọi quyết định ghi rõ "theo lựa chọn của
   người dùng, không phải điều khoản quy định" ở những chỗ PDF không có quy định.
4. Nếu người dùng chọn phương án (a) ở câu hỏi 1 (sẽ gửi file mẫu sau) — ghi rõ trong
   `quy-dinh.md` rằng 3 trang bìa/nhận xét là "chờ file mẫu", để Phase 4 biết dừng ở đâu.

## Todo List
- [ ] Đã hỏi và nhận đủ 3 quyết định hình thức (bìa, số trang, chân trang)
- [ ] Đã hỏi và nhận đủ thông tin cá nhân/đề tài/shortname repo
- [ ] `docs/bao-cao/quy-dinh.md` viết xong, mọi con số đối chiếu đúng PDF gốc

## Success Criteria
- Không còn placeholder kiểu "TODO: hỏi sau" cho bất kỳ mục nào ở trên trong `quy-dinh.md`
  — trừ trường hợp người dùng chủ động chọn để trống (VD: chưa có file mẫu bìa).
- Đọc lại `quy-dinh.md` không thấy con số nào không truy được nguồn (PDF gốc hoặc quyết định
  của người dùng).

## Risk Assessment
- **Rủi ro:** đoán thay người dùng để "cho nhanh" — đúng thứ mà cả quy định gốc của người
  dùng (không suy đoán) lẫn kinh nghiệm thực tế của họ (một câu bịa từng lọt vào bản nộp)
  đều cấm. **Giảm thiểu:** phase này không có bước "tự quyết mặc định nếu không hỏi" — nếu
  vì lý do nào đó không hỏi được, phase dừng lại và báo rõ, không tự chọn phương án (a)/(b)/(c)
  thay người dùng.

## Security Considerations
- Không áp dụng (không xử lý dữ liệu nhạy cảm ngoài tên riêng công khai trên bìa báo cáo).

## Next Steps
- Phase 2 và Phase 3 có thể bắt đầu song song ngay sau khi phase này xong (không phụ thuộc
  thông tin cá nhân). Phase 4 (viết bìa/nhận xét) bắt buộc chờ phase này.
