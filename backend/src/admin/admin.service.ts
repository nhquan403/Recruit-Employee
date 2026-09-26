import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';
import { ListAdminJobsDto } from './dto/list-admin-jobs.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
  ) {}

  async listJobs(filters: ListAdminJobsDto) {
    const status = filters.status ?? 'PENDING';
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    const where = { status };
    const [items, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { employer: { select: { fullName: true, email: true } } },
      }),
      this.prisma.job.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async approveJob(id: string) {
    return this.jobsService.setStatus(id, 'APPROVED', null);
  }

  async rejectJob(id: string, reason: string | undefined) {
    return this.jobsService.setStatus(id, 'REJECTED', reason ?? null);
  }

  async listUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async getStats() {
    const [totalJobs, totalUsers, pendingJobs, totalApplications] = await Promise.all([
      this.prisma.job.count(),
      this.prisma.user.count(),
      this.prisma.job.count({ where: { status: 'PENDING' } }),
      this.prisma.application.count(),
    ]);

    return { totalJobs, totalUsers, pendingJobs, totalApplications };
  }
}
