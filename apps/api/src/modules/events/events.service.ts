import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  ContentStatus,
  EventType,
  AuditAction,
  EventDto,
  UserRole,
} from '@eotc/contracts';
import {
  CreateEventInputDto,
  UpdateEventInputDto,
  TransitionEventDto,
} from './dto/events.dto';
import {
  gregorianToEthiopian,
  formatEthiopianDate,
  CANONICAL_FEASTS,
  MONTHLY_COMMEMORATIONS,
  ETHIOPIAN_MONTHS,
} from './ethiopian-calendar';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  // In-memory canonical feasts and diocesan events
  private memoryEvents: EventDto[] = [
    {
      id: 'evt-meskel-01',
      slug: 'feast-of-the-cross-meskel-2026',
      type: EventType.LITURGICAL_FEAST,
      churchId: 'patriarchate',
      churchName: 'Holy Synod & Patriarchate of Ethiopia',
      title: 'የክቡር መስቀል ደመራና የብርሃነ መስቀል በዓል',
      description: 'በመስቀል አደባባይና በመላው አብያተ ክርስቲያናት በታላቅ ያሬዳዊ ሥርዓት የሚከበረው የደመራና የበዓለ መስቀል በዓል።',
      startAt: '2026-09-27T12:00:00.000Z',
      endAt: '2026-09-28T18:00:00.000Z',
      timezone: 'Africa/Addis_Ababa',
      venue: 'Meskel Square & Holy Trinity Cathedral, Addis Ababa',
      coordinates: { latitude: 9.0108, longitude: 38.7613 },
      isRecurringAnnual: true,
      ethiopianMonth: 1,
      ethiopianDay: 17,
      ethiopianDateFormatted: 'መስከረም 17 ቀን (በዓለ መስቀል)',
      status: ContentStatus.PUBLISHED,
      coverMediaId: 'med-001',
      coverMediaUrl: '/api/v1/storage/file/manuscripts/axum-tsion-f12.webp',
      createdById: 'user-admin-001',
      approvedById: 'user-reviewer-001',
      createdAt: '2026-01-10T00:00:00.000Z',
      updatedAt: '2026-01-15T00:00:00.000Z',
      translations: [
        {
          id: 'trans-evt-msk-am',
          eventId: 'evt-meskel-01',
          locale: 'am',
          title: 'የክቡር መስቀል ደመራና የብርሃነ መስቀል በዓል',
          description: 'በመስቀል አደባባይ በብፁዕ ወቅዱስ ፓትርያርኩና በሊቃነ ጳጳሳት ቡራኬ የሚለኮሰው ታላቁ ደመራና ያሬዳዊ ዝማሬ።',
          liturgicalSignificance: 'ንግሥት ዕሌኒ የጌታችንን መስቀል በእጣን ጢስ ምሪት የቆፈረችበትና ያገኘችበት መታሰቢያ።',
        },
        {
          id: 'trans-evt-msk-gez',
          eventId: 'evt-meskel-01',
          locale: 'gez',
          title: 'በዓለ መስቀል ክብረ ቅዱሳን ወመድኃኒተ ክርስቲያን',
          description: 'ስብሐተ ማኅሌት ዘደመራ ወበዓለ መስቀል ዘቅዱስ ያሬድ።',
          liturgicalSignificance: 'መስቀል ብርሃን ለኵሉ ዓለም፤ መሠረተ ቤተ ክርስቲያን ወመድኃኒቶሙ ለእለ የአምኑ ቦቱ።',
        },
        {
          id: 'trans-evt-msk-en',
          eventId: 'evt-meskel-01',
          locale: 'en',
          title: 'Feast of the Finding of the True Cross (Meskel & Demera)',
          description: 'The national ecclesiastical celebration of the Demera bonfire and liturgy at Meskel Square with Holy Synod bishops.',
          liturgicalSignificance: 'Commemoration of Saint Helena discerning the buried True Cross through divine incense revelation.',
        },
      ],
    },
    {
      id: 'evt-timkat-02',
      slug: 'epiphany-theophany-timkat-2027',
      type: EventType.LITURGICAL_FEAST,
      churchId: 'patriarchate',
      churchName: 'All Dioceses & Historical Sanctuaries',
      title: 'የጌታችን የመድኃኔዓለም በዓለ ጥምቀት (Timkat)',
      description: 'ታቦታተ ሕጉ ወደ ባሕረ ጥምቀት ወርደው የሚያድሩበትና ሕዝበ ክርስቲያኑ ጸበለ ጥምቀቱን የሚረጭበት ዓለም አቀፍ የኢትዮጵያ በዓል።',
      startAt: '2027-01-19T03:00:00.000Z',
      endAt: '2027-01-20T16:00:00.000Z',
      timezone: 'Africa/Addis_Ababa',
      venue: 'Jan Meda (Addis Ababa), Fasilides Bath (Gondar), & Nationwide',
      coordinates: { latitude: 12.6075, longitude: 37.4589 },
      isRecurringAnnual: true,
      ethiopianMonth: 5,
      ethiopianDay: 11,
      ethiopianDateFormatted: 'ጥር 11 ቀን (በዓለ ጥምቀት)',
      status: ContentStatus.PUBLISHED,
      coverMediaId: 'med-001',
      coverMediaUrl: '/api/v1/storage/file/manuscripts/axum-tsion-f12.webp',
      createdById: 'user-admin-001',
      approvedById: 'user-reviewer-001',
      createdAt: '2026-01-15T00:00:00.000Z',
      updatedAt: '2026-01-18T00:00:00.000Z',
      translations: [
        {
          id: 'trans-evt-tmk-am',
          eventId: 'evt-timkat-02',
          locale: 'am',
          title: 'የጌታችን የመድኃኔዓለም በዓለ ጥምቀት',
          description: 'በዮርዳኖስ ወንዝ የተደረገው የጌታችን ጥምቀትና የታቦታተ ሕጉ የክብር ጉዞ።',
          liturgicalSignificance: 'ምሥጢረ ሥላሴ የተገለጠበት፤ አብ በደመና ሲመሰክር ወልድ በዮርዳኖስ ሲጠመቅ መንፈስ ቅዱስ በርግብ አምሳል ሲወርድ።',
        },
        {
          id: 'trans-evt-tmk-en',
          eventId: 'evt-timkat-02',
          locale: 'en',
          title: 'Theophany / Epiphany Celebration (Timkat)',
          description: 'Procession of the sacred Tabots to the baptismal waters and early morning blessing of the faithful.',
          liturgicalSignificance: 'Commemoration of Christ’s baptism by John in the River Jordan and the manifestation of the Holy Trinity.',
        },
      ],
    },
    {
      id: 'evt-debre-libanos-03',
      slug: 'saint-tekle-haymanot-pilgrimage-feast',
      type: EventType.PATRONAL_FEAST,
      churchId: 'debre-libanos',
      churchName: 'Debre Libanos Monastery',
      title: 'የጻድቁ አቡነ ተክለ ሃይማኖት ዓመታዊ የንግሥ በዓል',
      description: 'በደብረ ሊባኖስ ገዳም በታላቅ መንፈሳዊ ድምቀት የሚከበረው የጻድቁ አባታችን አቡነ ተክለ ሃይማኖት ዓመታዊ የዕረፍት በዓል።',
      startAt: '2026-08-30T05:00:00.000Z',
      endAt: '2026-08-30T17:00:00.000Z',
      timezone: 'Africa/Addis_Ababa',
      venue: 'Debre Libanos Monastery, North Shewa',
      coordinates: { latitude: 9.7167, longitude: 38.7333 },
      isRecurringAnnual: true,
      ethiopianMonth: 12,
      ethiopianDay: 24,
      ethiopianDateFormatted: 'ነሐሴ 24 ቀን (ዕረፍተ አቡነ ተክለ ሃይማኖት)',
      status: ContentStatus.PUBLISHED,
      coverMediaId: 'med-001',
      coverMediaUrl: '/api/v1/storage/file/manuscripts/axum-tsion-f12.webp',
      createdById: 'rep-001',
      approvedById: 'user-reviewer-001',
      createdAt: '2026-02-01T00:00:00.000Z',
      updatedAt: '2026-02-05T00:00:00.000Z',
      translations: [
        {
          id: 'trans-evt-dl-am',
          eventId: 'evt-debre-libanos-03',
          locale: 'am',
          title: 'የጻድቁ አቡነ ተክለ ሃይማኖት ዓመታዊ የንግሥ በዓል',
          description: 'ከሁሉም አህጉረ ስብከት የተሰባሰቡ ምእመናን በገዳሙ የሚያደርጉት ዓመታዊ ንግሥና ጸሎተ ምህላ።',
          liturgicalSignificance: 'ኢትዮጵያዊው ሐዋርያና ጻድቅ አቡነ ተክለ ሃይማኖት በደብረ ሊባኖስ ያደረጉት ተጋድሎና ቃል ኪዳን መታሰቢያ።',
        },
        {
          id: 'trans-evt-dl-en',
          eventId: 'evt-debre-libanos-03',
          locale: 'en',
          title: 'Annual Pilgrimage Feast of Abune Tekle Haymanot',
          description: 'Holy pilgrimage liturgy at Debre Libanos Monastery celebrating the Ethiopian monastic father.',
          liturgicalSignificance: 'Solemn liturgical commemoration of Abune Tekle Haymanot’s departure and apostolic labor across Ethiopia.',
        },
      ],
    },
    {
      id: 'evt-synod-04',
      slug: 'holy-synod-plenary-assembly-2026',
      type: EventType.PARISH_CONFERENCE,
      churchId: 'patriarchate',
      churchName: 'Holy Synod Secretariat',
      title: 'የቅዱስ ሲኖዶስ ዓመታዊ የጥቅምት ምልዐተ ጉባኤ',
      description: 'በብፁዕ ወቅዱስ ፓትርያርኩ ሰብሳቢነት በዓለም ዙሪያ የሚገኙ ሊቃነ ጳጳሳት የሚሳተፉበት ዓመታዊ ጉባኤ።',
      startAt: '2026-10-22T06:00:00.000Z',
      endAt: '2026-10-29T15:00:00.000Z',
      timezone: 'Africa/Addis_Ababa',
      venue: 'Patriarchate Hall, Addis Ababa',
      coordinates: { latitude: 9.0300, longitude: 38.7400 },
      isRecurringAnnual: false,
      status: ContentStatus.PUBLISHED,
      coverMediaId: 'med-001',
      coverMediaUrl: '/api/v1/storage/file/manuscripts/axum-tsion-f12.webp',
      createdById: 'user-admin-001',
      approvedById: 'user-reviewer-001',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-05T00:00:00.000Z',
      translations: [
        {
          id: 'trans-evt-syn-am',
          eventId: 'evt-synod-04',
          locale: 'am',
          title: 'የቅዱስ ሲኖዶስ ዓመታዊ የጥቅምት ምልዐተ ጉባኤ',
          description: 'የቤተክርስቲያኒቱን ወቅታዊ ጉዳዮች፣ የቀኖና ጥበቃና የመንፈሳዊ አገልግሎት አቅጣጫ የሚወስን ጠቅላይ ጉባኤ።',
          liturgicalSignificance: 'በሐዋርያዊ ሲኖዶሳዊ ቀኖና መሠረት የሚካሄድ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን የበላይ አስተዳደር ጉባኤ።',
        },
        {
          id: 'trans-evt-syn-en',
          eventId: 'evt-synod-04',
          locale: 'en',
          title: 'Holy Synod Plenary Synodal Assembly (Tikimt Session)',
          description: 'Official gathering of the archbishops and hierarchy under the chairmanship of His Holiness the Patriarch.',
          liturgicalSignificance: 'Canonical synodal assembly deliberating upon pastoral leadership, dogma, and ecclesiastical affairs.',
        },
      ],
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Get Current Liturgical Calendar State and Feasts
   */
  getLiturgicalCalendar(requestedDate?: string) {
    const targetDate = requestedDate ? new Date(requestedDate) : new Date();
    const ethDate = gregorianToEthiopian(targetDate);
    const formattedAm = formatEthiopianDate(ethDate, 'am');
    const formattedEn = formatEthiopianDate(ethDate, 'en');

    // Find if today is a major feast
    const todayFeasts = CANONICAL_FEASTS.filter(
      (f) => f.ethiopianMonth === ethDate.month && f.ethiopianDay === ethDate.day,
    );

    // Find monthly commemoration for today
    const monthlyCommemoration = MONTHLY_COMMEMORATIONS.find(
      (m) => m.day === ethDate.day,
    );

    return {
      currentGregorian: targetDate.toISOString(),
      ethiopianDate: ethDate,
      formattedAm,
      formattedEn,
      todayFeasts,
      monthlyCommemoration,
      allCanonicalFeasts: CANONICAL_FEASTS,
      monthlyCommemorations: MONTHLY_COMMEMORATIONS,
      monthsReference: ETHIOPIAN_MONTHS,
    };
  }

  /**
   * Find all events with filters
   */
  async findAll(options?: {
    churchId?: string;
    type?: EventType;
    status?: ContentStatus;
    upcomingOnly?: boolean;
    isStaff?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ items: EventDto[]; total: number }> {
    try {
      const where: any = {};
      if (options?.churchId) where.churchId = options.churchId;
      if (options?.status) {
        where.status = options.status;
      } else if (!options?.isStaff) {
        where.status = ContentStatus.PUBLISHED;
      }

      const dbEvents = await this.prisma.event.findMany({
        where,
        orderBy: { startAt: 'asc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
        include: { church: true },
      });

      if (dbEvents && dbEvents.length > 0) {
        const items: EventDto[] = dbEvents.map((e) => {
          const eth = gregorianToEthiopian(new Date(e.startAt));
          return {
            id: e.id,
            slug: e.slug,
            type: EventType.LITURGICAL_FEAST,
            churchId: e.churchId || undefined,
            churchName: e.church?.slug,
            title: e.title,
            description: e.description || undefined,
            startAt: e.startAt.toISOString(),
            endAt: e.endAt?.toISOString(),
            timezone: e.timezone,
            venue: e.venue || undefined,
            coordinates: e.coordinates as any,
            ethiopianMonth: eth.month,
            ethiopianDay: eth.day,
            ethiopianDateFormatted: formatEthiopianDate(eth, 'am'),
            status: e.status as ContentStatus,
            createdAt: e.createdAt.toISOString(),
            updatedAt: e.updatedAt.toISOString(),
            translations: [
              {
                id: `trans-${e.id}-am`,
                eventId: e.id,
                locale: 'am',
                title: e.title,
                description: e.description || undefined,
              },
            ],
          };
        });
        return { items, total: items.length };
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable for events findAll: ${(err as Error).message}`);
    }

    // In-memory fallback
    let filtered = [...this.memoryEvents];
    if (options?.churchId) {
      filtered = filtered.filter((e) => e.churchId === options.churchId);
    }
    if (options?.type) {
      filtered = filtered.filter((e) => e.type === options.type);
    }
    if (options?.status) {
      filtered = filtered.filter((e) => e.status === options.status);
    } else if (!options?.isStaff) {
      filtered = filtered.filter((e) => e.status === ContentStatus.PUBLISHED);
    }
    if (options?.upcomingOnly) {
      const now = new Date().toISOString();
      filtered = filtered.filter((e) => e.startAt >= now);
    }

    return {
      items: filtered,
      total: filtered.length,
    };
  }

  /**
   * Find single event by ID or slug
   */
  async findOne(idOrSlug: string, isStaff: boolean = false): Promise<EventDto> {
    try {
      const dbEvent = await this.prisma.event.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
        include: { church: true },
      });

      if (dbEvent) {
        if (!isStaff && dbEvent.status !== ContentStatus.PUBLISHED) {
          throw new NotFoundException(`Event '${idOrSlug}' is not published.`);
        }
        const eth = gregorianToEthiopian(new Date(dbEvent.startAt));
        return {
          id: dbEvent.id,
          slug: dbEvent.slug,
          type: EventType.LITURGICAL_FEAST,
          churchId: dbEvent.churchId || undefined,
          churchName: dbEvent.church?.slug,
          title: dbEvent.title,
          description: dbEvent.description || undefined,
          startAt: dbEvent.startAt.toISOString(),
          endAt: dbEvent.endAt?.toISOString(),
          timezone: dbEvent.timezone,
          venue: dbEvent.venue || undefined,
          coordinates: dbEvent.coordinates as any,
          ethiopianMonth: eth.month,
          ethiopianDay: eth.day,
          ethiopianDateFormatted: formatEthiopianDate(eth, 'am'),
          status: dbEvent.status as ContentStatus,
          createdAt: dbEvent.createdAt.toISOString(),
          updatedAt: dbEvent.updatedAt.toISOString(),
          translations: [
            {
              id: `trans-${dbEvent.id}-am`,
              eventId: dbEvent.id,
              locale: 'am',
              title: dbEvent.title,
              description: dbEvent.description || undefined,
            },
          ],
        };
      }
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.warn(`Prisma unavailable for events findOne: ${(err as Error).message}`);
    }

    const mem = this.memoryEvents.find((e) => e.id === idOrSlug || e.slug === idOrSlug);
    if (!mem) {
      throw new NotFoundException(`Event '${idOrSlug}' was not found.`);
    }
    if (!isStaff && mem.status !== ContentStatus.PUBLISHED) {
      throw new NotFoundException(`Event '${idOrSlug}' is not published.`);
    }
    return mem;
  }

  /**
   * Create new event
   */
  async create(
    dto: CreateEventInputDto,
    actor: { id: string; role: string; churchId?: string },
  ): Promise<EventDto> {
    // Church representative tenancy validation
    if (actor.role === UserRole.CHURCH_REPRESENTATIVE) {
      if (!dto.churchId || dto.churchId !== actor.churchId) {
        throw new ForbiddenException(
          'Church Representatives may only schedule events for their assigned church parish.',
        );
      }
    }

    const slug =
      dto.slug ||
      (dto.translations[0]?.title
        ? dto.translations[0].title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-') + `-${Date.now()}`
        : `event-${Date.now()}`);

    const startDate = new Date(dto.startAt);
    const eth = gregorianToEthiopian(startDate);

    const primaryTranslation = dto.translations[0];
    const newEvent: EventDto = {
      id: `evt-${Date.now()}`,
      slug,
      type: dto.type,
      churchId: dto.churchId,
      title: primaryTranslation ? primaryTranslation.title : slug,
      description: primaryTranslation?.description,
      startAt: dto.startAt,
      endAt: dto.endAt,
      timezone: dto.timezone || 'Africa/Addis_Ababa',
      venue: dto.venue,
      coordinates: dto.coordinates,
      isRecurringAnnual: dto.isRecurringAnnual ?? false,
      ethiopianMonth: dto.ethiopianMonth || eth.month,
      ethiopianDay: dto.ethiopianDay || eth.day,
      ethiopianDateFormatted: formatEthiopianDate(eth, 'am'),
      status: ContentStatus.DRAFT,
      coverMediaId: dto.coverMediaId,
      createdById: actor.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      translations: dto.translations.map((t, idx) => ({
        id: `trans-evt-${Date.now()}-${idx}`,
        eventId: `evt-${Date.now()}`,
        locale: t.locale,
        title: t.title,
        description: t.description,
        liturgicalSignificance: t.liturgicalSignificance,
      })),
    };

    try {
      await this.prisma.event.create({
        data: {
          slug: newEvent.slug,
          title: newEvent.title,
          description: newEvent.description,
          startAt: new Date(newEvent.startAt),
          endAt: newEvent.endAt ? new Date(newEvent.endAt) : null,
          timezone: newEvent.timezone,
          venue: newEvent.venue,
          coordinates: newEvent.coordinates as any,
          status: newEvent.status,
          churchId: newEvent.churchId,
        },
      });
    } catch (err) {
      this.logger.warn(`Prisma unavailable, saving event in memory: ${(err as Error).message}`);
    }

    this.memoryEvents.unshift(newEvent);

    await this.auditService.record({
      actorId: actor.id,
      action: AuditAction.CONTENT_CREATED,
      entityType: 'Event',
      entityId: newEvent.id,
      metadata: { slug: newEvent.slug, type: newEvent.type, churchId: newEvent.churchId },
    });

    return newEvent;
  }

  /**
   * Update existing event
   */
  async update(
    id: string,
    dto: UpdateEventInputDto,
    actor: { id: string; role: string; churchId?: string },
  ): Promise<EventDto> {
    const existing = await this.findOne(id, true);

    // Tenancy scope check
    if (actor.role === UserRole.CHURCH_REPRESENTATIVE) {
      if (existing.churchId !== actor.churchId) {
        throw new ForbiddenException(
          'Church Representatives may only update events belonging to their assigned parish.',
        );
      }
    }

    const updated: EventDto = {
      ...existing,
      slug: dto.slug || existing.slug,
      type: dto.type || existing.type,
      churchId: dto.churchId !== undefined ? dto.churchId : existing.churchId,
      venue: dto.venue !== undefined ? dto.venue : existing.venue,
      startAt: dto.startAt || existing.startAt,
      endAt: dto.endAt !== undefined ? dto.endAt : existing.endAt,
      timezone: dto.timezone || existing.timezone,
      coordinates: dto.coordinates || existing.coordinates,
      isRecurringAnnual:
        dto.isRecurringAnnual !== undefined
          ? dto.isRecurringAnnual
          : existing.isRecurringAnnual,
      coverMediaId: dto.coverMediaId || existing.coverMediaId,
      updatedAt: new Date().toISOString(),
    };

    if (dto.translations && dto.translations.length > 0) {
      updated.translations = dto.translations.map((t, idx) => ({
        id: `trans-evt-${updated.id}-${idx}`,
        eventId: updated.id,
        locale: t.locale,
        title: t.title,
        description: t.description,
        liturgicalSignificance: t.liturgicalSignificance,
      }));
      updated.title = dto.translations[0].title;
      updated.description = dto.translations[0].description;
    }

    const idx = this.memoryEvents.findIndex((e) => e.id === id || e.slug === id);
    if (idx !== -1) {
      this.memoryEvents[idx] = updated;
    }

    await this.auditService.record({
      actorId: actor.id,
      action: AuditAction.CONTENT_UPDATED,
      entityType: 'Event',
      entityId: updated.id,
      metadata: { slug: updated.slug, status: updated.status },
    });

    return updated;
  }

  /**
   * State machine transition with separation of duties
   */
  async transition(
    id: string,
    dto: TransitionEventDto,
    actor: { id: string; role: string; churchId?: string },
  ): Promise<EventDto> {
    const event = await this.findOne(id, true);
    const current = event.status;
    const target = dto.targetStatus;

    // Tenancy scope check
    if (actor.role === UserRole.CHURCH_REPRESENTATIVE) {
      if (event.churchId !== actor.churchId) {
        throw new ForbiddenException(
          'Church Representatives cannot manage events outside their assigned parish.',
        );
      }
    }

    // State Machine validation
    const validTransitions: Record<ContentStatus, ContentStatus[]> = {
      [ContentStatus.DRAFT]: [ContentStatus.IN_REVIEW, ContentStatus.ARCHIVED],
      [ContentStatus.IN_REVIEW]: [
        ContentStatus.APPROVED,
        ContentStatus.REJECTED,
        ContentStatus.DRAFT,
      ],
      [ContentStatus.APPROVED]: [
        ContentStatus.PUBLISHED,
        ContentStatus.DRAFT,
        ContentStatus.ARCHIVED,
      ],
      [ContentStatus.PUBLISHED]: [ContentStatus.ARCHIVED],
      [ContentStatus.REJECTED]: [ContentStatus.DRAFT, ContentStatus.ARCHIVED],
      [ContentStatus.ARCHIVED]: [ContentStatus.DRAFT],
    };

    if (!validTransitions[current]?.includes(target)) {
      throw new BadRequestException(
        `Invalid status transition from ${current} to ${target}.`,
      );
    }

    // Separation of Duties check for APPROVE and PUBLISH
    if (
      target === ContentStatus.APPROVED ||
      target === ContentStatus.PUBLISHED
    ) {
      if (
        event.createdById === actor.id &&
        actor.role !== UserRole.SUPER_ADMINISTRATOR
      ) {
        throw new ForbiddenException(
          'Separation of duties: The event creator cannot approve or publish their own submission.',
        );
      }

      const approverRoles = [
        UserRole.MODERATOR,
        UserRole.ADMINISTRATOR,
        UserRole.SUPER_ADMINISTRATOR,
      ];
      if (!approverRoles.includes(actor.role as UserRole)) {
        throw new ForbiddenException(
          'Insufficient permissions to approve or publish liturgical events.',
        );
      }
    }

    const updated: EventDto = {
      ...event,
      status: target,
      approvedById:
        target === ContentStatus.APPROVED || target === ContentStatus.PUBLISHED
          ? actor.id
          : event.approvedById,
      updatedAt: new Date().toISOString(),
    };

    const idx = this.memoryEvents.findIndex((e) => e.id === id || e.slug === id);
    if (idx !== -1) {
      this.memoryEvents[idx] = updated;
    }

    const auditAction =
      target === ContentStatus.IN_REVIEW
        ? AuditAction.CONTENT_SUBMITTED
        : target === ContentStatus.APPROVED
        ? AuditAction.CONTENT_APPROVED
        : target === ContentStatus.REJECTED
        ? AuditAction.CONTENT_REJECTED
        : target === ContentStatus.PUBLISHED
        ? AuditAction.CONTENT_PUBLISHED
        : target === ContentStatus.ARCHIVED
        ? AuditAction.CONTENT_ARCHIVED
        : AuditAction.CONTENT_UPDATED;

    await this.auditService.record({
      actorId: actor.id,
      action: auditAction,
      entityType: 'Event',
      entityId: updated.id,
      metadata: {
        previousStatus: current,
        nextStatus: target,
        reason: dto.reason,
      },
    });

    return updated;
  }
}
