## 3.5. Cài đặt xác thực và phân quyền

Việc đăng ký chỉ chấp nhận vai trò `CANDIDATE` hoặc `EMPLOYER`
(`backend/src/auth/dto/register.dto.ts`); tài khoản `ADMIN` không tự đăng ký được mà chỉ được
tạo sẵn qua script khởi tạo dữ liệu (`backend/prisma/seed.ts`). Mỗi route cần đăng nhập gắn
`@UseGuards(JwtAuthGuard)` để xác thực token, và route cần giới hạn vai trò gắn thêm
`@UseGuards(RolesGuard)` cùng decorator `@Roles(...)` như đã trình bày ở mục 2.5.3. Chương 3
chỉ nêu lại cách áp dụng thật, không lặp lại lý thuyết.

## 3.6. Cài đặt từng use case

### 3.6.1. UC01 — Đăng ký / đăng nhập tài khoản

Người dùng chọn vai trò khi đăng ký tại `/dang-ky` (chỉ giữa ứng viên và nhà tuyển dụng), sau
đó đăng nhập tại `/dang-nhap`. Đăng nhập thành công trả về JWT và thông tin tài khoản, được lưu
vào `localStorage` phía trình duyệt (`frontend/src/lib/auth-context.tsx`, khoá lưu trữ
`vlt_auth`) để duy trì phiên đăng nhập giữa các lần tải trang.

### 3.6.2. UC02 — Đăng tin tuyển dụng

Nhà tuyển dụng điền form tại `/nha-tuyen-dung/dang-tin`. Khi gửi, backend tạo bản ghi `Job` với
`status` khởi tạo luôn là `PENDING`, không phụ thuộc dữ liệu client gửi lên:

```ts
// backend/src/jobs/jobs.service.ts:13-23
async create(employerId: string, dto: CreateJobDto): Promise<Job> {
  this.assertSalaryRange(dto.salaryMin, dto.salaryMax);
  return this.prisma.job.create({
    data: { ...dto, employerId, status: 'PENDING' },
  });
}
```

Hình 3.1 thể hiện form đăng tin.

[Hình 3.1]
Nguồn: chụp từ hệ thống

### 3.6.3. UC03 — Tìm kiếm và lọc tin tuyển dụng

Trang chủ và trang `/viec-lam` cùng dùng một API `GET /jobs` với các tham số lọc `q` (từ khoá),
`area` (khu vực), `shift` (khung giờ), `salaryMin`/`salaryMax` (khoảng lương), và phân trang
`page`/`limit` (`backend/src/jobs/dto/list-jobs.dto.ts`). Chỉ tin có `status = APPROVED` được
trả về cho người dùng công khai.

Hình 1.1 thể hiện trang chủ với danh sách tin phù hợp.

[Hình 1.1]
Nguồn: chụp từ hệ thống

Hình 1.2 thể hiện trang tìm việc với bộ lọc đầy đủ.

[Hình 1.2]
Nguồn: chụp từ hệ thống

### 3.6.4. UC04 — Ứng tuyển vào tin tuyển dụng

Từ trang chi tiết tin, ứng viên bấm "Ứng tuyển" để gọi `POST /applications`. Backend kiểm tra
tin còn ở trạng thái `APPROVED` mới cho ứng tuyển, tạo bản ghi `Application`, và tạo ngay một
`Notification` cho nhà tuyển dụng:

```ts
// backend/src/applications/applications.service.ts:28-57 (rút gọn)
async create(candidateId: string, dto: CreateApplicationDto) {
  const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
  if (!job || job.status !== 'APPROVED') {
    throw new ConflictException('Tin tuyển dụng không còn nhận hồ sơ ứng tuyển');
  }
  const application = await this.prisma.application.create({
    data: { jobId: dto.jobId, candidateId, message: dto.message },
  });
  await this.notificationsService.create({
    userId: job.employerId,
    type: 'APPLICATION_CREATED',
    message: `Có ứng viên mới ứng tuyển vào "${job.title}"`,
    link: `/nha-tuyen-dung/tin/${job.id}/ung-vien`,
  });
  return application;
}
```

Ràng buộc duy nhất `(jobId, candidateId)` ở cấp cơ sở dữ liệu (mục 3.2) đảm bảo một ứng viên
không ứng tuyển trùng lặp vào cùng một tin. Nếu vi phạm, backend bắt lỗi mã `P2002` của Prisma
và trả về thông báo "Bạn đã ứng tuyển vào tin này rồi" thay vì để lỗi cơ sở dữ liệu lộ ra ngoài.

Hình 1.3 thể hiện trang chi tiết một tin tuyển dụng, nơi ứng viên bấm ứng tuyển.

[Hình 1.3]
Nguồn: chụp từ hệ thống

### 3.6.5. UC05 — Quản lý danh sách ứng viên đã ứng tuyển

Nhà tuyển dụng xem danh sách ứng viên của một tin tại `/nha-tuyen-dung/tin/:id/ung-vien`, gọi
`GET /jobs/:id/applications`. Lần gọi này đồng thời đánh dấu các hồ sơ đang ở trạng thái
`PENDING` chuyển sang `VIEWED`. Nhà tuyển dụng chọn "Mời phỏng vấn" hoặc "Từ chối" để gọi `PATCH
/applications/:id/status`, cập nhật lại `status` và tạo thông báo cho ứng viên
(`backend/src/applications/applications.service.ts:102-130`, đã trích ở mục 3.4).

Hình 3.2 thể hiện trang quản lý ứng viên với hai hồ sơ ở hai trạng thái khác nhau.

[Hình 3.2]
Nguồn: chụp từ hệ thống

### 3.6.6. UC06 — Duyệt hoặc từ chối tin tuyển dụng

Quản trị viên xem tin chờ duyệt tại `/quan-tri`, gọi `GET /admin/jobs` để lấy danh sách tin có
`status = PENDING`, rồi gọi `PATCH /admin/jobs/:id/approve` hoặc `PATCH
/admin/jobs/:id/reject` để chuyển trạng thái. Chỉ tin đã `APPROVED` mới hiển thị công khai và
nhận được hồ sơ ứng tuyển (ràng buộc đã nêu ở mục 3.6.4).

Hình 3.3 thể hiện trang quản trị với tổng quan hệ thống, tin chờ duyệt và danh sách người dùng.

[Hình 3.3]
Nguồn: chụp từ hệ thống

### 3.6.7. UC07 — Nhận thông báo cập nhật hồ sơ

Cơ chế polling đã trình bày ở mục 2.6 và 3.1: mỗi 20 giây, giao diện gọi lại `GET
/notifications/mine` và `GET /notifications/mine/unread-count` để cập nhật số thông báo chưa
đọc trên biểu tượng chuông và danh sách thông báo khi mở ra.

Hình 3.4 thể hiện chuông thông báo đang mở, hiển thị một thông báo chưa đọc.

[Hình 3.4]
Nguồn: chụp từ hệ thống

## 3.7. Giao diện khác

Ngoài các màn hình đã minh họa theo từng use case ở trên, hệ thống còn có trang hồ sơ cá nhân
của ứng viên.

Hình 3.5 thể hiện trang hồ sơ cá nhân của ứng viên (`/ho-so`), nơi ứng viên xem lại thông tin
tài khoản của mình.

[Hình 3.5]
Nguồn: chụp từ hệ thống
