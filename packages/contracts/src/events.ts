import { ContentStatus, EventType, SupportedLocale } from './enums';

export interface EthiopianCalendarDate {
  year: number;
  month: number; // 1 (Meskerem) to 13 (Pagume)
  monthNameAm: string;
  monthNameGez: string;
  monthNameEn: string;
  day: number; // 1 to 30 (1-5/6 in Pagume)
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  dayNameAm: string;
  dayNameEn: string;
  seasonAm: string; // e.g. ዘመነ ዮሐንስ
  seasonEn: string;
}

export interface LiturgicalFeastDefinition {
  id: string;
  nameAm: string;
  nameGez: string;
  nameEn: string;
  ethiopianMonth: number;
  ethiopianDay: number;
  isMovable: boolean;
  type: EventType;
  fastRelated?: boolean;
  significanceAm: string;
  significanceEn: string;
}

export interface EventTranslationDto {
  id: string;
  eventId: string;
  locale: SupportedLocale | string;
  title: string;
  description?: string;
  liturgicalSignificance?: string;
}

export interface EventDto {
  id: string;
  slug: string;
  type: EventType;
  churchId?: string;
  churchName?: string;
  title: string;
  description?: string;
  startAt: string; // ISO date string
  endAt?: string;
  timezone: string;
  venue?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isRecurringAnnual?: boolean;
  ethiopianMonth?: number;
  ethiopianDay?: number;
  ethiopianDateFormatted?: string;
  status: ContentStatus;
  coverMediaId?: string;
  coverMediaUrl?: string;
  createdById?: string;
  approvedById?: string;
  createdAt: string;
  updatedAt: string;
  translations: EventTranslationDto[];
}

export interface CreateEventDto {
  slug?: string;
  type: EventType;
  churchId?: string;
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  venue?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isRecurringAnnual?: boolean;
  ethiopianMonth?: number;
  ethiopianDay?: number;
  coverMediaId?: string;
  translations: Array<{
    locale: string;
    title: string;
    description?: string;
    liturgicalSignificance?: string;
  }>;
}

export interface UpdateEventDto {
  slug?: string;
  type?: EventType;
  churchId?: string;
  title?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  venue?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isRecurringAnnual?: boolean;
  ethiopianMonth?: number;
  ethiopianDay?: number;
  coverMediaId?: string;
  translations?: Array<{
    locale: string;
    title: string;
    description?: string;
    liturgicalSignificance?: string;
  }>;
}

export interface EventTransitionDto {
  targetStatus: ContentStatus;
  reason?: string;
}
