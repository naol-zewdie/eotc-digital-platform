'use client';

import React, { useState, useEffect } from 'react';
import {
  Church,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Clock,
  Send,
  Eye,
  Languages,
  Compass,
} from 'lucide-react';
import {
  VerificationStatus,
  ContentStatus,
  ChurchDto,
  CreateChurchDto,
} from '@eotc/contracts';

export default function AdminChurchesPage() {
  const [churches, setChurches] = useState<ChurchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedChurchForClaim, setSelectedChurchForClaim] = useState<ChurchDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form State for new Church
  const [slug, setSlug] = useState('');
  const [region, setRegion] = useState('Addis Ababa');
  const [city, setCity] = useState('');
  const [diocese, setDiocese] = useState('');
  const [isMonastery, setIsMonastery] = useState(false);
  const [lat, setLat] = useState<number>(9.03);
  const [lng, setLng] = useState<number>(38.74);
  const [phone, setPhone] = useState('+251-');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [addressLine, setAddressLine] = useState('');

  // Translations
  const [modalTab, setModalTab] = useState<'am' | 'gez' | 'en'>('am');
  const [amName, setAmName] = useState('');
  const [amDesc, setAmDesc] = useState('');
  const [amHist, setAmHist] = useState('');

  const [gezName, setGezName] = useState('');
  const [gezDesc, setGezDesc] = useState('');
  const [gezHist, setGezHist] = useState('');

  const [enName, setEnName] = useState('');
  const [enDesc, setEnDesc] = useState('');
  const [enHist, setEnHist] = useState('');

  // Claim Form State
  const [claimNotes, setClaimNotes] = useState('Official diocese appointment letter verified.');

  const fetchChurches = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/churches?isStaff=true');
      if (res.ok) {
        const data = await res.json();
        setChurches(data);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchChurches();
  }, []);

  const handleCreateChurch = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    const translations = [];
    if (amName.trim()) {
      translations.push({
        locale: 'am',
        name: amName,
        description: amDesc,
        history: amHist,
      });
    }
    if (gezName.trim()) {
      translations.push({
        locale: 'gez',
        name: gezName,
        description: gezDesc,
        history: gezHist,
      });
    }
    if (enName.trim()) {
      translations.push({
        locale: 'en',
        name: enName,
        description: enDesc,
        history: enHist,
      });
    }

    if (translations.length === 0) {
      setActionError('At least one translation name (Amharic, Ge\'ez, or English) is required.');
      return;
    }

    const payload: CreateChurchDto = {
      slug: slug || `church-${Date.now()}`,
      region,
      city,
      diocese,
      isMonastery,
      coordinates: { lat, lng },
      contacts: { phone, email, website, addressLine },
      translations,
    };

    try {
      const res = await fetch('http://localhost:4000/api/v1/churches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setChurches([created, ...churches]);
        setActionSuccess(`Church "${created.slug}" submitted for diocese verification.`);
        setShowModal(false);
        // Reset
        setSlug('');
        setAmName('');
        setGezName('');
        setEnName('');
      } else {
        const err = await res.json();
        setActionError(err.error?.message || 'Failed to submit church profile.');
      }
    } catch {
      setActionError('Error communicating with the API.');
    }
  };

  const handleVerifyChurch = async (churchId: string, decision: 'APPROVE' | 'REJECT') => {
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`http://localhost:4000/api/v1/churches/${churchId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          notes: claimNotes,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setChurches((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setActionSuccess(
          decision === 'APPROVE'
            ? 'Church verification APPROVED. Profile is now canonically PUBLISHED.'
            : 'Church verification REJECTED.',
        );
        setShowClaimModal(false);
      } else {
        const err = await res.json();
        setActionError(err.error?.message || 'Verification update failed.');
      }
    } catch {
      setActionError('Error connecting to the API.');
    }
  };

  const getPrimaryName = (church: ChurchDto) => {
    const am = church.translations.find((t) => t.locale === 'am');
    if (am) return am.name;
    const gez = church.translations.find((t) => t.locale === 'gez');
    if (gez) return gez.name;
    const en = church.translations.find((t) => t.locale === 'en');
    if (en) return en.name;
    return church.slug;
  };

  const filteredChurches = churches.filter((c) => {
    if (regionFilter !== 'ALL' && c.region !== regionFilter) return false;
    if (statusFilter !== 'ALL' && c.verificationStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSlug = c.slug.toLowerCase().includes(q);
      const matchName = c.translations.some(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q),
      );
      const matchLoc =
        c.city?.toLowerCase().includes(q) || c.region?.toLowerCase().includes(q);
      if (!matchSlug && !matchName && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-eotc-gold mb-1">
            <Church className="w-4 h-4" />
            <span>Diocese, Parish & Monastery Governance (Sections 3, 12, 13)</span>
          </div>
          <h1 className="text-2xl font-bold text-white heading-font">
            Churches, Monasteries & Diocesan Registry
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Parish geolocation, trilingual heritage records, representative claim validation, and canonical verification.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-eotc-crimson hover:bg-eotc-crimson-light text-xs font-bold text-white transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Register Parish / Monastery</span>
        </button>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-400 font-bold ml-2">✕</button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-red-400 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Total Churches</div>
          <div className="text-2xl font-bold text-white heading-font">{churches.length}</div>
        </div>
        <div className="p-4 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">Canonical Verified</div>
          <div className="text-2xl font-bold text-emerald-300 heading-font">
            {churches.filter((c) => c.verificationStatus === VerificationStatus.VERIFIED).length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-amber-900/40 bg-amber-950/20 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">Pending Verification</div>
          <div className="text-2xl font-bold text-amber-300 heading-font">
            {churches.filter((c) => c.verificationStatus === VerificationStatus.PENDING_REVIEW).length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-purple-900/40 bg-purple-950/20 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-purple-400 font-semibold">Ancient Monasteries</div>
          <div className="text-2xl font-bold text-purple-300 heading-font">
            {churches.filter((c) => c.isMonastery).length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border border-neutral-800 bg-neutral-900/50">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parish by name, diocese, city..."
            className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950 border border-neutral-800">
            {(['ALL', VerificationStatus.VERIFIED, VerificationStatus.PENDING_REVIEW, VerificationStatus.UNVERIFIED] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === st ? 'bg-neutral-800 text-eotc-gold shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Region Dropdown */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Regions & Diaspora</option>
            <option value="Addis Ababa">Addis Ababa</option>
            <option value="Amhara">Amhara</option>
            <option value="Tigray">Tigray</option>
            <option value="Oromia">Oromia</option>
            <option value="Diaspora - North America">Diaspora - North America</option>
          </select>
        </div>
      </div>

      {/* Churches Directory Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="px-5 py-3.5">Parish / Monastery</th>
                <th className="px-5 py-3.5">Diocese & Region</th>
                <th className="px-5 py-3.5">Geolocation</th>
                <th className="px-5 py-3.5">Representative Claim</th>
                <th className="px-5 py-3.5">Verification</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {filteredChurches.map((church) => {
                const primary = getPrimaryName(church);
                const activeMem = church.memberships?.find((m) => m.status === 'ACTIVE');
                const pendingMem = church.memberships?.find((m) => m.status === 'PENDING');

                return (
                  <tr key={church.id} className="hover:bg-neutral-800/40 transition-colors">
                    {/* Name & Type */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm heading-font">
                            {primary}
                          </span>
                          {church.isMonastery && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                              ገዳም / Monastery
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                          <span className="font-mono text-eotc-gold/80">/{church.slug}</span>
                          {church.city && <span>• {church.city}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Diocese & Region */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-white">{church.diocese || 'General Diocese'}</div>
                        <div className="text-neutral-400 text-[11px]">{church.region || '—'}</div>
                      </div>
                    </td>

                    {/* Geolocation */}
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-[11px]">
                      {church.coordinates ? (
                        <a
                          href={`https://www.google.com/maps?q=${church.coordinates.lat ?? church.coordinates.latitude},${church.coordinates.lng ?? church.coordinates.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-eotc-gold hover:underline"
                        >
                          <MapPin className="w-3.5 h-3.5 text-eotc-crimson" />
                          <span>
                            {(church.coordinates.lat ?? church.coordinates.latitude ?? 0).toFixed(4)}, {(church.coordinates.lng ?? church.coordinates.longitude ?? 0).toFixed(4)}
                          </span>
                        </a>
                      ) : (
                        <span className="text-neutral-500">No GPS coords</span>
                      )}
                    </td>

                    {/* Representative Claim */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {activeMem ? (
                        <div className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{activeMem.userName || activeMem.userEmail}</span>
                        </div>
                      ) : pendingMem ? (
                        <div className="inline-flex items-center gap-1.5 text-amber-400 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Claim Pending: {pendingMem.userName || pendingMem.userEmail}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-500 italic">Unclaimed</span>
                      )}
                    </td>

                    {/* Verification Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          church.verificationStatus === VerificationStatus.VERIFIED
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : church.verificationStatus === VerificationStatus.PENDING_REVIEW
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {church.verificationStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {church.verificationStatus === VerificationStatus.PENDING_REVIEW && (
                          <button
                            onClick={() => {
                              setSelectedChurchForClaim(church);
                              setShowClaimModal(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-eotc-gold/20 hover:bg-eotc-gold/30 border border-eotc-gold/60 text-eotc-gold font-bold text-[11px] transition-colors"
                          >
                            Review Claim
                          </button>
                        )}

                        <a
                          href={`/am/churches`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          title="View in public directory"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Claim Modal */}
      {showClaimModal && selectedChurchForClaim && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-white">Review Church & Claim Credentials</h3>
              <button
                onClick={() => setShowClaimModal(false)}
                className="text-neutral-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3 text-neutral-300">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="font-bold text-white">{getPrimaryName(selectedChurchForClaim)}</div>
                <div className="text-neutral-400">{selectedChurchForClaim.diocese} • {selectedChurchForClaim.region}</div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Verification Audit Notes:</label>
                <textarea
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => handleVerifyChurch(selectedChurchForClaim.id, 'REJECT')}
                  className="px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 font-bold"
                >
                  Reject Verification
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifyChurch(selectedChurchForClaim.id, 'APPROVE')}
                  className="px-5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 font-bold"
                >
                  Canonical Approve & Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Registering New Church */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white heading-font">
                  Register Parish, Monastery or Diocese
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Section 3 & 12: Geolocation, contacts, trilingual history, and diocese association.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateChurch} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">URL Identifier (Slug):</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. debre-selam-saint-michael"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-eotc-gold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Region / Diocese Jurisdiction:</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-eotc-gold"
                  >
                    <option value="Addis Ababa">Addis Ababa</option>
                    <option value="Amhara">Amhara</option>
                    <option value="Tigray">Tigray</option>
                    <option value="Oromia">Oromia</option>
                    <option value="Southern Ethiopia">Southern Ethiopia</option>
                    <option value="Diaspora - North America">Diaspora - North America</option>
                    <option value="Diaspora - Europe">Diaspora - Europe</option>
                    <option value="Diaspora - Middle East">Diaspora - Middle East</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">City / Specific Town:</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bahir Dar, Addis Ababa, Washington DC"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-eotc-gold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Diocese Name:</label>
                  <input
                    type="text"
                    value={diocese}
                    onChange={(e) => setDiocese(e.target.value)}
                    placeholder="e.g. West Gojjam Diocese"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-eotc-gold"
                  />
                </div>
              </div>

              {/* Coordinates and Monastery Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">GPS Latitude:</label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-eotc-gold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">GPS Longitude:</label>
                  <input
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-eotc-gold"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <input
                    type="checkbox"
                    id="monastery"
                    checked={isMonastery}
                    onChange={(e) => setIsMonastery(e.target.checked)}
                    className="rounded border-neutral-700 mr-2"
                  />
                  <label htmlFor="monastery" className="text-white font-semibold cursor-pointer">
                    Ancient Monastery (ገዳም)
                  </label>
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Telephone / Office Phone:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Official Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parish@eotc-platform.org"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              {/* Trilingual Tabs */}
              <div className="pt-2">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-eotc-gold" />
                    <span>Church Profile Translations</span>
                  </span>

                  <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950 border border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setModalTab('am')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        modalTab === 'am' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-neutral-400'
                      }`}
                    >
                      Amharic (አማርኛ) *
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab('gez')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        modalTab === 'gez' ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'text-neutral-400'
                      }`}
                    >
                      Ge'ez (ግዕዝ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab('en')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        modalTab === 'en' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'text-neutral-400'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {modalTab === 'am' && (
                  <div className="space-y-3 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">የቤተክርስቲያኑ ስም (Name) *:</label>
                      <input
                        type="text"
                        value={amName}
                        onChange={(e) => setAmName(e.target.value)}
                        placeholder="ምሳሌ፡ ደብረ ምሕረት ቅዱስ ሚካኤል ቤተክርስቲያን"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">መግለጫ (Description):</label>
                      <textarea
                        value={amDesc}
                        onChange={(e) => setAmDesc(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">ታሪክና አጀማመር (History):</label>
                      <textarea
                        value={amHist}
                        onChange={(e) => setAmHist(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                  </div>
                )}

                {modalTab === 'gez' && (
                  <div className="space-y-3 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">ስመ ቤተክርስቲያን (Ge'ez Name):</label>
                      <input
                        type="text"
                        value={gezName}
                        onChange={(e) => setGezName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">መግለጺ (Ge'ez Description):</label>
                      <textarea
                        value={gezDesc}
                        onChange={(e) => setGezDesc(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                  </div>
                )}

                {modalTab === 'en' && (
                  <div className="space-y-3 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Church Name in English:</label>
                      <input
                        type="text"
                        value={enName}
                        onChange={(e) => setEnName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Description:</label>
                      <textarea
                        value={enDesc}
                        onChange={(e) => setEnDesc(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-eotc-crimson hover:bg-eotc-crimson-light text-white font-bold"
                >
                  Submit Church Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
