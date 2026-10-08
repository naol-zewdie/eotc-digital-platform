import { ContentStatus, RightsStatus } from './enums';

export interface MediaGalleryItemDto {
  id: string;
  galleryId: string;
  mediaId: string;
  mediaUrl?: string;
  caption?: string;
  rightsId?: string;
  rightsStatus?: RightsStatus;
  rightsHolder?: string;
  downloadAllowed?: boolean;
  orderIndex: number;
}

export interface MediaGalleryDto {
  id: string;
  slug: string;
  churchId?: string;
  churchName?: string;
  title: string;
  description?: string;
  coverMediaUrl?: string;
  status: ContentStatus;
  itemCount: number;
  items: MediaGalleryItemDto[];
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaGalleryDto {
  slug?: string;
  churchId?: string;
  title: string;
  description?: string;
  coverMediaId?: string;
  items?: Array<{
    mediaId: string;
    caption?: string;
    rightsId?: string;
    orderIndex?: number;
  }>;
}

export interface UpdateMediaGalleryDto {
  slug?: string;
  churchId?: string;
  title?: string;
  description?: string;
  coverMediaId?: string;
  items?: Array<{
    mediaId: string;
    caption?: string;
    rightsId?: string;
    orderIndex?: number;
  }>;
}

export interface GalleryTransitionDto {
  targetStatus: ContentStatus;
  reason?: string;
}
