# CHƯƠNG 2. NGHIÊN CỨU LÝ THUYẾT

## 2.1. Kiến trúc ứng dụng web client-server

Ứng dụng web hiện đại thường được tách thành ba phần: giao diện người dùng (client) chạy trên
trình duyệt, máy chủ ứng dụng (server) xử lý nghiệp vụ, và cơ sở dữ liệu lưu trữ thông tin.
Client gọi đến server thông qua API, server truy vấn cơ sở dữ liệu rồi trả kết quả về dưới dạng
dữ liệu (thường ở định dạng JSON) để client hiển thị. Cách tách lớp này cho phép phát triển,
kiểm thử và mở rộng từng phần độc lập. Đây cũng chính là kiến trúc mà hệ thống Việc Làm Thêm áp
dụng, với Next.js đóng vai trò client và NestJS đóng vai trò server, giao tiếp qua REST API.

Trong hai mô hình render phổ biến của một ứng dụng client-server (render phía máy chủ — SSR,
server-side rendering — và render phía client, CSR, client-side rendering), Next.js App Router
cho phép kết hợp cả hai trong cùng một dự án: trang chủ (danh sách tin tuyển dụng) được render
phía máy chủ để tải nhanh và thân thiện với công cụ tìm kiếm, trong khi các thao tác tương tác
(lọc, ứng tuyển, cập nhật trạng thái) xử lý phía client sau khi trang đã tải [7].

## 2.2. Giao thức và kiến trúc API RESTful

REST (Representational State Transfer) là kiểu kiến trúc API sử dụng các phương thức HTTP chuẩn
(GET, POST, PATCH, DELETE) để thao tác trên tài nguyên [2]. Mỗi loại tài nguyên trong hệ thống,
gồm tin tuyển dụng, hồ sơ ứng tuyển và thông báo, có một nhóm endpoint riêng, ví dụ `GET /jobs` để
lấy danh sách tin, `POST /applications` để tạo một hồ sơ ứng tuyển mới, `PATCH
/applications/:id` để nhà tuyển dụng cập nhật trạng thái hồ sơ. Dữ liệu trao đổi ở định dạng
JSON, giúp API rõ ràng, dễ kiểm thử bằng công cụ như Postman hoặc Supertest, và dễ tái sử dụng
cho nhiều loại giao diện sau này nếu hệ thống mở rộng sang ứng dụng di động.

## 2.3. Framework front-end và back-end

Next.js [7] (dựa trên React) được chọn cho front-end vì hỗ trợ định tuyến theo cấu trúc thư mục
(App Router), tách trang thành các route rõ ràng như đã cài đặt trong dự án (`/viec-lam`,
`/nha-tuyen-dung`, `/quan-tri`), đồng thời hỗ trợ render phía máy chủ giúp trang chủ tải nhanh.

NestJS [6] (dựa trên Node.js) được chọn cho back-end vì tổ chức mã nguồn theo module rõ ràng: mỗi
nhóm chức năng của hệ thống (xác thực, tin tuyển dụng, hồ sơ ứng tuyển, thông báo, quản trị) là
một module riêng gồm controller, service và, khi cần, guard. Cơ chế dependency injection sẵn có
giúp tái sử dụng logic, ví dụ `RolesGuard` áp dụng lại cho nhiều controller khác nhau mà không
phải khởi tạo lại từng nơi.

## 2.4. Cơ sở dữ liệu quan hệ và ORM

Cơ sở dữ liệu quan hệ PostgreSQL [9] tổ chức dữ liệu thành các bảng có quan hệ khóa ngoại với
nhau. Trong hệ thống này là 5 bảng `User`, `Job`, `Application`, `Profile`, `Notification`,
với quan hệ ví dụ một `Job` thuộc về một `User` có vai trò nhà tuyển dụng, và một `Application`
liên kết một `User` có vai trò ứng viên với một `Job` cụ thể. Prisma ORM [10] cho phép thao tác
với các bảng này bằng mã lệnh hướng đối tượng (`prisma.job.findMany(...)`) thay vì viết trực
tiếp câu lệnh SQL, đồng thời sinh ra các migration theo dõi lịch sử thay đổi cấu trúc bảng, giúp
giảm lỗi cú pháp và dễ bảo trì khi mô hình dữ liệu thay đổi.

## 2.5. Xác thực JWT, băm mật khẩu và kiểm soát truy cập theo vai trò

### 2.5.1. Xác thực bằng JSON Web Token

Hệ thống dùng JSON Web Token (JWT) [5] để xác thực người dùng sau khi đăng nhập thành công.
Một JWT gồm ba phần nối bằng dấu chấm:

$$\text{JWT} = \text{base64url}(\text{header}) \;.\; \text{base64url}(\text{payload}) \;.\; \text{base64url}(\text{signature})$$

trong đó `header` khai báo thuật toán ký (hệ thống dùng HMAC-SHA256), `payload` chứa thông tin
người dùng cần thiết cho việc phân quyền (`sub` là id người dùng, `role` là vai trò), và
`signature` được máy chủ ký bằng khóa bí mật để chống giả mạo. Sau khi đăng nhập, client đính
kèm token này trong header `Authorization` của mỗi yêu cầu tiếp theo để chứng minh danh tính mà
không cần gửi lại mật khẩu. Trong cấu hình thật của hệ thống, token có hiệu lực 7 ngày
(`JWT_EXPIRES_IN=7d`).

### 2.5.2. Băm mật khẩu bằng bcrypt

Mật khẩu người dùng không được lưu ở dạng văn bản thuần mà được băm bằng bcrypt [11] trước khi
lưu vào cột `passwordHash`. bcrypt là một hàm băm một chiều có tích hợp salt ngẫu nhiên và một
hệ số công việc (cost factor) điều chỉnh được, sao cho số vòng lặp tính toán tăng theo cấp số
nhân với cost factor:

$$\text{số vòng lặp} = 2^{\text{cost}}$$

Hệ thống dùng cost factor bằng 10 (`BCRYPT_SALT_ROUNDS = 10` trong
`backend/src/users/users.service.ts`), tức $2^{10} = 1024$ vòng lặp cho mỗi lần băm. Mức này đủ
chậm để gây khó khăn cho tấn công dò mật khẩu hàng loạt, nhưng vẫn đủ nhanh để không ảnh hưởng trải
nghiệm đăng ký/đăng nhập của người dùng thật.

### 2.5.3. Kiểm soát truy cập theo vai trò (RBAC)

Hệ thống có ba vai trò cố định trong cột `role` của bảng `User`: `CANDIDATE` (ứng viên),
`EMPLOYER` (nhà tuyển dụng), `ADMIN` (quản trị viên). Việc kiểm soát truy cập theo vai trò
(role-based access control — RBAC) [8] được cài đặt bằng một decorator tùy chỉnh `@Roles(...)`
đánh dấu vai trò được phép trên từng route, kết hợp với một `RolesGuard` đọc lại metadata đó
bằng `Reflector` của NestJS: nếu vai trò của người dùng đang đăng nhập không nằm trong danh sách
được phép, guard trả về lỗi 403 (`ForbiddenException`) trước khi yêu cầu chạm tới logic nghiệp
vụ. Cách làm này tách rõ luật phân quyền ra khỏi từng hàm xử lý, chỉ cần khai báo một dòng
`@Roles(Role.ADMIN)` trên route thay vì kiểm tra vai trò thủ công trong mỗi hàm.

## 2.6. Cơ chế cập nhật thông báo: polling thay vì WebSocket

Khi có sự kiện cần thông báo (có ứng viên mới nộp hồ sơ, hồ sơ được cập nhật trạng thái), hệ
thống cần đưa thông tin đó tới đúng người dùng đang mở ứng dụng. Có hai hướng kỹ thuật phổ biến
để làm việc này. Một là WebSocket [1], một giao thức giữ kết nối hai chiều liên tục giữa client
và server để server có thể chủ động đẩy dữ liệu ngay khi sự kiện xảy ra. Hai là polling, trong đó
client tự động gọi lại API theo chu kỳ cố định để hỏi xem có gì mới không.

Hệ thống Việc Làm Thêm chọn phương án polling: phía front-end gọi định kỳ `GET
/notifications/mine` và `GET /notifications/mine/unread-count` mỗi 20 giây (cài đặt trong `frontend/src/lib/use-polling-notifications.ts`) để lấy số thông báo
chưa đọc và danh sách thông báo mới. Lý do chọn polling thay vì WebSocket là để giữ toàn bộ giao
tiếp trong cùng một giao thức REST đã dùng cho mọi chức năng khác, không phải duy trì thêm một
kết nối máy chủ riêng (WebSocket gateway) chỉ để phục vụ một tính năng, phù hợp với quy mô một
đồ án cơ sở ngành, đổi lại độ trễ thông báo tối đa khoảng 20 giây thay vì tức thời.
