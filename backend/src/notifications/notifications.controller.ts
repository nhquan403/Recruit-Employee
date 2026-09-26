import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/auth.types';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('mine')
  findMine(@CurrentUser() user: AuthenticatedUser, @Query('unreadOnly') unreadOnly?: string) {
    return this.notificationsService.findMine(user.id, unreadOnly === 'true');
  }

  @Get('mine/unread-count')
  async countUnread(@CurrentUser() user: AuthenticatedUser) {
    const count = await this.notificationsService.countUnread(user.id);
    return { count };
  }

  @Patch(':id/read')
  markRead(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.notificationsService.markRead(id, user.id);
  }

  @Patch('read-all')
  markAllRead(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.markAllRead(user.id);
  }
}
