import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp, registerAndLogin, uniqueEmail } from './utils/test-app';

describe('Applications (e2e)', () => {
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

  async function createApprovedJob(employerToken: string) {
    const createRes = await request(app.getHttpServer())
      .post('/jobs')
      .set('Authorization', `Bearer ${employerToken}`)
      .send({
        title: `Apply-flow job ${Date.now()}`,
        description: 'A sufficiently long description for validation',
        area: 'Quận 1',
        shift: 'Tối',
      });
    const jobId = createRes.body.id as string;

    await request(app.getHttpServer())
      .patch(`/admin/jobs/${jobId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    return jobId;
  }

  it('runs the full apply -> employer views -> status change -> candidate sees it flow', async () => {
    const employer = await registerAndLogin(app, { role: 'EMPLOYER' });
    const candidate = await registerAndLogin(app, { role: 'CANDIDATE' });
    const jobId = await createApprovedJob(employer.accessToken);

    const applyRes = await request(app.getHttpServer())
      .post('/applications')
      .set('Authorization', `Bearer ${candidate.accessToken}`)
      .send({ jobId });
    expect(applyRes.status).toBe(201);
    expect(applyRes.body.status).toBe('PENDING');
    const applicationId = applyRes.body.id as string;

    const employerViewRes = await request(app.getHttpServer())
      .get(`/jobs/${jobId}/applications`)
      .set('Authorization', `Bearer ${employer.accessToken}`);
    expect(employerViewRes.status).toBe(200);
    const viewedApplication = employerViewRes.body.find(
      (a: { id: string }) => a.id === applicationId,
    );
    expect(viewedApplication.status).toBe('VIEWED');

    const statusRes = await request(app.getHttpServer())
      .patch(`/applications/${applicationId}/status`)
      .set('Authorization', `Bearer ${employer.accessToken}`)
      .send({ status: 'INTERVIEW' });
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.status).toBe('INTERVIEW');

    const candidateMineRes = await request(app.getHttpServer())
      .get('/applications/mine')
      .set('Authorization', `Bearer ${candidate.accessToken}`);
    const candidateView = candidateMineRes.body.find((a: { id: string }) => a.id === applicationId);
    expect(candidateView.status).toBe('INTERVIEW');

    const notificationsRes = await request(app.getHttpServer())
      .get('/notifications/mine')
      .set('Authorization', `Bearer ${candidate.accessToken}`);
    expect(
      notificationsRes.body.some((n: { type: string }) => n.type === 'APPLICATION_STATUS_CHANGED'),
    ).toBe(true);
  });

  it('rejects a duplicate application with 409', async () => {
    const employer = await registerAndLogin(app, { role: 'EMPLOYER' });
    const candidate = await registerAndLogin(app, { role: 'CANDIDATE' });
    const jobId = await createApprovedJob(employer.accessToken);

    await request(app.getHttpServer())
      .post('/applications')
      .set('Authorization', `Bearer ${candidate.accessToken}`)
      .send({ jobId })
      .expect(201);

    await request(app.getHttpServer())
      .post('/applications')
      .set('Authorization', `Bearer ${candidate.accessToken}`)
      .send({ jobId })
      .expect(409);
  });

  it('rejects applying to a non-approved job with 409', async () => {
    const employer = await registerAndLogin(app, { role: 'EMPLOYER' });
    const candidate = await registerAndLogin(app, { role: 'CANDIDATE' });

    const createRes = await request(app.getHttpServer())
      .post('/jobs')
      .set('Authorization', `Bearer ${employer.accessToken}`)
      .send({
        title: 'Still pending job',
        description: 'A sufficiently long description for validation',
        area: 'Quận 1',
        shift: 'Sáng',
      });

    await request(app.getHttpServer())
      .post('/applications')
      .set('Authorization', `Bearer ${candidate.accessToken}`)
      .send({ jobId: createRes.body.id })
      .expect(409);
  });

  it('forbids an employer from applying to a job with 403', async () => {
    const employer = await registerAndLogin(app, { role: 'EMPLOYER' });
    const jobId = await createApprovedJob(employer.accessToken);

    await request(app.getHttpServer())
      .post('/applications')
      .set('Authorization', `Bearer ${employer.accessToken}`)
      .send({ jobId })
      .expect(403);
  });
});
