'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Music,
  Church,
  Calendar,
  Newspaper,
  ArrowRight,
  ShieldCheck,
  Heart,
  Sparkles,
  Globe,
  DownloadCloud,
  Search,
  Compass,
  Bookmark,
  Share2,
  ChevronRight,
  Play,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface HomePageProps {
  params: { locale: string };
}

export default function HomePage({ params }: HomePageProps) {
  const locale = params.locale || 'am';
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarData, setCalendarData] = useState<any>(null);

  useEffect(() => {
    async function loadCalendar() {
      try {
        const res = await fetch('http://localhost:4000/api/v1/events/calendar');
        if (res.ok) {
          const data = await res.json();
          setCalendarData(data);
        }
      } catch (err) {
        console.warn('Could not fetch calendar for homepage:', err);
      }
    }
    loadCalendar();
  }, []);

  const translations = {
    am: {
      badge: 'ይፋዊ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ዲጂታል መድረክ',
      heroTitle1: 'የቅድስት ቤተክርስቲያን መንፈሳዊና',
      heroTitle2: 'ታሪካዊ ቅርሶች በዲጂታል ዓለም',
      heroSubtitle:
        'ጥንታውያን የብራና መጻሕፍትን፣ ያሬዳዊ ዜማዎችንና መዝሙራትን፣ የአድባራትና ገዳማት መመሪያን እንዲሁም ትክክለኛ የቤተክርስቲያን ትምህርቶችን በአንድ ቦታ ያግኙ።',
      searchPlaceholder: 'ቅዱሳት መጻሕፍትን፣ መዝሙራትን፣ አድባራትን ወይም ዜናዎችን ይፈልጉ...',
      searchBtn: 'ፈልግ',
      todayInCalendar: 'የዕለቱ የኢትዮጵያ ዘመን አቆጣጠር',
      season: 'ወቅት',
      monthlyCommemoration: 'የዕለቱ መታሰቢያ (ማኅሌት)',
      featuredManuscripts: 'የተመረጡ ጥንታውያን መጻሕፍትና ብራናዎች',
      featuredManuscriptsDesc: 'የቀኖናና የሥርዓት መጻሕፍት በኢንተርኔት አንባቢና በማውረጃ ፈቃድ',
      sacredHymnody: 'ያሬዳዊ ዜማዎችና መዝሙራት',
      sacredHymnodyDesc: 'በዜማ ሊቃውንትና በመዘምራን የቀረቡ መዛሙር በግጥም',
      holySynodNews: 'የቅዱስ ሲኖዶስና የአህጉረ ስብከት ዜናዎች',
      holySynodNewsDesc: 'ይፋዊ መግለጫዎች፣ ሐዋርያዊ ጥሪዎችና ወቅታዊ መረጃዎች',
      exploreChurches: 'ጥንታውያን ገዳማትና አድባራት',
      exploreChurchesDesc: 'በዓለም ዙሪያ የሚገኙ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ አብያተ ክርስቲያናት መመሪያ',
      exploreMore: 'ሁሉንም ይመልከቱ',
      readManuscript: 'መጽሐፉን አንብብ',
      openMezmur: 'ግጥሙን ተመልከት',
    },
    gez: {
      badge: 'ማኅደር ዲጂታል ዘኦርቶዶክሳዊት ተዋሕዶ ቤተ ክርስቲያን ዘኢትዮጵያ',
      heroTitle1: 'መንፈሳዊ ወታሪካዊ ቅርስ',
      heroTitle2: 'ዘቅድስት ቤተ ክርስቲያን በዲጂታል',
      heroSubtitle:
        'መጻሕፍት ጥንታውያን፣ ማኅሌታት ወመዛሙር ዘቅዱስ ያሬድ፣ ዜና አድባራት ወገዳማት በነጻ ይትረከብ።',
      searchPlaceholder: 'ኅሥሥ መጻሕፍተ፣ መዛሙረ ወአድባራተ...',
      searchBtn: 'ኅሥሥ',
      todayInCalendar: 'ዘመነ ሉቃስ - ዕለተ ማኅሌት',
      season: 'ዘመን',
      monthlyCommemoration: 'ተዝካረ ዕለት',
      featuredManuscripts: 'መጻሕፍት ጥንታውያን',
      featuredManuscriptsDesc: 'መጻሕፍተ ቀኖና ወጸሎት',
      sacredHymnody: 'መዛሙር ወማኅሌት',
      sacredHymnodyDesc: 'ዜማ ዘቅዱስ ያሬድ ሊቅ',
      holySynodNews: 'ዜና ሲኖዶስ ቅዱስ',
      holySynodNewsDesc: 'ቃለ በረከት ወትእዛዝ',
      exploreChurches: 'አድባራት ወገዳማት',
      exploreChurchesDesc: 'ማኅደረ ታቦተ እግዚአብሔር',
      exploreMore: 'ርኢ ፈድፋደ',
      readManuscript: 'አንብብ',
      openMezmur: 'ስምዕ መዝሙረ',
    },
    en: {
      badge: 'Official Ethiopian Orthodox Tewahedo Digital Heritage Platform',
      heroTitle1: 'Preserving Sacred Orthodox Heritage &',
      heroTitle2: 'Theological Treasures for the World',
      heroSubtitle:
        'Explore authentic Ge\'ez and Amharic illuminated manuscripts, St. Yared hymnody, global church directories, and Holy Synod canonical communications.',
      searchPlaceholder: 'Search sacred books, hymn lyrics, monasteries, articles...',
      searchBtn: 'Search',
      todayInCalendar: 'Ethiopian Liturgical Calendar Today',
      season: 'Season',
      monthlyCommemoration: 'Daily Commemoration',
      featuredManuscripts: 'Featured Liturgical Manuscripts & Books',
      featuredManuscriptsDesc: 'Canonical manuscripts with in-browser protected reader and rights gating',
      sacredHymnody: 'Sacred Hymnody & Mezmur Catalog',
      sacredHymnodyDesc: 'Traditional chants and spiritual hymns with synchronized multilingual lyrics',
      holySynodNews: 'Holy Synod Communications & Articles',
      holySynodNewsDesc: 'Official patriarchal proclamations and theological scholarship',
      exploreChurches: 'Historical Sanctuaries & Monasteries',
      exploreChurchesDesc: 'Verified directory of ancient monasteries and worldwide dioceses',
      exploreMore: 'View All',
      readManuscript: 'Read Manuscript',
      openMezmur: 'View Lyrics',
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.am;

  const featuredBooks = [
    {
      slug: 'metsihafe-qidassie',
      titleAm: 'መጽሐፈ ቅዳሴ (ግዕዝና አማርኛ)',
      titleEn: 'The Book of the Divine Liturgy',
      category: 'ስርዓተ አምልኮ / Liturgy',
      author: 'ሊቃውንተ ቤተክርስቲያን',
      century: '14th Century Ge\'ez & Amharic',
      pages: 412,
      downloadAllowed: true,
      rightsStatus: 'PUBLIC_DOMAIN',
    },
    {
      slug: 'weddase-maryam',
      titleAm: 'ውዳሴ ማርያም የሰባቱ ቀናት',
      titleEn: 'Weddase Maryam (Praise of Mary)',
      category: 'ጸሎት / Prayer',
      author: 'ቅዱስ ኤፍሬም ሶርያዊ',
      century: '4th Century Patristic',
      pages: 184,
      downloadAllowed: true,
      rightsStatus: 'PUBLIC_DOMAIN',
    },
    {
      slug: 'haymanote-abew',
      titleAm: 'ሃይማኖተ አበው (የቀደምት አበው ሃይማኖት)',
      titleEn: 'Haymanote Abew (Faith of the Fathers)',
      category: 'ዶግማና አስተምህሮ / Dogma',
      author: 'አበው ሊቃውንት',
      century: 'Alexandrian & Antiochian Councils',
      pages: 650,
      downloadAllowed: false,
      rightsStatus: 'CHURCH_OWNED',
    },
  ];

  const featuredMezmur = [
    {
      slug: 'ne-na-maryam',
      titleAm: 'ኔና ማርያም ኔና (ኦ ድንግል ኔና)',
      titleEn: 'Come O Virgin Mary (Mother of Mercy)',
      artist: 'የማኅበረ ቅዱሳን መዘምራን (Mahibere Kidusan)',
      season: 'የፍልሰታ ጾም',
    },
    {
      slug: 'meskel-berhanu',
      titleAm: 'መስቀል ብርሃኑ ለኩሉ ዓለም',
      titleEn: 'The Cross is the Light of the World',
      artist: 'የደብረ ሊባኖስ ገዳም መዘምራን (Debre Libanos Monastic Choir)',
      season: 'የመስቀል በዓል',
    },
  ];

  const featuredChurches = [
    {
      slug: 'axum-tsion',
      nameAm: 'የአክሱም ጽዮን ማርያም ካቴድራል',
      nameEn: 'Axum Tsion Maryam Sanctuary',
      region: 'አክሱም, ትግራይ',
      founded: '4ኛው መቶ ክፍለ ዘመን (4th Century)',
      verified: true,
    },
    {
      slug: 'lalibela',
      nameAm: 'ደብረ ሮሃ ቅዱስ ላሊበላ ውቅር አብያተ ክርስቲያናት',
      nameEn: 'Lalibela Rock-Hewn Churches',
      region: 'ላሊበላ, ወሎ',
      founded: '12ኛው መቶ ክፍለ ዘመን (12th Century)',
      verified: true,
    },
    {
      slug: 'debre-libanos',
      nameAm: 'ደብረ ሊባኖስ ገዳም',
      nameEn: 'Debre Libanos Monastery',
      region: 'ሰሜን ሸዋ, ኦሮሚያ',
      founded: '13ኛው መቶ ክፍለ ዘመን (13th Century)',
      verified: true,
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section with Ecclesiastical Radiance */}
      <section className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />
        <div className="absolute top-10 right-10 opacity-5 text-eotc-gold select-none pointer-events-none text-[240px] font-bold">
          ✝
        </div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          {/* Canonical Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-eotc-gold/30 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-eotc-gold animate-pulse" />
            <span className="text-[11px] font-bold text-eotc-gold tracking-wide uppercase">
              {t.badge}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight heading-font">
              <span>{t.heroTitle1} </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-eotc-gold via-amber-200 to-amber-500">
                {t.heroTitle2}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Search Trigger */}
          <div className="max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/${locale}/search?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="flex items-center bg-neutral-900/90 border border-neutral-700/80 hover:border-eotc-gold/60 focus-within:border-eotc-gold rounded-2xl p-1.5 shadow-2xl transition-all backdrop-blur-xl"
            >
              <Search className="w-5 h-5 text-neutral-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white focus:outline-none placeholder:text-neutral-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-eotc-crimson hover:bg-red-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-950/40 transition-colors shrink-0"
              >
                {t.searchBtn}
              </button>
            </form>
          </div>

          {/* Live Liturgical Date Bar */}
          <div className="pt-4">
            <div className="rounded-2xl border border-eotc-gold/30 bg-neutral-900/60 backdrop-blur-md p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-5xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-eotc-gold/10 border border-eotc-gold/30 flex items-center justify-center text-eotc-gold shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-eotc-gold tracking-wider">
                    {t.todayInCalendar}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white">
                    {calendarData?.formattedAm || 'መስከረም 28 ቀን 2019 ዓ.ም. (ሐሙስ)'}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {calendarData?.formattedEn || 'Meskerem 28, 2019 E.C. (Thursday)'} •{' '}
                    <span className="text-amber-300 font-medium">
                      {calendarData?.ethiopianDate?.seasonAm || 'ዘመነ ሉቃስ (Luke)'}
                    </span>
                  </div>
                </div>
              </div>

              {calendarData?.monthlyCommemoration && (
                <div className="flex items-center gap-2.5 bg-neutral-950/60 px-4 py-2 rounded-xl border border-neutral-800 text-xs">
                  <Bookmark className="w-4 h-4 text-eotc-gold shrink-0" />
                  <div>
                    <div className="text-[10px] text-neutral-400">{t.monthlyCommemoration}</div>
                    <div className="text-eotc-gold font-bold">
                      {calendarData.monthlyCommemoration.nameAm}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Manuscripts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-eotc-gold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.featuredManuscripts}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 heading-font">
              {locale === 'am' ? 'የብራናና የቀኖና መጻሕፍት ማዕከል' : 'Ancient Illuminated Manuscripts & Patristic Books'}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">{t.featuredManuscriptsDesc}</p>
          </div>
          <Link
            href={`/${locale}/library`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-eotc-gold hover:text-amber-300 transition-colors"
          >
            <span>{t.exploreMore}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBooks.map((book) => (
            <div
              key={book.slug}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-eotc-gold/40 hover:bg-neutral-900/80 transition-all p-5 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-neutral-800 text-eotc-gold border border-neutral-700">
                    {book.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      book.downloadAllowed
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}
                  >
                    {book.downloadAllowed ? (
                      <>
                        <DownloadCloud className="w-3 h-3" />
                        <span>Download Allowed</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Protected View</span>
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-eotc-gold transition-colors">
                    {locale === 'am' ? book.titleAm : book.titleEn}
                  </h3>
                  <div className="text-xs text-neutral-400 mt-1">
                    {book.author} • {book.century}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-[11px] text-neutral-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Pages:</span>
                    <span className="text-neutral-200 font-mono">{book.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Rights Status:</span>
                    <span className="text-eotc-gold font-mono">{book.rightsStatus}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">PDF Reader Ready</span>
                <Link
                  href={`/${locale}/library/${book.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 group-hover:bg-eotc-crimson text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <span>{t.readManuscript}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sacred Hymnody & Mezmur Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-eotc-gold flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              <span>{t.sacredHymnody}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 heading-font">
              {locale === 'am' ? 'ያሬዳዊ ዜማዎችና ቅዱሳት መዝሙራት' : 'Sacred Hymnody & Liturgical Chants'}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">{t.sacredHymnodyDesc}</p>
          </div>
          <Link
            href={`/${locale}/mezmur`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-eotc-gold hover:text-amber-300 transition-colors"
          >
            <span>{t.exploreMore}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredMezmur.map((mz) => (
            <div
              key={mz.slug}
              className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-eotc-gold/40 transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-eotc-crimson/20 border border-eotc-crimson/40 flex items-center justify-center text-eotc-gold shrink-0">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {locale === 'am' ? mz.titleAm : mz.titleEn}
                  </h3>
                  <div className="text-xs text-neutral-400 mt-0.5">{mz.artist}</div>
                  <div className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-amber-300">
                    {mz.season}
                  </div>
                </div>
              </div>

              <Link
                href={`/${locale}/mezmur`}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold shrink-0 transition-colors"
              >
                {t.openMezmur}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Monasteries & Historic Sanctuaries Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-eotc-gold flex items-center gap-1.5">
              <Church className="w-3.5 h-3.5" />
              <span>{t.exploreChurches}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 heading-font">
              {locale === 'am' ? 'ጥንታውያን ገዳማትና የታሪክ አድባራት' : 'Ancient Monasteries & Canonical Dioceses'}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">{t.exploreChurchesDesc}</p>
          </div>
          <Link
            href={`/${locale}/churches`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-eotc-gold hover:text-amber-300 transition-colors"
          >
            <span>{t.exploreMore}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredChurches.map((church) => (
            <div
              key={church.slug}
              className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-eotc-gold/40 transition-colors space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Canonical Sanctuary</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">{church.founded}</span>
                </div>
                <h3 className="font-bold text-white text-base">
                  {locale === 'am' ? church.nameAm : church.nameEn}
                </h3>
                <p className="text-xs text-neutral-400">{church.region}</p>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-500 font-mono">slug: {church.slug}</span>
                <Link
                  href={`/${locale}/churches/${church.slug}`}
                  className="text-eotc-gold hover:text-amber-300 font-semibold text-xs flex items-center gap-1"
                >
                  <span>Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
