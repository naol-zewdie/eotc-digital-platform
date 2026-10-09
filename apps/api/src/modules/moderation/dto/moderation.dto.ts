import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsObject,
} from 'class-validator';
import {
  ModerationType,
  ModerationStatus,
  ModerationPriority,
} from '@eotc/contracts';

export class CreateModerationItemInputDto {
  @IsEnum(ModerationType)
  type: ModerationType;

  @IsOptional()
  @IsEnum(ModerationPriority)
  priority?: ModerationPriority;

  @IsString()
  targetEntityType: string;

  @IsString()
  targetEntityId: string;

  @IsString()
  targetTitle: string;

  @IsOptional()
  @IsString()
  claimantUserId?: string;

  @IsString()
  claimantName: string;

  @IsEmail()
  claimantEmail: string;

  @IsOptional()
  @IsString()
  dioceseName?: string;

  @IsOptional()
  @IsString()
  officialDocumentUrl?: string;

  @IsOptional()
  @IsObject()
  proposedChanges?: Record<string, any>;
}

export class ModerationActionInputDto {
  @IsString()
  action: 'APPROVE' | 'REJECT' | 'RESOLVE' | 'IN_REVIEW';

  @IsOptional()
  @IsString()
  moderatorNotes?: string;
}

export class ModerationFilterDto {
  @IsOptional()
  @IsEnum(ModerationType)
  type?: ModerationType;

  @IsOptional()
  @IsEnum(ModerationStatus)
  status?: ModerationStatus;

  @IsOptional()
  @IsEnum(ModerationPriority)
  priority?: ModerationPriority;

  @IsOptional()
  @IsString()
  targetEntityType?: string;
}
