import { BadRequestException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';

function buildPrismaMock() {
  return {
    job: {
      create: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    application: {
      deleteMany: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;
}

describe('JobsService', () => {
  let prisma: jest.Mocked<PrismaService>;
  let jobsService: JobsService;

  beforeEach(() => {
    prisma = buildPrismaMock();
    jobsService = new JobsService(prisma);
  });

  describe('create', () => {
    it('always creates the job with status PENDING', async () => {
      (prisma.job.create as jest.Mock).mockResolvedValue({ id: 'job-1', status: 'PENDING' });

      await jobsService.create('employer-1', {
        title: 'Phục vụ quán cà phê',
        description: 'Mô tả công việc chi tiết',
        area: 'Quận 1',
        shift: 'Tối',
      });

      expect(prisma.job.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'PENDING', employerId: 'employer-1' }),
        }),
      );
    });

    it('rejects when salaryMin is greater than salaryMax', async () => {
      await expect(
        jobsService.create('employer-1', {
          title: 'Phục vụ quán cà phê',
          description: 'Mô tả công việc chi tiết',
          area: 'Quận 1',
          shift: 'Tối',
          salaryMin: 50000,
          salaryMax: 20000,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.job.create).not.toHaveBeenCalled();
    });
  });

  describe('findPublic', () => {
    it('always filters to APPROVED jobs regardless of other filters', async () => {
      await jobsService.findPublic({ area: 'Quận 1', page: 1, limit: 10 });

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'APPROVED', area: 'Quận 1' }),
        }),
      );
    });
  });

  describe('findOneForViewer', () => {
    it('returns an approved job to an anonymous viewer', async () => {
      const job = { id: 'job-1', status: 'APPROVED', employerId: 'employer-1' };
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);

      await expect(jobsService.findOneForViewer('job-1', undefined)).resolves.toEqual(job);
    });

    it('hides a pending job from an anonymous viewer as a 404', async () => {
      const job = { id: 'job-1', status: 'PENDING', employerId: 'employer-1' };
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);

      await expect(jobsService.findOneForViewer('job-1', undefined)).rejects.toThrow();
    });

    it('hides a pending job from a different candidate too', async () => {
      const job = { id: 'job-1', status: 'PENDING', employerId: 'employer-1' };
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);

      await expect(
        jobsService.findOneForViewer('job-1', {
          id: 'candidate-1',
          email: 'c@test.com',
          role: 'CANDIDATE',
          fullName: 'C',
        }),
      ).rejects.toThrow();
    });

    it('shows a pending job to its own employer', async () => {
      const job = { id: 'job-1', status: 'PENDING', employerId: 'employer-1' };
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);

      await expect(
        jobsService.findOneForViewer('job-1', {
          id: 'employer-1',
          email: 'e@test.com',
          role: 'EMPLOYER',
          fullName: 'E',
        }),
      ).resolves.toEqual(job);
    });
  });
});
