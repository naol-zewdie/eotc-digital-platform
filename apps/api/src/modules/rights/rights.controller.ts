import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { RightsService } from './rights.service';
import { CreateRightsDto, UpdateRightsDto } from './dto/rights.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  UserRole,
  RightsRecordDto,
  RightsStatus,
  UserDto,
} from '@eotc/contracts';

@Controller('rights')
export class RightsController {
  constructor(private readonly rightsService: RightsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.EDITOR,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async create(
    @Body() dto: CreateRightsDto,
    @CurrentUser() user?: UserDto,
  ): Promise<RightsRecordDto> {
    return this.rightsService.create(dto, user?.id);
  }

  @Get()
  async findAll(@Query('status') status?: RightsStatus): Promise<RightsRecordDto[]> {
    return this.rightsService.findAll(status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RightsRecordDto> {
    return this.rightsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRightsDto,
    @CurrentUser() user?: UserDto,
  ): Promise<RightsRecordDto> {
    return this.rightsService.update(id, dto, user?.id);
  }
}
