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
import { EditorialService } from './editorial.service';
import {
  CreateArticleInputDto,
  UpdateArticleInputDto,
  TransitionArticleDto,
} from './dto/editorial.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, ArticleType, ContentStatus } from '@eotc/contracts';

@Controller('editorial')
export class EditorialController {
  constructor(private readonly editorialService: EditorialService) {}

  @Get('articles')
  async findAll(
    @Query('type') type?: ArticleType,
    @Query('status') status?: ContentStatus,
    @Query('churchId') churchId?: string,
    @Query('search') search?: string,
    @Query('isStaff') isStaff?: string,
  ) {
    return this.editorialService.findAll({
      type,
      status,
      churchId,
      search,
      isStaff: isStaff === 'true',
    });
  }

  @Get('articles/:idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.editorialService.findOne(idOrSlug);
  }

  @Post('articles')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.EDITOR,
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async create(
    @Body(new ValidationPipe({ whitelist: true })) dto: CreateArticleInputDto,
    @CurrentUser() user: any,
  ) {
    return this.editorialService.create(dto, user?.id);
  }

  @Put('articles/:id')
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
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateArticleInputDto,
    @CurrentUser() user: any,
  ) {
    return this.editorialService.update(id, dto, user?.id);
  }

  @Get('articles/:id/revisions')
  async getRevisions(@Param('id') id: string) {
    return this.editorialService.getRevisions(id);
  }

  @Post('articles/:id/transition')
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
    @Body(new ValidationPipe({ whitelist: true })) dto: TransitionArticleDto,
    @CurrentUser() user: any,
  ) {
    return this.editorialService.transitionStatus(id, dto, {
      id: user?.id,
      role: user?.role,
    });
  }
}
