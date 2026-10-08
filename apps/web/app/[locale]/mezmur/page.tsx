'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Music,
  Search,
  Filter,
  Play,
  ShieldCheck,
  Disc,
  Users,
  Sparkles,
  Volume2,
  Clock,
  ArrowRight,
  Headphones,
} from 'lucide-react';
import { MezmurDto, ArtistDto, RightsStatus } from '@eotc/contracts';

interface MezmurPageProps {
  params: { locale: string };
}

export default function MezmurCatalogPage({ params }: MezmurPageProps) {
  const locale = params.locale || 'am';
  const [mezmurs, setMezmurs] = useState<MezmurDto[]>([]);
  const [artists, setArtists] = useState<ArtistDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedArtist, setSelectedArtist] = useState<string>('ALL');

  // Fallback demo mezmurs with authentic canonical metadata
  const fallbackMezmurs: MezmurDto[] = [
    {
      id: 'mezmur-mk-01',
      slug: 'selam-leki-maryam-kibrite',
      status: 'PUBLISHED' as any,
      playCount: 14200,
      viewCount: 28400,
      publishedAt: '2026-01-10T00:00:00.000Z',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-10',
      artist: {
        id: 'art-mk-choir',
        slug: 'mahbere-kidusan-choir',
        nameAm: 'ማኅበረ ቅዱሳን መዘምራን',
        nameGez: 'ማኅበረ ቅዱሳን',
        nameEn: 'Mahbere Kidusan Central Choir',
        isChoir: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      category: {
        id: 'cat-mariam',
        slug: 'mariam',
        nameAm: 'የእመቤታችን ማርያም',
        nameGez: 'ዘእግዝእትነ',
        nameEn: 'St. Mary Hymns',
      },
      rights: {
        id: 'rights-mk-01',
        status: RightsStatus.PERMISSION_GRANTED,
        rightsHolder: 'Mahbere Kidusan Audio Archive',
        downloadAllowed: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      translations: [
        {
          locale: 'am',
          title: 'ሰላም ለኪ ማርያም ክብርት እናቴ',
          lyrics: `ሰላም ለኪ ማርያም ክብርት እናቴ
የፍቅር እናት የሰላም ማደሪያዬ
በጸሎትሽ ጥላ ሥር አሳርፊኝ
ከክፉው ዓለም ማዕበል ጠብቂኝ

አዝ፦
በቀራንዮ መስቀል ሥር የቆምሽው
የሐዋርያት መጽናኛ የሆንሽው
ዛሬም ለልጆችሽ አማላጅ ሁኚልን
ከአንድ ልጅሽ ዘንድ ምሕረትን ለምኝልን`,
          description: 'በዓመታዊና በወርሃዊ የበዓላት ዋዜማ የሚዘመር የታወቀ የምስጋና መዝሙር።',
        },
        {
          locale: 'gez',
          title: 'ሰላም ለኪ ማርያም እመ አምላክ',
          lyrics: `ሰላም ለኪ ማርያም ድንግል
እመ ብርሃን ወእመ መድኅን
ተማኅፀነ በኪ ኩሎሙ ደቂቅኪ
ዕቀቢ አኃዊነ ወአኃቲነ በረድኤትኪ።`,
          description: 'ማሕሌታዊ ምስጋና ዘእግዝእትነ ማርያም።',
        },
        {
          locale: 'en',
          title: 'Peace Be Unto You, Blessed Mary Mother of God',
          lyrics: 'Peace be unto thee, Mary holy Mother of grace and refuge.',
          description: 'Traditional Orthodox Marian hymn sung during vigils and solemn celebrations.',
        },
      ],
    },
    {
      id: 'mezmur-yared-02',
      slug: 'tinsae-kibr-haleluya',
      status: 'PUBLISHED' as any,
      playCount: 19800,
      viewCount: 35100,
      publishedAt: '2026-04-12T00:00:00.000Z',
      createdAt: '2026-01-01',
      updatedAt: '2026-04-12',
      artist: {
        id: 'art-debre-amet',
        slug: 'st-yared-heritage-ensemble',
        nameAm: 'የቅዱስ ያሬድ ዜማ ሊቃውንት',
        nameGez: 'ሊቃውንተ ያሬድ',
        nameEn: 'St. Yared Chant Masters',
        isChoir: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      category: {
        id: 'cat-fasika',
        slug: 'fasika',
        nameAm: 'ትንሣኤና ፋሲካ',
        nameGez: 'ዘትንሣኤ',
        nameEn: 'Resurrection & Pascha',
      },
      rights: {
        id: 'rights-patriarchate-02',
        status: RightsStatus.CHURCH_OWNED,
        rightsHolder: 'Holy Synod Liturgical Commission',
        downloadAllowed: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      translations: [
        {
          locale: 'am',
          title: 'ክርስቶስ ተንሥአ እሙታን (ትንሣኤክሙ አብርሃ)',
          lyrics: `ክርስቶስ ተንሥአ እሙታን
በዐቢይ ኃይል ወሥልጣን
አሰሮ ለሰይጣን
አግአዞ ለአዳም
ሰላም እምይእዜሰ
ይኩን ፍሥሐ ወሰላም።`,
          description: 'የትንሣኤ የበዓል ማሕሌት እና መዝሙር ከቅዱስ ያሬድ ድጓ የተወሰደ።',
        },
        {
          locale: 'gez',
          title: 'ክርስቶስ ተንሥአ እሙታን',
          lyrics: `ክርስቶስ ተንሥአ እሙታን
በዐቢይ ኃይል ወሥልጣን
አሰሮ ለሰይጣን አግአዞ ለአዳም።`,
        },
        {
          locale: 'en',
          title: 'Christ Is Risen From The Dead (Paschal Troparion)',
          lyrics: 'Christ is risen from the dead, conquering death by his death.',
        },
      ],
    },
    {
      id: 'mezmur-teklehaymanot-03',
      slug: 'abune-teklehaymanot-kibr',
      status: 'PUBLISHED' as any,
      playCount: 11250,
      viewCount: 18700,
      publishedAt: '2026-01-24T00:00:00.000Z',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-24',
      artist: {
        id: 'art-debre-libanos-choir',
        slug: 'debre-libanos-choir',
        nameAm: 'የደብረ ሊባኖስ ገዳም መዘምራን',
        nameGez: 'መዘምራነ ደብረ ሊባኖስ',
        nameEn: 'Debre Libanos Monastic Choir',
        isChoir: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      category: {
        id: 'cat-gedlat',
        slug: 'saints',
        nameAm: 'የጻድቃንና ሰማዕታት',
        nameGez: 'ዘጻድቃን',
        nameEn: 'Saints & Martyrs',
      },
      rights: {
        id: 'rights-libanos-03',
        status: RightsStatus.CHURCH_OWNED,
        rightsHolder: 'Debre Libanos Monastery',
        downloadAllowed: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      translations: [
        {
          locale: 'am',
          title: 'ተክለ ሃይማኖት ፀሐይ ዘኢትዮጵያ',
          lyrics: `ተክለ ሃይማኖት ፀሐይ ዘኢትዮጵያ
የገዳማት ፋና አባታችን ሆይ
በአንድ እግርህ ቁመህ ስትጸልይ ያደርከው
ስለ ሕዝብህ ምሕረት እያፈሰስክ ዕንባህ።

አዝ፦
በደብረ አስቦ ያበራኸው ብርሃን
ዛሬም ያበራልናል በምልጃህ ጸሎት
አባታችን ሆይ አስበን ሁልጊዜ
ከእግዚአብሔር አምላክ ዘንድ አትለየን ከመዓዛህ።`,
          description: 'ለታላቁ ጻድቅ አቡነ ተክለ ሃይማኖት የበዓል መታሰቢያ መዝሙር።',
        },
      ],
    },
    {
      id: 'mezmur-meskel-04',
      slug: 'meskel-hayline-meskel-tsinine',
      status: 'PUBLISHED' as any,
      playCount: 22400,
      viewCount: 41200,
      publishedAt: '2026-09-27T00:00:00.000Z',
      createdAt: '2026-01-01',
      updatedAt: '2026-09-27',
      artist: {
        id: 'art-mk-choir',
        slug: 'mahbere-kidusan-choir',
        nameAm: 'ማኅበረ ቅዱሳን መዘምራን',
        nameGez: 'ማኅበረ ቅዱሳን',
        nameEn: 'Mahbere Kidusan Central Choir',
        isChoir: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      category: {
        id: 'cat-meskel',
        slug: 'meskel',
        nameAm: 'የመስቀል በዓል',
        nameGez: 'ዘመስቀል',
        nameEn: 'Holy Cross (Meskel)',
      },
      rights: {
        id: 'rights-mk-04',
        status: RightsStatus.PERMISSION_GRANTED,
        rightsHolder: 'Mahbere Kidusan Audio Archive',
        downloadAllowed: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      translations: [
        {
          locale: 'am',
          title: 'መስቀል ኃይላችን መስቀል ጽንዓችን',
          lyrics: `መስቀል ኃይልነ መስቀል ጽንዕነ
መስቀል ቤዛነ መስቀል መድኃኒተ ነፍስነ
አይሁድ ክሕዱ ንሕነሰ አመነ
እለ አመነ በኃይለ መስቀሉ ድኅነ።`,
          description: 'የመስቀል ደመራና የቅዱስ መስቀል ክብረ በዓል ጥንታዊ ያሬዳዊ መዝሙር።',
        },
      ],
    },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [mezRes, artRes] = await Promise.all([
          fetch('http://localhost:4000/api/v1/mezmur?status=PUBLISHED').then((r) =>
            r.ok ? r.json() : null,
          ),
          fetch('http://localhost:4000/api/v1/mezmur/artists').then((r) =>
            r.ok ? r.json() : null,
          ),
        ]);

        if (mezRes && Array.isArray(mezRes) && mezRes.length > 0) {
          setMezmurs(mezRes);
        } else {
          setMezmurs(fallbackMezmurs);
        }

        if (artRes && Array.isArray(artRes) && artRes.length > 0) {
          setArtists(artRes);
        }
      } catch (err) {
        console.warn('Using offline fallback mezmurs', err);
        setMezmurs(fallbackMezmurs);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { id: 'ALL', nameAm: 'ሁሉም መዝሙራት', nameEn: 'All Hymns' },
    { id: 'mariam', nameAm: 'የእመቤታችን (ማርያም)', nameEn: 'St. Mary' },
    { id: 'fasika', nameAm: 'ትንሣኤና ፋሲካ', nameEn: 'Resurrection' },
    { id: 'saints', nameAm: 'የጻድቃንና ሰማዕታት', nameEn: 'Saints' },
    { id: 'meskel', nameAm: 'የመስቀል በዓል', nameEn: 'Holy Cross' },
  ];

  const filteredMezmurs = mezmurs.filter((m) => {
    const catMatch =
      selectedCategory === 'ALL' ||
      m.category?.slug === selectedCategory ||
      m.categoryId === selectedCategory;

    const artistMatch =
      selectedArtist === 'ALL' ||
      m.artist?.id === selectedArtist ||
      m.artist?.slug === selectedArtist;

    const trans =
      m.translations?.find((t) => t.locale === locale) || m.translations?.[0];
    const title = trans?.title || m.slug;
    const lyrics = trans?.lyrics || '';
    const choirName = m.artist?.nameAm || m.artist?.nameEn || '';

    const textMatch =
      !search ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      lyrics.toLowerCase().includes(search.toLowerCase()) ||
      choirName.toLowerCase().includes(search.toLowerCase());

    return catMatch && artistMatch && textMatch;
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
                <Music className="w-3.5 h-3.5" />
                <span>
                  {locale === 'am' ? 'ያሬዳዊ ዜማና ቅዱሳን መዝሙራት' : 'Sacred Hymnody & Mezmur Vault'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
                {locale === 'am'
                  ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ቅዱሳን መዝሙራት'
                  : 'Canonical Sacred Mezmur Vault'}
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
                {locale === 'am'
                  ? 'በሊቃውንትና በመዘምራን የተዘጋጁ፣ የቤተክርስቲያንን ዶግማና ቀኖና የጠበቁ ትክክለኛ ግጥሞችና ምስጋናዎች።'
                  : 'Canonically verified hymnody, stanzas, and sacred audio with authorized ecclesiastical rights.'}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="px-4 py-3 rounded-xl bg-[#1A1815] border border-[#2F2B24] flex items-center gap-3">
                <Headphones className="w-8 h-8 text-[#D4AF37]" />
                <div>
                  <div className="text-xl font-bold text-white">{mezmurs.length}</div>
                  <div className="text-xs text-neutral-400">
                    {locale === 'am' ? 'የተረጋገጡ መዝሙራት' : 'Verified Hymns'}
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
                  ? 'በመዝሙር ርእስ፣ በመዘምራን ስም ወይም በግጥም ፈልግ...'
                  : 'Search by hymn title, choir, soloist, or lyric stanza...'
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

      {/* Filter Chips Bar */}
      <div className="border-b border-[#24201A] bg-[#100E0C] sticky top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
              {locale === 'am' ? 'ዘርፍ፦' : 'Category:'}
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#881337] text-white font-semibold shadow-sm border border-[#9F1239]'
                    : 'bg-[#181613] text-neutral-300 hover:bg-[#25221D] border border-[#2E2922]'
                }`}
              >
                {locale === 'am' ? cat.nameAm : cat.nameEn}
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-400 whitespace-nowrap">
            {filteredMezmurs.length} {locale === 'am' ? 'ተገኝቷል' : 'results'}
          </div>
        </div>
      </div>

      {/* Mezmur Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4AF37] mb-3" />
            <div className="text-neutral-400 text-sm">
              {locale === 'am' ? 'መዝሙራት በመጫን ላይ...' : 'Loading sacred hymnody...'}
            </div>
          </div>
        ) : filteredMezmurs.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-[#141210] border border-[#27231D] max-w-lg mx-auto">
            <Music className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              {locale === 'am' ? 'ምንም መዝሙር አልተገኘም' : 'No Mezmurs Found'}
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-4">
              {locale === 'am'
                ? 'በመረጡት መመዘኛ የተገኘ መዝሙር የለም። እባክዎ ፍለጋውን ይቀይሩ።'
                : 'No hymns match your current filter. Please clear filters or try another query.'}
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('ALL');
                setSelectedArtist('ALL');
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#D4AF37] text-black hover:brightness-105"
            >
              {locale === 'am' ? 'ሁሉንም አሳይ' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMezmurs.map((m) => {
              const trans =
                m.translations?.find((t) => t.locale === locale) ||
                m.translations?.[0];
              const gezTrans = m.translations?.find((t) => t.locale === 'gez');
              const artistName =
                (locale === 'am' ? m.artist?.nameAm : m.artist?.nameEn) ||
                m.artist?.nameAm ||
                'ማኅበረ ቅዱሳን';

              return (
                <div
                  key={m.id}
                  className="rounded-2xl bg-[#141210] border border-[#26221C] hover:border-[#D4AF37]/50 transition-all p-5 flex flex-col justify-between group shadow-sm hover:shadow-lg"
                >
                  <div>
                    {/* Top row: Category tag & Rights badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/25">
                        {m.category?.nameAm || m.category?.nameEn || 'መዝሙር'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-800/40">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        {locale === 'am' ? 'የተረጋገጠ ፈቃድ' : 'Authorized'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug mb-1">
                      {trans?.title || m.slug}
                    </h3>
                    {gezTrans && gezTrans.title !== trans?.title && (
                      <div className="text-xs text-neutral-400 font-serif mb-2">
                        {gezTrans.title}
                      </div>
                    )}

                    {/* Artist & Choir */}
                    <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium mb-3">
                      <Users className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{artistName}</span>
                    </div>

                    {/* Lyric excerpt preview */}
                    {trans?.lyrics && (
                      <div className="p-3 rounded-lg bg-[#0E0D0B] border border-[#201D17] text-neutral-400 text-xs font-serif line-clamp-3 leading-relaxed mb-4 italic">
                        &quot;{trans.lyrics.split('\n').filter(Boolean).slice(0, 2).join(' / ')}...&quot;
                      </div>
                    )}
                  </div>

                  {/* Footer & CTA */}
                  <div className="pt-3 border-t border-[#221E18] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3 text-[#D4AF37]" />
                        {m.playCount ? m.playCount.toLocaleString() : '3.2k'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        4:20
                      </span>
                    </div>

                    <Link
                      href={`/${locale}/mezmur/${m.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#881337] hover:bg-[#9F1239] text-white transition-all shadow-sm group/btn"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{locale === 'am' ? 'አዳምጥና ግጥም' : 'Play & Lyrics'}</span>
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
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
