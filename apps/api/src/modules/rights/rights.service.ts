import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  RightsRecordDto,
  RightsStatus,
  AuditAction,
} from '@eotc/contracts';
import { CreateRightsDto, UpdateRightsDto } from './dto/rights.dto';

@Injectable()
export class RightsService {
  private readonly logger = new Logger(RightsService.name);
  private memoryStore: RightsRecordDto[] = [
    {
      id: 'rights-pub-001',
      status: RightsStatus.PUBLIC_DOMAIN,
      rightsHolder: 'EOTC Patriarchate Tradition',
      source: 'Ancient Liturgical Manuscripts (Axum & Lalibela)',
      permissionReference: 'Canon Law of the Apostles',
      downloadAllowed: true,
      notes: 'Ancient manuscripts older than copyright term. Freely viewable and downloadable.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rights-ch-002',
      status: RightsStatus.CHURCH_OWNED,
      rightsHolder: 'Debre Libanos Monastery',
      source: 'Debre Libanos Monastic Library',
      permissionReference: 'Abbot Archival Approval Ref #144-2024',
      downloadAllowed: false,
      notes: 'Browser viewing permitted only. Controlled download restricted per monastic decree.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rights-perm-003',
      status: RightsStatus.PERMISSION_GRANTED,
      rightsHolder: 'Mahibere Kidusan Audio Archive',
      source: 'Licensed Hymnody Collection',
      permissionReference: 'Formal License Agreement 2026-MK-09',
      downloadAllowed: true,
      notes: 'Licensed for non-commercial educational distribution.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateRightsDto, actorId?: string): Promise<RightsRecordDto> {
    try {
      const record = await this.prisma.rightsRecord.create({
        data: {
          status: dto.status,
          rightsHolder: dto.rightsHolder,
          source: dto.source,
          permissionReference: dto.permissionReference,
          downloadAllowed: dto.downloadAllowed ?? true,
          notes: dto.notes,
        },
      });

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_CREATED,
        entityType: 'RightsRecord',
        entityId: record.id,
        metadata: { status: record.status, rightsHolder: record.rightsHolder },
      });

      return this.mapDto(record);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, using in-memory store for create: ${(err as Error).message}`);
      const newRec: RightsRecordDto = {
        id: `rights-${Date.now()}`,
        status: dto.status,
        rightsHolder: dto.rightsHolder,
        source: dto.source,
        permissionReference: dto.permissionReference,
        downloadAllowed: dto.downloadAllowed ?? true,
        notes: dto.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.memoryStore.unshift(newRec);
      return newRec;
    }
  }

  async findAll(status?: RightsStatus): Promise<RightsRecordDto[]> {
    try {
      const records = await this.prisma.rightsRecord.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: 'desc' },
      });

      if (records && records.length > 0) {
        return records.map((r) => this.mapDto(r));
      }
      return status ? this.memoryStore.filter((r) => r.status === status) : this.memoryStore;
    } catch (err) {
      this.logger.warn(`Prisma unavailable, returning in-memory rights: ${(err as Error).message}`);
      return status ? this.memoryStore.filter((r) => r.status === status) : this.memoryStore;
    }
  }

  async findOne(id: string): Promise<RightsRecordDto> {
    try {
      const record = await this.prisma.rightsRecord.findUnique({
        where: { id },
      });

      if (record) {
        return this.mapDto(record);
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable, checking memory store: ${(err as Error).message}`);
    }

    const mem = this.memoryStore.find((r) => r.id === id);
    if (!mem) {
      throw new NotFoundException(`RightsRecord '${id}' not found.`);
    }
    return mem;
  }

  async update(
    id: string,
    dto: UpdateRightsDto,
    actorId?: string,
  ): Promise<RightsRecordDto> {
    await this.findOne(id);

    try {
      const record = await this.prisma.rightsRecord.update({
        where: { id },
        data: {
          status: dto.status,
          rightsHolder: dto.rightsHolder,
          source: dto.source,
          permissionReference: dto.permissionReference,
          downloadAllowed: dto.downloadAllowed,
          notes: dto.notes,
        },
      });

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_UPDATED,
        entityType: 'RightsRecord',
        entityId: record.id,
        metadata: { status: record.status },
      });

      return this.mapDto(record);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, updating in-memory store: ${(err as Error).message}`);
      const index = this.memoryStore.findIndex((r) => r.id === id);
      if (index !== -1) {
        this.memoryStore[index] = {
          ...this.memoryStore[index],
          ...dto,
          updatedAt: new Date().toISOString(),
        };
        return this.memoryStore[index];
      }
      throw new NotFoundException(`RightsRecord '${id}' not found.`);
    }
  }

  private mapDto(record: any): RightsRecordDto {
    return {
      id: record.id,
      status: record.status as RightsStatus,
      rightsHolder: record.rightsHolder,
      source: record.source,
      permissionReference: record.permissionReference,
      downloadAllowed: record.downloadAllowed,
      notes: record.notes,
      createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : String(record.createdAt),
      updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : String(record.updatedAt),
    };
  }
}
