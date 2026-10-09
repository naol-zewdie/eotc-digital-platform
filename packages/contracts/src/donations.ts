import { PaymentGateway, DonationPurpose, PaymentStatus } from './enums';

export interface DonationCampaignDto {
  id: string;
  slug: string;
  titleAm: string;
  titleEn: string;
  titleGez?: string;
  descriptionAm: string;
  descriptionEn: string;
  purpose: DonationPurpose;
  targetAmount: number;
  currency: string;
  raisedAmount: number;
  donorCount: number;
  churchId?: string;
  churchName?: string;
  coverImageUrl?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDonationCampaignDto {
  slug: string;
  titleAm: string;
  titleEn: string;
  titleGez?: string;
  descriptionAm: string;
  descriptionEn: string;
  purpose: DonationPurpose;
  targetAmount: number;
  currency?: string;
  churchId?: string;
  coverImageUrl?: string;
  endDate?: string;
}

export interface UpdateDonationCampaignDto {
  titleAm?: string;
  titleEn?: string;
  descriptionAm?: string;
  descriptionEn?: string;
  purpose?: DonationPurpose;
  targetAmount?: number;
  isActive?: boolean;
  coverImageUrl?: string;
  endDate?: string;
}

export interface DonationTransactionDto {
  id: string;
  campaignId?: string;
  campaignTitle?: string;
  donorName?: string;
  baptismalName?: string;
  donorEmail?: string;
  isAnonymous: boolean;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  status: PaymentStatus;
  transactionReference: string;
  prayerIntention?: string;
  receiptNumber: string;
  settledAt?: string;
  createdAt: string;
}

export interface InitiateDonationDto {
  campaignId?: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  donorName?: string;
  baptismalName?: string;
  donorEmail?: string;
  isAnonymous?: boolean;
  prayerIntention?: string;
  returnUrl?: string;
}

export interface InitiateDonationResponseDto {
  transactionId: string;
  checkoutUrl: string;
  reference: string;
  gateway: PaymentGateway;
  status: PaymentStatus;
  receiptNumber: string;
}

export interface VerifyDonationDto {
  transactionId: string;
  gatewayReference: string;
  gateway: PaymentGateway;
}

export interface DonationStatsDto {
  totalDonationsCount: number;
  totalsByCurrency: Record<string, number>;
  topCampaigns: Array<{
    id: string;
    slug: string;
    title: string;
    raisedAmount: number;
    currency: string;
    donorCount: number;
  }>;
  donorCount: number;
}
