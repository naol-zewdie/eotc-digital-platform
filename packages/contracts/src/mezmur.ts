import { ContentStatus } from './enums';
import { RightsRecordDto } from './rights';
import { StoredFileDto } from './storage';
import { CategoryDto } from './library';

export interface ArtistDto {
  id: string;
  slug: string;
  nameAm: string;
  nameGez?: string | null;
  nameEn: string;
  bioAm?: string | null;
  bioEn?: string | null;
  isChoir: boolean;
  avatarMediaId?: string | null;
  mezmurCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArtistDto {
  slug: string;
  nameAm: string;
  nameGez?: string;
  nameEn: string;
  bioAm?: string;
  bioEn?: string;
  isChoir?: boolean;
  avatarMediaId?: string;
}

export interface UpdateArtistDto {
  slug?: string;
  nameAm?: string;
  nameGez?: string;
  nameEn?: string;
  bioAm?: string;
  bioEn?: string;
  isChoir?: boolean;
  avatarMediaId?: string;
}

export interface MezmurTranslationDto {
  id?: string;
  mezmurId?: string;
  locale: string;
  title: string;
  lyrics?: string | null;
  description?: string | null;
}

export interface MezmurDto {
  id: string;
  slug: string;
  status: ContentStatus;
  categoryId?: string | null;
  artistId?: string | null;
  audioFileId?: string | null;
  rightsId?: string | null;
  churchId?: string | null;
  createdById?: string | null;
  approvedById?: string | null;
  publishedAt?: string | null;
  playCount: number;
  viewCount: number;
  translations: MezmurTranslationDto[];
  artist?: ArtistDto | null;
  category?: CategoryDto | null;
  rights?: RightsRecordDto | null;
  audioFile?: StoredFileDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMezmurTranslationInput {
  locale: string;
  title: string;
  lyrics?: string;
  description?: string;
}

export interface CreateMezmurDto {
  slug: string;
  categoryId?: string;
  artistId?: string;
  audioFileId?: string;
  rightsId?: string;
  churchId?: string;
  translations: CreateMezmurTranslationInput[];
}

export interface UpdateMezmurDto {
  slug?: string;
  categoryId?: string;
  artistId?: string;
  audioFileId?: string;
  rightsId?: string;
  churchId?: string;
  translations?: CreateMezmurTranslationInput[];
}

export interface MezmurTransitionDto {
  targetStatus: ContentStatus;
  comment?: string;
}
