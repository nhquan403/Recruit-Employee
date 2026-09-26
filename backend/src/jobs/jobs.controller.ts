import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/auth.types';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ListJobsDto } from './dto/list-jobs.dto';
import { JobOwnerGuard } from './guards/job-owner.guard';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EMPLOYER')
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateJobDto) {
    return this.jobsService.create(user.id, dto);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EMPLOYER')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.jobsService.findMine(user.id);
  }

  @Get()
  findPublic(@Query() query: ListJobsDto) {
    return this.jobsService.findPublic(query);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser | undefined) {
    return this.jobsService.findOneForViewer(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, JobOwnerGuard)
  @Roles('EMPLOYER')
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, JobOwnerGuard)
  @Roles('EMPLOYER')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
