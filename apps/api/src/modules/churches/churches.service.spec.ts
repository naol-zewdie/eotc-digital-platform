import { Test, TestingModule } from '@nestjs/testing';
import { ChurchesService } from './churches.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { VerificationStatus, ContentStatus } from '@eotc/contracts';
import { ForbiddenException } from '@nestjs/common';

describe('ChurchesService', () => {
  let service: ChurchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChurchesService,
        {
          provide: PrismaService,
          useValue: {
            church: {
              findMany: jest.fn().mockRejectedValue(new Error('DB offline')),
              findFirst: jest.fn().mockRejectedValue(new Error('DB offline')),
              create: jest.fn().mockRejectedValue(new Error('DB offline')),
              update: jest.fn().mockRejectedValue(new Error('DB offline')),
            },
            churchMembership: {
              findUnique: jest.fn().mockRejectedValue(new Error('DB offline')),
              upsert: jest.fn().mockRejectedValue(new Error('DB offline')),
              updateMany: jest.fn().mockRejectedValue(new Error('DB offline')),
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

    service = module.get<ChurchesService>(ChurchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list verified churches for public requests', async () => {
    const list = await service.findAll();
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((c) => c.verificationStatus === VerificationStatus.VERIFIED)).toBe(true);
  });

  it('should filter churches by region (e.g. Tigray, Oromia, Diaspora)', async () => {
    const tigray = await service.findAll({ region: 'Tigray' });
    expect(tigray.length).toBeGreaterThan(0);
    expect(tigray.every((c) => c.region === 'Tigray')).toBe(true);

    const diaspora = await service.findAll({ region: 'Diaspora - North America' });
    expect(diaspora.length).toBeGreaterThan(0);
    expect(diaspora[0].city).toBe('Washington, DC');
  });

  it('should find church by slug and return coordinates and translations', async () => {
    const church = await service.findOne('axum-tsion');
    expect(church).toBeDefined();
    expect(church.slug).toBe('axum-tsion');
    expect(church.coordinates?.lat).toBeCloseTo(14.1294);
    expect(church.coordinates?.lng).toBeCloseTo(38.7186);
    expect(church.translations.length).toBe(3);
    const am = church.translations.find((t) => t.locale === 'am');
    expect(am?.name).toContain('ማርያም ጽዮን');
  });

  it('should create a church submission in PENDING_REVIEW status', async () => {
    const created = await service.create(
      {
        slug: 'debre-dima-monastery',
        region: 'Amhara',
        city: 'Gojjam',
        isMonastery: true,
        coordinates: { lat: 10.45, lng: 37.85 },
        translations: [
          {
            locale: 'am',
            name: 'ደብረ ዲማ ቅዱስ ጊዮርጊስ ገዳም',
            description: 'በጎጃም የሚገኝ ጥንታዊ ታሪካዊ ገዳም።',
          },
        ],
      },
      'submitter-user-id',
    );

    expect(created.status).toBe(ContentStatus.DRAFT);
    expect(created.verificationStatus).toBe(VerificationStatus.PENDING_REVIEW);
    expect(created.isMonastery).toBe(true);
  });

  it('should allow users to submit a church representative claim', async () => {
    const res = await service.claimChurch(
      'church-axum-tsion',
      {
        evidenceNotes: 'Appointed as deacon and secretary by diocese letter #889.',
        claimantPhone: '+251-911-001122',
        claimantRoleTitle: 'Parish Secretary',
      },
      {
        id: 'new-claimant-user',
        email: 'claimant@axum-tsion.org',
        displayName: 'Claimant Deacon',
      },
    );

    expect(res.status).toBe('PENDING_REVIEW');
  });

  it('should allow admin to verify a church and activate representative claim', async () => {
    const verified = await service.verifyChurch(
      'church-pending-entoto',
      { decision: 'APPROVE', notes: 'Diocese credentials confirmed.' },
      { id: 'admin-actor-id' },
    );

    expect(verified.verificationStatus).toBe(VerificationStatus.VERIFIED);
    expect(verified.status).toBe(ContentStatus.PUBLISHED);

    const membership = verified.memberships?.find((m) => m.userId === 'user-claimant-001');
    expect(membership?.status).toBe('ACTIVE');
    expect(membership?.verifiedBy).toBe('admin-actor-id');
  });

  it('should enforce church scope when updating church details', async () => {
    // 1. Church Representative attempting to update a church they are NOT assigned to
    await expect(
      service.update(
        'church-axum-tsion',
        { city: 'New City' },
        {
          id: 'unauthorized-rep',
          role: 'CHURCH_REPRESENTATIVE',
          churchMemberships: [{ churchSlug: 'debre-libanos', status: 'ACTIVE' }],
        },
      ),
    ).rejects.toThrow(ForbiddenException);

    // 2. Church Representative updating their OWN assigned church -> succeeds
    const updated = await service.update(
      'church-debre-libanos',
      { city: 'North Shewa Zone' },
      {
        id: 'user-rep-001',
        role: 'CHURCH_REPRESENTATIVE',
        churchMemberships: [{ churchSlug: 'debre-libanos', status: 'ACTIVE' }],
      },
    );

    expect(updated.city).toBe('North Shewa Zone');
  });
});
