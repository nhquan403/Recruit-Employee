import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp, registerAndLogin, uniqueEmail } from './utils/test-app';

type Method = 'get' | 'post' | 'patch' | 'delete';
type Role = 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';

interface RouteCase {
  method: Method;
  path: string;
  allowedRole: Role;
  body?: Record<string, unknown>;
}

const DUMMY_ID = '00000000-0000-0000-0000-000000000000';

// Every protected route in the app that only needs a role check (not resource
// ownership — those are covered by dedicated tests in jobs/applications specs).
// This table is the "test kỹ phần này" requirement made concrete: adding a new
// protected route later means adding one row here.
// /auth/me is deliberately excluded: it is open to any authenticated role by
// design (checking your own identity), not role-restricted — covered separately below.
const ROUTE_CASES: RouteCase[] = [
  {
    method: 'post',
    path: '/jobs',
    allowedRole: 'EMPLOYER',
    body: { title: 'x', description: 'x'.repeat(15), area: 'x', shift: 'x' },
  },
  { method: 'get', path: '/jobs/mine', allowedRole: 'EMPLOYER' },
  { method: 'patch', path: `/jobs/${DUMMY_ID}`, allowedRole: 'EMPLOYER', body: { title: 'x' } },
  { method: 'delete', path: `/jobs/${DUMMY_ID}`, allowedRole: 'EMPLOYER' },
  { method: 'post', path: '/applications', allowedRole: 'CANDIDATE', body: { jobId: DUMMY_ID } },
  { method: 'get', path: '/applications/mine', allowedRole: 'CANDIDATE' },
  { method: 'get', path: `/jobs/${DUMMY_ID}/applications`, allowedRole: 'EMPLOYER' },
  {
    method: 'patch',
    path: `/applications/${DUMMY_ID}/status`,
    allowedRole: 'EMPLOYER',
    body: { status: 'VIEWED' },
  },
  { method: 'get', path: '/profiles/me', allowedRole: 'CANDIDATE' },
  { method: 'patch', path: '/profiles/me', allowedRole: 'CANDIDATE', body: { bio: 'x' } },
  { method: 'get', path: '/admin/jobs', allowedRole: 'ADMIN' },
  { method: 'patch', path: `/admin/jobs/${DUMMY_ID}/approve`, allowedRole: 'ADMIN' },
  { method: 'patch', path: `/admin/jobs/${DUMMY_ID}/reject`, allowedRole: 'ADMIN' },
  { method: 'get', path: '/admin/users', allowedRole: 'ADMIN' },
  { method: 'get', path: '/admin/stats', allowedRole: 'ADMIN' },
];

const ALL_ROLES: Role[] = ['CANDIDATE', 'EMPLOYER', 'ADMIN'];

describe('RBAC sweep (e2e)', () => {
  let app: INestApplication;
  let tokens: Record<Role, string>;

  beforeAll(async () => {
    app = await createTestApp();
    const prisma = app.get(PrismaService);

    const candidate = await registerAndLogin(app, { role: 'CANDIDATE' });
    const employer = await registerAndLogin(app, { role: 'EMPLOYER' });

    const adminEmail = uniqueEmail('rbac-admin');
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: await bcrypt.hash('AdminPass123', 4),
        role: 'ADMIN',
        fullName: 'RBAC Admin',
      },
    });
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password: 'AdminPass123' });

    tokens = {
      CANDIDATE: candidate.accessToken,
      EMPLOYER: employer.accessToken,
      ADMIN: adminLogin.body.accessToken,
    };
  });

  afterAll(async () => {
    await app.close();
  });

  it.each(ROUTE_CASES)(
    '$method $path returns 401 with no token',
    async ({ method, path, body }) => {
      const response = await request(app.getHttpServer())
        [method](path)
        .send(body ?? {});
      expect(response.status).toBe(401);
    },
  );

  for (const routeCase of ROUTE_CASES) {
    const forbiddenRoles = ALL_ROLES.filter((role) => role !== routeCase.allowedRole);

    it.each(forbiddenRoles)(
      `${routeCase.method} ${routeCase.path} returns 403 for role %s`,
      async (role) => {
        const response = await request(app.getHttpServer())
          [routeCase.method](routeCase.path)
          .set('Authorization', `Bearer ${tokens[role]}`)
          .send(routeCase.body ?? {});
        expect(response.status).toBe(403);
      },
    );

    it(`${routeCase.method} ${routeCase.path} does not 401/403 for the allowed role ${routeCase.allowedRole}`, async () => {
      const response = await request(app.getHttpServer())
        [routeCase.method](routeCase.path)
        .set('Authorization', `Bearer ${tokens[routeCase.allowedRole]}`)
        .send(routeCase.body ?? {});
      expect([401, 403]).not.toContain(response.status);
    });
  }

  it.each(ALL_ROLES)('/auth/me is reachable by any authenticated role (%s)', async (role) => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${tokens[role]}`);
    expect(response.status).toBe(200);
  });

  it('/auth/me returns 401 with no token', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('never allows a candidate to mark an unowned notification as read', async () => {
    const candidate = await registerAndLogin(app, { role: 'CANDIDATE' });

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${DUMMY_ID}/read`)
      .set('Authorization', `Bearer ${candidate.accessToken}`);

    // Not found (dummy id) is fine — it must never be a silent 200 for someone else's data.
    expect([403, 404]).toContain(response.status);
  });
});
