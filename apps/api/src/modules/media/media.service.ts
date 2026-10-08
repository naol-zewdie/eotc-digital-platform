import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../common/storage/storage.service';
import { AuditService } from '../audit/audit.service';
import { UploadedFile } from '../../common/storage/file-validation';
import { MediaDto, AuditAction, RightsStatus } from '@eotc/contracts';

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
}
