'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { GridLines } from './GridLines';
import { KineticTitle } from './KineticTitle';
import { DoorDennisButton } from './DoorDennisButton';
import { VenetianMaskReveal } from './VenetianMaskReveal';
import { ArrowUpRight } from 'lucide-react';

const Model3DViewer = dynamic(
  () => import('./Model3DViewer').then((mod) => mod.Model3DViewer),
  { ssr: false }
);

interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  imageSrc: string;
  href: string;
  slits?: boolean;
}

interface ProjectsSectionProps {
  title?: string;
  italicWord?: string;
  afterText?: string;
  ctaText?: string;
  ctaHref?: string;
  projects?: ProjectItem[];
  locale?: string;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  title = 'ቅዱሳት ቅርሶችና',
  italicWord = 'መዛግብት',
  afterText = '',
  ctaText = 'ሁሉንም መዛግብት ይመልከቱ',
  ctaHref = '/library',
  locale = 'am',
}) => {
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const projectsList: ProjectItem[] = [
    {
      id: 'clergy-chants',
      title: isEn ? 'HOLY SYNOD & CLERGY' : isGez ? 'ሊቃውንት ወካህናት' : 'ሊቃውንተ ቤተክርስቲያን',
      subtitle: isEn ? 'SACRED CHANTS & ANCIENT HYMNODY' : isGez ? 'ማኅሌተ ያሬድ ወዜማ' : 'ያሬዳዊ ዜማና ማኅሌት',
      category: isEn ? 'LITURGICAL PATRIMONY' : 'መንፈሳዊ ቅርስ',
      date: isEn ? '16TH CENTURY TRADITION' : '፲፮ኛው መቶ ክፍለ ዘመን',
      imageSrc: '/people.png',
      href: '/mezmur',
      slits: false,
    },
    {
      id: 'monasteries-dome',
      title: isEn ? 'AXUM TSION & LALIBELA' : isGez ? 'አድባራት ወገዳማት' : 'አክሱምና ላሊበላ ገዳማት',
      subtitle: isEn ? 'LIVING MONASTIC SANCTUARIES' : isGez ? 'ጥንታውያን ገዳማት' : 'ጥንታዊት አድባራት ወገዳማት',
      category: isEn ? 'MONASTIC HERITAGE' : 'ገዳማዊ ቅርስ',
      date: isEn ? '4TH CENTURY FOUNDATIONS' : '፬ኛው መቶ ክፍለ ዘመን',
      imageSrc: '/dome.png',
      href: '/churches',
      slits: true, // Venetian Slit Reveal matching Screenshot 2
    },
    {
      id: 'manuscripts-cross',
      title: isEn ? 'ILLUMINATED MANUSCRIPTS' : isGez ? 'መጻሕፍተ ብራና' : 'የብራና መጻሕፍትና መስቀሎች',
      subtitle: isEn ? 'ANCIENT GE\'EZ SCRIPT & RELICS' : isGez ? 'ሥነ ጽሑፈ ግዕዝ ወቅርሳት' : 'የግዕዝ ሥነ ጽሑፍና ቅርሶች',
      category: isEn ? 'SACRED ARCHIVE' : 'ብሔራዊ ቤተ መዛግብት',
      date: isEn ? 'CENTURIES IV - XX' : 'ከ፬ኛው - ፳ኛው መቶ ክፍለ ዘመን',
      imageSrc: '/cross.png',
      href: '/library',
      slits: true, // Venetian Slit Reveal matching Screenshot 2
    },
  ];

  return (
    <section className="relative py-24 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F7F5F0]">
      {/* 9 Architectural Vertical Grid Lines (Exact Door Dennis Structure) */}
      <GridLines count={9} opacity={0.08} />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Sticky Header Row matching Door Dennis homeProjectsBlock */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12 sm:pb-20 border-b border-[#201F1E]/10">
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-[#5C5A56] mb-3">
              {isEn ? 'CHAPTER 01 ・ SACRED PORTFOLIO' : isGez ? 'ክፍል ፩ ・ ቅዱሳት ቅርሳት' : 'ክፍል ፩ ・ የቤተክርስቲያን መዛግብት'}
            </div>
            <KineticTitle
              plainText={title}
              italicWord={italicWord}
              afterText={afterText}
              as="h2"
              className="text-4xl sm:text-6xl md:text-7xl text-[#201F1E]"
            />
          </div>

          <div className="shrink-0">
            <DoorDennisButton href={`/${locale}${ctaHref}`}>
              {ctaText}
            </DoorDennisButton>
          </div>
        </div>

        {/* ========================================================
            DOOR DENNIS SIGNATURE 8-COLUMN ASYMMETRIC GRID
            - Column 1 to 3: Project 1 (People/Clergy)
            - Column 4 to 5: Open Central Gap revealing 3D Watermark
            - Column 6 to 8: Project 2 (Cathedral Dome with Venetian Slits, Staggered)
            - Column 2 to 4 (or 1 to 3): Project 3 (Manuscripts & Cross, Identical Size!)
            ======================================================== */}
        <div className="relative mt-16 sm:mt-24">
          {/* Center 3D Interactive Rotating Model in middle gap matching doordennis.nl */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] lg:w-[460px] lg:h-[460px] xl:w-[540px] xl:h-[540px] pointer-events-auto select-none z-10 transition-transform duration-700 hover:scale-105"
          >
            <Model3DViewer
              modelUrl="/hl._joachim.glb"
              className="w-full h-full"
              autoRotateSpeed={0.007}
              scaleMultiplier={1.15}
              cameraDistance={2.5}
              ambientIntensity={1.5}
            />
          </div>

          {/* 8-Column Grid Layout matching Door Dennis homeProjectsBlock */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-x-6 sm:gap-x-8 gap-y-16 lg:gap-y-20 items-start relative z-10">
            {/* ========================================================
                PROJECT 1: Columns 1 to 3 (Grid Line 1 to 4)
                ======================================================== */}
            <div className="col-span-1 md:col-start-1 md:col-span-3">
              <Link
                href={`/${locale}${projectsList[0].href}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-2xl bg-[#EDEAE3] border border-[#201F1E]/10 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-[#201F1E]/30">
                  <Image
                    src={projectsList[0].imageSrc}
                    alt={projectsList[0].title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 38vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Category Chip */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-[#F7F5F0]/90 text-[#201F1E] backdrop-blur-md border border-[#201F1E]/10">
                      {projectsList[0].category}
                    </span>
                  </div>
                </div>

                {/* Bottom Metadata matching Door Dennis innerContent */}
                <div className="mt-5 space-y-1">
                  <div className="flex items-center justify-between text-base sm:text-lg font-bold font-mono tracking-tight text-[#201F1E] group-hover:text-[#C89D3C] transition-colors">
                    <span className="uppercase">{projectsList[0].title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#C89D3C]" />
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-mono uppercase tracking-wider text-[#5C5A56]">
                    <span>{projectsList[0].subtitle}</span>
                    <span className="text-[11px] opacity-75">{projectsList[0].date}</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* ========================================================
                COLUMNS 4 & 5 ARE OPEN: The 3D Watermark sits here!
                ======================================================== */}

            {/* ========================================================
                PROJECT 2: Columns 6 to 8 (Grid Line 6 to 9)
                Staggered Downward, Exact Same Size as Project 1
                ======================================================== */}
            <div className="col-span-1 md:col-start-6 md:col-span-3 md:mt-28 lg:mt-40">
              <Link
                href={`/${locale}${projectsList[1].href}`}
                className="group block"
              >
                <VenetianMaskReveal
                  linesCount={24}
                  delayMs={150}
                  className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-2xl bg-[#EDEAE3] border border-[#201F1E]/10 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-[#201F1E]/30"
                >
                  <Image
                    src={projectsList[1].imageSrc}
                    alt={projectsList[1].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 38vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Category Chip */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-[#F7F5F0]/90 text-[#201F1E] backdrop-blur-md border border-[#201F1E]/10">
                      {projectsList[1].category}
                    </span>
                  </div>
                </VenetianMaskReveal>

                {/* Bottom Metadata matching Door Dennis innerContent */}
                <div className="mt-5 space-y-1">
                  <div className="flex items-center justify-between text-base sm:text-lg font-bold font-mono tracking-tight text-[#201F1E] group-hover:text-[#C89D3C] transition-colors">
                    <span className="uppercase">{projectsList[1].title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#C89D3C]" />
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-mono uppercase tracking-wider text-[#5C5A56]">
                    <span>{projectsList[1].subtitle}</span>
                    <span className="text-[11px] opacity-75">{projectsList[1].date}</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* ========================================================
                PROJECT 3: Columns 2 to 4 (Grid Line 2 to 5)
                EXACT SAME SIZE AND PROPORTION, PROPERLY ALIGNED
                ======================================================== */}
            <div className="col-span-1 md:col-start-2 md:col-span-3 md:-mt-8 lg:-mt-12">
              <Link
                href={`/${locale}${projectsList[2].href}`}
                className="group block"
              >
                <VenetianMaskReveal
                  linesCount={24}
                  delayMs={200}
                  className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-2xl bg-[#EDEAE3] border border-[#201F1E]/10 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-[#201F1E]/30"
                >
                  <Image
                    src={projectsList[2].imageSrc}
                    alt={projectsList[2].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 38vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Category Chip */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-[#F7F5F0]/90 text-[#201F1E] backdrop-blur-md border border-[#201F1E]/10">
                      {projectsList[2].category}
                    </span>
                  </div>
                </VenetianMaskReveal>

                {/* Bottom Metadata matching Door Dennis innerContent */}
                <div className="mt-5 space-y-1">
                  <div className="flex items-center justify-between text-base sm:text-lg font-bold font-mono tracking-tight text-[#201F1E] group-hover:text-[#C89D3C] transition-colors">
                    <span className="uppercase">{projectsList[2].title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#C89D3C]" />
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-mono uppercase tracking-wider text-[#5C5A56]">
                    <span>{projectsList[2].subtitle}</span>
                    <span className="text-[11px] opacity-75">{projectsList[2].date}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
