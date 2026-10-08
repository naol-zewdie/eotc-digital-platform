import { Injectable, Logger } from '@nestjs/common';
import {
  SearchResultType,
  SearchResultItemDto,
  SearchResponseDto,
  ContentStatus,
  VerificationStatus,
  BookDto,
  MezmurDto,
  ArticleDto,
  ChurchDto,
  EventDto,
} from '@eotc/contracts';
import { LibraryService } from '../library/library.service';
import { MezmurService } from '../mezmur/mezmur.service';
import { EditorialService } from '../editorial/editorial.service';
import { ChurchesService } from '../churches/churches.service';
import { EventsService } from '../events/events.service';
import { SearchQueryDto } from './dto/search.dto';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly libraryService: LibraryService,
    private readonly mezmurService: MezmurService,
    private readonly editorialService: EditorialService,
    private readonly churchesService: ChurchesService,
    private readonly eventsService: EventsService,
  ) {}

  async search(queryDto: SearchQueryDto): Promise<SearchResponseDto> {
    const rawQuery = (queryDto.q || '').trim();
    const queryLower = rawQuery.toLowerCase();
    const targetType = queryDto.type || 'ALL';
    const locale = queryDto.locale || 'am';
    const limit = Math.min(Math.max(Number(queryDto.limit) || 20, 1), 100);
    const offset = Math.max(Number(queryDto.offset) || 0, 0);

    const countsByType = {
      BOOK: 0,
      MEZMUR: 0,
      ARTICLE: 0,
      CHURCH: 0,
      EVENT: 0,
    };

    if (!rawQuery) {
      return {
        query: rawQuery,
        total: 0,
        results: [],
        countsByType,
      };
    }

    const allItems: SearchResultItemDto[] = [];

    // 1. Books
    if (targetType === 'ALL' || targetType === 'BOOK') {
      try {
        const books = await this.libraryService.findAll({ status: ContentStatus.PUBLISHED });
        for (const book of books) {
          const matchScore = this.calculateBookScore(book, queryLower);
          if (matchScore > 0) {
            countsByType.BOOK++;
            const prefTrans =
              book.translations?.find((t) => t.locale === locale) ||
              book.translations?.[0];
            const title = prefTrans?.title || book.slug;
            const gezTrans = book.translations?.find((t) => t.locale === 'gez');
            const categoryName = book.category?.nameAm || book.categoryNameAm || book.category?.nameEn || '';

            allItems.push({
              id: book.id,
              type: 'BOOK',
              slug: book.slug,
              title,
              subtitle: prefTrans?.authorDisplayName || gezTrans?.title || categoryName,
              description: prefTrans?.description || book.category?.descriptionAm || undefined,
              locale: prefTrans?.locale || locale,
              url: `/${locale}/library/${book.slug}`,
              category: book.category?.slug || book.categoryId || undefined,
              relevanceScore: matchScore,
              metadata: {
                rightsStatus: book.rights?.status,
                downloadAllowed: book.rights?.downloadAllowed ?? true,
                pageCount: book.pageCount,
              },
            });
          }
        }
      } catch (err) {
        this.logger.warn(`Failed to search books: ${(err as Error).message}`);
      }
    }

    // 2. Mezmur
    if (targetType === 'ALL' || targetType === 'MEZMUR') {
      try {
        const mezmurs = await this.mezmurService.findAll({ status: ContentStatus.PUBLISHED });
        for (const m of mezmurs) {
          const matchScore = this.calculateMezmurScore(m, queryLower);
          if (matchScore > 0) {
            countsByType.MEZMUR++;
            const prefTrans =
              m.translations?.find((t) => t.locale === locale) ||
              m.translations?.[0];
            const artistName =
              (locale === 'am' ? m.artist?.nameAm : m.artist?.nameEn) ||
              m.artist?.nameAm ||
              m.artist?.nameEn ||
              '';
            const catName =
              (locale === 'am' ? m.category?.nameAm : m.category?.nameEn) ||
              m.category?.nameAm ||
              m.category?.nameEn ||
              '';

            allItems.push({
              id: m.id,
              type: 'MEZMUR',
              slug: m.slug,
              title: prefTrans?.title || m.slug,
              subtitle: artistName ? `${artistName}${catName ? ' • ' + catName : ''}` : catName,
              description: prefTrans?.description || prefTrans?.lyrics?.slice(0, 150) || undefined,
              locale: prefTrans?.locale || locale,
              url: `/${locale}/mezmur/${m.slug}`,
              category: m.category?.slug,
              relevanceScore: matchScore,
              metadata: {
                playCount: m.playCount,
                rightsStatus: m.rights?.status,
                artistName,
              },
            });
          }
        }
      } catch (err) {
        this.logger.warn(`Failed to search mezmurs: ${(err as Error).message}`);
      }
    }

    // 3. Articles / Editorial
    if (targetType === 'ALL' || targetType === 'ARTICLE') {
      try {
        const articles = await this.editorialService.findAll({ status: ContentStatus.PUBLISHED });
        for (const art of articles) {
          const matchScore = this.calculateArticleScore(art, queryLower);
          if (matchScore > 0) {
            countsByType.ARTICLE++;
            const trans =
              art.translations?.find((t) => t.locale === locale) ||
              art.translations?.[0];
            allItems.push({
              id: art.id,
              type: 'ARTICLE',
              slug: art.slug,
              title: trans?.title || art.slug,
              subtitle: `${art.type} • ${art.authorName || 'EOTC Patriarchate'}`,
              description: trans?.summary || trans?.contentMarkdown?.slice(0, 160),
              locale: trans?.locale || locale,
              url: `/${locale}/articles/${art.slug}`,
              category: art.type,
              relevanceScore: matchScore,
              metadata: {
                publishedAt: art.publishedAt,
                viewCount: art.viewCount,
              },
            });
          }
        }
      } catch (err) {
        this.logger.warn(`Failed to search articles: ${(err as Error).message}`);
      }
    }

    // 4. Churches
    if (targetType === 'ALL' || targetType === 'CHURCH') {
      try {
        const churches = await this.churchesService.findAll({
          verificationStatus: VerificationStatus.VERIFIED,
        });
        for (const church of churches) {
          const matchScore = this.calculateChurchScore(church, queryLower);
          if (matchScore > 0) {
            countsByType.CHURCH++;
            const trans =
              church.translations?.find((t) => t.locale === locale) ||
              church.translations?.[0];
            const name = trans?.name || church.slug;
            const subtitle = [church.diocese, church.region, church.city].filter(Boolean).join(' • ');

            allItems.push({
              id: church.id,
              type: 'CHURCH',
              slug: church.slug,
              title: name,
              subtitle,
              description: trans?.description || trans?.history?.slice(0, 150) || undefined,
              locale: trans?.locale || locale,
              url: `/${locale}/churches/${church.slug}`,
              category: church.region || undefined,
              relevanceScore: matchScore,
              metadata: {
                verificationStatus: church.verificationStatus,
                diocese: church.diocese,
                city: church.city,
              },
            });
          }
        }
      } catch (err) {
        this.logger.warn(`Failed to search churches: ${(err as Error).message}`);
      }
    }

    // 5. Events
    if (targetType === 'ALL' || targetType === 'EVENT') {
      try {
        const eventRes = await this.eventsService.findAll({ isStaff: false });
        const events = eventRes.items || [];
        for (const ev of events) {
          const matchScore = this.calculateEventScore(ev, queryLower);
          if (matchScore > 0) {
            countsByType.EVENT++;
            const trans =
              ev.translations?.find((t) => t.locale === locale) ||
              ev.translations?.[0];
            const title = trans?.title || ev.title;
            const subtitle = [ev.type, ev.venue, ev.churchName].filter(Boolean).join(' • ');

            allItems.push({
              id: ev.id,
              type: 'EVENT',
              slug: ev.slug || ev.id,
              title,
              subtitle,
              description: trans?.description || ev.description,
              locale: trans?.locale || locale,
              url: `/${locale}/events#${ev.slug || ev.id}`,
              category: ev.type,
              relevanceScore: matchScore,
              metadata: {
                startAt: ev.startAt,
                ethiopianMonth: ev.ethiopianMonth,
                ethiopianDay: ev.ethiopianDay,
                ethiopianDateFormatted: ev.ethiopianDateFormatted,
              },
            });
          }
        }
      } catch (err) {
        this.logger.warn(`Failed to search events: ${(err as Error).message}`);
      }
    }

    // Sort by relevance score descending
    allItems.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const total = allItems.length;
    const paginated = allItems.slice(offset, offset + limit);

    return {
      query: rawQuery,
      total,
      results: paginated,
      countsByType,
    };
  }

  private calculateBookScore(book: BookDto, query: string): number {
    let score = 0;
    const titles = [book.slug, ...(book.translations?.map((t) => t.title) || [])];
    for (const t of titles) {
      if (!t) continue;
      const lower = t.toLowerCase();
      if (lower === query) score = Math.max(score, 100);
      else if (lower.startsWith(query)) score = Math.max(score, 80);
      else if (lower.includes(query)) score = Math.max(score, 60);
    }

    if (
      book.slug?.toLowerCase().includes(query) ||
      book.category?.slug?.toLowerCase().includes(query) ||
      book.category?.nameAm?.toLowerCase().includes(query) ||
      book.category?.nameEn?.toLowerCase().includes(query)
    ) {
      score = Math.max(score, 40);
    }

    const desc = [
      book.author,
      ...(book.translations?.map((t) => `${t.description || ''} ${t.authorDisplayName || ''}`) || []),
    ]
      .join(' ')
      .toLowerCase();

    if (desc.includes(query)) {
      score = Math.max(score, 25);
    }

    return score;
  }

  private calculateMezmurScore(m: MezmurDto, query: string): number {
    let score = 0;
    const titles = [
      m.slug,
      ...(m.translations?.map((t) => t.title) || []),
    ].filter(Boolean) as string[];

    for (const t of titles) {
      const lower = t.toLowerCase();
      if (lower === query) score = Math.max(score, 100);
      else if (lower.startsWith(query)) score = Math.max(score, 80);
      else if (lower.includes(query)) score = Math.max(score, 60);
    }

    if (
      m.artist?.nameAm?.toLowerCase().includes(query) ||
      m.artist?.nameEn?.toLowerCase().includes(query) ||
      m.category?.nameAm?.toLowerCase().includes(query) ||
      m.category?.nameEn?.toLowerCase().includes(query)
    ) {
      score = Math.max(score, 45);
    }

    const lyricsBlob = (m.translations || [])
      .map((t) => `${t.lyrics || ''} ${t.description || ''}`)
      .join(' ')
      .toLowerCase();

    if (lyricsBlob.includes(query)) {
      score = Math.max(score, 30);
    }

    return score;
  }

  private calculateArticleScore(art: ArticleDto, query: string): number {
    let score = 0;
    const titles = [art.slug, ...(art.translations?.map((t) => t.title) || [])];
    for (const t of titles) {
      if (!t) continue;
      const lower = t.toLowerCase();
      if (lower === query) score = Math.max(score, 100);
      else if (lower.startsWith(query)) score = Math.max(score, 80);
      else if (lower.includes(query)) score = Math.max(score, 60);
    }

    if (art.authorName?.toLowerCase().includes(query) || art.type?.toLowerCase().includes(query)) {
      score = Math.max(score, 40);
    }

    const contentBlob = (art.translations || [])
      .map((t) => `${t.summary || ''} ${t.contentMarkdown || ''}`)
      .join(' ')
      .toLowerCase();

    if (contentBlob.includes(query)) {
      score = Math.max(score, 25);
    }

    return score;
  }

  private calculateChurchScore(church: ChurchDto, query: string): number {
    let score = 0;
    const names = [
      church.slug,
      ...(church.translations?.map((t) => t.name) || []),
    ].filter(Boolean) as string[];

    for (const n of names) {
      const lower = n.toLowerCase();
      if (lower === query) score = Math.max(score, 100);
      else if (lower.startsWith(query)) score = Math.max(score, 80);
      else if (lower.includes(query)) score = Math.max(score, 60);
    }

    if (
      church.diocese?.toLowerCase().includes(query) ||
      church.region?.toLowerCase().includes(query) ||
      church.city?.toLowerCase().includes(query) ||
      church.contacts?.addressLine?.toLowerCase().includes(query)
    ) {
      score = Math.max(score, 45);
    }

    const overview = (church.translations || [])
      .map((t) => `${t.description || ''} ${t.history || ''}`)
      .join(' ')
      .toLowerCase();

    if (overview.includes(query)) {
      score = Math.max(score, 20);
    }

    return score;
  }

  private calculateEventScore(ev: EventDto, query: string): number {
    let score = 0;
    const titles = [
      ev.title,
      ev.slug,
      ...(ev.translations?.map((t) => t.title) || []),
    ].filter(Boolean) as string[];

    for (const t of titles) {
      const lower = t.toLowerCase();
      if (lower === query) score = Math.max(score, 100);
      else if (lower.startsWith(query)) score = Math.max(score, 80);
      else if (lower.includes(query)) score = Math.max(score, 60);
    }

    if (
      ev.type?.toLowerCase().includes(query) ||
      ev.venue?.toLowerCase().includes(query) ||
      ev.churchName?.toLowerCase().includes(query)
    ) {
      score = Math.max(score, 40);
    }

    const desc = [
      ev.description,
      ...(ev.translations?.map((t) => `${t.description || ''} ${t.liturgicalSignificance || ''}`) || []),
    ]
      .join(' ')
      .toLowerCase();

    if (desc.includes(query)) {
      score = Math.max(score, 20);
    }

    return score;
  }
}
