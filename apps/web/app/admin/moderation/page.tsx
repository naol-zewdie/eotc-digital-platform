'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  FileText,
  Church,
  BookOpen,
  Music,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  X,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  History,
  Building,
  Sparkles,
  Plus,
} from 'lucide-react';
import {
  ModerationType,
  ModerationStatus,
  ModerationPriority,
  ModerationItemDto,
  UserRole,
} from '@eotc/contracts';

const INITIAL_MODERATION_ITEMS: ModerationItemDto[] = [
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
      appointmentDate: '2026-09-15',
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
      rationale: 'In ancient Geez syntax and vocalic prosody, the 4th order consonant "ከ" conforms with canonical Diggua transcription.',
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
      flagReason: 'Audio playback track exhibits unauthorized modern rhythm loop incompatible with canonical Mahlet tradition.',
      canonicalSource: 'St. Yared Diggua tradition canon 4',
    },
    moderatorNotes: 'Forwarded to Liturgical Hymnody Committee for ecclesiastical acoustical audit.',
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
      rationale: 'Aligned with official Holy Synod Historiographical Board consensus.',
    },
    moderatorNotes: 'Verified and applied to canonical church history metadata.',
    reviewedById: 'user-admin-001',
    reviewedByName: 'Patriarchate Secretariat Admin',
    reviewedAt: '2026-10-08T16:00:00.000Z',
    createdAt: '2026-10-06T15:00:00.000Z',
    updatedAt: '2026-10-08T16:00:00.000Z',
  },
];

export default function AdminModerationPage() {
  const [items, setItems] = useState<ModerationItemDto[]>(INITIAL_MODERATION_ITEMS);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ModerationItemDto | null>(null);
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // New report form state
  const [newType, setNewType] = useState<ModerationType>(ModerationType.TYPO_CORRECTION);
  const [newTitle, setNewTitle] = useState('');
  const [newClaimant, setNewClaimant] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newOriginal, setNewOriginal] = useState('');
  const [newCorrected, setNewCorrected] = useState('');

  // Stats
  const pendingClaims = items.filter((i) => i.type === ModerationType.PARISH_CLAIM && i.status === ModerationStatus.PENDING).length;
  const pendingCorrections = items.filter((i) => i.type === ModerationType.TYPO_CORRECTION && i.status === ModerationStatus.PENDING).length;
  const pendingReports = items.filter((i) => (i.type === ModerationType.CONTENT_FLAG || i.type === ModerationType.THEOLOGICAL_DISPUTE) && (i.status === ModerationStatus.PENDING || i.status === ModerationStatus.IN_REVIEW)).length;
  const resolvedCount = items.filter((i) => i.status === ModerationStatus.APPROVED || i.status === ModerationStatus.RESOLVED).length;

  const filteredItems = items.filter((item) => {
    if (filterType !== 'ALL' && item.type !== filterType) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.targetTitle.toLowerCase().includes(q);
      const matchName = item.claimantName.toLowerCase().includes(q);
      const matchDiocese = item.dioceseName?.toLowerCase().includes(q);
      if (!matchTitle && !matchName && !matchDiocese) return false;
    }
    return true;
  });

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT' | 'RESOLVE' | 'IN_REVIEW') => {
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let nextStatus: ModerationStatus = item.status;
          if (action === 'APPROVE') nextStatus = ModerationStatus.APPROVED;
          if (action === 'REJECT') nextStatus = ModerationStatus.REJECTED;
          if (action === 'RESOLVE') nextStatus = ModerationStatus.RESOLVED;
          if (action === 'IN_REVIEW') nextStatus = ModerationStatus.IN_REVIEW;

          return {
            ...item,
            status: nextStatus,
            moderatorNotes: moderatorNotes || item.moderatorNotes,
            reviewedById: 'user-admin-001',
            reviewedByName: 'Diocesan Secretariat Admin',
            reviewedAt: now,
            updatedAt: now,
          };
        }
        return item;
      })
    );

    const target = items.find((i) => i.id === id);
    setActionSuccess(`Action '${action}' applied to ${target?.targetTitle || 'case'}. Scope and audit logged.`);
    setSelectedItem(null);
    setModeratorNotes('');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ModerationItemDto = {
      id: `mod-${Date.now().toString(36)}`,
      type: newType,
      status: ModerationStatus.PENDING,
      priority: ModerationPriority.MEDIUM,
      targetEntityType: newType === ModerationType.PARISH_CLAIM ? 'CHURCH' : 'BOOK',
      targetEntityId: 'custom-target',
      targetTitle: newTitle,
      claimantName: newClaimant,
      claimantEmail: newEmail,
      proposedChanges: {
        originalText: newOriginal,
        correctedText: newCorrected,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems([created, ...items]);
    setShowSubmitModal(false);
    setActionSuccess(`New community moderation case filed: ${newTitle}`);
    setNewTitle('');
    setNewClaimant('');
    setNewEmail('');
    setNewOriginal('');
    setNewCorrected('');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const getPriorityBadge = (p: ModerationPriority) => {
    switch (p) {
      case ModerationPriority.URGENT:
        return 'bg-red-950/80 text-red-400 border-red-500/40';
      case ModerationPriority.HIGH:
        return 'bg-amber-950/80 text-amber-400 border-amber-500/40';
      case ModerationPriority.MEDIUM:
        return 'bg-blue-950/80 text-blue-400 border-blue-500/40';
      case ModerationPriority.LOW:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  const getStatusBadge = (s: ModerationStatus) => {
    switch (s) {
      case ModerationStatus.APPROVED:
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40';
      case ModerationStatus.RESOLVED:
        return 'bg-sky-950/60 text-sky-400 border-sky-500/40';
      case ModerationStatus.PENDING:
        return 'bg-amber-950/60 text-amber-400 border-amber-500/40';
      case ModerationStatus.IN_REVIEW:
        return 'bg-purple-950/60 text-purple-400 border-purple-500/40';
      case ModerationStatus.REJECTED:
        return 'bg-red-950/60 text-red-400 border-red-500/40';
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-eotc-gold mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Diocesan Governance & Content Moderation Desk (Sprint 11)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white heading-font">
            Parish Representative Verification & Community Corrections
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Verification desk for diocesan representative appointment decrees, manuscript errata, and doctrinal integrity triage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-white border border-neutral-800 transition-colors"
          >
            <Plus className="w-4 h-4 text-eotc-gold" />
            <span>File Test Case</span>
          </button>

          <Link
            href="/admin/audit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-white border border-neutral-800 transition-colors"
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span>Audit Trail</span>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>Pending Parish Claims</span>
            <Building className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white heading-font">
            {pendingClaims}
          </div>
          <div className="text-[11px] text-amber-400">
            Awaiting Diocesan Secretariat seal review
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>Manuscript Corrections</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white heading-font">
            {pendingCorrections}
          </div>
          <div className="text-[11px] text-neutral-400">
            Ge'ez grammar & folio errata submissions
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>Flagged Audio & News</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-white heading-font">
            {pendingReports}
          </div>
          <div className="text-[11px] text-neutral-400">
            Liturgical hymnody & doctrinal reports
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>Resolved Cases</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white heading-font">
            {resolvedCount}
          </div>
          <div className="text-[11px] text-emerald-400">
            Verified with immutable audit log
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Moderation Items', count: items.length },
              { id: ModerationType.PARISH_CLAIM, label: 'Diocesan Parish Claims', count: items.filter((i) => i.type === ModerationType.PARISH_CLAIM).length },
              { id: ModerationType.TYPO_CORRECTION, label: 'Manuscript Corrections', count: items.filter((i) => i.type === ModerationType.TYPO_CORRECTION).length },
              { id: ModerationType.CONTENT_FLAG, label: 'Liturgical Flags', count: items.filter((i) => i.type === ModerationType.CONTENT_FLAG).length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  filterType === tab.id
                    ? 'bg-eotc-gold text-neutral-950 shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value={ModerationStatus.PENDING}>Pending</option>
              <option value={ModerationStatus.IN_REVIEW}>In Review</option>
              <option value={ModerationStatus.APPROVED}>Approved</option>
              <option value={ModerationStatus.RESOLVED}>Resolved</option>
              <option value={ModerationStatus.REJECTED}>Rejected</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by parish name, manuscript title, diocese, or claimant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/90 text-white text-xs focus:outline-none focus:border-amber-500 placeholder-neutral-500"
          />
        </div>
      </div>

      {/* Moderation Queue Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950 text-neutral-400 font-semibold uppercase tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Priority & ID</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Entity & Diocese</th>
                <th className="py-3.5 px-4">Claimant / Scholar</th>
                <th className="py-3.5 px-4">Proposed Correction / Rationale</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3.5 px-4 space-y-1">
                    <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-bold ${getPriorityBadge(item.priority)}`}>
                      {item.priority}
                    </span>
                    <div className="font-mono text-[10px] text-neutral-500">
                      {item.id}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-[10px] font-semibold text-neutral-300">
                      {item.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 space-y-0.5 max-w-[220px]">
                    <div className="font-bold text-white truncate">
                      {item.targetTitle}
                    </div>
                    {item.dioceseName && (
                      <div className="text-[11px] text-amber-400/90 truncate">
                        {item.dioceseName}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="font-semibold text-white">
                      {item.claimantName}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {item.claimantEmail}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-[280px]">
                    {item.proposedChanges?.originalText && item.proposedChanges?.correctedText ? (
                      <div className="space-y-1 text-[11px]">
                        <div className="text-red-400 line-through truncate">
                          - {item.proposedChanges.originalText}
                        </div>
                        <div className="text-emerald-400 font-semibold truncate">
                          + {item.proposedChanges.correctedText}
                        </div>
                      </div>
                    ) : item.proposedChanges?.flagReason ? (
                      <div className="text-[11px] text-amber-300 line-clamp-2">
                        {item.proposedChanges.flagReason}
                      </div>
                    ) : item.proposedChanges?.diocesanLetterRef ? (
                      <div className="text-[11px] text-neutral-300">
                        Ref: <span className="font-mono text-amber-400">{item.proposedChanges.diocesanLetterRef}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-500">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setModeratorNotes(item.moderatorNotes || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-neutral-700 transition-colors"
                    >
                      Inspect & Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision / Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-2xl w-full rounded-3xl border border-neutral-700 bg-neutral-900 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(selectedItem.priority)}`}>
                    {selectedItem.priority} PRIORITY
                  </span>
                  <span className="text-xs font-semibold text-neutral-400">
                    Case ID: {selectedItem.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white heading-font">
                  {selectedItem.targetTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Case Details */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <div>
                  <div className="text-neutral-400 text-[11px]">Submitting Person</div>
                  <div className="font-bold text-white mt-0.5">{selectedItem.claimantName}</div>
                  <div className="text-neutral-400 text-[11px]">{selectedItem.claimantEmail}</div>
                </div>

                {selectedItem.dioceseName && (
                  <div>
                    <div className="text-neutral-400 text-[11px]">Diocesan Secretariat</div>
                    <div className="font-bold text-amber-300 mt-0.5">{selectedItem.dioceseName}</div>
                  </div>
                )}
              </div>

              {/* Proposed changes or documents */}
              {selectedItem.officialDocumentUrl && (
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Official Diocesan Appointment Letter</span>
                  </div>
                  <a
                    href={selectedItem.officialDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline font-semibold"
                  >
                    <span>View PDF Document</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Text Diff View */}
              {selectedItem.proposedChanges?.originalText && (
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="font-semibold text-neutral-300">Manuscript Transcription Diff:</div>
                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-red-300 ethiopic-font">
                    - {selectedItem.proposedChanges.originalText}
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 font-bold ethiopic-font">
                    + {selectedItem.proposedChanges.correctedText}
                  </div>
                  {selectedItem.proposedChanges?.rationale && (
                    <div className="text-[11px] text-neutral-400 pt-1 italic">
                      Rationale: {selectedItem.proposedChanges.rationale}
                    </div>
                  )}
                </div>
              )}

              {/* Moderator Notes */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">
                  Diocesan Moderator Ecclesiastical Notes / Rationale:
                </label>
                <textarea
                  rows={3}
                  value={moderatorNotes}
                  onChange={(e) => setModeratorNotes(e.target.value)}
                  placeholder="Enter pastoral decree number, verification reason, or revision remarks..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-white text-xs focus:outline-none focus:border-amber-500 placeholder-neutral-600 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleAction(selectedItem.id, 'IN_REVIEW')}
                className="px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-800 text-xs font-semibold"
              >
                Mark In Review
              </button>

              <button
                type="button"
                onClick={() => handleAction(selectedItem.id, 'REJECT')}
                className="px-4 py-2.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 text-xs font-bold flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(selectedItem.id, selectedItem.type === ModerationType.PARISH_CLAIM ? 'APPROVE' : 'RESOLVE')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-105 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {selectedItem.type === ModerationType.PARISH_CLAIM
                    ? 'Verify & Authorize Representative'
                    : 'Approve & Apply Correction'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: File Test Case */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">File Moderation Report</h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Type of Report</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ModerationType)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={ModerationType.TYPO_CORRECTION}>Manuscript Typo Correction</option>
                  <option value={ModerationType.PARISH_CLAIM}>Parish Representative Claim</option>
                  <option value={ModerationType.CONTENT_FLAG}>Liturgical Hymn Flag</option>
                  <option value={ModerationType.THEOLOGICAL_DISPUTE}>Doctrinal Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Target Entity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metsihafe Gimbat / St. George Church"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-400 mb-1">Submitter Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Qes Hailu"
                    value={newClaimant}
                    onChange={(e) => setNewClaimant(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="hailu@eotc.org"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Original Text (Existing)</label>
                <input
                  type="text"
                  placeholder="Original manuscript text..."
                  value={newOriginal}
                  onChange={(e) => setNewOriginal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Corrected Text (Proposed)</label>
                <input
                  type="text"
                  placeholder="Canonical corrected text..."
                  value={newCorrected}
                  onChange={(e) => setNewCorrected(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  File Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
