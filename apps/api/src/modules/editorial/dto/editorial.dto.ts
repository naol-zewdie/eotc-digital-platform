import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleType, ContentStatus } from '@eotc/contracts';

export class CreateArticleTranslationDto {
  @IsString()
  locale: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  contentMarkdown?: string;

  @IsOptional()
  @IsString()
  contentHtml?: string;
}

export class CreateArticleInputDto {
  @IsString()
  slug: string;

  @IsOptional()
  @IsEnum(ArticleType)
  type?: ArticleType;

  @IsOptional()
  @IsString()
  churchId?: string;

  @IsOptional()
  @IsString()
  coverMediaId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArticleTranslationDto)
  translations: CreateArticleTranslationDto[];
}

export class UpdateArticleInputDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEnum(ArticleType)
  type?: ArticleType;

  @IsOptional()
  @IsString()
  churchId?: string;

  @IsOptional()
  @IsString()
  coverMediaId?: string;

  @IsOptional()
  @IsString()
  revisionComment?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArticleTranslationDto)
  translations?: CreateArticleTranslationDto[];
}

export class TransitionArticleDto {
  @IsEnum(ContentStatus)
  targetStatus: ContentStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
