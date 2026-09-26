import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp, registerAndLogin, uniqueEmail } from './utils/test-app';

describe('Jobs (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);

    const adminEmail = uniqueEmail('admin');
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: await bcrypt.hash('AdminPass123', 4),
        role: 'ADMIN',
        fullName: 'Test Admin',
      },
    });
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password: 'AdminPass123' });
    adminToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a job as PENDING, hidden from the public list until approved', async () => {
    const employer = await registerAndLogin(app, { role: 'EMPLOYER' });

    const createRes = await request(app.getHttpServer())
      .post('/jobs')
      .set('Authorization', `Bearer ${employer.accessToken}`)
      .send({
        title: 'E2E job posting test',
        description: 'A sufficiently long description for validation',
        area: 'Quận 1',
        shift: 'Tối',
      });
    expect(createRes.status).toBe(201);
    expect(createRes.body.status).toBe('PENDING');

    const jobId = createRes.body.id;

    const publicListRes = await request(app.getHttpServer()).get('/jobs?q=E2E job posting test');
    expect(publicListRes.body.items.find((j: { id: string }) => j.id === jobId)).toBeUndefined();

    const anonDetailRes = await request(app.getHttpServer()).get(`/jobs/${jobId}`);
    expect(anonDetailRes.status).toBe(404);

    const approveRes = await request(app.getHttpServer())
      .patch(`/admin/jobs/${jobId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(approveRes.status).toBe(200);
    expect(approveRes.body.status).toBe('APPROVED');

    const publicListAfterRes = await request(app.getHttpServer()).get(
      '/jobs?q=E2E job posting test',
    );
    expect(publicListAfterRes.body.items.find((j: { id: string }) => j.id === jobId)).toBeDefined();

    const anonDetailAfterRes = await request(app.getHttpServer()).get(`/jobs/${jobId}`);
    expect(anonDetailAfterRes.status).toBe(200);
  });

  it('rejects salaryMin greater than salaryMax with 400', async () => {
    const employer = await registerAndLogin(app, { role: 'EMPLOYER' });

    await request(app.getHttpServer())
      .post('/jobs')
      .set('Authorization', `Bearer ${employer.accessToken}`)
      .send({
        title: 'Bad salary job',
        description: 'A sufficiently long description for validation',
        area: 'Quận 1',
        shift: 'Sáng',
        salaryMin: 50000,
        salaryMax: 20000,
      })
      .expect(400);
  });

  it('forbids a different employer from editing someone else’s job', async () => {
    const employerA = await registerAndLogin(app, { role: 'EMPLOYER' });
    const employerB = await registerAndLogin(app, { role: 'EMPLOYER' });

    const createRes = await request(app.getHttpServer())
      .post('/jobs')
      .set('Authorization', `Bearer ${employerA.accessToken}`)
      .send({
        title: 'Owned by employer A',
        description: 'A sufficiently long description for validation',
        area: 'Quận 1',
        shift: 'Sáng',
      });

    await request(app.getHttpServer())
      .patch(`/jobs/${createRes.body.id}`)
      .set('Authorization', `Bearer ${employerB.accessToken}`)
      .send({ title: 'hacked' })
      .expect(403);
  });
});
