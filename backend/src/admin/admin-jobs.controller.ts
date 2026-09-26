import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { ListAdminJobsDto } from './dto/list-admin-jobs.dto';
import { RejectJobDto } from './dto/reject-job.dto';

@Controller('admin/jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminJobsController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  list(@Query() query: ListAdminJobsDto) {
    return this.adminService.listJobs(query);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.adminService.approveJob(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Body() dto: RejectJobDto) {
    return this.adminService.rejectJob(id, dto.reason);
  }
}
