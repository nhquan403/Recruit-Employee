// Runs before the test framework loads (jest "setupFiles"), so PrismaClient
// always connects to the disposable test database, never the dev one.
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://parttime:parttime_dev_pw@localhost:5432/parttime_jobs_test?schema=public';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-only-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';
