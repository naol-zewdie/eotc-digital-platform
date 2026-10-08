import { Test, TestingModule } from '@nestjs/testing';
import { RightsService } from './rights.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { RightsStatus } from '@eotc/contracts';

describe('RightsService', () => {
  let service: RightsService;
  let prisma: PrismaService;

  const mockRightsRecord = {
    id: 'rights-123',
    status: RightsStatus.PUBLIC_DOMAIN,
    rightsHolder: 'Church Patriarchate Tradition',
    source: 'Ancient Liturgical Canon',
    permissionReference: 'Historic Canon',
    downloadAllowed: true,
    notes: 'Free liturgical access',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RightsService,
        {
          provide: PrismaService,
          useValue: {
            rightsRecord: {
              create: jest.fn().mockResolvedValue(mockRightsRecord),
              findMany: jest.fn().mockResolvedValue([mockRightsRecord]),
              findUnique: jest.fn().mockResolvedValue(mockRightsRecord),
              update: jest.fn().mockResolvedValue({
                ...mockRightsRecord,
                status: RightsStatus.PERMISSION_GRANTED,
              }),
            },
          },
        },
        {
          provide: AuditService,
          useValue: {
            record: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<RightsService>(RightsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a valid RightsRecord with audit trail', async () => {
    const result = await service.create({
      status: RightsStatus.PUBLIC_DOMAIN,
      rightsHolder: 'Church Patriarchate Tradition',
      source: 'Ancient Liturgical Canon',
      downloadAllowed: true,
    });

    expect(result.id).toBe('rights-123');
    expect(result.status).toBe(RightsStatus.PUBLIC_DOMAIN);
    expect(result.downloadAllowed).toBe(true);
  });

  it('should find all rights records', async () => {
    const results = await service.findAll();
    expect(results).toHaveLength(1);
    expect(results[0].status).toBe(RightsStatus.PUBLIC_DOMAIN);
  });

  it('should update rights record status', async () => {
    const result = await service.update('rights-123', {
      status: RightsStatus.PERMISSION_GRANTED,
    });
    expect(result.status).toBe(RightsStatus.PERMISSION_GRANTED);
  });
});
