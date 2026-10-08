import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { ChurchScopeGuard } from './church-scope.guard';
import { UserRole } from '@eotc/contracts';

describe('Authorization Guards', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  describe('RolesGuard', () => {
    let guard: RolesGuard;

    beforeEach(() => {
      guard = new RolesGuard(reflector);
    });

    const createMockContext = (userRole?: UserRole): ExecutionContext =>
      ({
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
          getRequest: () => ({ user: userRole ? { role: userRole } : undefined }),
        }),
      } as unknown as ExecutionContext);

    it('should grant access if no roles are required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
      const context = createMockContext(UserRole.REGISTERED_USER);
      expect(guard.canActivate(context)).toBe(true);
    });

    it('should grant access to SUPER_ADMINISTRATOR unconditionally', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.EDITOR]);
      const context = createMockContext(UserRole.SUPER_ADMINISTRATOR);
      expect(guard.canActivate(context)).toBe(true);
    });

    it('should grant access to ADMINISTRATOR for EDITOR role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.EDITOR]);
      const context = createMockContext(UserRole.ADMINISTRATOR);
      expect(guard.canActivate(context)).toBe(true);
    });

    it('should reject access if user has insufficient role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMINISTRATOR]);
      const context = createMockContext(UserRole.EDITOR);
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });

  describe('ChurchScopeGuard', () => {
    let guard: ChurchScopeGuard;

    beforeEach(() => {
      guard = new ChurchScopeGuard(reflector);
    });

    const createMockContext = (
      userRole: UserRole,
      assignedChurchIds: string[],
      requestedChurchId?: string,
    ): ExecutionContext =>
      ({
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              role: userRole,
              churchMemberships: assignedChurchIds.map((id) => ({
                churchId: id,
                churchSlug: id,
                status: 'ACTIVE',
              })),
            },
            params: { churchId: requestedChurchId },
          }),
        }),
      } as unknown as ExecutionContext);

    it('should pass through when requireChurchScope is not set', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      const context = createMockContext(UserRole.CHURCH_REPRESENTATIVE, ['church-1'], 'church-2');
      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow ADMINISTRATOR for any church scope', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
      const context = createMockContext(UserRole.ADMINISTRATOR, [], 'any-church');
      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow CHURCH_REPRESENTATIVE when assigned to target church', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
      const context = createMockContext(
        UserRole.CHURCH_REPRESENTATIVE,
        ['debre-libanos'],
        'debre-libanos',
      );
      expect(guard.canActivate(context)).toBe(true);
    });

    it('should forbid CHURCH_REPRESENTATIVE when NOT assigned to target church', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
      const context = createMockContext(
        UserRole.CHURCH_REPRESENTATIVE,
        ['debre-libanos'],
        'axum-tsion',
      );
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });
});
