'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  DownloadCloud,
  FileText,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { BookDto, RightsStatus } from '@eotc/contracts';
import { GridLines } from '../../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../../components/DoorDennis/DoorDennisButton';
import { TextScrambler } from '../../../components/DoorDennis/TextScrambler';

interface LibraryPageProps {
  params: { locale: string };
}

export default function LibraryPage({ params }: LibraryPageProps) {
  const locale = params.locale || 'am';
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

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
      downloadCount: 2100,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 'trans-002-am',
          bookId: 'book-002',
          locale: 'am',
          title: 'ውዳሴ ማርያም የብራና ቅጂ ከነምስጢሩ',
          description: 'የእመቤታችን የድንግል ማርያም የ፯ቱ ዕለታት ውዳሴና አንቀጸ ብርሃን ምስጋና።',
          authorDisplayName: 'ቅዱስ ኤፍሬም ሶርያዊ',
        },
        {
          id: 'trans-002-en',
          bookId: 'book-002',
          locale: 'en',
          title: 'Wudasie Maryam (Praises of St. Mary)',
          description: 'The canonical weekly Marian hymns composed by St. Ephrem the Syrian.',
          authorDisplayName: 'St. Ephrem the Syrian',
        },
      ],
    },
    {
      id: 'book-003',
      slug: 'haymanote-abew',
      categoryId: 'cat-patristics',
      categoryNameAm: 'ዶግማና አስተምህሮ',
      categoryNameEn: 'Patristic Dogma',
      publicationYear: 1986,
      status: 'PUBLISHED' as any,
      rightsId: 'rights-pub-001',
      rights: {
        id: 'rights-pub-001',
        status: RightsStatus.PUBLIC_DOMAIN,
        rightsHolder: 'Patriarchate Publication Department',
        downloadAllowed: false,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      pageCount: 560,
      viewCount: 2310,
      downloadCount: 0,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 'trans-003-am',
          bookId: 'book-003',
          locale: 'am',
          title: 'ሃይማኖተ አበው (የቀደምት ሊቃውንት ምስክርነት)',
          description: 'የቀደምት ሐዋርያትና የኦርቶዶክሳውያን አበው የነገረ መለኮት ትምህርት ስብስብ።',
          authorDisplayName: 'ሊቃውንተ ቤተክርስቲያን',
        },
        {
          id: 'trans-003-en',
          bookId: 'book-003',
          locale: 'en',
          title: 'Haymanote Abew (Faith of the Fathers)',
          description: 'Patristic compendium of theological treatises and orthodox confessions of faith.',
          authorDisplayName: 'Church Fathers',
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
    { id: 'ALL', label: isEn ? 'All Manuscripts' : 'ሁሉም መጻሕፍት' },
    { id: 'cat-liturgy', label: isEn ? 'Liturgy & Worship' : 'ሥርዓተ አምልኮ' },
    { id: 'cat-prayer', label: isEn ? 'Prayer & Praises' : 'ጸሎትና ውዳሴ' },
    { id: 'cat-patristics', label: isEn ? 'Dogma & Patristics' : 'ዶግማና አስተምህሮ' },
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
          (t.authorDisplayName && t.authorDisplayName.toLowerCase().includes(q))
      );
      if (!matchTitle && !b.slug.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="relative min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F7F5F0]">
      {/* 9 Architectural Lines */}
      <GridLines count={9} opacity={0.07} />

      <div className="relative max-w-7xl mx-auto z-10 space-y-12">
        {/* Page Header */}
        <div className="border-b border-neutral-300/70 pb-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
            <BookOpen className="w-4 h-4 text-neutral-800" />
            <span>{isEn ? 'Patriarchate Library' : 'ዲጂታል ቤተ መጻሕፍት'}</span>
            <span>・</span>
            <span className="text-neutral-400">{filteredBooks.length} Available</span>
          </div>

          <KineticTitle
            plainText={isEn ? 'Illuminated Parchment &' : 'የብራናና የታተሙ'}
            italicWord={isEn ? 'Manuscript Vault' : 'ቅዱሳት መጻሕፍት'}
            afterText=""
            as="h1"
            className="text-4xl sm:text-5xl lg:text-6xl text-neutral-900"
          />

          <p className="text-base text-neutral-600 max-w-2xl leading-relaxed">
            {isEn
              ? 'Explore authentic ecclesiastical texts, canonical anaphoras, patristic homilies, and daily horologiums with verified church governance.'
              : 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ጥንታዊ የብራና መጻሕፍት፣ ቅዳሴያት፣ ድርሳናትና የሊቃውንት ትምህርቶች በአንድ ማዕከል ተሰብስበው የሚገኙበት።'}
          </p>
        </div>

        {/* Filter Badges & Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Badge Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === c.id
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white/80 border border-neutral-300/70 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isEn ? 'Search manuscripts...' : 'መጻሕፍትን ፈልግ...'}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-neutral-300/80 bg-white/90 text-neutral-900 placeholder:text-neutral-400 text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        {/* Manuscript Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => {
            const trans =
              book.translations.find((t) => t.locale === locale) ||
              book.translations[0];

            return (
              <div
                key={book.id}
                className="dd-project-card p-6 flex flex-col justify-between bg-white border border-neutral-200/90 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span className="uppercase tracking-wider">
                      {book.categoryNameAm || book.categoryNameEn}
                    </span>
                    <span>{book.pageCount} Pages</span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 tracking-tight group-hover:text-amber-800 transition-colors">
                    {trans?.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {trans?.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-neutral-500">
                    <span>{trans?.authorDisplayName || 'ሊቃውንተ ቤተክርስቲያን'}</span>
                  </div>

                  <DoorDennisButton
                    href={`/${locale}/library/${book.slug}`}
                    className="!py-1.5 !px-3 !text-xs"
                  >
                    {isEn ? 'Read' : 'አንብብ'}
                  </DoorDennisButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
