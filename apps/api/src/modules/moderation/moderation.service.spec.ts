import { Test, TestingModule } from '@nestjs/testing';
import { ModerationService } from './moderation.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  ModerationType,
  ModerationStatus,
  ModerationPriority,
  AuditAction,
} from '@eotc/contracts';

describe('ModerationService', () => {
  let service: ModerationService;

  const mockPrismaService = {
    churchMembership: {
      upsert: jest.fn().mockResolvedValue({}),
    },
  };

  const mockAuditService = {
    record: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModerationService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<ModerationService>(ModerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all moderation items', async () => {
      const items = await service.findAll();
      expect(items.length).toBeGreaterThanOrEqual(4);
    });

    it('should filter items by type', async () => {
      const claims = await service.findAll({ type: ModerationType.PARISH_CLAIM });
      expect(claims.length).toBeGreaterThanOrEqual(1);
      expect(claims.every((c) => c.type === ModerationType.PARISH_CLAIM)).toBe(true);
    });

    it('should filter items by status', async () => {
      const pending = await service.findAll({ status: ModerationStatus.PENDING });
      expect(pending.every((p) => p.status === ModerationStatus.PENDING)).toBe(true);
    });
  });

  describe('findById', () => {
    it('should find item by id', async () => {
      const item = await service.findById('mod-claim-001');
      expect(item.id).toBe('mod-claim-001');
      expect(item.targetTitle).toContain('Debre Libanos');
    });

    it('should throw NotFoundException for unknown id', async () => {
      await expect(service.findById('unknown-mod-id')).rejects.toThrow();
    });
  });

  describe('createItem', () => {
    it('should create a community correction item and record audit', async () => {
      const created = await service.createItem({
        type: ModerationType.TYPO_CORRECTION,
        priority: ModerationPriority.LOW,
        targetEntityType: 'BOOK',
        targetEntityId: 'book-metsihafe-seatat',
        targetTitle: 'Metsihafe Seatat (መጽሐፈ ሰዓታት)',
        claimantName: 'Kesis Daniel',
        claimantEmail: 'daniel@eotc.org',
        proposedChanges: {
          folio: 'Folio 5',
          originalText: 'ስብሐት',
          correctedText: 'ስብሐት ለአብ',
        },
      });

      expect(created.id).toBeDefined();
      expect(created.status).toBe(ModerationStatus.PENDING);
      expect(mockAuditService.record).toHaveBeenCalledWith(
        expect.objectContaining({
          action: AuditAction.CONTENT_SUBMITTED,
          entityType: 'ModerationItem',
        }),
      );
    });
  });

  describe('executeAction', () => {
    it('should approve parish claim and record scope verification audit', async () => {
      const result = await service.executeAction(
        'mod-claim-001',
        {
          action: 'APPROVE',
          moderatorNotes: 'Diocesan appointment decree verified.',
        },
        { id: 'mod-admin-1', displayName: 'Diocesan Secretary' },
      );

      expect(result.status).toBe(ModerationStatus.APPROVED);
      expect(result.moderatorNotes).toBe('Diocesan appointment decree verified.');
      expect(mockAuditService.record).toHaveBeenCalledWith(
        expect.objectContaining({
          action: AuditAction.CHURCH_SCOPE_VERIFIED,
          entityType: 'ChurchMembership',
        }),
      );
    });

    it('should reject moderation item with notes and audit record', async () => {
      const result = await service.executeAction(
        'mod-flag-004',
        {
          action: 'REJECT',
          moderatorNotes: 'Audio track verified as canonical traditional recording.',
        },
        { id: 'mod-admin-1', displayName: 'Diocesan Secretary' },
      );

      expect(result.status).toBe(ModerationStatus.REJECTED);
      expect(mockAuditService.record).toHaveBeenCalledWith(
        expect.objectContaining({
          action: AuditAction.CONTENT_REJECTED,
          entityType: 'ModerationItem',
        }),
      );
    });
  });

  describe('getStats', () => {
    it('should compute valid moderation metrics', async () => {
      const stats = await service.getStats();
      expect(stats.totalPending).toBeGreaterThanOrEqual(1);
      expect(stats.pendingClaims).toBeGreaterThanOrEqual(0);
      expect(stats.pendingCorrections).toBeGreaterThanOrEqual(0);
      expect(stats.totalResolved).toBeGreaterThanOrEqual(1);
    });
  });
});
