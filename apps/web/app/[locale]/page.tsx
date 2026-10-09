'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { SacredAtmosphereCanvas } from '../../components/SacredAtmosphereCanvas';
import { GridLines } from '../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../components/DoorDennis/DoorDennisButton';
import { TextScrambler } from '../../components/DoorDennis/TextScrambler';
import { VenetianMaskReveal } from '../../components/DoorDennis/VenetianMaskReveal';
import { KeywordMarquee } from '../../components/DoorDennis/KeywordMarquee';
import { BadgeLinkBlock } from '../../components/DoorDennis/BadgeLinkBlock';
import { ProjectsSection } from '../../components/DoorDennis/ProjectsSection';
import { QuoteSection } from '../../components/DoorDennis/QuoteSection';
import { ExpertisesBlock } from '../../components/DoorDennis/ExpertisesBlock';
import { AboutMissionBlock } from '../../components/DoorDennis/AboutMissionBlock';

interface HomePageProps {
  params: { locale: string };
}

export default function HomePage({ params }: HomePageProps) {
  const locale = params.locale || 'am';
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  // Keyword Marquee items
  const marqueeKeywords = isEn
    ? [
        'Illuminated Manuscripts',
        'St. Yared Sacred Chants',
        'Historic Monasteries',
        'Ecclesiastical Art',
        'Synaxarium & Hagiography',
        'Ancient Ge\'ez Liturgy',
        'Patristic Theology',
        'Ark of the Covenant',
        'Monastic Hermitages',
        'Chant Notation Meleket',
      ]
    : isGez
    ? [
        'መጻሕፍተ ብራና',
        'ማኅሌት ዘቅዱስ ያሬድ',
        'ደብረ ዳሞ ወአክሱም',
        'ስንክሳር ቅዱሳን',
        'ሥርዓተ ቅዳሴ',
        'ድርሳናት ወገድላት',
        'ጾመ ድጓ ወዝማሬ',
        'ታቦተ ጽዮን ማርያም',
      ]
    : [
        'የብራና መጻሕፍት',
        'ያሬዳዊ ዜማና ማኅሌት',
        'ጥንታዊ ገዳማት',
        'ቅዱሳት ሥዕላት',
        'ስንክሳርና ገድላት',
        'ሥርዓተ ቅዳሴ',
        'የሊቃውንት ትምህርት',
        'የግዕዝ ሥነ-ጽሑፍ',
        'የአክሱም ጽዮን ታሪክ',
        'ድጓና ጾመ ድጓ',
      ];

  // Badge Link pills
  const badgeLinks = isEn
    ? [
        { label: 'Read Ancient Manuscripts', href: `/${locale}/library` },
        { label: 'Listen to St. Yared Chants', href: `/${locale}/mezmur` },
        { label: 'Explore Historic Monasteries', href: `/${locale}/churches` },
        { label: 'Study Orthodox Theology', href: `/${locale}/articles` },
        { label: 'View Liturgical Calendar', href: `/${locale}/events` },
        { label: 'Support Heritage Preservation', href: `/${locale}/donate` },
      ]
    : isGez
    ? [
        { label: 'አንብብ መጻሕፍተ ብራና', href: `/${locale}/library` },
        { label: 'ስምዐ ዜማ ዘቅዱስ ያሬድ', href: `/${locale}/mezmur` },
        { label: 'ጎብኝ አድባራት ወገዳማት', href: `/${locale}/churches` },
        { label: 'ተመሃር ሃይማኖተ አበው', href: `/${locale}/articles` },
        { label: 'ተመልከት በዓላት ወአጽዋማት', href: `/${locale}/events` },
        { label: 'ዕቀብ ቅርሰ ቤተክርስቲያን', href: `/${locale}/donate` },
      ]
    : [
        { label: 'ጥንታዊ የብራና መጻሕፍት ማንበብ እፈልጋለሁ', href: `/${locale}/library` },
        { label: 'ያሬዳዊ ዜማና ቅዳሴ ማዳመጥ እፈልጋለሁ', href: `/${locale}/mezmur` },
        { label: 'ታሪካዊ ገዳማትን መጎብኘት እፈልጋለሁ', href: `/${locale}/churches` },
        { label: 'የሊቃውንት ትምህርተ ሃይማኖት መማር እፈልጋለሁ', href: `/${locale}/articles` },
        { label: 'የበዓላትና አጽዋማት ቀንን ማወቅ እፈልጋለሁ', href: `/${locale}/events` },
        { label: 'ለቤተክርስቲያን ቅርስ ጥበቃ መደገፍ እፈልጋለሁ', href: `/${locale}/donate` },
      ];

  return (
    <div className="relative w-full overflow-hidden bg-[#F7F5F0]">
      {/* ========================================================
          HERO SECTION: HOME HEADER BLOCK (DOOR DENNIS ARCHITECTURE)
          ======================================================== */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[92vh] flex flex-col justify-between">
        {/* Three.js Fluted Glass Refraction Canvas (Exact Door Dennis WebGL Shaders) */}
        <SacredAtmosphereCanvas variant="header" />

        {/* 9 Architectural Lines */}
        <GridLines count={9} opacity={0.08} />

        <div className="relative max-w-7xl mx-auto w-full z-10 space-y-8 sm:space-y-12">
          {/* Top Star Rating Pill with Sacred Gold Accent */}
          <div className="flex items-center gap-3">
            <div className="stars-pill">
              <span className="innerStars">★★★★★ 5.0</span>
              <span className="text-[#C89D3C]">・</span>
              <TextScrambler
                text={
                  isEn
                    ? 'Verified Ecclesiastical & Synod Heritage'
                    : isGez
                    ? 'ስምዐ ሊቃውንተ ቤተክርስቲያን'
                    : 'በሊቃውንተ ቤተክርስቲያን የተመሰከረለት ብሔራዊ ቅርስ'
                }
                automatic={true}
                intervalMs={3800}
                className="text-xs sm:text-sm font-semibold text-[#201F1E]"
              />
            </div>
          </div>

          {/* Grand Kinetic Title */}
          <div className="max-w-5xl">
            <KineticTitle
              plainText={
                isEn
                  ? 'Apostolic Antiquity and Sacred'
                  : isGez
                  ? 'መንፈሳዊት ወታሪካዊት'
                  : 'የጥንታዊትና ሐዋርያዊት'
              }
              italicWord={
                isEn
                  ? 'Orthodox Heritage'
                  : isGez
                  ? 'ተዋሕዶ ቤተክርስቲያን'
                  : 'ተዋሕዶ ቤተክርስቲያን'
              }
              afterText={
                isEn
                  ? 'in the Digital Era.'
                  : isGez
                  ? 'ቅርስ በዘመነ ዲጂታል'
                  : 'መንፈሳዊና ታሪካዊ ቅርስ በዲጂታል ዘመን።'
              }
              as="h1"
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#201F1E] leading-[1.08] tracking-tight"
            />
          </div>

          {/* Subtitle & Rolling CTA Button */}
          <div className="max-w-2xl space-y-6">
            <p className="text-base sm:text-lg text-[#5C5A56] leading-relaxed font-normal">
              {isEn
                ? 'Safeguarding over sixteen centuries of illuminated Ge\'ez parchments, liturgical hymnody, and monastic history, made freely accessible to the global community.'
                : isGez
                ? 'በ፲፮ቱ ምእተ ዓመታት የተጻፉ የብራና መጻሕፍት፣ ያሬዳዊ ማኅሌትና ጥንታውያን ገዳማት ለትውልድ ሁሉ የሚተላለፉበት ዲጂታል ማዕከል።'
                : 'ከ፩,፮፻ ዓመታት በላይ የተጻፉ ጥንታዊ የብራና መጻሕፍትን፣ ያሬዳዊ ዜማዎችንና የገዳማት ታሪክን በዲጂታል ጥራት በመጠበቅ ለመላው ዓለም ምዕመናንና ተመራማሪዎች በነጻ እናቀርባለን።'}
            </p>

            <div>
              <DoorDennisButton href={`/${locale}/library`}>
                {isEn ? 'Explore Sacred Archives' : isGez ? 'ተመልከት መዛግብት' : 'መዛግብቱን ይጎብኙ'}
              </DoorDennisButton>
            </div>
          </div>

          {/* Bottom Dual Columns from Door Dennis */}
          <div className="pt-8 sm:pt-14 border-t border-[#201F1E]/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            {/* Left Column: Ecclesiastical Shutter Image + Live Availability Status */}
            <div className="flex items-center gap-5">
              <VenetianMaskReveal
                linesCount={16}
                delayMs={200}
                className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-2xl bg-[#EDEAE3] border border-[#201F1E]/10 shadow-sm"
              >
                <Image
                  src="/cross.png"
                  alt="Processional Cross"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </VenetianMaskReveal>

              <div className="space-y-1">
                <div className="availability-pill">
                  <div className="dot" />
                  <TextScrambler
                    text={isEn ? 'Archive Live 24/7' : 'በቀጥታ መስመር ላይ ・ ክፍት 24/7'}
                    automatic={true}
                    intervalMs={4500}
                    className="text-xs font-semibold text-[#201F1E]"
                  />
                </div>
                <div className="text-[11px] font-mono text-[#5C5A56] pl-1">
                  {isEn ? 'Global Patriarchate Repository' : 'ዓለም አቀፍ የቤተክርስቲያን ማህደር'}
                </div>
              </div>
            </div>

            {/* Right Column: Latest Highlight Card */}
            <div className="flex md:justify-end">
              <Link
                href={`/${locale}/churches`}
                className="group flex items-center gap-4 p-3 rounded-2xl bg-[#FAF9F6] border border-[#201F1E]/10 hover:border-[#201F1E]/30 transition-all shadow-sm max-w-sm w-full"
              >
                <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden relative bg-[#EDEAE3]">
                  <Image
                    src="/dome.png"
                    alt="Cathedral Architecture"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#5C5A56]">
                    <span>{isEn ? 'Featured Sanctuary' : 'የቅርብ ጊዜ ዝግጅት'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#C89D3C]" />
                  </div>
                  <div className="text-sm font-bold text-[#201F1E] truncate group-hover:text-[#C89D3C] transition-colors">
                    {isEn ? 'Axum Tsion Maryam Cathedral' : 'አክሱም ጽዮን ማርያም ካቴድራል'}
                  </div>
                  <div className="text-[11px] text-[#5C5A56]">
                    {isEn ? 'Tigray, Ethiopia ・ 4th Century' : 'አክሱም ・ ፬ኛው መቶ ክፍለ ዘመን'}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Seamless Keyword Marquee Strip at base of Hero */}
        <div className="mt-16 sm:mt-24">
          <KeywordMarquee items={marqueeKeywords} direction="right" speedSec={40} />
        </div>
      </section>

      {/* ========================================================
          SECTION 2: BADGE LINK PILLS (DOOR DENNIS BADGELINKBLOCK)
          ======================================================== */}
      <BadgeLinkBlock links={badgeLinks} />

      {/* ========================================================
          SECTION 3: STICKY SHOWCASE PROJECTS (DOOR DENNIS HOMEPROJECTSBLOCK)
          Matching Screenshot 2 Asymmetric Layout & Watermark
          ======================================================== */}
      <ProjectsSection
        title={isEn ? 'Sacred Treasures &' : 'ቅዱሳት ቅርሶችና'}
        italicWord={isEn ? 'Manuscripts' : 'መዛግብት'}
        ctaText={isEn ? 'View All Archives' : 'ሁሉንም መዛግብት ይመልከቱ'}
        ctaHref={`/${locale}/library`}
        locale={locale}
      />

      {/* ========================================================
          SECTION 4: EDITORIAL QUOTE BLOCK (DOOR DENNIS QUOTEBLOCK)
          Matching Screenshot 1 Fluted Glass Silk Refraction
          ======================================================== */}
      <QuoteSection
        quote={
          isEn
            ? 'Anchored in illuminated Holy Scripture and Saint Yared\'s celestial chants, our Tewahedo faith remains a living sanctuary of light, preserved for all generations.'
            : isGez
            ? 'ሃይማኖተ ተዋሕዶ ዘተሐንጸት በቅዱሳት መጻሕፍት ወበዜማ ያሬድ፣ ቅርስ ይእቲ ዘብርሃን ወሕይወት ለኵሉ ትውልድ።'
            : 'በቅዱሳት መጻሕፍትና በያሬዳዊ ዜማ የታነጸችው ተዋሕዶ እምነታችን፣ ለትውልድ ሁሉ የሚተላለፍ የሕይወትና የብርሃን ቅርስ ናት።'
        }
        author={
          isEn
            ? 'Ethiopian Orthodox Tewahedo Church'
            : isGez
            ? 'ቅድስት ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን'
            : 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን'
        }
        role={
          isEn
            ? 'Patriarchate Digital Repository'
            : 'ብሔራዊ ዲጂታል መድረክ'
        }
        locale={locale}
      />

      {/* ========================================================
          SECTION 5: 3-COLUMN PILLARS (DOOR DENNIS EXPERTISESBLOCK)
          ======================================================== */}
      <ExpertisesBlock
        title={isEn ? 'Ecclesiastical Pillars &' : 'አገልግሎቶችና'}
        italicWord={isEn ? 'Departments' : 'ክፍላት'}
        locale={locale}
      />

      {/* ========================================================
          SECTION 6: ABOUT MISSION BLOCK (DOOR DENNIS HOMEABOUTBLOCK)
          ======================================================== */}
      <AboutMissionBlock
        title={isEn ? 'Preserving Antiquity in the' : 'የተዋሕዶን ቅርስ'}
        italicWord={isEn ? 'Digital Age' : 'በዲጂታል ዘመን'}
        afterText={isEn ? '' : 'ማቆየት'}
        description={
          isEn
            ? 'The Ethiopian Orthodox Tewahedo Digital Platform is dedicated to the high-fidelity preservation of ancient parchment manuscripts, liturgical chants, monastic sanctuaries, and the living wisdom of traditional scholars, offered freely to the world.'
            : 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ብሔራዊ ዲጂታል መድረክ፣ ጥንታዊ የብራና መጻሕፍትን፣ ያሬዳዊ ዜማዎችን፣ የገዳማት ታሪክንና የሊቃውንት ትምህርትን ለመላው ዓለም ምዕመናንና ተመራማሪዎች በነጻ የሚያደርስ ታሪካዊ አገልግሎት ነው።'
        }
        locale={locale}
      />
    </div>
  );
}
