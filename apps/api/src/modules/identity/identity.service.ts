import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { PasswordUtil } from '../../common/auth/password.util';
import { TokenUtil } from '../../common/auth/token.util';
import {
  UserDto,
  AuthSessionDto,
  UserRole,
  AuditAction,
  StandardErrorCode,
} from '@eotc/contracts';
import { LoginRequestDto, RegisterRequestDto, AssignChurchRequestDto } from './auth.dto';

@Injectable()
export class IdentityService {
  private readonly logger = new Logger(IdentityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async login(dto: LoginRequestDto, ipHash?: string): Promise<AuthSessionDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        memberships: {
          include: {
            church: {
              select: { slug: true },
            },
          },
        },
      },
    });

    if (!user) {
      await this.auditService.record({
        action: AuditAction.LOGIN_FAILED,
        entityType: 'User',
        entityId: dto.email,
        metadata: { reason: 'User not found' },
        ipHash,
      });
      throw new UnauthorizedException({
        code: StandardErrorCode.UNAUTHORIZED,
        message: 'Invalid email or password credentials.',
      });
    }

    const isValidPassword = PasswordUtil.verifyPassword(dto.password, user.passwordHash);
    if (!isValidPassword) {
      await this.auditService.record({
        actorId: user.id,
        action: AuditAction.LOGIN_FAILED,
        entityType: 'User',
        entityId: user.id,
        metadata: { reason: 'Invalid password' },
        ipHash,
      });
      throw new UnauthorizedException({
        code: StandardErrorCode.UNAUTHORIZED,
        message: 'Invalid email or password credentials.',
      });
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Your account is currently inactive or suspended.');
    }

    // Update lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = TokenUtil.signToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    await this.auditService.record({
      actorId: user.id,
      action: AuditAction.LOGIN_SUCCESS,
      entityType: 'User',
      entityId: user.id,
      metadata: { role: user.role },
      ipHash,
    });

    const expiresAt = new Date(Date.now() + 86400 * 1000).toISOString();

    return {
      user: this.mapUserDto(user),
      token,
      expiresAt,
    };
  }

  async register(dto: RegisterRequestDto, ipHash?: string): Promise<AuthSessionDto> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException({
        code: StandardErrorCode.CONFLICT,
        message: 'An account with this email address already exists.',
      });
    }

    const passwordHash = PasswordUtil.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        displayName: dto.displayName,
        passwordHash,
        role: UserRole.REGISTERED_USER,
        status: 'ACTIVE',
      },
      include: {
        memberships: {
          include: {
            church: {
              select: { slug: true },
            },
          },
        },
      },
    });

    await this.auditService.record({
      actorId: user.id,
      action: AuditAction.USER_REGISTERED,
      entityType: 'User',
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
      ipHash,
    });

    const token = TokenUtil.signToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    const expiresAt = new Date(Date.now() + 86400 * 1000).toISOString();

    return {
      user: this.mapUserDto(user),
      token,
      expiresAt,
    };
  }

  async getProfile(userId: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            church: {
              select: { slug: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found.');
    }

    return this.mapUserDto(user);
  }

  async getUsers(limit = 50, role?: UserRole): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      where: role ? { role } : undefined,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        memberships: {
          include: {
            church: { select: { slug: true } },
          },
        },
      },
    });

    return users.map((u) => this.mapUserDto(u));
  }

  async assignChurchRole(
    adminActorId: string,
    dto: AssignChurchRequestDto,
    ipHash?: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Target user not found.');

    const church = await this.prisma.church.findUnique({ where: { id: dto.churchId } });
    if (!church) throw new NotFoundException('Target church not found.');

    await this.prisma.churchMembership.upsert({
      where: {
        userId_churchId: {
          userId: dto.userId,
          churchId: dto.churchId,
        },
      },
      update: {
        role: UserRole.CHURCH_REPRESENTATIVE,
        status: 'ACTIVE',
        verifiedBy: adminActorId,
        verifiedAt: new Date(),
      },
      create: {
        userId: dto.userId,
        churchId: dto.churchId,
        role: UserRole.CHURCH_REPRESENTATIVE,
        status: 'ACTIVE',
        verifiedBy: adminActorId,
        verifiedAt: new Date(),
      },
    });

    // Update user role to CHURCH_REPRESENTATIVE if currently REGISTERED_USER
    if (user.role === UserRole.REGISTERED_USER) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { role: UserRole.CHURCH_REPRESENTATIVE },
      });
    }

    await this.auditService.record({
      actorId: adminActorId,
      action: AuditAction.CHURCH_SCOPE_ASSIGNED,
      entityType: 'ChurchMembership',
      entityId: `${dto.userId}:${dto.churchId}`,
      metadata: { targetUserId: dto.userId, churchId: dto.churchId, churchSlug: church.slug },
      ipHash,
    });
  }

  private mapUserDto(user: any): UserDto {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role as UserRole,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : null,
      lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
      churchMemberships: user.memberships?.map((m: any) => ({
        churchId: m.churchId,
        churchSlug: m.church?.slug || '',
        role: m.role as UserRole,
        status: m.status,
      })),
    };
  }
}
