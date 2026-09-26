import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Application } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmployerSettableStatus } from './dto/update-application-status.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });
  }
}
