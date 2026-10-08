import {
  Controller,
  Post,
  Get,
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
import { UserRole, MediaDto, UserDto } from '@eotc/contracts';
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

  @Get()
  async listMedia(@Query('churchId') churchId?: string): Promise<MediaDto[]> {
    return this.mediaService.findAll(churchId);
  }

  @Get(':id')
  async getMedia(@Param('id') id: string): Promise<MediaDto> {
    return this.mediaService.findOne(id);
  }
}
