import { ContentStatus } from './enums';
import { RightsRecordDto } from './rights';
import { StoredFileDto } from './storage';

export interface BookTranslationDto {
  id?: string;
  bookId?: string;
  locale: string;
  title: string;
  description?: string | null;
  author?: string | null;
  authorDisplayName?: string | null;
  publisher?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryDto {
  id: string;
  slug: string;
  nameAm: string;
  nameGez: string;
  nameEn: string;
  descriptionAm?: string | null;
  descriptionGez?: string | null;
  descriptionEn?: string | null;
  bookCount?: number;
}

export interface BookDto {
  id: string;
  slug: string;
  status: ContentStatus;
  author?: string | null;
  publishedYear?: number | null;
  publicationYear?: number | null;
  fileId?: string | null;
  rightsId?: string | null;
  coverImageId?: string | null;
  churchId?: string | null;
  categoryId?: string | null;
  categoryNameAm?: string | null;
  categoryNameEn?: string | null;
  pageCount?: number | null;
  viewCount?: number;
  downloadCount?: number;
  createdById?: string | null;
  approvedById?: string | null;
  publishedAt?: string | null;
  translations: BookTranslationDto[];
  category?: CategoryDto | null;
  rights?: RightsRecordDto | null;
  file?: StoredFileDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookTranslationInput {
  locale: string;
  title: string;
  description?: string;
  author?: string;
  publisher?: string;
}

export interface CreateBookDto {
  slug: string;
  author?: string;
  publishedYear?: number;
  fileId?: string;
  rightsId?: string;
  coverImageId?: string;
  churchId?: string;
  categoryId?: string;
  translations: CreateBookTranslationInput[];
}

export interface UpdateBookDto {
  slug?: string;
  author?: string;
  publishedYear?: number;
  fileId?: string;
  rightsId?: string;
  coverImageId?: string;
  churchId?: string;
  categoryId?: string;
  translations?: CreateBookTranslationInput[];
}

export interface BookTransitionDto {
  targetStatus: ContentStatus;
  comment?: string;
}
