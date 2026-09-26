import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

export async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  await app.init();
  return app;
}

let counter = 0;
export function uniqueEmail(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}@test.com`;
}

interface RegisterOptions {
  role: 'CANDIDATE' | 'EMPLOYER';
  email?: string;
  password?: string;
  fullName?: string;
}

export async function registerAndLogin(app: INestApplication, options: RegisterOptions) {
  const email = options.email ?? uniqueEmail(options.role.toLowerCase());
  const password = options.password ?? 'Password123';

  const response = await request(app.getHttpServer())
    .post('/auth/register')
    .send({
      email,
      password,
      role: options.role,
      fullName: options.fullName ?? `Test ${options.role}`,
    });

  return {
    email,
    password,
    accessToken: response.body.accessToken as string,
    userId: response.body.user.id as string,
  };
}
