'use client';

import React, { useState, useEffect } from 'react';
import {
  Images,
  Plus,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Eye,
  Send,
  CheckCircle2,
  XCircle,
  Church as ChurchIcon,
  Layers,
  Filter,
  ArrowRight,
  ExternalLink,
  Lock,
} from 'lucide-react';
import {
  ContentStatus,
  RightsStatus,
  MediaGalleryDto,
  CreateMediaGalleryDto,
  UserRole,
} from '@eotc/contracts';

export default function AdminGalleriesPage() {
  const [galleries, setGalleries] = useState<MediaGalleryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedGallery, setSelectedGallery] = useState<MediaGalleryDto | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Admin user simulator
  const [adminUser, setAdminUser] = useState<{ id: string; role: string; churchSlug?: string }>({
    id: 'user-admin-001',
    role: UserRole.SUPER_ADMINISTRATOR,
  });

  // Create form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formChurchId, setFormChurchId] = useState('patriarchate');
  const [formItems, setFormItems] = useState<Array<{ mediaId: string; caption: string; rightsId: string }>>([
    { mediaId: 'med-001', caption: 'ቅዱስ ሥዕል / ጥንታዊ ብራና', rightsId: 'rights-pub-001' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('eotc_admin_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAdminUser({
          id: parsed.id || 'user-admin-001',
          role: parsed.role || UserRole.SUPER_ADMINISTRATOR,
          churchSlug: parsed.churchMemberships?.[0]?.churchSlug,
        });
      } catch {}
    }
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/media/galleries?isStaff=true');
      if (res.ok) {
        const data = await res.json();
        setGalleries(data || []);
      }
    } catch (err) {
      console.error('Failed to load galleries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setActionLoading(true);
    try {
      const payload: CreateMediaGalleryDto = {
        title: formTitle,
        description: formDescription,
        churchId: formChurchId || undefined,
        items: formItems.map((it, idx) => ({
          mediaId: it.mediaId,
          caption: it.caption,
          rightsId: it.rightsId,
          orderIndex: idx + 1,
        })),
      };

      const res = await fetch('http://localhost:4000/api/v1/media/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setFormTitle('');
        setFormDescription('');
        await fetchGalleries();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to create gallery');
      }
    } catch (err) {
      alert('Error creating gallery: ' + (err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransition = async (galleryId: string, targetStatus: ContentStatus, reason?: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/media/galleries/${galleryId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStatus, reason }),
      });

      if (res.ok) {
        const updated = await res.json();
        setGalleries((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        if (selectedGallery && selectedGallery.id === updated.id) {
          setSelectedGallery(updated);
        }
      } else {
        const err = await res.json();
        alert(err.message || 'Transition rejected');
      }
    } catch (err) {
      alert('Transition error: ' + (err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredGalleries = galleries.filter((g) => {
    if (statusFilter !== 'ALL' && g.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case ContentStatus.PUBLISHED:
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case ContentStatus.APPROVED:
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case ContentStatus.IN_REVIEW:
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case ContentStatus.REJECTED:
        return 'bg-rose-950 text-rose-400 border-rose-800';
      case ContentStatus.ARCHIVED:
        return 'bg-neutral-900 text-neutral-400 border-neutral-700';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-eotc-crimson/20 border border-eotc-gold/40 flex items-center justify-center text-eotc-gold">
              <Images className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Curated Media & Sacred Art Galleries</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300 font-medium">
                  Section 14 & 32
                </span>
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Curated collections of sacred iconography, illuminated manuscripts, and church architectural heritage
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-eotc-crimson hover:bg-red-800 text-white font-semibold text-xs shadow-lg shadow-red-950/40 transition-all border border-red-700/50"
          >
            <Plus className="w-4 h-4" />
            <span>Create Curated Collection</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-900/40 border border-neutral-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <span className="text-xs font-semibold text-neutral-300">Status:</span>
          {['ALL', 'DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-neutral-800 text-eotc-gold border border-eotc-gold/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Galleries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGalleries.map((gallery) => (
          <div
            key={gallery.id}
            onClick={() => setSelectedGallery(gallery)}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/30 overflow-hidden hover:border-eotc-gold/40 transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Cover Thumbnail */}
              <div className="h-44 bg-neutral-950 relative overflow-hidden border-b border-neutral-800/80">
                {gallery.coverMediaUrl ? (
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-400 text-xs">
                    <img
                      src={gallery.coverMediaUrl}
                      alt={gallery.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600">
                    <Images className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${getStatusBadge(
                      gallery.status,
                    )}`}
                  >
                    {gallery.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-black/70 text-white backdrop-blur-md border border-neutral-700">
                    {gallery.itemCount || gallery.items?.length || 0} Assets
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-white text-base group-hover:text-eotc-gold transition-colors line-clamp-1">
                  {gallery.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {gallery.description || 'Curated ecclesiastical media collection.'}
                </p>
                {gallery.churchName && (
                  <div className="text-[11px] text-eotc-gold flex items-center gap-1.5 pt-1">
                    <ChurchIcon className="w-3.5 h-3.5" />
                    <span>{gallery.churchName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-neutral-800/80 bg-neutral-950/40 flex items-center justify-between text-xs">
              <span className="text-[10px] text-neutral-400 font-mono">
                slug: {gallery.slug}
              </span>
              <span className="text-eotc-gold font-semibold flex items-center gap-1 text-[11px]">
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Gallery Detail & State Transition Drawer */}
      {selectedGallery && (
        <div className="fixed inset-0 z-50 bg-black/70 flex justify-end">
          <div className="w-full max-w-xl bg-neutral-950 border-l border-neutral-800 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                    selectedGallery.status,
                  )}`}
                >
                  {selectedGallery.status}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedGallery.title}</h2>
              </div>
              <button
                onClick={() => setSelectedGallery(null)}
                className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {selectedGallery.description}
            </p>

            {/* Collection Items */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Collection Items ({selectedGallery.items?.length || 0})
              </h3>
              {selectedGallery.items?.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/40 flex items-start gap-4"
                >
                  <div className="w-16 h-16 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden shrink-0">
                    <img
                      src={item.mediaUrl || '/api/v1/storage/file/manuscripts/axum-tsion-f12.webp'}
                      alt={item.caption || 'Item'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-xs font-bold text-white line-clamp-1">{item.caption}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-neutral-800 text-eotc-gold border border-neutral-700">
                        {item.rightsStatus || RightsStatus.PUBLIC_DOMAIN}
                      </span>
                      {item.rightsHolder && (
                        <span className="text-[10px] text-neutral-400">
                          Holder: {item.rightsHolder}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Publication State Machine */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-eotc-gold" />
                  <span>Gallery Publication Workflow</span>
                </h3>
                <span className="text-[10px] text-neutral-400">Role: {adminUser.role}</span>
              </div>

              {selectedGallery.createdById === adminUser.id && adminUser.role !== UserRole.SUPER_ADMINISTRATOR && (
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800 text-[11px] text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Separation of Duties active: You curated this collection. An ecclesiastical reviewer must approve or publish.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {selectedGallery.status === ContentStatus.DRAFT && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleTransition(selectedGallery.id, ContentStatus.IN_REVIEW, 'Submitted for review')}
                    className="col-span-2 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for Review</span>
                  </button>
                )}

                {selectedGallery.status === ContentStatus.IN_REVIEW && (
                  <>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleTransition(selectedGallery.id, ContentStatus.APPROVED, 'Rights and provenance verified')}
                      className="py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Collection</span>
                    </button>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleTransition(selectedGallery.id, ContentStatus.REJECTED, 'Provenance unverified')}
                      className="py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {selectedGallery.status === ContentStatus.APPROVED && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleTransition(selectedGallery.id, ContentStatus.PUBLISHED, 'Published to catalog')}
                    className="col-span-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Publish Gallery</span>
                  </button>
                )}

                {selectedGallery.status === ContentStatus.PUBLISHED && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleTransition(selectedGallery.id, ContentStatus.ARCHIVED, 'Collection archived')}
                    className="col-span-2 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                  >
                    Archive Collection
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Gallery Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Curate Sacred Media Gallery</h2>
                <p className="text-xs text-neutral-400">Group sacred art, manuscripts, or church photography</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGallery} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Collection Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. ጥንታውያን የደብረ ሊባኖስ ቅዱሳት ሥዕላት"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Theological and artistic background..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Parish / Monastery Scope</label>
                <select
                  value={formChurchId}
                  onChange={(e) => setFormChurchId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                >
                  <option value="patriarchate">Holy Synod & Patriarchate</option>
                  <option value="axum-tsion">Axum Tsion Maryam Sanctuary</option>
                  <option value="lalibela">Lalibela Rock-Hewn Sanctuary</option>
                  <option value="debre-libanos">Debre Libanos Monastery</option>
                </select>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-eotc-crimson hover:bg-red-800 text-white font-bold transition-colors"
                >
                  {actionLoading ? 'Creating...' : 'Create Draft Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
