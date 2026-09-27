# MỞ ĐẦU

## 1. Lý do chọn đề tài

Nhu cầu làm thêm của sinh viên và lao động thời vụ luôn ở mức cao: sinh viên cần thu nhập và
kinh nghiệm thực tế song song với việc học, trong khi các quán ăn, cửa hàng, kho hàng và dịch
vụ giao nhận thường xuyên thiếu nhân sự cho ca ngắn hạn, cuối tuần hoặc theo mùa vụ. Đây là
mối quan hệ cung-cầu tồn tại thường trực nhưng lại chưa được kết nối hiệu quả bằng một kênh
chuyên biệt.

Trên thực tế, việc tìm và đăng tin việc làm thêm hiện nay chủ yếu diễn ra qua các kênh phi
chính thức như nhóm Facebook, Zalo hoặc truyền miệng. Cách làm này có ba hạn chế rõ rệt. Thứ
nhất, tin tuyển dụng nằm rải rác trên nhiều nhóm khác nhau, khó tìm kiếm và dễ trôi mất sau vài
giờ đăng. Thứ hai, các kênh này không có bộ lọc theo khu vực, khung giờ làm việc hay mức lương,
buộc người tìm việc phải đọc thủ công từng bài đăng để chọn lọc thông tin phù hợp. Thứ ba,
không có cơ chế xác thực người đăng tin, khiến tin tuyển dụng giả hoặc lừa đảo thu phí có cơ
hội xuất hiện, đồng thời nhà tuyển dụng cũng khó theo dõi ai đã ứng tuyển vì phải nhắn tin riêng
lẻ với từng người và dễ bỏ sót ứng viên phù hợp.

Trong khi đó, các nền tảng tuyển dụng trực tuyến quy mô lớn như TopCV, VietnamWorks lại tập
trung vào việc làm toàn thời gian với quy trình đăng tin và hồ sơ ứng tuyển khá nặng, không phù
hợp với đặc thù của một tin tuyển dụng làm thêm ngắn hạn cần đăng nhanh và tuyển gấp. Khoảng
trống giữa hai nhóm kênh này — kênh phi chính thức thiếu công cụ, và nền tảng lớn thiếu sự phù
hợp — là lý do đồ án chọn xây dựng một website chuyên biệt cho việc kết nối người tìm việc làm
thêm với nhà tuyển dụng, tập trung vào đăng tin nhanh, tìm kiếm và lọc theo tiêu chí sát với nhu
cầu thực tế của công việc bán thời gian, cùng cơ chế ứng tuyển và kiểm duyệt tin đơn giản, vừa
đủ với quy mô của một đồ án cơ sở ngành.

## 2. Mục tiêu

### 2.1. Mục tiêu chung

Xây dựng một website kết nối người tìm việc làm thêm với nhà tuyển dụng, cho phép đăng tin, tìm
kiếm, lọc và ứng tuyển việc làm bán thời gian một cách nhanh chóng, có quản lý tài khoản theo
vai trò và trang quản trị kiểm duyệt tin đăng.

### 2.2. Mục tiêu cụ thể

- Khảo sát và phân tích yêu cầu của hai nhóm người dùng chính: người tìm việc làm thêm và nhà
  tuyển dụng (cửa hàng, quán ăn, doanh nghiệp nhỏ).
- Thiết kế cơ sở dữ liệu quan hệ cho người dùng, tin tuyển dụng, hồ sơ ứng tuyển và thông báo.
- Xây dựng API RESTful cho các chức năng đăng tin, tìm kiếm và lọc, ứng tuyển, quản lý hồ sơ và
  kiểm duyệt.
- Xây dựng giao diện web cho ba vai trò: ứng viên, nhà tuyển dụng và quản trị viên.
- Cài đặt chức năng tìm kiếm, lọc theo khu vực, khung giờ, mức lương và thông báo khi hồ sơ ứng
  tuyển được phản hồi.
- Kiểm thử hệ thống theo các kịch bản nghiệp vụ chính và triển khai một phiên bản chạy được để
  trình diễn.

Như vậy, đồ án đặt ra tổng cộng 6 mục tiêu cụ thể, cùng phục vụ một mục tiêu chung nêu trên.

## 3. Đối tượng và phạm vi nghiên cứu

### 3.1. Đối tượng nghiên cứu

- Người tìm việc làm thêm: chủ yếu là sinh viên và lao động phổ thông cần công việc bán thời
  gian, theo ca hoặc ngắn hạn.
- Nhà tuyển dụng: cửa hàng, quán ăn, kho hàng, doanh nghiệp nhỏ có nhu cầu tuyển nhân sự thời
  vụ hoặc bán thời gian.
- Kiến trúc và công nghệ xây dựng ứng dụng web: giao diện, API, cơ sở dữ liệu và cơ chế xác
  thực người dùng.

### 3.2. Phạm vi và các lựa chọn của đồ án

Đồ án giới hạn phạm vi ở mức phù hợp với quy mô đồ án cơ sở ngành, thể hiện qua các lựa chọn có
chủ đích sau:

| Khía cạnh | Lựa chọn của đồ án | Lý do |
|---|---|---|
| Nền tảng | Website đáp ứng (responsive), dùng được trên cả máy tính và điện thoại | Không cần cài đặt, triển khai và cập nhật nhanh |
| Loại việc làm | Việc làm thêm, bán thời gian, theo ca hoặc thời vụ | Đúng nhu cầu thực tế của sinh viên và cửa hàng nhỏ |
| Vai trò người dùng | Ứng viên, nhà tuyển dụng, quản trị viên | Phân tách rõ quyền hạn và luồng thao tác |
| Xác thực | Đăng ký/đăng nhập bằng email và mật khẩu, phân quyền theo vai trò | Đơn giản, đủ dùng cho quy mô đồ án |
| Kiểm duyệt | Quản trị viên duyệt tin trước khi hiển thị công khai | Hạn chế tin giả hoặc tin không phù hợp |
| Thông báo | Cập nhật trạng thái qua cơ chế truy vấn định kỳ (polling) trong ứng dụng, không dùng kênh ngoài | Đơn giản, không phụ thuộc dịch vụ email/SMS bên thứ ba |

### 3.3. Những nội dung không thực hiện

- Ứng dụng di động (mobile app) riêng biệt; đồ án chỉ làm phiên bản web đáp ứng.
- Thanh toán lương hoặc ký hợp đồng lao động điện tử qua hệ thống.
- Chatbot hoặc gợi ý việc làm bằng trí tuệ nhân tạo; việc lọc và gợi ý dựa trên tiêu chí do
  người dùng tự chọn.
- Xác minh danh tính bằng giấy tờ tùy thân hoặc tích hợp cổng thanh toán thật; hệ thống chỉ
  dừng ở mức xác thực tài khoản cơ bản bằng email và mật khẩu.

## 4. Phương pháp thực hiện

Đồ án được xây dựng theo kiến trúc client-server, tách riêng giao diện người dùng (front-end)
và máy chủ xử lý nghiệp vụ (back-end), giao tiếp với nhau qua API RESTful. Công nghệ cụ thể
được lựa chọn và phiên bản đã dùng:

- Front-end: Next.js 16 (App Router) kết hợp TypeScript và TailwindCSS 3.
- Back-end: NestJS 11 (Node.js) kết hợp TypeScript, tổ chức theo module.
- Cơ sở dữ liệu: PostgreSQL, thao tác qua Prisma ORM 6.
- Xác thực: JSON Web Token (JWT) kết hợp mã hoá mật khẩu bằng bcrypt và kiểm soát truy cập theo
  vai trò (role-based access control).
- Kiểm thử: Jest cho kiểm thử đơn vị và tích hợp phía back-end, Testing Library cho front-end.
- Đóng gói và triển khai bản demo: Docker Compose.

Phiên bản các công nghệ trên được cố định lùi lại một bản chính so với bản phát hành mới nhất
tại thời điểm xây dựng (ví dụ Prisma dùng bản 6 thay vì bản 7 mới đổi cách cấu hình datasource,
NestJS dùng bản 11 thay vì bản 12 chỉ phát hành dưới dạng ESM chưa tương thích thẳng với công cụ
kiểm thử ts-jest), nhằm giữ các quy ước cấu hình còn phổ biến trong tài liệu hướng dẫn và tránh
các thay đổi phá vỡ tương thích (breaking changes) mới phát sinh, mà không ảnh hưởng đến tính
năng nào của hệ thống.

Quy trình phát triển áp dụng cách tiếp cận lặp: từng nhóm chức năng (xác thực, đăng tin, tìm
kiếm, ứng tuyển, kiểm duyệt, thông báo) được thiết kế cơ sở dữ liệu, cài đặt API, cài đặt giao
diện và kiểm thử ngay sau khi hoàn thành, thay vì dồn toàn bộ việc kiểm thử về giai đoạn cuối.

## 5. Bố cục báo cáo

Báo cáo gồm năm chương, theo đúng trình tự quy định của khoa:

- **Chương 1 — Tổng quan**: khảo sát hiện trạng tìm việc làm thêm hiện nay, phân tích các nền
  tảng liên quan và khoảng trống thị trường mà đồ án hướng tới giải quyết.
- **Chương 2 — Nghiên cứu lý thuyết**: trình bày cơ sở lý thuyết và các công cụ, công nghệ được
  sử dụng để xây dựng hệ thống.
- **Chương 3 — Hiện thực hóa nghiên cứu**: mô tả kiến trúc, thiết kế cơ sở dữ liệu, thiết kế
  API, thiết kế giao diện và quá trình cài đặt từng chức năng.
- **Chương 4 — Kết quả nghiên cứu**: trình bày kết quả kiểm thử, đối chiếu với các chỉ tiêu đã
  đề ra và một số đánh giá về giao diện, hiệu năng.
- **Chương 5 — Kết luận và hướng phát triển**: tổng kết những gì đã đạt được và đề xuất hướng mở
  rộng cho đồ án.
