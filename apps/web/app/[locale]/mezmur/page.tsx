'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Music,
  Search,
  Play,
  Volume2,
  ArrowUpRight,
  Headphones,
} from 'lucide-react';
import { MezmurDto, ArtistDto } from '@eotc/contracts';
import { GridLines } from '../../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../../components/DoorDennis/DoorDennisButton';

interface MezmurPageProps {
  params: { locale: string };
}

export default function MezmurCatalogPage({ params }: MezmurPageProps) {
  const locale = params.locale || 'am';
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const [mezmurs, setMezmurs] = useState<MezmurDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

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
      translations: [
        {
          id: 'trans-01',
          mezmurId: 'mezmur-mk-01',
          locale: 'am',
          title: 'ሰላም ለኪ ማርያም ክብርት',
          lyrics: `ሰላም ለኪ ማርያም ክብርት
እሞሙ ለሰማዕት ወእኅቶሙ ለመላእክት
ሰላም ለኪ እመ አምላክ ንጽሕት።`,
          description: 'የእመቤታችን የቅድስት ድንግል ማርያም ማኅሌታዊ ምስጋና።',
        },
      ],
    },
    {
      id: 'mezmur-mk-02',
      slug: 'tinsa-e-kirstos',
      status: 'PUBLISHED' as any,
      playCount: 18900,
      viewCount: 32000,
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
        id: 'cat-fasika',
        slug: 'fasika',
        nameAm: 'ትንሣኤና ፋሲካ',
        nameGez: 'ትንሣኤ',
        nameEn: 'Resurrection Chants',
      },
      translations: [
        {
          id: 'trans-02',
          mezmurId: 'mezmur-mk-02',
          locale: 'am',
          title: 'ክርስቶስ ተንሥአ እሙታን',
          lyrics: `ክርስቶስ ተንሥአ እሙታን
በዐቢይ ኃይል ወሥልጣን
አሰሮ ለሰይጣን አግአዞ ለአዳም
ሰላም እምይእዜሰ ይኩን ሰላም።`,
          description: 'የትንሣኤ በዓል የደስታና የድል ያሬዳዊ መዝሙር።',
        },
      ],
    },
    {
      id: 'mezmur-mk-03',
      slug: 'meskel-hayline',
      status: 'PUBLISHED' as any,
      playCount: 11500,
      viewCount: 21300,
      publishedAt: '2026-01-10T00:00:00.000Z',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-10',
      artist: {
        id: 'art-deacons',
        slug: 'deacons-choir',
        nameAm: 'የደብረ አሚን ዲያቆናት',
        nameGez: 'ዲያቆናት',
        nameEn: 'Diaconal Liturgical Choir',
        isChoir: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      category: {
        id: 'cat-meskel',
        slug: 'meskel',
        nameAm: 'የመስቀል በዓል',
        nameGez: 'መስቀል',
        nameEn: 'Holy Cross Hymns',
      },
      translations: [
        {
          id: 'trans-03',
          mezmurId: 'mezmur-mk-03',
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
        const res = await fetch('http://localhost:4000/api/v1/mezmur?status=PUBLISHED');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data) && data.length > 0) {
            setMezmurs(data);
          } else {
            setMezmurs(fallbackMezmurs);
          }
        } else {
          setMezmurs(fallbackMezmurs);
        }
      } catch (err) {
        setMezmurs(fallbackMezmurs);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { id: 'ALL', label: isEn ? 'All Hymns' : 'ሁሉም መዝሙራት' },
    { id: 'mariam', label: isEn ? 'St. Mary Hymns' : 'የእመቤታችን' },
    { id: 'fasika', label: isEn ? 'Resurrection' : 'ትንሣኤና ፋሲካ' },
    { id: 'meskel', label: isEn ? 'Holy Cross' : 'የመስቀል በዓል' },
  ];

  const filteredMezmurs = mezmurs.filter((m) => {
    if (selectedCategory !== 'ALL' && m.category?.slug !== selectedCategory) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const trans = m.translations?.find((t) => t.locale === locale) || m.translations?.[0];
      const title = trans?.title || '';
      const artist = m.artist?.nameAm || m.artist?.nameEn || '';
      if (!title.toLowerCase().includes(q) && !artist.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="relative min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F7F5F0]">
      {/* 9 Architectural Lines */}
      <GridLines count={9} opacity={0.07} />

      <div className="relative max-w-7xl mx-auto z-10 space-y-12">
        {/* Header */}
        <div className="border-b border-neutral-300/70 pb-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
            <Music className="w-4 h-4 text-neutral-800" />
            <span>{isEn ? 'Sacred Yared Hymnody' : 'ያሬዳዊ ዜማና ማኅሌት'}</span>
            <span>・</span>
            <span className="text-neutral-400">{filteredMezmurs.length} Recorded</span>
          </div>

          <KineticTitle
            plainText={isEn ? 'Apostolic Hymnody &' : 'ያሬዳዊ ዜማና'}
            italicWord={isEn ? 'Sacred Mezmur' : 'ቅዱሳን መዝሙራት'}
            afterText=""
            as="h1"
            className="text-4xl sm:text-5xl lg:text-6xl text-neutral-900"
          />

          <p className="text-base text-neutral-600 max-w-2xl leading-relaxed">
            {isEn
              ? 'Immerse in the three sacred vocal modes of Saint Yared (Ge\'ez, Ezel, and Araray) with canonical lyrics, authorized choirs, and diaconal recordings.'
              : 'በቅዱስ ያሬድ ሦስቱ ዜማ ስልቶች (ግዕዝ፣ ዕዝል፣ አራራይ) የተዘጋጁ የቤተክርስቲያን መዝሙራት፣ ቃላተ ምስጋናና የሊቃውንት ድምፆች።'}
          </p>
        </div>

        {/* Filters and Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isEn ? 'Search chants or choirs...' : 'መዝሙራትን ፈልግ...'}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-neutral-300/80 bg-white/90 text-neutral-900 placeholder:text-neutral-400 text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        {/* Mezmurs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMezmurs.map((mezmur) => {
            const trans =
              mezmur.translations?.find((t) => t.locale === locale) ||
              mezmur.translations?.[0];

            return (
              <div
                key={mezmur.id}
                className="dd-project-card p-6 flex flex-col justify-between bg-white border border-neutral-200/90 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span className="uppercase tracking-wider">
                      {mezmur.category?.nameAm || mezmur.category?.nameEn}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-600">
                      <Headphones className="w-3.5 h-3.5" />
                      {mezmur.playCount.toLocaleString()} plays
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 tracking-tight group-hover:text-amber-800 transition-colors">
                    {trans?.title}
                  </h3>

                  <p className="text-xs text-neutral-500 font-mono">
                    {mezmur.artist?.nameAm || mezmur.artist?.nameEn}
                  </p>

                  {/* Lyrics Excerpt */}
                  {trans?.lyrics && (
                    <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60 text-xs text-neutral-700 font-serif leading-relaxed italic whitespace-pre-line max-h-28 overflow-hidden">
                      {trans.lyrics}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500">
                    <Volume2 className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Liturgical Chants</span>
                  </div>

                  <DoorDennisButton
                    href={`/${locale}/mezmur/${mezmur.slug}`}
                    className="!py-1.5 !px-3 !text-xs"
                  >
                    {isEn ? 'Listen' : 'አዳምጥ'}
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
