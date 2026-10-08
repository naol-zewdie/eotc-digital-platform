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
import { MezmurService } from './mezmur.service';
import {
  CreateArtistInputDto,
  CreateMezmurInputDto,
  UpdateMezmurInputDto,
  TransitionMezmurDto,
} from './dto/mezmur.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, ContentStatus } from '@eotc/contracts';

@Controller('mezmur')
export class MezmurController {
  constructor(private readonly mezmurService: MezmurService) {}

  @Get('artists')
  async getArtists() {
    return this.mezmurService.getArtists();
  }

  @Get('artists/:idOrSlug')
  async findArtist(@Param('idOrSlug') idOrSlug: string) {
    return this.mezmurService.findArtist(idOrSlug);
  }

  @Post('artists')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.EDITOR,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async createArtist(
    @Body(new ValidationPipe({ whitelist: true })) dto: CreateArtistInputDto,
    @CurrentUser() user: any,
  ) {
    return this.mezmurService.createArtist(dto, user?.id);
  }

  @Get()
  async findAll(
    @Query('status') status?: ContentStatus,
    @Query('artistId') artistId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('isStaff') isStaff?: string,
  ) {
    return this.mezmurService.findAll({
      status,
      artistId,
      categoryId,
      search,
      isStaff: isStaff === 'true',
    });
  }

  @Get(':idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.mezmurService.findOne(idOrSlug);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.EDITOR,
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async create(
    @Body(new ValidationPipe({ whitelist: true })) dto: CreateMezmurInputDto,
    @CurrentUser() user: any,
  ) {
    return this.mezmurService.create(dto, user?.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.EDITOR,
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateMezmurInputDto,
    @CurrentUser() user: any,
  ) {
    return this.mezmurService.update(id, dto, user?.id);
  }

  @Post(':id/transition')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.EDITOR,
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async transition(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: TransitionMezmurDto,
    @CurrentUser() user: any,
  ) {
    return this.mezmurService.transitionStatus(id, dto, {
      id: user?.id,
      role: user?.role,
    });
  }
}
