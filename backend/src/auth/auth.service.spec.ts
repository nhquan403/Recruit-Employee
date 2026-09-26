import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    email: 'candidate@test.com',
    passwordHash: bcrypt.hashSync('Password123', 4),
    role: 'CANDIDATE',
    fullName: 'Test Candidate',
    phone: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    usersService = {
      createUser: jest.fn(),
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    jwtService = {
      sign: jest.fn().mockReturnValue('signed.jwt.token'),
    } as unknown as jest.Mocked<JwtService>;

    authService = new AuthService(usersService, jwtService);
  });

  describe('register', () => {
    it('creates the user and returns a signed token', async () => {
      const user = buildUser();
      usersService.createUser.mockResolvedValue(user);

      const result = await authService.register({
        email: user.email,
        password: 'Password123',
        role: 'CANDIDATE',
        fullName: user.fullName,
      });

      expect(usersService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ email: user.email }),
      );
      expect(result.accessToken).toBe('signed.jwt.token');
      expect(result.user).toEqual({
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      });
    });
  });

  describe('login', () => {
    it('returns a token when the password matches', async () => {
      const user = buildUser();
      usersService.findByEmail.mockResolvedValue(user);

      const result = await authService.login({ email: user.email, password: 'Password123' });

      expect(result.accessToken).toBe('signed.jwt.token');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id, role: user.role });
    });

    it('rejects an unknown email', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'nobody@test.com', password: 'whatever' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejects a wrong password', async () => {
      usersService.findByEmail.mockResolvedValue(buildUser());

      await expect(
        authService.login({ email: 'candidate@test.com', password: 'WrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejects a deactivated account even with the correct password', async () => {
      usersService.findByEmail.mockResolvedValue(buildUser({ isActive: false }));

      await expect(
        authService.login({ email: 'candidate@test.com', password: 'Password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
