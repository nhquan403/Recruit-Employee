import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const db = await this.prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false);

    return { status: 'ok', db };
  }
}
