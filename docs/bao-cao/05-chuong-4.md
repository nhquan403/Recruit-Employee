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
- Phần hiển thị chuông thông báo và vòng lặp polling ở giao diện (UC07) chưa có kiểm thử front-end
  riêng — chỉ được xác nhận gián tiếp qua kiểm thử back-end rằng thông báo được tạo đúng trong cơ
  sở dữ liệu (xem mục 4.5), chưa kiểm tra phần hiển thị thật trên giao diện.

## 4.5. Phạm vi kiểm thử theo nhóm chức năng

Bảng 4.2 đối chiếu 7 use case đã đặc tả (mục 3.6) với các bộ kiểm thử tự động thực sự bao phủ
từng use case đó, dựa trực tiếp trên tên file kiểm thử trong `backend/src/` và `backend/test/`
(mục 2.9 trình bày cơ sở lý thuyết cho sự phân tầng kiểm thử đơn vị/tích hợp này).

Bảng 4.2. Đối chiếu use case với bộ kiểm thử tự động

| Use case | Kiểm thử đơn vị | Kiểm thử tích hợp (e2e) |
|---|---|---|
| UC01 — Đăng ký/đăng nhập | `auth.service.spec.ts` | `auth.e2e-spec.ts` |
| UC02 — Đăng tin tuyển dụng | `jobs.service.spec.ts` | `jobs.e2e-spec.ts` |
| UC03 — Tìm kiếm và lọc tin | `jobs.service.spec.ts` | `jobs.e2e-spec.ts` |
| UC04 — Ứng tuyển vào tin | `applications.service.spec.ts` | `applications.e2e-spec.ts` |
| UC05 — Quản lý ứng viên | `applications.service.spec.ts` | `applications.e2e-spec.ts` |
| UC06 — Duyệt/từ chối tin | `jobs.service.spec.ts` | `jobs.e2e-spec.ts` |
| UC07 — Nhận thông báo | — | gián tiếp qua `applications.e2e-spec.ts` (xem ghi chú) |
| Mọi use case — phân quyền chéo vai trò | `roles.guard.spec.ts` | `rbac.e2e-spec.ts` |

Ghi chú: UC07 (thông báo) không có file kiểm thử riêng vì bản thân endpoint
`/notifications/mine` chỉ là một truy vấn đọc đơn giản. Phạm vi bao phủ của nó nằm gián tiếp
trong `applications.e2e-spec.ts`: một trong các kịch bản ở đó, sau khi gọi `PATCH
/applications/:id/status`, gọi tiếp `GET /notifications/mine` và xác nhận có một thông báo kiểu
`APPLICATION_STATUS_CHANGED` xuất hiện — xác nhận đúng luồng "cập nhật trạng thái → tạo thông
báo" mô tả ở mục 3.4, nhưng không kiểm tra riêng phần hiển thị chuông thông báo hay vòng lặp
polling ở giao diện (chưa có kiểm thử front-end nào bao phủ hai phần này — một hạn chế thật, bổ
sung vào mục 4.4). Việc một use case nghiệp vụ (UC02, UC03, UC06) có thể cùng được bao phủ bởi
một file kiểm thử chung (`jobs.service.spec.ts`, `jobs.e2e-spec.ts`) là hợp lý vì cả ba đều thao
tác trên cùng một service/controller `Job`, chỉ
khác hành động cụ thể (tạo tin, tìm kiếm, duyệt tin).

## 4.6. Đánh giá khả năng mở rộng hệ thống

Ba lựa chọn kiến trúc đã trình bày ở Chương 2-3 có ảnh hưởng trực tiếp tới khả năng mở rộng
(scalability) của hệ thống nếu lượng người dùng tăng lên vượt quy mô demo hiện tại. Xác thực
bằng JWT (mục 2.5.1) là cơ chế không trạng thái (stateless): máy chủ không cần lưu phiên đăng
nhập trong bộ nhớ hay cơ sở dữ liệu, toàn bộ thông tin cần để xác thực một yêu cầu đã nằm sẵn
trong chính token gửi kèm. Nhờ vậy, dịch vụ `backend` có thể chạy nhiều bản sao song song sau
một bộ cân bằng tải (load balancer) mà không cần đồng bộ trạng thái phiên giữa các bản sao đó —
một yêu cầu đăng nhập ở bản sao A và một yêu cầu tiếp theo được định tuyến tới bản sao B vẫn xác
thực đúng, vì cả hai chỉ cần cùng một khóa bí mật (`JWT_SECRET`) để xác minh chữ ký token, không
cần tra cứu lại một bảng phiên tập trung.

Ngược lại, cơ chế polling thông báo (mục 2.6) là điểm có khả năng mở rộng kém nhất trong hệ
thống hiện tại: mỗi client đang mở ứng dụng gọi lại API cứ mỗi 20 giây bất kể có thông báo mới
hay không, nên tải lên `backend` tăng tuyến tính theo số người dùng đang hoạt động đồng thời,
không theo số sự kiện thông báo thực sự xảy ra. Ở quy mô vài chục người dùng như môi trường demo
của đồ án, mức tải này không đáng kể; nhưng nếu số người dùng đồng thời tăng lên hàng nghìn, tần
suất gọi API cố định này sẽ trở thành điểm nghẽn trước khi các phần còn lại của hệ thống đạt giới
hạn, đúng như đã nêu ở mục 2.6 khi so sánh với phương án WebSocket.

Về tầng dữ liệu, Prisma Client mặc định quản lý một connection pool kết nối tới PostgreSQL thay
vì mở một kết nối mới cho mỗi truy vấn, giúp giảm chi phí thiết lập kết nối khi tải tăng; tuy
nhiên cấu hình kích thước pool hiện vẫn dùng giá trị mặc định của Prisma, chưa được đo đạc và
điều chỉnh theo tải thật — đây là một điểm cần khảo sát thêm nếu hệ thống được đưa vào vận hành
với lượng người dùng lớn hơn đáng kể so với quy mô một đồ án cơ sở ngành.

## 4.7. Đối chiếu kết quả với hiện trạng ban đầu

Mục 1.2 và 1.3 (Chương 1) đã khảo sát hai nhóm giải pháp hiện có trước khi xây dựng hệ thống:
các nền tảng tuyển dụng lớn (TopCV, VietnamWorks, JobStreet) nặng về quy trình và không tối ưu
cho việc làm thêm ngắn hạn, còn các kênh phi chính thức (nhóm Facebook, Zalo) thiếu công cụ tìm
kiếm/lọc và không xác thực người đăng tin. Bảng 4.3 đối chiếu lại ba hạn chế cụ thể đã nêu ra ở
Chương 1 với cách hệ thống thật sự đã xây dựng giải quyết từng hạn chế đó.

Bảng 4.3. Đối chiếu hạn chế ban đầu với giải pháp đã cài đặt

| Hạn chế nêu ở Chương 1 | Giải pháp đã cài đặt | Vị trí trong báo cáo |
|---|---|---|
| Tin đăng rải rác nhiều nhóm, khó tìm, dễ trôi | Một kho tin tập trung, tìm kiếm/lọc theo `q`, `area`, `shift`, mức lương qua `GET /jobs` | Mục 3.3, UC03 (3.6.3) |
| Không có bộ lọc theo khu vực/khung giờ/mức lương | Bộ lọc kết hợp nhiều tiêu chí cùng lúc, cài đặt thật và kiểm thử qua `jobs.e2e-spec.ts` | Mục 3.3, 4.5 |
| Không xác thực người đăng tin, dễ xuất hiện tin giả | Bắt buộc đăng ký tài khoản có mật khẩu băm bcrypt (mục 2.5.2) trước khi đăng tin; mọi tin mới đều ở trạng thái `PENDING`, chỉ hiển thị công khai sau khi quản trị viên duyệt (UC06, 3.6.6) | Mục 2.5, 3.6.6 |

Việc đối chiếu này cho thấy cả ba hạn chế cụ thể nêu ra ở phần khảo sát hiện trạng đều có một
giải pháp cài đặt thật tương ứng, không chỉ dừng ở mức đề xuất trên giấy — nhất quán với cách
tiếp cận lặp đã mô tả ở mục 1.5 (thiết kế, cài đặt và kiểm thử ngay sau khi hoàn thành từng nhóm
chức năng, thay vì dồn toàn bộ kiểm thử về cuối).
