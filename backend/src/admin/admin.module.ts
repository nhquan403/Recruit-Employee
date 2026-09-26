import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { AdminJobsController } from './admin-jobs.controller';
import { AdminUsersController } from './admin-users.controller';
import { AdminStatsController } from './admin-stats.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [JobsModule],
  controllers: [AdminJobsController, AdminUsersController, AdminStatsController],
  providers: [AdminService],
})
export class AdminModule {}
