import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile as UploadedFileDecorator,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  UserRole,
  MediaDto,
  UserDto,
  ContentStatus,
  MediaGalleryDto,
  CreateMediaGalleryDto,
  UpdateMediaGalleryDto,
  GalleryTransitionDto,
} from '@eotc/contracts';
import { UploadedFile } from '../../common/storage/file-validation';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.EDITOR,
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @UploadedFileDecorator() file: UploadedFile,
    @Body('altText') altText?: string,
    @Body('rightsId') rightsId?: string,
    @Body('churchId') churchId?: string,
    @Body('articleId') articleId?: string,
    @CurrentUser() user?: UserDto,
  ): Promise<MediaDto> {
    if (!file) {
      throw new BadRequestException('A file payload must be provided.');
    }

    return this.mediaService.create({
      file,
      uploaderId: user?.id,
      altText,
      rightsId,
      churchId,
      articleId,
    });
  }

  @Get('galleries')
  async listGalleries(
    @Query('churchId') churchId?: string,
    @Query('status') status?: ContentStatus,
    @Query('isStaff') isStaff?: string,
  ): Promise<MediaGalleryDto[]> {
    return this.mediaService.findGalleries({
      churchId,
      status,
      isStaff: isStaff === 'true',
    });
  }

  @Get('galleries/:idOrSlug')
  async getGallery(
    @Param('idOrSlug') idOrSlug: string,
    @Query('isStaff') isStaff?: string,
  ): Promise<MediaGalleryDto> {
    return this.mediaService.findGallery(idOrSlug, isStaff === 'true');
  }

  @Post('galleries')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.EDITOR,
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async createGallery(
    @Body() dto: CreateMediaGalleryDto,
    @CurrentUser() user: any,
  ): Promise<MediaGalleryDto> {
    const actor = {
      id: user?.id || 'user-admin-001',
      role: user?.role || UserRole.SUPER_ADMINISTRATOR,
      churchId: user?.churchMemberships?.[0]?.churchSlug,
    };
    return this.mediaService.createGallery(dto, actor);
  }

  @Put('galleries/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.EDITOR,
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async updateGallery(
    @Param('id') id: string,
    @Body() dto: UpdateMediaGalleryDto,
    @CurrentUser() user: any,
  ): Promise<MediaGalleryDto> {
    const actor = {
      id: user?.id || 'user-admin-001',
      role: user?.role || UserRole.SUPER_ADMINISTRATOR,
      churchId: user?.churchMemberships?.[0]?.churchSlug,
    };
    return this.mediaService.updateGallery(id, dto, actor);
  }

  @Post('galleries/:id/transition')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.EDITOR,
    UserRole.CHURCH_REPRESENTATIVE,
    UserRole.MODERATOR,
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
  )
  async transitionGallery(
    @Param('id') id: string,
    @Body() dto: GalleryTransitionDto,
    @CurrentUser() user: any,
  ): Promise<MediaGalleryDto> {
    const actor = {
      id: user?.id || 'user-admin-001',
      role: user?.role || UserRole.SUPER_ADMINISTRATOR,
      churchId: user?.churchMemberships?.[0]?.churchSlug,
    };
    return this.mediaService.transitionGallery(id, dto, actor);
  }

  @Get()
  async listMedia(@Query('churchId') churchId?: string): Promise<MediaDto[]> {
    return this.mediaService.findAll(churchId);
  }

  @Get(':id')
  async getMedia(@Param('id') id: string): Promise<MediaDto> {
    return this.mediaService.findOne(id);
  }
}

