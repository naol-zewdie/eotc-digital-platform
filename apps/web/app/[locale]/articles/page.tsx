'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  BookOpen,
  Search,
  Filter,
  Calendar,
  User,
  Eye,
  ArrowRight,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { ArticleDto, ArticleType } from '@eotc/contracts';

interface ArticlesPageProps {
  params: { locale: string };
}

export default function ArticlesPage({ params }: ArticlesPageProps) {
  const locale = params.locale || 'am';
  const [articles, setArticles] = useState<ArticleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Rich canonical fallback articles
  const fallbackArticles: ArticleDto[] = [
    {
      id: 'art-synod-01',
      slug: 'holy-synod-peace-declaration-2026',
      type: ArticleType.NEWS,
      status: 'PUBLISHED' as any,
      authorName: 'Patriarchate Secretariat / የቅዱስ ሲኖዶስ ዋና ጽ/ቤት',
      publishedAt: '2026-01-20T00:00:00.000Z',
      viewCount: 4210,
      createdAt: '2026-01-18',
      updatedAt: '2026-01-20',
      translations: [
        {
          id: 'trans-art-syn-am',
          locale: 'am',
          title: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ቅዱስ ሲኖዶስ ዓመታዊ የሰላምና አንድነት መግለጫ',
          summary: 'ቅዱስ ሲኖዶስ በወቅታዊ ሀገራዊና ዓለም አቀፋዊ ጉዳዮች ላይ ያወጣው ሰፊ መግለጫና ሐዋርያዊ ጥሪ።',
          contentMarkdown: `# የቅዱስ ሲኖዶስ ሐዋርያዊ መግለጫ

በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።

የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ቅዱስ ሲኖዶስ ባካሄደው ምልዐተ ጉባኤ ለመላው የሀገራችን ሕዝቦችና በዓለም ዙሪያ ለሚገኙ ምእመናን የሰላም፣ የፍቅርና የአንድነት ጥሪውን አስተላልፏል።`,
        },
        {
          id: 'trans-art-syn-en',
          locale: 'en',
          title: 'Official Declaration of the Holy Synod on Peace, Unity and Heritage Preservation',
          summary: 'The Holy Synod issues an apostolic call to the faithful worldwide on unity, monastic heritage, and pastoral peace.',
          contentMarkdown: `# Apostolic Declaration of the Holy Synod

In the name of the Father, and of the Son, and of the Holy Spirit, One God, Amen.

The Holy Synod of the Ethiopian Orthodox Tewahedo Church convened in plenary assembly issues this solemn apostolic call for peace, unity, and Christian charity.`,
        },
      ],
    },
    {
      id: 'art-theology-02',
      slug: 'theology-of-incarnation-tewahedo-faith',
      type: ArticleType.ARTICLE,
      status: 'PUBLISHED' as any,
      authorName: 'Clergy Theological Commission / የሊቃውንት ጉባኤ',
      publishedAt: '2026-02-14T00:00:00.000Z',
      viewCount: 8950,
      createdAt: '2026-02-10',
      updatedAt: '2026-02-14',
      translations: [
        {
          id: 'trans-art-theo-am',
          locale: 'am',
          title: 'የተዋሕዶ ምሥጢረ ሥጋዌ መሠረተ እምነት በቅዱሳን አበው አስተምህሮ',
          summary: 'ስለ አምላክ ሰው መሆንና የቃል ሥጋ የመሆን ታላቅ ምሥጢር የተጻፈ ሥነ መለኮታዊ ትንታኔ።',
          contentMarkdown: `# ምሥጢረ ሥጋዌ በኦርቶዶክሳዊት ቤተክርስቲያን

ምሥጢረ ሥጋዌ ማለት አምላክ ሰው የሆነበት፣ ቃል ሥጋ የለበሰበት መለኮትና ትስብእት ያለ መቀላቀል፣ ያለ መለወጥና ያለ መለያየት አንድ አካል አንድ ባሕርይ የሆኑበት ረቂቅ ምሥጢር ነው።

## የሊቃውንት ምስክርነት
ቅዱስ ቄርሎስ ዓሥራ ሁለቱ አናቴማት በሚለው ድርሳኑ ላይ እንዳስተማረው፦ *"ቃል ሥጋ ሆነ፤ በመካከላችንም አደረ"*።`,
        },
        {
          id: 'trans-art-theo-en',
          locale: 'en',
          title: 'The Tewahedo Doctrine of the Incarnation: Christological Insights from the Patristic Fathers',
          summary: 'Theological treatise on the Miaphysite Christology of the Incarnation according to St. Cyril of Alexandria and the Alexandrian school.',
        },
      ],
    },
    {
      id: 'art-manuscripts-03',
      slug: 'preservation-of-ancient-geez-manuscripts',
      type: ArticleType.ARTICLE,
      status: 'PUBLISHED' as any,
      authorName: 'Patriarchate Manuscript Preservation Department',
      publishedAt: '2026-03-05T00:00:00.000Z',
      viewCount: 6120,
      createdAt: '2026-03-01',
      updatedAt: '2026-03-05',
      translations: [
        {
          id: 'trans-art-manu-am',
          locale: 'am',
          title: 'የጥንታውያን የብራና መጻሕፍት ጥበቃና ዲጂታል ቅጂ በኢትዮጵያ ገዳማት',
          summary: 'በደብረ ዳሞ፣ በጣና ቂርቆስ እና በደብረ ሊባኖስ የሚገኙ ውድ የብራና መጻሕፍት ለትውልድ እንዲተላለፉ የሚደረግ ጥረት።',
          contentMarkdown: `# የብራና መጻሕፍት ቅርስ ጥበቃ

የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ገዳማት ከ፬ኛው መቶ ክፍለ ዘመን ጀምሮ የተጻፉ እልፍ አዕላፍ የብራና መጻሕፍትን ይዘው ቆይተዋል።

ይህ ዲጂታል መድረክ እነዚህን ቅርሶች በከፍተኛ ጥራት ፎቶግራፍ በማንሳት በዲጂታል ፎሊዮ መመልከቻ ሥርዓት በነጻ ለምእመናንና ለተመራማሪዎች ያቀርባል።`,
        },
      ],
    },
    {
      id: 'art-news-meskel-04',
      slug: 'meskel-celebrations-worldwide-diaspora',
      type: ArticleType.NEWS,
      status: 'PUBLISHED' as any,
      authorName: 'EOTC News Agency / የዜና አገልግሎት',
      publishedAt: '2026-09-28T00:00:00.000Z',
      viewCount: 12400,
      createdAt: '2026-09-28',
      updatedAt: '2026-09-28',
      translations: [
        {
          locale: 'am',
          title: 'የመስቀል ደመራ ክብረ በዓል በአዲስ አበባ መስቀል አደባባይና በዓለም ዙሪያ በድምቀት ተከበረ',
          summary: 'ብፁዕ ወቅዱስ ፓትርያርኩ፣ ብፁዓን ሊቃነ ጳጳሳት፣ የውጭ ሀገራት ዲፕሎማቶችና በሚሊዮኖች የሚቆጠሩ ምእመናን በተገኙበት በዓሉ በታላቅ ድምቀት ተከብሯል።',
        },
      ],
    },
  ];

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('http://localhost:4000/api/v1/editorial/articles?status=PUBLISHED');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setArticles(data);
          } else {
            setArticles(fallbackArticles);
          }
        } else {
          setArticles(fallbackArticles);
        }
      } catch (err) {
        console.warn('Fallback to demo articles:', err);
        setArticles(fallbackArticles);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const types = [
    { id: 'ALL', nameAm: 'ሁሉም ጽሑፎች', nameEn: 'All Documents' },
    { id: ArticleType.NEWS, nameAm: 'ዜናዎችና መግለጫዎች', nameEn: 'News & Decrees' },
    { id: ArticleType.ARTICLE, nameAm: 'ሥነ መለኮትና መጣጥፎች', nameEn: 'Theological Articles' },
  ];

  const filtered = articles.filter((art) => {
    const typeMatch = selectedType === 'ALL' || art.type === selectedType;
    const trans =
      art.translations?.find((t) => t.locale === locale) ||
      art.translations?.[0];
    const title = trans?.title || art.slug;
    const summary = trans?.summary || '';
    const author = art.authorName || '';

    const textMatch =
      !search ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      summary.toLowerCase().includes(search.toLowerCase()) ||
      author.toLowerCase().includes(search.toLowerCase());

    return typeMatch && textMatch;
  });

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-neutral-100 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 border-b border-[#2A2620] bg-gradient-to-b from-[#181512] to-[#0C0B0A]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 mb-3">
                <Newspaper className="w-3.5 h-3.5" />
                <span>
                  {locale === 'am' ? 'ዜናዎችና ሐዋርያዊ ትምህርቶች' : 'Canonical News & Theology'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
                {locale === 'am'
                  ? 'ዜናዎችና ሥነ መለኮታዊ መጣጥፎች'
                  : 'Pastoral News & Articles'}
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
                {locale === 'am'
                  ? 'ከመንበረ ፓትርያርክ ጠቅላይ ጽሕፈት ቤት፣ ከቅዱስ ሲኖዶስና ከሊቃውንት ጉባኤ የሚወጡ ትክክለኛ መረጃዎችና ትምህርቶች።'
                  : 'Official communiqués, theological treatises, and liturgical updates from the Holy Synod and Patriarchate.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-3 rounded-xl bg-[#1A1815] border border-[#2F2B24] flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-[#D4AF37]" />
                <div>
                  <div className="text-xl font-bold text-white">{articles.length}</div>
                  <div className="text-xs text-neutral-400">
                    {locale === 'am' ? 'የታተሙ ጽሑፎች' : 'Published Articles'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                locale === 'am'
                  ? 'በጽሑፍ ርእስ፣ በጸሐፊ ወይም ጭብጥ ፈልግ...'
                  : 'Search by article headline, author, or keyword...'
              }
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#161412] border border-[#332E26] text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                {locale === 'am' ? 'አጽዳ' : 'Clear'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="border-b border-[#24201A] bg-[#100E0C] sticky top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
              {locale === 'am' ? 'ዓይነት፦' : 'Type:'}
            </span>
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedType === t.id
                    ? 'bg-[#881337] text-white font-semibold shadow-sm border border-[#9F1239]'
                    : 'bg-[#181613] text-neutral-300 hover:bg-[#25221D] border border-[#2E2922]'
                }`}
              >
                {locale === 'am' ? t.nameAm : t.nameEn}
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-400 whitespace-nowrap">
            {filtered.length} {locale === 'am' ? 'ጽሑፎች' : 'articles'}
          </div>
        </div>
      </div>

      {/* Articles List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4AF37] mb-3" />
            <div className="text-neutral-400 text-sm">
              {locale === 'am' ? 'መጣጥፎች በመጫን ላይ...' : 'Loading articles...'}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-[#141210] border border-[#27231D] max-w-lg mx-auto">
            <Newspaper className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              {locale === 'am' ? 'ምንም ጽሑፍ አልተገኘም' : 'No Articles Found'}
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-4">
              {locale === 'am'
                ? 'በመረጡት መመዘኛ የተገኘ ጽሑፍ የለም። እባክዎ ፍለጋውን ይቀይሩ።'
                : 'No articles match your current filter. Please clear filters or try another query.'}
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedType('ALL');
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#D4AF37] text-black hover:brightness-105"
            >
              {locale === 'am' ? 'ሁሉንም አሳይ' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((art) => {
              const trans =
                art.translations?.find((t) => t.locale === locale) ||
                art.translations?.[0];
              const dateStr = art.publishedAt
                ? new Date(art.publishedAt).toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '2026';

              return (
                <article
                  key={art.id}
                  className="rounded-2xl bg-[#141210] border border-[#26221C] hover:border-[#D4AF37]/50 transition-all p-6 flex flex-col justify-between group shadow-sm hover:shadow-lg"
                >
                  <div>
                    {/* Tag & Date */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#881337]/30 text-rose-300 border border-[#881337]/50">
                        {art.type === ArticleType.NEWS
                          ? locale === 'am'
                            ? 'ዜና / መግለጫ'
                            : 'News / Communiqué'
                          : locale === 'am'
                          ? 'ሥነ መለኮታዊ መጣጥፍ'
                          : 'Theological Article'}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </div>
                    </div>

                    {/* Headline */}
                    <h2 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug mb-2">
                      <Link href={`/${locale}/articles/${art.slug}`}>
                        {trans?.title || art.slug}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-neutral-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                      {trans?.summary || 'በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ቀኖና መሠረት የተዘጋጀ ይዘት።'}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-[#221E18] flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <User className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="truncate max-w-[180px] font-medium text-neutral-300">
                        {art.authorName || 'EOTC Patriarchate'}
                      </span>
                    </div>

                    <Link
                      href={`/${locale}/articles/${art.slug}`}
                      className="inline-flex items-center gap-1.5 font-bold text-[#D4AF37] hover:underline group/btn"
                    >
                      <span>{locale === 'am' ? 'ሙሉውን አንብብ' : 'Read Article'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
