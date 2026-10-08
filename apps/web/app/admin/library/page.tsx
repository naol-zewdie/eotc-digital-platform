'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  Send,
  Eye,
  FileCheck,
  ShieldCheck,
  Languages,
  AlertCircle,
  FileText,
  Lock,
  Download,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  ContentStatus,
  RightsStatus,
  BookDto,
  CategoryDto,
  CreateBookDto,
  RightsRecordDto,
} from '@eotc/contracts';

export default function AdminLibraryPage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [rightsRecords, setRightsRecords] = useState<RightsRecordDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Current active user from localStorage (simulated role in admin shell)
  const [currentUser, setCurrentUser] = useState({
    id: 'user-admin-001',
    displayName: 'EOTC Patriarchate Administrator',
    role: 'SUPER_ADMINISTRATOR',
    churchSlug: '',
  });

  // Modal Form State
  const [modalTab, setModalTab] = useState<'am' | 'gez' | 'en'>('am');
  const [slug, setSlug] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cat-liturgical');
  const [publishedYear, setPublishedYear] = useState<number>(1951);
  const [selectedRightsId, setSelectedRightsId] = useState('rights-pub-001');
  const [fileId, setFileId] = useState('file-003');
  const [churchId, setChurchId] = useState('patriarchate');

  // Translations
  const [amTitle, setAmTitle] = useState('');
  const [amDesc, setAmDesc] = useState('');
  const [amAuthor, setAmAuthor] = useState('');
  const [amPublisher, setAmPublisher] = useState('');

  const [gezTitle, setGezTitle] = useState('');
  const [gezDesc, setGezDesc] = useState('');
  const [gezAuthor, setGezAuthor] = useState('');
  const [gezPublisher, setGezPublisher] = useState('');

  const [enTitle, setEnTitle] = useState('');
  const [enDesc, setEnDesc] = useState('');
  const [enAuthor, setEnAuthor] = useState('');
  const [enPublisher, setEnPublisher] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('eotc_admin_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser({
          id:
            parsed.role === 'SUPER_ADMINISTRATOR'
              ? 'user-admin-001'
              : parsed.role === 'CHURCH_REPRESENTATIVE'
              ? 'user-rep-001'
              : parsed.role === 'MODERATOR'
              ? 'user-reviewer-001'
              : 'user-editor-001',
          displayName: parsed.displayName,
          role: parsed.role,
          churchSlug: parsed.churchMemberships?.[0]?.churchSlug || '',
        });
      } catch {}
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch categories
      const catRes = await fetch('http://localhost:4000/api/v1/library/categories');
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }

      // 2. Fetch rights
      const rRes = await fetch('http://localhost:4000/api/v1/rights');
      if (rRes.ok) {
        const rData = await rRes.json();
        setRightsRecords(rData);
      }

      // 3. Fetch books with staff view
      const bRes = await fetch('http://localhost:4000/api/v1/library/books?isStaff=true');
      if (bRes.ok) {
        const bData = await bRes.json();
        setBooks(bData);
      }
    } catch {
      // API fallback handles offline gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    const translations = [];
    if (amTitle.trim()) {
      translations.push({
        locale: 'am',
        title: amTitle,
        description: amDesc,
        author: amAuthor,
        publisher: amPublisher,
      });
    }
    if (gezTitle.trim()) {
      translations.push({
        locale: 'gez',
        title: gezTitle,
        description: gezDesc,
        author: gezAuthor,
        publisher: gezPublisher,
      });
    }
    if (enTitle.trim()) {
      translations.push({
        locale: 'en',
        title: enTitle,
        description: enDesc,
        author: enAuthor,
        publisher: enPublisher,
      });
    }

    if (translations.length === 0) {
      setActionError('At least one title in Amharic, Ge\'ez, or English is required.');
      return;
    }

    const payload: CreateBookDto = {
      slug: slug || `book-${Date.now()}`,
      categoryId: selectedCategory,
      publishedYear,
      rightsId: selectedRightsId,
      fileId,
      churchId,
      translations,
    };

    try {
      const res = await fetch('http://localhost:4000/api/v1/library/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setBooks([created, ...books]);
        setActionSuccess(`Manuscript "${created.slug}" registered successfully as DRAFT.`);
        setShowModal(false);
        // Reset
        setSlug('');
        setAmTitle('');
        setGezTitle('');
        setEnTitle('');
      } else {
        const err = await res.json();
        setActionError(err.error?.message || 'Failed to create manuscript record.');
      }
    } catch {
      setActionError('Connection error communicating with the API.');
    }
  };

  const handleTransition = async (bookId: string, targetStatus: ContentStatus) => {
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`http://localhost:4000/api/v1/library/books/${bookId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStatus, comment: `Action executed by ${currentUser.role}` }),
      });

      if (res.ok) {
        const updated = await res.json();
        setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        setActionSuccess(`Book transitioned to ${targetStatus} successfully.`);
      } else {
        const errData = await res.json();
        setActionError(errData.error?.message || `Failed to transition book to ${targetStatus}.`);
      }
    } catch {
      setActionError('Error connecting to the API.');
    }
  };

  // Filter books
  const filteredBooks = books.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && b.categoryId !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSlug = b.slug.toLowerCase().includes(q);
      const matchTrans = b.translations.some(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.author?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q),
      );
      if (!matchSlug && !matchTrans) return false;
    }
    return true;
  });

  const getPrimaryTitle = (book: BookDto) => {
    const am = book.translations.find((t) => t.locale === 'am');
    if (am) return { title: am.title, lang: 'Amharic (አማርኛ)' };
    const gez = book.translations.find((t) => t.locale === 'gez');
    if (gez) return { title: gez.title, lang: 'Ge\'ez (ግዕዝ)' };
    const en = book.translations.find((t) => t.locale === 'en');
    if (en) return { title: en.title, lang: 'English' };
    return { title: book.slug, lang: 'Slug' };
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-eotc-gold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Liturgical Manuscript & Book Repository (Sections 3, 13, 14)</span>
          </div>
          <h1 className="text-2xl font-bold text-white heading-font">
            Sacred Books, Canons & Manuscript Governance
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Multilingual translations (Ge'ez, Amharic, English), rights verification, and separation-of-duty publication workflow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-eotc-crimson hover:bg-eotc-crimson-light text-xs font-bold text-white transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Register Manuscript</span>
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

      {/* Governance & State Machine Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Total Manuscripts</div>
          <div className="text-2xl font-bold text-white heading-font">{books.length}</div>
        </div>
        <div className="p-4 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">Canonical Published</div>
          <div className="text-2xl font-bold text-emerald-300 heading-font">
            {books.filter((b) => b.status === ContentStatus.PUBLISHED).length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-amber-900/40 bg-amber-950/20 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">In Review Queue</div>
          <div className="text-2xl font-bold text-amber-300 heading-font">
            {books.filter((b) => b.status === ContentStatus.IN_REVIEW).length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-blue-900/40 bg-blue-950/20 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold">Drafts & Approved</div>
          <div className="text-2xl font-bold text-blue-300 heading-font">
            {books.filter((b) => b.status === ContentStatus.DRAFT || b.status === ContentStatus.APPROVED).length}
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border border-neutral-800 bg-neutral-900/50">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search manuscripts by title, Ge'ez name, author..."
            className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950 border border-neutral-800">
            {(['ALL', ContentStatus.PUBLISHED, ContentStatus.IN_REVIEW, ContentStatus.APPROVED, ContentStatus.DRAFT] as const).map((st) => (
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

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Liturgical Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameAm} ({c.nameEn})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="px-5 py-3.5">Manuscript Title & Details</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Translations</th>
                <th className="px-5 py-3.5">Rights Status</th>
                <th className="px-5 py-3.5">Workflow Status</th>
                <th className="px-5 py-3.5 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {filteredBooks.map((book) => {
                const primary = getPrimaryTitle(book);
                const hasAm = book.translations.some((t) => t.locale === 'am');
                const hasGez = book.translations.some((t) => t.locale === 'gez');
                const hasEn = book.translations.some((t) => t.locale === 'en');

                return (
                  <tr key={book.id} className="hover:bg-neutral-800/40 transition-colors">
                    {/* Title & Author */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="font-bold text-white text-sm heading-font">
                          {primary.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                          <span className="font-mono text-eotc-gold/80">/{book.slug}</span>
                          {book.author && <span>• {book.author}</span>}
                          {book.publishedYear && <span>• {book.publishedYear} ዓ.ም</span>}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-neutral-950 text-neutral-300 border border-neutral-800">
                        {book.category?.nameAm || 'Liturgical Text'}
                      </span>
                    </td>

                    {/* Multilingual Badges */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {hasAm && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800">
                            AM
                          </span>
                        )}
                        {hasGez && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800">
                            GEZ
                          </span>
                        )}
                        {hasEn && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800">
                            EN
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Rights Record Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            book.rights?.status === RightsStatus.PUBLIC_DOMAIN
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : book.rights?.status === RightsStatus.CHURCH_OWNED
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-red-950 text-red-300 border border-red-800'
                          }`}
                        >
                          {book.rights?.status || 'UNKNOWN'}
                        </span>
                        <div className="text-[10px] text-neutral-500 truncate max-w-[130px]">
                          {book.rights?.rightsHolder || 'Unassigned'}
                        </div>
                      </div>
                    </td>

                    {/* Workflow Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          book.status === ContentStatus.PUBLISHED
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : book.status === ContentStatus.APPROVED
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : book.status === ContentStatus.IN_REVIEW
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : book.status === ContentStatus.DRAFT
                            ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>

                    {/* Governance Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {book.status === ContentStatus.DRAFT && (
                          <button
                            onClick={() => handleTransition(book.id, ContentStatus.IN_REVIEW)}
                            className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Submit Review</span>
                          </button>
                        )}

                        {book.status === ContentStatus.IN_REVIEW && (
                          <>
                            <button
                              onClick={() => handleTransition(book.id, ContentStatus.APPROVED)}
                              className="px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleTransition(book.id, ContentStatus.REJECTED)}
                              className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-[11px] font-semibold transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {book.status === ContentStatus.APPROVED && (
                          <button
                            onClick={() => handleTransition(book.id, ContentStatus.PUBLISHED)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                          >
                            <FileCheck className="w-3 h-3" />
                            <span>Publish</span>
                          </button>
                        )}

                        {book.status === ContentStatus.PUBLISHED && (
                          <button
                            onClick={() => handleTransition(book.id, ContentStatus.ARCHIVED)}
                            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <Archive className="w-3 h-3" />
                            <span>Archive</span>
                          </button>
                        )}

                        <a
                          href={`/am/library`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          title="Preview in public catalog"
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

      {/* Modal for Registering New Manuscript */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white heading-font">
                  Register Ecclesiastical Manuscript / Book
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Section 3 & 14 content governance: Trilingual metadata, canonical category, and rights verification.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-4 text-xs">
              {/* General Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">URL Slug (Identifier):</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. metsehafe-teklil"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-eotc-gold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Liturgical Category:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-eotc-gold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameAm} ({c.nameEn})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Publication Year (ዓ.ም/AD):</label>
                  <input
                    type="number"
                    value={publishedYear}
                    onChange={(e) => setPublishedYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-eotc-gold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Rights Provenance:</label>
                  <select
                    value={selectedRightsId}
                    onChange={(e) => setSelectedRightsId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-eotc-gold"
                  >
                    {rightsRecords.map((r) => (
                      <option key={r.id} value={r.id}>
                        [{r.status}] {r.rightsHolder}
                      </option>
                    ))}
                    {rightsRecords.length === 0 && (
                      <option value="rights-pub-001">[PUBLIC_DOMAIN] Patriarchate Tradition</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Manuscript PDF File:</label>
                  <select
                    value={fileId}
                    onChange={(e) => setFileId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-eotc-gold"
                  >
                    <option value="file-003">anaphora-apostles-canonical.pdf (8.9 MB)</option>
                    <option value="file-004">haymanote-abew-patristic.pdf (14.2 MB)</option>
                    <option value="file-005">synaxarium-part1.pdf (32.1 MB)</option>
                  </select>
                </div>
              </div>

              {/* Trilingual Translation Tabs */}
              <div className="pt-2">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-eotc-gold" />
                    <span>Multilingual Translation Records</span>
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
                      <label className="block text-neutral-400 mb-1 font-semibold">የመጽሐፉ ርዕስ (Amharic Title) *:</label>
                      <input
                        type="text"
                        value={amTitle}
                        onChange={(e) => setAmTitle(e.target.value)}
                        placeholder="ምሳሌ፡ መጽሐፈ ተክሊል"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">የመጽሐፉ መግለጫ (Amharic Description):</label>
                      <textarea
                        value={amDesc}
                        onChange={(e) => setAmDesc(e.target.value)}
                        rows={2}
                        placeholder="የመጽሐፉ ይዘት እና ቀኖናዊ ጠቀሜታ..."
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1">ደራሲ / አዘጋጅ:</label>
                        <input
                          type="text"
                          value={amAuthor}
                          onChange={(e) => setAmAuthor(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">አሳታሚ ድርጅት:</label>
                        <input
                          type="text"
                          value={amPublisher}
                          onChange={(e) => setAmPublisher(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === 'gez' && (
                  <div className="space-y-3 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">ርእሰ መጽሐፍ (Ge'ez Title):</label>
                      <input
                        type="text"
                        value={gezTitle}
                        onChange={(e) => setGezTitle(e.target.value)}
                        placeholder="ምሳሌ፡ መጽሐፈ ተክሊል ወሥርዓተ መርዓ"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">መግለጺ ዘመጽሐፍ (Ge'ez Description):</label>
                      <textarea
                        value={gezDesc}
                        onChange={(e) => setGezDesc(e.target.value)}
                        rows={2}
                        placeholder="ትርጓሜሁ ወሥርዓተ ጸሎት..."
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1">ደራሲ:</label>
                        <input
                          type="text"
                          value={gezAuthor}
                          onChange={(e) => setGezAuthor(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">ማኅተም:</label>
                        <input
                          type="text"
                          value={gezPublisher}
                          onChange={(e) => setGezPublisher(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>
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
                        placeholder="e.g. The Book of the Holy Sacrament of Crowning"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold">English Description:</label>
                      <textarea
                        value={enDesc}
                        onChange={(e) => setEnDesc(e.target.value)}
                        rows={2}
                        placeholder="Sacramental rites, biblical commentary, and marriage liturgy..."
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1">Author / Editor:</label>
                        <input
                          type="text"
                          value={enAuthor}
                          onChange={(e) => setEnAuthor(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">Publisher:</label>
                        <input
                          type="text"
                          value={enPublisher}
                          onChange={(e) => setEnPublisher(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>
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
                  Save Manuscript Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
