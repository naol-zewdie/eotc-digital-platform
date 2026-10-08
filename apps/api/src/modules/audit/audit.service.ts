import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuditEventDto, AuditEventDto } from '@eotc/contracts';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async record(dto: CreateAuditEventDto): Promise<void> {
    try {
      await this.prisma.auditEvent.create({
        data: {
          actorId: dto.actorId,
          action: dto.action,
          entityType: dto.entityType,
          entityId: dto.entityId,
          metadata: dto.metadata ? JSON.parse(JSON.stringify(dto.metadata)) : undefined,
          ipHash: dto.ipHash,
        },
      });
      this.logger.log(`Audit recorded: [${dto.action}] on ${dto.entityType}:${dto.entityId} by actor:${dto.actorId || 'system'}`);
    } catch (err) {
      // In dev or when database is connecting, log audit gracefully without breaking transaction
      this.logger.warn(`Could not persist audit record: ${(err as Error).message}`);
    }
  }

  async findAll(limit = 50, entityType?: string): Promise<AuditEventDto[]> {
    try {
      const records = await this.prisma.auditEvent.findMany({
        where: entityType ? { entityType } : undefined,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          actor: {
            select: {
              email: true,
              displayName: true,
            },
          },
        },
      });

      return records.map((r) => ({
        id: r.id,
        actorId: r.actorId,
        actorEmail: r.actor?.email,
        actorName: r.actor?.displayName,
        action: r.action,
        entityType: r.entityType,
        entityId: r.entityId,
        metadata: r.metadata as Record<string, any>,
        ipHash: r.ipHash,
        createdAt: r.createdAt.toISOString(),
      }));
    } catch (err) {
      this.logger.warn(`Audit query error: ${(err as Error).message}`);
      return [];
    }
  }
}
