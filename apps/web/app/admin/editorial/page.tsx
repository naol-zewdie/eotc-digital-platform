'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  History,
  Send,
  Eye,
  Languages,
  Newspaper,
  BookMarked,
  Archive,
  Clock,
  User,
  ChevronRight,
} from 'lucide-react';
import {
  ArticleType,
  ContentStatus,
  ArticleDto,
  ArticleRevisionDto,
  CreateArticleDto,
} from '@eotc/contracts';

export default function AdminEditorialPage() {
  const [articles, setArticles] = useState<ArticleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedArticleForRevs, setSelectedArticleForRevs] = useState<ArticleDto | null>(null);
  const [revisions, setRevisions] = useState<ArticleRevisionDto[]>([]);
  const [showRevsModal, setShowRevsModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form State
  const [slug, setSlug] = useState('');
  const [articleType, setArticleType] = useState<ArticleType>(ArticleType.NEWS);
  const [modalTab, setModalTab] = useState<'am' | 'en'>('am');

  const [amTitle, setAmTitle] = useState('');
  const [amSummary, setAmSummary] = useState('');
  const [amMarkdown, setAmMarkdown] = useState('');

  const [enTitle, setEnTitle] = useState('');
  const [enSummary, setEnSummary] = useState('');
  const [enMarkdown, setEnMarkdown] = useState('');

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/editorial/articles?isStaff=true');
      if (res.ok) setArticles(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    const translations = [];
    if (amTitle.trim()) {
      translations.push({
        locale: 'am',
        title: amTitle,
        summary: amSummary,
        contentMarkdown: amMarkdown,
      });
    }
    if (enTitle.trim()) {
      translations.push({
        locale: 'en',
        title: enTitle,
        summary: enSummary,
        contentMarkdown: enMarkdown,
      });
    }

    if (translations.length === 0) {
      setActionError('At least one title in Amharic or English is required.');
      return;
    }

    const payload: CreateArticleDto = {
      slug: slug || `art-${Date.now()}`,
      type: articleType,
      translations,
    };

    try {
      const res = await fetch('http://localhost:4000/api/v1/editorial/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setArticles([created, ...articles]);
        setActionSuccess(`Article "${created.slug}" saved as DRAFT.`);
        setShowModal(false);
        setSlug('');
        setAmTitle('');
        setAmSummary('');
        setAmMarkdown('');
      } else {
        const err = await res.json();
        setActionError(err.error?.message || 'Failed to save article.');
      }
    } catch {
      setActionError('Network error connecting to API.');
    }
  };

  const handleViewRevisions = async (article: ArticleDto) => {
    setSelectedArticleForRevs(article);
    setShowRevsModal(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/editorial/articles/${article.id}/revisions`);
      if (res.ok) {
        setRevisions(await res.json());
      } else {
        setRevisions(article.revisions || []);
      }
    } catch {
      setRevisions(article.revisions || []);
    }
  };

  const handleTransition = async (id: string, targetStatus: ContentStatus) => {
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`http://localhost:4000/api/v1/editorial/articles/${id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        setActionSuccess(`Article transitioned to ${targetStatus}.`);
      } else {
        const err = await res.json();
        setActionError(err.error?.message || 'Transition rejected.');
      }
    } catch {
      setActionError('Connection error.');
    }
  };

  const getPrimaryTitle = (a: ArticleDto) => {
    const am = a.translations.find((t) => t.locale === 'am');
    if (am) return am.title;
    const en = a.translations.find((t) => t.locale === 'en');
    if (en) return en.title;
    return a.slug;
  };

  const filtered = articles.filter((a) => {
    if (typeFilter !== 'ALL' && a.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSlug = a.slug.toLowerCase().includes(q);
      const matchTitle = a.translations.some(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.summary?.toLowerCase().includes(q),
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
            <Newspaper className="w-4 h-4" />
            <span>Editorial Desk: Official Communiques & Theological Articles (Section 13 & 32)</span>
          </div>
          <h1 className="text-2xl font-bold text-white heading-font">
            Patriarchal News, Articles & Revision Audit
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Official Holy Synod proclamations, patristic treatises, Markdown body composition, and historical change tracking.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-eotc-crimson hover:bg-eotc-crimson-light text-xs font-bold text-white transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Article / Release</span>
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
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Total Releases</div>
          <div className="text-2xl font-bold text-white heading-font">{articles.length}</div>
        </div>
        <div className="p-4 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">Published Communiques</div>
          <div className="text-2xl font-bold text-emerald-300 heading-font">
            {articles.filter((a) => a.status === ContentStatus.PUBLISHED).length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-blue-900/40 bg-blue-950/20 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold">Official News</div>
          <div className="text-2xl font-bold text-blue-300 heading-font">
            {articles.filter((a) => a.type === ArticleType.NEWS).length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-purple-900/40 bg-purple-950/20 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-purple-400 font-semibold">Theological Treatises</div>
          <div className="text-2xl font-bold text-purple-300 heading-font">
            {articles.filter((a) => a.type === ArticleType.ARTICLE).length}
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
            placeholder="Search news by title or content..."
            className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Type Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950 border border-neutral-800">
            {(['ALL', ArticleType.NEWS, ArticleType.ARTICLE] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  typeFilter === t ? 'bg-neutral-800 text-eotc-gold shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950 border border-neutral-800">
            {(['ALL', ContentStatus.PUBLISHED, ContentStatus.IN_REVIEW, ContentStatus.DRAFT] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === s ? 'bg-neutral-800 text-eotc-gold shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Directory Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="px-5 py-3.5">Title & Communique</th>
                <th className="px-5 py-3.5">Category Type</th>
                <th className="px-5 py-3.5">Author / Origin</th>
                <th className="px-5 py-3.5">Audit History</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {filtered.map((a) => {
                const primary = getPrimaryTitle(a);
                const revCount = a.revisions?.length ?? 1;

                return (
                  <tr key={a.id} className="hover:bg-neutral-800/40 transition-colors">
                    {/* Title */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="font-bold text-white text-sm heading-font line-clamp-1">
                          {primary}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                          <span className="font-mono text-eotc-gold/80">/{a.slug}</span>
                          <span>• {a.viewCount} reads</span>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          a.type === ArticleType.NEWS
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-purple-950 text-purple-300 border border-purple-800'
                        }`}
                      >
                        {a.type}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{a.authorName || 'Holy Synod Secretariat'}</div>
                      <div className="text-[10px] text-neutral-500">{a.churchSlug || 'Patriarchate Global'}</div>
                    </td>

                    {/* Revision History */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewRevisions(a)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-eotc-gold text-[11px] font-semibold transition-colors"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>{revCount} Revisions</span>
                      </button>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          a.status === ContentStatus.PUBLISHED
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : a.status === ContentStatus.APPROVED
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : a.status === ContentStatus.IN_REVIEW
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {a.status === ContentStatus.DRAFT && (
                          <button
                            onClick={() => handleTransition(a.id, ContentStatus.IN_REVIEW)}
                            className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Submit</span>
                          </button>
                        )}

                        {a.status === ContentStatus.IN_REVIEW && (
                          <button
                            onClick={() => handleTransition(a.id, ContentStatus.APPROVED)}
                            className="px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}

                        {a.status === ContentStatus.APPROVED && (
                          <button
                            onClick={() => handleTransition(a.id, ContentStatus.PUBLISHED)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 text-[11px] font-bold transition-colors"
                          >
                            Publish
                          </button>
                        )}

                        {a.status === ContentStatus.PUBLISHED && (
                          <button
                            onClick={() => handleTransition(a.id, ContentStatus.ARCHIVED)}
                            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-colors"
                          >
                            Archive
                          </button>
                        )}

                        <a
                          href={`/am/articles`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          title="View on portal"
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

      {/* Revision History Modal */}
      {showRevsModal && selectedArticleForRevs && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Revision Audit Log</h3>
                <p className="text-[11px] text-neutral-400">
                  {selectedArticleForRevs.slug} • Chronological edit history
                </p>
              </div>
              <button onClick={() => setShowRevsModal(false)} className="text-neutral-500 hover:text-white text-sm">✕</button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {revisions.map((rev, idx) => (
                <div key={rev.id || idx} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span className="flex items-center gap-1.5 text-eotc-gold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{rev.comment || 'Editorial revision'}</span>
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rev.diff && (
                    <div className="text-[11px] text-neutral-400 font-mono bg-neutral-900/80 p-2 rounded-lg border border-neutral-800">
                      {rev.diff}
                    </div>
                  )}
                  {rev.editorName && (
                    <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>Editor: {rev.editorName}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Article Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-white heading-font">
                Draft Communique or Theological Treatise
              </h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">URL Slug (Identifier):</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. meskel-communique-2026"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Release Category:</label>
                  <select
                    value={articleType}
                    onChange={(e) => setArticleType(e.target.value as ArticleType)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    <option value={ArticleType.NEWS}>NEWS (Official Synod / Diocesan News)</option>
                    <option value={ArticleType.ARTICLE}>ARTICLE (Theological Treatise / Teaching)</option>
                  </select>
                </div>
              </div>

              {/* Trilingual Tabs */}
              <div className="pt-2">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-eotc-gold" />
                    <span>Language Records</span>
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
                      <label className="block text-neutral-400 mb-1 font-semibold">የርዕስ ስም (Title) *:</label>
                      <input
                        type="text"
                        value={amTitle}
                        onChange={(e) => setAmTitle(e.target.value)}
                        placeholder="ምሳሌ፡ የቅዱስ ሲኖዶስ ውሳኔ መግለጫ"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">ማጠቃለያ (Summary):</label>
                      <textarea
                        value={amSummary}
                        onChange={(e) => setAmSummary(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">ሙሉ ይዘት በMarkdown (Content):</label>
                      <textarea
                        value={amMarkdown}
                        onChange={(e) => setAmMarkdown(e.target.value)}
                        rows={5}
                        placeholder="# ዋና ርዕስ&#10;&#10;ይዘት በMarkdown ቅርጸት..."
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono"
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
                        placeholder="e.g. Official Statement of the Holy Synod"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Summary:</label>
                      <textarea
                        value={enSummary}
                        onChange={(e) => setEnSummary(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">Full Markdown Content:</label>
                      <textarea
                        value={enMarkdown}
                        onChange={(e) => setEnMarkdown(e.target.value)}
                        rows={5}
                        placeholder="# Heading&#10;&#10;Body text in Markdown..."
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono"
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
                  Save Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
