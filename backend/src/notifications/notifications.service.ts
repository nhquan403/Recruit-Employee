import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type NotificationType =
  'APPLICATION_CREATED' | 'APPLICATION_STATUS_CHANGED' | 'JOB_APPROVED' | 'JOB_REJECTED';

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  message: string;
  link?: string;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateNotificationInput): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        message: input.message,
        link: input.link,
      },
    });
  }

  async findMine(userId: string, unreadOnly: boolean) {
    return this.prisma.notification.findMany({
      where: { userId, ...(unreadOnly ? { isRead: false } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async countUnread(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }

  async markRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }
    if (notification.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập thông báo này');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
