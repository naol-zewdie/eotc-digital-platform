import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@eotc/contracts';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: Authentication and specific role required.');
    }

    const userRole = user.role as UserRole;

    // Super Administrator has unrestricted access across all roles
    if (userRole === UserRole.SUPER_ADMINISTRATOR) {
      return true;
    }

    // Role hierarchy mapping
    const hasPermission = requiredRoles.some((role) => this.isRoleAuthorized(userRole, role));

    if (!hasPermission) {
      throw new ForbiddenException(
        `Insufficient permissions: User with role '${userRole}' cannot access resource requiring [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }

  private isRoleAuthorized(userRole: UserRole, targetRole: UserRole): boolean {
    if (userRole === targetRole) return true;

    if (userRole === UserRole.ADMINISTRATOR) {
      return targetRole !== UserRole.SUPER_ADMINISTRATOR;
    }

    if (userRole === UserRole.MODERATOR) {
      return (
        targetRole === UserRole.EDITOR ||
        targetRole === UserRole.CHURCH_REPRESENTATIVE ||
        targetRole === UserRole.REGISTERED_USER
      );
    }

    if (userRole === UserRole.EDITOR) {
      return targetRole === UserRole.REGISTERED_USER;
    }

    return false;
  }
}
