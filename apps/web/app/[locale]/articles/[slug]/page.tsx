'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  Calendar,
  Clock,
  ShieldCheck,
  User,
  Check,
  BookOpen,
} from 'lucide-react';
import { ArticleDto, ArticleType } from '@eotc/contracts';
import { GridLines } from '../../../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../../../components/DoorDennis/DoorDennisButton';
import { TextScrambler } from '../../../../components/DoorDennis/TextScrambler';

interface ArticleDetailPageProps {
  params: { locale: string; slug: string };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const locale = params.locale || 'am';
  const slug = params.slug;
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

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
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C89D3C] border-t-transparent animate-spin" />
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
    <div className="relative min-h-screen bg-[#F7F5F0] text-[#201F1E] pb-28 overflow-hidden">
      {/* 9 Architectural Vertical Grid Lines */}
      <GridLines count={9} opacity={0.08} />

      {/* Top Breadcrumb Navigation */}
      <div className="relative z-10 border-b border-[#201F1E]/10 bg-[#FAF9F6]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs font-mono">
          <Link
            href={`/${locale}/articles`}
            className="group inline-flex items-center gap-2 text-[#5C5A56] hover:text-[#201F1E] transition-colors"
          >
            <span className="w-6 h-6 rounded-lg border border-[#201F1E]/15 flex items-center justify-center group-hover:border-[#201F1E] group-hover:bg-[#201F1E] group-hover:text-[#F7F5F0] transition-all">
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
            <span className="uppercase tracking-wider font-semibold">
              {isEn ? 'Back to Treatises' : isGez ? 'ተመየጥ ኀበ ድርሳናት' : 'ወደ ጽሑፎች ዝርዝር ተመለስ'}
            </span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#201F1E]/15 text-[#5C5A56] hover:text-[#201F1E] hover:border-[#201F1E] hover:bg-[#FAF9F6] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">{isEn ? 'Copied Link' : 'ተቀድቷል!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Share Article' : 'አጋራ'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 z-10">
        {/* Header Block matching Door Dennis Typography */}
        <header className="space-y-6 pb-10 border-b border-[#201F1E]/10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#201F1E] text-[#F7F5F0] shadow-sm">
              {activeArticle.type === ArticleType.NEWS
                ? isEn
                  ? 'Synod Communiqué'
                  : 'የቅዱስ ሲኖዶስ መግለጫ'
                : isEn
                ? 'Theological Treatise'
                : 'ሥነ መለኮታዊ ትምህርት'}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#FAF9F6] border border-[#201F1E]/15 text-[#C89D3C]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C89D3C]" />
              <span>{isEn ? 'Canonical Seal' : 'ቀኖናዊ ጽሑፍ'}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#201F1E] leading-[1.12] tracking-tight">
            {translation?.title}
          </h1>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-[#5C5A56] pt-2">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#C89D3C]" />
              <span className="font-semibold text-[#201F1E]">
                {activeArticle.authorName || (isEn ? 'EOTC Patriarchate Secretariat' : 'የቅዱስ ሲኖዶስ ዋና ጽ/ቤት')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#7A7771]" />
              <span>{dateStr}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#7A7771]" />
              <span>{isEn ? '5 min read' : 'የንባብ ጊዜ፦ 5 ደቂቃ'}</span>
            </div>
          </div>
        </header>

        {/* Lead Summary Block */}
        {translation?.summary && (
          <div className="my-10 p-6 sm:p-8 rounded-2xl bg-[#FAF9F6] border-l-4 border-[#C89D3C] border-y border-r border-[#201F1E]/10 shadow-sm">
            <p className="text-base sm:text-lg text-[#201F1E] font-serif italic leading-relaxed">
              &quot;{translation.summary}&quot;
            </p>
          </div>
        )}

        {/* Article Body */}
        <article className="prose prose-neutral max-w-none text-[#201F1E] font-serif leading-loose text-base sm:text-lg space-y-8 select-text">
          <div className="whitespace-pre-line">
            {translation?.contentMarkdown}
          </div>
        </article>

        {/* Door Dennis Canonical Seal & Patriarchate Attribution Card */}
        <div className="mt-16 pt-8 border-t border-[#201F1E]/10">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#201F1E] text-[#F7F5F0] flex items-center justify-center font-serif text-xl font-bold shrink-0 shadow-sm">
                ✝
              </div>
              <div className="space-y-0.5">
                <div className="text-sm sm:text-base font-bold font-serif uppercase tracking-tight text-[#201F1E]">
                  {isEn ? 'Ethiopian Orthodox Tewahedo Church' : 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን'}
                </div>
                <div className="text-xs font-mono text-[#5C5A56]">
                  {isEn ? 'Patriarchate Supreme Secretariat' : 'መንበረ ፓትርያርክ ጠቅላይ ቤተ ክህነት'}
                </div>
              </div>
            </div>

            <DoorDennisButton href={`/${locale}/articles`}>
              {isEn ? 'More Treatises' : 'ተጨማሪ ጽሑፎች'}
            </DoorDennisButton>
          </div>
        </div>
      </main>
    </div>
  );
}
