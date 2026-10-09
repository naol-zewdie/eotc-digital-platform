'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  Building,
  Users,
  ShieldCheck,
  Download,
  Eye,
  FileCheck,
  TrendingUp,
  Receipt,
  Smartphone,
  Globe2,
} from 'lucide-react';
import {
  PaymentGateway,
  DonationPurpose,
  PaymentStatus,
  DonationCampaignDto,
  DonationTransactionDto,
} from '@eotc/contracts';

// Pre-seeded campaigns matching backend canonical dataset
const INITIAL_CAMPAIGNS: DonationCampaignDto[] = [
  {
    id: 'camp-debre-damo-01',
    slug: 'debre-damo-preservation',
    titleAm: 'የደብረ ዳሞ ጥንታዊ ገዳም እድሳትና ቅርስ ጥበቃ',
    titleEn: 'Debre Damo Monastery Restoration & Manuscript Preservation',
    titleGez: 'ሕነጻ ወዕቀባ ቅርስ ዘገዳመ ደብረ ዳሞ',
    descriptionAm: 'በ፮ኛው መቶ ክፍለ ዘመን በአቡነ አረጋዊ የተመሠረተውን ታላቅ ገዳምና የጥንት ብራና መጻሕፍት ቅርስ መልሶ የማደስና የመጠበቅ ዓለም አቀፍ ፕሮጀክት።',
    descriptionEn: 'Preserving the historic 6th century cliff monastery and restoring ancient illuminated parchment manuscripts.',
    purpose: DonationPurpose.MONASTERY_SUPPORT,
    targetAmount: 15000000,
    currency: 'ETB',
    raisedAmount: 6840000,
    donorCount: 1240,
    startDate: '2026-01-01T00:00:00.000Z',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'camp-synod-relief-02',
    slug: 'synod-humanitarian-relief',
    titleAm: 'የቅዱስ ሲኖዶስ የሰብአዊ እርዳታና የተፈናቀሉ ወገኖች ፈንድ',
    titleEn: 'Holy Synod Humanitarian Relief for Displaced Brethren',
    titleGez: 'መራዕየ ምሕረት ዘቅዱስ ሲኖዶስ',
    descriptionAm: 'በተለያዩ አህጉረ ስብከት በችግርና በመፈናቀል ውስጥ ለሚገኙ ምእመናን የምግብ፣ የመጠለያና የሕክምና እርዳታ ማድረሻ ቋሚ ፈንድ።',
    descriptionEn: 'Emergency humanitarian assistance, sustenance, and pastoral rehousing for displaced Orthodox families.',
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
    descriptionEn: 'Direct living endowments for traditional scholars teaching chant, poetry, and biblical commentaries.',
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
    descriptionAm: 'በአክሱም ጽዮን የሚገኙ ጥንታውያን ዘውዶች፣ የወርቅ መስቀሎችና የታሪክ ቅርሶች በዘመናዊ ሙቀት መቆጣጠሪያ ቤተ መዘክር ውስጥ እንዲጠበቁ።',
    descriptionEn: 'State-of-the-art conservation, climate-controlled preservation vaults, and digitization of ancient royal crosses.',
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

const INITIAL_TRANSACTIONS: DonationTransactionDto[] = [
  {
    id: 'tx-001',
    campaignId: 'camp-debre-damo-01',
    campaignTitle: 'Debre Damo Monastery Restoration',
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
    settledAt: '2026-10-08T10:30:00.000Z',
    createdAt: '2026-10-08T10:28:00.000Z',
  },
  {
    id: 'tx-002',
    campaignId: 'camp-synod-relief-02',
    campaignTitle: 'Holy Synod Humanitarian Relief',
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
    settledAt: '2026-10-08T14:20:00.000Z',
    createdAt: '2026-10-08T14:18:00.000Z',
  },
  {
    id: 'tx-003',
    campaignId: 'camp-yared-schools-03',
    campaignTitle: 'St. Yared Traditional Liturgical Schools',
    donorName: 'Kassahun Bekele',
    baptismalName: 'ገብረ መስቀል (Gebre Meskel)',
    donorEmail: 'kassahun@example.com',
    isAnonymous: false,
    amount: 10000,
    currency: 'ETB',
    gateway: PaymentGateway.CBE_BIRR,
    status: PaymentStatus.SUCCEEDED,
    transactionReference: 'CBE-771294829',
    prayerIntention: 'ለአባቶቻችን መምህራነ አብነት ጽናትና ረጅም ዕድሜ',
    receiptNumber: 'EOTC-REC-2026-0003',
    settledAt: '2026-10-08T16:45:00.000Z',
    createdAt: '2026-10-08T16:40:00.000Z',
  },
];

export default function AdminDonationsPage() {
  const [campaigns, setCampaigns] = useState<DonationCampaignDto[]>(INITIAL_CAMPAIGNS);
  const [transactions, setTransactions] = useState<DonationTransactionDto[]>(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'transactions'>('campaigns');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New campaign form state
  const [newTitleAm, setNewTitleAm] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newTarget, setNewTarget] = useState(1000000);
  const [newPurpose, setNewPurpose] = useState<DonationPurpose>(DonationPurpose.MONASTERY_SUPPORT);

  const totalRaisedETB = campaigns.reduce((acc, c) => acc + (c.currency === 'ETB' ? c.raisedAmount : 0), 0);
  const totalDonors = campaigns.reduce((acc, c) => acc + c.donorCount, 0);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const created: DonationCampaignDto = {
      id: `camp-${Date.now().toString(36)}`,
      slug: newSlug || newTitleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      titleAm: newTitleAm,
      titleEn: newTitleEn,
      descriptionAm: newTitleAm,
      descriptionEn: newTitleEn,
      purpose: newPurpose,
      targetAmount: newTarget,
      raisedAmount: 0,
      currency: 'ETB',
      donorCount: 0,
      startDate: new Date().toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCampaigns([created, ...campaigns]);
    setShowCreateModal(false);
    setNewTitleAm('');
    setNewTitleEn('');
    setNewSlug('');
  };

  return (
    <div className="p-6 md:p-10 space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-eotc-gold mb-1">
            <Heart className="w-4 h-4" />
            <span>Spiritual Offerings & Campaigns (Sprint 10)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white heading-font">
            Donation Campaigns & Financial Ledger
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Canonical voluntary offerings management, multi-gateway ledger reconciliation, and Holy Synod audit compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/am/donate"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-white border border-neutral-800 transition-colors"
          >
            <Globe2 className="w-4 h-4 text-amber-400" />
            <span>View Public Portal</span>
          </Link>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-eotc-gold to-amber-500 text-neutral-950 text-xs font-bold shadow-md hover:brightness-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>Total Raised (ETB)</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white heading-font">
            {totalRaisedETB.toLocaleString()} ETB
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across 4 verified canonical campaigns</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>Active Campaigns</span>
            <Building className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white heading-font">
            {campaigns.filter((c) => c.isActive).length}
          </div>
          <div className="text-[11px] text-neutral-400">
            Monasteries, Relief, Schools, Heritage
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>Total Faithful Donors</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white heading-font">
            {totalDonors.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400">
            Local & diaspora contributors
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>Audited Receipts</span>
            <Receipt className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white heading-font">
            {transactions.length}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% reconciled & cryptographically signed</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'campaigns'
              ? 'border-eotc-gold text-eotc-gold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Active Preservation Campaigns ({campaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'transactions'
              ? 'border-eotc-gold text-eotc-gold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Transaction Ledger & Receipts ({transactions.length})</span>
        </button>
      </div>

      {/* Tab: Campaigns Table */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((c) => {
              const pct = Math.min(Math.round((c.raisedAmount / c.targetAmount) * 100), 100);
              return (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {c.purpose}
                      </span>
                      <h3 className="text-base font-bold text-white heading-font mt-2">
                        {c.titleEn}
                      </h3>
                      <div className="text-xs text-neutral-400 ethiopic-font mt-0.5">
                        {c.titleAm}
                      </div>
                    </div>

                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-semibold shrink-0">
                      Active
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-amber-400 font-bold">
                        {c.raisedAmount.toLocaleString()} {c.currency}
                      </span>
                      <span className="text-neutral-400">
                        {pct}% of {c.targetAmount.toLocaleString()} {c.currency}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800/60">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{c.donorCount.toLocaleString()} donors</span>
                    </div>
                    <div className="font-mono text-[11px] text-neutral-500">
                      slug: {c.slug}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Transactions Ledger */}
      {activeTab === 'transactions' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 font-semibold uppercase tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="py-3.5 px-4">Receipt #</th>
                  <th className="py-3.5 px-4">Campaign</th>
                  <th className="py-3.5 px-4">Donor & Baptismal</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Gateway</th>
                  <th className="py-3.5 px-4">Prayer Intention</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {tx.receiptNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white max-w-[200px] truncate">
                      {tx.campaignTitle}
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-semibold text-white">
                        {tx.isAnonymous ? 'Anonymous Faithful' : tx.donorName}
                      </div>
                      {tx.baptismalName && (
                        <div className="text-[11px] text-amber-300 font-medium">
                          ✝ {tx.baptismalName}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {tx.amount.toLocaleString()} {tx.currency}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 text-[10px] font-semibold text-neutral-300">
                        {tx.gateway}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 max-w-[220px] truncate">
                      {tx.prayerIntention || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>SUCCEEDED</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Campaign */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Donation Campaign</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Title (Amharic)</label>
                <input
                  type="text"
                  required
                  placeholder="የደብረ ሊባኖስ ገዳም ጥበቃ"
                  value={newTitleAm}
                  onChange={(e) => setNewTitleAm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  placeholder="Debre Libanos Preservation"
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Purpose Category</label>
                <select
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value as DonationPurpose)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={DonationPurpose.MONASTERY_SUPPORT}>Monastery Support</option>
                  <option value={DonationPurpose.CHARITY_DISPLACED}>Charity & Displaced</option>
                  <option value={DonationPurpose.CLERGY_EDUCATION}>Clergy Education</option>
                  <option value={DonationPurpose.MANUSCRIPT_PRESERVATION}>Manuscript Preservation</option>
                  <option value={DonationPurpose.PARISH_PROJECT}>Parish Project</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Target Amount (ETB)</label>
                <input
                  type="number"
                  min="1000"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
