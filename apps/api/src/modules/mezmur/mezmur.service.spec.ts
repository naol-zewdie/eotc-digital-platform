import { Test, TestingModule } from '@nestjs/testing';
import { MezmurService } from './mezmur.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ContentStatus } from '@eotc/contracts';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

describe('MezmurService', () => {
  let service: MezmurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MezmurService,
        {
          provide: PrismaService,
          useValue: {
            artist: {
              findMany: jest.fn().mockRejectedValue(new Error('DB offline')),
              findFirst: jest.fn().mockRejectedValue(new Error('DB offline')),
              create: jest.fn().mockRejectedValue(new Error('DB offline')),
            },
            mezmur: {
              findMany: jest.fn().mockRejectedValue(new Error('DB offline')),
              findFirst: jest.fn().mockRejectedValue(new Error('DB offline')),
              create: jest.fn().mockRejectedValue(new Error('DB offline')),
              update: jest.fn().mockRejectedValue(new Error('DB offline')),
            },
          },
        },
        {
          provide: AuditService,
          useValue: { record: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<MezmurService>(MezmurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list canonical artists and choirs', async () => {
    const artists = await service.getArtists();
    expect(artists.length).toBeGreaterThan(0);
    expect(artists.some((a) => a.isChoir)).toBe(true);
  });

  it('should find published mezmurs with stanzas and lyrics', async () => {
    const mezmurs = await service.findAll();
    expect(mezmurs.length).toBeGreaterThan(0);
    const first = mezmurs[0];
    expect(first.translations.length).toBeGreaterThan(0);
    expect(first.translations[0].lyrics).toBeDefined();
  });

  it('should create a mezmur draft with lyrics', async () => {
    const draft = await service.create(
      {
        slug: 'yared-woreb-test',
        rightsId: 'rights-pub-001',
        translations: [
          {
            locale: 'am',
            title: 'የቅዱስ ያሬድ ወረብ',
            lyrics: 'ሃሌ ሉያ ለክርስቶስ ይደሉ ስብሐት።',
          },
        ],
      },
      'creator-user-01',
    );

    expect(draft.status).toBe(ContentStatus.DRAFT);
    expect(draft.createdById).toBe('creator-user-01');
  });

  it('should enforce separation of duties on approval', async () => {
    const draft = await service.create(
      {
        slug: 'sep-duty-hymn',
        rightsId: 'rights-pub-001',
        translations: [{ locale: 'am', title: 'ሙከራ' }],
      },
      'hymn-creator-id',
    );

    // Creator tries to approve -> must fail
    await expect(
      service.transitionStatus(
        draft.id,
        { targetStatus: ContentStatus.APPROVED },
        { id: 'hymn-creator-id', role: 'MODERATOR' },
      ),
    ).rejects.toThrow(ForbiddenException);

    // Different moderator succeeds
    const approved = await service.transitionStatus(
      draft.id,
      { targetStatus: ContentStatus.APPROVED },
      { id: 'different-reviewer-id', role: 'MODERATOR' },
    );
    expect(approved.status).toBe(ContentStatus.APPROVED);
  });
});
