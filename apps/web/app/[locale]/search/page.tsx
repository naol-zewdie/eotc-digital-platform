'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Search as SearchIcon,
  BookOpen,
  Music,
  Newspaper,
  Church,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import {
  SearchResultType,
  SearchResultItemDto,
} from '@eotc/contracts';
import { GridLines } from '../../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../../components/DoorDennis/DoorDennisButton';

interface SearchPageProps {
  params: { locale: string };
}

export default function GlobalSearchPage({ params }: SearchPageProps) {
  const locale = params.locale || 'am';
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<SearchResultType | 'ALL'>('ALL');
  const [results, setResults] = useState<SearchResultItemDto[]>([]);

  const fallbackData: SearchResultItemDto[] = [
    {
      id: 'res-book-1',
      type: 'BOOK',
      slug: 'metsihafe-qidassie',
      title: 'መጽሐፈ ቅዳሴ (ሥርዓተ አምልኮና ጸሎት)',
      subtitle: 'ሥርዓተ አምልኮና ጸሎት ・ EOTC Liturgical Tradition',
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
      subtitle: 'ማኅበረ ቅዱሳን ・ የእመቤታችን ማርያም',
      description: 'ሰላም ለኪ ማርያም ክብርት እናቴ የፍቅር እናት የሰላም ማደሪያዬ በጸሎትሽ ጥላ ሥር አሳርፊኝ።',
      url: `/${locale}/mezmur/selam-leki-maryam-kibrite`,
      category: 'mariam',
      relevanceScore: 92,
    },
    {
      id: 'res-church-1',
      type: 'CHURCH',
      slug: 'axum-tsion',
      title: 'ርዕሰ አድባራት አክሱም ጽዮን ማርያም ካቴድራል',
      subtitle: 'አክሱም አህጉረ ስብከት ・ ትግራይ',
      description: 'የታቦተ ጽዮን ማደሪያና የኢትዮጵያ ጥንታዊት ካቴድራል ታሪካዊ መረጃ።',
      url: `/${locale}/churches/axum-tsion`,
      category: 'cathedral',
      relevanceScore: 90,
    },
    {
      id: 'res-art-1',
      type: 'ARTICLE',
      slug: 'theology-of-incarnation-tewahedo-faith',
      title: 'ነገረ ተዋሕዶና ምስጢረ ሥጋዌ በቀደምት ሊቃውንት አስተምህሮ',
      subtitle: 'ነገረ መለኮት ・ ሊቀ ሊቃውንት ዕዝራ',
      description: 'ስለ ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ ፍጹም አምላክነትና ፍጹም ሰውነት የተዋሕዶ ትምህርት ምስጢር።',
      url: `/${locale}/articles/theology-of-incarnation-tewahedo-faith`,
      category: 'theology',
      relevanceScore: 88,
    },
  ];

  const filterResults = useCallback(() => {
    let list = fallbackData;
    if (selectedType !== 'ALL') {
      list = list.filter((item) => item.type === selectedType);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q)
      );
    }
    setResults(list);
  }, [query, selectedType]);

  useEffect(() => {
    filterResults();
  }, [filterResults]);

  const typeFilterList = [
    { id: 'ALL', label: isEn ? 'All Archives' : 'ሁሉም መዛግብት' },
    { id: 'BOOK', label: isEn ? 'Manuscripts' : 'የብራና መጻሕፍት', icon: BookOpen },
    { id: 'MEZMUR', label: isEn ? 'Sacred Chants' : 'ያሬዳዊ ዜማ', icon: Music },
    { id: 'CHURCH', label: isEn ? 'Monasteries' : 'ገዳማትና አድባራት', icon: Church },
    { id: 'ARTICLE', label: isEn ? 'Theology' : 'ትምህርተ ሃይማኖት', icon: Newspaper },
  ];

  return (
    <div className="relative min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F0F0F0]">
      {/* 9 Architectural Lines */}
      <GridLines count={9} opacity={0.07} />

      <div className="relative max-w-5xl mx-auto z-10 space-y-12">
        {/* Header */}
        <div className="border-b border-neutral-300/70 pb-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
            <SearchIcon className="w-4 h-4 text-neutral-800" />
            <span>{isEn ? 'Global Search Archive' : 'ሁሉን አቀፍ ፍለጋ'}</span>
            <span>・</span>
            <span className="text-neutral-400">{results.length} Matches Found</span>
          </div>

          <KineticTitle
            plainText={isEn ? 'Search Patriarchate' : 'የመንበረ ፓትርያርክ'}
            italicWord={isEn ? 'Digital Archives' : 'ቅዱሳት መዛግብት ፍለጋ'}
            afterText=""
            as="h1"
            className="text-4xl sm:text-5xl lg:text-6xl text-neutral-900"
          />

          <p className="text-base text-neutral-600 leading-relaxed">
            {isEn
              ? 'Locate illuminated manuscripts, sacred recordings, historical sanctuaries, and Synod articles across the entire digital platform.'
              : 'በመላው የቤተክርስቲያን መድረክ የሚገኙ የብራና መጻሕፍትን፣ መዝሙራትን፣ ገዳማትንና ጽሑፎችን በአንድነት ይፈልጉ።'}
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <SearchIcon className="w-5 h-5 absolute left-5 top-4.5 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isEn
                ? 'Type keywords e.g. "Qidassie", "Axum", "Yared", "Synaxarium"...'
                : 'የፍለጋ ቃል ያስገቡ ለምሳሌ "ቅዳሴ", "አክሱም", "ያሬድ", "ስንክሳር"...'
            }
            className="w-full pl-14 pr-6 py-4 rounded-full border border-neutral-300/80 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm sm:text-base focus:outline-none focus:border-neutral-900 shadow-sm"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {typeFilterList.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedType === t.id
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white/80 border border-neutral-300/70 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-neutral-200 text-neutral-500">
              {isEn ? 'No matching records found' : 'ምንም ዓይነት መረጃ አልተገኘም'}
            </div>
          ) : (
            results.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="dd-project-card block p-6 bg-white border border-neutral-200/90 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                  <span className="uppercase tracking-wider font-semibold text-neutral-800">
                    {item.type}
                  </span>
                  <span>Match Score: {item.relevanceScore}%</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 group-hover:text-amber-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-mono">
                      {item.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed pt-1">
                      {item.description}
                    </p>
                  </div>

                  <span className="p-2 rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
