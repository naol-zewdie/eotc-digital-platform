import React from 'react';
import { Search, BookOpen, Music, Church, Newspaper } from 'lucide-react';

export default function SearchPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { q?: string };
}) {
  const locale = params.locale || 'am';
  const query = searchParams?.q || '';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-eotc-gold/30 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold heading-font">
          {locale === 'am' ? 'አጠቃላይ ፍለጋ' : 'Cross-Domain Global Search'}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          {locale === 'am'
            ? 'በመጻሕፍት፣ በመዝሙር፣ በአድባራትና ገዳማት፣ በጽሑፎችና በዜናዎች ውስጥ በአንድ ላይ ይፈልጉ።'
            : 'Unified search across library manuscripts, mezmur hymns, church profiles, and publications.'}
        </p>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-eotc-gold/40 shadow-sm">
        <form className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder={locale === 'am' ? 'የሚፈልጉትን ቃል ያስገቡ (ምሳሌ: ቅዳሴ፣ ኪዳነ ምሕረት፣ ተክለ ሃይማኖት)...' : 'Search by term (e.g., Qidassie, Kidane Mihret, Lalibela)...'}
            className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-eotc-crimson"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-eotc-crimson text-white font-semibold text-xs sm:text-sm hover:bg-eotc-crimson-light transition-all flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>{locale === 'am' ? 'ፈልግ' : 'Search'}</span>
          </button>
        </form>
      </div>

      {query ? (
        <div className="space-y-4">
          <div className="text-xs text-neutral-500 font-medium">
            {locale === 'am' ? `ለ "${query}" የተገኙ ውጤቶች:` : `Search results for "${query}":`}
          </div>
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center py-12 text-neutral-500 text-sm">
            PostgreSQL Full-Text Search and Trigram index query in progress.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-semibold">{locale === 'am' ? 'መጻሕፍት' : 'Books'}</span>
          </div>
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-3">
            <Music className="w-5 h-5 text-red-600" />
            <span className="text-xs font-semibold">{locale === 'am' ? 'መዝሙር' : 'Mezmur'}</span>
          </div>
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-3">
            <Church className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-semibold">{locale === 'am' ? 'አድባራት' : 'Churches'}</span>
          </div>
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-3">
            <Newspaper className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-semibold">{locale === 'am' ? 'ጽሑፎች' : 'Articles'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
