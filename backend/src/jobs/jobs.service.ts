import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Job, JobStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ListJobsDto } from './dto/list-jobs.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(employerId: string, dto: CreateJobDto): Promise<Job> {
    this.assertSalaryRange(dto.salaryMin, dto.salaryMax);

    return this.prisma.job.create({
      data: {
        ...dto,
        employerId,
        status: 'PENDING',
      },
    });
  }

  async findMine(employerId: string) {
    return this.prisma.job.findMany({
      where: { employerId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { applications: true } } },
    });
  }

  async findPublic(filters: ListJobsDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;

    const where: Prisma.JobWhereInput = {
      status: 'APPROVED',
      ...(filters.area ? { area: filters.area } : {}),
      ...(filters.shift ? { shift: filters.shift } : {}),
      ...(filters.q
        ? {
            OR: [
              { title: { contains: filters.q, mode: 'insensitive' } },
              { description: { contains: filters.q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(filters.salaryMin != null ? { salaryMax: { gte: filters.salaryMin } } : {}),
      ...(filters.salaryMax != null ? { salaryMin: { lte: filters.salaryMax } } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.job.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOneForViewer(id: string, viewer: AuthenticatedUser | undefined): Promise<Job> {
    const job = await this.prisma.job.findUnique({ where: { id } });

    if (!job) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng');
    }

    const isVisible =
      job.status === 'APPROVED' ||
      (viewer && (viewer.id === job.employerId || viewer.role === 'ADMIN'));

    if (!isVisible) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng');
    }

    return job;
  }

  async update(id: string, dto: UpdateJobDto): Promise<Job> {
    const existing = await this.prisma.job.findUniqueOrThrow({ where: { id } });
    this.assertSalaryRange(
      dto.salaryMin ?? existing.salaryMin,
      dto.salaryMax ?? existing.salaryMax,
    );

    const resubmitting = existing.status === 'REJECTED';

    return this.prisma.job.update({
      where: { id },
      data: {
        ...dto,
        ...(resubmitting ? { status: 'PENDING' as JobStatus, rejectReason: null } : {}),
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.application.deleteMany({ where: { jobId: id } });
    await this.prisma.job.delete({ where: { id } });
  }

  async setStatus(id: string, status: JobStatus, rejectReason: string | null): Promise<Job> {
    return this.prisma.job.update({
      where: { id },
      data: { status, rejectReason },
    });
  }

  private assertSalaryRange(min?: number | null, max?: number | null): void {
    if (min != null && max != null && min > max) {
      throw new BadRequestException('Mức lương tối thiểu không được lớn hơn mức lương tối đa');
    }
  }
}
