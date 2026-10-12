'use client';

import React from 'react';
import Link from 'next/link';
import { ReviewsMarquee } from './DoorDennis/ReviewsMarquee';
import { DoorDennisButton } from './DoorDennis/DoorDennisButton';
import { KineticTitle } from './DoorDennis/KineticTitle';
import { GridLines } from './DoorDennis/GridLines';
import { TextScrambler } from './DoorDennis/TextScrambler';

interface FooterProps {
  currentLocale?: string;
}

export const Footer: React.FC<FooterProps> = ({ currentLocale = 'am' }) => {
  const isEn = currentLocale === 'en';
  const isGez = currentLocale === 'gez';

  return (
    <footer className="relative bg-[#F7F5F0] text-[#201F1E] pt-20 sm:pt-32 pb-12 overflow-hidden border-t border-[#201F1E]/10">
      {/* 9 Architectural Lines */}
      <GridLines count={9} opacity={0.08} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Reviews & Testimonials Marquee */}
        <div className="border-b border-[#201F1E]/10 pb-16">
          <div className="text-center mb-6">
            <span className="text-xs uppercase font-mono tracking-widest text-[#5C5A56]">
              {isEn ? 'Patriarchate Blessings & Testimonies' : 'የሊቃውንት ምስክርነትና ቡራኬ'}
            </span>
          </div>
          <ReviewsMarquee locale={currentLocale} />
        </div>

        {/* Big Impactful Call To Action Section (Matching Door Dennis footer huge title) */}
        <div className="py-20 sm:py-28 text-center max-w-4xl mx-auto space-y-8">
          <KineticTitle
            plainText={isEn ? 'Preserve The Sacred' : 'የተዋሕዶን ቅርስ'}
            italicWord={isEn ? 'Heritage Together' : 'አብረን እንጠብቅ'}
            afterText=""
            as="h2"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#201F1E]"
          />

          <p className="text-base sm:text-lg text-[#5C5A56] max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? 'Join our global ecclesiastical initiative to digitize, archive, and safeguard thousands of ancient parchments and liturgical hymns.'
              : 'በዓለም ዙሪያ የሚገኙ ጥንታዊ የብራና መጻሕፍትን፣ ያሬዳዊ ዜማዎችንና የገዳማት ታሪክን በዲጂታል ጥራት ለማቆየት የበኩልዎን አስተዋጽኦ ያበርክቱ።'}
          </p>

          <div className="pt-2 flex justify-center">
            <DoorDennisButton href={`/${currentLocale}/donate`}>
              {isEn ? 'Support Heritage Preservation' : 'በምጽዋት ይደግፉ'}
            </DoorDennisButton>
          </div>
        </div>

        {/* Architectural 4-Column Footer Grid */}
        <div className="pt-16 pb-12 border-t border-[#201F1E]/10 grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 text-xs">
          {/* Col 1: Platform */}
          <div className="space-y-4">
            <div className="font-mono uppercase text-[#201F1E] tracking-wider font-semibold">
              {isEn ? 'Archives' : 'መዛግብት'}
            </div>
            <ul className="space-y-2.5 text-[#5C5A56]">
              <li>
                <Link href={`/${currentLocale}/library`} className="hover:text-[#C89D3C] transition-colors">
                  {isEn ? 'Illuminated Manuscripts' : 'የብራና መጻሕፍት'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/mezmur`} className="hover:text-[#C89D3C] transition-colors">
                  {isEn ? 'Sacred Yared Chants' : 'ያሬዳዊ ዜማና ማኅሌት'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/churches`} className="hover:text-[#C89D3C] transition-colors">
                  {isEn ? 'Monasteries & Parishes' : 'ገዳማትና አድባራት'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/articles`} className="hover:text-[#C89D3C] transition-colors">
                  {isEn ? 'Theological Treatises' : 'ትምህርተ ሃይማኖት'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Services & Liturgy */}
          <div className="space-y-4">
            <div className="font-mono uppercase text-[#201F1E] tracking-wider font-semibold">
              {isEn ? 'Ecclesiastical' : 'ሥርዓተ ቤተክርስቲያን'}
            </div>
            <ul className="space-y-2.5 text-[#5C5A56]">
              <li>
                <Link href={`/${currentLocale}/events`} className="hover:text-[#C89D3C] transition-colors">
                  {isEn ? 'Liturgical Calendar' : 'በዓላትና አጽዋማት'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/search`} className="hover:text-[#C89D3C] transition-colors">
                  {isEn ? 'Global Search Archive' : 'ሁሉን አቀፍ ፍለጋ'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/donate`} className="hover:text-[#C89D3C] transition-colors">
                  {isEn ? 'Heritage Conservation Fund' : 'የቅርስ ጥበቃ ፈንድ'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/contact`} className="hover:text-[#C89D3C] transition-colors">
                  {isEn ? 'Direct Contact & Inquiries' : 'ቀጥታ ግንኙነት'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Status & Monasteries */}
          <div className="space-y-4">
            <div className="font-mono uppercase text-[#201F1E] tracking-wider font-semibold">
              {isEn ? 'Status & Diocese' : 'የመድረኩ ሁኔታ'}
            </div>
            <div className="space-y-2 text-[#5C5A56]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C89D3C] animate-pulse" />
                <span className="text-[#201F1E] font-mono font-semibold">Archive Live 24/7</span>
              </div>
              <p className="text-[#5C5A56] leading-relaxed">
                መንበረ ፓትርያርክ ጠቅላይ ጽሕፈት ቤት፣ አዲስ አበባ፣ ኢትዮጵያ
              </p>
              <div className="pt-1 font-mono text-[11px] text-[#7A7771]">
                EAT UTC+3 ・ Addis Ababa
              </div>
            </div>
          </div>

          {/* Col 4: Patriarchate Contact */}
          <div className="space-y-4">
            <div className="font-mono uppercase text-[#201F1E] tracking-wider font-semibold">
              {isEn ? 'Direct Inquiries' : 'ቀጥታ አድራሻ'}
            </div>
            <div className="space-y-2 text-[#5C5A56]">
              <div>
                <TextScrambler
                  text="heritage@eotc-archive.org"
                  className="font-mono text-[#201F1E] hover:text-[#C89D3C] transition-colors"
                />
              </div>
              <div>
                <span className="font-mono text-[#5C5A56]">+251 11 123 4567</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[#5C5A56] hover:text-[#201F1E] font-mono text-[11px] transition-colors"
                >
                  <span>Ecclesiastical Admin</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="pt-8 border-t border-[#201F1E]/10 text-[11px] font-mono text-[#5C5A56] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} Ethiopian Orthodox Tewahedo Church Digital Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/${currentLocale}/articles`} className="hover:text-[#201F1E] transition-colors">
              Terms & Canonical Governance
            </Link>
            <span>・</span>
            <Link href={`/${currentLocale}/articles`} className="hover:text-[#201F1E] transition-colors">
              Preservation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
