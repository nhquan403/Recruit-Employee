import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, uniqueEmail } from './utils/test-app';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers, logs in, and reads the current user', async () => {
    const email = uniqueEmail('auth-flow');

    const registerRes = await request(app.getHttpServer()).post('/auth/register').send({
      email,
      password: 'Password123',
      role: 'CANDIDATE',
      fullName: 'Full Flow Candidate',
    });
    expect(registerRes.status).toBe(201);
    expect(registerRes.body.accessToken).toBeDefined();

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'Password123' });
    expect(loginRes.status).toBe(200);

    const meRes = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`);
    expect(meRes.status).toBe(200);
    expect(meRes.body.email).toBe(email);
  });

  it('rejects a duplicate email with 409', async () => {
    const email = uniqueEmail('dup');
    const payload = { email, password: 'Password123', role: 'CANDIDATE', fullName: 'Dup' };

    await request(app.getHttpServer()).post('/auth/register').send(payload).expect(201);
    await request(app.getHttpServer()).post('/auth/register').send(payload).expect(409);
  });

  it('rejects a forged ADMIN role at registration with 400', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: uniqueEmail('hacker'),
        password: 'Password123',
        role: 'ADMIN',
        fullName: 'Hacker',
      })
      .expect(400);
  });

  it('rejects a wrong password with 401', async () => {
    const email = uniqueEmail('wrongpw');
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'Password123', role: 'CANDIDATE', fullName: 'X' });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'WrongPassword' })
      .expect(401);
  });

  it('rejects /auth/me without a token with 401', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });
});
