import { RightsStatus } from './enums';

export interface RightsRecordDto {
  id: string;
  status: RightsStatus;
  rightsHolder?: string | null;
  source?: string | null;
  permissionReference?: string | null;
  downloadAllowed: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRightsRecordDto {
  status: RightsStatus;
  rightsHolder?: string;
  source?: string;
  permissionReference?: string;
  downloadAllowed?: boolean;
  notes?: string;
}

export interface UpdateRightsRecordDto {
  status?: RightsStatus;
  rightsHolder?: string;
  source?: string;
  permissionReference?: string;
  downloadAllowed?: boolean;
  notes?: string;
}
