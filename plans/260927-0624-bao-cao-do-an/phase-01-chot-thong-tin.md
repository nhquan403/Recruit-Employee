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
- Nguồn 1 (hình thức): `b0651a67-MauQuyDinhLuanVan_v1.1.pdf` (đã đọc toàn bộ 5 trang, trích
  trong plan.md)
- Nguồn 2 (nội dung/thông tin cá nhân): `./nguon/de-cuong-chi-tiet-trich-xuat.txt` +
  `./nguon/de-cuong-hinh-1.jpeg` + `./nguon/de-cuong-hinh-2.png` (đề cương đã duyệt, đọc toàn
  bộ 12 mục, trích trong plan.md mục "Nguồn tham chiếu thứ hai")

## Key Insights
- File quy định chỉ có 5 trang và không kèm file mẫu bìa/nhận xét — đây là khoảng trống thật,
  không phải do đọc thiếu.
- Ba mục hình thức phổ biến trong các trường khác (chân trang GVHD/SVTH, mục lục tối đa 4
  cấp in đậm in hoa, bắt buộc dòng "Nguồn:" dưới hình/bảng) **không xuất hiện** trong văn bản
  đã đọc. Không tự thêm các luật đó rồi trình bày như thể chúng có trong quy định — nếu muốn
  áp dụng cho đẹp, phải nói rõ đó là lựa chọn trình bày, không phải điều khoản bắt buộc.
- Đồ án này thuộc loại **cơ sở ngành** — đã xác nhận qua AskUserQuestion sau khi đề cương chi
  tiết (đã gửi, xem `../nguon/de-cuong-chi-tiet-trich-xuat.txt`) tự mô tả "phù hợp quy mô một
  đồ án cơ sở ngành". Dùng tiền tố `csn-<malop>-<hotenkhongdau>-<shortname>` khi đối chiếu
  quy ước đặt tên GitHub repo ở Phase 10 (KHÔNG phải `cn-` — bản nháp đầu của kế hoạch này đã
  giả định sai "chuyên ngành", đã sửa lại).
- **TOÀN BỘ câu hỏi trắc nghiệm và thông tin cá nhân bên dưới đã được hỏi và trả lời trong quá
  trình lập kế hoạch (`/ak:plan`) — phase này khi chạy trong `/ak:cook` chỉ cần TRANSCRIBE các
  câu trả lời đã chốt vào `quy-dinh.md`, không cần hỏi lại người dùng lần nữa.**

## Requirements

### Câu hỏi trắc nghiệm — ĐÃ HỎI qua AskUserQuestion trong lúc lập kế hoạch, kết quả dưới đây
1. **Bìa chính/bìa phụ/trang nhận xét GVHD** — quy định ghi "theo mẫu" nhưng không kèm file.
   → **Đã chọn (a): chờ người dùng gửi file mẫu (BM...) sau.** Phase 4 tạm bỏ qua 3 trang này
   khi viết `00-phan-dau.md`, ghi rõ "chờ mẫu BM chính thức" trong `quy-dinh.md` và trong chính
   file `00-phan-dau.md`.
2. **Số trang bắt đầu đếm từ đâu** (PDF chỉ nói "góc phải dưới", không nói điểm bắt đầu).
   → **Đã chọn (a): bắt đầu từ MỞ ĐẦU = trang 1**; các trang trước đó (bìa, cảm ơn, mục lục,
   danh mục, tóm tắt) không đánh số.
3. **Nội dung chân trang** (PDF không yêu cầu gì).
   → **Đã chọn (b): GVHD bên trái · SVTH bên phải.** Ghi rõ trong `quy-dinh.md` đây là lựa
   chọn trình bày của người dùng, KHÔNG phải điều khoản bắt buộc của quy định PDF này.

### Thông tin cá nhân/đề tài — ĐÃ CÓ ĐỦ từ đề cương chi tiết đã gửi, không cần hỏi tự do nữa
Trích nguyên văn từ trang bìa `../nguon/de-cuong-chi-tiet-trich-xuat.txt` (đối chiếu logo
`../nguon/de-cuong-hinh-1.jpeg` xác nhận đây là Trường Đại học Trà Vinh):

| Mục | Giá trị |
|---|---|
| Tên đề tài | XÂY DỰNG WEBSITE KẾT NỐI NGƯỜI TÌM VIỆC LÀM THÊM VỚI NHÀ TUYỂN DỤNG |
| SVTH | Bùi Anh Khoa |
| MSSV | 170123594 |
| Lớp | DX23TT11 |
| GVHD | ThS. Trầm Hoàng Nam |
| Trường | Trường Đại học Trà Vinh — Trường Kỹ thuật và Công nghệ |
| Khoa | Khoa Công nghệ Thông tin |
| Địa điểm - thời gian | Vĩnh Long, tháng 9 năm 2026 |
| Loại đồ án | Cơ sở ngành (đã xác nhận qua AskUserQuestion — xem Key Insights) |

**Còn 1 mục chưa chốt (không chặn Phase 1-9, chỉ cần trước khi Phase 10 hoàn tất):**
`shortname` dự án dùng để đối chiếu quy ước tên GitHub repo ở mục 4.1 PDF
(`csn-<malop>-<hotenkhongdau>-<shortname>`), và liệu có tạo repo nộp bài riêng hay dùng lại
chính repo code `Recruit-Employee`. Hỏi người dùng câu này ở đầu Phase 10.

### File đặc tả `docs/bao-cao/quy-dinh.md` cần tạo (sau khi có câu trả lời)
Một bảng/checklist duy nhất liệt kê: font, size, line spacing, before/after spacing, 4 lề,
vị trí số trang, quy tắc đánh số chương/mục, format IEEE (kèm 3 mẫu ví dụ nguyên văn từ PDF),
cộng với 3 quyết định vừa chốt ở trên (bìa, số trang bắt đầu, chân trang) và toàn bộ thông
tin cá nhân/đề tài. File này là input duy nhất mà Phase 2 (script) và Phase 4 (viết bìa/nhận
xét) đọc — không lặp lại các con số này rải rác ở nơi khác trong repo.

## Related Code Files
- Create: `docs/bao-cao/quy-dinh.md`

## Implementation Steps
1. **(Đã xong ở bước lập kế hoạch — không lặp lại khi cook)** 3 câu hỏi trắc nghiệm đã hỏi qua
   `AskUserQuestion` và có kết quả; toàn bộ thông tin cá nhân/đề tài đã có từ đề cương. Khi
   phase này chạy trong `/ak:cook`, bắt đầu thẳng từ bước 2.
2. Viết `docs/bao-cao/quy-dinh.md` tổng hợp — mọi con số hình thức copy nguyên văn từ PDF
   (không làm tròn, không đổi đơn vị), 3 quyết định hình thức và toàn bộ thông tin cá nhân/đề
   tài copy nguyên văn từ bảng ở mục Requirements phía trên, mỗi quyết định không có trong PDF
   ghi rõ "theo lựa chọn của người dùng, không phải điều khoản quy định".
3. Ghi rõ trong `quy-dinh.md` rằng 3 trang bìa/nhận xét GVHD là "chờ file mẫu BM chính thức",
   để Phase 4 biết dừng ở đâu khi viết `00-phan-dau.md`.
4. Hỏi người dùng (1 câu còn thiếu, không phải trắc nghiệm 3 câu ở trên): shortname repo nộp
   bài + dùng lại `Recruit-Employee` hay tạo repo riêng — có thể hỏi ngay ở đầu phase này hoặc
   trì hoãn tới đầu Phase 10 (không chặn Phase 2-9 vì không ảnh hưởng nội dung/định dạng .docx).

## Todo List
- [x] Đã hỏi và nhận đủ 3 quyết định hình thức (bìa, số trang, chân trang) — hoàn tất lúc lập kế hoạch
- [x] Đã nhận đủ thông tin cá nhân/đề tài từ đề cương chi tiết
- [ ] shortname repo nộp bài — hỏi ở Phase 10
- [ ] `docs/bao-cao/quy-dinh.md` viết xong, mọi con số đối chiếu đúng PDF gốc và đề cương

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
