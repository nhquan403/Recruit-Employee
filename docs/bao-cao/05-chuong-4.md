# CHƯƠNG 4. KẾT QUẢ NGHIÊN CỨU

## 4.1. Kết quả kiểm thử tự động

Toàn bộ bộ kiểm thử được chạy lại tại thời điểm viết chương này (không dùng số liệu cũ), bằng
`npm run test` và `npm run test:e2e` từ thư mục gốc repo:

```
Backend — kiểm thử đơn vị (npm run test --workspace=backend)
  Test Suites: 4 passed, 4 total
  Tests:       21 passed, 21 total

Backend — kiểm thử tích hợp/RBAC (npm run test:e2e --workspace=backend)
  Test Suites: 4 passed, 4 total
  Tests:       77 passed, 77 total

Frontend — kiểm thử đơn vị (npm run test --workspace=frontend)
  Test Suites: 2 passed, 2 total
  Tests:       8 passed, 8 total
```

Tổng cộng 106 kịch bản kiểm thử (21 + 77 + 8), toàn bộ đều đạt (pass), tỷ lệ 100%. Bốn bộ kiểm
thử tích hợp bao phủ đúng bốn nhóm chức năng chính: xác thực (`auth.e2e-spec.ts`), tin tuyển
dụng (`jobs.e2e-spec.ts`), hồ sơ ứng tuyển (`applications.e2e-spec.ts`), và phân quyền theo vai
trò (`rbac.e2e-spec.ts`) — bộ kiểm thử RBAC riêng biệt này xác nhận một tài khoản không thể gọi
được API dành cho vai trò khác (ví dụ ứng viên gọi API duyệt tin của quản trị viên sẽ bị từ chối
với mã lỗi 403), đúng yêu cầu phi chức năng "không có truy cập chéo vai trò khi chưa đăng nhập
đúng quyền" đặt ra từ đầu.

## 4.2. Đối chiếu với chỉ tiêu định lượng đã đề ra

Bảng 4.1 đối chiếu kết quả thật với các chỉ tiêu định lượng đã đề xuất trước khi xây dựng hệ
thống.

Bảng 4.1. Đối chiếu chỉ tiêu định lượng

| Chỉ tiêu | Mức đề xuất | Kết quả thật | Đạt/Chưa đạt |
|---|---|---:|---|
| Số use case hoàn thành (trên 7 use case) | Tối thiểu 6/7 | 7/7 | Đạt, vượt chỉ tiêu |
| Thời gian tải trang chủ (môi trường demo) | Không quá 3 giây | Khoảng 15-190 mili-giây | Đạt |
| Tỷ lệ kịch bản kiểm thử đạt | Từ 90% trở lên | 106/106 (100%) | Đạt |
| Khả năng sử dụng trên điện thoại | Hiển thị đúng, thao tác được | Không tràn ngang ở 3 độ rộng màn hình 360/768/1280px (đã kiểm bằng Chromium thật) | Đạt |

Thời gian tải trang và kết quả kiểm tra tràn ngang màn hình được đo trong giai đoạn xây dựng hệ
thống (xem phần "Completion Summary" của kế hoạch triển khai dự án), không đo lại trong phạm vi
viết báo cáo này vì không có thay đổi nào ở giao diện trang chủ hay CSS responsive kể từ đó.

## 4.3. Một số nhận xét về giao diện

Giao diện được tổ chức nhất quán cho ba vai trò: mỗi vai trò có một thanh điều hướng riêng chỉ
hiển thị đúng chức năng vai trò đó được phép dùng (ứng viên không thấy mục "Đăng tin", nhà tuyển
dụng không thấy mục "Quản trị"), giảm nguy cơ người dùng bấm nhầm vào chức năng không thuộc về
mình. Thao tác ứng tuyển và cập nhật trạng thái hồ sơ chỉ cần một lượt bấm và chọn trong danh
sách sổ xuống, không cần chuyển qua nhiều trang trung gian.

## 4.4. Hạn chế đã biết

Một số giới hạn được ghi nhận rõ ràng, không che giấu:

- `docker compose up --build` được viết đúng cấu hình và đã kiểm tra bằng `docker compose
  config`, nhưng chưa được chạy end-to-end trong môi trường không có Docker daemon khả dụng lúc
  viết báo cáo này.
- Thông báo cập nhật có độ trễ tối đa khoảng 20 giây do dùng cơ chế polling thay vì đẩy dữ liệu
  tức thời (đã giải thích lý do lựa chọn ở mục 2.6).
- Bộ dữ liệu kiểm thử/demo hiện tại còn ở quy mô nhỏ (vài tài khoản, vài tin tuyển dụng), chưa
  phản ánh tải thật của một hệ thống có nhiều người dùng đồng thời.
