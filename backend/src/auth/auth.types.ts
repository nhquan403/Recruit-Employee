import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  role: Role;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  fullName: string;
}
