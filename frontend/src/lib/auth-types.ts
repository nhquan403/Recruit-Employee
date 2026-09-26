export type Role = 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}
