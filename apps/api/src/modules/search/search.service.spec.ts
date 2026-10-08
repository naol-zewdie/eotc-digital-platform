import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { LibraryService } from '../library/library.service';
import { MezmurService } from '../mezmur/mezmur.service';
import { EditorialService } from '../editorial/editorial.service';
import { ChurchesService } from '../churches/churches.service';
import { EventsService } from '../events/events.service';
import {
  ContentStatus,
  RightsStatus,
  ArticleType,
  VerificationStatus,
  EventType,
} from '@eotc/contracts';

describe('SearchService', () => {
  let service: SearchService;

  const mockLibraryService = {
    findAll: jest.fn().mockResolvedValue([
      {
        id: 'book-weddase-01',
        slug: 'weddase-maryam',
        status: ContentStatus.PUBLISHED,
        category: {
          slug: 'patristics',
          nameAm: 'ድርሳናትና ገድላት',
          nameGez: 'ድርሳናት',
          nameEn: 'Patristics',
        },
        pageCount: 142,
        rights: { status: RightsStatus.PUBLIC_DOMAIN, downloadAllowed: true },
        translations: [
          {
            locale: 'gez',
            title: 'ውዳሴ ማርያም ዘሰኑይ',
            authorDisplayName: 'ቅዱስ ኤፍሬም ሶርያዊ',
          },
          {
            locale: 'am',
            title: 'ውዳሴ ማርያም አንድምታ',
            authorDisplayName: 'ቅዱስ ኤፍሬም ሶርያዊ',
            description: 'የእመቤታችን ምስጋና',
          },
        ],
      },
    ]),
  };

  const mockMezmurService = {
    findAll: jest.fn().mockResolvedValue([
      {
        id: 'mezmur-1',
        slug: 'selam-leki-maryam',
        status: ContentStatus.PUBLISHED,
        artist: {
          id: 'a1',
          slug: 'mk',
          nameAm: 'ማኅበረ ቅዱሳን',
          nameEn: 'Mahbere Kidusan',
          isChoir: true,
        },
        category: {
          id: 'c1',
          slug: 'mariam',
          nameAm: 'የእመቤታችን',
          nameGez: 'ዘእግዝእትነ',
          nameEn: 'St Mary',
        },
        playCount: 1200,
        rights: { status: RightsStatus.PERMISSION_GRANTED },
        translations: [
          {
            locale: 'am',
            title: 'ሰላም ለኪ ማርያም',
            lyrics: 'ሰላም ለኪ ማርያም እመ አምላክ ንጽሕት',
            description: 'የእመቤታችን የምስጋና መዝሙር',
          },
        ],
      },
    ]),
  };

  const mockEditorialService = {
    findAll: jest.fn().mockResolvedValue([
      {
        id: 'art-synod-01',
        slug: 'holy-synod-peace-declaration-2026',
        type: ArticleType.NEWS,
        status: ContentStatus.PUBLISHED,
        authorName: 'Patriarchate Secretariat',
        publishedAt: '2026-01-20T00:00:00.000Z',
        viewCount: 4210,
        translations: [
          {
            locale: 'am',
            title: 'የቅዱስ ሲኖዶስ ዓመታዊ የሰላም መግለጫ',
            summary: 'ቅዱስ ሲኖዶስ ያወጣው ሰፊ መግለጫ።',
            contentMarkdown: '# የቅዱስ ሲኖዶስ ሐዋርያዊ መግለጫ',
          },
        ],
      },
    ]),
  };

  const mockChurchesService = {
    findAll: jest.fn().mockResolvedValue([
      {
        id: 'church-debre-libanos',
        slug: 'debre-libanos-monastery',
        diocese: 'North Shewa Diocese',
        region: 'Oromia',
        city: 'Debre Libanos',
        verificationStatus: VerificationStatus.VERIFIED,
        status: ContentStatus.PUBLISHED,
        translations: [
          {
            locale: 'am',
            name: 'ደብረ ሊባኖስ ገዳም',
            description: 'በአቡነ ተክለ ሃይማኖት በ፲፫ኛው መቶ ክፍለ ዘመን የተመሠረተ ታላቅ ገዳም።',
          },
          {
            locale: 'en',
            name: 'Debre Libanos Monastery',
            description: '13th century monastery founded by Abuna Tekle Haymanot.',
          },
        ],
      },
    ]),
  };

  const mockEventsService = {
    findAll: jest.fn().mockResolvedValue({
      items: [
        {
          id: 'ev-meskel-01',
          slug: 'feast-of-meskel',
          title: 'ደመራና መስቀል በዓል',
          type: EventType.LITURGICAL_FEAST,
          venue: 'Meskel Square, Addis Ababa',
          startAt: '2026-09-27T06:00:00.000Z',
          translations: [
            {
              locale: 'am',
              title: 'ደመራና መስቀል በዓል',
              description: 'የደመራ ማብራት እና የቅዱስ መስቀል ክብረ በዓል።',
            },
          ],
        },
      ],
      total: 1,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: LibraryService, useValue: mockLibraryService },
        { provide: MezmurService, useValue: mockMezmurService },
        { provide: EditorialService, useValue: mockEditorialService },
        { provide: ChurchesService, useValue: mockChurchesService },
        { provide: EventsService, useValue: mockEventsService },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return empty results if query is empty or whitespace', async () => {
    const result = await service.search({ q: '' });
    expect(result.total).toBe(0);
    expect(result.results).toEqual([]);
    expect(result.countsByType).toEqual({
      BOOK: 0,
      MEZMUR: 0,
      ARTICLE: 0,
      CHURCH: 0,
      EVENT: 0,
    });
  });

  it('should search across all 5 domains and rank by relevance score', async () => {
    const res = await service.search({ q: 'ማርያም', locale: 'am' });
    expect(res.total).toBeGreaterThanOrEqual(2);
    expect(res.countsByType.BOOK).toBeGreaterThanOrEqual(1);
    expect(res.countsByType.MEZMUR).toBeGreaterThanOrEqual(1);
    const types = res.results.map((r) => r.type);
    expect(types).toContain('BOOK');
    expect(types).toContain('MEZMUR');
    expect(res.results[0].relevanceScore).toBeGreaterThanOrEqual(
      res.results[1].relevanceScore,
    );
  });

  it('should filter results by specific type BOOK', async () => {
    const res = await service.search({ q: 'ውዳሴ', type: 'BOOK' });
    expect(res.total).toBe(1);
    expect(res.results[0].type).toBe('BOOK');
    expect(res.results[0].slug).toBe('weddase-maryam');
  });

  it('should filter results by CHURCH', async () => {
    const res = await service.search({ q: 'ሊባኖስ', type: 'CHURCH' });
    expect(res.total).toBe(1);
    expect(res.results[0].type).toBe('CHURCH');
    expect(res.results[0].slug).toBe('debre-libanos-monastery');
  });

  it('should filter results by EVENT', async () => {
    const res = await service.search({ q: 'መስቀል', type: 'EVENT' });
    expect(res.total).toBe(1);
    expect(res.results[0].type).toBe('EVENT');
    expect(res.results[0].title).toBe('ደመራና መስቀል በዓል');
  });

  it('should filter results by ARTICLE', async () => {
    const res = await service.search({ q: 'ሲኖዶስ', type: 'ARTICLE' });
    expect(res.total).toBe(1);
    expect(res.results[0].type).toBe('ARTICLE');
    expect(res.results[0].slug).toBe('holy-synod-peace-declaration-2026');
  });
});
