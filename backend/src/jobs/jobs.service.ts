import { BadRequestException, Injectable } from '@nestjs/common';
import { Job, JobStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

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

  async findOneOwned(id: string): Promise<Job | null> {
    return this.prisma.job.findUnique({ where: { id } });
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
