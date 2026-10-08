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
  VerificationStatus,
  ContentStatus,
  AuditAction,
  ChurchDto,
  ChurchMembershipDto,
} from '@eotc/contracts';
import {
  CreateChurchInputDto,
  UpdateChurchInputDto,
  ClaimChurchInputDto,
  VerifyChurchInputDto,
} from './dto/church.dto';

@Injectable()
export class ChurchesService {
  private readonly logger = new Logger(ChurchesService.name);

  // In-memory canonical churches & monasteries for development & offline environments
  private memoryChurches: ChurchDto[] = [
    {
      id: 'church-axum-tsion',
      slug: 'axum-tsion',
      region: 'Tigray',
      city: 'Axum',
      diocese: 'Axum Central Diocese',
      isMonastery: true,
      coordinates: { lat: 14.1294, lng: 38.7186 },
      contacts: {
        phone: '+251-34-775-0100',
        email: 'axum.tsion@eotc-platform.org',
        website: 'https://eotc-patriarchate.org/axum',
        addressLine: 'Historic Axum Sanctuary, Tigray, Ethiopia',
      },
      verificationStatus: VerificationStatus.VERIFIED,
      status: ContentStatus.PUBLISHED,
      eventCount: 4,
      clergyCount: 45,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      translations: [
        {
          id: 'trans-axum-am',
          churchId: 'church-axum-tsion',
          locale: 'am',
          name: 'ርዕሰ አድባራት ቅድስተ ቅዱሳን ድንግል ማርያም ጽዮን',
          description: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ቀዳማይ መቅደስና የታቦተ ጽዮን ማደሪያ።',
          history: 'በ4ኛው መቶ ክፍለ ዘመን በአብርሃ ወአጽብሃ የተመሠረተች ጥንታዊትና ታሪካዊት ርዕሰ አድባራት።',
        },
        {
          id: 'trans-axum-gez',
          churchId: 'church-axum-tsion',
          locale: 'gez',
          name: 'ርእሰ አድባራት ቅድስተ ቅዱሳን ድንግል ማርያም ጽዮን',
          description: 'ማኅደረ ታቦተ ሕጉ ለእግዚአብሔር አምላከ እስራኤል።',
          history: 'ተሐንጸት በዘመነ አብርሃ ወአጽብሃ ነገሥታት በሀገረ አክሱም።',
        },
        {
          id: 'trans-axum-en',
          churchId: 'church-axum-tsion',
          locale: 'en',
          name: 'Axum Tsion Saint Mary of Zion Cathedral & Sanctuary',
          description: 'The holiest shrine of Ethiopian Orthodoxy, resting sanctuary of the Ark of the Covenant.',
          history: 'Founded in the 4th century under King Ezana (Abreha and Atsbeha), epicenter of Christian civilization.',
        },
      ],
      memberships: [],
    },
    {
      id: 'church-bete-giyorgis',
      slug: 'lalibela-bete-giyorgis',
      region: 'Amhara',
      city: 'Lalibela',
      diocese: 'Lasta & Lalibela Diocese',
      isMonastery: false,
      coordinates: { lat: 12.0319, lng: 39.0412 },
      contacts: {
        phone: '+251-33-336-0044',
        email: 'lalibela.clergy@eotc-platform.org',
        addressLine: 'Lalibela Monolithic Rock Churches, Wollo',
      },
      verificationStatus: VerificationStatus.VERIFIED,
      status: ContentStatus.PUBLISHED,
      eventCount: 3,
      clergyCount: 60,
      createdAt: '2026-01-02T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
      translations: [
        {
          id: 'trans-lali-am',
          churchId: 'church-bete-giyorgis',
          locale: 'am',
          name: 'ቤተ ጊዮርጊስ ውቅር አብያተ ክርስቲያናት (ላሊበላ)',
          description: 'ከአንድ ወጥ አለት የተፈለፈለው የመስቀል ቅርጽ ያለው ዓለም አቀፍ የቅርስ ሀብት።',
          history: 'በ12ኛው መቶ ክፍለ ዘመን በቅዱስ ላሊበላ የተመሠረተ ዳግማዊት ኢየሩሳሌም።',
        },
        {
          id: 'trans-lali-en',
          churchId: 'church-bete-giyorgis',
          locale: 'en',
          name: 'Church of Saint George (Bete Giyorgis, Lalibela)',
          description: 'Cruciform rock-hewn monolithic church carved out of volcanic tuff in the 12th century.',
          history: 'Commissioned by Saint King Lalibela following heavenly revelations as New Jerusalem.',
        },
      ],
      memberships: [],
    },
    {
      id: 'church-debre-libanos',
      slug: 'debre-libanos',
      region: 'Oromia',
      city: 'Shewa',
      diocese: 'North Shewa Monastic Diocese',
      isMonastery: true,
      coordinates: { lat: 9.7181, lng: 38.8524 },
      contacts: {
        phone: '+251-11-134-2200',
        email: 'debrelibanos@eotc-platform.org',
        addressLine: 'Debre Libanos Gorge, Shewa, Oromia',
      },
      verificationStatus: VerificationStatus.VERIFIED,
      status: ContentStatus.PUBLISHED,
      eventCount: 6,
      clergyCount: 120,
      createdAt: '2026-01-03T00:00:00.000Z',
      updatedAt: '2026-01-03T00:00:00.000Z',
      translations: [
        {
          id: 'trans-dl-am',
          churchId: 'church-debre-libanos',
          locale: 'am',
          name: 'ደብረ ሊባኖስ ገዳም (ጻድቁ አቡነ ተክለ ሃይማኖት)',
          description: 'የኢትዮጵያ ገዳማት እጨጌ መቀመጫ እና ታላቁ የትምህርትና የመንፈሳዊነት ማዕከል።',
          history: 'በ13ኛው መቶ ክፍለ ዘመን በጻድቁ አቡነ ተክለ ሃይማኖት የተመሠረተ ታላቅ ገዳም።',
        },
        {
          id: 'trans-dl-gez',
          churchId: 'church-debre-libanos',
          locale: 'gez',
          name: 'ደብረ ሊባኖስ ገዳም ዘአቡነ ተክለ ሃይማኖት ጻድቅ',
          description: 'መንበረ እጨጌ ዘኩሎሙ ገዳማተ ኢትዮጵያ።',
          history: 'ተሐንጸ በዘመነ ጻድቅ አቡነ ተክለ ሃይማኖት በደብረ አስቦ።',
        },
        {
          id: 'trans-dl-en',
          churchId: 'church-debre-libanos',
          locale: 'en',
          name: 'Debre Libanos Monastery of Saint Tekle Haymanot',
          description: 'Eminent monastic center founded in the 13th century, seat of the Echege of Ethiopia.',
          history: 'Established in 1284 by Abuna Tekle Haymanot in the sheer cliffs of Shewa gorge.',
        },
      ],
      memberships: [
        {
          id: 'mem-dl-001',
          userId: 'user-rep-001',
          userEmail: 'rep.debrelibanos@eotc-platform.org',
          userName: 'Debre Libanos Representative',
          churchId: 'church-debre-libanos',
          churchSlug: 'debre-libanos',
          role: 'CHURCH_REPRESENTATIVE',
          status: 'ACTIVE',
          verifiedAt: '2026-01-05T00:00:00.000Z',
          createdAt: '2026-01-04T00:00:00.000Z',
        },
      ],
    },
    {
      id: 'church-holy-trinity',
      slug: 'holy-trinity-cathedral',
      region: 'Addis Ababa',
      city: 'Addis Ababa',
      diocese: 'Addis Ababa Patriarchal Diocese',
      isMonastery: false,
      coordinates: { lat: 9.0306, lng: 38.7656 },
      contacts: {
        phone: '+251-11-123-4567',
        email: 'trinity@eotc-patriarchate.org',
        website: 'https://trinitycathedral-addis.org',
        addressLine: 'Arat Kilo, Addis Ababa, Ethiopia',
      },
      verificationStatus: VerificationStatus.VERIFIED,
      status: ContentStatus.PUBLISHED,
      eventCount: 5,
      clergyCount: 80,
      createdAt: '2026-01-04T00:00:00.000Z',
      updatedAt: '2026-01-04T00:00:00.000Z',
      translations: [
        {
          id: 'trans-ht-am',
          churchId: 'church-holy-trinity',
          locale: 'am',
          name: 'መንበረ ጸባዖት ቅድስት ሥላሴ ካቴድራል',
          description: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ዋና ካቴድራል እና ብሔራዊ የመታሰቢያ ማዕከል።',
          history: 'በ1936 ዓ.ም የተመረቀች የመንፈሳዊ አገልግሎትና የነጻነት አርበኞች መካነ መቃብር።',
        },
        {
          id: 'trans-ht-en',
          churchId: 'church-holy-trinity',
          locale: 'en',
          name: 'Holy Trinity Cathedral (Menbere Tsebaot)',
          description: 'Highest ranking cathedral in Addis Ababa, seat of grand liturgical celebrations.',
          history: 'Consecrated to commemorate the liberation of Ethiopia from fascist occupation.',
        },
      ],
      memberships: [],
    },
    {
      id: 'church-saint-mary-dc',
      slug: 'saint-mary-dc',
      region: 'Diaspora - North America',
      city: 'Washington, DC',
      diocese: 'North America Archdiocese',
      isMonastery: false,
      coordinates: { lat: 38.9072, lng: -77.0369 },
      contacts: {
        phone: '+1-202-555-0199',
        email: 'info@stmarydc.org',
        website: 'https://stmarydc.org',
        addressLine: '1234 16th Street NW, Washington, DC, USA',
      },
      verificationStatus: VerificationStatus.VERIFIED,
      status: ContentStatus.PUBLISHED,
      eventCount: 2,
      clergyCount: 15,
      createdAt: '2026-01-05T00:00:00.000Z',
      updatedAt: '2026-01-05T00:00:00.000Z',
      translations: [
        {
          id: 'trans-dc-am',
          churchId: 'church-saint-mary-dc',
          locale: 'am',
          name: 'ደብረ ምሕረት ቅድስት ማርያም ቤተክርስቲያን (ዋሽንግተን ዲሲ)',
          description: 'በሰሜን አሜሪካ ለሚገኙ ምእመናን መንፈሳዊ አገልግሎት የምትሰጥ ታላቅ ደብር።',
          history: 'በዲያስፖራ የሚገኙ ምእመናንን ለማስተባበርና ሃይማኖትን ለማስጠበቅ የተመሠረተች።',
        },
        {
          id: 'trans-dc-en',
          churchId: 'church-saint-mary-dc',
          locale: 'en',
          name: 'Debre Mehret Saint Mary EOTC (Washington, DC)',
          description: 'Parish church serving the Ethiopian Orthodox community in the US Capital.',
          history: 'Formed to nurture spiritual heritage and liturgy across generations in the diaspora.',
        },
      ],
      memberships: [],
    },
    {
      id: 'church-pending-entoto',
      slug: 'entoto-raguel',
      region: 'Addis Ababa',
      city: 'Entoto',
      diocese: 'Addis Ababa Diocese',
      isMonastery: false,
      coordinates: { lat: 9.0792, lng: 38.7617 },
      contacts: {
        phone: '+251-11-155-9000',
        email: 'raguel.entoto@eotc-platform.org',
      },
      verificationStatus: VerificationStatus.PENDING_REVIEW,
      status: ContentStatus.IN_REVIEW,
      eventCount: 1,
      clergyCount: 20,
      createdAt: '2026-02-01T00:00:00.000Z',
      updatedAt: '2026-02-01T00:00:00.000Z',
      translations: [
        {
          id: 'trans-rag-am',
          churchId: 'church-pending-entoto',
          locale: 'am',
          name: 'እንጦጦ መንበረ ፀሐይ ቅዱስ ራጉኤል ቤተክርስቲያን',
          description: 'በዳግማዊ ምኒልክ የተመሠረተች ታሪካዊትና ባለ ውብ የድንጋይ ግንብ ቤተክርስቲያን።',
        },
        {
          id: 'trans-rag-en',
          churchId: 'church-pending-entoto',
          locale: 'en',
          name: 'Entoto Menbere Tsehay Saint Raguel Church',
          description: 'Historic octagonal church on Mount Entoto overlooking Addis Ababa.',
        },
      ],
      memberships: [
        {
          id: 'mem-rag-002',
          userId: 'user-claimant-001',
          userEmail: 'deacon.tadesse@entoto-church.org',
          userName: 'Deacon Tadesse (Entoto Parish Secretary)',
          churchId: 'church-pending-entoto',
          churchSlug: 'entoto-raguel',
          role: 'CHURCH_REPRESENTATIVE',
          status: 'PENDING',
          createdAt: '2026-02-01T00:00:00.000Z',
        },
      ],
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  // 1. Find all churches with filters
  async findAll(options?: {
    region?: string;
    city?: string;
    diocese?: string;
    verificationStatus?: VerificationStatus;
    search?: string;
    isStaff?: boolean;
  }): Promise<ChurchDto[]> {
    try {
      const where: any = {};
      if (options?.region) where.region = options.region;
      if (options?.city) where.city = options.city;
      if (options?.verificationStatus) {
        where.verificationStatus = options.verificationStatus;
      } else if (!options?.isStaff) {
        where.verificationStatus = VerificationStatus.VERIFIED;
      }

      const dbChurches = await this.prisma.church.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          translations: true,
          memberships: {
            include: {
              user: {
                select: { email: true, displayName: true },
              },
            },
          },
        },
      });

      if (dbChurches && dbChurches.length > 0) {
        return dbChurches.map((c) => this.mapChurchDto(c));
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable for churches findAll: ${(err as Error).message}`);
    }

    // In-memory filter fallback
    return this.memoryChurches.filter((c) => {
      if (options?.verificationStatus && c.verificationStatus !== options.verificationStatus) {
        return false;
      }
      if (!options?.isStaff && !options?.verificationStatus && c.verificationStatus !== VerificationStatus.VERIFIED) {
        return false;
      }
      if (options?.region && options.region !== 'ALL' && c.region !== options.region) {
        return false;
      }
      if (options?.search) {
        const q = options.search.toLowerCase();
        const matchesSlug = c.slug.toLowerCase().includes(q);
        const matchesName = c.translations.some(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q),
        );
        const matchesLocation =
          c.city?.toLowerCase().includes(q) || c.region?.toLowerCase().includes(q);
        if (!matchesSlug && !matchesName && !matchesLocation) return false;
      }
      return true;
    });
  }

  // 2. Find one church by ID or Slug
  async findOne(idOrSlug: string): Promise<ChurchDto> {
    try {
      const church = await this.prisma.church.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
        include: {
          translations: true,
          memberships: {
            include: {
              user: { select: { email: true, displayName: true } },
            },
          },
        },
      });

      if (church) {
        return this.mapChurchDto(church);
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable for church findOne: ${(err as Error).message}`);
    }

    const found = this.memoryChurches.find(
      (c) => c.id === idOrSlug || c.slug === idOrSlug,
    );
    if (!found) {
      throw new NotFoundException(`Church '${idOrSlug}' not found.`);
    }

    return found;
  }

  // 3. Create Church (Registered user submission or staff)
  async create(dto: CreateChurchInputDto, actorId?: string): Promise<ChurchDto> {
    if (!dto.translations || dto.translations.length === 0) {
      throw new BadRequestException('At least one translation is required.');
    }

    try {
      const created = await this.prisma.church.create({
        data: {
          slug: dto.slug,
          region: dto.region,
          city: dto.city,
          coordinates: dto.coordinates as any,
          contacts: dto.contacts as any,
          verificationStatus: VerificationStatus.PENDING_REVIEW,
          status: ContentStatus.DRAFT,
          translations: {
            create: dto.translations.map((t) => ({
              locale: t.locale,
              name: t.name,
              description: t.description,
              history: t.history,
            })),
          },
        },
        include: {
          translations: true,
          memberships: true,
        },
      });

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_CREATED,
        entityType: 'Church',
        entityId: created.id,
        metadata: { slug: created.slug, region: created.region },
      });

      return this.mapChurchDto(created);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, creating church in memory: ${(err as Error).message}`);
      const newChurch: ChurchDto = {
        id: `church-${Date.now()}`,
        slug: dto.slug,
        region: dto.region,
        city: dto.city,
        diocese: dto.diocese,
        isMonastery: dto.isMonastery ?? false,
        coordinates: dto.coordinates,
        contacts: dto.contacts,
        verificationStatus: VerificationStatus.PENDING_REVIEW,
        status: ContentStatus.DRAFT,
        translations: dto.translations.map((t, idx) => ({
          id: `trans-c-${Date.now()}-${idx}`,
          locale: t.locale,
          name: t.name,
          description: t.description,
          history: t.history,
        })),
        memberships: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.memoryChurches.unshift(newChurch);

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_CREATED,
        entityType: 'Church',
        entityId: newChurch.id,
        metadata: { slug: newChurch.slug, region: newChurch.region },
      });

      return newChurch;
    }
  }

  // 4. Update Church (Scoped to Super Admin or assigned Church Representative)
  async update(
    id: string,
    dto: UpdateChurchInputDto,
    actor: { id?: string; role?: string; churchMemberships?: Array<{ churchSlug: string; status: string }> },
  ): Promise<ChurchDto> {
    const existing = await this.findOne(id);

    // Church Scope Guard validation (Section 3)
    if (actor.role === 'CHURCH_REPRESENTATIVE') {
      const activeMember = actor.churchMemberships?.some(
        (m) => (m.churchSlug === existing.slug || m.churchSlug === existing.id) && m.status === 'ACTIVE',
      );
      if (!activeMember) {
        throw new ForbiddenException(
          `Unauthorized: Church Representative is not assigned to manage '${existing.slug}'.`,
        );
      }
    }

    try {
      const updated = await this.prisma.church.update({
        where: { id: existing.id },
        data: {
          slug: dto.slug,
          region: dto.region,
          city: dto.city,
          coordinates: dto.coordinates as any,
          contacts: dto.contacts as any,
        },
        include: {
          translations: true,
          memberships: true,
        },
      });

      await this.auditService.record({
        actorId: actor.id,
        action: AuditAction.CONTENT_UPDATED,
        entityType: 'Church',
        entityId: updated.id,
        metadata: { slug: updated.slug },
      });

      return this.mapChurchDto(updated);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, updating church in memory: ${(err as Error).message}`);
      const idx = this.memoryChurches.findIndex((c) => c.id === existing.id);
      if (idx !== -1) {
        this.memoryChurches[idx] = {
          ...this.memoryChurches[idx],
          slug: dto.slug ?? this.memoryChurches[idx].slug,
          region: dto.region ?? this.memoryChurches[idx].region,
          city: dto.city ?? this.memoryChurches[idx].city,
          diocese: dto.diocese ?? this.memoryChurches[idx].diocese,
          coordinates: dto.coordinates ?? this.memoryChurches[idx].coordinates,
          contacts: dto.contacts ?? this.memoryChurches[idx].contacts,
          updatedAt: new Date().toISOString(),
        };

        if (dto.translations && dto.translations.length > 0) {
          this.memoryChurches[idx].translations = dto.translations.map((t, i) => ({
            id: `trans-c-${Date.now()}-${i}`,
            churchId: existing.id,
            locale: t.locale,
            name: t.name,
            description: t.description,
            history: t.history,
          }));
        }

        await this.auditService.record({
          actorId: actor.id,
          action: AuditAction.CONTENT_UPDATED,
          entityType: 'Church',
          entityId: existing.id,
          metadata: { slug: this.memoryChurches[idx].slug },
        });

        return this.memoryChurches[idx];
      }
      throw new NotFoundException(`Church '${id}' not found.`);
    }
  }

  // 5. Submit Church Claim (Claim administration of an existing church)
  async claimChurch(
    id: string,
    dto: ClaimChurchInputDto,
    user: { id: string; email?: string; displayName?: string },
  ): Promise<{ status: string; message: string }> {
    const church = await this.findOne(id);

    try {
      // Check existing membership
      const existing = await this.prisma.churchMembership.findUnique({
        where: {
          userId_churchId: {
            userId: user.id,
            churchId: church.id,
          },
        },
      });

      if (existing && existing.status === 'ACTIVE') {
        return {
          status: 'ACTIVE',
          message: 'You are already an active verified representative of this church.',
        };
      }

      // Upsert membership in PENDING status
      await this.prisma.churchMembership.upsert({
        where: {
          userId_churchId: {
            userId: user.id,
            churchId: church.id,
          },
        },
        create: {
          userId: user.id,
          churchId: church.id,
          status: 'PENDING',
        },
        update: {
          status: 'PENDING',
        },
      });

      // Update church to PENDING_REVIEW if unverified
      if (church.verificationStatus === VerificationStatus.UNVERIFIED) {
        await this.prisma.church.update({
          where: { id: church.id },
          data: { verificationStatus: VerificationStatus.PENDING_REVIEW },
        });
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable, saving claim in memory: ${(err as Error).message}`);
      const idx = this.memoryChurches.findIndex((c) => c.id === church.id);
      if (idx !== -1) {
        if (!this.memoryChurches[idx].memberships) {
          this.memoryChurches[idx].memberships = [];
        }
        const existingMem = this.memoryChurches[idx].memberships?.find((m) => m.userId === user.id);
        if (existingMem) {
          existingMem.status = 'PENDING';
        } else {
          this.memoryChurches[idx].memberships?.push({
            id: `mem-${Date.now()}`,
            userId: user.id,
            userEmail: user.email,
            userName: user.displayName || 'Claimant User',
            churchId: church.id,
            churchSlug: church.slug,
            role: 'CHURCH_REPRESENTATIVE',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
          });
        }
        if (this.memoryChurches[idx].verificationStatus === VerificationStatus.UNVERIFIED) {
          this.memoryChurches[idx].verificationStatus = VerificationStatus.PENDING_REVIEW;
        }
      }
    }

    await this.auditService.record({
      actorId: user.id,
      action: AuditAction.CHURCH_SCOPE_ASSIGNED,
      entityType: 'Church',
      entityId: church.id,
      metadata: {
        evidenceNotes: dto.evidenceNotes,
        claimantPhone: dto.claimantPhone,
        status: 'PENDING',
      },
    });

    return {
      status: 'PENDING_REVIEW',
      message: 'Church claim submitted successfully. Ecclesiastical review pending.',
    };
  }

  // 6. Verify Church & Claims (Admin or Moderator Review)
  async verifyChurch(
    id: string,
    dto: VerifyChurchInputDto,
    adminUser: { id: string },
  ): Promise<ChurchDto> {
    const church = await this.findOne(id);
    const newStatus =
      dto.decision === 'APPROVE' ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED;
    const contentStatus =
      dto.decision === 'APPROVE' ? ContentStatus.PUBLISHED : ContentStatus.DRAFT;
    const membershipStatus = dto.decision === 'APPROVE' ? 'ACTIVE' : 'REJECTED';

    try {
      const updated = await this.prisma.church.update({
        where: { id: church.id },
        data: {
          verificationStatus: newStatus,
          status: contentStatus,
        },
        include: {
          translations: true,
          memberships: true,
        },
      });

      // Update pending memberships
      await this.prisma.churchMembership.updateMany({
        where: {
          churchId: church.id,
          status: 'PENDING',
        },
        data: {
          status: membershipStatus,
          verifiedBy: adminUser.id,
          verifiedAt: new Date(),
        },
      });

      await this.auditService.record({
        actorId: adminUser.id,
        action: AuditAction.CHURCH_SCOPE_VERIFIED,
        entityType: 'Church',
        entityId: church.id,
        metadata: {
          decision: dto.decision,
          newStatus,
          notes: dto.notes,
        },
      });

      return this.mapChurchDto(updated);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, verifying church in memory: ${(err as Error).message}`);
      const idx = this.memoryChurches.findIndex((c) => c.id === church.id);
      if (idx !== -1) {
        this.memoryChurches[idx] = {
          ...this.memoryChurches[idx],
          verificationStatus: newStatus,
          status: contentStatus,
          updatedAt: new Date().toISOString(),
        };

        if (this.memoryChurches[idx].memberships) {
          this.memoryChurches[idx].memberships = this.memoryChurches[idx].memberships!.map((m) => {
            if (m.status === 'PENDING') {
              return {
                ...m,
                status: membershipStatus,
                verifiedBy: adminUser.id,
                verifiedAt: new Date().toISOString(),
              };
            }
            return m;
          });
        }

        await this.auditService.record({
          actorId: adminUser.id,
          action: AuditAction.CHURCH_SCOPE_VERIFIED,
          entityType: 'Church',
          entityId: church.id,
          metadata: {
            decision: dto.decision,
            newStatus,
            notes: dto.notes,
          },
        });

        return this.memoryChurches[idx];
      }
      throw new NotFoundException(`Church '${id}' not found.`);
    }
  }

  private mapChurchDto(c: any): ChurchDto {
    return {
      id: c.id,
      slug: c.slug,
      region: c.region,
      city: c.city,
      coordinates: c.coordinates,
      contacts: c.contacts,
      verificationStatus: c.verificationStatus as VerificationStatus,
      status: c.status as ContentStatus,
      createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
      updatedAt: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : String(c.updatedAt),
      translations: Array.isArray(c.translations)
        ? c.translations.map((t: any) => ({
            id: t.id,
            churchId: t.churchId,
            locale: t.locale,
            name: t.name,
            description: t.description,
            history: t.history,
          }))
        : [],
      memberships: Array.isArray(c.memberships)
        ? c.memberships.map((m: any) => ({
            id: m.id,
            userId: m.userId,
            userEmail: m.user?.email,
            userName: m.user?.displayName,
            churchId: m.churchId,
            role: m.role,
            status: m.status,
            verifiedBy: m.verifiedBy,
            verifiedAt: m.verifiedAt instanceof Date ? m.verifiedAt.toISOString() : m.verifiedAt,
            createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
          }))
        : [],
    };
  }
}
