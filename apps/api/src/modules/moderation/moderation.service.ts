import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  ModerationType,
  ModerationStatus,
  ModerationPriority,
  AuditAction,
  ModerationItemDto,
  ModerationStatsDto,
} from '@eotc/contracts';
import {
  CreateModerationItemInputDto,
  ModerationActionInputDto,
  ModerationFilterDto,
} from './dto/moderation.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  // Pre-seeded canonical moderation queue reflecting actual EOTC diocesan & manuscript workflows
  private items: ModerationItemDto[] = [
    {
      id: 'mod-claim-001',
      type: ModerationType.PARISH_CLAIM,
      status: ModerationStatus.PENDING,
      priority: ModerationPriority.HIGH,
      targetEntityType: 'CHURCH',
      targetEntityId: 'church-debre-libanos',
      targetTitle: 'Debre Libanos Monastery (ደብረ ሊባኖስ ገዳም)',
      claimantUserId: 'user-claimant-01',
      claimantName: 'Memehir Gebre Silassie',
      claimantEmail: 'gebre.silassie@debrelibanos.org',
      dioceseName: 'North Shewa Diocesan Secretariat (የሰሜን ሸዋ ሀገረ ስብከት)',
      officialDocumentUrl: 'https://storage.eotc.org/letters/dioc-shewa-2026-981.pdf',
      proposedChanges: {
        parishRole: 'CHURCH_REPRESENTATIVE',
        diocesanLetterRef: 'EOTC-DIOC-SHEWA-2026-981',
        officialSealVerified: true,
      },
      createdAt: '2026-10-08T08:00:00.000Z',
      updatedAt: '2026-10-08T08:00:00.000Z',
    },
    {
      id: 'mod-typo-002',
      type: ModerationType.TYPO_CORRECTION,
      status: ModerationStatus.PENDING,
      priority: ModerationPriority.MEDIUM,
      targetEntityType: 'BOOK',
      targetEntityId: 'book-wudasie-maryam',
      targetTitle: 'Wudasie Maryam Manuscript (ውዳሴ ማርያም የብራና ቅጂ)',
      claimantName: 'Qes Solomon Worku',
      claimantEmail: 'qes.solomon@eotc-heritage.edu.et',
      proposedChanges: {
        folio: 'Folio 14b, Tuesday Prayer, Stanza 3',
        originalText: 'ይትባረክ እግዚአብሔር አምላከ እስራኤል',
        correctedText: 'ይትባረከ እግዚአብሔር አምላከ እስራኤል',
        rationale: 'In the ancient Geez syntax of the manuscript, the 4th order consonant "ከ" preserves the vocalic prosody.',
      },
      createdAt: '2026-10-08T09:30:00.000Z',
      updatedAt: '2026-10-08T09:30:00.000Z',
    },
    {
      id: 'mod-claim-003',
      type: ModerationType.PARISH_CLAIM,
      status: ModerationStatus.APPROVED,
      priority: ModerationPriority.HIGH,
      targetEntityType: 'CHURCH',
      targetEntityId: 'church-axum-tsion',
      targetTitle: 'Axum Tsion Maryam Cathedral (ርዕሰ አድባራት ቅድስት ጽዮን ማርያም)',
      claimantUserId: 'user-axum-rep',
      claimantName: 'Nibure Id Elias Gebru',
      claimantEmail: 'nibureid@axumtsion.org',
      dioceseName: 'Central Tigray Diocesan Secretariat (የማዕከላዊ ትግራይ ሀገረ ስብከት)',
      officialDocumentUrl: 'https://storage.eotc.org/letters/axum-tsion-seal-2026.pdf',
      moderatorNotes: 'Ecclesiastical credentials and patriarchal appointment decree verified in good standing.',
      reviewedById: 'user-admin-001',
      reviewedByName: 'Patriarchate Secretariat Admin',
      reviewedAt: '2026-10-08T12:00:00.000Z',
      createdAt: '2026-10-07T10:00:00.000Z',
      updatedAt: '2026-10-08T12:00:00.000Z',
    },
    {
      id: 'mod-flag-004',
      type: ModerationType.CONTENT_FLAG,
      status: ModerationStatus.IN_REVIEW,
      priority: ModerationPriority.URGENT,
      targetEntityType: 'MEZMUR',
      targetEntityId: 'mezmur-erey-kedus',
      targetTitle: 'Erey Kedus Hymn Chant (እረይ ቅዱስ ያሬዳዊ ዜማ)',
      claimantName: 'Diacon Yohannes Tilahun',
      claimantEmail: 'yohannes@orthodoxia.org',
      proposedChanges: {
        flagReason: 'Audio playback track exhibits unauthorized synthesized modern beat overlay incompatible with canonical Mahlet tradition.',
        canonicalSource: 'St. Yared Diggua tradition canon 4',
      },
      moderatorNotes: 'Assigned to Sacred Hymnody Committee for liturgical audio review.',
      reviewedById: 'user-editor-002',
      reviewedByName: 'Liturgical Music Editor',
      reviewedAt: '2026-10-08T14:15:00.000Z',
      createdAt: '2026-10-08T11:20:00.000Z',
      updatedAt: '2026-10-08T14:15:00.000Z',
    },
    {
      id: 'mod-meta-005',
      type: ModerationType.METADATA_UPDATE,
      status: ModerationStatus.RESOLVED,
      priority: ModerationPriority.LOW,
      targetEntityType: 'CHURCH',
      targetEntityId: 'church-debre-damo',
      targetTitle: 'Debre Damo Monastery (ደብረ ዳሞ ገዳም)',
      claimantName: 'Dr. Tadesse Tamrat Scholar Society',
      claimantEmail: 'research@eotc-history.org',
      proposedChanges: {
        field: 'foundationEra',
        originalText: 'Founded 7th century',
        correctedText: 'Founded 6th century (circa 520 AD by Abuna Aregawi during Reign of Emperor Gebre Meskel)',
        rationale: 'Aligned with official EOTC Holy Synod Historiographical Board consensus.',
      },
      moderatorNotes: 'Verified and applied to canonical church history translation.',
      reviewedById: 'user-admin-001',
      reviewedByName: 'Patriarchate Secretariat Admin',
      reviewedAt: '2026-10-08T16:00:00.000Z',
      createdAt: '2026-10-06T15:00:00.000Z',
      updatedAt: '2026-10-08T16:00:00.000Z',
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(filter?: ModerationFilterDto): Promise<ModerationItemDto[]> {
    let list = [...this.items];

    if (filter?.type) {
      list = list.filter((item) => item.type === filter.type);
    }
    if (filter?.status) {
      list = list.filter((item) => item.status === filter.status);
    }
    if (filter?.priority) {
      list = list.filter((item) => item.priority === filter.priority);
    }
    if (filter?.targetEntityType) {
      list = list.filter(
        (item) => item.targetEntityType.toUpperCase() === filter.targetEntityType!.toUpperCase(),
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findById(id: string): Promise<ModerationItemDto> {
    const item = this.items.find((i) => i.id === id);
    if (!item) {
      throw new NotFoundException(`Moderation item not found: ${id}`);
    }
    return item;
  }

  async createItem(dto: CreateModerationItemInputDto): Promise<ModerationItemDto> {
    const newItem: ModerationItemDto = {
      id: `mod-${uuidv4().slice(0, 8)}`,
      type: dto.type,
      status: ModerationStatus.PENDING,
      priority: dto.priority || ModerationPriority.MEDIUM,
      targetEntityType: dto.targetEntityType.toUpperCase(),
      targetEntityId: dto.targetEntityId,
      targetTitle: dto.targetTitle,
      claimantUserId: dto.claimantUserId,
      claimantName: dto.claimantName,
      claimantEmail: dto.claimantEmail,
      dioceseName: dto.dioceseName,
      officialDocumentUrl: dto.officialDocumentUrl,
      proposedChanges: dto.proposedChanges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.items.unshift(newItem);

    await this.auditService.record({
      action: AuditAction.CONTENT_SUBMITTED,
      entityType: 'ModerationItem',
      entityId: newItem.id,
      actorId: dto.claimantUserId || dto.claimantEmail,
      metadata: {
        type: newItem.type,
        targetTitle: newItem.targetTitle,
        priority: newItem.priority,
      },
    });

    return newItem;
  }

  async executeAction(
    id: string,
    actionDto: ModerationActionInputDto,
    moderator: { id: string; displayName?: string } = { id: 'admin-001', displayName: 'Diocesan Moderator' },
  ): Promise<ModerationItemDto> {
    const item = await this.findById(id);

    const now = new Date().toISOString();
    item.reviewedById = moderator.id;
    item.reviewedByName = moderator.displayName || 'Diocesan Moderator';
    item.reviewedAt = now;
    item.updatedAt = now;
    if (actionDto.moderatorNotes) {
      item.moderatorNotes = actionDto.moderatorNotes;
    }

    switch (actionDto.action) {
      case 'APPROVE':
        item.status = ModerationStatus.APPROVED;

        // If this is a Parish Representative claim, verify scope and record audit
        if (item.type === ModerationType.PARISH_CLAIM) {
          try {
            if (item.claimantUserId && item.targetEntityId) {
              await this.prisma.churchMembership.upsert({
                where: {
                  userId_churchId: {
                    userId: item.claimantUserId,
                    churchId: item.targetEntityId,
                  },
                },
                update: {
                  status: 'ACTIVE',
                  verifiedBy: moderator.id,
                  verifiedAt: new Date(),
                },
                create: {
                  userId: item.claimantUserId,
                  churchId: item.targetEntityId,
                  status: 'ACTIVE',
                  verifiedBy: moderator.id,
                  verifiedAt: new Date(),
                },
              });
            }
          } catch (err) {
            this.logger.warn(`Could not persist database membership in dev: ${(err as Error).message}`);
          }

          await this.auditService.record({
            action: AuditAction.CHURCH_SCOPE_VERIFIED,
            entityType: 'ChurchMembership',
            entityId: item.targetEntityId,
            actorId: moderator.id,
            metadata: {
              claimId: item.id,
              claimantEmail: item.claimantEmail,
              churchTitle: item.targetTitle,
            },
          });
        } else {
          await this.auditService.record({
            action: AuditAction.CONTENT_APPROVED,
            entityType: 'ModerationItem',
            entityId: item.id,
            actorId: moderator.id,
            metadata: {
              type: item.type,
              targetTitle: item.targetTitle,
            },
          });
        }
        break;

      case 'REJECT':
        item.status = ModerationStatus.REJECTED;
        await this.auditService.record({
          action: AuditAction.CONTENT_REJECTED,
          entityType: 'ModerationItem',
          entityId: item.id,
          actorId: moderator.id,
          metadata: {
            reason: actionDto.moderatorNotes,
            type: item.type,
          },
        });
        break;

      case 'RESOLVE':
        item.status = ModerationStatus.RESOLVED;
        await this.auditService.record({
          action: AuditAction.CONTENT_UPDATED,
          entityType: 'ModerationItem',
          entityId: item.id,
          actorId: moderator.id,
          metadata: {
            resolved: true,
            type: item.type,
          },
        });
        break;

      case 'IN_REVIEW':
        item.status = ModerationStatus.IN_REVIEW;
        break;

      default:
        throw new BadRequestException(`Unsupported moderation action: ${actionDto.action}`);
    }

    return item;
  }

  async getStats(): Promise<ModerationStatsDto> {
    const totalPending = this.items.filter((i) => i.status === ModerationStatus.PENDING).length;
    const pendingClaims = this.items.filter(
      (i) => i.type === ModerationType.PARISH_CLAIM && i.status === ModerationStatus.PENDING,
    ).length;
    const pendingCorrections = this.items.filter(
      (i) => i.type === ModerationType.TYPO_CORRECTION && i.status === ModerationStatus.PENDING,
    ).length;
    const pendingReports = this.items.filter(
      (i) =>
        (i.type === ModerationType.CONTENT_FLAG || i.type === ModerationType.THEOLOGICAL_DISPUTE) &&
        (i.status === ModerationStatus.PENDING || i.status === ModerationStatus.IN_REVIEW),
    ).length;
    const totalResolved = this.items.filter(
      (i) => i.status === ModerationStatus.APPROVED || i.status === ModerationStatus.RESOLVED,
    ).length;
    const recentActionsCount = this.items.filter((i) => i.reviewedAt !== undefined).length;

    return {
      totalPending,
      pendingClaims,
      pendingCorrections,
      pendingReports,
      totalResolved,
      recentActionsCount,
    };
  }
}
