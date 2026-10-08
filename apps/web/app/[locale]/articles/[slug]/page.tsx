'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  Calendar,
  User,
  Share2,
  ArrowLeft,
  ShieldCheck,
  BookOpen,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ArticleDto, ArticleType } from '@eotc/contracts';

interface ArticleDetailPageProps {
  params: { locale: string; slug: string };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const locale = params.locale || 'am';
  const slug = params.slug;

  const [article, setArticle] = useState<ArticleDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Fallback demo article
  const fallbackArticle: ArticleDto = {
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
        contentMarkdown: `በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።

የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ቅዱስ ሲኖዶስ በዛሬው ዕለት ባካሄደው ምልዐተ ጉባኤ ለመላው የሀገራችን ሕዝቦችና በዓለም ዙሪያ ለሚገኙ ምእመናን የሰላም፣ የፍቅርና የአንድነት ጥሪውን አስተላልፏል።

### ፩. ስለ ሀገር ሰላምና አንድነት
ቤተክርስቲያናችን ከሁለት ሺህ ዓመታት በላይ የሀገር አንድነትና የሕዝብ ሰላም መጠበቂያ መሠረት ሆና ቆይታለች። በመሆኑም በሀገራችን በተለያዩ አካባቢዎች የሚከሰቱ ግጭቶችና አለመግባባቶች በውይይት፣ በዕርቅና በይቅርታ መንፈስ እንዲፈቱ ቅዱስ ሲኖዶስ ጥሪ ያቀርባል።

### ፪. ለተፈናቀሉ ወገኖች ሰብአዊ ድጋፍ
በሁሉም አህጉረ ስብከትና አድባራት የሚገኙ ምእመናን በችግርና በመፈናቀል ውስጥ ለሚገኙ ወገኖቻችን ያልተቆጠበ ሰብአዊ ድጋፍ እንዲያደርጉና በጸሎት እንዲያስቧቸው በጥብቅ ያሳስባል።

### ፫. የቅዱሳት መካናትና ቅርሶች ጥበቃ
የጥንታውያን ገዳማት፣ አድባራት እና የብራና ቅርሶች ደኅንነት እንዲጠበቅ፣ ተገቢው የደኅንነትና የጥበቃ ሥራ እንዲከናወን ከመንግሥት አካላት ጋር በቅንጅት እንደሚሠራ ተወስኗል።

> *"ሰላሜን እተውላችኋለሁ፥ ሰላሜን እሰጣችኋለሁ፤ እኔ የምሰጣችሁ ዓለም እንደሚሰጥ አይደለም። ልባችሁ አይታወክ አይፍራም።"* (ዮሐ. ፲፬፥፳፯)

ወስብሐት ለእግዚአብሔር
ወለወላዲቱ ድንግል
ወለመስቀሉ ክቡር።`,
      },
      {
        id: 'trans-art-syn-en',
        locale: 'en',
        title: 'Official Declaration of the Holy Synod on Peace, Unity and Heritage Preservation',
        summary: 'The Holy Synod issues an apostolic call to the faithful worldwide on unity, monastic heritage, and pastoral peace.',
        contentMarkdown: `In the Name of the Father, and of the Son, and of the Holy Spirit, One God, Amen.

The Holy Synod of the Ethiopian Orthodox Tewahedo Church, meeting in plenary apostolic assembly, addresses this solemn message to all citizens of Ethiopia and Orthodox Christians throughout the global diaspora.

### 1. On National Reconciliation and Unity
For millennia, the Church has been the spiritual anchor of unity, justice, and reconciliation. The Holy Synod urges all communities to resolve discord through dialogue, forgiveness, and mutual respect.

### 2. Pastoral Aid for Displaced Persons
All dioceses, parishes, and youth associations are instructed to mobilize humanitarian relief for displaced brethren and those suffering from hardship.

### 3. Protection of Ancient Monasteries and Manuscripts
The preservation of ancient ecclesiastical heritage, manuscripts, and monastic foundations remains an urgent sacred trust.

> *"Peace I leave with you, My peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid."* (John 14:27)

Glory be to God the Father, to His Virgin Mother, and to the Precious Cross.`,
      },
    ],
  };

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`http://localhost:4000/api/v1/editorial/articles/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        } else {
          setArticle(fallbackArticle);
        }
      } catch (err) {
        console.warn('Fallback to demo article:', err);
        setArticle(fallbackArticle);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  const activeArticle = article || fallbackArticle;
  const translation =
    activeArticle.translations.find((t) => t.locale === locale) ||
    activeArticle.translations[0];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0B0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  const dateStr = activeArticle.publishedAt
    ? new Date(activeArticle.publishedAt).toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '2026';

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-neutral-100 pb-24">
      {/* Top Breadcrumb */}
      <div className="border-b border-[#24201A] bg-[#14120F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-neutral-400">
          <Link
            href={`/${locale}/articles`}
            className="hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{locale === 'am' ? 'ወደ ጽሑፎች ዝርዝር ተመለስ' : 'Back to Articles'}</span>
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? (locale === 'am' ? 'ተቀድቷል!' : 'Copied!') : locale === 'am' ? 'አጋራ' : 'Share'}</span>
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Article Header Card */}
        <header className="mb-10 pb-8 border-b border-[#2A241C]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-md bg-[#881337] text-white">
              {activeArticle.type === ArticleType.NEWS
                ? locale === 'am'
                  ? 'የቅዱስ ሲኖዶስ ዜናና መግለጫ'
                  : 'Synod News & Communiqué'
                : locale === 'am'
                ? 'ሥነ መለኮታዊ ትምህርት'
                : 'Theological Treatise'}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              {locale === 'am' ? 'ቀኖናዊ ጽሑፍ' : 'Canonical'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
            {translation?.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-semibold text-neutral-200">
                {activeArticle.authorName || 'EOTC Patriarchate Secretariat'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span>{dateStr}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-500" />
              <span>{locale === 'am' ? 'የንባብ ጊዜ፦ 5 ደቂቃ' : '5 min read'}</span>
            </div>
          </div>
        </header>

        {/* Lead Summary */}
        {translation?.summary && (
          <div className="p-5 rounded-2xl bg-[#16130F] border-l-4 border-[#D4AF37] border-y border-r border-[#262118] text-sm sm:text-base text-neutral-200 leading-relaxed font-serif mb-8 italic">
            &quot;{translation.summary}&quot;
          </div>
        )}

        {/* Main Body */}
        <article className="prose prose-invert max-w-none text-neutral-200 font-serif leading-loose text-base sm:text-lg space-y-6">
          <div className="whitespace-pre-line select-text">
            {translation?.contentMarkdown}
          </div>
        </article>

        {/* Canonical Seal Footer */}
        <div className="mt-14 pt-8 border-t border-[#262118] flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#13110E] border border-[#262118]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#881337] to-[#50071C] flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30 text-xl font-bold">
              ✝
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {locale === 'am' ? 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን' : 'Ethiopian Orthodox Tewahedo Church'}
              </div>
              <div className="text-xs text-neutral-400">
                {locale === 'am' ? 'መንበረ ፓትርያርክ ጠቅላይ ቤተ ክህነት' : 'Patriarchate Supreme Secretariat'}
              </div>
            </div>
          </div>

          <Link
            href={`/${locale}/articles`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#221D17] hover:bg-[#2E2820] text-neutral-200 transition-colors self-start sm:self-auto"
          >
            <span>{locale === 'am' ? 'ተጨማሪ ጽሑፎችን አንብብ' : 'More Articles'}</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
