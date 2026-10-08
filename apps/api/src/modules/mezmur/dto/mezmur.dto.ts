import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContentStatus } from '@eotc/contracts';

export class CreateArtistInputDto {
  @IsString()
  slug: string;

  @IsString()
  nameAm: string;

  @IsOptional()
  @IsString()
  nameGez?: string;

  @IsString()
  nameEn: string;

  @IsOptional()
  @IsString()
  bioAm?: string;

  @IsOptional()
  @IsString()
  bioEn?: string;

  @IsOptional()
  @IsBoolean()
  isChoir?: boolean;

  @IsOptional()
  @IsString()
  avatarMediaId?: string;
}

export class UpdateArtistInputDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  nameAm?: string;

  @IsOptional()
  @IsString()
  nameGez?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  bioAm?: string;

  @IsOptional()
  @IsString()
  bioEn?: string;

  @IsOptional()
  @IsBoolean()
  isChoir?: boolean;

  @IsOptional()
  @IsString()
  avatarMediaId?: string;
}

export class CreateMezmurTranslationDto {
  @IsString()
  locale: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  lyrics?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateMezmurInputDto {
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  artistId?: string;

  @IsOptional()
  @IsString()
  audioFileId?: string;

  @IsOptional()
  @IsString()
  rightsId?: string;

  @IsOptional()
  @IsString()
  churchId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMezmurTranslationDto)
  translations: CreateMezmurTranslationDto[];
}

export class UpdateMezmurInputDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  artistId?: string;

  @IsOptional()
  @IsString()
  audioFileId?: string;

  @IsOptional()
  @IsString()
  rightsId?: string;

  @IsOptional()
  @IsString()
  churchId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMezmurTranslationDto)
  translations?: CreateMezmurTranslationDto[];
}

export class TransitionMezmurDto {
  @IsEnum(ContentStatus)
  targetStatus: ContentStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
