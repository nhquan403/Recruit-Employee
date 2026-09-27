/**
 * Sinh dữ liệu demo SẠCH (tên tiếng Việt có dấu, đủ trạng thái cần cho ảnh chụp) cho Phase 3
 * của quy trình báo cáo — tách khỏi backend/prisma/seed.ts (seed đó chỉ tạo tài khoản admin).
 * Idempotent: chạy lại không tạo trùng, chỉ upsert theo email/tiêu đề.
 *
 * Chạy: cd backend && npx ts-node ../scripts/bao_cao_hinh/seed-demo.ts
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const MAT_KHAU_DEMO = 'Demo@12345';

async function upsertUser(email: string, role: 'CANDIDATE' | 'EMPLOYER', fullName: string) {
  const passwordHash = await bcrypt.hash(MAT_KHAU_DEMO, 10);
  return prisma.user.upsert({
    where: { email },
    update: { fullName },
    create: { email, passwordHash, role, fullName },
  });
}

async function main() {
  const employer = await upsertUser(
    'demo.employer@vieclamthem.local',
    'EMPLOYER',
    'Quán Cà Phê Xanh',
  );
  const candidate1 = await upsertUser(
    'demo.candidate1@vieclamthem.local',
    'CANDIDATE',
    'Nguyễn Văn An',
  );
  const candidate2 = await upsertUser(
    'demo.candidate2@vieclamthem.local',
    'CANDIDATE',
    'Trần Thị Bình',
  );

  await prisma.profile.upsert({
    where: { userId: candidate1.id },
    update: {},
    create: {
      userId: candidate1.id,
      bio: 'Sinh viên năm 3, có thể làm ca tối và cuối tuần.',
      skills: ['Giao tiếp', 'Pha chế'],
      preferredAreas: ['Quận Ninh Kiều', 'Quận Cái Răng'],
    },
  });

  const jobDangChoDuyet = await prisma.job.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {
      title: 'Nhân viên phục vụ quán cà phê cuối tuần',
      description:
        'Phục vụ đồ uống, dọn dẹp bàn, hỗ trợ pha chế cơ bản vào ca cuối tuần. Không yêu cầu kinh nghiệm, được đào tạo tại chỗ.',
      area: 'Quận Ninh Kiều, Cần Thơ',
      shift: 'Thứ 7 - Chủ nhật, 14h-22h',
      salaryMin: 25000,
      salaryMax: 30000,
      status: 'PENDING',
      employerId: employer.id,
    },
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Nhân viên phục vụ quán cà phê cuối tuần',
      description:
        'Phục vụ đồ uống, dọn dẹp bàn, hỗ trợ pha chế cơ bản vào ca cuối tuần. Không yêu cầu kinh nghiệm, được đào tạo tại chỗ.',
      area: 'Quận Ninh Kiều, Cần Thơ',
      shift: 'Thứ 7 - Chủ nhật, 14h-22h',
      salaryMin: 25000,
      salaryMax: 30000,
      status: 'PENDING',
      employerId: employer.id,
    },
  });

  const jobDaDuyet = await prisma.job.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {
      title: 'Nhân viên bán hàng thời vụ dịp lễ',
      description:
        'Hỗ trợ bán hàng, tư vấn khách, sắp xếp quầy kệ trong đợt cao điểm dịp lễ. Ưu tiên sinh viên rảnh buổi tối.',
      area: 'Quận Ninh Kiều, Cần Thơ',
      shift: 'Các ngày trong tuần, 17h-21h',
      salaryMin: 22000,
      salaryMax: 27000,
      status: 'APPROVED',
      employerId: employer.id,
    },
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      title: 'Nhân viên bán hàng thời vụ dịp lễ',
      description:
        'Hỗ trợ bán hàng, tư vấn khách, sắp xếp quầy kệ trong đợt cao điểm dịp lễ. Ưu tiên sinh viên rảnh buổi tối.',
      area: 'Quận Ninh Kiều, Cần Thơ',
      shift: 'Các ngày trong tuần, 17h-21h',
      salaryMin: 22000,
      salaryMax: 27000,
      status: 'APPROVED',
      employerId: employer.id,
    },
  });

  await prisma.job.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      title: 'Nhân viên giao hàng bán thời gian',
      description:
        'Giao hàng khu vực nội thành bằng xe máy, chủ động thời gian, thanh toán theo đơn.',
      area: 'Quận Bình Thuỷ, Cần Thơ',
      shift: 'Linh hoạt, tối thiểu 4 giờ/ngày',
      salaryMin: 20000,
      salaryMax: 35000,
      status: 'APPROVED',
      employerId: employer.id,
    },
  });

  await prisma.job.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      title: 'Gia sư dạy kèm buổi tối',
      description:
        'Dạy kèm học sinh cấp 2, các buổi tối trong tuần, ưu tiên sinh viên sư phạm hoặc CNTT.',
      area: 'Quận Ninh Kiều, Cần Thơ',
      shift: 'Tối thứ 2-4-6, 19h-21h',
      salaryMin: 100000,
      salaryMax: 150000,
      salaryUnit: 'VND/buổi',
      status: 'APPROVED',
      employerId: employer.id,
    },
  });

  const app1 = await prisma.application.upsert({
    where: { jobId_candidateId: { jobId: jobDaDuyet.id, candidateId: candidate1.id } },
    update: { status: 'VIEWED' },
    create: {
      jobId: jobDaDuyet.id,
      candidateId: candidate1.id,
      status: 'VIEWED',
      message: 'Em có thể bắt đầu làm ngay tuần này ạ.',
    },
  });

  await prisma.application.upsert({
    where: { jobId_candidateId: { jobId: jobDaDuyet.id, candidateId: candidate2.id } },
    update: { status: 'INTERVIEW' },
    create: {
      jobId: jobDaDuyet.id,
      candidateId: candidate2.id,
      status: 'INTERVIEW',
      message: 'Em từng làm bán hàng thời vụ một mùa hè rồi ạ.',
    },
  });

  await prisma.notification.upsert({
    where: { id: '00000000-0000-0000-0000-000000000101' },
    update: { isRead: false },
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      userId: employer.id,
      type: 'NEW_APPLICATION',
      message: `Nguyễn Văn An vừa ứng tuyển vào tin "${jobDaDuyet.title}"`,
      link: `/employer/jobs/${jobDaDuyet.id}/applicants`,
      isRead: false,
    },
  });

  await prisma.notification.upsert({
    where: { id: '00000000-0000-0000-0000-000000000102' },
    update: { isRead: false },
    create: {
      id: '00000000-0000-0000-0000-000000000102',
      userId: candidate1.id,
      type: 'APPLICATION_STATUS',
      message: `Hồ sơ ứng tuyển "${jobDaDuyet.title}" của bạn đã được xem`,
      link: `/candidate/applications`,
      isRead: false,
    },
  });

  console.log('Đã seed dữ liệu demo:');
  console.log(`  Employer: ${employer.email} / ${MAT_KHAU_DEMO}`);
  console.log(`  Candidate 1: ${candidate1.email} / ${MAT_KHAU_DEMO}`);
  console.log(`  Candidate 2: ${candidate2.email} / ${MAT_KHAU_DEMO}`);
  console.log(`  Job chờ duyệt: ${jobDangChoDuyet.id}`);
  console.log(`  Job đã duyệt: ${jobDaDuyet.id}`);
  console.log(`  Application (VIEWED): ${app1.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
