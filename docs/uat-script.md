# UAT Script — Việc Làm Thêm

A short script for a few real people to run through the Docker demo (`docker compose up
--build`, then open http://localhost:3000) and report anything confusing or broken. Two
personas, ~8 steps each. Nothing here requires technical knowledge — just note anything
that felt wrong, slow, or unclear.

## Setup for testers

1. Open http://localhost:3000 on your phone or a narrow browser window if possible (most
   candidates will use this on a phone).
2. You do not need any existing account — register fresh with any email.

## Persona A — Ứng viên (Candidate)

1. Vào trang chủ. Bạn có thấy ngay được mức lương và khung giờ của các tin tuyển dụng mà
   không cần bấm vào từng tin không?
2. Thử gõ một từ khóa vào ô tìm kiếm (ví dụ "phục vụ") và bấm chọn một khu vực trong bộ lọc.
   Danh sách có cập nhật đúng không?
3. Bấm "Đăng ký" → chọn "Tôi là ứng viên" → điền thông tin và tạo tài khoản. Bạn có được
   đăng nhập ngay sau khi đăng ký không?
4. Mở một tin tuyển dụng bất kỳ. Bạn có thấy đủ mô tả, yêu cầu, lương, và khung giờ không?
5. Bấm "Ứng tuyển ngay" và xác nhận. Có thông báo ứng tuyển thành công không? Nút có đổi
   trạng thái thành "Đã ứng tuyển" không?
6. Vào "Hồ sơ của tôi" → bấm "Sửa" → thêm 1-2 kỹ năng và khu vực mong muốn → bấm "Lưu".
   Thông tin có được lưu lại sau khi tải lại trang không?
7. Kiểm tra mục "Việc đã ứng tuyển" trong hồ sơ — tin bạn vừa ứng tuyển có xuất hiện không?
8. Bấm vào biểu tượng chuông thông báo (góc trên). Có hiển thị đúng không (có thể chưa có
   thông báo nếu nhà tuyển dụng chưa phản hồi)?

## Persona B — Nhà tuyển dụng (Employer)

1. Đăng ký tài khoản, chọn "Tôi là nhà tuyển dụng".
2. Sau khi đăng ký, bạn có được đưa thẳng đến trang "Đăng tin" không?
3. Điền đầy đủ thông tin (tiêu đề, mô tả, khu vực, khung giờ, mức lương) và bấm "Đăng tin".
   Bạn có thấy thông báo tin đang chờ duyệt không?
4. Vào "Tin của tôi" — tin vừa đăng có hiển thị đúng với trạng thái "Chờ duyệt" không?
5. (Cần một admin duyệt tin ở bước này — xem ghi chú bên dưới.) Sau khi tin được duyệt,
   trạng thái trên trang "Tin của tôi" có tự cập nhật không?
6. Nhờ một người khác (đóng vai ứng viên) ứng tuyển vào tin của bạn. Bạn có nhận được thông
   báo (chuông ở góc trên) không?
7. Vào "Quản lý ứng viên" của tin đó. Bạn có thấy thông tin ứng viên (tên, kỹ năng, giới
   thiệu) không?
8. Đổi trạng thái ứng viên đó (VD: "Mời phỏng vấn"). Ứng viên có thấy trạng thái mới trong
   hồ sơ của họ không?

**Ghi chú cho người điều phối UAT:** để duyệt tin ở bước B5, đăng nhập bằng tài khoản admin
đã tạo sẵn (`admin@example.com` / `Admin@12345`) tại `/quan-tri`, tìm tin trong mục "Tin chờ
duyệt" và bấm "Duyệt".

## What to report

For each step: did it work as described? If not, what happened instead? Anything that felt
slow, confusing, or hard to tap on a phone is worth a note even if it "technically worked."
