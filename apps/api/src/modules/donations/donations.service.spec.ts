import { Test, TestingModule } from '@nestjs/testing';
import { DonationsService } from './donations.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  PaymentGateway,
  DonationPurpose,
  PaymentStatus,
} from '@eotc/contracts';

describe('DonationsService', () => {
  let service: DonationsService;

  const mockPrismaService = {};
  const mockAuditService = {
    record: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<DonationsService>(DonationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllCampaigns', () => {
    it('should return all active campaigns', async () => {
      const campaigns = await service.findAllCampaigns({ isActive: true });
      expect(campaigns.length).toBeGreaterThanOrEqual(4);
      expect(campaigns[0]).toHaveProperty('targetAmount');
      expect(campaigns[0]).toHaveProperty('raisedAmount');
    });

    it('should filter campaigns by purpose', async () => {
      const monasteryCampaigns = await service.findAllCampaigns({
        purpose: DonationPurpose.MONASTERY_SUPPORT,
      });
      expect(monasteryCampaigns.length).toBeGreaterThanOrEqual(1);
      expect(monasteryCampaigns[0].purpose).toBe(DonationPurpose.MONASTERY_SUPPORT);
    });
  });

  describe('findCampaign', () => {
    it('should find campaign by slug', async () => {
      const campaign = await service.findCampaign('debre-damo-preservation');
      expect(campaign.slug).toBe('debre-damo-preservation');
      expect(campaign.titleAm).toContain('ደብረ ዳሞ');
    });

    it('should throw NotFoundException for unknown campaign', async () => {
      await expect(service.findCampaign('non-existent-campaign')).rejects.toThrow();
    });
  });

  describe('createCampaign', () => {
    it('should create a new campaign and log an audit event', async () => {
      const newCamp = await service.createCampaign(
        {
          slug: 'test-parish-hall',
          titleAm: 'የአዳራሽ ግንባታ',
          titleEn: 'Parish Hall Construction',
          descriptionAm: 'የሰንበት ት/ቤት አዳራሽ ግንባታ',
          descriptionEn: 'Parish educational hall renovation',
          purpose: DonationPurpose.PARISH_PROJECT,
          targetAmount: 500000,
          currency: 'ETB',
        },
        'user-admin-1',
      );

      expect(newCamp.slug).toBe('test-parish-hall');
      expect(newCamp.raisedAmount).toBe(0);
      expect(mockAuditService.record).toHaveBeenCalledWith(
        expect.objectContaining({
          entityType: 'DonationCampaign',
        }),
      );
    });
  });

  describe('initiateDonation and verifyDonation', () => {
    it('should initiate a donation and return a pending transaction response', async () => {
      const initRes = await service.initiateDonation({
        campaignId: 'camp-debre-damo-01',
        amount: 1500,
        currency: 'ETB',
        gateway: PaymentGateway.TELEBIRR,
        donorName: 'Haile Selassie',
        baptismalName: 'ገብረ መስቀል',
        donorEmail: 'haile@example.com',
        prayerIntention: 'ስለ ቅድስት ቤተክርስቲያን ሰላም',
      });

      expect(initRes.status).toBe(PaymentStatus.PENDING);
      expect(initRes.transactionId).toBeDefined();
      expect(initRes.receiptNumber).toMatch(/^EOTC-REC-2026-\d+/);
      expect(initRes.checkoutUrl).toContain(initRes.transactionId);

      // Verify the donation
      const verified = await service.verifyDonation({
        transactionId: initRes.transactionId,
        gatewayReference: 'TB-SETTLED-8899',
        gateway: PaymentGateway.TELEBIRR,
      });

      expect(verified.status).toBe(PaymentStatus.SUCCEEDED);
      expect(verified.settledAt).toBeDefined();

      // Retrieve the receipt
      const receipt = await service.getReceipt(initRes.transactionId);
      expect(receipt.id).toBe(initRes.transactionId);
      expect(receipt.receiptNumber).toBe(initRes.receiptNumber);
      expect(receipt.amount).toBe(1500);
    });

    it('should throw BadRequestException if donation amount is <= 0', async () => {
      await expect(
        service.initiateDonation({
          amount: 0,
          currency: 'USD',
          gateway: PaymentGateway.STRIPE,
        }),
      ).rejects.toThrow();
    });
  });

  describe('getStats', () => {
    it('should calculate donation totals and donor metrics', async () => {
      const stats = await service.getStats();
      expect(stats.totalDonationsCount).toBeGreaterThan(0);
      expect(stats.totalsByCurrency).toHaveProperty('ETB');
      expect(stats.totalsByCurrency).toHaveProperty('USD');
      expect(stats.topCampaigns.length).toBeGreaterThan(0);
      expect(stats.donorCount).toBeGreaterThan(0);
    });
  });
});
