import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../../auth/auth.types';

@Injectable()
export class JobOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: AuthenticatedUser }>();
    const jobId = request.params.id as string;

    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng');
    }

    if (job.employerId !== request.user.id) {
      throw new ForbiddenException('Bạn không có quyền truy cập tin tuyển dụng này');
    }

    return true;
  }
}
