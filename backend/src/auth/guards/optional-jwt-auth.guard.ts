import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser } from '../auth.types';

/**
 * Like JwtAuthGuard, but never throws: a missing or invalid token just leaves
 * req.user undefined instead of 401ing. Used on routes that are public but
 * behave differently for a logged-in viewer (e.g. job detail visibility).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = AuthenticatedUser>(_err: unknown, user: TUser | false): TUser | undefined {
    return user ? user : undefined;
  }
}
