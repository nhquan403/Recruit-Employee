import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/auth.types';
import { JobOwnerGuard } from '../jobs/guards/job-owner.guard';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CANDIDATE')
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(user.id, dto);
  }

  @Get('applications/mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CANDIDATE')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.applicationsService.findMine(user.id);
  }

  @Get('jobs/:id/applications')
  @UseGuards(JwtAuthGuard, RolesGuard, JobOwnerGuard)
  @Roles('EMPLOYER')
  findByJob(@Param('id') jobId: string) {
    return this.applicationsService.findByJob(jobId);
  }

  @Patch('applications/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EMPLOYER')
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') applicationId: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatusByEmployer(applicationId, user.id, dto.status);
  }
}
