import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Application, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmployerSettableStatus } from './dto/update-application-status.dto';
import { CreateApplicationDto } from './dto/create-application.dto';

const PRISMA_UNIQUE_CONSTRAINT_ERROR_CODE = 'P2002';

const STATUS_LABELS: Record<EmployerSettableStatus, string> = {
  VIEWED: 'Đã xem',
  INTERVIEW: 'Mời phỏng vấn',
  REJECTED: 'Từ chối',
};

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(candidateId: string, dto: CreateApplicationDto): Promise<Application> {
    const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
    if (!job || job.status !== 'APPROVED') {
      throw new ConflictException('Tin tuyển dụng không còn nhận hồ sơ ứng tuyển');
    }

    let application: Application;
    try {
      application = await this.prisma.application.create({
        data: { jobId: dto.jobId, candidateId, message: dto.message },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR_CODE
      ) {
        throw new ConflictException('Bạn đã ứng tuyển vào tin này rồi');
      }
      throw error;
    }

    await this.notificationsService.create({
      userId: job.employerId,
      type: 'APPLICATION_CREATED',
      message: `Có ứng viên mới ứng tuyển vào "${job.title}"`,
      link: `/nha-tuyen-dung/tin/${job.id}/ung-vien`,
    });

    return application;
  }

  async findMine(candidateId: string) {
    return this.prisma.application.findMany({
      where: { candidateId },
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            area: true,
            shift: true,
            salaryMin: true,
            salaryMax: true,
            salaryUnit: true,
          },
        },
      },
    });
  }

  async findByJob(jobId: string) {
    await this.prisma.application.updateMany({
      where: { jobId, status: 'PENDING' },
      data: { status: 'VIEWED' },
    });

    return this.prisma.application.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
      include: {
        candidate: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            profile: { select: { bio: true, skills: true, preferredAreas: true } },
          },
        },
      },
    });
  }

  async updateStatusByEmployer(
    applicationId: string,
    employerId: string,
    status: EmployerSettableStatus,
  ): Promise<Application> {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) {
      throw new NotFoundException('Không tìm thấy hồ sơ ứng tuyển');
    }

    if (application.job.employerId !== employerId) {
      throw new ForbiddenException('Bạn không có quyền cập nhật hồ sơ ứng tuyển này');
    }

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    await this.notificationsService.create({
      userId: application.candidateId,
      type: 'APPLICATION_STATUS_CHANGED',
      message: `Đơn ứng tuyển "${application.job.title}" đã chuyển sang trạng thái: ${STATUS_LABELS[status]}`,
      link: '/ho-so',
    });

    return updated;
  }
}
