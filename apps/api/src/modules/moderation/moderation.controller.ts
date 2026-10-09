import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ModerationService } from './moderation.service';
import {
  CreateModerationItemInputDto,
  ModerationActionInputDto,
  ModerationFilterDto,
} from './dto/moderation.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@eotc/contracts';

@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
    UserRole.EDITOR,
  )
  async findAll(@Query() filter: ModerationFilterDto) {
    return this.moderationService.findAll(filter);
  }

  @Get('stats')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
    UserRole.EDITOR,
  )
  async getStats() {
    return this.moderationService.getStats();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
    UserRole.EDITOR,
  )
  async findById(@Param('id') id: string) {
    return this.moderationService.findById(id);
  }

  @Post('submit')
  async submitCorrection(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: CreateModerationItemInputDto,
    @CurrentUser() user?: any,
  ) {
    if (user?.id && !dto.claimantUserId) {
      dto.claimantUserId = user.id;
    }
    return this.moderationService.createItem(dto);
  }

  @Post(':id/action')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async executeAction(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: ModerationActionInputDto,
    @CurrentUser() user?: any,
  ) {
    const moderator = {
      id: user?.id || user?.sub || 'admin-001',
      displayName: user?.displayName || 'Diocesan Moderator',
    };
    return this.moderationService.executeAction(id, dto, moderator);
  }
}
