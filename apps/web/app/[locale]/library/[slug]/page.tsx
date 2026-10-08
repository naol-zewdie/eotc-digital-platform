'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  DownloadCloud,
  Lock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Share2,
  Bookmark,
  FileText,
  Sparkles,
  CheckCircle,
  Eye,
  Info,
} from 'lucide-react';
import { BookDto, RightsStatus } from '@eotc/contracts';

interface BookDetailPageProps {
  params: { locale: string; slug: string };
}



export default function BookDetailPage({ params }: BookDetailPageProps) {
  const { locale, slug } = params;
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'READER' | 'METADATA' | 'PROVENANCE'>('READER');
  const [book, setBook] = useState<BookDto | null>(null);

  // Fallback book dictionary
  const fallbackDict: Record<string, BookDto> = {
    'metsihafe-qidassie': {
      id: 'book-001',
      slug: 'metsihafe-qidassie',
      categoryId: 'cat-liturgy',
      categoryNameAm: 'ሥርዓተ አምልኮና ጸሎት',
      categoryNameEn: 'Liturgy & Worship',
      publicationYear: 1998,
      status: 'PUBLISHED' as any,
      rightsId: 'rights-pub-001',
      rights: {
        id: 'rights-pub-001',
        status: RightsStatus.PUBLIC_DOMAIN,
        rightsHolder: 'EOTC Patriarchate Tradition',
        downloadAllowed: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      pageCount: 412,
      viewCount: 3420,
      downloadCount: 1250,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 'trans-001-am',
          bookId: 'book-001',
          locale: 'am',
          title: 'መጽሐፈ ቅዳሴ (ግዕዝና አማርኛ ንባብ ከትርጓሜው ጋር)',
          description: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ዐሥራ አራቱ ቅዳሴያት በግዕዝና በአማርኛ የተዘጋጀ።',
          authorDisplayName: 'ሊቃውንተ ቤተክርስቲያን',
        },
        {
          id: 'trans-001-gez',
          bookId: 'book-001',
          locale: 'gez',
          title: 'መጽሐፈ ቅዳሴ ዘኦርቶዶክሳዊት ተዋሕዶ ቤተ ክርስቲያን',
          description: 'ሥርዓተ ቊርባን ቅዱስ ዘዐሥራ አርባዕቱ ቅዳሴያት።',
          authorDisplayName: 'ሊቃውንተ ቤተ ክርስቲያን',
        },
        {
          id: 'trans-001-en',
          bookId: 'book-001',
          locale: 'en',
          title: 'The Book of the Divine Liturgy (Anaphoras)',
          description: 'The 14 canonical Anaphoras of the Ethiopian Orthodox Tewahedo Church with English translations.',
          authorDisplayName: 'EOTC Ecclesiastical Scholars',
        },
      ],
    },
    'weddase-maryam': {
      id: 'book-002',
      slug: 'weddase-maryam',
      categoryId: 'cat-prayer',
      categoryNameAm: 'ጸሎትና ውዳሴ',
      categoryNameEn: 'Prayer & Praises',
      publicationYear: 2004,
      status: 'PUBLISHED' as any,
      rightsId: 'rights-pub-001',
      rights: {
        id: 'rights-pub-001',
        status: RightsStatus.PUBLIC_DOMAIN,
        rightsHolder: 'EOTC Holy Synod Tradition',
        downloadAllowed: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      pageCount: 184,
      viewCount: 4890,
      downloadCount: 2310,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 'trans-002-am',
          bookId: 'book-002',
          locale: 'am',
          title: 'ውዳሴ ማርያም የሰባቱ ቀናት (ከነአንቀጸ ብርሃን)',
          description: 'በቅዱስ ኤፍሬም ሶርያዊ የተደረሰ የእመቤታችን የሰባቱ ቀናት ምስጋናና ጸሎት።',
          authorDisplayName: 'ቅዱስ ኤፍሬም ሶርያዊ',
        },
        {
          id: 'trans-002-en',
          bookId: 'book-002',
          locale: 'en',
          title: 'Weddase Maryam (Praise of the Virgin Mary)',
          description: 'Daily praises of the Blessed Virgin Mary composed by Saint Ephrem the Syrian.',
          authorDisplayName: 'Saint Ephrem the Syrian',
        },
      ],
    },
    'haymanote-abew': {
      id: 'book-003',
      slug: 'haymanote-abew',
      categoryId: 'cat-patristics',
      categoryNameAm: 'ዶግማና አስተምህሮ',
      categoryNameEn: 'Dogma & Patristics',
      publicationYear: 1986,
      status: 'PUBLISHED' as any,
      rightsId: 'rights-ch-002',
      rights: {
        id: 'rights-ch-002',
        status: RightsStatus.CHURCH_OWNED,
        rightsHolder: 'Holy Synod Department of Publications',
        downloadAllowed: false,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      pageCount: 650,
      viewCount: 2110,
      downloadCount: 420,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 'trans-003-am',
          bookId: 'book-003',
          locale: 'am',
          title: 'ሃይማኖተ አበው (የቀደምት የቤተክርስቲያን አበው ሃይማኖት)',
          description: 'የኦርቶዶክሳዊት ተዋሕዶ እምነት መሠረት የሆኑ የሊቃውንትና የቅዱሳን አበው ትምህርቶች ስብስብ።',
          authorDisplayName: 'አበው ሊቃውንት',
        },
        {
          id: 'trans-003-en',
          bookId: 'book-003',
          locale: 'en',
          title: 'Haymanote Abew (Faith of the Holy Fathers)',
          description: 'Patristic theological treatise preserving ancient Alexandrian and Ephesian christology.',
          authorDisplayName: 'Holy Fathers & Ecclesiastical Doctors',
        },
      ],
    },
  };

  useEffect(() => {
    async function loadBook() {
      try {
        const res = await fetch(`http://localhost:4000/api/v1/library/books/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        } else {
          setBook(fallbackDict[slug] || fallbackDict['metsihafe-qidassie']);
        }
      } catch (err) {
        setBook(fallbackDict[slug] || fallbackDict['metsihafe-qidassie']);
      }
    }
    loadBook();
  }, [slug]);

  const currentBook = book || fallbackDict[slug] || fallbackDict['metsihafe-qidassie'];
  const primaryTrans =
    currentBook.translations.find((t) => t.locale === locale) ||
    currentBook.translations[0];
  const isDownloadAllowed = currentBook.rights?.downloadAllowed ?? false;

  const totalPages = currentBook.pageCount || 412;

  // Sample manuscript liturgy verses for in-browser reader
  const samplePages: Record<number, { rubrics: string; gez: string; am: string; en: string }> = {
    1: {
      rubrics: 'ይበል ካህን፡',
      gez: 'አሐዱ አብ ቅዱስ፤ አሐዱ ወልድ ቅዱስ፤ አሐዱ ውእቱ መንፈስ ቅዱስ።',
      am: 'አንዱ አብ ቅዱስ ነው፤ አንዱ ወልድ ቅዱስ ነው፤ አንዱ መንፈስ ቅዱስም ቅዱስ ነው።',
      en: 'One is the Holy Father; One is the Holy Son; One is the Holy Spirit.',
    },
    2: {
      rubrics: 'ይበል ዲያቆን፡',
      gez: 'ተንሥኡ ለጸሎት። ይበሉ ሕዝብ፡ እግዚኦ ተሣሃለነ።',
      am: 'ለጸሎት ተነሡ። ሕዝቡም፡ አቤቱ ይቅር በለን ይበሉ።',
      en: 'Stand up for prayer. The people: Lord have mercy upon us.',
    },
    3: {
      rubrics: 'ጸሎተ አኰቴት ዘቅዱስ ባስልዮስ፡',
      gez: 'ነአኵቶ ለገባሬ ሠናያት ላዕሌነ እግዚአብሔር መሐሪ አቡሁ ለእግዚእነ ወመድኃኒነ ኢየሱስ ክርስቶስ።',
      am: 'በእኛ ላይ በጎ አድራጊ የሚሆን ቸር አምላክን እናመሰግነዋለን፤ የጌታችንና የመድኃኒታችን የኢየሱስ ክርስቶስ አባት ነው።',
      en: 'We give thanks unto the Doer of good things toward us, the compassionate God, the Father of our Lord and Savior Jesus Christ.',
    },
  };

  const pageContent = samplePages[currentPage] || samplePages[1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/library`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-eotc-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === 'am' ? 'ወደ ቤተ መጻሕፍት ተመለስ' : 'Back to Library Catalog'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-900 border border-neutral-800 text-eotc-gold">
            {currentBook.categoryNameAm || 'ሥርዓተ አምልኮ'}
          </span>
        </div>
      </div>

      {/* Book Hero Summary Banner */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight heading-font">
              {primaryTrans?.title}
            </h1>
            <div className="text-xs sm:text-sm text-neutral-300 font-medium">
              {primaryTrans?.authorDisplayName || 'ሊቃውንተ ቤተክርስቲያን'} • {currentBook.publicationYear || 1998} E.C. • {totalPages} Pages
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              {primaryTrans?.description}
            </p>
          </div>

          {/* Rights & Download Action Box (Section 13 & 34) */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 w-full md:w-80 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-semibold">Canonical Rights:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-eotc-gold border border-neutral-700">
                {currentBook.rights?.status || RightsStatus.PUBLIC_DOMAIN}
              </span>
            </div>
            <div className="text-[11px] text-neutral-400">
              Rights Holder: <strong className="text-neutral-200">{currentBook.rights?.rightsHolder || 'EOTC Patriarchate'}</strong>
            </div>

            {/* Rights-Gated Action Button */}
            {isDownloadAllowed ? (
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Initiating secure SHA-256 verified download of canonical PDF manuscript...');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Download Canonical PDF</span>
              </a>
            ) : (
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/80 text-[11px] text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Protected Reading Mode</span>
                </div>
                <p className="text-[10px] text-amber-300/80 leading-normal">
                  ይህ ቅዱስ መጽሐፍ በቤተክርስቲያን ቀኖና መሠረት ለንባብ ብቻ የተፈቀደ ሲሆን ማውረድ የተከለከለ ነው።
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reader Tabs */}
      <div className="flex border-b border-neutral-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('READER')}
          className={`px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === 'READER'
              ? 'border-eotc-gold text-eotc-gold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          In-Browser Manuscript Reader
        </button>
        <button
          onClick={() => setActiveTab('METADATA')}
          className={`px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === 'METADATA'
              ? 'border-eotc-gold text-eotc-gold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Canonical Translations ({currentBook.translations.length})
        </button>
        <button
          onClick={() => setActiveTab('PROVENANCE')}
          className={`px-4 py-2.5 border-b-2 transition-colors ${
            activeTab === 'PROVENANCE'
              ? 'border-eotc-gold text-eotc-gold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Rights & Provenance Verification
        </button>
      </div>

      {activeTab === 'READER' && (
        <div className="space-y-4">
          {/* PDF Reader Toolbar */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/90 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-neutral-300 font-mono">
                Page <strong className="text-white">{currentPage}</strong> of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-800">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                  className="p-1 hover:text-eotc-gold text-neutral-400"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] text-neutral-300 w-10 text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                  className="p-1 hover:text-eotc-gold text-neutral-400"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Parchment Styled Reader Canvas */}
          <div
            className={`rounded-2xl border border-neutral-800 bg-[#14120e] p-8 md:p-12 transition-all shadow-2xl relative overflow-hidden ${
              isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto' : 'min-h-[520px]'
            }`}
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Subtle Parchment Texture & Header */}
            <div className="max-w-2xl mx-auto space-y-8 text-neutral-100">
              <div className="text-center border-b border-amber-900/40 pb-4">
                <div className="text-xs uppercase font-bold text-amber-500 tracking-widest">
                  ✝ በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን ✝
                </div>
                <div className="text-lg font-bold text-amber-200 mt-1">
                  {primaryTrans?.title}
                </div>
                <div className="text-[10px] text-amber-400/60 font-mono">
                  Folio Page {currentPage} • Canonical Patriarchate Edition
                </div>
              </div>

              {/* Rubrics & Verses */}
              <div className="space-y-6">
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/30">
                  <span className="font-bold text-red-400 text-xs tracking-wider">
                    {pageContent.rubrics}
                  </span>
                </div>

                {/* Ge'ez Liturgical Text */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                    Ge'ez (ግዕዝ ንባብ):
                  </div>
                  <p className="text-base sm:text-lg text-amber-100 font-serif leading-relaxed">
                    {pageContent.gez}
                  </p>
                </div>

                {/* Amharic Commentary */}
                <div className="space-y-1 border-t border-amber-900/30 pt-4">
                  <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    Amharic (አማርኛ ትርጓሜ):
                  </div>
                  <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">
                    {pageContent.am}
                  </p>
                </div>

                {/* English Translation */}
                <div className="space-y-1 border-t border-amber-900/30 pt-4">
                  <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    English Translation:
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                    "{pageContent.en}"
                  </p>
                </div>
              </div>

              {/* Page Number Footer */}
              <div className="text-center pt-8 border-t border-amber-900/40 text-xs font-mono text-amber-400/80">
                — {currentPage} —
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'METADATA' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentBook.translations.map((trans) => (
            <div
              key={trans.id}
              className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-base">{trans.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-eotc-gold border border-neutral-700">
                  {trans.locale.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">{trans.description}</p>
              <div className="text-[11px] text-neutral-400">
                Author Attribution: <strong className="text-neutral-200">{trans.authorDisplayName}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'PROVENANCE' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4 max-w-2xl text-xs">
          <div className="flex items-center gap-2 text-eotc-gold font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Ecclesiastical Rights & Provenance Record</span>
          </div>
          <p className="text-neutral-300 leading-relaxed">
            In accordance with the Holy Synod intellectual property directives and Section 13 of the Digital Platform Architecture, all liturgical manuscripts maintain verified rights records.
          </p>
          <div className="space-y-2 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex justify-between">
              <span className="text-neutral-400">Rights Status:</span>
              <span className="text-eotc-gold font-bold">{currentBook.rights?.status || 'PUBLIC_DOMAIN'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Rights Holder:</span>
              <span className="text-white font-medium">{currentBook.rights?.rightsHolder || 'EOTC Tradition'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Download Permissions:</span>
              <span className={isDownloadAllowed ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {isDownloadAllowed ? 'Allowed (Full Access)' : 'Restricted (Protected View)'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
