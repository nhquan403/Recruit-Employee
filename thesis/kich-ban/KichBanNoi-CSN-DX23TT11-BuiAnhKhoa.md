# Kịch bản nói — Bản thuyết trình

Dựng tự động từ `scripts/noi-dung-slide.py` bằng `scripts/tao-kich-ban.py` — sửa nội dung thì sửa ở `noi-dung-slide.py` rồi chạy lại, không sửa tay file này.

Thời lượng tính từ số từ thật với tốc độ nói ước lượng **150 từ/phút** (tiếng Việt). Slide đánh dấu **[BẤM QUA khi bảo vệ]** ở đường "Ngắn" chỉ tính 2 giây (đọc nhanh tên slide), không đọc hết lời nói — lời nói đầy đủ của các slide này chỉ dùng ở đường "Đầy đủ" khi quay video.

## Bảng thời lượng

- **Đường đầy đủ** (quay video): 11 phút 42 giây
- **Đường ngắn** (bảo vệ trực tiếp): 10 phút 41 giây

| # | Slide | Số từ | Giây (đầy đủ) | Giây (ngắn) |
|---|---|---:|---:|---:|
| 0 | XÂY DỰNG WEBSITE KẾT NỐI NGƯỜI TÌM VIỆC LÀM THÊM VỚI NHÀ TUYỂN DỤNG | 56 | 22s | 22s |
| 1 | Lý do chọn đề tài | 123 | 49s | 49s |
| 2 | Mục tiêu đồ án | 115 | 46s | 46s |
| 3 | Đối tượng và phạm vi | 144 | 58s | 58s |
| 4 | Kiến trúc tổng quan hệ thống | 81 | 32s | 32s |
| 5 | Công nghệ sử dụng | 86 | 34s | 34s |
| 6 | Thiết kế cơ sở dữ liệu | 103 | 41s | 41s |
| 7 | Thiết kế API | 110 | 44s | 44s |
| 8 | Luồng ứng tuyển đầu-cuối | 104 | 42s | 42s |
| 9 | Ba vai trò — Bảy use case | 89 | 36s | 36s |
| 10 | Demo — Ứng viên: Trang chủ | 51 | 20s | 20s |
| 11 | Demo — Tìm kiếm và lọc | 41 | 16s | 2s 🔹 BẤM QUA khi bảo vệ |
| 12 | Demo — Chi tiết tin & ứng tuyển | 35 | 14s | 2s 🔹 BẤM QUA khi bảo vệ |
| 13 | Demo — Nhà tuyển dụng: Đăng tin | 49 | 20s | 2s 🔹 BẤM QUA khi bảo vệ |
| 14 | Demo — Quản lý ứng viên | 48 | 19s | 19s |
| 15 | Demo — Quản trị viên | 43 | 17s | 17s |
| 16 | Demo — Thông báo | 34 | 14s | 2s 🔹 BẤM QUA khi bảo vệ |
| 17 | Demo — Hồ sơ cá nhân | 18 | 7s | 2s 🔹 BẤM QUA khi bảo vệ |
| 18 | Bảo mật: đối chiếu OWASP Top 10 | 99 | 40s | 40s |
| 19 | Kết quả kiểm thử | 77 | 31s | 31s |
| 20 | Đối chiếu chỉ tiêu định lượng | 73 | 29s | 29s |
| 21 | Hạn chế và hướng phát triển | 104 | 42s | 42s |
| 22 | Liên kết | 25 | 10s | 10s |
| 23 | Cảm ơn | 46 | 18s | 18s |

---

## Slide 0. XÂY DỰNG WEBSITE KẾT NỐI NGƯỜI TÌM VIỆC LÀM THÊM VỚI NHÀ TUYỂN DỤNG

**Nội dung trên slide:**

- Đồ án Thực tập Cơ sở ngành — Ngành Công nghệ Thông tin
- GVHD: ThS. Trầm Hoàng Nam
- SVTH: Bùi Anh Khoa — MSSV 170123594 — Lớp DX23TT11 — Khoá 2023–2027
- Trường Đại học Trà Vinh — Khoa Kỹ thuật và Công nghệ

**Số từ:** 56 — **Thời lượng ước tính:** 22 giây

**Lời nói:**

> Kính chào thầy cô trong hội đồng. Em xin trình bày đồ án thực tập cơ sở ngành với đề tài xây dựng website kết nối người tìm việc làm thêm với nhà tuyển dụng, dưới sự hướng dẫn của thầy Trầm Hoàng Nam. Em là Bùi Anh Khoa, mã số sinh viên 170123594, lớp DX23TT11.

## Slide 1. Lý do chọn đề tài

**Nội dung trên slide:**

- Nhu cầu làm thêm của sinh viên và lao động thời vụ luôn ở mức cao
- Kênh phi chính thức (Facebook, Zalo): tin rải rác, không có bộ lọc, không xác thực người đăng
- Nền tảng lớn (TopCV, VietnamWorks): quy trình nặng, không hợp với việc làm thêm ngắn hạn
- → Khoảng trống thị trường giữa hai nhóm kênh trên

**Số từ:** 123 — **Thời lượng ước tính:** 49 giây

**Lời nói:**

> Nhu cầu tìm việc làm thêm của sinh viên và lao động thời vụ luôn ở mức cao, nhưng cách kết nối hiện nay có hai nhóm hạn chế. Các kênh phi chính thức như nhóm Facebook hay Zalo thì tin đăng rải rác, dễ trôi mất, không có bộ lọc theo khu vực hay khung giờ, và không xác thực người đăng nên dễ xuất hiện tin giả. Trong khi đó các nền tảng tuyển dụng lớn như TopCV, VietnamWorks lại tập trung vào việc làm toàn thời gian với quy trình khá nặng, không phù hợp với một tin tuyển dụng làm thêm cần đăng nhanh và tuyển gấp. Đó chính là khoảng trống mà đồ án hướng tới lấp đầy.

## Slide 2. Mục tiêu đồ án

**Nội dung trên slide:**

- Mục tiêu chung: website kết nối, đăng tin — tìm kiếm — lọc — ứng tuyển nhanh, 3 vai trò
- Thiết kế CSDL quan hệ cho người dùng, tin tuyển dụng, hồ sơ ứng tuyển, thông báo
- Xây dựng API RESTful và giao diện cho 3 vai trò
- Tìm kiếm/lọc theo khu vực, khung giờ, mức lương + thông báo cập nhật
- Kiểm thử theo kịch bản nghiệp vụ, triển khai bản demo chạy được

**Số từ:** 115 — **Thời lượng ước tính:** 46 giây

**Lời nói:**

> Mục tiêu chung của đồ án là xây dựng một website kết nối người tìm việc làm thêm với nhà tuyển dụng, cho phép đăng tin, tìm kiếm, lọc và ứng tuyển nhanh chóng, có quản lý tài khoản theo vai trò và một trang quản trị kiểm duyệt tin đăng. Từ đó đồ án đặt ra sáu mục tiêu cụ thể: khảo sát yêu cầu hai nhóm người dùng, thiết kế cơ sở dữ liệu quan hệ, xây dựng API RESTful, xây dựng giao diện cho ba vai trò, cài đặt tìm kiếm lọc và thông báo, và cuối cùng là kiểm thử cùng triển khai một bản demo chạy được để trình diễn.

## Slide 3. Đối tượng và phạm vi

**Nội dung trên slide:**

- Đối tượng: người tìm việc làm thêm (sinh viên, lao động phổ thông) và nhà tuyển dụng nhỏ
- Phạm vi: website đáp ứng, 3 vai trò, kiểm duyệt tin, thông báo bằng polling
- Không làm: app di động riêng, thanh toán lương, AI gợi ý việc, xác minh giấy tờ tuỳ thân

**Số từ:** 144 — **Thời lượng ước tính:** 58 giây

**Lời nói:**

> Đối tượng nghiên cứu gồm hai nhóm: người tìm việc làm thêm — chủ yếu là sinh viên và lao động phổ thông — và nhà tuyển dụng nhỏ như cửa hàng, quán ăn, kho hàng. Đồ án giới hạn phạm vi ở mức phù hợp với một đồ án cơ sở ngành: một website đáp ứng dùng được trên máy tính lẫn điện thoại, ba vai trò người dùng, quản trị viên duyệt tin trước khi hiển thị công khai, và thông báo cập nhật qua cơ chế truy vấn định kỳ thay vì kênh email hay SMS bên thứ ba. Đồ án không làm ứng dụng di động riêng, không xử lý thanh toán lương hay hợp đồng điện tử, không dùng trí tuệ nhân tạo để gợi ý việc làm, và không xác minh danh tính bằng giấy tờ tùy thân.

## Slide 4. Kiến trúc tổng quan hệ thống

**Nội dung trên slide:**

- Kiến trúc client-server, giao tiếp qua REST API có JWT
- 3 dịch vụ đóng gói bằng Docker Compose: db (PostgreSQL), backend (NestJS), frontend (Next.js)
- backend là thành phần duy nhất truy cập cơ sở dữ liệu
- *(có hình: `hinh-2-1-kien-truc-tong-quan.png`)*

**Số từ:** 81 — **Thời lượng ước tính:** 32 giây

**Lời nói:**

> Hệ thống theo kiến trúc client-server, gồm ba thành phần triển khai độc lập đóng gói bằng Docker Compose: dịch vụ cơ sở dữ liệu PostgreSQL, dịch vụ backend bằng NestJS, và dịch vụ frontend bằng Next.js. Trình duyệt chỉ giao tiếp trực tiếp với frontend; mọi thao tác cần dữ liệu được frontend gọi tiếp sang backend qua REST API có đính kèm JWT. Backend là thành phần duy nhất truy cập cơ sở dữ liệu, thông qua Prisma Client.

## Slide 5. Công nghệ sử dụng

**Nội dung trên slide:**

- Front-end: Next.js 16, React 19, TypeScript, TailwindCSS 3
- Back-end: NestJS 11 (Node.js), tổ chức theo module
- Cơ sở dữ liệu: PostgreSQL 16, thao tác qua Prisma ORM 6
- Xác thực: JWT + bcrypt + kiểm soát truy cập theo vai trò (RBAC)
- Kiểm thử: Jest + Testing Library · Triển khai: Docker Compose

**Số từ:** 86 — **Thời lượng ước tính:** 34 giây

**Lời nói:**

> Về công nghệ, front-end dùng Next.js phiên bản 16 với App Router, kết hợp TypeScript và TailwindCSS. Back-end dùng NestJS phiên bản 11 trên nền Node.js, tổ chức mã nguồn theo module. Cơ sở dữ liệu là PostgreSQL, thao tác qua Prisma ORM phiên bản 6. Xác thực dùng JSON Web Token kết hợp băm mật khẩu bằng bcrypt và kiểm soát truy cập theo vai trò. Kiểm thử dùng Jest cho back-end và Testing Library cho front-end, còn triển khai bản demo dùng Docker Compose.

## Slide 6. Thiết kế cơ sở dữ liệu

**Nội dung trên slide:**

- 5 bảng: User, Job, Application, Profile, Notification
- Application ràng buộc duy nhất (jobId, candidateId) — một ứng viên không ứng tuyển 2 lần
- Profile tách riêng khỏi User theo nguyên tắc chuẩn hóa dữ liệu quan hệ
- *(có hình: `hinh-2-2-erd.png`)*

**Số từ:** 103 — **Thời lượng ước tính:** 41 giây

**Lời nói:**

> Cơ sở dữ liệu gồm năm bảng: User, Job, Application, Profile và Notification. Bảng Application chỉ lưu hai khóa ngoại tới Job và User cùng trạng thái riêng của nó, tránh lặp lại dữ liệu; và có ràng buộc duy nhất trên cặp jobId-candidateId để đảm bảo ở cấp cơ sở dữ liệu rằng một ứng viên không thể ứng tuyển hai lần vào cùng một tin. Bảng Profile được tách riêng khỏi User theo đúng nguyên tắc chuẩn hóa dữ liệu quan hệ, vì đây là thông tin phụ thuộc vào người dùng nhưng không phải thuộc tính định danh tài khoản.

## Slide 7. Thiết kế API

**Nội dung trên slide:**

- 24 endpoint REST, chia theo module: auth, jobs, applications, notifications, profiles, admin
- Bảo vệ bằng RolesGuard (vai trò) và JobOwnerGuard (đúng chủ tin)
- Dữ liệu đầu vào kiểm tra bằng DTO + class-validator + ValidationPipe toàn cục

**Số từ:** 110 — **Thời lượng ước tính:** 44 giây

**Lời nói:**

> Hệ thống có hai mươi tư endpoint REST, chia theo sáu module nghiệp vụ: xác thực, tin tuyển dụng, hồ sơ ứng tuyển, thông báo, hồ sơ cá nhân và quản trị. Mỗi endpoint được bảo vệ bằng RolesGuard kiểm tra đúng vai trò, và với các thao tác sửa hoặc xoá tin còn có thêm JobOwnerGuard đảm bảo một nhà tuyển dụng chỉ thao tác được trên tin do chính mình đăng. Mọi dữ liệu đầu vào đều được kiểm tra hợp lệ bằng lớp DTO cùng thư viện class-validator và một ValidationPipe toàn cục, từ chối dữ liệu sai định dạng trước khi chạm tới logic nghiệp vụ.

## Slide 8. Luồng ứng tuyển đầu-cuối

**Nội dung trên slide:**

- Ứng viên ứng tuyển → tạo Application (PENDING) + thông báo cho nhà tuyển dụng
- Nhà tuyển dụng xem danh sách → tự động chuyển VIEWED
- Nhà tuyển dụng mời phỏng vấn/từ chối → thông báo cho ứng viên
- *(có hình: `hinh-2-3-luong-ung-tuyen.png`)*

**Số từ:** 104 — **Thời lượng ước tính:** 42 giây

**Lời nói:**

> Đây là luồng ứng tuyển đầu-cuối thật của hệ thống. Ứng viên bấm ứng tuyển, backend tạo một bản ghi Application ở trạng thái PENDING và đồng thời tạo thông báo gửi cho nhà tuyển dụng sở hữu tin đó. Khi nhà tuyển dụng mở trang quản lý ứng viên, lần xem đầu tiên tự động chuyển trạng thái sang VIEWED. Khi nhà tuyển dụng chọn mời phỏng vấn hoặc từ chối, hệ thống cập nhật trạng thái tương ứng và tạo thông báo gửi ngược lại cho ứng viên, ứng viên thấy cập nhật này qua vòng truy vấn định kỳ tiếp theo.

## Slide 9. Ba vai trò — Bảy use case

**Nội dung trên slide:**

- Ứng viên, Nhà tuyển dụng, Quản trị viên
- UC01 Đăng ký/đăng nhập · UC02 Đăng tin · UC03 Tìm kiếm/lọc tin
- UC04 Ứng tuyển · UC05 Quản lý ứng viên · UC06 Duyệt/từ chối tin · UC07 Nhận thông báo

**Số từ:** 89 — **Thời lượng ước tính:** 36 giây

**Lời nói:**

> Hệ thống có ba vai trò người dùng: ứng viên, nhà tuyển dụng và quản trị viên, phục vụ đủ bảy use case đã đặc tả — từ đăng ký đăng nhập, đăng tin tuyển dụng, tìm kiếm và lọc tin, ứng tuyển, quản lý danh sách ứng viên, duyệt hoặc từ chối tin, cho tới nhận thông báo cập nhật hồ sơ. Toàn bộ bảy use case này đều đã được cài đặt và kiểm thử đầy đủ, phần demo tiếp theo sẽ đi qua từng vai trò.

## Slide 10. Demo — Ứng viên: Trang chủ

**Nội dung trên slide:**

- Danh sách tin tuyển dụng phù hợp
- Giao diện đáp ứng, dùng được trên điện thoại
- *(có hình: `hinh-1-1-trang-chu.png`)*

**Số từ:** 51 — **Thời lượng ước tính:** 20 giây

**Lời nói:**

> Đây là trang chủ dành cho ứng viên, hiển thị danh sách tin tuyển dụng phù hợp. Giao diện được thiết kế đáp ứng, dùng tốt trên cả máy tính và điện thoại — phù hợp với đối tượng người dùng chính là sinh viên thường tra cứu trên di động.

## Slide 11. Demo — Tìm kiếm và lọc

> 🔹 **BẤM QUA khi bảo vệ trực tiếp** — chỉ nói nhanh tên slide (~2 giây). Lời nói đầy đủ dưới đây chỉ đọc khi quay video nộp bài.

**Nội dung trên slide:**

- Lọc theo khu vực, khung giờ, mức lương
- Dùng Prisma + PostgreSQL, endpoint GET /jobs
- *(có hình: `hinh-1-2-tim-kiem-loc.png`)*

**Số từ:** 41 — **Thời lượng ước tính:** 16 giây

**Lời nói:**

> Màn hình tìm kiếm với bộ lọc đầy đủ theo khu vực, khung giờ làm việc và mức lương — đúng những tiêu chí mà khảo sát hiện trạng ở phần đầu cho thấy các kênh phi chính thức đang thiếu.

## Slide 12. Demo — Chi tiết tin & ứng tuyển

> 🔹 **BẤM QUA khi bảo vệ trực tiếp** — chỉ nói nhanh tên slide (~2 giây). Lời nói đầy đủ dưới đây chỉ đọc khi quay video nộp bài.

**Nội dung trên slide:**

- Xem chi tiết tin, bấm Ứng tuyển ngay
- Backend kiểm tra hợp lệ bằng CreateApplicationDto
- *(có hình: `hinh-1-3-chi-tiet-tin.png`)*

**Số từ:** 35 — **Thời lượng ước tính:** 14 giây

**Lời nói:**

> Trang chi tiết một tin tuyển dụng, nơi ứng viên bấm ứng tuyển. Yêu cầu ứng tuyển đi qua DTO kiểm tra jobId đúng định dạng UUID trước khi tạo hồ sơ ứng tuyển thật.

## Slide 13. Demo — Nhà tuyển dụng: Đăng tin

> 🔹 **BẤM QUA khi bảo vệ trực tiếp** — chỉ nói nhanh tên slide (~2 giây). Lời nói đầy đủ dưới đây chỉ đọc khi quay video nộp bài.

**Nội dung trên slide:**

- Form đăng tin mới
- Tin mới luôn ở trạng thái PENDING, chờ quản trị viên duyệt
- *(có hình: `hinh-3-1-dang-tin.png`)*

**Số từ:** 49 — **Thời lượng ước tính:** 20 giây

**Lời nói:**

> Phía nhà tuyển dụng, đây là form đăng tin tuyển dụng mới. Mọi tin mới đăng đều ở trạng thái chờ duyệt, chỉ hiển thị công khai sau khi quản trị viên phê duyệt — đúng biện pháp hạn chế tin giả đã trình bày ở phần kiến trúc.

## Slide 14. Demo — Quản lý ứng viên

**Nội dung trên slide:**

- Danh sách ứng viên theo từng tin
- Cập nhật trạng thái: Xem/Mời phỏng vấn/Từ chối
- *(có hình: `hinh-3-2-quan-ly-ung-vien.png`)*

**Số từ:** 48 — **Thời lượng ước tính:** 19 giây

**Lời nói:**

> Trang quản lý ứng viên của một tin tuyển dụng, hiển thị hai hồ sơ ở hai trạng thái khác nhau. Nhà tuyển dụng có thể mời phỏng vấn hoặc từ chối trực tiếp từ đây, hệ thống tự gửi thông báo cho ứng viên ngay sau đó.

## Slide 15. Demo — Quản trị viên

**Nội dung trên slide:**

- Tổng quan hệ thống, tin chờ duyệt, danh sách người dùng
- *(có hình: `hinh-3-3-duyet-tin-admin.png`)*

**Số từ:** 43 — **Thời lượng ước tính:** 17 giây

**Lời nói:**

> Trang quản trị cho quản trị viên, gồm tổng quan hệ thống, danh sách tin đang chờ duyệt và danh sách người dùng — đây là nơi thực hiện bước kiểm duyệt trước khi một tin tuyển dụng được hiển thị công khai.

## Slide 16. Demo — Thông báo

> 🔹 **BẤM QUA khi bảo vệ trực tiếp** — chỉ nói nhanh tên slide (~2 giây). Lời nói đầy đủ dưới đây chỉ đọc khi quay video nộp bài.

**Nội dung trên slide:**

- Chuông thông báo, cập nhật mỗi 20 giây bằng polling
- *(có hình: `hinh-3-4-thong-bao.png`)*

**Số từ:** 34 — **Thời lượng ước tính:** 14 giây

**Lời nói:**

> Chuông thông báo đang mở, hiển thị một thông báo chưa đọc — cập nhật bằng cơ chế truy vấn định kỳ mỗi hai mươi giây như đã trình bày ở phần kiến trúc.

## Slide 17. Demo — Hồ sơ cá nhân

> 🔹 **BẤM QUA khi bảo vệ trực tiếp** — chỉ nói nhanh tên slide (~2 giây). Lời nói đầy đủ dưới đây chỉ đọc khi quay video nộp bài.

**Nội dung trên slide:**

- Ứng viên xem lại thông tin tài khoản và lịch sử ứng tuyển
- *(có hình: `hinh-3-5-ho-so-ung-vien.png`)*

**Số từ:** 18 — **Thời lượng ước tính:** 7 giây

**Lời nói:**

> Trang hồ sơ cá nhân của ứng viên, nơi xem lại thông tin tài khoản của chính mình.

## Slide 18. Bảo mật: đối chiếu OWASP Top 10

**Nội dung trên slide:**

- Đã có: chống truy cập chéo vai trò, mật khẩu băm bcrypt, chống SQL injection qua Prisma
- Đã có: kiểm tra dữ liệu đầu vào toàn cục (ValidationPipe)
- Một phần — hạn chế biết trước: CORS chưa giới hạn origin, chưa có rate limiting

**Số từ:** 99 — **Thời lượng ước tính:** 40 giây

**Lời nói:**

> Về bảo mật, hệ thống đã đối chiếu với các nhóm rủi ro liên quan trong OWASP Top Mười. Đã có biện pháp cho kiểm soát truy cập, mật khẩu, chống chèn mã độc nhờ Prisma dùng câu lệnh tham số hóa, và kiểm tra dữ liệu đầu vào toàn cục. Có hai điểm được ghi nhận là hạn chế biết trước, không che giấu: cấu hình CORS hiện chưa giới hạn đúng origin, và hệ thống chưa có giới hạn số lần thử đăng nhập sai — cả hai đã được đưa vào hướng phát triển tiếp theo.

## Slide 19. Kết quả kiểm thử

**Nội dung trên slide:**

- 106/106 kịch bản kiểm thử tự động đạt — 100%
- 21 kiểm thử đơn vị + 77 kiểm thử tích hợp (backend) + 8 kiểm thử đơn vị (frontend)
- Bộ kiểm thử RBAC riêng xác nhận không có truy cập chéo vai trò

**Số từ:** 77 — **Thời lượng ước tính:** 31 giây

**Lời nói:**

> Toàn bộ một trăm lẻ sáu trên một trăm lẻ sáu kịch bản kiểm thử tự động đều đạt, tỷ lệ một trăm phần trăm — gồm hai mươi mốt kiểm thử đơn vị và bảy mươi bảy kiểm thử tích hợp ở backend, cùng tám kiểm thử đơn vị ở frontend. Trong đó có một bộ kiểm thử RBAC riêng biệt, xác nhận một tài khoản không thể gọi được API dành cho vai trò khác.

## Slide 20. Đối chiếu chỉ tiêu định lượng

**Nội dung trên slide:**

- 7/7 use case hoàn thành (chỉ tiêu tối thiểu 6/7) — vượt
- 106/106 kịch bản kiểm thử đạt (chỉ tiêu từ 90%) — vượt
- Không tràn ngang ở 3 độ rộng màn hình đã kiểm (360/768/1280px)

**Số từ:** 73 — **Thời lượng ước tính:** 29 giây

**Lời nói:**

> Đối chiếu với các chỉ tiêu định lượng đã đề ra trước khi xây dựng: bảy trên bảy use case hoàn thành, vượt chỉ tiêu tối thiểu sáu trên bảy; một trăm lẻ sáu trên một trăm lẻ sáu kịch bản kiểm thử đạt, vượt chỉ tiêu tối thiểu chín mươi phần trăm; và giao diện không bị tràn ngang ở cả ba độ rộng màn hình đã kiểm tra bằng Chromium thật.

## Slide 21. Hạn chế và hướng phát triển

**Nội dung trên slide:**

- Hạn chế: thông báo trễ tối đa ~20s, dữ liệu demo còn nhỏ, CORS/rate limiting chưa siết
- Hướng phát triển: ứng dụng di động, gợi ý việc làm, đánh giá hai chiều, WebSocket

**Số từ:** 104 — **Thời lượng ước tính:** 42 giây

**Lời nói:**

> Đồ án còn một số hạn chế được ghi nhận rõ ràng: độ trễ thông báo tối đa khoảng hai mươi giây do dùng polling, bộ dữ liệu demo còn ở quy mô nhỏ, và cấu hình CORS cùng giới hạn thử đăng nhập sai chưa được siết chặt. Hướng phát triển tiếp theo gồm xây dựng ứng dụng di động tận dụng lại API hiện có, bổ sung gợi ý việc làm theo lịch sử tìm kiếm, cơ chế đánh giá hai chiều giữa ứng viên và nhà tuyển dụng, và thay polling bằng WebSocket nếu quy mô người dùng tăng đủ lớn.

## Slide 22. Liên kết

**Nội dung trên slide:**

- Video thuyết trình: «DÁN LIÊN KẾT GOOGLE DRIVE VÀO ĐÂY»
- Mã nguồn và toàn bộ tài liệu: https://github.com/nhquan403/Recruit-Employee

**Số từ:** 25 — **Thời lượng ước tính:** 10 giây

**Lời nói:**

> Video thuyết trình đầy đủ và toàn bộ mã nguồn, tài liệu của đồ án được đính kèm theo hai liên kết trên slide này.

## Slide 23. Cảm ơn

**Nội dung trên slide:**

- Em xin cảm ơn thầy Trầm Hoàng Nam và quý thầy cô đã lắng nghe
- Em xin được lắng nghe góp ý và nhận xét từ hội đồng

**Số từ:** 46 — **Thời lượng ước tính:** 18 giây

**Lời nói:**

> Em xin chân thành cảm ơn thầy Trầm Hoàng Nam đã tận tình hướng dẫn trong suốt quá trình thực hiện đồ án, và cảm ơn quý thầy cô trong hội đồng đã lắng nghe. Em xin được lắng nghe góp ý và nhận xét ạ.

