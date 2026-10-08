import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../common/storage/storage.service';
import { AuditService } from '../audit/audit.service';
import { UploadedFile } from '../../common/storage/file-validation';
import {
  MediaDto,
  AuditAction,
  RightsStatus,
  ContentStatus,
  UserRole,
  MediaGalleryDto,
  CreateMediaGalleryDto,
  UpdateMediaGalleryDto,
  GalleryTransitionDto,
} from '@eotc/contracts';

export interface CreateMediaParams {
  file: UploadedFile;
  uploaderId?: string;
  type?: string;
  altText?: string;
  rightsId?: string;
  churchId?: string;
  articleId?: string;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private memoryMedia: MediaDto[] = [
    {
      id: 'med-001',
      objectKey: 'manuscripts/axum-tsion-f12.webp',
      type: 'IMAGE',
      altText: 'Axum Tsion Ancient Manuscript Folio 12',
      bytes: 2450000,
      rightsId: 'rights-pub-001',
      churchId: 'axum-tsion',
      createdAt: new Date().toISOString(),
      url: '/api/v1/storage/file/manuscripts/axum-tsion-f12.webp',
      rights: {
        status: RightsStatus.PUBLIC_DOMAIN,
        rightsHolder: 'EOTC Patriarchate Tradition',
        downloadAllowed: true,
      },
    },
    {
      id: 'med-002',
      objectKey: 'mezmur/yared-diggua-meskel.mp3',
      type: 'AUDIO',
      altText: "Saint Yared Diggua - Zema Notation Audio (Ge'ez)",
      bytes: 14200000,
      rightsId: 'rights-ch-002',
      churchId: 'debre-libanos',
      createdAt: new Date().toISOString(),
      url: '/api/v1/storage/file/mezmur/yared-diggua-meskel.mp3',
      rights: {
        status: RightsStatus.CHURCH_OWNED,
        rightsHolder: 'Debre Libanos Monastery',
        downloadAllowed: false,
      },
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly auditService: AuditService,
  ) {}

  async create(params: CreateMediaParams): Promise<MediaDto> {
    // 1. Upload binary through storage pipeline
    const storedFile = await this.storageService.upload(params.file, params.uploaderId);

    // 2. Persist Media record linked to rights/provenance & church
    try {
      const media = await this.prisma.media.create({
        data: {
          objectKey: storedFile.objectKey,
          type: params.type || storedFile.mimeType,
          altText: params.altText,
          bytes: storedFile.bytes,
          rightsId: params.rightsId,
          churchId: params.churchId,
          articleId: params.articleId,
        },
        include: {
          rights: true,
        },
      });

      await this.auditService.record({
        actorId: params.uploaderId,
        action: AuditAction.CONTENT_CREATED,
        entityType: 'Media',
        entityId: media.id,
        metadata: {
          objectKey: media.objectKey,
          bytes: media.bytes,
          rightsId: media.rightsId,
          churchId: media.churchId,
        },
      });

      return {
        id: media.id,
        objectKey: media.objectKey,
        type: media.type,
        altText: media.altText,
        bytes: media.bytes,
        rightsId: media.rightsId,
        churchId: media.churchId,
        articleId: media.articleId,
        createdAt: media.createdAt.toISOString(),
        url: this.storageService.getAccessUrl(media.objectKey),
        rights: media.rights
          ? {
              status: media.rights.status,
              rightsHolder: media.rights.rightsHolder,
              downloadAllowed: media.rights.downloadAllowed,
            }
          : undefined,
      };
    } catch (err) {
      this.logger.warn(`Prisma unavailable, using in-memory store for media: ${(err as Error).message}`);
      const newMedia: MediaDto = {
        id: `med-${Date.now()}`,
        objectKey: storedFile.objectKey,
        type: params.type || storedFile.mimeType,
        altText: params.altText,
        bytes: storedFile.bytes,
        rightsId: params.rightsId,
        churchId: params.churchId,
        articleId: params.articleId,
        createdAt: new Date().toISOString(),
        url: this.storageService.getAccessUrl(storedFile.objectKey),
      };
      this.memoryMedia.unshift(newMedia);
      return newMedia;
    }
  }

  async findAll(churchId?: string): Promise<MediaDto[]> {
    try {
      const items = await this.prisma.media.findMany({
        where: churchId ? { churchId } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { rights: true },
      });

      if (items && items.length > 0) {
        return items.map((m) => ({
          id: m.id,
          objectKey: m.objectKey,
          type: m.type,
          altText: m.altText,
          bytes: m.bytes,
          rightsId: m.rightsId,
          churchId: m.churchId,
          articleId: m.articleId,
          createdAt: m.createdAt.toISOString(),
          url: this.storageService.getAccessUrl(m.objectKey),
          rights: m.rights
            ? {
                status: m.rights.status,
                rightsHolder: m.rights.rightsHolder,
                downloadAllowed: m.rights.downloadAllowed,
              }
            : undefined,
        }));
      }
      return churchId ? this.memoryMedia.filter((m) => m.churchId === churchId) : this.memoryMedia;
    } catch (err) {
      this.logger.warn(`Prisma unavailable, returning in-memory media: ${(err as Error).message}`);
      return churchId ? this.memoryMedia.filter((m) => m.churchId === churchId) : this.memoryMedia;
    }
  }

  async findOne(id: string): Promise<MediaDto> {
    try {
      const media = await this.prisma.media.findUnique({
        where: { id },
        include: { rights: true },
      });

      if (media) {
        return {
          id: media.id,
          objectKey: media.objectKey,
          type: media.type,
          altText: media.altText,
          bytes: media.bytes,
          rightsId: media.rightsId,
          churchId: media.churchId,
          articleId: media.articleId,
          createdAt: media.createdAt.toISOString(),
          url: this.storageService.getAccessUrl(media.objectKey),
          rights: media.rights
            ? {
                status: media.rights.status,
                rightsHolder: media.rights.rightsHolder,
                downloadAllowed: media.rights.downloadAllowed,
              }
            : undefined,
        };
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable, checking in-memory media: ${(err as Error).message}`);
    }

    const mem = this.memoryMedia.find((m) => m.id === id);
    if (!mem) {
      throw new NotFoundException(`Media record '${id}' not found.`);
    }
    return mem;
  }

  // In-memory canonical media galleries
  private memoryGalleries: MediaGalleryDto[] = [
    {
      id: 'gal-axum-01',
      slug: 'axum-tsion-ancient-manuscripts',
      churchId: 'axum-tsion',
      churchName: 'Axum Tsion Maryam Sanctuary',
      title: 'ጥንታውያን የብራና መጻሕፍትና ሥርዓተ ንዋያተ ቅድሳት - አክሱም ጽዮን',
      description: 'በአክሱም ጽዮን ማርያም ካቴድራል የሚገኙ የብራና መጻሕፍት፣ ቅዱሳት ሥዕላትና ታሪካዊ ንዋያተ ቅድሳት ስብስብ።',
      coverMediaUrl: '/api/v1/storage/file/manuscripts/axum-tsion-f12.webp',
      status: ContentStatus.PUBLISHED,
      itemCount: 2,
      createdById: 'user-admin-001',
      createdAt: '2026-01-12T00:00:00.000Z',
      updatedAt: '2026-01-15T00:00:00.000Z',
      items: [
        {
          id: 'item-01',
          galleryId: 'gal-axum-01',
          mediaId: 'med-001',
          mediaUrl: '/api/v1/storage/file/manuscripts/axum-tsion-f12.webp',
          caption: 'የአክሱም ጽዮን ጥንታዊ የወንጌል ብራና ዐምደ ጽሕፈት (4ኛው መቶ ክፍለ ዘመን)',
          rightsId: 'rights-pub-001',
          rightsStatus: RightsStatus.PUBLIC_DOMAIN,
          rightsHolder: 'EOTC Patriarchate Tradition',
          downloadAllowed: true,
          orderIndex: 1,
        },
        {
          id: 'item-02',
          galleryId: 'gal-axum-01',
          mediaId: 'med-002',
          mediaUrl: '/api/v1/storage/file/mezmur/yared-diggua-meskel.mp3',
          caption: 'የቅዱስ ያሬድ ድጓ ዜማ ማኅሌት የመስቀል ዜማ ቅጂ',
          rightsId: 'rights-ch-002',
          rightsStatus: RightsStatus.CHURCH_OWNED,
          rightsHolder: 'Debre Libanos Monastery',
          downloadAllowed: false,
          orderIndex: 2,
        },
      ],
    },
    {
      id: 'gal-lalibela-02',
      slug: 'lalibela-rock-hewn-treasury',
      churchId: 'lalibela',
      churchName: 'Rock-Hewn Churches of Lalibela',
      title: 'የላሊበላ ውቅር አብያተ ክርስቲያናት ሥነ ሕንጻና ቅዱሳት ቅርሶች',
      description: 'የቅዱስ ላሊበላ ድንቅ የድንጋይ ውቅር አብያተ ክርስቲያናት፣ መስቀሎችና ሥነ ሥዕል ምስሎች።',
      coverMediaUrl: '/api/v1/storage/file/manuscripts/axum-tsion-f12.webp',
      status: ContentStatus.PUBLISHED,
      itemCount: 1,
      createdById: 'user-admin-001',
      createdAt: '2026-01-20T00:00:00.000Z',
      updatedAt: '2026-01-22T00:00:00.000Z',
      items: [
        {
          id: 'item-03',
          galleryId: 'gal-lalibela-02',
          mediaId: 'med-001',
          mediaUrl: '/api/v1/storage/file/manuscripts/axum-tsion-f12.webp',
          caption: 'የቤተ ጊዮርጊስ የመስቀል ቅርጽ ውቅር ሥነ ሕንጻ',
          rightsId: 'rights-pub-001',
          rightsStatus: RightsStatus.PUBLIC_DOMAIN,
          rightsHolder: 'Lalibela Clergy Council',
          downloadAllowed: true,
          orderIndex: 1,
        },
      ],
    },
  ];

  async findGalleries(options?: {
    churchId?: string;
    status?: ContentStatus;
    isStaff?: boolean;
  }): Promise<MediaGalleryDto[]> {
    let list = [...this.memoryGalleries];
    if (options?.churchId) {
      list = list.filter((g) => g.churchId === options.churchId);
    }
    if (options?.status) {
      list = list.filter((g) => g.status === options.status);
    } else if (!options?.isStaff) {
      list = list.filter((g) => g.status === ContentStatus.PUBLISHED);
    }
    return list;
  }

  async findGallery(idOrSlug: string, isStaff: boolean = false): Promise<MediaGalleryDto> {
    const gal = this.memoryGalleries.find((g) => g.id === idOrSlug || g.slug === idOrSlug);
    if (!gal) {
      throw new NotFoundException(`Media gallery '${idOrSlug}' not found.`);
    }
    if (!isStaff && gal.status !== ContentStatus.PUBLISHED) {
      throw new NotFoundException(`Media gallery '${idOrSlug}' is not published.`);
    }
    return gal;
  }

  async createGallery(
    dto: CreateMediaGalleryDto,
    actor: { id: string; role: string; churchId?: string },
  ): Promise<MediaGalleryDto> {
    if (actor.role === UserRole.CHURCH_REPRESENTATIVE) {
      if (!dto.churchId || dto.churchId !== actor.churchId) {
        throw new ForbiddenException(
          'Church Representatives may only create galleries for their assigned church parish.',
        );
      }
    }

    const slug =
      dto.slug ||
      dto.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-') + `-${Date.now()}`;

    const items = (dto.items || []).map((it, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      galleryId: `gal-${Date.now()}`,
      mediaId: it.mediaId,
      mediaUrl: `/api/v1/storage/file/manuscripts/axum-tsion-f12.webp`,
      caption: it.caption,
      rightsId: it.rightsId || 'rights-pub-001',
      rightsStatus: RightsStatus.PUBLIC_DOMAIN,
      downloadAllowed: true,
      orderIndex: it.orderIndex || idx + 1,
    }));

    const newGallery: MediaGalleryDto = {
      id: `gal-${Date.now()}`,
      slug,
      churchId: dto.churchId,
      title: dto.title,
      description: dto.description,
      coverMediaUrl: dto.coverMediaId
        ? `/api/v1/storage/file/manuscripts/axum-tsion-f12.webp`
        : items[0]?.mediaUrl,
      status: ContentStatus.DRAFT,
      itemCount: items.length,
      items,
      createdById: actor.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.memoryGalleries.unshift(newGallery);

    await this.auditService.record({
      actorId: actor.id,
      action: AuditAction.CONTENT_CREATED,
      entityType: 'MediaGallery',
      entityId: newGallery.id,
      metadata: { slug: newGallery.slug, churchId: newGallery.churchId, itemCount: items.length },
    });

    return newGallery;
  }

  async updateGallery(
    id: string,
    dto: UpdateMediaGalleryDto,
    actor: { id: string; role: string; churchId?: string },
  ): Promise<MediaGalleryDto> {
    const existing = await this.findGallery(id, true);

    if (actor.role === UserRole.CHURCH_REPRESENTATIVE) {
      if (existing.churchId !== actor.churchId) {
        throw new ForbiddenException(
          'Church Representatives cannot modify galleries outside their assigned church.',
        );
      }
    }

    const updated: MediaGalleryDto = {
      ...existing,
      slug: dto.slug || existing.slug,
      title: dto.title || existing.title,
      description: dto.description !== undefined ? dto.description : existing.description,
      churchId: dto.churchId !== undefined ? dto.churchId : existing.churchId,
      updatedAt: new Date().toISOString(),
    };

    if (dto.items) {
      updated.items = dto.items.map((it, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        galleryId: existing.id,
        mediaId: it.mediaId,
        mediaUrl: `/api/v1/storage/file/manuscripts/axum-tsion-f12.webp`,
        caption: it.caption,
        rightsId: it.rightsId || 'rights-pub-001',
        rightsStatus: RightsStatus.PUBLIC_DOMAIN,
        downloadAllowed: true,
        orderIndex: it.orderIndex || idx + 1,
      }));
      updated.itemCount = updated.items.length;
    }

    const idx = this.memoryGalleries.findIndex((g) => g.id === id || g.slug === id);
    if (idx !== -1) {
      this.memoryGalleries[idx] = updated;
    }

    await this.auditService.record({
      actorId: actor.id,
      action: AuditAction.CONTENT_UPDATED,
      entityType: 'MediaGallery',
      entityId: updated.id,
      metadata: { slug: updated.slug, itemCount: updated.itemCount },
    });

    return updated;
  }

  async transitionGallery(
    id: string,
    dto: GalleryTransitionDto,
    actor: { id: string; role: string; churchId?: string },
  ): Promise<MediaGalleryDto> {
    const gallery = await this.findGallery(id, true);
    const current = gallery.status;
    const target = dto.targetStatus;

    if (actor.role === UserRole.CHURCH_REPRESENTATIVE) {
      if (gallery.churchId !== actor.churchId) {
        throw new ForbiddenException(
          'Church Representatives cannot manage galleries outside their assigned church.',
        );
      }
    }

    const validTransitions: Record<ContentStatus, ContentStatus[]> = {
      [ContentStatus.DRAFT]: [ContentStatus.IN_REVIEW, ContentStatus.ARCHIVED],
      [ContentStatus.IN_REVIEW]: [ContentStatus.APPROVED, ContentStatus.REJECTED, ContentStatus.DRAFT],
      [ContentStatus.APPROVED]: [ContentStatus.PUBLISHED, ContentStatus.DRAFT, ContentStatus.ARCHIVED],
      [ContentStatus.PUBLISHED]: [ContentStatus.ARCHIVED],
      [ContentStatus.REJECTED]: [ContentStatus.DRAFT, ContentStatus.ARCHIVED],
      [ContentStatus.ARCHIVED]: [ContentStatus.DRAFT],
    };

    if (!validTransitions[current]?.includes(target)) {
      throw new BadRequestException(`Invalid status transition from ${current} to ${target}.`);
    }

    // Separation of Duties check for APPROVE and PUBLISH
    if (target === ContentStatus.APPROVED || target === ContentStatus.PUBLISHED) {
      if (gallery.createdById === actor.id && actor.role !== UserRole.SUPER_ADMINISTRATOR) {
        throw new ForbiddenException(
          'Separation of duties: The gallery creator cannot approve or publish their own collection.',
        );
      }

      const approverRoles = [UserRole.MODERATOR, UserRole.ADMINISTRATOR, UserRole.SUPER_ADMINISTRATOR];
      if (!approverRoles.includes(actor.role as UserRole)) {
        throw new ForbiddenException('Insufficient permissions to approve or publish media galleries.');
      }

      // Check rights compliance for every item in gallery
      const itemsWithoutRights = gallery.items.filter((it) => !it.rightsId);
      if (itemsWithoutRights.length > 0) {
        throw new BadRequestException(
          'Cannot publish gallery: Every item in the collection must be bound to a valid rights and provenance record.',
        );
      }
    }

    const updated: MediaGalleryDto = {
      ...gallery,
      status: target,
      updatedAt: new Date().toISOString(),
    };

    const idx = this.memoryGalleries.findIndex((g) => g.id === id || g.slug === id);
    if (idx !== -1) {
      this.memoryGalleries[idx] = updated;
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
      entityType: 'MediaGallery',
      entityId: updated.id,
      metadata: { previousStatus: current, nextStatus: target, reason: dto.reason },
    });

    return updated;
  }
}
