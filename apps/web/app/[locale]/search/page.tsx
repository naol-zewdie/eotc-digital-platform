'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search as SearchIcon,
  BookOpen,
  Music,
  Newspaper,
  Church,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  Tag,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  SearchResultType,
  SearchResultItemDto,
  SearchResponseDto,
} from '@eotc/contracts';

interface SearchPageProps {
  params: { locale: string };
}

export default function GlobalSearchPage({ params }: SearchPageProps) {
  const locale = params.locale || 'am';
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<SearchResultType | 'ALL'>('ALL');
  const [results, setResults] = useState<SearchResultItemDto[]>([]);
  const [counts, setCounts] = useState<{
    BOOK: number;
    MEZMUR: number;
    ARTICLE: number;
    CHURCH: number;
    EVENT: number;
  }>({
    BOOK: 0,
    MEZMUR: 0,
    ARTICLE: 0,
    CHURCH: 0,
    EVENT: 0,
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Fallback demo search engine
  const runFallbackSearch = useCallback((q: string, type: SearchResultType | 'ALL') => {
    const fallbackData: SearchResultItemDto[] = [
      {
        id: 'res-book-1',
        type: 'BOOK',
        slug: 'metsihafe-qidassie',
        title: 'መጽሐፈ ቅዳሴ (ሥርዓተ አምልኮና ጸሎት)',
        subtitle: 'ሥርዓተ አምልኮና ጸሎት • EOTC Liturgical Tradition',
        description: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ፲፬ቱ ቅዳሴያት በግዕዝና በአማርኛ ንባብ ከነትርጓሜው።',
        url: `/${locale}/library/metsihafe-qidassie`,
        category: 'liturgy',
        relevanceScore: 95,
      },
      {
        id: 'res-mezmur-1',
        type: 'MEZMUR',
        slug: 'selam-leki-maryam-kibrite',
        title: 'ሰላም ለኪ ማርያም ክብርት እናቴ',
        subtitle: 'ማኅበረ ቅዱሳን • የእመቤታችን ማርያም',
        description: 'ሰላም ለኪ ማርያም ክብርት እናቴ የፍቅር እናት የሰላም ማደሪያዬ በጸሎትሽ ጥላ ሥር አሳርፊኝ...',
        url: `/${locale}/mezmur/selam-leki-maryam-kibrite`,
        category: 'mariam',
        relevanceScore: 90,
      },
      {
        id: 'res-article-1',
        type: 'ARTICLE',
        slug: 'holy-synod-peace-declaration-2026',
        title: 'የቅዱስ ሲኖዶስ ዓመታዊ የሰላምና አንድነት መግለጫ',
        subtitle: 'NEWS • Patriarchate Secretariat',
        description: 'ቅዱስ ሲኖዶስ በወቅታዊ ሀገራዊና ዓለም አቀፋዊ ጉዳዮች ላይ ያወጣው ሰፊ መግለጫና ሐዋርያዊ ጥሪ።',
        url: `/${locale}/articles/holy-synod-peace-declaration-2026`,
        category: 'NEWS',
        relevanceScore: 85,
      },
      {
        id: 'res-church-1',
        type: 'CHURCH',
        slug: 'debre-libanos-monastery',
        title: 'ደብረ ሊባኖስ ገዳም (Debre Libanos Monastery)',
        subtitle: 'North Shewa Diocese • Oromia',
        description: 'በአቡነ ተክለ ሃይማኖት በ፲፫ኛው መቶ ክፍለ ዘመን የተመሠረተ የታሪክና የሃይማኖት ማዕከል የሆነ ታላቅ ገዳም።',
        url: `/${locale}/churches/debre-libanos-monastery`,
        category: 'Oromia',
        relevanceScore: 80,
      },
      {
        id: 'res-event-1',
        type: 'EVENT',
        slug: 'demera-meskel-square',
        title: 'የደመራ ማብራትና የቅዱስ መስቀል ክብረ በዓል',
        subtitle: 'LITURGICAL_FEAST • Meskel Square',
        description: 'በአዲስ አበባ መስቀል አደባባይ የሚካሄድ ብሔራዊና መንፈሳዊ ክብረ በዓል እና የደመራ ማብራት።',
        url: `/${locale}/events#demera-meskel-square`,
        category: 'LITURGICAL_FEAST',
        relevanceScore: 75,
      },
    ];

    if (!q) {
      setResults(fallbackData);
      setTotal(fallbackData.length);
      setCounts({
        BOOK: 1,
        MEZMUR: 1,
        ARTICLE: 1,
        CHURCH: 1,
        EVENT: 1,
      });
      return;
    }

    const qLower = q.toLowerCase();
    const filtered = fallbackData.filter((item) => {
      const typeMatch = type === 'ALL' || item.type === type;
      const textMatch =
        item.title.toLowerCase().includes(qLower) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(qLower)) ||
        (item.description && item.description.toLowerCase().includes(qLower));
      return typeMatch && textMatch;
    });

    setResults(filtered);
    setTotal(filtered.length);
  }, [locale]);

  const fetchResults = useCallback(async (q: string, type: SearchResultType | 'ALL') => {
    setLoading(true);
    try {
      const url = `http://localhost:4000/api/v1/search?q=${encodeURIComponent(
        q,
      )}&type=${type}&locale=${locale}`;
      const res = await fetch(url);
      if (res.ok) {
        const data: SearchResponseDto = await res.json();
        setResults(data.results);
        setTotal(data.total);
        setCounts(data.countsByType);
      } else {
        runFallbackSearch(q, type);
      }
    } catch (err) {
      console.warn('API unavailable, running fallback search:', err);
      runFallbackSearch(q, type);
    } finally {
      setLoading(false);
    }
  }, [locale, runFallbackSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults(query, selectedType);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, selectedType, fetchResults]);

  const typeConfig: Record<
    SearchResultType,
    { labelAm: string; labelEn: string; icon: any; color: string }
  > = {
    BOOK: {
      labelAm: 'መጻሕፍት',
      labelEn: 'Books',
      icon: BookOpen,
      color: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
    },
    MEZMUR: {
      labelAm: 'መዝሙር',
      labelEn: 'Mezmur',
      icon: Music,
      color: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
    },
    ARTICLE: {
      labelAm: 'መጣጥፍና ዜና',
      labelEn: 'Articles',
      icon: Newspaper,
      color: 'text-blue-400 bg-blue-950/40 border-blue-800/40',
    },
    CHURCH: {
      labelAm: 'አብያተ ክርስቲያናት',
      labelEn: 'Churches',
      icon: Church,
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
    },
    EVENT: {
      labelAm: 'በዓላትና ሁነቶች',
      labelEn: 'Events',
      icon: Calendar,
      color: 'text-purple-400 bg-purple-950/40 border-purple-800/40',
    },
  };

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-neutral-100 pb-24">
      {/* Search Header */}
      <section className="relative overflow-hidden py-14 border-b border-[#2A2620] bg-gradient-to-b from-[#181512] to-[#0C0B0A]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {locale === 'am' ? 'ሁለንተናዊ ፍለጋ' : 'Unified Platform Search'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {locale === 'am'
                ? 'በመላው የዲጂታል መድረክ ይፈልጉ'
                : 'Search Across All Ecclesiastical Archives'}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
              {locale === 'am'
                ? 'መጻሕፍትን፣ መዝሙራትን፣ የቅዱስ ሲኖዶስ መግለጫዎችን፣ አብያተ ክርስቲያናትንና የበዓላት ቀን መቁጠሪያን በአንድ ላይ ፈልግ።'
                : 'Find manuscripts, sacred hymnody, synod articles, diocesan parishes, and liturgical calendar events.'}
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#D4AF37]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                locale === 'am'
                  ? 'ለምሳሌ፦ ቅዳሴ፣ ማርያም፣ ደብረ ሊባኖስ፣ መስቀል፣ ሲኖዶስ...'
                  : 'Search by keyword, e.g. Qeddase, St. Mary, Libanos, Meskel, Synod...'
              }
              className="w-full pl-14 pr-12 py-4 rounded-2xl bg-[#161411] border-2 border-[#3A3328] focus:border-[#D4AF37] text-white placeholder-neutral-500 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 text-base transition-all"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-white"
              >
                {locale === 'am' ? 'አጽዳ' : 'Clear'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter Chips Bar */}
      <div className="border-b border-[#24201A] bg-[#12100E] sticky top-20 z-30 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === 'ALL'
                  ? 'bg-[#881337] text-white border border-[#A21CAF]'
                  : 'bg-[#1A1815] text-neutral-300 hover:bg-[#27231E] border border-[#2D2821]'
              }`}
            >
              {locale === 'am' ? 'ሁሉም ውጤቶች' : 'All Results'} ({total})
            </button>

            {(['BOOK', 'MEZMUR', 'ARTICLE', 'CHURCH', 'EVENT'] as SearchResultType[]).map((t) => {
              const cfg = typeConfig[t];
              const Icon = cfg.icon;
              const count = counts[t] || 0;

              return (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedType === t
                      ? 'bg-[#881337] text-white border border-[#A21CAF]'
                      : 'bg-[#1A1815] text-neutral-300 hover:bg-[#27231E] border border-[#2D2821]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{locale === 'am' ? cfg.labelAm : cfg.labelEn}</span>
                  <span className="opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-neutral-400 whitespace-nowrap">
            {total} {locale === 'am' ? 'ውጤቶች' : 'found'}
          </div>
        </div>
      </div>

      {/* Results List */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4AF37] mb-3" />
            <div className="text-neutral-400 text-sm">
              {locale === 'am' ? 'ፍለጋ በመከናወን ላይ...' : 'Searching archives...'}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-[#141210] border border-[#27231D] max-w-lg mx-auto">
            <SearchIcon className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              {locale === 'am' ? 'ምንም ውጤት አልተገኘም' : 'No Results Found'}
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-4">
              {locale === 'am'
                ? `ለ "${query}" የተገኘ መረጃ የለም። እባክዎ የፊደል አጻጻፍዎን ያረጋግጡ።`
                : `No matching records found for "${query}". Try another keyword or switch category.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((item) => {
              const cfg = typeConfig[item.type];
              const Icon = cfg.icon;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#141210] border border-[#26221C] hover:border-[#D4AF37]/50 transition-all p-5 shadow-sm group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Top Badges */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${cfg.color}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{locale === 'am' ? cfg.labelAm : cfg.labelEn}</span>
                        </span>

                        {item.category && (
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug mb-1">
                        <Link href={item.url}>{item.title}</Link>
                      </h2>

                      {/* Subtitle */}
                      {item.subtitle && (
                        <div className="text-xs text-neutral-400 mb-2 font-medium">
                          {item.subtitle}
                        </div>
                      )}

                      {/* Description */}
                      {item.description && (
                        <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <Link
                      href={item.url}
                      className="p-2.5 rounded-xl bg-[#201C16] hover:bg-[#D4AF37] text-neutral-400 hover:text-black transition-colors self-center shrink-0"
                      aria-label="Open"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
