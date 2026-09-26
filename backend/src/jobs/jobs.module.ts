import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobOwnerGuard } from './guards/job-owner.guard';

@Module({
  controllers: [JobsController],
  providers: [JobsService, JobOwnerGuard],
  exports: [JobsService, JobOwnerGuard],
})
export class JobsModule {}
