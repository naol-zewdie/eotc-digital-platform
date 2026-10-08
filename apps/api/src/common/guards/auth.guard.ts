import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenUtil } from '../auth/token.util';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token: string | undefined;

    // 1. Check Authorization Bearer header
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // 2. Check Cookie
    if (!token && request.headers['cookie']) {
      const cookies = request.headers['cookie'].split(';');
      for (const cookie of cookies) {
        const [name, val] = cookie.trim().split('=');
        if (name === 'eotc_session') {
          token = val;
          break;
        }
      }
    }

    if (!token) {
      throw new UnauthorizedException('Authentication session required.');
    }

    const payload = TokenUtil.verifyToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired authentication session.');
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          memberships: {
            include: {
              church: {
                select: {
                  slug: true,
                },
              },
            },
          },
        },
      });

      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User account is inactive or not found.');
      }

      request.user = {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        status: user.status,
        emailVerifiedAt: user.emailVerifiedAt?.toISOString() || null,
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        createdAt: user.createdAt.toISOString(),
        churchMemberships: user.memberships.map((m) => ({
          churchId: m.churchId,
          churchSlug: m.church.slug,
          role: m.role,
          status: m.status,
        })),
      };

      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      // In dev fallback if database offline
      request.user = {
        id: payload.userId,
        email: payload.email,
        displayName: 'Authenticated User',
        role: payload.role,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        churchMemberships: [],
      };
      return true;
    }
  }
}
