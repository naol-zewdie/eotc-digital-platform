import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  PaymentGateway,
  DonationPurpose,
  PaymentStatus,
  AuditAction,
  DonationCampaignDto,
  DonationTransactionDto,
  InitiateDonationDto,
  InitiateDonationResponseDto,
  VerifyDonationDto,
  DonationStatsDto,
} from '@eotc/contracts';
import {
  CreateDonationCampaignInputDto,
  UpdateDonationCampaignInputDto,
  InitiateDonationInputDto,
  VerifyDonationInputDto,
} from './dto/donations.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);

  // Pre-seeded Canonical Campaigns
  private campaigns: DonationCampaignDto[] = [
    {
      id: 'camp-debre-damo-01',
      slug: 'debre-damo-preservation',
      titleAm: 'የደብረ ዳሞ ጥንታዊ ገዳም እድሳትና ቅርስ ጥበቃ',
      titleEn: 'Debre Damo Monastery Restoration & Manuscript Preservation',
      titleGez: 'ሕነጻ ወዕቀባ ቅርስ ዘገዳመ ደብረ ዳሞ',
      descriptionAm: 'በ፮ኛው መቶ ክፍለ ዘመን በአቡነ አረጋዊ የተመሠረተውን ታላቅ ገዳምና የጥንት ብራና መጻሕፍት ቅርስ መልሶ የማደስና የመጠበቅ ዓለም አቀፍ ፕሮጀክት።',
      descriptionEn: 'Preserving the historic 6th century cliff monastery founded by Abuna Aregawi and restoring ancient parchment manuscripts.',
      purpose: DonationPurpose.MONASTERY_SUPPORT,
      targetAmount: 15000000,
      currency: 'ETB',
      raisedAmount: 6840000,
      donorCount: 1240,
      churchId: 'church-debre-damo',
      churchName: 'Debre Damo Monastery',
      startDate: '2026-01-01T00:00:00.000Z',
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-15T00:00:00.000Z',
    },
    {
      id: 'camp-synod-relief-02',
      slug: 'synod-humanitarian-relief',
      titleAm: 'የቅዱስ ሲኖዶስ የሰብአዊ እርዳታና የተፈናቀሉ ወገኖች ማቋቋሚያ ፈንድ',
      titleEn: 'Holy Synod Humanitarian Relief for Displaced Brethren',
      titleGez: 'መራዕየ ምሕረት ዘቅዱስ ሲኖዶስ',
      descriptionAm: 'በተለያዩ አህጉረ ስብከት በችግርና በመፈናቀል ውስጥ ለሚገኙ ምእመናን የምግብ፣ የመጠለያና የሕክምና እርዳታ ማድረሻ ቋሚ ፈንድ።',
      descriptionEn: 'Emergency humanitarian assistance, sustenance, and pastoral rehousing for displaced Orthodox families across all dioceses.',
      purpose: DonationPurpose.CHARITY_DISPLACED,
      targetAmount: 25000000,
      currency: 'ETB',
      raisedAmount: 14200000,
      donorCount: 3890,
      startDate: '2026-01-10T00:00:00.000Z',
      isActive: true,
      createdAt: '2026-01-10T00:00:00.000Z',
      updatedAt: '2026-02-01T00:00:00.000Z',
    },
    {
      id: 'camp-yared-schools-03',
      slug: 'st-yared-clergy-schools',
      titleAm: 'የቅዱስ ያሬድ ዜማና አብነት ትምህርት ቤቶች ድጋፍ',
      titleEn: 'St. Yared Traditional Liturgical & Clergy Schools Endowment',
      titleGez: 'ማዕከለ ትምህርት ዘቅዱስ ያሬድ',
      descriptionAm: 'የብሉይና ሐዲስ ኪዳን መጻሕፍት ትርጓሜ፣ ቅኔ፣ ዜማና ሥርዓተ አምልኮ የሚያስተምሩ ባህላዊ አብነት ትምህርት ቤቶችንና መምህራንን መደገፍ።',
      descriptionEn: 'Direct monthly living endowments for traditional scholars teaching chant (Zema), poetry (Qene), and biblical commentaries across regional monasteries.',
      purpose: DonationPurpose.CLERGY_EDUCATION,
      targetAmount: 10000000,
      currency: 'ETB',
      raisedAmount: 4120000,
      donorCount: 890,
      startDate: '2026-01-20T00:00:00.000Z',
      isActive: true,
      createdAt: '2026-01-20T00:00:00.000Z',
      updatedAt: '2026-02-10T00:00:00.000Z',
    },
    {
      id: 'camp-axum-heritage-04',
      slug: 'axum-tsion-heritage',
      titleAm: 'የአክሱም ጽዮን ማርያም ካቴድራል ቅርሶች ጥበቃ ማዕከል',
      titleEn: 'Axum Tsion Maryam Cathedral Heritage Center',
      titleGez: 'ቤተ ቅርስ ዘአክሱም ጽዮን',
      descriptionAm: 'በአክሱም ጽዮን የሚገኙ ጥንታውያን ዘውዶች፣ የወርቅ መስቀሎችና የታሪክ ቅርሶች በዘመናዊ የሙቀትና እርጥበት መቆጣጠሪያ ቤተ መዘክር ውስጥ እንዲጠበቁ።',
      descriptionEn: 'State-of-the-art conservation, climate-controlled preservation vaults, and digitization of ancient royal crosses and manuscripts at Axum Tsion Maryam.',
      purpose: DonationPurpose.MANUSCRIPT_PRESERVATION,
      targetAmount: 18000000,
      currency: 'ETB',
      raisedAmount: 9350000,
      donorCount: 2150,
      startDate: '2026-02-01T00:00:00.000Z',
      isActive: true,
      createdAt: '2026-02-01T00:00:00.000Z',
      updatedAt: '2026-02-25T00:00:00.000Z',
    },
  ];

  // In-memory transaction ledger
  private transactions: DonationTransactionDto[] = [
    {
      id: 'tx-init-001',
      campaignId: 'camp-debre-damo-01',
      campaignTitle: 'Debre Damo Monastery Restoration & Manuscript Preservation',
      donorName: 'Alemayehu Tadesse',
      baptismalName: 'ወልደ ማርያም (Wolde Maryam)',
      donorEmail: 'alemayehu@example.com',
      isAnonymous: false,
      amount: 5000,
      currency: 'ETB',
      gateway: PaymentGateway.TELEBIRR,
      status: PaymentStatus.SUCCEEDED,
      transactionReference: 'TB-9283741829',
      prayerIntention: 'ስለ ቤተሰቦቼ ሰላምና ጤና (For family peace and health)',
      receiptNumber: 'EOTC-REC-2026-0001',
      settledAt: '2026-02-15T10:30:00.000Z',
      createdAt: '2026-02-15T10:28:00.000Z',
    },
    {
      id: 'tx-init-002',
      campaignId: 'camp-synod-relief-02',
      campaignTitle: 'Holy Synod Humanitarian Relief for Displaced Brethren',
      donorName: 'Anonymous Diaspora Faithful',
      baptismalName: 'ወለተ ጊዮርጊስ (Welete Giyorgis)',
      donorEmail: 'diaspora@example.org',
      isAnonymous: true,
      amount: 250,
      currency: 'USD',
      gateway: PaymentGateway.STRIPE,
      status: PaymentStatus.SUCCEEDED,
      transactionReference: 'pi_3Ox9823487192',
      prayerIntention: 'ለተፈናቀሉ ወገኖቻችን እግዚአብሔር ማስተዋልና መጽናናትን ይስጥልን',
      receiptNumber: 'EOTC-REC-2026-0002',
      settledAt: '2026-02-16T14:20:00.000Z',
      createdAt: '2026-02-16T14:18:00.000Z',
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAllCampaigns(options?: {
    purpose?: DonationPurpose;
    isActive?: boolean;
    churchId?: string;
  }): Promise<DonationCampaignDto[]> {
    let list = [...this.campaigns];
    if (options?.purpose) {
      list = list.filter((c) => c.purpose === options.purpose);
    }
    if (options?.isActive !== undefined) {
      list = list.filter((c) => c.isActive === options.isActive);
    }
    if (options?.churchId) {
      list = list.filter((c) => c.churchId === options.churchId);
    }
    return list;
  }

  async findCampaign(idOrSlug: string): Promise<DonationCampaignDto> {
    const campaign = this.campaigns.find(
      (c) => c.id === idOrSlug || c.slug === idOrSlug,
    );
    if (!campaign) {
      throw new NotFoundException(`Donation campaign not found: ${idOrSlug}`);
    }
    return campaign;
  }

  async createCampaign(
    dto: CreateDonationCampaignInputDto,
    userId = 'system-admin',
  ): Promise<DonationCampaignDto> {
    const existing = this.campaigns.find((c) => c.slug === dto.slug);
    if (existing) {
      throw new BadRequestException(`Campaign with slug '${dto.slug}' already exists`);
    }

    const newCampaign: DonationCampaignDto = {
      id: `camp-${uuidv4().slice(0, 8)}`,
      slug: dto.slug,
      titleAm: dto.titleAm,
      titleEn: dto.titleEn,
      titleGez: dto.titleGez,
      descriptionAm: dto.descriptionAm,
      descriptionEn: dto.descriptionEn,
      purpose: dto.purpose,
      targetAmount: dto.targetAmount,
      currency: dto.currency || 'ETB',
      raisedAmount: 0,
      donorCount: 0,
      churchId: dto.churchId,
      coverImageUrl: dto.coverImageUrl,
      startDate: new Date().toISOString(),
      endDate: dto.endDate,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.campaigns.unshift(newCampaign);

    await this.auditService.record({
      action: AuditAction.CONTENT_CREATED,
      entityType: 'DonationCampaign',
      entityId: newCampaign.id,
      actorId: userId,
      metadata: { slug: newCampaign.slug, targetAmount: newCampaign.targetAmount },
    });

    return newCampaign;
  }

  async updateCampaign(
    idOrSlug: string,
    dto: UpdateDonationCampaignInputDto,
    userId = 'system-admin',
  ): Promise<DonationCampaignDto> {
    const campaign = await this.findCampaign(idOrSlug);

    if (dto.titleAm !== undefined) campaign.titleAm = dto.titleAm;
    if (dto.titleEn !== undefined) campaign.titleEn = dto.titleEn;
    if (dto.descriptionAm !== undefined) campaign.descriptionAm = dto.descriptionAm;
    if (dto.descriptionEn !== undefined) campaign.descriptionEn = dto.descriptionEn;
    if (dto.purpose !== undefined) campaign.purpose = dto.purpose;
    if (dto.targetAmount !== undefined) campaign.targetAmount = dto.targetAmount;
    if (dto.isActive !== undefined) campaign.isActive = dto.isActive;
    if (dto.coverImageUrl !== undefined) campaign.coverImageUrl = dto.coverImageUrl;
    if (dto.endDate !== undefined) campaign.endDate = dto.endDate;
    campaign.updatedAt = new Date().toISOString();

    await this.auditService.record({
      action: AuditAction.CONTENT_UPDATED,
      entityType: 'DonationCampaign',
      entityId: campaign.id,
      actorId: userId,
      metadata: { updatedFields: Object.keys(dto) },
    });

    return campaign;
  }

  async initiateDonation(dto: InitiateDonationInputDto): Promise<InitiateDonationResponseDto> {
    if (dto.amount <= 0) {
      throw new BadRequestException('Donation amount must be strictly greater than 0');
    }

    let campaignTitle = 'General Patriarchate Spiritual Offering';
    if (dto.campaignId) {
      const campaign = this.campaigns.find(
        (c) => c.id === dto.campaignId || c.slug === dto.campaignId,
      );
      if (campaign) {
        campaignTitle = campaign.titleEn;
      }
    }

    const txId = `tx-${uuidv4()}`;
    const receiptNum = `EOTC-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const gatewayRef = `${dto.gateway.slice(0, 3)}-${Date.now()}`;

    const transaction: DonationTransactionDto = {
      id: txId,
      campaignId: dto.campaignId,
      campaignTitle,
      donorName: dto.isAnonymous ? 'Anonymous Donor' : dto.donorName || 'Believer',
      baptismalName: dto.baptismalName,
      donorEmail: dto.donorEmail,
      isAnonymous: dto.isAnonymous ?? false,
      amount: dto.amount,
      currency: dto.currency.toUpperCase(),
      gateway: dto.gateway,
      status: PaymentStatus.PENDING,
      transactionReference: gatewayRef,
      prayerIntention: dto.prayerIntention,
      receiptNumber: receiptNum,
      createdAt: new Date().toISOString(),
    };

    this.transactions.unshift(transaction);

    // Mock checkout URL depending on gateway
    const checkoutUrl = `/donate/checkout?tx=${txId}&ref=${gatewayRef}`;

    return {
      transactionId: txId,
      checkoutUrl,
      reference: gatewayRef,
      gateway: dto.gateway,
      status: PaymentStatus.PENDING,
      receiptNumber: receiptNum,
    };
  }

  async verifyDonation(dto: VerifyDonationInputDto): Promise<DonationTransactionDto> {
    const tx = this.transactions.find((t) => t.id === dto.transactionId);
    if (!tx) {
      throw new NotFoundException(`Transaction with id '${dto.transactionId}' not found`);
    }

    tx.status = PaymentStatus.SUCCEEDED;
    tx.settledAt = new Date().toISOString();
    if (dto.gatewayReference) {
      tx.transactionReference = dto.gatewayReference;
    }

    // Update campaign raisedAmount and donorCount
    if (tx.campaignId) {
      const camp = this.campaigns.find((c) => c.id === tx.campaignId || c.slug === tx.campaignId);
      if (camp) {
        // Simple currency normalization for aggregate stats (if USD, approx 1 USD = 120 ETB)
        const amountInEtb = tx.currency === 'USD' ? tx.amount * 120 : tx.currency === 'EUR' ? tx.amount * 130 : tx.amount;
        camp.raisedAmount += amountInEtb;
        camp.donorCount += 1;
        camp.updatedAt = new Date().toISOString();
      }
    }

    await this.auditService.record({
      action: AuditAction.CONTENT_CREATED,
      entityType: 'DonationTransaction',
      entityId: tx.id,
      actorId: tx.donorEmail || 'anonymous-donor',
      metadata: {
        receiptNumber: tx.receiptNumber,
        amount: tx.amount,
        currency: tx.currency,
        gateway: tx.gateway,
      },
    });

    return tx;
  }

  async getReceipt(transactionIdOrReceiptNumber: string): Promise<DonationTransactionDto> {
    const tx = this.transactions.find(
      (t) =>
        t.id === transactionIdOrReceiptNumber ||
        t.receiptNumber === transactionIdOrReceiptNumber,
    );
    if (!tx) {
      throw new NotFoundException(`Receipt or transaction not found: ${transactionIdOrReceiptNumber}`);
    }
    return tx;
  }

  async getTransactions(options?: {
    limit?: number;
    offset?: number;
    campaignId?: string;
    gateway?: PaymentGateway;
    status?: PaymentStatus;
  }): Promise<{ items: DonationTransactionDto[]; total: number }> {
    let list = [...this.transactions];
    if (options?.campaignId) {
      list = list.filter((t) => t.campaignId === options.campaignId);
    }
    if (options?.gateway) {
      list = list.filter((t) => t.gateway === options.gateway);
    }
    if (options?.status) {
      list = list.filter((t) => t.status === options.status);
    }

    const total = list.length;
    const limit = Math.min(Math.max(options?.limit || 50, 1), 200);
    const offset = Math.max(options?.offset || 0, 0);
    const items = list.slice(offset, offset + limit);

    return { items, total };
  }

  async getStats(): Promise<DonationStatsDto> {
    const totalsByCurrency: Record<string, number> = {
      ETB: 0,
      USD: 0,
      EUR: 0,
      GBP: 0,
    };

    let totalDonationsCount = 0;
    const uniqueDonors = new Set<string>();

    for (const t of this.transactions) {
      if (t.status === PaymentStatus.SUCCEEDED) {
        totalsByCurrency[t.currency] = (totalsByCurrency[t.currency] || 0) + t.amount;
        totalDonationsCount++;
        if (t.donorEmail) uniqueDonors.add(t.donorEmail);
        else uniqueDonors.add(t.id);
      }
    }

    const topCampaigns = this.campaigns
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.titleEn,
        raisedAmount: c.raisedAmount,
        currency: c.currency,
        donorCount: c.donorCount,
      }))
      .sort((a, b) => b.raisedAmount - a.raisedAmount);

    return {
      totalDonationsCount,
      totalsByCurrency,
      topCampaigns,
      donorCount: uniqueDonors.size,
    };
  }
}
