import { IsString, IsOptional, IsInt, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ContentStatus } from '@eotc/contracts';

export class CreateBookTranslationDto {
  @IsString()
  locale: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  publisher?: string;
}

export class CreateBookInputDto {
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsInt()
  publishedYear?: number;

  @IsOptional()
  @IsString()
  fileId?: string;

  @IsOptional()
  @IsString()
  rightsId?: string;

  @IsOptional()
  @IsString()
  coverImageId?: string;

  @IsOptional()
  @IsString()
  churchId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBookTranslationDto)
  translations: CreateBookTranslationDto[];
}

export class UpdateBookInputDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsInt()
  publishedYear?: number;

  @IsOptional()
  @IsString()
  fileId?: string;

  @IsOptional()
  @IsString()
  rightsId?: string;

  @IsOptional()
  @IsString()
  coverImageId?: string;

  @IsOptional()
  @IsString()
  churchId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBookTranslationDto)
  translations?: CreateBookTranslationDto[];
}

export class TransitionBookDto {
  @IsEnum(ContentStatus)
  targetStatus: ContentStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
