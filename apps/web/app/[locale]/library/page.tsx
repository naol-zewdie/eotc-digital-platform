import React from 'react';
import Link from 'next/link';
import { BookOpen, Search, Filter, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LibraryPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'am';

  const sampleBooks = [
    {
      titleAm: 'መጽሐፈ ቅዳሴ (ግዕዝና አማርኛ)',
      titleEn: 'The Book of the Divine Liturgy (Ge\'ez & Amharic)',
      author: 'ሊቃውንተ ቤተክርስቲያን',
      year: 1998,
      pages: 412,
      category: 'ስርዓተ አምልኮ / Liturgy',
      rights: 'PUBLIC_DOMAIN',
      slug: 'metsihafe-qidassie',
    },
    {
      titleAm: 'ውዳሴ ማርያም የሰባቱ ቀናት',
      titleEn: 'Weddase Maryam (Praise of Mary - Weekly)',
      author: 'ቅዱስ ኤፍሬም ሶርያዊ',
      year: 2004,
      pages: 184,
      category: 'ጸሎት / Prayer',
      rights: 'PUBLIC_DOMAIN',
      slug: 'weddase-maryam',
    },
    {
      titleAm: 'ሃይማኖተ አበው',
      titleEn: 'Haymanote Abew (Faith of the Fathers)',
      author: 'አበው ሊቃውንት',
      year: 1986,
      pages: 650,
      category: 'ዶግማና አስተምህሮ / Dogma',
      rights: 'PUBLIC_DOMAIN',
      slug: 'haymanote-abew',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-eotc-gold/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-eotc-crimson dark:text-eotc-gold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>{locale === 'am' ? 'ዲጂታል ቤተ መጻሕፍት' : 'Digital Library Repository'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold heading-font">
            {locale === 'am' ? 'የብራናና የታተሙ መጻሕፍት ማዕከል' : 'Preserved Sacred Manuscripts & Books'}
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder={locale === 'am' ? 'በመጽሐፉ ርዕስ ወይም በጸሐፊ ፈልግ...' : 'Search manuscripts by title or author...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-eotc-crimson"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800">
          <Filter className="w-3.5 h-3.5" />
          <span>{locale === 'am' ? 'ምድቦች' : 'Categories'}</span>
        </button>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sampleBooks.map((book) => (
          <div
            key={book.slug}
            className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-neutral-800 text-amber-900 dark:text-eotc-gold font-medium">
                  {book.category}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{book.rights}</span>
                </span>
              </div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white group-hover:text-eotc-crimson dark:group-hover:text-eotc-gold transition-colors">
                {locale === 'am' ? book.titleAm : book.titleEn}
              </h3>
              <p className="text-xs text-neutral-500">
                {locale === 'am' ? `ጸሐፊ: ${book.author}` : `Author: ${book.author}`} • {book.pages} {locale === 'am' ? 'ገጾች' : 'pages'}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400">PDF Reader Ready</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-eotc-crimson dark:text-eotc-gold">
                <span>{locale === 'am' ? 'አንብብ' : 'Read'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
