'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Filter,
  ShieldCheck,
  ArrowRight,
  DownloadCloud,
  Lock,
  Layers,
  Sparkles,
  FileText,
} from 'lucide-react';
import { BookDto, RightsStatus } from '@eotc/contracts';

interface LibraryPageProps {
  params: { locale: string };
}

export default function LibraryPage({ params }: LibraryPageProps) {
  const locale = params.locale || 'am';
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');

  // Fallback demo books
  const fallbackBooks: BookDto[] = [
    {
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
    {
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
    {
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
    {
      id: 'book-004',
      slug: 'sinkisar-meskerem',
      categoryId: 'cat-hagiography',
      categoryNameAm: 'ገድላትና ድርሳናት',
      categoryNameEn: 'Synaxarium & Hagiography',
      publicationYear: 2001,
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
      pageCount: 520,
      viewCount: 1820,
      downloadCount: 610,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 'trans-004-am',
          bookId: 'book-004',
          locale: 'am',
          title: 'መጽሐፈ ስንክሳር (ዘወርኃ መስከረምና ጥቅምት)',
          description: 'የቅዱሳን ሰማዕታትና ጻድቃን ዕለታዊ መታሰቢያና ታሪክ።',
          authorDisplayName: 'ሊቃውንተ ቤተክርስቲያን',
        },
        {
          id: 'trans-004-en',
          bookId: 'book-004',
          locale: 'en',
          title: 'The Ethiopian Synaxarium (Meskerem & Tikimt)',
          description: 'Daily commemoration of saints, martyrs, and angelic apparitions.',
          authorDisplayName: 'Patriarchate Liturgical Commission',
        },
      ],
    },
  ];

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch('http://localhost:4000/api/v1/library/books');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setBooks(data);
          } else {
            setBooks(fallbackBooks);
          }
        } else {
          setBooks(fallbackBooks);
        }
      } catch (err) {
        setBooks(fallbackBooks);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const categories = [
    { id: 'ALL', labelAm: 'ሁሉም መጻሕፍት', labelEn: 'All Books' },
    { id: 'cat-liturgy', labelAm: 'ሥርዓተ አምልኮ / Liturgy', labelEn: 'Liturgy' },
    { id: 'cat-prayer', labelAm: 'ጸሎትና ውዳሴ / Prayer', labelEn: 'Prayer' },
    { id: 'cat-patristics', labelAm: 'ዶግማና አስተምህሮ / Dogma', labelEn: 'Dogma & Patristics' },
    { id: 'cat-hagiography', labelAm: 'ገድላትና ድርሳናት / Hagiography', labelEn: 'Hagiography' },
  ];

  const filteredBooks = books.filter((b) => {
    if (selectedCategory !== 'ALL' && b.categoryId !== selectedCategory) {
      return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = b.translations.some(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.authorDisplayName && t.authorDisplayName.toLowerCase().includes(q)),
      );
      if (!matchTitle && !b.slug.toLowerCase().includes(q)) return false;
    }

    if (selectedLanguage !== 'ALL') {
      const hasLocale = b.translations.some((t) => t.locale === selectedLanguage);
      if (!hasLocale) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-eotc-gold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>{locale === 'am' ? 'ዲጂታል ቤተ መጻሕፍት' : 'Digital Liturgical Repository'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white heading-font">
            {locale === 'am' ? 'የብራናና የታተሙ መጻሕፍት ማዕከል' : 'Preserved Sacred Manuscripts & Books'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Explore authentic ecclesiastical texts, anaphoras, patristics, and prayer books with in-browser reading
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold">
            {filteredBooks.length} Manuscripts Available
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                locale === 'am'
                  ? 'በመጽሐፉ ርዕስ ወይም በጸሐፊ ፈልግ...'
                  : 'Search manuscripts by title, author, or keyword...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/60 text-white placeholder:text-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-eotc-gold"
            />
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-neutral-900/60 border border-neutral-800 rounded-xl p-1 shrink-0">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'am', label: 'አማርኛ' },
              { id: 'gez', label: 'ግዕዝ' },
              { id: 'en', label: 'English' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedLanguage === lang.id
                    ? 'bg-neutral-800 text-eotc-gold border border-eotc-gold/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-eotc-crimson text-white shadow-sm'
                  : 'bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {locale === 'am' ? cat.labelAm : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => {
          const primaryTrans =
            book.translations.find((t) => t.locale === locale) || book.translations[0];
          const isDownloadAllowed = book.rights?.downloadAllowed ?? true;

          return (
            <div
              key={book.slug}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-eotc-gold/40 hover:bg-neutral-900/80 transition-all p-5 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-neutral-800 text-eotc-gold border border-neutral-700">
                    {book.categoryNameAm || 'ቀኖናዊ መጽሐፍ'}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isDownloadAllowed
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}
                  >
                    {isDownloadAllowed ? (
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
                  <h3 className="font-bold text-base text-white group-hover:text-eotc-gold transition-colors line-clamp-2">
                    {primaryTrans?.title || book.slug}
                  </h3>
                  <div className="text-xs text-neutral-400 mt-1">
                    {primaryTrans?.authorDisplayName || 'Scholars of the Holy Synod'} • {book.pageCount} pages
                  </div>
                  {primaryTrans?.description && (
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                      {primaryTrans.description}
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-[11px] text-neutral-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Rights Status:</span>
                    <span className="text-eotc-gold font-mono">{book.rights?.status || 'PUBLIC_DOMAIN'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Translations:</span>
                    <span className="text-neutral-300">
                      {book.translations.map((t) => t.locale.toUpperCase()).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">PDF Reader Ready</span>
                <Link
                  href={`/${locale}/library/${book.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 group-hover:bg-eotc-crimson text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <span>{locale === 'am' ? 'አንብብ' : 'Read'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
