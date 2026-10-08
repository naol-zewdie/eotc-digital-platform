'use client';

import React, { useState, useEffect } from 'react';
import {
  Music,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Play,
  Volume2,
  Users,
  ShieldCheck,
  Send,
  Eye,
  FileText,
  Languages,
  Archive,
} from 'lucide-react';
import {
  ContentStatus,
  RightsStatus,
  MezmurDto,
  ArtistDto,
  CreateMezmurDto,
  CreateArtistDto,
  RightsRecordDto,
} from '@eotc/contracts';

export default function AdminMezmurPage() {
  const [mezmurs, setMezmurs] = useState<MezmurDto[]>([]);
  const [artists, setArtists] = useState<ArtistDto[]>([]);
  const [rightsRecords, setRightsRecords] = useState<RightsRecordDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [artistFilter, setArtistFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [selectedLyricsMezmur, setSelectedLyricsMezmur] = useState<MezmurDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Mezmur Form State
  const [slug, setSlug] = useState('');
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [selectedRightsId, setSelectedRightsId] = useState('rights-pub-001');
  const [audioFileId, setAudioFileId] = useState('file-002');
  const [modalTab, setModalTab] = useState<'am' | 'gez' | 'en'>('am');

  const [amTitle, setAmTitle] = useState('');
  const [amLyrics, setAmLyrics] = useState('');
  const [amDesc, setAmDesc] = useState('');

  const [gezTitle, setGezTitle] = useState('');
  const [gezLyrics, setGezLyrics] = useState('');
  const [gezDesc, setGezDesc] = useState('');

  const [enTitle, setEnTitle] = useState('');
  const [enLyrics, setEnLyrics] = useState('');
  const [enDesc, setEnDesc] = useState('');

  // Artist Form State
  const [artistSlug, setArtistSlug] = useState('');
  const [artistNameAm, setArtistNameAm] = useState('');
  const [artistNameEn, setArtistNameEn] = useState('');
  const [isChoir, setIsChoir] = useState(true);
  const [artistBio, setArtistBio] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, aRes, rRes] = await Promise.all([
        fetch('http://localhost:4000/api/v1/mezmur?isStaff=true'),
        fetch('http://localhost:4000/api/v1/mezmur/artists'),
        fetch('http://localhost:4000/api/v1/rights'),
      ]);

      if (mRes.ok) setMezmurs(await mRes.json());
      if (aRes.ok) {
        const aData = await aRes.json();
        setArtists(aData);
        if (aData.length > 0) setSelectedArtistId(aData[0].id);
      }
      if (rRes.ok) setRightsRecords(await rRes.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMezmur = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    const translations = [];
    if (amTitle.trim()) {
      translations.push({
        locale: 'am',
        title: amTitle,
        lyrics: amLyrics,
        description: amDesc,
      });
    }
    if (gezTitle.trim()) {
      translations.push({
        locale: 'gez',
        title: gezTitle,
        lyrics: gezLyrics,
        description: gezDesc,
      });
    }
    if (enTitle.trim()) {
      translations.push({
        locale: 'en',
        title: enTitle,
        lyrics: enLyrics,
        description: enDesc,
      });
    }

    if (translations.length === 0) {
      setActionError('At least one title in Amharic, Ge\'ez, or English is required.');
      return;
    }

    const payload: CreateMezmurDto = {
      slug: slug || `mezmur-${Date.now()}`,
      artistId: selectedArtistId,
      rightsId: selectedRightsId,
      audioFileId,
      translations,
    };

    try {
      const res = await fetch('http://localhost:4000/api/v1/mezmur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setMezmurs([created, ...mezmurs]);
        setActionSuccess(`Hymn "${created.slug}" registered as DRAFT.`);
        setShowModal(false);
        setSlug('');
        setAmTitle('');
        setAmLyrics('');
      } else {
        const err = await res.json();
        setActionError(err.error?.message || 'Failed to register hymn.');
      }
    } catch {
      setActionError('Network error connecting to API.');
    }
  };

  const handleCreateArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    const payload: CreateArtistDto = {
      slug: artistSlug || `artist-${Date.now()}`,
      nameAm: artistNameAm,
      nameEn: artistNameEn,
      isChoir,
      bioAm: artistBio,
    };

    try {
      const res = await fetch('http://localhost:4000/api/v1/mezmur/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setArtists([...artists, created]);
        setSelectedArtistId(created.id);
        setShowArtistModal(false);
        setActionSuccess(`Artist / Choir "${created.nameAm}" added.`);
        setArtistNameAm('');
        setArtistNameEn('');
      }
    } catch {}
  };

  const handleTransition = async (id: string, targetStatus: ContentStatus) => {
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`http://localhost:4000/api/v1/mezmur/${id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setMezmurs((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        setActionSuccess(`Mezmur transitioned to ${targetStatus}.`);
      } else {
        const err = await res.json();
        setActionError(err.error?.message || 'Transition rejected.');
      }
    } catch {
      setActionError('Connection error.');
    }
  };

  const getPrimaryTitle = (m: MezmurDto) => {
    const am = m.translations.find((t) => t.locale === 'am');
    if (am) return am.title;
    const gez = m.translations.find((t) => t.locale === 'gez');
    if (gez) return gez.title;
    const en = m.translations.find((t) => t.locale === 'en');
    if (en) return en.title;
    return m.slug;
  };

  const filtered = mezmurs.filter((m) => {
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    if (artistFilter !== 'ALL' && m.artistId !== artistFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSlug = m.slug.toLowerCase().includes(q);
      const matchTitle = m.translations.some(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.lyrics?.toLowerCase().includes(q),
      );
      if (!matchSlug && !matchTitle) return false;
    }
    return true;
  });

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-eotc-gold mb-1">
            <Music className="w-4 h-4" />
            <span>Sacred Hymnody & Saint Yared Zema Catalog (Sections 12, 13, 14)</span>
          </div>
          <h1 className="text-2xl font-bold text-white heading-font">
            Liturgical Mezmurs, Hymnody & Choirs
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Multilingual stanzas & lyrics (Amharic, Ge'ez, English), audio streaming linkage, and rights validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArtistModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-200 transition-colors"
          >
            <Users className="w-4 h-4 text-eotc-gold" />
            <span>Add Artist / Choir</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-eotc-crimson hover:bg-eotc-crimson-light text-xs font-bold text-white transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Register Mezmur</span>
          </button>
        </div>
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
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Total Hymns</div>
          <div className="text-2xl font-bold text-white heading-font">{mezmurs.length}</div>
        </div>
        <div className="p-4 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">Published Chants</div>
          <div className="text-2xl font-bold text-emerald-300 heading-font">
            {mezmurs.filter((m) => m.status === ContentStatus.PUBLISHED).length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-amber-900/40 bg-amber-950/20 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">In Review Queue</div>
          <div className="text-2xl font-bold text-amber-300 heading-font">
            {mezmurs.filter((m) => m.status === ContentStatus.IN_REVIEW).length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-blue-900/40 bg-blue-950/20 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold">Choirs & Artists</div>
          <div className="text-2xl font-bold text-blue-300 heading-font">{artists.length}</div>
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
            placeholder="Search mezmur by title, lyrics stanza, choir..."
            className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950 border border-neutral-800">
            {(['ALL', ContentStatus.PUBLISHED, ContentStatus.IN_REVIEW, ContentStatus.DRAFT] as const).map((st) => (
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

          {/* Artist Dropdown */}
          <select
            value={artistFilter}
            onChange={(e) => setArtistFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Choirs & Vocalists</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nameAm}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mezmur Directory Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="px-5 py-3.5">Hymn Title & Details</th>
                <th className="px-5 py-3.5">Artist / Choir</th>
                <th className="px-5 py-3.5">Lyrics & Verses</th>
                <th className="px-5 py-3.5">Rights Status</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {filtered.map((m) => {
                const primary = getPrimaryTitle(m);
                const hasLyrics = m.translations.some((t) => t.lyrics && t.lyrics.trim().length > 0);

                return (
                  <tr key={m.id} className="hover:bg-neutral-800/40 transition-colors">
                    {/* Title */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="font-bold text-white text-sm heading-font">{primary}</div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                          <span className="font-mono text-eotc-gold/80">/{m.slug}</span>
                          <span>• {m.playCount} plays</span>
                        </div>
                      </div>
                    </td>

                    {/* Artist */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">
                        {m.artist?.nameAm || 'Holy Synod Tradition'}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {m.artist?.isChoir ? 'Parish / Monastic Choir' : 'Solo Vocalist'}
                      </div>
                    </td>

                    {/* Lyrics Preview */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {hasLyrics ? (
                        <button
                          onClick={() => setSelectedLyricsMezmur(m)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-eotc-gold text-[11px] font-semibold transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Stanzas</span>
                        </button>
                      ) : (
                        <span className="text-neutral-500 italic">No lyrics text</span>
                      )}
                    </td>

                    {/* Rights Record Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.rights?.status === RightsStatus.PUBLIC_DOMAIN
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {m.rights?.status || 'UNKNOWN'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          m.status === ContentStatus.PUBLISHED
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : m.status === ContentStatus.APPROVED
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : m.status === ContentStatus.IN_REVIEW
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {m.status === ContentStatus.DRAFT && (
                          <button
                            onClick={() => handleTransition(m.id, ContentStatus.IN_REVIEW)}
                            className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Submit</span>
                          </button>
                        )}

                        {m.status === ContentStatus.IN_REVIEW && (
                          <button
                            onClick={() => handleTransition(m.id, ContentStatus.APPROVED)}
                            className="px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}

                        {m.status === ContentStatus.APPROVED && (
                          <button
                            onClick={() => handleTransition(m.id, ContentStatus.PUBLISHED)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 text-[11px] font-bold transition-colors"
                          >
                            Publish
                          </button>
                        )}

                        {m.status === ContentStatus.PUBLISHED && (
                          <button
                            onClick={() => handleTransition(m.id, ContentStatus.ARCHIVED)}
                            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-colors"
                          >
                            Archive
                          </button>
                        )}

                        <a
                          href={`/am/mezmur`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          title="View in public mezmur player"
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

      {/* Lyrics Viewer Modal */}
      {selectedLyricsMezmur && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">{getPrimaryTitle(selectedLyricsMezmur)}</h3>
                <p className="text-[11px] text-neutral-400">
                  {selectedLyricsMezmur.artist?.nameAm} • Liturgical Stanzas
                </p>
              </div>
              <button onClick={() => setSelectedLyricsMezmur(null)} className="text-neutral-500 hover:text-white text-sm">✕</button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedLyricsMezmur.translations.map((t) => (
                <div key={t.locale} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-eotc-gold border-b border-neutral-800/80 pb-1.5">
                    <span>{t.locale === 'am' ? 'አማርኛ ስንኞች' : t.locale === 'gez' ? 'ግዕዝ ማኅሌት' : 'English Translation'}</span>
                    <span className="text-[10px] text-neutral-500 uppercase">{t.locale}</span>
                  </div>
                  <pre className="text-xs text-neutral-200 font-sans whitespace-pre-wrap leading-relaxed">
                    {t.lyrics || 'No lyrics text recorded.'}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Register Mezmur Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-white heading-font">Register Liturgical Mezmur</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateMezmur} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">URL Identifier (Slug):</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. egziabher-mulu-new"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Choir / Artist:</label>
                  <select
                    value={selectedArtistId}
                    onChange={(e) => setSelectedArtistId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    {artists.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nameAm} ({a.nameEn})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Rights Provenance:</label>
                  <select
                    value={selectedRightsId}
                    onChange={(e) => setSelectedRightsId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    {rightsRecords.map((r) => (
                      <option key={r.id} value={r.id}>
                        [{r.status}] {r.rightsHolder}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Audio File Key:</label>
                  <input
                    type="text"
                    value={audioFileId}
                    onChange={(e) => setAudioFileId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>

              {/* Trilingual Tabs */}
              <div className="pt-2">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-eotc-gold" />
                    <span>Multilingual Titles & Lyrics Stanzas</span>
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
                      <label className="block text-neutral-400 mb-1 font-semibold">የመዝሙር ርዕስ (Title) *:</label>
                      <input
                        type="text"
                        value={amTitle}
                        onChange={(e) => setAmTitle(e.target.value)}
                        placeholder="ምሳሌ፡ ኔና ማርያም ኔና"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">የመዝሙር ግጥምና ስንኞች (Lyrics Stanzas):</label>
                      <textarea
                        value={amLyrics}
                        onChange={(e) => setAmLyrics(e.target.value)}
                        rows={4}
                        placeholder="ሙሉ ስንኞቹን በየመስመሩ አስገባ..."
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-sans"
                      />
                    </div>
                  </div>
                )}

                {modalTab === 'gez' && (
                  <div className="space-y-3 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">ርእሰ ዜማ (Ge'ez Title):</label>
                      <input
                        type="text"
                        value={gezTitle}
                        onChange={(e) => setGezTitle(e.target.value)}
                        placeholder="ምሳሌ፡ ንዒ ማርያም ንዒ"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">ስብሐት ወማኅሌት (Ge'ez Stanzas):</label>
                      <textarea
                        value={gezLyrics}
                        onChange={(e) => setGezLyrics(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-sans"
                      />
                    </div>
                  </div>
                )}

                {modalTab === 'en' && (
                  <div className="space-y-3 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">English Title:</label>
                      <input
                        type="text"
                        value={enTitle}
                        onChange={(e) => setEnTitle(e.target.value)}
                        placeholder="e.g. Come O Virgin Mary"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Lyrics / Hymn Translation:</label>
                      <textarea
                        value={enLyrics}
                        onChange={(e) => setEnLyrics(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-sans"
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
                  Save Hymn Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Artist Modal */}
      {showArtistModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-white">Add Choir or Vocalist</h3>
              <button onClick={() => setShowArtistModal(false)} className="text-neutral-500 hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateArtist} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Choir / Artist Name (Amharic) *:</label>
                <input
                  type="text"
                  required
                  value={artistNameAm}
                  onChange={(e) => setArtistNameAm(e.target.value)}
                  placeholder="ምሳሌ፡ የደብረ ሰላም መዘምራን"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Name in English *:</label>
                <input
                  type="text"
                  required
                  value={artistNameEn}
                  onChange={(e) => setArtistNameEn(e.target.value)}
                  placeholder="e.g. Debre Selam Youth Choir"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>
              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="isChoirBox"
                  checked={isChoir}
                  onChange={(e) => setIsChoir(e.target.checked)}
                  className="rounded border-neutral-700 mr-2"
                />
                <label htmlFor="isChoirBox" className="text-white font-semibold cursor-pointer">
                  Group / Parish Choir (መዘምራን)
                </label>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowArtistModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-eotc-crimson text-white font-bold"
                >
                  Save Artist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
