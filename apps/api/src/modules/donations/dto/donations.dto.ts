import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  Min,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentGateway, DonationPurpose, PaymentStatus } from '@eotc/contracts';

export class CreateDonationCampaignInputDto {
  @IsString()
  slug: string;

  @IsString()
  titleAm: string;

  @IsString()
  titleEn: string;

  @IsOptional()
  @IsString()
  titleGez?: string;

  @IsString()
  descriptionAm: string;

  @IsString()
  descriptionEn: string;

  @IsEnum(DonationPurpose)
  purpose: DonationPurpose;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  targetAmount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  churchId?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export class UpdateDonationCampaignInputDto {
  @IsOptional()
  @IsString()
  titleAm?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  descriptionAm?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsEnum(DonationPurpose)
  purpose?: DonationPurpose;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  targetAmount?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export class InitiateDonationInputDto {
  @IsOptional()
  @IsString()
  campaignId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  currency: string;

  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;

  @IsOptional()
  @IsString()
  donorName?: string;

  @IsOptional()
  @IsString()
  baptismalName?: string;

  @IsOptional()
  @IsEmail()
  donorEmail?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @IsOptional()
  @IsString()
  prayerIntention?: string;

  @IsOptional()
  @IsString()
  returnUrl?: string;
}

export class VerifyDonationInputDto {
  @IsString()
  transactionId: string;

  @IsString()
  gatewayReference: string;

  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;
}
