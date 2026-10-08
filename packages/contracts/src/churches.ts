import { VerificationStatus, ContentStatus } from './enums';

export interface ChurchCoordinatesDto {
  lat: number;
  lng: number;
}

export interface ChurchContactsDto {
  phone?: string;
  email?: string;
  website?: string;
  pobox?: string;
  addressLine?: string;
}

export interface ChurchTranslationDto {
  id?: string;
  churchId?: string;
  locale: string;
  name: string;
  description?: string | null;
  history?: string | null;
}

export interface ChurchMembershipDto {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  churchId: string;
  churchSlug?: string;
  role: string;
  status: string; // "ACTIVE" | "PENDING" | "REVOKED"
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
}

export interface ChurchDto {
  id: string;
  slug: string;
  region?: string | null;
  city?: string | null;
  diocese?: string | null;
  isMonastery?: boolean;
  coordinates?: ChurchCoordinatesDto | null;
  contacts?: ChurchContactsDto | null;
  verificationStatus: VerificationStatus;
  status: ContentStatus;
  translations: ChurchTranslationDto[];
  memberships?: ChurchMembershipDto[];
  eventCount?: number;
  clergyCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChurchTranslationInput {
  locale: string;
  name: string;
  description?: string;
  history?: string;
}

export interface CreateChurchDto {
  slug: string;
  region?: string;
  city?: string;
  diocese?: string;
  isMonastery?: boolean;
  coordinates?: ChurchCoordinatesDto;
  contacts?: ChurchContactsDto;
  translations: CreateChurchTranslationInput[];
}

export interface UpdateChurchDto {
  slug?: string;
  region?: string;
  city?: string;
  diocese?: string;
  isMonastery?: boolean;
  coordinates?: ChurchCoordinatesDto;
  contacts?: ChurchContactsDto;
  translations?: CreateChurchTranslationInput[];
}

export interface ClaimChurchDto {
  evidenceNotes: string;
  documentKey?: string;
  claimantPhone?: string;
  claimantRoleTitle?: string;
}

export interface VerifyChurchDto {
  decision: 'APPROVE' | 'REJECT';
  notes?: string;
}
