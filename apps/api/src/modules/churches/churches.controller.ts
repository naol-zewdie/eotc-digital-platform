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
import { ChurchesService } from './churches.service';
import {
  CreateChurchInputDto,
  UpdateChurchInputDto,
  ClaimChurchInputDto,
  VerifyChurchInputDto,
} from './dto/church.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, VerificationStatus } from '@eotc/contracts';

@Controller('churches')
export class ChurchesController {
  constructor(private readonly churchesService: ChurchesService) {}

  @Get()
  async findAll(
    @Query('region') region?: string,
    @Query('city') city?: string,
    @Query('diocese') diocese?: string,
    @Query('verificationStatus') verificationStatus?: VerificationStatus,
    @Query('search') search?: string,
    @Query('isStaff') isStaff?: string,
  ) {
    return this.churchesService.findAll({
      region,
      city,
      diocese,
      verificationStatus,
      search,
      isStaff: isStaff === 'true',
    });
  }

  @Get(':idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.churchesService.findOne(idOrSlug);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.REGISTERED_USER,
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.EDITOR,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async create(
    @Body(new ValidationPipe({ whitelist: true })) dto: CreateChurchInputDto,
    @CurrentUser() user: any,
  ) {
    return this.churchesService.create(dto, user?.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateChurchInputDto,
    @CurrentUser() user: any,
  ) {
    return this.churchesService.update(id, dto, {
      id: user?.id,
      role: user?.role,
      churchMemberships: user?.churchMemberships,
    });
  }

  @Post(':id/claim')
  @UseGuards(AuthGuard)
  async claim(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: ClaimChurchInputDto,
    @CurrentUser() user: any,
  ) {
    return this.churchesService.claimChurch(id, dto, {
      id: user?.id,
      email: user?.email,
      displayName: user?.displayName,
    });
  }

  @Post(':id/verify')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async verify(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: VerifyChurchInputDto,
    @CurrentUser() user: any,
  ) {
    return this.churchesService.verifyChurch(id, dto, {
      id: user?.id,
    });
  }
}
