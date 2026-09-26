import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { AuthenticatedUser } from '../auth.types';

function buildContext(user: AuthenticatedUser | undefined): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  function buildGuard(requiredRoles: string[] | undefined) {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(requiredRoles),
    } as unknown as Reflector;
    return new RolesGuard(reflector);
  }

  it('allows access when no roles are required', () => {
    const guard = buildGuard(undefined);
    const context = buildContext(undefined);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows access when the user has one of the required roles', () => {
    const guard = buildGuard(['EMPLOYER']);
    const context = buildContext({
      id: 'u1',
      email: 'e@test.com',
      role: 'EMPLOYER',
      fullName: 'E',
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('denies access when the user has a different role', () => {
    const guard = buildGuard(['EMPLOYER']);
    const context = buildContext({
      id: 'u1',
      email: 'c@test.com',
      role: 'CANDIDATE',
      fullName: 'C',
    });
    expect(() => guard.canActivate(context)).toThrow();
  });

  it('denies access when there is no authenticated user', () => {
    const guard = buildGuard(['ADMIN']);
    const context = buildContext(undefined);
    expect(() => guard.canActivate(context)).toThrow();
  });
});
