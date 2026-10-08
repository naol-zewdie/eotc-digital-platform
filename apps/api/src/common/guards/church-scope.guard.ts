import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_CHURCH_SCOPE_KEY } from '../decorators/require-church-scope.decorator';
import { UserRole, StandardErrorCode, ChurchScopeDto } from '@eotc/contracts';

@Injectable()
export class ChurchScopeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<boolean>(REQUIRE_CHURCH_SCOPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required for church-scoped resource.');
    }

    // Super admin & general admin have global church authority
    if (
      user.role === UserRole.SUPER_ADMINISTRATOR ||
      user.role === UserRole.ADMINISTRATOR
    ) {
      return true;
    }

    // Church representative must be assigned to target church
    const targetChurchId =
      request.params?.churchId ||
      request.params?.id ||
      request.body?.churchId ||
      request.query?.churchId;

    if (!targetChurchId) {
      throw new ForbiddenException('Church scope parameter is missing from request.');
    }

    const memberships: ChurchScopeDto[] = user.churchMemberships || [];
    const isAssigned = memberships.some(
      (m) =>
        (m.churchId === targetChurchId || m.churchSlug === targetChurchId) &&
        m.status === 'ACTIVE',
    );

    if (!isAssigned) {
      throw new ForbiddenException({
        code: StandardErrorCode.SCOPE_UNAUTHORIZED,
        message: 'Access denied: You are not authorized to modify resources for this church.',
        details: [
          {
            field: 'churchId',
            reason: `User is not an active verified representative for church: ${targetChurchId}`,
          },
        ],
      });
    }

    return true;
  }
}
