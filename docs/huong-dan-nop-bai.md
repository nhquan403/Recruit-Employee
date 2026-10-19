# Hướng dẫn nộp bài — những việc chỉ bạn mới làm được

Mọi thứ máy dựng được (slide, kịch bản, đóng gói) đã xong. Còn 5 bước sau chỉ bạn tự làm được.

## 1. Quay video thuyết trình

**Bắt buộc thấy được cả khuôn mặt người nói lẫn slide** — đúng yêu cầu của hướng dẫn học phần.

Gợi ý công cụ (chọn một):
- **Điện thoại**: mở `.pptx` trên máy tính, quay điện thoại hướng vào vừa màn hình vừa mặt bạn
  (hoặc quay 2 đoạn — mặt + màn hình — rồi ghép), hoặc dùng app quay màn hình có camera chèn góc.
- **Microsoft Teams / Zoom**: bật chia sẻ màn hình (trình chiếu slide) + bật camera, bấm ghi lại
  cuộc họp (ghi cả hai cùng lúc tự động).
- **PowerPoint 365**: mục **Ghi lại** (Record) có tuỳ chọn **Cameo** — vừa trình chiếu vừa quay
  camera của bạn đè lên góc màn hình, xuất thẳng ra `.mp4`.

Lời nói đã viết sẵn, không cần tự soạn:
- `thesis/kich-ban/KichBanNoi-CSN-DX23TT11-BuiAnhKhoa.pdf` — bản in đầy đủ, mang theo khi quay.
- Mở `thesis/pptx/BanThuyetTrinh-CSN-DX23TT11-BuiAnhKhoa.pptx` trong PowerPoint, bật khung
  **Ghi chú** (Notes) dưới mỗi slide — cũng là đúng lời nói đó, tiện nhìn khi quay bằng
  PowerPoint trực tiếp.

Dùng **bản đầy đủ** (đọc hết lời nói mọi slide, ~11-12 phút) cho video — khác với lúc bảo vệ
trực tiếp thì bấm qua nhanh vài slide demo (xem kịch bản để biết slide nào).

## 2. Tải video lên Google Drive

1. Tải file video lên Google Drive.
2. Bấm chuột phải → **Chia sẻ** → đổi quyền thành **"Bất kỳ ai có đường liên kết"** (Anyone with
   the link) — **quan trọng**: để chế độ riêng tư thì người chấm không mở được, script kiểm tra
   ở bước sau sẽ báo lỗi.
3. Chép đường liên kết.

## 3. Dán liên kết vào slide "Liên kết"

**Không sửa thẳng vào file `.pptx`** — sửa ở nguồn rồi dựng lại:

1. Mở `scripts/noi-dung-slide.py`.
2. Tìm dòng:
   ```python
   LIEN_KET_VIDEO = "«DÁN LIÊN KẾT GOOGLE DRIVE VÀO ĐÂY»"
   ```
3. Thay chuỗi `«DÁN LIÊN KẾT GOOGLE DRIVE VÀO ĐÂY»` bằng đường liên kết Drive thật của bạn (giữ
   nguyên dấu ngoặc kép `"..."`).
4. Dựng lại cả slide và kịch bản:
   ```bash
   python3 scripts/tao-slide.py
   python3 scripts/tao-kich-ban.py
   python3 scripts/xuat-kich-ban-in.py
   ```

## 4. Chạy lại script đóng gói (sau bước 3, không trước)

```bash
bash scripts/dong-goi-nop-bai.sh
```

Script tự dò chuỗi `DÁN LIÊN KẾT` còn sót trong `.pptx` — nếu bạn chưa làm xong bước 3, script sẽ
**dừng lại và báo lỗi**, không cho đóng gói thiếu link. Làm đúng thứ tự: bước 3 xong rồi mới chạy
bước 4.

Kết quả: `170123594_Bui Anh Khoa_DX23TT11.zip` (và `.rar` nếu máy có `rar`) trong thư mục
`bao-cao/nop-bai/`.

## 5. Nộp bài

1. Đăng nhập LMS, nộp đúng một file `.zip` (hoặc `.rar`) vừa đóng gói.
2. In bản cứng báo cáo (`thesis/pdf/BaoCao-CSN-DX23TT11-BuiAnhKhoa.pdf`), ký tên theo quy định
   của khoa.
3. Nếu hướng dẫn học phần có yêu cầu nộp thêm bản thuyết trình riêng hay form khác ngoài file
   nén — kiểm tra lại trên LMS, việc này nằm ngoài phạm vi những gì đã tự động hoá ở đây.

---

## Những thông tin suy ra chứ không đọc trực tiếp được — bạn kiểm lại giúp

| Thông tin | Giá trị đang dùng | Suy ra như thế nào |
|---|---|---|
| Ngành | Công nghệ Thông tin | Đề cương gốc không có field "Ngành" riêng, chỉ có "Khoa: Khoa Công nghệ Thông tin" — suy ra bằng cách bỏ chữ "Khoa". **Bạn đã xác nhận giá trị này đúng (19/10).** |
| Họ tên không dấu (đặt tên file nén) | `Bui Anh Khoa` | Tự động bỏ dấu tiếng Việt từ "Bùi Anh Khoa" bằng chuẩn hoá NFD — không gõ tay, nhưng vẫn nên bạn tự nhìn lại tên file nén trước khi nộp.
