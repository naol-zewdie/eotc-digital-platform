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
  Share2,
  Bookmark,
  FileText,
  Sparkles,
  Check,
  Eye,
  Info,
} from 'lucide-react';
import { BookDto, RightsStatus } from '@eotc/contracts';
import { GridLines } from '../../../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../../../components/DoorDennis/DoorDennisButton';
import { TextScrambler } from '../../../../components/DoorDennis/TextScrambler';

interface BookDetailPageProps {
  params: { locale: string; slug: string };
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const { locale, slug } = params;
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTab, setActiveTab] = useState<'READER' | 'METADATA' | 'PROVENANCE'>('READER');
  const [book, setBook] = useState<BookDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
      pageCount: 168,
      viewCount: 5210,
      downloadCount: 2840,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 'trans-002-am',
          bookId: 'book-002',
          locale: 'am',
          title: 'ውዳሴ ማርያም (ከሰባት ቀናት ጸሎትና ትርጓሜ ጋር)',
          description: 'ለእያንዳንዱ የሳምንቱ ቀን የተዘጋጁ የእመቤታችን ምስጋናዎችና የሊቃውንት ትርጓሜ።',
          authorDisplayName: 'ቅዱስ ኤፍሬም ሶርያዊ',
        },
        {
          id: 'trans-002-en',
          bookId: 'book-002',
          locale: 'en',
          title: 'Weddase Maryam (Praises of Mary for the 7 Days)',
          description: 'The seven daily prayers of praise dedicated to the Blessed Virgin Mary.',
          authorDisplayName: 'Saint Ephrem the Syrian',
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
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [slug]);

  const currentBook = book || fallbackDict[slug] || fallbackDict['metsihafe-qidassie'];
  const primaryTrans =
    currentBook.translations.find((t) => t.locale === locale) ||
    currentBook.translations[0];
  const isDownloadAllowed = currentBook.rights?.downloadAllowed ?? true;
  const totalPages = currentBook.pageCount || 412;

  // Sample manuscript liturgy verses for in-browser reader
  const samplePages: Record<number, { rubrics: string; gez: string; am: string; en: string }> = {
    1: {
      rubrics: 'ይበል ካህን / The Priest Chants:',
      gez: 'አሐዱ አብ ቅዱስ፤ አሐዱ ወልድ ቅዱስ፤ አሐዱ ውእቱ መንፈስ ቅዱስ።',
      am: 'አንዱ አብ ቅዱስ ነው፤ አንዱ ወልድ ቅዱስ ነው፤ አንዱ መንፈስ ቅዱስም ቅዱስ ነው።',
      en: 'One is the Holy Father; One is the Holy Son; One is the Holy Spirit.',
    },
    2: {
      rubrics: 'ይበል ዲያቆን / The Deacon Proclaims:',
      gez: 'ተንሥኡ ለጸሎት። ይበሉ ሕዝብ፡ እግዚኦ ተሣሃለነ።',
      am: 'ለጸሎት ተነሡ። ሕዝቡም፡ አቤቱ ይቅር በለን ይበሉ።',
      en: 'Stand up for prayer. The people: Lord have mercy upon us.',
    },
    3: {
      rubrics: 'ጸሎተ አኰቴት ዘቅዱስ ባስልዮስ / Prayer of Thanksgiving:',
      gez: 'ነአኵቶ ለገባሬ ሠናያት ላዕሌነ እግዚአብሔር መሐሪ አቡሁ ለእግዚእነ ወመድኃኒነ ኢየሱስ ክርስቶስ።',
      am: 'በእኛ ላይ በጎ አድራጊ የሚሆን ቸር አምላክን እናመሰግነዋለን፤ የጌታችንና የመድኃኒታችን የኢየሱስ ክርስቶስ አባት ነው።',
      en: 'We give thanks unto the Benefactor of all, the merciful God, Father of our Lord and Savior Jesus Christ.',
    },
  };

  const pageContent = samplePages[currentPage] || samplePages[1];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C89D3C] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F7F5F0] text-[#201F1E] pb-28 overflow-hidden">
      {/* 9 Architectural Vertical Grid Lines */}
      <GridLines count={9} opacity={0.08} />

      {/* Top Breadcrumb Bar */}
      <div className="relative z-10 border-b border-[#201F1E]/10 bg-[#FAF9F6]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs font-mono">
          <Link
            href={`/${locale}/library`}
            className="group inline-flex items-center gap-2 text-[#5C5A56] hover:text-[#201F1E] transition-colors"
          >
            <span className="w-6 h-6 rounded-lg border border-[#201F1E]/15 flex items-center justify-center group-hover:border-[#201F1E] group-hover:bg-[#201F1E] group-hover:text-[#F7F5F0] transition-all">
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
            <span className="uppercase tracking-wider font-semibold">
              {isEn ? 'Back to Library' : isGez ? 'ተመየጥ ኀበ መጻሕፍት' : 'ወደ ቤተ መጻሕፍት ተመለስ'}
            </span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#201F1E]/15 text-[#5C5A56] hover:text-[#201F1E] hover:border-[#201F1E] hover:bg-[#FAF9F6] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">{isEn ? 'Copied' : 'ተቀድቷል!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Share Folio' : 'አጋራ'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 z-10 space-y-10">
        {/* Book Header Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[#201F1E]/10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#201F1E] text-[#F7F5F0]">
                  <BookOpen className="w-3 h-3 text-[#C89D3C] inline mr-1" />
                  {currentBook.categoryNameAm || currentBook.categoryNameEn || 'ሥርዓተ አምልኮ'}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#FAF9F6] border border-[#201F1E]/15 text-[#C89D3C]">
                  {currentBook.rights?.status || 'PUBLIC DOMAIN'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#201F1E] leading-tight">
                {primaryTrans?.title}
              </h1>

              <div className="text-xs font-mono text-[#5C5A56] flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>{primaryTrans?.authorDisplayName || 'ሊቃውንተ ቤተክርስቲያን'}</span>
                <span>・</span>
                <span>{currentBook.publicationYear || 1998} E.C.</span>
                <span>・</span>
                <span>{totalPages} {isEn ? 'Pages' : 'ገጾች'}</span>
              </div>

              <p className="text-sm text-[#5C5A56] font-serif leading-relaxed pt-1">
                {primaryTrans?.description}
              </p>
            </div>

            {/* Download Action Box */}
            <div className="shrink-0 lg:self-center">
              <DoorDennisButton
                onClick={() => alert(isEn ? 'Downloading high-resolution parchment facsimile...' : 'ጥንታዊውን የብራና ቅጂ በማውረድ ላይ...')}
              >
                <span className="flex items-center gap-1.5">
                  <DownloadCloud className="w-4 h-4" />
                  <span>{isEn ? 'Download PDF Folio' : 'መጽሐፉን አውርድ'}</span>
                </span>
              </DoorDennisButton>
            </div>
          </div>
        </div>

        {/* In-Browser Manuscript Reader Viewport */}
        <div className="rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-md overflow-hidden">
          {/* Reader Top Controls */}
          <div className="p-4 sm:p-5 border-b border-[#201F1E]/10 flex flex-wrap items-center justify-between gap-4 bg-[#EDEAE3]/60">
            {/* Page navigation */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="w-8 h-8 rounded-xl border border-[#201F1E]/15 bg-[#FAF9F6] hover:bg-[#201F1E] hover:text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 rounded-xl bg-[#FAF9F6] border border-[#201F1E]/10 font-bold text-[#201F1E]">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="w-8 h-8 rounded-xl border border-[#201F1E]/15 bg-[#FAF9F6] hover:bg-[#201F1E] hover:text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom tuner */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                className="w-8 h-8 rounded-xl border border-[#201F1E]/15 bg-[#FAF9F6] hover:bg-[#EDEAE3] flex items-center justify-center text-[#201F1E]"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center text-[#5C5A56]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                className="w-8 h-8 rounded-xl border border-[#201F1E]/15 bg-[#FAF9F6] hover:bg-[#EDEAE3] flex items-center justify-center text-[#201F1E]"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Parchment Reading Container */}
          <div className="p-8 sm:p-14 min-h-[420px] flex items-center justify-center bg-[#F7F5F0]">
            <div
              className="max-w-2xl w-full p-8 sm:p-12 rounded-2xl bg-[#FAF9F6] border border-[#C89D3C]/30 shadow-lg space-y-8 select-text transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Header Rubric */}
              <div className="text-center pb-4 border-b border-[#201F1E]/10">
                <span className="font-mono text-xs uppercase text-[#C89D3C] tracking-widest font-bold">
                  {pageContent.rubrics}
                </span>
              </div>

              {/* Ge'ez Chant Script */}
              <div className="space-y-2 text-center">
                <div className="text-xs font-mono text-[#7A7771] uppercase">ንባበ ግዕዝ / Ancient Ge'ez Text</div>
                <div className="text-2xl sm:text-3xl font-serif text-[#201F1E] font-bold leading-relaxed">
                  {pageContent.gez}
                </div>
              </div>

              {/* Amharic Commentary */}
              <div className="space-y-2 pt-2 border-t border-[#201F1E]/5 text-center">
                <div className="text-xs font-mono text-[#7A7771] uppercase">ትርጓሜ / Amharic Exposition</div>
                <div className="text-lg sm:text-xl font-serif text-[#201F1E]/90 leading-relaxed">
                  {pageContent.am}
                </div>
              </div>

              {/* English Translation */}
              <div className="space-y-2 pt-2 border-t border-[#201F1E]/5 text-center">
                <div className="text-xs font-mono text-[#7A7771] uppercase">English Version</div>
                <div className="text-sm sm:text-base font-serif italic text-[#5C5A56] leading-relaxed">
                  &quot;{pageContent.en}&quot;
                </div>
              </div>

              {/* Folio Bottom Mark */}
              <div className="text-center pt-4 border-t border-[#201F1E]/10 text-[11px] font-mono text-[#7A7771]">
                ገጽ {currentPage} ・ Folio {currentPage}R ・ EOTC Patriarchate Manuscript Archive
              </div>
            </div>
          </div>
        </div>

        {/* Metadata & Canonical Provenance Accordion Card */}
        <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#201F1E]/10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C89D3C]" />
            <h3 className="text-lg font-bold font-serif text-[#201F1E]">
              {isEn ? 'Archival Provenance & Verification' : 'የብራናው ታሪካዊ አመጣጥና ቀኖናዊ ይዞታ'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-[#EDEAE3] space-y-1">
              <span className="text-[#7A7771] uppercase">ባለቤትነት / Copyright Holder:</span>
              <div className="font-bold text-[#201F1E]">{currentBook.rights?.rightsHolder || 'የመንበረ ፓትርያርክ ቅርስ'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EDEAE3] space-y-1">
              <span className="text-[#7A7771] uppercase">የማውረድ ፈቃድ / Download Status:</span>
              <div className="font-bold text-emerald-700">ክፍት የሕዝብ ቅርስ (Open Canonical Access)</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EDEAE3] space-y-1">
              <span className="text-[#7A7771] uppercase">ቋንቋ / Canonical Languages:</span>
              <div className="font-bold text-[#201F1E]">ግዕዝ፣ አማርኛ፣ English</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
