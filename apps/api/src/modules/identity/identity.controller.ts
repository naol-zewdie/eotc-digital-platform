import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UseGuards,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { IdentityService } from './identity.service';
import { LoginRequestDto, RegisterRequestDto, AssignChurchRequestDto } from './auth.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserDto, AuthSessionDto, UserRole, AuditAction } from '@eotc/contracts';
import { AuditService } from '../audit/audit.service';

@Controller('auth')
export class IdentityController {
  constructor(
    private readonly identityService: IdentityService,
    private readonly auditService: AuditService,
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<AuthSessionDto> {
    const ipHash = request.ip;
    const session = await this.identityService.login(dto, ipHash);

    // Set secure HttpOnly cookie per Section 18
    response.cookie('eotc_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 1000, // 24 hours
      path: '/',
    });

    return session;
  }

  @Post('register')
  async register(
    @Body() dto: RegisterRequestDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<AuthSessionDto> {
    const ipHash = request.ip;
    const session = await this.identityService.register(dto, ipHash);

    response.cookie('eotc_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 1000,
      path: '/',
    });

    return session;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@CurrentUser() user: UserDto): Promise<UserDto> {
    return user;
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @CurrentUser() user?: UserDto,
  ): Promise<{ success: boolean; message: string }> {
    response.clearCookie('eotc_session', { path: '/' });

    if (user) {
      await this.auditService.record({
        actorId: user.id,
        action: AuditAction.LOGOUT,
        entityType: 'User',
        entityId: user.id,
        ipHash: request.ip,
      });
    }

    return { success: true, message: 'Logged out successfully.' };
  }

  @Get('users')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR, UserRole.SUPER_ADMINISTRATOR)
  async listUsers(
    @Query('limit') limit?: string,
    @Query('role') role?: UserRole,
  ): Promise<UserDto[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    return this.identityService.getUsers(parsedLimit, role);
  }

  @Post('assign-church')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR, UserRole.SUPER_ADMINISTRATOR)
  async assignChurch(
    @Body() dto: AssignChurchRequestDto,
    @CurrentUser() adminUser: UserDto,
    @Req() request: Request,
  ): Promise<{ success: boolean; message: string }> {
    await this.identityService.assignChurchRole(adminUser.id, dto, request.ip);
    return { success: true, message: 'Church representative scope assigned successfully.' };
  }
}
