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
import { LibraryService } from './library.service';
import {
  CreateBookInputDto,
  UpdateBookInputDto,
  TransitionBookDto,
} from './dto/library.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, ContentStatus } from '@eotc/contracts';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('categories')
  async getCategories() {
    return this.libraryService.getCategories();
  }

  @Get('books')
  async findAll(
    @Query('status') status?: ContentStatus,
    @Query('categoryId') categoryId?: string,
    @Query('churchId') churchId?: string,
    @Query('locale') locale?: string,
    @Query('search') search?: string,
    @Query('isStaff') isStaff?: string,
  ) {
    return this.libraryService.findAll({
      status,
      categoryId,
      churchId,
      locale,
      search,
      isStaff: isStaff === 'true' || Boolean(status),
    });
  }

  @Get('books/:idOrSlug')
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Query('locale') locale?: string,
  ) {
    return this.libraryService.findOne(idOrSlug, locale);
  }

  @Post('books')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.EDITOR,
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async create(
    @Body(new ValidationPipe({ whitelist: true })) dto: CreateBookInputDto,
    @CurrentUser() user: any,
  ) {
    return this.libraryService.create(dto, user?.id);
  }

  @Put('books/:id')
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
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateBookInputDto,
    @CurrentUser() user: any,
  ) {
    return this.libraryService.update(id, dto, user?.id);
  }

  @Post('books/:id/transition')
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
    @Body(new ValidationPipe({ whitelist: true })) dto: TransitionBookDto,
    @CurrentUser() user: any,
  ) {
    return this.libraryService.transitionStatus(id, dto, {
      id: user?.id,
      role: user?.role,
    });
  }
}
