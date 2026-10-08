'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  Filter,
  Church,
  ChevronLeft,
  ChevronRight,
  Sun,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { EventDto, EventType } from '@eotc/contracts';

interface EventsPageProps {
  params: { locale: string };
}

export default function EventsCalendarPage({ params }: EventsPageProps) {
  const locale = params.locale || 'am';
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // 1 = Meskerem
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // 13 Ethiopian Liturgical Months
  const ethiopianMonths = [
    { num: 1, nameAm: 'መስከረም', nameGez: 'መስከረም', nameEn: 'Meskerem (Sep-Oct)', season: 'ዘመነ ዮሐንስ / መፀው' },
    { num: 2, nameAm: 'ጥቅምት', nameGez: 'ጥቅምት', nameEn: 'Tikimt (Oct-Nov)', season: 'መፀው' },
    { num: 3, nameAm: 'ኅዳር', nameGez: 'ኅዳር', nameEn: 'Hidar (Nov-Dec)', season: 'መፀው' },
    { num: 4, nameAm: 'ታኅሣሥ', nameGez: 'ታኅሣሥ', nameEn: 'Tahsas (Dec-Jan)', season: 'ክረምት/ዘመነ ማቴዎስ' },
    { num: 5, nameAm: 'ጥር', nameGez: 'ጥር', nameEn: 'Tir (Jan-Feb)', season: 'በጋ / ዘመነ ዮሐንስ' },
    { num: 6, nameAm: 'የካቲት', nameGez: 'የካቲት', nameEn: 'Yekatit (Feb-Mar)', season: 'በጋ' },
    { num: 7, nameAm: 'መጋቢት', nameGez: 'መጋቢት', nameEn: 'Megabit (Mar-Apr)', season: 'ፀደይ / ጾመ ሁዳዴ' },
    { num: 8, nameAm: 'ሚያዝያ', nameGez: 'ሚያዝያ', nameEn: 'Miyazya (Apr-May)', season: 'ፀደይ / ትንሣኤ' },
    { num: 9, nameAm: 'ግንቦት', nameGez: 'ግንቦት', nameEn: 'Ginbot (May-Jun)', season: 'ፀደይ' },
    { num: 10, nameAm: 'ሰኔ', nameGez: 'ሰኔ', nameEn: 'Sene (Jun-Jul)', season: 'ክረምት' },
    { num: 11, nameAm: 'ሐምሌ', nameGez: 'ሐምሌ', nameEn: 'Hamle (Jul-Aug)', season: 'ክረምት' },
    { num: 12, nameAm: 'ነሐሴ', nameGez: 'ነሐሴ', nameEn: 'Nehase (Aug-Sep)', season: 'ክረምት / ጾመ ፍልሰታ' },
    { num: 13, nameAm: 'ጳጉሜን', nameGez: 'ጳጉሜን', nameEn: 'Pagume (Sep)', season: 'ዘመነ ዮሐንስ / ጳጉሜን' },
  ];

  // Immoveable Commemorations & Feasts by month
  const monthlyFeasts: Record<number, Array<{ day: number; titleAm: string; titleEn: string; type: string }>> = {
    1: [
      { day: 1, titleAm: 'ቅዱስ ዮሐንስ መጥምቅ (እንቁጣጣሽ)', titleEn: 'Enkutatash / St. John the Baptist', type: 'MAJOR_FEAST' },
      { day: 17, titleAm: 'የደመራ በዓል', titleEn: 'Demera Eve of the Holy Cross', type: 'MAJOR_FEAST' },
      { day: 18, titleAm: 'ክብረ በዓለ መስቀል', titleEn: 'Feast of the Discovery of True Cross', type: 'MAJOR_FEAST' },
      { day: 21, titleAm: 'የእመቤታችን ማርያም ወርሃዊ መታሰቢያ', titleEn: 'Monthly Commemoration of St. Mary', type: 'MONTHLY' },
      { day: 27, titleAm: 'መድኃኔዓለም ወርሃዊ በዓል', titleEn: 'Medhane Alem (Savior of the World)', type: 'MONTHLY' },
    ],
    2: [
      { day: 14, titleAm: 'አቡነ አረጋዊ ገዳም ክብረ በዓል (ደብረ ዳሞ)', titleEn: 'Abuna Aregawi Commemoration (Debre Damo)', type: 'PATRONAL' },
      { day: 21, titleAm: 'የእመቤታችን ማርያም ወርሃዊ በዓል', titleEn: 'Monthly Commemoration of St. Mary', type: 'MONTHLY' },
      { day: 27, titleAm: 'መድኃኔዓለም ወርሃዊ በዓል', titleEn: 'Medhane Alem Monthly', type: 'MONTHLY' },
    ],
    3: [
      { day: 6, titleAm: 'ቁስቋም ማርያም (ስደተ ግብፅ)', titleEn: 'Kuskawam St. Mary (Flight to Egypt)', type: 'MAJOR_FEAST' },
      { day: 12, titleAm: 'ቅዱስ ሚካኤል ሊቀ መላእክት', titleEn: 'Archangel St. Michael Feast', type: 'MAJOR_FEAST' },
      { day: 21, titleAm: 'የእመቤታችን ጽዮን ማርያም (አክሱም)', titleEn: 'Zion Mary Annual Celebration (Axum)', type: 'MAJOR_FEAST' },
    ],
    4: [
      { day: 19, titleAm: 'ቅዱስ ገብርኤል ሊቀ መላእክት (ቁልቢ)', titleEn: 'Archangel St. Gabriel Annual Pilgrimage (Kulubi)', type: 'MAJOR_FEAST' },
      { day: 28, titleAm: 'በዓለ ልደት (ገና ዋዜማ)', titleEn: 'Eve of the Nativity of Christ', type: 'MAJOR_FEAST' },
      { day: 29, titleAm: 'በዓለ ልደት (የጌታችን የልደት በዓል)', titleEn: 'Nativity of Our Lord (Genna)', type: 'MAJOR_FEAST' },
    ],
    5: [
      { day: 11, titleAm: 'በዓለ ጥምቀት (የጌታችን የመጠመቅ በዓል)', titleEn: 'Epiphany & Theophany (Timket)', type: 'MAJOR_FEAST' },
      { day: 12, titleAm: 'ቃና ዘገሊላ', titleEn: 'Miracle of Cana of Galilee', type: 'MAJOR_FEAST' },
      { day: 21, titleAm: 'አስተርእዮ ማርያም (ዕረፍተ ድንግል)', titleEn: 'Asteriyo Maryam (Dormition of St. Mary)', type: 'MAJOR_FEAST' },
    ],
  };

  // Fallback parish events
  const fallbackEvents: EventDto[] = [
    {
      id: 'ev-meskel-addis',
      slug: 'demera-meskel-square',
      type: EventType.LITURGICAL_FEAST,
      title: 'የደመራ ማብራትና የቅዱስ መስቀል ክብረ በዓል',
      description: 'በብፁዕ ወቅዱስ ፓትርያርኩና በሊቃነ ጳጳሳት መሪነት በመስቀል አደባባይ የሚካሄድ ብሔራዊና መንፈሳዊ ክብረ በዓል።',
      startAt: '2026-09-27T14:00:00.000Z',
      endAt: '2026-09-27T19:00:00.000Z',
      timezone: 'Africa/Addis_Ababa',
      venue: 'Meskel Square, Addis Ababa',
      churchName: 'Holy Trinity Cathedral & Patriarchate',
      ethiopianMonth: 1,
      ethiopianDay: 17,
      ethiopianDateFormatted: 'መስከረም ፲፯ ቀን ፳፻፲፱ ዓ.ም',
      status: 'PUBLISHED' as any,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 'tr-ev-1-am',
          eventId: 'ev-meskel-addis',
          locale: 'am',
          title: 'የደመራ ማብራትና የቅዱስ መስቀል ክብረ በዓል',
          description: 'በአዲስ አበባ መስቀል አደባባይ የሚካሄድ ዓመታዊ የደመራ ማብራት በዓል።',
        },
        {
          id: 'tr-ev-1-en',
          eventId: 'ev-meskel-addis',
          locale: 'en',
          title: 'Meskel Demera Festival at Meskel Square',
          description: 'Annual lighting of the Demera bonfire celebrating the discovery of the True Cross.',
        },
      ],
    },
    {
      id: 'ev-timket-janmeda',
      slug: 'timket-theophany-janmeda',
      type: EventType.LITURGICAL_FEAST,
      title: 'የከተራና የበዓለ ጥምቀት ታላቅ ክብረ በዓል',
      description: 'ታቦታተ ሕጉ ወደ ጃንሜዳ ባህረ ጥምቀት ወርደው የሚያድሩበትና የጥምቀት በዓል የሚከበርበት።',
      startAt: '2026-01-19T06:00:00.000Z',
      endAt: '2026-01-20T12:00:00.000Z',
      timezone: 'Africa/Addis_Ababa',
      venue: 'Jan Meda Bahre Timket, Addis Ababa',
      churchName: 'All Parishes of Addis Ababa',
      ethiopianMonth: 5,
      ethiopianDay: 11,
      ethiopianDateFormatted: 'ጥር ፲፩ ቀን ፳፻፲፱ ዓ.ም',
      status: 'PUBLISHED' as any,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 'tr-ev-2-am',
          eventId: 'ev-timket-janmeda',
          locale: 'am',
          title: 'የከተራና የበዓለ ጥምቀት ታላቅ ክብረ በዓል',
          description: 'የከተራ ጉዞና የጥምቀት በዓል በጃንሜዳ ባህረ ጥምቀት።',
        },
      ],
    },
    {
      id: 'ev-axum-zion',
      slug: 'axum-zion-annual-pilgrimage',
      type: EventType.PATRONAL_FEAST,
      title: 'የጽዮን ማርያም ዓመታዊ የንግሥ ክብረ በዓል',
      description: 'በታሪካዊቷ አክሱም ጽዮን ማርያም ካቴድራል የሚካሄድ የዓመቱ ታላቅ የንግሥ በዓል።',
      startAt: '2026-11-30T05:00:00.000Z',
      timezone: 'Africa/Addis_Ababa',
      venue: 'Axum Tsion Maryam Cathedral, Tigray',
      churchName: 'Axum Tsion Maryam',
      ethiopianMonth: 3,
      ethiopianDay: 21,
      ethiopianDateFormatted: 'ኅዳር ፳፩ ቀን ፳፻፲፱ ዓ.ም',
      status: 'PUBLISHED' as any,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 'tr-ev-3-am',
          eventId: 'ev-axum-zion',
          locale: 'am',
          title: 'የጽዮን ማርያም ዓመታዊ የንግሥ ክብረ በዓል',
        },
      ],
    },
  ];

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`http://localhost:4000/api/v1/events?ethiopianMonth=${selectedMonth}`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            setEvents(data.items);
          } else {
            setEvents(fallbackEvents);
          }
        } else {
          setEvents(fallbackEvents);
        }
      } catch (err) {
        console.warn('Fallback to demo calendar events:', err);
        setEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [selectedMonth]);

  const activeMonthData = ethiopianMonths.find((m) => m.num === selectedMonth) || ethiopianMonths[0];
  const activeFeasts = monthlyFeasts[selectedMonth] || [
    { day: 21, titleAm: 'የእመቤታችን ማርያም ወርሃዊ በዓል', titleEn: 'Monthly St. Mary Commemoration', type: 'MONTHLY' },
    { day: 27, titleAm: 'መድኃኔዓለም ወርሃዊ በዓል', titleEn: 'Monthly Medhane Alem Commemoration', type: 'MONTHLY' },
  ];

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-neutral-100 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 border-b border-[#2A2620] bg-gradient-to-b from-[#181512] to-[#0C0B0A]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 mb-3">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>
                  {locale === 'am' ? 'ባሕረ ሐሳብና ሥርዓተ በዓላት' : 'Ecclesiastical Liturgical Calendar'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
                {locale === 'am'
                  ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ዓውደ አውራኅ'
                  : '13-Month Liturgical Calendar'}
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
                {locale === 'am'
                  ? 'የ፲፫ቱ አውራኅ በዓላት፣ አጽዋማት፣ ወርሃዊና ዓመታዊ ንግሦች እና የሰበካ ጉባኤ ሁነቶች መርሐ ግብር።'
                  : 'Algorithmic 13-month calendar calculation, immoveable feast commemorations, fasts, and parish gatherings.'}
              </p>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-[#1A1815] border border-[#2F2B24] flex items-center gap-4">
              <Sun className="w-10 h-10 text-[#D4AF37]" />
              <div>
                <div className="text-xs text-neutral-400 font-semibold">
                  {locale === 'am' ? 'የአሁኑ ዓመተ ምሕረት' : 'Current Liturgical Year'}
                </div>
                <div className="text-xl font-bold text-white">፳፻፲፱ ዓ.ም (2026/27)</div>
                <div className="text-[11px] text-[#D4AF37]">ዘመነ ዮሐንስ (ወንጌላዊ)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13-Month Ribbon Selector */}
      <div className="border-b border-[#24201A] bg-[#12100E] sticky top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {ethiopianMonths.map((m) => (
            <button
              key={m.num}
              onClick={() => setSelectedMonth(m.num)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex flex-col items-center ${
                selectedMonth === m.num
                  ? 'bg-gradient-to-r from-[#D4AF37] to-amber-500 text-neutral-950 shadow-md scale-105'
                  : 'bg-[#181613] text-neutral-300 hover:bg-[#25221C] border border-[#2B271F]'
              }`}
            >
              <span>{locale === 'am' ? m.nameAm : m.nameAm}</span>
              <span className="text-[10px] opacity-75 font-normal">
                {locale === 'am' ? `${m.num}ኛ ወር` : `Month ${m.num}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Active Month Title Card */}
        <div className="mb-8 p-6 rounded-2xl bg-[#151310] border border-[#28241D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider mb-1">
              {activeMonthData.season}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {locale === 'am' ? `${activeMonthData.nameAm} ወር` : `${activeMonthData.nameEn}`}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              {locale === 'am'
                ? `በዚህ ወር የሚከበሩ ዓበይት በዓላትና ወርሃዊ መታሰቢያዎች`
                : `Holy feasts, commemorations, and liturgical services in ${activeMonthData.nameEn}`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-lg bg-[#221D16] text-[#D4AF37] border border-[#332B1E]">
              {selectedMonth === 13 ? '5/6 ቀናት' : '30 ቀናት'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Monthly Commemorations & Feasts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-[#14120F] border border-[#262118] p-6 shadow-md">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>{locale === 'am' ? 'የወሩ ቀኖናዊ በዓላት' : 'Canonical Feasts of the Month'}</span>
              </h3>

              <div className="space-y-3">
                {activeFeasts.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0F0D0B] border border-[#201C15] flex items-center justify-between gap-3 hover:border-[#D4AF37]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#2A2317] border border-[#3E3422] text-[#D4AF37] font-bold flex items-center justify-center text-sm font-mono">
                        {f.day}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-200">
                          {locale === 'am' ? f.titleAm : f.titleEn}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {f.type === 'MAJOR_FEAST'
                            ? (locale === 'am' ? 'ዓቢይ በዓል' : 'Major Feast')
                            : (locale === 'am' ? 'ወርሃዊ መታሰቢያ' : 'Monthly Commemoration')}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#881337]/30 text-rose-300 border border-[#881337]/40">
                      {f.type === 'MAJOR_FEAST' ? 'ዓቢይ' : 'ወርሃዊ'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Liturgical Rule Callout */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1C1611] to-[#120E0A] border border-[#3C301F] p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#D4AF37] mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{locale === 'am' ? 'የቀኖና መመሪያ' : 'Liturgical Directive'}</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {locale === 'am'
                  ? 'በበዓላት ዋዜማ ማሕሌተ ጽጌ፣ ሰዓታትና ዋዜማ ይቆማል። በሰንበትና በዓበይት በዓላት ደግሞ ሥርዓተ ቅዳሴ በማለዳ ይፈጸማል።'
                  : 'All liturgical vigils, Mahlet, and Qeddase are performed in accordance with the canonical rubrics of the EOTC Synod.'}
              </p>
            </div>
          </div>

          {/* Right Column: Parish Gatherings & Events List */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Church className="w-4 h-4 text-[#D4AF37]" />
              <span>{locale === 'am' ? 'የአድባራት ሁነቶችና መርሐ ግብሮች' : 'Parish Events & Gatherings'}</span>
            </h3>

            {events.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-[#14120F] border border-[#262118]">
                <CalendarIcon className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-white">
                  {locale === 'am' ? 'በዚህ ወር የተመዘገበ ሁነት የለም' : 'No Events Scheduled'}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((ev) => {
                  const trans =
                    ev.translations?.find((t) => t.locale === locale) ||
                    ev.translations?.[0];

                  return (
                    <div
                      key={ev.id}
                      id={ev.id}
                      className="p-6 rounded-2xl bg-[#14120F] border border-[#262118] hover:border-[#D4AF37]/50 transition-all shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                          {ev.type}
                        </span>
                        <div className="text-xs font-mono text-neutral-400">
                          {ev.ethiopianDateFormatted || 'መስከረም ፳፻፲፱'}
                        </div>
                      </div>

                      <h4 className="text-lg font-bold text-white mb-2">
                        {trans?.title || ev.title}
                      </h4>

                      <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                        {trans?.description || ev.description}
                      </p>

                      <div className="pt-3 border-t border-[#221D16] flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          <span className="text-neutral-300 font-medium">{ev.venue || 'Addis Ababa'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Church className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{ev.churchName || 'EOTC Parish'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
