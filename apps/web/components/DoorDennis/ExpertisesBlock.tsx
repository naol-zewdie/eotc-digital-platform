'use client';

import React from 'react';
import Link from 'next/link';
import { GridLines } from './GridLines';
import { KineticTitle } from './KineticTitle';
import { ArrowUpRight } from 'lucide-react';

interface ExpertiseCategory {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  items: { num: string; label: string }[];
}

interface ExpertisesBlockProps {
  title?: string;
  italicWord?: string;
  locale?: string;
}

const CATEGORIES: ExpertiseCategory[] = [
  {
    id: 'manuscripts',
    title: 'ቤተ መጻሕፍትና ብራና',
    subtitle: 'Illuminated Manuscripts & Patristics',
    href: '/library',
    items: [
      { num: '01', label: 'ጥንታዊ የብራና ቅጂዎችና ድርሳናት' },
      { num: '02', label: 'ዲጂታል የማኑስክሪፕት ጥናት' },
      { num: '03', label: 'የትርጓሜና ሐተታ መጻሕፍት' },
      { num: '04', label: 'የግዕዝ ቋንቋ ሰዋስውና ቃላት' },
      { num: '05', label: 'የቅዱሳን አበው ገድላትና ታሪክ' },
    ],
  },
  {
    id: 'hymnody',
    title: 'ዜማና ማኅሌት',
    subtitle: 'Sacred Chants & Monastic Hymnody',
    href: '/mezmur',
    items: [
      { num: '01', label: 'ቅዱስ ያሬድ ዜማዎች (ግዕዝ፣ ዕዝል፣ አራራይ)' },
      { num: '02', label: 'የጾመ ድጓና ድጓ ማኅደር' },
      { num: '03', label: 'የዝማሬና መዋሥዕት ጥናት' },
      { num: '04', label: 'የከበሮና ጸናጽል ሥርዓተ ማኅሌት' },
      { num: '05', label: 'የአብነት ትምህርት ቤቶች ድምፅ' },
    ],
  },
  {
    id: 'monasteries',
    title: 'ገዳማትና ቅርሶች',
    subtitle: 'Historic Monasteries & Sanctuaries',
    href: '/churches',
    items: [
      { num: '01', label: 'የአክሱም ጽዮንና የደብረ ዳሞ ታሪክ' },
      { num: '02', label: 'የላሊበላ ፍልፍል አብያተ ክርስቲያናት' },
      { num: '03', label: 'የገዳማት ጥበቃና ዲጂታል ካርታ' },
      { num: '04', label: 'የሥነ-ቅርፅና ቅዱሳት ሥዕላት ጥበቃ' },
      { num: '05', label: 'ዓለም አቀፍ የቅርስ ምዝገባ' },
    ],
  },
];

export const ExpertisesBlock: React.FC<ExpertisesBlockProps> = ({
  title = 'አገልግሎቶችና',
  italicWord = 'ክፍላት',
  locale = 'am',
}) => {
  return (
    <section className="relative py-24 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F7F5F0]">
      {/* 9 Architectural Lines */}
      <GridLines count={9} opacity={0.08} />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Title */}
        <div className="mb-14 sm:mb-20 pb-8 border-b border-[#201F1E]/10">
          <div className="text-xs uppercase font-mono tracking-widest text-[#5C5A56] mb-2">
            ክፍል ፪ ・ Sacred Pillars
          </div>
          <KineticTitle
            plainText={title}
            italicWord={italicWord}
            as="h2"
            className="text-4xl sm:text-5xl lg:text-6xl text-[#201F1E]"
          />
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F6] border border-[#201F1E]/10 hover:border-[#201F1E]/30 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#201F1E] tracking-tight">
                      {cat.title}
                    </h3>
                    <p className="text-xs font-mono text-[#5C5A56] mt-1">
                      {cat.subtitle}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}${cat.href}`}
                    className="p-2 rounded-xl border border-[#201F1E]/15 hover:bg-[#201F1E] hover:text-[#F7F5F0] transition-colors text-[#201F1E] shrink-0"
                    title={cat.title}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Numbered Service Items */}
                <ul className="space-y-3.5 divide-y divide-[#201F1E]/5 pt-2">
                  {cat.items.map((item, i) => (
                    <li
                      key={i}
                      className="pt-3.5 first:pt-0 flex items-center justify-between text-xs sm:text-sm text-[#201F1E] hover:text-[#C89D3C] group cursor-default transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-[#C89D3C] font-semibold">
                          {item.num}.
                        </span>
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {item.label}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#201F1E]/10">
                <Link
                  href={`/${locale}${cat.href}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#201F1E] hover:text-[#C89D3C] font-mono transition-colors"
                >
                  <span>ዝርዝሩን ይመልከቱ</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
