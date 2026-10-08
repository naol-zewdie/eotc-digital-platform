import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContentStatus, EventType } from '@eotc/contracts';

export class EventCoordinatesInputDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class EventTranslationInputDto {
  @IsString()
  locale: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  liturgicalSignificance?: string;
}

export class CreateEventInputDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsEnum(EventType)
  type: EventType;

  @IsOptional()
  @IsString()
  churchId?: string;

  @IsString()
  startAt: string;

  @IsOptional()
  @IsString()
  endAt?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EventCoordinatesInputDto)
  coordinates?: EventCoordinatesInputDto;

  @IsOptional()
  @IsBoolean()
  isRecurringAnnual?: boolean;

  @IsOptional()
  @IsNumber()
  ethiopianMonth?: number;

  @IsOptional()
  @IsNumber()
  ethiopianDay?: number;

  @IsOptional()
  @IsString()
  coverMediaId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventTranslationInputDto)
  translations: EventTranslationInputDto[];
}

export class UpdateEventInputDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @IsOptional()
  @IsString()
  churchId?: string;

  @IsOptional()
  @IsString()
  startAt?: string;

  @IsOptional()
  @IsString()
  endAt?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EventCoordinatesInputDto)
  coordinates?: EventCoordinatesInputDto;

  @IsOptional()
  @IsBoolean()
  isRecurringAnnual?: boolean;

  @IsOptional()
  @IsNumber()
  ethiopianMonth?: number;

  @IsOptional()
  @IsNumber()
  ethiopianDay?: number;

  @IsOptional()
  @IsString()
  coverMediaId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventTranslationInputDto)
  translations?: EventTranslationInputDto[];
}

export class TransitionEventDto {
  @IsEnum(ContentStatus)
  targetStatus: ContentStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
