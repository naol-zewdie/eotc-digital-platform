'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Sparkles,
  ArrowUpRight,
  Sun,
} from 'lucide-react';
import { GridLines } from '../../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../../components/DoorDennis/DoorDennisButton';

interface EventsPageProps {
  params: { locale: string };
}

export default function EventsCalendarPage({ params }: EventsPageProps) {
  const locale = params.locale || 'am';
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const [selectedMonth, setSelectedMonth] = useState<number>(1); // 1 = Meskerem

  const ethiopianMonths = [
    { num: 1, nameAm: 'መስከረም', nameEn: 'Meskerem (Sep-Oct)' },
    { num: 2, nameAm: 'ጥቅምት', nameEn: 'Tikimt (Oct-Nov)' },
    { num: 3, nameAm: 'ኅዳር', nameEn: 'Hidar (Nov-Dec)' },
    { num: 4, nameAm: 'ታኅሣሥ', nameEn: 'Tahsas (Dec-Jan)' },
    { num: 5, nameAm: 'ጥር', nameEn: 'Tir (Jan-Feb)' },
    { num: 6, nameAm: 'የካቲት', nameEn: 'Yekatit (Feb-Mar)' },
    { num: 7, nameAm: 'መጋቢት', nameEn: 'Megabit (Mar-Apr)' },
    { num: 8, nameAm: 'ሚያዝያ', nameEn: 'Miyazya (Apr-May)' },
    { num: 9, nameAm: 'ግንቦት', nameEn: 'Ginbot (May-Jun)' },
    { num: 10, nameAm: 'ሰኔ', nameEn: 'Sene (Jun-Jul)' },
    { num: 11, nameAm: 'ሐምሌ', nameEn: 'Hamle (Jul-Aug)' },
    { num: 12, nameAm: 'ነሐሴ', nameEn: 'Nehase (Aug-Sep)' },
    { num: 13, nameAm: 'ጳጉሜን', nameEn: 'Pagume (Sep)' },
  ];

  const monthlyFeasts: Record<number, Array<{ day: number; titleAm: string; titleEn: string; type: string }>> = {
    1: [
      { day: 1, titleAm: 'ቅዱስ ዮሐንስ መጥምቅ (እንቁጣጣሽ)', titleEn: 'Enkutatash / St. John the Baptist', type: 'MAJOR_FEAST' },
      { day: 17, titleAm: 'የደመራ በዓል', titleEn: 'Demera Eve of the Holy Cross', type: 'MAJOR_FEAST' },
      { day: 18, titleAm: 'ክብረ በዓለ መስቀል', titleEn: 'Feast of the Discovery of True Cross', type: 'MAJOR_FEAST' },
      { day: 21, titleAm: 'የእመቤታችን ማርያም ወርሃዊ መታሰቢያ', titleEn: 'Monthly Commemoration of St. Mary', type: 'MONTHLY' },
      { day: 27, titleAm: 'መድኃኔዓለም ወርሃዊ በዓል', titleEn: 'Medhane Alem (Savior of the World)', type: 'MONTHLY' },
    ],
    2: [
      { day: 14, titleAm: 'አቡነ አረጋዊ ገዳም ክብረ በዓል (ደብረ ዳሞ)', titleEn: 'Abuna Aregawi Commemoration (Debre Damo)', type: 'PATRONAL' },
      { day: 21, titleAm: 'የእመቤታችን ማርያም ወርሃዊ በዓል', titleEn: 'Monthly Commemoration of St. Mary', type: 'MONTHLY' },
      { day: 27, titleAm: 'መድኃኔዓለም ወርሃዊ በዓል', titleEn: 'Medhane Alem Monthly', type: 'MONTHLY' },
    ],
    3: [
      { day: 6, titleAm: 'ቁስቋም ማርያም (ስደተ ግብፅ)', titleEn: 'Kuskawam St. Mary (Flight to Egypt)', type: 'MAJOR_FEAST' },
      { day: 12, titleAm: 'ቅዱስ ሚካኤል ሊቀ መላእክት', titleEn: 'Archangel St. Michael Feast', type: 'MAJOR_FEAST' },
      { day: 21, titleAm: 'የእመቤታችን ጽዮን ማርያም (አክሱም)', titleEn: 'Zion Mary Annual Celebration (Axum)', type: 'MAJOR_FEAST' },
    ],
    4: [
      { day: 19, titleAm: 'ቅዱስ ገብርኤል ሊቀ መላእክት (ቁልቢ)', titleEn: 'Archangel St. Gabriel Annual Pilgrimage (Kulubi)', type: 'MAJOR_FEAST' },
      { day: 28, titleAm: 'በዓለ ልደት (ገና ዋዜማ)', titleEn: 'Eve of the Nativity of Christ', type: 'MAJOR_FEAST' },
      { day: 29, titleAm: 'በዓለ ልደት (የጌታችን የልደት በዓል)', titleEn: 'Nativity of Our Lord (Genna)', type: 'MAJOR_FEAST' },
    ],
    5: [
      { day: 11, titleAm: 'በዓለ ኤጲፋንያ (ጥምቀት)', titleEn: 'Timkat (Epiphany of Our Lord)', type: 'MAJOR_FEAST' },
      { day: 12, titleAm: 'ቃና ዘገሊላ', titleEn: 'Kana ZeGelila (Wedding at Cana)', type: 'MAJOR_FEAST' },
      { day: 21, titleAm: 'አስተርእዮ ማርያም', titleEn: 'Aster\'eyo Maryam', type: 'MAJOR_FEAST' },
    ],
  };

  const activeFeasts = monthlyFeasts[selectedMonth] || [
    { day: 12, titleAm: 'ቅዱስ ሚካኤል ሊቀ መላእክት', titleEn: 'St. Michael Monthly', type: 'MONTHLY' },
    { day: 21, titleAm: 'የእመቤታችን ማርያም ወርሃዊ በዓል', titleEn: 'St. Mary Monthly', type: 'MONTHLY' },
    { day: 27, titleAm: 'መድኃኔዓለም ወርሃዊ በዓል', titleEn: 'Medhane Alem Monthly', type: 'MONTHLY' },
  ];

  return (
    <div className="relative min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F0F0F0]">
      {/* 9 Architectural Lines */}
      <GridLines count={9} opacity={0.07} />

      <div className="relative max-w-7xl mx-auto z-10 space-y-12">
        {/* Header */}
        <div className="border-b border-neutral-300/70 pb-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
            <CalendarIcon className="w-4 h-4 text-neutral-800" />
            <span>{isEn ? 'Liturgical Calendar & Feasts' : 'ሥርዓተ አጽዋማትና በዓላት'}</span>
            <span>・</span>
            <span className="text-neutral-400">13 Liturgical Months</span>
          </div>

          <KineticTitle
            plainText={isEn ? 'Apostolic Calendar &' : 'የቤተክርስቲያን'}
            italicWord={isEn ? 'Holy Feasts' : 'በዓላትና አጽዋማት'}
            afterText=""
            as="h1"
            className="text-4xl sm:text-5xl lg:text-6xl text-neutral-900"
          />

          <p className="text-base text-neutral-600 max-w-2xl leading-relaxed">
            {isEn
              ? 'Explore the canonical Ethiopian ecclesiastical calendar, nine major feasts of the Lord, nine minor feasts, and holy fasting seasons.'
              : 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ዓመታዊ የዘመን አቆጣጠር፣ ዐበይትና ንዑሳን የጌታ በዓላት፣ የቅዱሳን መታሰቢያዎችና የጾም ወቅቶች።'}
          </p>
        </div>

        {/* 13 Months Pill Slider */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-6">
          {ethiopianMonths.map((m) => (
            <button
              key={m.num}
              onClick={() => setSelectedMonth(m.num)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedMonth === m.num
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white/80 border border-neutral-300/70 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {isEn ? m.nameEn : m.nameAm}
            </button>
          ))}
        </div>

        {/* Feast Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeFeasts.map((feast, idx) => (
            <div
              key={idx}
              className="dd-project-card p-6 flex flex-col justify-between bg-white border border-neutral-200/90 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span className="uppercase tracking-wider">
                    {feast.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-bold">
                    Day {feast.day}
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-serif text-neutral-900 font-normal">
                    {feast.day}
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900 tracking-tight group-hover:text-amber-800 transition-colors">
                    {isEn ? feast.titleEn : feast.titleAm}
                  </h3>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {isEn ? feast.titleEn : feast.titleAm}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-500">
                  Liturgical Observance
                </span>

                <DoorDennisButton
                  href={`/${locale}/events`}
                  className="!py-1.5 !px-3 !text-xs"
                >
                  {isEn ? 'Details' : 'ዝርዝር'}
                </DoorDennisButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
