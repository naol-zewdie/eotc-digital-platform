import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import {
  CreateEventInputDto,
  UpdateEventInputDto,
  TransitionEventDto,
} from './dto/events.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, EventType, ContentStatus } from '@eotc/contracts';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('calendar')
  getCalendar(@Query('date') date?: string) {
    return this.eventsService.getLiturgicalCalendar(date);
  }

  @Get()
  async findAll(
    @Query('churchId') churchId?: string,
    @Query('type') type?: EventType,
    @Query('status') status?: ContentStatus,
    @Query('upcomingOnly') upcomingOnly?: string,
    @Query('isStaff') isStaff?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.eventsService.findAll({
      churchId,
      type,
      status,
      upcomingOnly: upcomingOnly === 'true',
      isStaff: isStaff === 'true',
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Get(':idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('isStaff') isStaff?: string,
  ) {
    return this.eventsService.findOne(idOrSlug, isStaff === 'true');
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.EDITOR,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async create(
    @Body(new ValidationPipe({ whitelist: true })) dto: CreateEventInputDto,
    @CurrentUser() user: any,
  ) {
    const actor = {
      id: user?.id || 'user-admin-001',
      role: user?.role || UserRole.SUPER_ADMINISTRATOR,
      churchId: user?.churchMemberships?.[0]?.churchSlug,
    };
    return this.eventsService.create(dto, actor);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.EDITOR,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateEventInputDto,
    @CurrentUser() user: any,
  ) {
    const actor = {
      id: user?.id || 'user-admin-001',
      role: user?.role || UserRole.SUPER_ADMINISTRATOR,
      churchId: user?.churchMemberships?.[0]?.churchSlug,
    };
    return this.eventsService.update(id, dto, actor);
  }

  @Post(':id/transition')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.EDITOR,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async transition(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: TransitionEventDto,
    @CurrentUser() user: any,
  ) {
    const actor = {
      id: user?.id || 'user-admin-001',
      role: user?.role || UserRole.SUPER_ADMINISTRATOR,
      churchId: user?.churchMemberships?.[0]?.churchSlug,
    };
    return this.eventsService.transition(id, dto, actor);
  }
}
