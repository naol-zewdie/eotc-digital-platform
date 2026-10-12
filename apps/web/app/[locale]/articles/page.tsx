'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  Calendar,
  User,
  Eye,
  ArrowUpRight,
  Search,
} from 'lucide-react';
import { ArticleDto, ArticleType } from '@eotc/contracts';
import { GridLines } from '../../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../../components/DoorDennis/DoorDennisButton';

interface ArticlesPageProps {
  params: { locale: string };
}

export default function ArticlesPage({ params }: ArticlesPageProps) {
  const locale = params.locale || 'am';
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const [articles, setArticles] = useState<ArticleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

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
          contentMarkdown: '',
        },
        {
          id: 'trans-art-syn-en',
          locale: 'en',
          title: 'Official Declaration of the Holy Synod on Peace, Unity and Heritage Preservation',
          summary: 'The Holy Synod issues an apostolic call to the faithful worldwide on unity, monastic heritage, and pastoral peace.',
          contentMarkdown: '',
        },
      ],
    },
    {
      id: 'art-theology-02',
      slug: 'theology-of-incarnation-tewahedo-faith',
      type: ArticleType.ARTICLE,
      status: 'PUBLISHED' as any,
      authorName: 'ሊቀ ሊቃውንት ዕዝራ ኃይለ ማርያም',
      publishedAt: '2026-01-12T00:00:00.000Z',
      viewCount: 6890,
      createdAt: '2026-01-10',
      updatedAt: '2026-01-12',
      translations: [
        {
          id: 'trans-art-theo-am',
          locale: 'am',
          title: 'ነገረ ተዋሕዶና ምስጢረ ሥጋዌ በቀደምት ሊቃውንት አስተምህሮ',
          summary: 'ስለ ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ ፍጹም አምላክነትና ፍጹም ሰውነት የተዋሕዶ ትምህርት ምስጢር።',
          contentMarkdown: '',
        },
        {
          id: 'trans-art-theo-en',
          locale: 'en',
          title: 'The Mystery of the Incarnation in the Tewahedo Patristic Tradition',
          summary: 'A theological exposition of the union of divinity and humanity without confusion, alteration, or division.',
          contentMarkdown: '',
        },
      ],
    },
    {
      id: 'art-history-03',
      slug: 'geez-script-and-christian-civilization',
      type: ArticleType.ARTICLE,
      status: 'PUBLISHED' as any,
      authorName: 'የጥንታዊ ጥናት ማዕከል',
      publishedAt: '2026-01-05T00:00:00.000Z',
      viewCount: 3120,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-05',
      translations: [
        {
          id: 'trans-art-hist-am',
          locale: 'am',
          title: 'የግዕዝ ፊደል ሥርዓትና የኦርቶዶክሳዊት ቤተክርስቲያን ታሪካዊ ቅርስ',
          summary: 'የግዕዝ ሥነ-ጽሑፍ፣ የብራና አዘገጃጀትና የጥንታዊቷ ኢትዮጵያ የስልጣኔ ማዕከልነት ታሪክ።',
          contentMarkdown: '',
        },
        {
          id: 'trans-art-hist-en',
          locale: 'en',
          title: 'Ge\'ez Script and Christian Civilization: A Historical Retrospective',
          summary: 'How ancient parchment scriptoria fostered one of the longest continuous literary traditions in Christian history.',
          contentMarkdown: '',
        },
      ],
    },
  ];

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('http://localhost:4000/api/v1/articles?status=PUBLISHED');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data) && data.length > 0) {
            setArticles(data);
          } else {
            setArticles(fallbackArticles);
          }
        } else {
          setArticles(fallbackArticles);
        }
      } catch (err) {
        setArticles(fallbackArticles);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const types = [
    { id: 'ALL', label: isEn ? 'All Articles' : 'ሁሉም ጽሑፎች' },
    { id: ArticleType.NEWS, label: isEn ? 'Synod Communiques' : 'የሲኖዶስ መግለጫዎች' },
    { id: ArticleType.ARTICLE, label: isEn ? 'Theological Treatises' : 'ትምህርተ ሃይማኖት' },
  ];

  const filteredArticles = articles.filter((a) => {
    if (selectedType !== 'ALL' && a.type !== selectedType) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const trans = a.translations?.find((t) => t.locale === locale) || a.translations?.[0];
      const title = trans?.title || '';
      const author = a.authorName || '';
      if (!title.toLowerCase().includes(q) && !author.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="relative min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F7F5F0] text-[#201F1E]">
      {/* 9 Architectural Lines */}
      <GridLines count={9} opacity={0.08} />

      <div className="relative max-w-7xl mx-auto z-10 space-y-12">
        {/* Header */}
        <div className="border-b border-[#201F1E]/10 pb-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#5C5A56]">
            <Newspaper className="w-4 h-4 text-[#C89D3C]" />
            <span>{isEn ? 'Patriarchate Publications' : 'ትምህርተ ሃይማኖትና ዜና'}</span>
            <span>・</span>
            <span className="text-[#7A7771]">{filteredArticles.length} Published</span>
          </div>

          <KineticTitle
            plainText={isEn ? 'Patriarchate Treatises &' : 'የመንበረ ፓትርያርክ'}
            italicWord={isEn ? 'Apostolic Teaching' : 'ትምህርተ ሃይማኖት'}
            afterText=""
            as="h1"
            className="text-4xl sm:text-5xl lg:text-6xl text-[#201F1E]"
          />

          <p className="text-base text-[#5C5A56] max-w-2xl leading-relaxed">
            {isEn
              ? 'Authorized communiques from the Holy Synod, Christological treatises, patristic homilies, and ecclesiastical historical essays.'
              : 'የቅዱስ ሲኖዶስ ሐዋርያዊ መግለጫዎች፣ የነገረ መለኮት ሊቃውንት ትምህርቶች፣ የቤተክርስቲያን ታሪክና የዶግማ ማብራሪያዎች።'}
          </p>
        </div>

        {/* Filter and Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-mono font-medium transition-all cursor-pointer border ${
                  selectedType === t.id
                    ? 'bg-[#201F1E] text-[#F7F5F0] border-[#201F1E] shadow-sm'
                    : 'bg-[#FAF9F6] border-[#201F1E]/15 text-[#5C5A56] hover:border-[#201F1E] hover:text-[#201F1E]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#7A7771]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isEn ? 'Search articles or authors...' : 'ጽሑፎችን ፈልግ...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#201F1E]/15 bg-[#FAF9F6] text-[#201F1E] placeholder:text-[#7A7771] text-xs font-mono focus:outline-none focus:border-[#C89D3C]"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => {
            const trans =
              article.translations?.find((t) => t.locale === locale) ||
              article.translations?.[0];

            return (
              <div
                key={article.id}
                className="p-7 rounded-3xl flex flex-col justify-between bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm hover:shadow-lg hover:border-[#201F1E]/30 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#5C5A56]">
                    <span className="uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EDEAE3] font-semibold text-[#201F1E]">
                      {article.type}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-500">
                      <Eye className="w-3.5 h-3.5" />
                      {article.viewCount.toLocaleString()} views
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 tracking-tight group-hover:text-amber-800 transition-colors">
                    {trans?.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {trans?.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-neutral-500">
                    <span>{article.authorName}</span>
                  </div>

                  <DoorDennisButton
                    href={`/${locale}/articles/${article.slug}`}
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
