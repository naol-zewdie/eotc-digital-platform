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
  RightsStatus,
  AuditAction,
  MezmurDto,
  ArtistDto,
} from '@eotc/contracts';
import {
  CreateArtistInputDto,
  UpdateArtistInputDto,
  CreateMezmurInputDto,
  UpdateMezmurInputDto,
  TransitionMezmurDto,
} from './dto/mezmur.dto';

@Injectable()
export class MezmurService {
  private readonly logger = new Logger(MezmurService.name);

  // In-memory canonical Artists for dev/offline resilience
  private memoryArtists: ArtistDto[] = [
    {
      id: 'artist-mk-choir',
      slug: 'mahibere-kidusan-choir',
      nameAm: 'የማኅበረ ቅዱሳን መዘምራን',
      nameGez: 'መዘምራነ ማኅበረ ቅዱሳን',
      nameEn: 'Mahibere Kidusan Central Choir',
      bioAm: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ሥርዓተ ዜማን ጠብቀው የሚያገለግሉ መዘምራን።',
      bioEn: 'Spiritual youth choir preserving authentic Zema and orthodox hymnody.',
      isChoir: true,
      mezmurCount: 42,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'artist-dl-choir',
      slug: 'debre-libanos-choir',
      nameAm: 'የደብረ ሊባኖስ ገዳም መዘምራን',
      nameGez: 'መዘምራነ ደብረ ሊባኖስ',
      nameEn: 'Debre Libanos Monastic Choir',
      bioAm: 'በደብረ ሊባኖስ ገዳም ጥንታዊውን የቅዱስ ያሬድ ዜማ የሚያቀርቡ ገዳማውያን መዘምራን።',
      bioEn: 'Monastic choir presenting ancient St. Yared Diggua and sacred liturgical chants.',
      isChoir: true,
      mezmurCount: 18,
      createdAt: '2026-01-02T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    },
    {
      id: 'artist-kesis-ashenafi',
      slug: 'kesis-ashenafi',
      nameAm: 'ቀሲስ አሸናፊ ገብረ ማርያም',
      nameEn: 'Kesis Ashenafi Gebre Maryam',
      bioAm: 'ታዋቂ የኦርቶዶክስ ተዋሕዶ መዝሙር ደራሲና አዝማሪ።',
      bioEn: 'Prominent liturgical songwriter and traditional hymn vocalist.',
      isChoir: false,
      mezmurCount: 25,
      createdAt: '2026-01-03T00:00:00.000Z',
      updatedAt: '2026-01-03T00:00:00.000Z',
    },
  ];

  // In-memory canonical Mezmurs
  private memoryMezmurs: MezmurDto[] = [
    {
      id: 'mezmur-ne-na-01',
      slug: 'ne-na-maryam',
      status: ContentStatus.PUBLISHED,
      categoryId: 'cat-hymnody',
      artistId: 'artist-mk-choir',
      audioFileId: 'file-002',
      rightsId: 'rights-pub-001',
      churchId: 'patriarchate',
      createdById: 'user-admin-001',
      approvedById: 'user-reviewer-001',
      publishedAt: '2026-01-10T00:00:00.000Z',
      playCount: 1540,
      viewCount: 3820,
      createdAt: '2026-01-05T00:00:00.000Z',
      updatedAt: '2026-01-10T00:00:00.000Z',
      translations: [
        {
          id: 'trans-mz-ne-am',
          mezmurId: 'mezmur-ne-na-01',
          locale: 'am',
          title: 'ኔና ማርያም ኔና (ኦ ድንግል ኔና)',
          description: 'የፍልሰታ ጾም መዝሙር - የእመቤታችን ምልጃና አማላጅነት የሚዘመርበት።',
          lyrics: `ኔና ማርያም ኔና ኦ ድንግል ኔና
የምሕረት እናት የሕይወት ዛፍ ኔና።

በጨለማ ሳለን ብርሃን ያበራልን
ከአንቺ የተወለደው መድኃኔዓለም ነው።
የሰላም መገኛ የድኅነት በር አንቺ ነሽ
ከልጅሽ አስታርቂን በረከትን ስጪን።`,
        },
        {
          id: 'trans-mz-ne-gez',
          mezmurId: 'mezmur-ne-na-01',
          locale: 'gez',
          title: 'ንዒ ማርያም ንዒ ወላዲተ አምላክ',
          description: 'ስብሐት ወማኅሌት ዘዕርገታ ለማርያም።',
          lyrics: `ንዒ ማርያም ንዒ ወላዲተ አምላክ
ዕፀ ጳጦስ አንቲ ዘኢያውዓያ እሳት።`,
        },
        {
          id: 'trans-mz-ne-en',
          mezmurId: 'mezmur-ne-na-01',
          locale: 'en',
          title: 'Come O Virgin Mary (Mother of Mercy)',
          description: 'Traditional Fast of the Assumption hymn honoring the Theotokos.',
          lyrics: `Come, O Mary, come, O Virgin Mother,
Tree of Life and fountain of compassion.
Through Christ who shone light into darkness,
Guide us under the shelter of your prayers.`,
        },
      ],
      rights: {
        id: 'rights-pub-001',
        status: RightsStatus.PUBLIC_DOMAIN,
        rightsHolder: 'EOTC Patriarchate Tradition',
        downloadAllowed: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    },
    {
      id: 'mezmur-meskel-02',
      slug: 'meskel-berhanu',
      status: ContentStatus.PUBLISHED,
      categoryId: 'cat-hymnody',
      artistId: 'artist-dl-choir',
      audioFileId: 'file-002',
      rightsId: 'rights-ch-002',
      churchId: 'debre-libanos',
      createdById: 'user-admin-001',
      approvedById: 'user-reviewer-001',
      publishedAt: '2026-01-15T00:00:00.000Z',
      playCount: 980,
      viewCount: 2450,
      createdAt: '2026-01-12T00:00:00.000Z',
      updatedAt: '2026-01-15T00:00:00.000Z',
      translations: [
        {
          id: 'trans-mz-ms-am',
          mezmurId: 'mezmur-meskel-02',
          locale: 'am',
          title: 'መስቀል ብርሃኑ ለኩሉ ዓለም',
          description: 'የመስቀል በዓል ያሬዳዊ ዜማና ማኅሌት።',
          lyrics: `መስቀል ብርሃኑ ለኩሉ ዓለም
መሠረተ ቤተ ክርስቲያን መድኃኒተ ክርስቲያን።

መስቀል ኃይላችን ነው መስቀል ጽንዓችን
ድል የምንነሣበት የጠላት ማፈሪያችን።`,
        },
        {
          id: 'trans-mz-ms-gez',
          mezmurId: 'mezmur-meskel-02',
          locale: 'gez',
          title: 'መስቀል ብርሃን ለኵሉ ዓለም',
          description: 'ዜማ ዘቅዱስ ያሬድ ዘመስቀል ክብረ ቅዱሳን።',
          lyrics: `መስቀል ብርሃን ለኵሉ ዓለም
መሠረተ ቤተ ክርስቲያን ወመድኃኒቶሙ ለእለ የአምኑ ቦቱ።`,
        },
      ],
      rights: {
        id: 'rights-ch-002',
        status: RightsStatus.CHURCH_OWNED,
        rightsHolder: 'Debre Libanos Monastery',
        downloadAllowed: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  // 1. Artists CRUD
  async getArtists(): Promise<ArtistDto[]> {
    try {
      const dbArtists = await this.prisma.artist.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { mezmurs: true } } },
      });
      if (dbArtists && dbArtists.length > 0) {
        return dbArtists.map((a: any) => ({
          id: a.id,
          slug: a.id,
          nameAm: a.name,
          nameEn: a.name,
          bioAm: a.bio,
          bioEn: a.bio,
          isChoir: a.name?.toLowerCase().includes('choir') || a.name?.includes('መዘምራን') || false,
          mezmurCount: a._count?.mezmurs ?? 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable for getArtists: ${(err as Error).message}`);
    }
    return this.memoryArtists;
  }

  async findArtist(idOrSlug: string): Promise<ArtistDto> {
    try {
      const a: any = await this.prisma.artist.findFirst({
        where: { id: idOrSlug },
        include: { _count: { select: { mezmurs: true } } },
      });
      if (a) {
        return {
          id: a.id,
          slug: a.id,
          nameAm: a.name,
          nameEn: a.name,
          bioAm: a.bio,
          bioEn: a.bio,
          isChoir: a.name?.toLowerCase().includes('choir') || a.name?.includes('መዘምራን') || false,
          mezmurCount: a._count?.mezmurs ?? 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable for findArtist: ${(err as Error).message}`);
    }

    const mem = this.memoryArtists.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
    if (!mem) throw new NotFoundException(`Artist '${idOrSlug}' not found.`);
    return mem;
  }

  async createArtist(dto: CreateArtistInputDto, actorId?: string): Promise<ArtistDto> {
    try {
      const created = await this.prisma.artist.create({
        data: {
          name: dto.nameAm,
          bio: dto.bioAm,
        },
      });

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_CREATED,
        entityType: 'Artist',
        entityId: created.id,
        metadata: { name: created.name },
      });

      return {
        id: created.id,
        slug: dto.slug || created.id,
        nameAm: created.name,
        nameGez: dto.nameGez,
        nameEn: dto.nameEn,
        bioAm: created.bio,
        bioEn: dto.bioEn,
        isChoir: dto.isChoir ?? false,
        avatarMediaId: dto.avatarMediaId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (err) {
      this.logger.warn(`Prisma unavailable, saving artist in memory: ${(err as Error).message}`);
      const newArtist: ArtistDto = {
        id: `artist-${Date.now()}`,
        slug: dto.slug,
        nameAm: dto.nameAm,
        nameGez: dto.nameGez,
        nameEn: dto.nameEn,
        bioAm: dto.bioAm,
        bioEn: dto.bioEn,
        isChoir: dto.isChoir ?? false,
        avatarMediaId: dto.avatarMediaId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.memoryArtists.unshift(newArtist);
      return newArtist;
    }
  }

  // 2. Mezmur Hymns CRUD
  async findAll(options?: {
    status?: ContentStatus;
    artistId?: string;
    categoryId?: string;
    search?: string;
    isStaff?: boolean;
  }): Promise<MezmurDto[]> {
    const targetStatus = options?.isStaff ? options.status : ContentStatus.PUBLISHED;

    try {
      const where: any = {};
      if (targetStatus) where.status = targetStatus;
      if (options?.artistId) where.artistId = options.artistId;
      if (options?.categoryId) where.categoryId = options.categoryId;

      const dbMezmurs = await this.prisma.mezmur.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          translations: true,
          artist: true,
          rights: true,
          category: true,
        },
      });

      if (dbMezmurs && dbMezmurs.length > 0) {
        return dbMezmurs.map((m) => this.mapMezmurDto(m));
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable for findAll mezmur: ${(err as Error).message}`);
    }

    // In-memory filter
    return this.memoryMezmurs.filter((m) => {
      if (targetStatus && m.status !== targetStatus) return false;
      if (options?.artistId && m.artistId !== options.artistId) return false;
      if (options?.categoryId && m.categoryId !== options.categoryId) return false;
      if (options?.search) {
        const q = options.search.toLowerCase();
        const matchesSlug = m.slug.toLowerCase().includes(q);
        const matchesTitle = m.translations.some(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.lyrics?.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q),
        );
        if (!matchesSlug && !matchesTitle) return false;
      }
      return true;
    });
  }

  async findOne(idOrSlug: string): Promise<MezmurDto> {
    try {
      const m = await this.prisma.mezmur.findFirst({
        where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
        include: {
          translations: true,
          artist: true,
          rights: true,
          category: true,
        },
      });
      if (m) return this.mapMezmurDto(m);
    } catch (err) {
      this.logger.warn(`Prisma unavailable for findOne mezmur: ${(err as Error).message}`);
    }

    const found = this.memoryMezmurs.find((m) => m.id === idOrSlug || m.slug === idOrSlug);
    if (!found) throw new NotFoundException(`Mezmur '${idOrSlug}' not found.`);
    return found;
  }

  async create(dto: CreateMezmurInputDto, actorId?: string): Promise<MezmurDto> {
    if (!dto.translations || dto.translations.length === 0) {
      throw new BadRequestException('At least one translation with title is required.');
    }

    try {
      const created = await this.prisma.mezmur.create({
        data: {
          slug: dto.slug,
          categoryId: dto.categoryId,
          artistId: dto.artistId,
          rightsId: dto.rightsId,
          status: ContentStatus.DRAFT,
          externalAudioUrl: dto.audioFileId,
          translations: {
            create: dto.translations.map((t) => ({
              locale: t.locale,
              title: t.title,
              lyrics: t.lyrics || '',
              description: t.description,
            })),
          },
        },
        include: {
          translations: true,
          artist: true,
          rights: true,
          category: true,
        },
      });

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_CREATED,
        entityType: 'Mezmur',
        entityId: created.id,
        metadata: { slug: created.slug },
      });

      return this.mapMezmurDto(created);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, saving mezmur in memory: ${(err as Error).message}`);
      const newMezmur: MezmurDto = {
        id: `mezmur-${Date.now()}`,
        slug: dto.slug,
        status: ContentStatus.DRAFT,
        categoryId: dto.categoryId,
        artistId: dto.artistId,
        audioFileId: dto.audioFileId,
        rightsId: dto.rightsId,
        churchId: dto.churchId,
        createdById: actorId,
        playCount: 0,
        viewCount: 0,
        translations: dto.translations.map((t, idx) => ({
          id: `trans-mz-${Date.now()}-${idx}`,
          locale: t.locale,
          title: t.title,
          lyrics: t.lyrics,
          description: t.description,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.memoryMezmurs.unshift(newMezmur);

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_CREATED,
        entityType: 'Mezmur',
        entityId: newMezmur.id,
        metadata: { slug: newMezmur.slug },
      });

      return newMezmur;
    }
  }

  async update(id: string, dto: UpdateMezmurInputDto, actorId?: string): Promise<MezmurDto> {
    const existing = await this.findOne(id);

    try {
      const updated = await this.prisma.mezmur.update({
        where: { id: existing.id },
        data: {
          slug: dto.slug,
          categoryId: dto.categoryId,
          artistId: dto.artistId,
          rightsId: dto.rightsId,
          externalAudioUrl: dto.audioFileId,
        },
        include: {
          translations: true,
          artist: true,
          rights: true,
          category: true,
        },
      });

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_UPDATED,
        entityType: 'Mezmur',
        entityId: updated.id,
        metadata: { slug: updated.slug },
      });

      return this.mapMezmurDto(updated);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, updating mezmur in memory: ${(err as Error).message}`);
      const idx = this.memoryMezmurs.findIndex((m) => m.id === existing.id);
      if (idx !== -1) {
        this.memoryMezmurs[idx] = {
          ...this.memoryMezmurs[idx],
          slug: dto.slug ?? this.memoryMezmurs[idx].slug,
          categoryId: dto.categoryId ?? this.memoryMezmurs[idx].categoryId,
          artistId: dto.artistId ?? this.memoryMezmurs[idx].artistId,
          audioFileId: dto.audioFileId ?? this.memoryMezmurs[idx].audioFileId,
          rightsId: dto.rightsId ?? this.memoryMezmurs[idx].rightsId,
          updatedAt: new Date().toISOString(),
        };

        if (dto.translations && dto.translations.length > 0) {
          this.memoryMezmurs[idx].translations = dto.translations.map((t, i) => ({
            id: `trans-mz-${Date.now()}-${i}`,
            mezmurId: existing.id,
            locale: t.locale,
            title: t.title,
            lyrics: t.lyrics,
            description: t.description,
          }));
        }

        await this.auditService.record({
          actorId,
          action: AuditAction.CONTENT_UPDATED,
          entityType: 'Mezmur',
          entityId: existing.id,
          metadata: { slug: this.memoryMezmurs[idx].slug },
        });

        return this.memoryMezmurs[idx];
      }
      throw new NotFoundException(`Mezmur '${id}' not found.`);
    }
  }

  // 3. Status Transitions
  async transitionStatus(
    id: string,
    dto: TransitionMezmurDto,
    actor: { id?: string; role?: string },
  ): Promise<MezmurDto> {
    const mezmur = await this.findOne(id);
    const targetStatus = dto.targetStatus;

    if (mezmur.status === targetStatus) return mezmur;

    // Rule: Creator cannot approve their own submission (Section 3)
    if (
      targetStatus === ContentStatus.APPROVED &&
      mezmur.createdById &&
      actor.id &&
      mezmur.createdById === actor.id &&
      actor.role !== 'SUPER_ADMINISTRATOR'
    ) {
      throw new ForbiddenException(
        'Separation of duties violation: Creators are not permitted to approve their own hymn submissions.',
      );
    }

    // Rule: Rights Verification before publishing
    if (targetStatus === ContentStatus.PUBLISHED) {
      if (!mezmur.rightsId) {
        throw new BadRequestException(
          'Cannot publish Mezmur without an associated Rights & Provenance record.',
        );
      }
      if (mezmur.rights?.status === RightsStatus.UNKNOWN) {
        throw new BadRequestException(
          'Cannot publish Mezmur with UNKNOWN rights status. Legal provenance must be verified.',
        );
      }
    }

    const auditAction =
      targetStatus === ContentStatus.IN_REVIEW
        ? AuditAction.CONTENT_SUBMITTED
        : targetStatus === ContentStatus.APPROVED
        ? AuditAction.CONTENT_APPROVED
        : targetStatus === ContentStatus.REJECTED
        ? AuditAction.CONTENT_REJECTED
        : targetStatus === ContentStatus.PUBLISHED
        ? AuditAction.CONTENT_PUBLISHED
        : targetStatus === ContentStatus.ARCHIVED
        ? AuditAction.CONTENT_ARCHIVED
        : AuditAction.CONTENT_UPDATED;

    try {
      const updated = await this.prisma.mezmur.update({
        where: { id: mezmur.id },
        data: {
          status: targetStatus,
        },
        include: {
          translations: true,
          artist: true,
          rights: true,
          category: true,
        },
      });

      await this.auditService.record({
        actorId: actor.id,
        action: auditAction,
        entityType: 'Mezmur',
        entityId: updated.id,
        metadata: { fromStatus: mezmur.status, toStatus: targetStatus, comment: dto.comment },
      });

      return this.mapMezmurDto(updated);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, transitioning mezmur in memory: ${(err as Error).message}`);
      const idx = this.memoryMezmurs.findIndex((m) => m.id === mezmur.id);
      if (idx !== -1) {
        this.memoryMezmurs[idx] = {
          ...this.memoryMezmurs[idx],
          status: targetStatus,
          approvedById: targetStatus === ContentStatus.APPROVED ? actor.id : this.memoryMezmurs[idx].approvedById,
          publishedAt: targetStatus === ContentStatus.PUBLISHED ? new Date().toISOString() : this.memoryMezmurs[idx].publishedAt,
          updatedAt: new Date().toISOString(),
        };

        await this.auditService.record({
          actorId: actor.id,
          action: auditAction,
          entityType: 'Mezmur',
          entityId: mezmur.id,
          metadata: { fromStatus: mezmur.status, toStatus: targetStatus, comment: dto.comment },
        });

        return this.memoryMezmurs[idx];
      }
      throw new NotFoundException(`Mezmur '${id}' not found.`);
    }
  }

  private mapMezmurDto(m: any): MezmurDto {
    return {
      id: m.id,
      slug: m.slug,
      status: m.status as ContentStatus,
      categoryId: m.categoryId,
      artistId: m.artistId,
      audioFileId: m.externalAudioUrl || m.audioFileId,
      rightsId: m.rightsId,
      churchId: m.churchId,
      createdById: m.createdById,
      approvedById: m.approvedById,
      publishedAt: m.publishedAt instanceof Date ? m.publishedAt.toISOString() : m.publishedAt,
      playCount: m.playCount ?? 0,
      viewCount: m.viewCount ?? 0,
      createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
      updatedAt: m.updatedAt instanceof Date ? m.updatedAt.toISOString() : String(m.updatedAt),
      translations: Array.isArray(m.translations)
        ? m.translations.map((t: any) => ({
            id: t.id,
            mezmurId: t.mezmurId,
            locale: t.locale,
            title: t.title,
            lyrics: t.lyrics,
            description: t.description,
          }))
        : [],
      artist: m.artist
        ? {
            id: m.artist.id,
            slug: m.artist.slug || m.artist.id,
            nameAm: m.artist.name,
            nameGez: m.artist.nameGez,
            nameEn: m.artist.name,
            bioAm: m.artist.bio,
            bioEn: m.artist.bio,
            isChoir: m.artist.isChoir ?? false,
            avatarMediaId: m.artist.avatarMediaId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : undefined,
      rights: m.rights
        ? {
            id: m.rights.id,
            status: m.rights.status as RightsStatus,
            rightsHolder: m.rights.rightsHolder,
            source: m.rights.source,
            downloadAllowed: m.rights.downloadAllowed,
            createdAt: m.rights.createdAt instanceof Date ? m.rights.createdAt.toISOString() : String(m.rights.createdAt),
            updatedAt: m.rights.updatedAt instanceof Date ? m.rights.updatedAt.toISOString() : String(m.rights.updatedAt),
          }
        : undefined,
    };
  }
}
