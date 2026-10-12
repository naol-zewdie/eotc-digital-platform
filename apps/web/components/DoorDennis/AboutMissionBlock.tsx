'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GridLines } from './GridLines';
import { DoorDennisButton } from './DoorDennisButton';
import { VenetianMaskReveal } from './VenetianMaskReveal';
import { ArrowUpRight } from 'lucide-react';

interface AboutMissionBlockProps {
  title?: string;
  italicWord?: string;
  afterText?: string;
  description?: string;
  locale?: string;
}

export const AboutMissionBlock: React.FC<AboutMissionBlockProps> = ({
  locale = 'am',
}) => {
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const partners = [
    { name: isEn ? 'Axum Tsion Patriarchate' : 'አክሱም ጽዮን ካቴድራል', code: 'AXM' },
    { name: isEn ? 'Debre Damo Monastery' : 'ደብረ ዳሞ ገዳም', code: 'DDM' },
    { name: isEn ? 'Lalibela Monolithic Sanctuaries' : 'ሮሃ ላሊበላ ቅርስ', code: 'LBL' },
    { name: isEn ? 'Lake Tana Monastic Islands' : 'ጣና ቂርቆስ ገዳም', code: 'TNA' },
    { name: isEn ? 'Holy Trinity Theological University' : 'ቅድስት ሥላሴ ዩኒቨርሲቲ', code: 'HTU' },
  ];

  return (
    <section className="relative py-24 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F7F5F0]">
      {/* 9 Architectural Vertical Grid Lines */}
      <GridLines count={9} opacity={0.08} />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* ========================================================
            DOOR DENNIS HOME ABOUT BLOCK (EXACT TWO-ROW ARCHITECTURE)
            ======================================================== */}
        <div className="space-y-16 sm:space-y-24">
          {/* ROW 1: Left column has Partners + Manifesto; Right column has 12-Slit Mask Revealed Photo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column (Span 7) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Trotse Partner Van / Proud Monastic Alliances Header */}
              <div className="space-y-3">
                <Link
                  href={`/${locale}/churches`}
                  className="group inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#5C5A56] hover:text-[#C89D3C] transition-colors"
                >
                  <span className="flex items-center gap-0.5 text-[#C89D3C]">
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                  <span>
                    {isEn
                      ? 'COMMUNION WITH HISTORIC MONASTERIES'
                      : isGez
                      ? 'ኅብረት ምስለ አድባራት ወገዳማት'
                      : 'ታሪካዊ አጋሮችና ጥንታውያን ገዳማት'}
                  </span>
                </Link>

                {/* Partner Grid Pills */}
                <div className="partnerGrid">
                  {partners.map((partner, i) => (
                    <span key={i} className="partner-pill cursor-default">
                      <span className="text-[#C89D3C] font-serif font-bold text-sm">†</span>
                      <span>{partner.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Large Manifesto Statement matching Door Dennis .title.quote.noUpper */}
              <div className="pt-2">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#201F1E] leading-[1.3] tracking-tight">
                  {isEn
                    ? 'We safeguard sixteen centuries of apostolic memory with reverence for antiquity and clarity of purpose. Our calling bridges sacred philology, liturgical acoustics, and digital longevity.'
                    : isGez
                    ? 'ንዕቀብ ፲፮ቱ ምእተ ዓመታት ዘሐዋርያዊ ትውፊት በክብር ወበመንፈስ ቅዱስ። ፃዕርነ ያስተጋብእ መጻሕፍተ ብራና ወማኅሌተ ያሬድ ለኵሉ ዓለም።'
                    : 'ከ፩,፮፻ ዓመታት በላይ የተሻገረውን ሐዋርያዊ ትውፊትና ቅርስ፣ ሳይበረዝና ሳይዛነፍ በዲጂታል ጥራት ጠብቆ ለመላው ዓለም ማዳረስ የሁላችንም ታሪካዊ አደራ ነው።'}
                </p>
              </div>
            </div>

            {/* Right Column (Span 5): Large Photograph with 12-Line Venetian Mask Reveal */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/5] overflow-hidden rounded-3xl bg-[#EDEAE3] border border-[#201F1E]/12 shadow-lg">
                <VenetianMaskReveal
                  linesCount={12}
                  delayMs={200}
                  className="w-full h-full relative"
                >
                  <Image
                    src="/people.png"
                    alt="Ethiopian Orthodox Clergy and Traditional Scholars"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6 text-white text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 uppercase tracking-widest">
                      {isEn ? 'Patriarchate Living Tradition' : 'ሕያው የሊቃውንት ትውፊት'}
                    </span>
                  </div>
                </VenetianMaskReveal>
              </div>
            </div>
          </div>

          {/* ROW 2: Left column has CTA button; Right column has concluding manifesto quote */}
          <div className="pt-12 sm:pt-16 border-t border-[#201F1E]/10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Col 1 (Span 5): Button Wrapper */}
            <div className="lg:col-span-5">
              <DoorDennisButton href={`/${locale}/articles`}>
                {isEn
                  ? 'Discover Ecclesiastical History'
                  : isGez
                  ? 'አእምር ዜና ቤተክርስቲያን'
                  : 'ስለ ቤተክርስቲያን ታሪክ ይወቁ'}
              </DoorDennisButton>
            </div>

            {/* Col 2 (Span 7): Sub-Manifesto Quote */}
            <div className="lg:col-span-7">
              <p className="text-xl sm:text-2xl font-serif text-[#201F1E]/80 leading-snug">
                {isEn
                  ? 'From this sacred repository, ancient parchment folios, choral canticles, and monastic shrines are transformed into an illuminated legacy accessible to every soul.'
                  : isGez
                  ? 'እምዝንቱ ቅዱስ መዝገብ፣ መጻሕፍተ ብራና ወማኅሌት ይትወሀቡ ለኵሉ ዘየኀሥሥ ብርሃነ።'
                  : 'ከዚህ ቅዱስ መዝገብ በመነሳት፣ የጥንት የብራና መጻሕፍት፣ ያሬዳዊ ዜማዎችና የገዳማት ታሪክ ለእያንዳንዱ ፈላጊ በነጻ የሚደርስ የብርሃን ቅርስ ሆነው ተቀምጠዋል።'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
