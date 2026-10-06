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
(lọc, ứng tuyển, cập nhật trạng thái) xử lý phía client sau khi trang đã tải [10].

## 2.2. Giao thức và kiến trúc API RESTful

REST (Representational State Transfer) là kiểu kiến trúc API sử dụng các phương thức HTTP chuẩn
(GET, POST, PATCH, DELETE) để thao tác trên tài nguyên [2]. Mục 2.10 so sánh REST với hai kiểu
kiến trúc API khác (GraphQL, gRPC) để làm rõ lý do chọn REST cho đồ án này. Mỗi loại tài nguyên trong hệ thống,
gồm tin tuyển dụng, hồ sơ ứng tuyển và thông báo, có một nhóm endpoint riêng, ví dụ `GET /jobs` để
lấy danh sách tin, `POST /applications` để tạo một hồ sơ ứng tuyển mới, `PATCH
/applications/:id` để nhà tuyển dụng cập nhật trạng thái hồ sơ. Dữ liệu trao đổi ở định dạng
JSON, giúp API rõ ràng, dễ kiểm thử bằng công cụ như Postman hoặc Supertest, và dễ tái sử dụng
cho nhiều loại giao diện sau này nếu hệ thống mở rộng sang ứng dụng di động.

## 2.3. Framework front-end và back-end

Next.js [10] (dựa trên React) được chọn cho front-end vì hỗ trợ định tuyến theo cấu trúc thư mục
(App Router), tách trang thành các route rõ ràng như đã cài đặt trong dự án (`/viec-lam`,
`/nha-tuyen-dung`, `/quan-tri`), đồng thời hỗ trợ render phía máy chủ giúp trang chủ tải nhanh.

NestJS [9] (dựa trên Node.js) được chọn cho back-end vì tổ chức mã nguồn theo module rõ ràng: mỗi
nhóm chức năng của hệ thống (xác thực, tin tuyển dụng, hồ sơ ứng tuyển, thông báo, quản trị) là
một module riêng gồm controller, service và, khi cần, guard. Cơ chế dependency injection sẵn có
giúp tái sử dụng logic, ví dụ `RolesGuard` áp dụng lại cho nhiều controller khác nhau mà không
phải khởi tạo lại từng nơi.

## 2.4. Cơ sở dữ liệu quan hệ và ORM

Cơ sở dữ liệu quan hệ PostgreSQL [12] tổ chức dữ liệu thành các bảng có quan hệ khóa ngoại với
nhau. Trong hệ thống này là 5 bảng `User`, `Job`, `Application`, `Profile`, `Notification`,
với quan hệ ví dụ một `Job` thuộc về một `User` có vai trò nhà tuyển dụng, và một `Application`
liên kết một `User` có vai trò ứng viên với một `Job` cụ thể. Prisma ORM [13] cho phép thao tác
với các bảng này bằng mã lệnh hướng đối tượng (`prisma.job.findMany(...)`) thay vì viết trực
tiếp câu lệnh SQL, đồng thời sinh ra các migration theo dõi lịch sử thay đổi cấu trúc bảng, giúp
giảm lỗi cú pháp và dễ bảo trì khi mô hình dữ liệu thay đổi. Mục 2.8 trình bày thêm nguyên tắc
chuẩn hóa và các ràng buộc toàn vẹn áp dụng khi thiết kế 5 bảng này.

## 2.5. Xác thực JWT, băm mật khẩu và kiểm soát truy cập theo vai trò

### 2.5.1. Xác thực bằng JSON Web Token

Hệ thống dùng JSON Web Token (JWT) [8] để xác thực người dùng sau khi đăng nhập thành công.
Một JWT gồm ba phần nối bằng dấu chấm:

$$\text{JWT} = \text{base64url}(\text{header}) \;.\; \text{base64url}(\text{payload}) \;.\; \text{base64url}(\text{signature})$$

trong đó `header` khai báo thuật toán ký (hệ thống dùng HMAC-SHA256), `payload` chứa thông tin
người dùng cần thiết cho việc phân quyền (`sub` là id người dùng, `role` là vai trò), và
`signature` được máy chủ ký bằng khóa bí mật để chống giả mạo. Sau khi đăng nhập, client đính
kèm token này trong header `Authorization` của mỗi yêu cầu tiếp theo để chứng minh danh tính mà
không cần gửi lại mật khẩu. Trong cấu hình thật của hệ thống, token có hiệu lực 7 ngày
(`JWT_EXPIRES_IN=7d`).

### 2.5.2. Băm mật khẩu bằng bcrypt

Mật khẩu người dùng không được lưu ở dạng văn bản thuần mà được băm bằng bcrypt [14] trước khi
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
(role-based access control — RBAC) [11] được cài đặt bằng một decorator tùy chỉnh `@Roles(...)`
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

## 2.7. Kiểm tra hợp lệ dữ liệu đầu vào

Một nguyên tắc nền tảng của bảo mật ứng dụng web là không bao giờ tin tưởng dữ liệu gửi lên từ
phía client, dù dữ liệu đó đã được kiểm tra ở giao diện người dùng [11]. Giao diện có thể bị bỏ
qua hoàn toàn nếu người dùng gọi thẳng vào API bằng công cụ như curl hoặc Postman thay vì đi qua
form, nên việc kiểm tra tính hợp lệ của dữ liệu đầu vào phải được thực hiện lại, độc lập, ở phía
máy chủ trước khi dữ liệu đó được dùng để tạo hoặc cập nhật bản ghi trong cơ sở dữ liệu.

Hệ thống cài đặt việc kiểm tra này bằng thư viện `class-validator` [16], kết hợp với cơ chế Data
Transfer Object (DTO) sẵn có của NestJS: mỗi endpoint nhận dữ liệu đầu vào khai báo một lớp DTO
riêng, gắn decorator kiểm tra trên từng trường. Ví dụ `CreateJobDto`
(`backend/src/jobs/dto/create-job.dto.ts`) yêu cầu `title` là chuỗi dài tối thiểu 3 ký tự
(`@IsString() @MinLength(3)`), `description` dài tối thiểu 10 ký tự, còn `salaryMin`/`salaryMax`
phải là số nguyên không âm (`@IsInt() @Min(0)`) nếu có khai báo. `CreateApplicationDto`
(`backend/src/applications/dto/create-application.dto.ts`) yêu cầu `jobId` đúng định dạng UUID
hợp lệ (`@IsUUID()`) — ràng buộc này từng chặn đúng một tình huống thật trong giai đoạn kiểm thử
thủ công: một bộ dữ liệu mẫu cũ dùng ID dạng `00000000-0000-0000-0000-00000000000N` (không phải
UUID hợp lệ ở bất kỳ phiên bản nào) bị `@IsUUID()` từ chối ngay ở bước xác thực, trước khi chạm
tới logic nghiệp vụ — đúng hành vi mong muốn của một lớp kiểm tra đầu vào, dù nguyên nhân gốc lúc
đó là dữ liệu mẫu sai định dạng chứ không phải lỗi của validator.

Toàn bộ DTO được áp dụng tự động nhờ một `ValidationPipe` toàn cục khai báo trong
`backend/src/main.ts`, bật ba tuỳ chọn: `whitelist: true` (tự động loại bỏ mọi trường không được
khai báo trong DTO khỏi dữ liệu đầu vào, chặn trường hợp client cố gửi thêm trường không mong
muốn như `role` hay `status` để ghi đè giá trị lẽ ra do server tự quyết định), `forbidNonWhitelisted:
true` (từ chối toàn bộ yêu cầu với lỗi 400 nếu phát hiện trường lạ, thay vì âm thầm bỏ qua), và
`transform: true` (tự động chuyển kiểu dữ liệu thô từ query string, ví dụ chuỗi `"15000"` thành
số nguyên `15000`, trước khi so khớp với decorator `@IsInt()`). Cách làm này tập trung toàn bộ
luật kiểm tra dữ liệu vào một nơi (lớp DTO), tránh lặp lại logic kiểm tra thủ công ở từng
controller.

## 2.8. Nguyên tắc chuẩn hóa dữ liệu quan hệ và ràng buộc toàn vẹn

Thiết kế một cơ sở dữ liệu quan hệ tốt thường tuân theo các dạng chuẩn hóa (normal forms) nhằm
giảm dư thừa dữ liệu và tránh các bất thường khi cập nhật (update anomaly) [12]. Dạng chuẩn thứ
nhất (1NF) yêu cầu mỗi cột chỉ chứa một giá trị nguyên tố; dạng chuẩn thứ hai và thứ ba (2NF,
3NF) yêu cầu các cột không khóa phụ thuộc đầy đủ và trực tiếp vào khóa chính, không phụ thuộc
bắc cầu qua một cột không khóa khác.

Áp dụng vào 5 bảng của hệ thống (mục 3.2): thông tin hồ sơ cá nhân (`bio`, `skills`,
`preferredAreas`, `avatarUrl`) được tách thành một bảng `Profile` riêng thay vì gộp chung vào
bảng `User`, vì đây là dữ liệu phụ thuộc vào một người dùng cụ thể nhưng không phải thuộc tính
định danh tài khoản — tách bảng giúp bảng `User` gọn, chỉ chứa thông tin xác thực/định danh,
đồng thời cho phép quan hệ 1-1 rõ ràng qua khóa ngoại `userId` có ràng buộc duy nhất (unique).
Tương tự, một hồ sơ ứng tuyển (`Application`) không lưu lặp lại thông tin của tin tuyển dụng hay
của ứng viên — nó chỉ lưu hai khóa ngoại (`jobId`, `candidateId`) cùng trạng thái riêng của
chính hồ sơ ứng tuyển đó (`status`, `message`); thông tin đầy đủ về tin hay về ứng viên được lấy
lại bằng cách join ngược về bảng `Job`/`User` qua Prisma khi cần hiển thị, tránh tình trạng dữ
liệu bị lệch nhau giữa nhiều bản sao nếu ứng viên đổi tên hoặc nhà tuyển dụng sửa tin sau khi đã
có người ứng tuyển.

Bên cạnh chuẩn hóa, hệ thống dùng thêm hai loại ràng buộc toàn vẹn do chính PostgreSQL đảm bảo,
không phải do tầng ứng dụng tự kiểm tra: ràng buộc khóa ngoại (foreign key constraint), đảm bảo
không thể tạo một `Application` trỏ tới một `jobId` hoặc `candidateId` không tồn tại; và ràng
buộc duy nhất phức hợp (composite unique constraint) trên cặp `(jobId, candidateId)` của bảng
`Application`, đảm bảo ở cấp cơ sở dữ liệu rằng một ứng viên không thể ứng tuyển hai lần vào
cùng một tin, kể cả khi có lỗi logic ở tầng ứng dụng vô tình bỏ sót bước kiểm tra này.

## 2.9. Kiểm thử phần mềm: kiểm thử đơn vị và kiểm thử tích hợp

Kiểm thử tự động thường được tổ chức theo mô hình "kim tự tháp kiểm thử" (test pyramid) [3]: lớp
đáy, chiếm số lượng nhiều nhất, là kiểm thử đơn vị (unit test) — kiểm tra một hàm hoặc một lớp
độc lập, cô lập khỏi các phụ thuộc bên ngoài (cơ sở dữ liệu, mạng) bằng cách thay thế các phụ
thuộc đó bằng đối tượng giả lập (mock); lớp giữa là kiểm thử tích hợp (integration test) — kiểm
tra nhiều thành phần phối hợp với nhau, ví dụ một request HTTP thật đi qua toàn bộ pipeline của
framework (guard, pipe, controller, service) rồi chạm tới cơ sở dữ liệu thật; lớp đỉnh, chiếm số
lượng ít nhất, là kiểm thử đầu-cuối (end-to-end test) — mô phỏng thao tác người dùng thật trên
giao diện. Mô hình này khuyến nghị nhiều kiểm thử đơn vị vì chạy nhanh và dễ xác định chính xác
vị trí lỗi, còn kiểm thử tích hợp/đầu-cuối tuy chậm hơn nhưng xác nhận được rằng các thành phần
thực sự phối hợp đúng với nhau trong điều kiện gần giống môi trường thật.

Hệ thống Việc Làm Thêm áp dụng hai lớp đầu của mô hình này ở phía back-end bằng Jest. Kiểm thử
đơn vị (các file `*.service.spec.ts` và `roles.guard.spec.ts` trong `backend/src/`) kiểm tra
logic nghiệp vụ của từng service một cách cô lập, dùng một bản giả lập của `PrismaClient` thay vì
kết nối cơ sở dữ liệu thật, giúp bộ kiểm thử này chạy trong vài giây. Kiểm thử tích hợp (các file
`*.e2e-spec.ts` trong `backend/test/`) dùng `supertest` để gửi request HTTP thật tới một instance
Nest thật, chạy trên cơ sở dữ liệu kiểm thử riêng (`TEST_DATABASE_URL`, tách biệt với cơ sở dữ
liệu phát triển), qua đó xác nhận toàn bộ chuỗi guard → pipe → controller → service → Prisma →
PostgreSQL hoạt động đúng với nhau, không chỉ từng mảnh riêng lẻ. Kết quả thật của cả hai lớp này
được trình bày ở mục 4.1; mục 4.5 phân tích thêm phạm vi bao phủ theo từng nhóm chức năng.

## 2.10. REST so với các kiểu kiến trúc API khác

Ngoài REST, hai kiểu kiến trúc API phổ biến khác là GraphQL [4] và gRPC [5]. GraphQL cho phép
client tự mô tả chính xác những trường dữ liệu mình cần trong một truy vấn duy nhất, phù hợp với
ứng dụng có nhiều màn hình cần kết hợp dữ liệu từ nhiều nguồn khác nhau theo nhiều cách khác
nhau, nhưng đòi hỏi xây dựng thêm một tầng schema/resolver và cơ chế kiểm soát truy cập phức tạp
hơn vì mọi truy vấn đều đi qua một endpoint duy nhất thay vì nhiều endpoint tách theo tài nguyên
như REST. gRPC dùng Protocol Buffers để tuần tự hóa dữ liệu ở dạng nhị phân thay vì JSON văn bản,
cho tốc độ và băng thông tốt hơn REST, phù hợp cho giao tiếp giữa các dịch vụ nội bộ (service-to-
service) trong kiến trúc vi dịch vụ, nhưng không được trình duyệt hỗ trợ gọi trực tiếp (cần một
tầng gateway chuyển đổi) và khó debug thủ công hơn vì dữ liệu không phải dạng văn bản đọc được.

Với quy mô một đồ án cơ sở ngành có một front-end, một back-end nguyên khối (monolith, không
tách vi dịch vụ) và tập tài nguyên tương đối ít và ổn định (5 loại), REST [2] là lựa chọn phù hợp
nhất trong ba kiểu kiến trúc trên: không cần tầng schema/resolver bổ sung như GraphQL, tận dụng
trực tiếp được các khái niệm HTTP chuẩn (mã trạng thái, cache theo URL, middleware xác thực theo
route) mà cả NestJS lẫn các công cụ kiểm thử (curl, Postman, Supertest) đều hỗ trợ sẵn, và dữ
liệu dạng JSON dễ đọc trực tiếp khi gỡ lỗi — điều có giá trị thực tế trong một dự án một người
phát triển, nơi việc gỡ lỗi nhanh quan trọng hơn việc tối ưu băng thông ở quy mô vi dịch vụ.

## 2.11. Bảo mật ứng dụng web: đối chiếu với OWASP Top 10

OWASP Top 10 [11] là danh sách 10 nhóm rủi ro bảo mật phổ biến nhất ở ứng dụng web, do tổ chức
phi lợi nhuận OWASP tổng hợp định kỳ từ dữ liệu thực tế của nhiều hệ thống. Bảng 2.1 đối chiếu
từng nhóm rủi ro liên quan trực tiếp tới một hệ thống quy mô như Việc Làm Thêm với biện pháp đã
cài đặt thật trong mã nguồn, nêu rõ cả những nhóm CHƯA có biện pháp (hạn chế thật, không che
giấu) thay vì chỉ liệt kê các nhóm đã xử lý.

Bảng 2.1. Đối chiếu với các nhóm rủi ro liên quan trong OWASP Top 10:2021

| Nhóm rủi ro | Biện pháp đã cài đặt | Trạng thái |
|---|---|---|
| A01 — Kiểm soát truy cập bị phá vỡ (Broken Access Control) | `RolesGuard` (mục 2.5.3) và `JobOwnerGuard` (mục 3.3) chặn truy cập sai vai trò hoặc sai chủ sở hữu ở tầng route, xác nhận bằng `rbac.e2e-spec.ts` | Đã có |
| A02 — Lỗi mật mã (Cryptographic Failures) | Mật khẩu băm bằng bcrypt (mục 2.5.2), không lưu văn bản thuần; JWT ký bằng HMAC-SHA256 | Đã có |
| A03 — Chèn mã độc (Injection) | Prisma sinh câu lệnh SQL tham số hóa (parameterized query) cho mọi truy vấn, không ghép chuỗi SQL thủ công ở bất kỳ đâu trong mã nguồn — loại bỏ hoàn toàn khả năng SQL injection qua đường này | Đã có |
| A04 — Thiết kế thiếu an toàn (Insecure Design) | `ValidationPipe` toàn cục (mục 2.7) từ chối dữ liệu đầu vào không hợp lệ trước khi tới logic nghiệp vụ | Đã có |
| A05 — Cấu hình sai bảo mật (Security Misconfiguration) | `app.enableCors()` (`backend/src/main.ts`) bật CORS không giới hạn origin cụ thể — phù hợp môi trường demo cho một đồ án nhưng cần giới hạn lại đúng domain thật nếu triển khai sản xuất | Một phần — hạn chế biết trước |
| A07 — Lỗi xác thực và nhận dạng (Identification and Authentication Failures) | JWT có thời hạn 7 ngày (mục 2.5.1); hệ thống hiện CHƯA giới hạn số lần thử đăng nhập sai (rate limiting) nên về lý thuyết vẫn có thể bị dò mật khẩu hàng loạt nếu kẻ tấn công gửi rất nhiều yêu cầu | Một phần — hạn chế biết trước |

Hai dòng đánh dấu "một phần" không phải sai sót bị bỏ sót mà là đánh đổi phạm vi có chủ đích ở
quy mô một đồ án cơ sở ngành: cấu hình CORS mở và chưa có rate limiting đều là những bổ sung có
thể thêm sau (một middleware như `@nestjs/throttler` cho rate limiting, một danh sách origin cụ
thể cho CORS) mà không cần thay đổi kiến trúc hiện tại — được ghi nhận lại ở mục "Hướng phát
triển" (mục 5.2) thay vì cài đặt vội trong phạm vi đồ án này.
