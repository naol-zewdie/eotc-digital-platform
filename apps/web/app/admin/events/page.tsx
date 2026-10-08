'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Eye,
  Send,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Sparkles,
  Filter,
  Church as ChurchIcon,
  ShieldCheck,
  Bookmark,
  Compass,
} from 'lucide-react';
import {
  ContentStatus,
  EventType,
  EventDto,
  CreateEventDto,
  UserRole,
} from '@eotc/contracts';

interface LiturgicalCalendarData {
  currentGregorian: string;
  ethiopianDate: {
    year: number;
    month: number;
    monthNameAm: string;
    monthNameGez: string;
    monthNameEn: string;
    day: number;
    dayOfWeek: number;
    dayNameAm: string;
    dayNameEn: string;
    seasonAm: string;
    seasonEn: string;
  };
  formattedAm: string;
  formattedEn: string;
  todayFeasts: any[];
  monthlyCommemoration?: { day: number; nameAm: string; nameEn: string };
  allCanonicalFeasts: any[];
  monthlyCommemorations: any[];
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [calendarData, setCalendarData] = useState<LiturgicalCalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'REGISTRY' | 'CANONICAL_FEASTS'>('REGISTRY');

  // Logged-in admin user simulator state
  const [adminUser, setAdminUser] = useState<{ id: string; role: string; churchSlug?: string }>({
    id: 'user-admin-001',
    role: UserRole.SUPER_ADMINISTRATOR,
  });

  // Create form state
  const [formType, setFormType] = useState<EventType>(EventType.LITURGICAL_FEAST);
  const [formChurchId, setFormChurchId] = useState('patriarchate');
  const [formTitleAm, setFormTitleAm] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleGez, setFormTitleGez] = useState('');
  const [formDescAm, setFormDescAm] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formSigAm, setFormSigAm] = useState('');
  const [formSigEn, setFormSigEn] = useState('');
  const [formStartAt, setFormStartAt] = useState('2026-11-01T06:00');
  const [formEndAt, setFormEndAt] = useState('2026-11-01T15:00');
  const [formVenue, setFormVenue] = useState('Holy Trinity Cathedral, Addis Ababa');
  const [formIsRecurring, setFormIsRecurring] = useState(false);

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
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Calendar Engine Data
      const calRes = await fetch('http://localhost:4000/api/v1/events/calendar');
      if (calRes.ok) {
        const cal = await calRes.json();
        setCalendarData(cal);
      }

      // 2. Fetch Events
      const evRes = await fetch('http://localhost:4000/api/v1/events?isStaff=true');
      if (evRes.ok) {
        const evData = await evRes.json();
        setEvents(evData.items || []);
      }
    } catch (err) {
      console.error('Failed to load events data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleAm.trim()) return;

    setActionLoading(true);
    try {
      const payload: CreateEventDto = {
        type: formType,
        churchId: formChurchId || undefined,
        title: formTitleAm,
        startAt: new Date(formStartAt).toISOString(),
        endAt: formEndAt ? new Date(formEndAt).toISOString() : undefined,
        venue: formVenue,
        isRecurringAnnual: formIsRecurring,
        translations: [
          {
            locale: 'am',
            title: formTitleAm,
            description: formDescAm,
            liturgicalSignificance: formSigAm,
          },
          ...(formTitleEn
            ? [
                {
                  locale: 'en',
                  title: formTitleEn,
                  description: formDescEn,
                  liturgicalSignificance: formSigEn,
                },
              ]
            : []),
          ...(formTitleGez
            ? [
                {
                  locale: 'gez',
                  title: formTitleGez,
                  description: formDescAm,
                  liturgicalSignificance: formSigAm,
                },
              ]
            : []),
        ],
      };

      const res = await fetch('http://localhost:4000/api/v1/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setFormTitleAm('');
        setFormTitleEn('');
        setFormTitleGez('');
        setFormDescAm('');
        setFormDescEn('');
        setFormSigAm('');
        setFormSigEn('');
        await fetchData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to create event');
      }
    } catch (err) {
      alert('Error creating event: ' + (err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransition = async (eventId: string, targetStatus: ContentStatus, reason?: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/events/${eventId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStatus, reason }),
      });

      if (res.ok) {
        const updated = await res.json();
        setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)));
        if (selectedEvent && selectedEvent.id === updated.id) {
          setSelectedEvent(updated);
        }
      } else {
        const err = await res.json();
        alert(err.message || 'Transition rejected');
      }
    } catch (err) {
      alert('Transition failed: ' + (err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (statusFilter !== 'ALL' && ev.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && ev.type !== typeFilter) return false;
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
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Liturgical Calendar & Events</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300 font-medium">
                  Section 14 & 32
                </span>
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Canonical Ethiopian calendar conversion, annual moveable & immoveable feasts, and parish events
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
            <span>Schedule Event / Feast</span>
          </button>
        </div>
      </div>

      {/* Liturgical Date & Canonical Banner */}
      {calendarData && (
        <div className="rounded-2xl border border-eotc-gold/30 bg-gradient-to-r from-neutral-950 via-amber-950/20 to-neutral-950 p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-eotc-gold select-none pointer-events-none text-9xl font-bold">
            ✝
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Today in Ethiopian Calendar */}
            <div className="space-y-2 border-r border-neutral-800/80 pr-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-eotc-gold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Today (ኢትዮጵያ ዘመን አቆጣጠር)</span>
              </div>
              <div className="text-xl font-bold text-white tracking-tight">
                {calendarData.formattedAm}
              </div>
              <div className="text-xs text-neutral-400">
                {calendarData.formattedEn}
              </div>
              <div className="inline-block mt-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-900 border border-neutral-800 text-amber-300">
                {calendarData.ethiopianDate.seasonAm}
              </div>
            </div>

            {/* Monthly Commemoration Day */}
            <div className="space-y-2 border-r border-neutral-800/80 pr-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-eotc-gold" />
                <span>Monthly Commemoration (የዕለቱ ማኅሌት)</span>
              </div>
              {calendarData.monthlyCommemoration ? (
                <div>
                  <div className="text-base font-bold text-eotc-gold">
                    {calendarData.monthlyCommemoration.nameAm}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Day {calendarData.ethiopianDate.day} of every Ethiopian month ({calendarData.monthlyCommemoration.nameEn})
                  </div>
                </div>
              ) : (
                <div className="text-sm text-neutral-400">
                  Day {calendarData.ethiopianDate.day} of {calendarData.ethiopianDate.monthNameAm}
                </div>
              )}
            </div>

            {/* Upcoming Canonical Feast */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-eotc-gold" />
                <span>Next Canonical Commemoration</span>
              </div>
              <div className="text-sm font-semibold text-white">
                በዓለ መስቀልና ደመራ (Meskerem 17) / በዓለ ጥምቀት (Tir 11)
              </div>
              <div className="text-xs text-neutral-400 leading-relaxed">
                Ecclesiastical rites calculate moveable dates according to the ancient Bahire Hasab (Abushakir Computus).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('REGISTRY')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'REGISTRY'
              ? 'border-eotc-gold text-eotc-gold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Scheduled Events & Feasts ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('CANONICAL_FEASTS')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'CANONICAL_FEASTS'
              ? 'border-eotc-gold text-eotc-gold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Canonical Feasts Master Directory ({calendarData?.allCanonicalFeasts.length || 10})
        </button>
      </div>

      {activeTab === 'REGISTRY' ? (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800">
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

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-300">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-eotc-gold"
              >
                <option value="ALL">All Types</option>
                <option value={EventType.LITURGICAL_FEAST}>Liturgical Feast</option>
                <option value={EventType.PATRONAL_FEAST}>Patronal Feast</option>
                <option value={EventType.FAST_BEGIN}>Fast Commencement</option>
                <option value={EventType.PARISH_CONFERENCE}>Parish Conference</option>
                <option value={EventType.PRAYER_VIGIL}>Prayer Vigil</option>
              </select>
            </div>
          </div>

          {/* Events Table */}
          <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900/20">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/80 border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Event / Feast Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Ecclesiastical Date</th>
                  <th className="px-4 py-3">Venue / Parish</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                      No events matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((ev) => (
                    <tr
                      key={ev.id}
                      className="hover:bg-neutral-900/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedEvent(ev)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-white text-sm group-hover:text-eotc-gold transition-colors">
                          {ev.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                          slug: {ev.slug}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
                          {ev.type}
                        </span>
                        {ev.isRecurringAnnual && (
                          <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            ANNUAL
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-neutral-200 font-medium">
                          {ev.ethiopianDateFormatted || new Date(ev.startAt).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {new Date(ev.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({ev.timezone})
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-neutral-300 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{ev.venue || 'Patriarchate'}</span>
                        </div>
                        {ev.churchName && (
                          <div className="text-[10px] text-eotc-gold flex items-center gap-1 mt-0.5">
                            <ChurchIcon className="w-3 h-3" />
                            <span>{ev.churchName}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                            ev.status,
                          )}`}
                        >
                          {ev.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(ev);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Canonical Feasts Master Directory */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calendarData?.allCanonicalFeasts.map((feast) => (
            <div
              key={feast.id}
              className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/30 hover:border-eotc-gold/40 transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-base">{feast.nameAm}</h3>
                  <div className="text-xs text-eotc-gold font-medium mt-0.5">
                    {feast.nameGez}
                  </div>
                  <div className="text-xs text-neutral-400 italic">
                    {feast.nameEn}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    Month {feast.ethiopianMonth}, Day {feast.ethiopianDay}
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {feast.significanceAm}
              </p>
              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Type: <strong className="text-neutral-200">{feast.type}</strong></span>
                <span>Annual Immoveable Feast</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Event Details & State Machine Drawer */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 flex justify-end">
          <div className="w-full max-w-lg bg-neutral-950 border-l border-neutral-800 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                    selectedEvent.status,
                  )}`}
                >
                  {selectedEvent.status}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedEvent.title}</h2>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Event Overview */}
            <div className="space-y-3 bg-neutral-900/40 p-4 rounded-xl border border-neutral-800 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Event Type:</span>
                <span className="text-white font-semibold">{selectedEvent.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Ecclesiastical Date:</span>
                <span className="text-eotc-gold font-semibold">
                  {selectedEvent.ethiopianDateFormatted || 'Calculated'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Start Time:</span>
                <span className="text-neutral-200">{new Date(selectedEvent.startAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Venue:</span>
                <span className="text-neutral-200">{selectedEvent.venue || 'N/A'}</span>
              </div>
              {selectedEvent.createdById && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">Submitted By:</span>
                  <span className="text-neutral-300 font-mono">{selectedEvent.createdById}</span>
                </div>
              )}
            </div>

            {/* Trilingual Translations Preview */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Translations ({selectedEvent.translations?.length || 0})
              </h3>
              {selectedEvent.translations?.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/30 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{t.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-eotc-gold">
                      {t.locale}
                    </span>
                  </div>
                  {t.description && (
                    <p className="text-[11px] text-neutral-300 leading-relaxed">{t.description}</p>
                  )}
                  {t.liturgicalSignificance && (
                    <div className="p-2 rounded bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-200">
                      <strong>Significance:</strong> {t.liturgicalSignificance}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Ecclesiastical Publication State Machine Actions */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-eotc-gold" />
                  <span>Canonical Publication Workflow</span>
                </h3>
                <span className="text-[10px] text-neutral-400">Role: {adminUser.role}</span>
              </div>

              {/* Separation of Duties Notice */}
              {selectedEvent.createdById === adminUser.id && adminUser.role !== UserRole.SUPER_ADMINISTRATOR && (
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800 text-[11px] text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Separation of Duties active: You submitted this event. You may submit for review, but another reviewer/moderator must approve or publish.
                  </span>
                </div>
              )}

              {/* Action Buttons based on status */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {selectedEvent.status === ContentStatus.DRAFT && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleTransition(selectedEvent.id, ContentStatus.IN_REVIEW, 'Submitted for review')}
                    className="col-span-2 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for Review</span>
                  </button>
                )}

                {selectedEvent.status === ContentStatus.IN_REVIEW && (
                  <>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleTransition(selectedEvent.id, ContentStatus.APPROVED, 'Liturgically validated')}
                      className="py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Event</span>
                    </button>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleTransition(selectedEvent.id, ContentStatus.REJECTED, 'Needs revision')}
                      className="py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {selectedEvent.status === ContentStatus.APPROVED && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleTransition(selectedEvent.id, ContentStatus.PUBLISHED, 'Published to calendar')}
                    className="col-span-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Publish to Public Calendar</span>
                  </button>
                )}

                {selectedEvent.status === ContentStatus.PUBLISHED && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleTransition(selectedEvent.id, ContentStatus.ARCHIVED, 'Event concluded')}
                    className="col-span-2 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                  >
                    Archive Event
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Schedule Liturgical Event / Feast</h2>
                <p className="text-xs text-neutral-400">Add an ecclesiastical commemoration or parish gathering</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Event Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as EventType)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                  >
                    <option value={EventType.LITURGICAL_FEAST}>Liturgical Feast (በዓለ እግዚእ/ማርያም)</option>
                    <option value={EventType.PATRONAL_FEAST}>Patronal Parish Feast (ንግሥ)</option>
                    <option value={EventType.FAST_BEGIN}>Fast Commencement (ጾም)</option>
                    <option value={EventType.PARISH_CONFERENCE}>Parish Conference / Synod</option>
                    <option value={EventType.PRAYER_VIGIL}>Prayer Vigil / Mahlet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Parish / Monastery Scope</label>
                  <select
                    value={formChurchId}
                    onChange={(e) => setFormChurchId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                  >
                    <option value="patriarchate">Holy Synod & Patriarchate (National)</option>
                    <option value="axum-tsion">Axum Tsion Maryam Sanctuary</option>
                    <option value="lalibela">Lalibela Rock-Hewn Sanctuary</option>
                    <option value="debre-libanos">Debre Libanos Monastery</option>
                    <option value="holy-trinity-cathedral">Holy Trinity Cathedral</option>
                  </select>
                </div>
              </div>

              {/* Title in Amharic, Ge'ez, English */}
              <div className="space-y-3 bg-neutral-900/40 p-3.5 rounded-xl border border-neutral-800">
                <div className="text-[11px] font-bold uppercase text-eotc-gold">Multilingual Titles & Significance</div>
                <div>
                  <label className="block text-neutral-400 mb-1">Amharic Title (የበዓሉ ስም) *</label>
                  <input
                    type="text"
                    required
                    value={formTitleAm}
                    onChange={(e) => setFormTitleAm(e.target.value)}
                    placeholder="ምሳሌ፡ የክቡር መስቀል ደመራና በዓለ መስቀል"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Ge'ez Title (በግዕዝ)</label>
                    <input
                      type="text"
                      value={formTitleGez}
                      onChange={(e) => setFormTitleGez(e.target.value)}
                      placeholder="ምሳሌ፡ በዓለ መስቀል ክብረ ቅዱሳን"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">English Title</label>
                    <input
                      type="text"
                      value={formTitleEn}
                      onChange={(e) => setFormTitleEn(e.target.value)}
                      placeholder="e.g. Feast of the True Cross (Meskel)"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Liturgical Significance (ቀኖናዊና መንፈሳዊ ትርጉም)</label>
                  <textarea
                    rows={2}
                    value={formSigAm}
                    onChange={(e) => setFormSigAm(e.target.value)}
                    placeholder="የበዓሉ ሃይማኖታዊ መሠረትና ሥርዓት..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                  />
                </div>
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">Start Date & Time (Gregorian)</label>
                  <input
                    type="datetime-local"
                    required
                    value={formStartAt}
                    onChange={(e) => setFormStartAt(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formEndAt}
                    onChange={(e) => setFormEndAt(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Venue / Specific Sanctuary</label>
                <input
                  type="text"
                  value={formVenue}
                  onChange={(e) => setFormVenue(e.target.value)}
                  placeholder="e.g. Meskel Square, Addis Ababa"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="annualRecur"
                  checked={formIsRecurring}
                  onChange={(e) => setFormIsRecurring(e.target.checked)}
                  className="rounded border-neutral-800 bg-neutral-900 text-eotc-gold focus:ring-0"
                />
                <label htmlFor="annualRecur" className="text-neutral-300 font-medium">
                  Annual Recurring Feast (በየዓመቱ በተመሳሳይ ዕለት የሚከበር)
                </label>
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
                  {actionLoading ? 'Saving...' : 'Save Draft Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
