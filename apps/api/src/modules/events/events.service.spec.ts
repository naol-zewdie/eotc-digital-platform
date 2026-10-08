import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ContentStatus, EventType, UserRole } from '@eotc/contracts';
import { ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;

  const mockPrisma = {
    event: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'evt-db-001', ...args.data })),
      update: jest.fn(),
    },
  };

  const mockAudit = {
    record: jest.fn().mockResolvedValue({ id: 'audit-001' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  describe('Liturgical Calendar Calculation Engine', () => {
    it('should compute Ethiopian calendar date and return canonical feasts', () => {
      const calendar = service.getLiturgicalCalendar('2026-09-27T10:00:00.000Z');
      expect(calendar).toBeDefined();
      expect(calendar.ethiopianDate).toBeDefined();
      expect(calendar.ethiopianDate.year).toBeGreaterThan(2015);
      expect(calendar.formattedAm).toBeDefined();
      expect(calendar.allCanonicalFeasts.length).toBeGreaterThan(5);
      expect(calendar.monthlyCommemorations.length).toBe(7);
    });

    it('should identify Meskel (Meskerem 17) and annual feasts', () => {
      const calendar = service.getLiturgicalCalendar();
      const meskel = calendar.allCanonicalFeasts.find((f) => f.id === 'feast-meskel');
      expect(meskel).toBeDefined();
      expect(meskel?.ethiopianMonth).toBe(1);
      expect(meskel?.ethiopianDay).toBe(17);
      expect(meskel?.type).toBe(EventType.LITURGICAL_FEAST);
    });
  });

  describe('findAll', () => {
    it('should return published events for non-staff viewers', async () => {
      const result = await service.findAll({ isStaff: false });
      expect(result.items.length).toBeGreaterThan(0);
      result.items.forEach((item) => {
        expect(item.status).toBe(ContentStatus.PUBLISHED);
      });
    });

    it('should filter events by churchId', async () => {
      const result = await service.findAll({ churchId: 'debre-libanos', isStaff: true });
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items[0].churchId).toBe('debre-libanos');
    });
  });

  describe('findOne', () => {
    it('should return event by slug', async () => {
      const event = await service.findOne('feast-of-the-cross-meskel-2026');
      expect(event).toBeDefined();
      expect(event.slug).toBe('feast-of-the-cross-meskel-2026');
      expect(event.translations.length).toBeGreaterThan(0);
    });

    it('should throw NotFoundException for unknown event', async () => {
      await expect(service.findOne('non-existent-event-slug')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create new event in DRAFT status', async () => {
      const newEvent = await service.create(
        {
          slug: 'test-parish-revival-2026',
          type: EventType.PARISH_CONFERENCE,
          churchId: 'debre-libanos',
          startAt: '2026-11-15T08:00:00.000Z',
          translations: [
            {
              locale: 'am',
              title: 'የደብረ ሊባኖስ ዓመታዊ መንፈሳዊ ጉባኤ',
              description: 'ስለ ቅዱሳት መጻሕፍት ትምህርት የሚሰጥበት ጉባኤ።',
            },
          ],
        },
        { id: 'user-editor-001', role: UserRole.EDITOR },
      );

      expect(newEvent).toBeDefined();
      expect(newEvent.status).toBe(ContentStatus.DRAFT);
      expect(newEvent.translations[0].title).toBe('የደብረ ሊባኖስ ዓመታዊ መንፈሳዊ ጉባኤ');
      expect(mockAudit.record).toHaveBeenCalled();
    });

    it('should reject church representative creating events outside their assigned parish', async () => {
      await expect(
        service.create(
          {
            slug: 'unauthorized-church-event',
            type: EventType.PATRONAL_FEAST,
            churchId: 'axum-tsion',
            startAt: '2026-12-01T08:00:00.000Z',
            translations: [{ locale: 'am', title: 'Unauthorized Event' }],
          },
          {
            id: 'rep-001',
            role: UserRole.CHURCH_REPRESENTATIVE,
            churchId: 'debre-libanos',
          },
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('transition & separation of duties', () => {
    it('should advance DRAFT to IN_REVIEW', async () => {
      const created = await service.create(
        {
          slug: 'transition-test-event',
          type: EventType.PRAYER_VIGIL,
          churchId: 'patriarchate',
          startAt: '2026-12-20T18:00:00.000Z',
          translations: [{ locale: 'am', title: 'የሌሊት ማኅሌትና ጸሎት' }],
        },
        { id: 'user-author-99', role: UserRole.EDITOR },
      );

      const inReview = await service.transition(
        created.id,
        { targetStatus: ContentStatus.IN_REVIEW, reason: 'Ready for review' },
        { id: 'user-author-99', role: UserRole.EDITOR },
      );
      expect(inReview.status).toBe(ContentStatus.IN_REVIEW);
    });

    it('should enforce separation of duties: author cannot approve their own event', async () => {
      const created = await service.create(
        {
          slug: 'separation-duty-event',
          type: EventType.LITURGICAL_FEAST,
          churchId: 'patriarchate',
          startAt: '2026-12-25T18:00:00.000Z',
          translations: [{ locale: 'am', title: 'የበዓል ዝግጅት' }],
        },
        { id: 'user-author-77', role: UserRole.MODERATOR },
      );

      await service.transition(
        created.id,
        { targetStatus: ContentStatus.IN_REVIEW },
        { id: 'user-author-77', role: UserRole.MODERATOR },
      );

      await expect(
        service.transition(
          created.id,
          { targetStatus: ContentStatus.APPROVED },
          { id: 'user-author-77', role: UserRole.MODERATOR },
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow another moderator or super admin to approve and publish', async () => {
      const created = await service.create(
        {
          slug: 'approval-test-event',
          type: EventType.LITURGICAL_FEAST,
          churchId: 'patriarchate',
          startAt: '2026-12-25T18:00:00.000Z',
          translations: [{ locale: 'am', title: 'የጸሎት በዓል' }],
        },
        { id: 'user-author-88', role: UserRole.EDITOR },
      );

      await service.transition(
        created.id,
        { targetStatus: ContentStatus.IN_REVIEW },
        { id: 'user-author-88', role: UserRole.EDITOR },
      );

      const approved = await service.transition(
        created.id,
        { targetStatus: ContentStatus.APPROVED, reason: 'Liturgically validated' },
        { id: 'user-reviewer-99', role: UserRole.MODERATOR },
      );
      expect(approved.status).toBe(ContentStatus.APPROVED);

      const published = await service.transition(
        created.id,
        { targetStatus: ContentStatus.PUBLISHED },
        { id: 'user-reviewer-99', role: UserRole.MODERATOR },
      );
      expect(published.status).toBe(ContentStatus.PUBLISHED);
    });

    it('should reject invalid status jump (e.g. DRAFT to PUBLISHED directly)', async () => {
      const created = await service.create(
        {
          slug: 'jump-test-event',
          type: EventType.LITURGICAL_FEAST,
          startAt: '2026-12-25T18:00:00.000Z',
          translations: [{ locale: 'am', title: 'Jump test' }],
        },
        { id: 'user-editor-1', role: UserRole.EDITOR },
      );

      await expect(
        service.transition(
          created.id,
          { targetStatus: ContentStatus.PUBLISHED },
          { id: 'user-super-admin', role: UserRole.SUPER_ADMINISTRATOR },
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
