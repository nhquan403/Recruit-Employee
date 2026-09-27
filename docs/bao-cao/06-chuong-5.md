# CHƯƠNG 5. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## 5.1. Kết luận

Đồ án đã xây dựng hoàn chỉnh một website kết nối người tìm việc làm thêm với nhà tuyển dụng,
đạt đủ 6 mục tiêu cụ thể đã đề ra ở phần Mở đầu: khảo sát yêu cầu hai nhóm người dùng, thiết kế
cơ sở dữ liệu quan hệ 5 bảng, xây dựng API RESTful cho toàn bộ nghiệp vụ, xây dựng giao diện cho
ba vai trò, cài đặt tìm kiếm/lọc/thông báo, và kiểm thử hệ thống với một bản demo chạy được.

Toàn bộ 7 use case đã đặc tả đều được cài đặt và kiểm thử, vượt chỉ tiêu tối thiểu 6/7 đã đề ra
ban đầu. Kết quả kiểm thử tự động đạt 106/106 kịch bản, vượt chỉ tiêu tối thiểu 90%. Hệ thống
giải quyết đúng khoảng trống thị trường đã nêu ở Chương 1: một kênh vừa đủ nhẹ để đăng tin nhanh
như nhóm mạng xã hội, vừa có công cụ tìm kiếm/lọc và một bước kiểm duyệt tối thiểu mà các nền
tảng tuyển dụng lớn không tối ưu cho quy mô việc làm thời vụ, ngắn hạn.

Đóng góp cụ thể của đồ án nằm ở ba điểm: một hệ thống demo chuyên biệt cho việc làm thêm, khác
với các nền tảng tuyển dụng việc làm toàn thời gian hiện có; bộ lọc theo khu vực, khung giờ và
mức lương phù hợp đặc thù công việc bán thời gian; và một bộ mã nguồn cùng tài liệu thiết kế có
thể tái sử dụng hoặc mở rộng cho các đồ án, dự án tương tự sau này.

Bên cạnh kết quả đạt được, đồ án còn tồn tại các hạn chế đã nêu ở mục 4.4, chủ yếu liên quan đến
quy mô kiểm thử còn nhỏ và độ trễ của cơ chế thông báo — đây cũng chính là cơ sở cho các hướng
phát triển tiếp theo.

## 5.2. Hướng phát triển

- Xây dựng ứng dụng di động (mobile app) riêng cho hai vai trò ứng viên và nhà tuyển dụng, tận
  dụng lại toàn bộ API RESTful đã có sẵn.
- Bổ sung gợi ý việc làm theo lịch sử tìm kiếm của ứng viên, thay vì chỉ lọc theo tiêu chí người
  dùng tự chọn như hiện tại.
- Tích hợp xác thực danh tính (ví dụ đối chiếu thông tin cơ bản) để tăng độ tin cậy giữa hai bên
  trước khi nhận việc, mà vẫn giữ quy trình đăng ký đơn giản như đã thiết kế.
- Bổ sung cơ chế đánh giá hai chiều giữa ứng viên và nhà tuyển dụng sau khi kết thúc một đợt làm
  việc, giúp tích lũy uy tín cho cả hai phía qua thời gian.
- Thay cơ chế polling bằng kết nối đẩy dữ liệu tức thời (WebSocket) nếu quy mô người dùng tăng
  đủ lớn để độ trễ 20 giây trở thành vấn đề thực sự, đúng như đã cân nhắc ở mục 2.6.
- Triển khai bản demo công khai bằng Docker Compose trên một máy chủ thật, hoàn tất phần còn
  thiếu đã nêu ở mục 4.4.
