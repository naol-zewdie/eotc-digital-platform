import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { RightsStatus } from '@eotc/contracts';

export class CreateRightsDto {
  @IsEnum(RightsStatus, { message: 'A valid RightsStatus is required.' })
  status!: RightsStatus;

  @IsOptional()
  @IsString()
  rightsHolder?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  permissionReference?: string;

  @IsOptional()
  @IsBoolean()
  downloadAllowed?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateRightsDto {
  @IsOptional()
  @IsEnum(RightsStatus)
  status?: RightsStatus;

  @IsOptional()
  @IsString()
  rightsHolder?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  permissionReference?: string;

  @IsOptional()
  @IsBoolean()
  downloadAllowed?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
