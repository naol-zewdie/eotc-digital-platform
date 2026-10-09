'use client';

import React from 'react';
import { GridLines } from './GridLines';
import { KineticTitle } from './KineticTitle';
import { DoorDennisButton } from './DoorDennisButton';

interface StatItem {
  value: string;
  label: string;
  sublabel: string;
}

interface AboutMissionBlockProps {
  title?: string;
  italicWord?: string;
  afterText?: string;
  description?: string;
  locale?: string;
}

const STATS: StatItem[] = [
  { value: '፩,፮፻+', label: '1,600+ ዓመታት', sublabel: 'Apostolic Antiquity & Tradition' },
  { value: '፫,፲፻+', label: '3,000+ ቅጂዎች', sublabel: 'Illuminated Ge\'ez Manuscripts' },
  { value: '፩,፭፻+', label: '1,500+ ገዳማት', sublabel: 'Monasteries & Holy Sanctuaries' },
  { value: '፶,፲፻+', label: '50,000+ ምዕመናን', sublabel: 'Active Global Faithful & Scholars' },
];

export const AboutMissionBlock: React.FC<AboutMissionBlockProps> = ({
  title = 'የተዋሕዶን ቅርስ',
  italicWord = 'በዲጂታል ዘመን',
  afterText = 'ማቆየት',
  description = 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ብሔራዊ ዲጂታል መድረክ፣ ጥንታዊ የብራና መጻሕፍትን፣ ያሬዳዊ ዜማዎችን፣ የገዳማት ታሪክንና የሊቃውንት ትምህርትን ለመላው ዓለም ምዕመናንና ተመራማሪዎች በነጻ የሚያደርስ ታሪካዊ አገልግሎት ነው።',
  locale = 'am',
}) => {
  return (
    <section className="relative py-24 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F7F5F0]">
      {/* 9 Architectural Lines */}
      <GridLines count={9} opacity={0.08} />

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-16 sm:pb-20 border-b border-[#201F1E]/10">
          <div className="lg:col-span-7">
            <div className="text-xs uppercase font-mono tracking-widest text-[#5C5A56] mb-3">
              ተልዕኮ ・ Sacred Mission
            </div>
            <KineticTitle
              plainText={title}
              italicWord={italicWord}
              afterText={afterText}
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#201F1E] leading-tight"
            />
          </div>

          <div className="lg:col-span-5 space-y-6 pt-2">
            <p className="text-base sm:text-lg text-[#5C5A56] leading-relaxed">
              {description}
            </p>

            <div>
              <DoorDennisButton href={`/${locale}/articles`}>
                ስለ ቤተክርስቲያን ታሪክ ያንብቡ
              </DoorDennisButton>
            </div>
          </div>
        </div>

        {/* 4 Stats Columns */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="space-y-1.5 border-l-2 border-[#C89D3C] pl-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#201F1E] font-normal tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#201F1E]">
                {stat.label}
              </div>
              <div className="text-[11px] font-mono text-[#5C5A56]">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
