import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

function buildPrismaMock() {
  return {
    job: { findUnique: jest.fn() },
    application: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;
}

function buildNotificationsMock() {
  return {
    create: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<NotificationsService>;
}

describe('ApplicationsService', () => {
  let prisma: jest.Mocked<PrismaService>;
  let notifications: jest.Mocked<NotificationsService>;
  let service: ApplicationsService;

  beforeEach(() => {
    prisma = buildPrismaMock();
    notifications = buildNotificationsMock();
    service = new ApplicationsService(prisma, notifications);
  });

  describe('create', () => {
    it('rejects applying to a job that is not APPROVED', async () => {
      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: 'job-1',
        status: 'PENDING',
        employerId: 'employer-1',
        title: 'Job',
      });

      await expect(service.create('candidate-1', { jobId: 'job-1' })).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.application.create).not.toHaveBeenCalled();
    });

    it('rejects a duplicate application with a 409', async () => {
      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: 'job-1',
        status: 'APPROVED',
        employerId: 'employer-1',
        title: 'Job',
      });
      (prisma.application.create as jest.Mock).mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('duplicate', {
          code: 'P2002',
          clientVersion: 'test',
        }),
      );

      await expect(service.create('candidate-1', { jobId: 'job-1' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('notifies the employer when an application is created', async () => {
      (prisma.job.findUnique as jest.Mock).mockResolvedValue({
        id: 'job-1',
        status: 'APPROVED',
        employerId: 'employer-1',
        title: 'Job title',
      });
      (prisma.application.create as jest.Mock).mockResolvedValue({ id: 'app-1' });

      await service.create('candidate-1', { jobId: 'job-1' });

      expect(notifications.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'employer-1', type: 'APPLICATION_CREATED' }),
      );
    });
  });

  describe('updateStatusByEmployer', () => {
    it('rejects when the caller does not own the application job', async () => {
      (prisma.application.findUnique as jest.Mock).mockResolvedValue({
        id: 'app-1',
        candidateId: 'candidate-1',
        job: { id: 'job-1', employerId: 'employer-1', title: 'Job' },
      });

      await expect(
        service.updateStatusByEmployer('app-1', 'employer-2', 'INTERVIEW'),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.application.update).not.toHaveBeenCalled();
    });

    it('updates the status and notifies the candidate when the owner calls it', async () => {
      (prisma.application.findUnique as jest.Mock).mockResolvedValue({
        id: 'app-1',
        candidateId: 'candidate-1',
        job: { id: 'job-1', employerId: 'employer-1', title: 'Job' },
      });
      (prisma.application.update as jest.Mock).mockResolvedValue({
        id: 'app-1',
        status: 'INTERVIEW',
      });

      await service.updateStatusByEmployer('app-1', 'employer-1', 'INTERVIEW');

      expect(prisma.application.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'INTERVIEW' } }),
      );
      expect(notifications.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'candidate-1', type: 'APPLICATION_STATUS_CHANGED' }),
      );
    });
  });
});
