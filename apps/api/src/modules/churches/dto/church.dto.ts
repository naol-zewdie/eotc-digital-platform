import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CoordinatesInputDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class ContactsInputDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  pobox?: string;

  @IsOptional()
  @IsString()
  addressLine?: string;
}

export class CreateChurchTranslationDto {
  @IsString()
  locale: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  history?: string;
}

export class CreateChurchInputDto {
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  diocese?: string;

  @IsOptional()
  @IsBoolean()
  isMonastery?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesInputDto)
  coordinates?: CoordinatesInputDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactsInputDto)
  contacts?: ContactsInputDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChurchTranslationDto)
  translations: CreateChurchTranslationDto[];
}

export class UpdateChurchInputDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  diocese?: string;

  @IsOptional()
  @IsBoolean()
  isMonastery?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesInputDto)
  coordinates?: CoordinatesInputDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactsInputDto)
  contacts?: ContactsInputDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChurchTranslationDto)
  translations?: CreateChurchTranslationDto[];
}

export class ClaimChurchInputDto {
  @IsString()
  evidenceNotes: string;

  @IsOptional()
  @IsString()
  documentKey?: string;

  @IsOptional()
  @IsString()
  claimantPhone?: string;

  @IsOptional()
  @IsString()
  claimantRoleTitle?: string;
}

export class VerifyChurchInputDto {
  @IsIn(['APPROVE', 'REJECT'])
  decision: 'APPROVE' | 'REJECT';

  @IsOptional()
  @IsString()
  notes?: string;
}
