'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GridLines } from './GridLines';
import { KineticTitle } from './KineticTitle';
import { TextScrambler } from './TextScrambler';
import { ArrowUpRight } from 'lucide-react';

interface ExpertiseItem {
  num: string;
  title: string;
  description: string;
}

interface ExpertiseCategory {
  id: string;
  name: string;
  subtitle: string;
  href: string;
  items: ExpertiseItem[];
}

interface ExpertisesBlockProps {
  title?: string;
  italicWord?: string;
  locale?: string;
}

export const ExpertisesBlock: React.FC<ExpertisesBlockProps> = ({
  title = 'አገልግሎቶችና',
  italicWord = 'ክፍላት',
  locale = 'am',
}) => {
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const categories: ExpertiseCategory[] = [
    {
      id: 'manuscripts',
      name: isEn ? 'Manuscripts' : isGez ? 'መጻሕፍተ ብራና' : 'የብራና መጻሕፍት',
      subtitle: isEn ? 'Archival Preservation' : 'ጥንታዊ ቅጂዎች',
      href: '/library',
      items: [
        {
          num: '01. ',
          title: isEn ? 'High-Resolution Manuscript Digitization' : 'ጥንታዊ የብራና ቅጂዎች ዲጂታላይዜሽን',
          description: isEn
            ? 'Ultra-high-definition capture of fragile parchment codices, preserving liturgical illuminations, marginal notes, and ancient colophons.'
            : 'ከዘመናት በፊት በብራና ላይ የተጻፉ ውድ መጻሕፍትን በከፍተኛ የዲጂታል ጥራት ፎቶ በማንሳትና በመመርመር ለትውልድ እንዳይጠፉ እናስቀምጣለን።',
        },
        {
          num: '02. ',
          title: isEn ? 'Patristic & Liturgical Commentary' : 'የትርጓሜና የሊቃውንት ሐተታዎች',
          description: isEn
            ? 'Authoritative translations and contextual patristic commentaries from venerable traditional cathedral schools of Gondar and Gojjam.'
            : 'የቀደምት ሊቃውንትን ጥልቅ የትርጓሜ ትምህርትና ምስጢራትን በግዕዝና በአማርኛ ማብራሪያ ተደራሽ እናደርጋለን።',
        },
        {
          num: '03. ',
          title: isEn ? 'Ge\'ez Philology & Digital Lexicography' : 'የግዕዝ ቋንቋ ሰዋስውና ቃላት ጥናት',
          description: isEn
            ? 'Interactive Ge\'ez morphological dictionary and grammatical concordance developed for scholars, researchers, and theological students.'
            : 'የግዕዝ ቋንቋ ሰዋስው፣ መዝገበ ቃላትና ሥርዓተ ንባብን በዲጂታል ፍለጋ አማካኝነት በቀላሉ እንዲጠና እናስችላለን።',
        },
        {
          num: '04. ',
          title: isEn ? 'Hagiographies & Synaxarium Archive' : 'የቅዱሳን አበው ገድላትና ስንክሳር',
          description: isEn
            ? 'Complete digitized hagiographical texts (Gedlat) and the universal EOTC Synaxarium synced to the Alexandrian liturgical calendar.'
            : 'ዕለታዊውን የስንክሳር ንባብና የቅዱሳን አበውን ገድላት ከቀን መቁጠሪያ ጋር በማጣመር በየዕለቱ እናቀርባለን።',
        },
        {
          num: '05. ',
          title: isEn ? 'Open Ecclesiastical Repository' : 'ነጻ ዓለም አቀፍ የቤተ መዛግብት ተደራሽነት',
          description: isEn
            ? 'Free public access for academic universities, monastic researchers, and diaspora congregations globally.'
            : 'በዓለም ዙሪያ ለሚገኙ ተመራማሪዎች፣ ምዕመናንና የነገረ መለኮት ተማሪዎች ያለ ክፍያ በነጻ እንዲያነቡ የተዘጋጀ ክፍት ማህደር።',
        },
      ],
    },
    {
      id: 'hymnody',
      name: isEn ? 'Sacred Chants' : isGez ? 'ዜማ ዘቅዱስ ያሬድ' : 'ያሬዳዊ ዜማና ማኅሌት',
      subtitle: isEn ? 'Monastic Hymnody' : 'ሥርዓተ ዜማ',
      href: '/mezmur',
      items: [
        {
          num: '01. ',
          title: isEn ? 'Saint Yared\'s Three Canonical Modes' : 'የቅዱስ ያሬድ ሦስቱ ዜማዎች (ግዕዝ፣ ዕዝል፣ አራራይ)',
          description: isEn
            ? 'Lossless acoustic archival recordings of Ge\'ez, Ezel, and Araray chants recorded inside historic monastery stone sanctuaries.'
            : 'በ፮ኛው መቶ ክፍለ ዘመን በቅዱስ ያሬድ የተዘጋጁትን ሦስቱን የዜማ ስልቶች በንጹሕ የድምፅ ጥራት ከመዝገበ ድምፅ ጋር እናቀርባለን።',
        },
        {
          num: '02. ',
          title: isEn ? 'Meleket Notation & Deggwa Preservation' : 'የዜማ ምልክቶች (መልእክት) እና የድጓ ጥናት',
          description: isEn
            ? 'Deciphering ancient Ethiopic musical meleket notations alongside master chant cantors (Marigeta) from traditional monasteries.'
            : 'ጥንታዊውን ያሬዳዊ የዜማ ምልክት ሥርዓት ከመምህራኑ ጋር በመተባበር በምስልና በድምፅ እናስረዳለን።',
        },
        {
          num: '03. ',
          title: isEn ? 'Tsome Deggwa & Lenten Chant Repositories' : 'የጾመ ድጓና የበዓላት ማኅሌት ማኅደር',
          description: isEn
            ? 'Sacred seasonal hymnody structured systematically across Great Lent, Hosanna, Passion Week, and the Resurrection.'
            : 'የዓበይት በዓላትና የአጽዋማትን የዜማ ክፍሎች በየበዓላቱ ቅደም ተከተል ተሰድረው ለአገልግሎት ዝግጁ ሆነዋል።',
        },
        {
          num: '04. ',
          title: isEn ? 'Censer, Drum & Sistrum Rhythmics' : 'የከበሮ፣ ጸናጽልና መቋሚያ ሥርዓተ ማኅሌት',
          description: isEn
            ? 'Complete visual video documentation of traditional synchronized worship pacing, liturgical steps, and ceremonial canticles.'
            : 'የካህናትና የዲያቆናት የከበሮና ጸናጽል አመታት፣ የዝማሬ እርምጃና መንፈሳዊ ሥርዓት በቪዲዮ ተቀርጾ ተቀምጧል።',
        },
        {
          num: '05. ',
          title: isEn ? 'Traditional Church Choirs & Zema Schools' : 'የአብነት ትምህርት ቤቶች ድምፅና ትሩፋት',
          description: isEn
            ? 'Direct support for indigenous monastic chant schools (Zema Bet) to guarantee the unbroken preservation of oral heritage.'
            : 'የአብነት ትምህርት ቤቶች ተማሪዎችና መምህራን የሚያሰሙትን ህያው ዜማ በማስቀመጥ ትውፊቱ ሳይቋረጥ እንዲቀጥል እናደርጋለን።',
        },
      ],
    },
    {
      id: 'monasteries',
      name: isEn ? 'Monasteries' : isGez ? 'አድባራት ወገዳማት' : 'ገዳማትና ቅርሶች',
      subtitle: isEn ? 'Historic Sanctuaries' : 'የቅርስ ጥበቃ',
      href: '/churches',
      items: [
        {
          num: '01. ',
          title: isEn ? 'Axum Tsion & The Ark of the Covenant' : 'የአክሱም ጽዮንና የጥንት ገዳማት ታሪክ',
          description: isEn
            ? 'Comprehensive architectural archives of the first Christian kingdom cathedral in Sub-Saharan Africa and its sacred reliquaries.'
            : 'የመጀመሪያዋ የአክሱም ጽዮን ካቴድራል ታሪክ፣ ሥነ-ሕንጻና የቃል ኪዳኑ ታቦት ታሪካዊ መረጃዎችን በዝርዝር ያካተተ ነው።',
        },
        {
          num: '02. ',
          title: isEn ? 'Lalibela Monolithic Rock-Hewn Churches' : 'የሮሃ ላሊበላ ፍልፍል አብያተ ክርስቲያናት',
          description: isEn
            ? '3D photogrammetric architectural scans of the 11 medieval monoliths carved directly into basalt rock in the 12th century.'
            : 'ከአንድ አለት የተፈለፈሉትን ዐሥራ አንዱን የላሊበላ አብያተ ክርስቲያናት በሦስት አቅጣጫ (3D) ቅኝትና ጥናት ይዳስሳል።',
        },
        {
          num: '03. ',
          title: isEn ? 'Debre Damo & Hermit Mountain Monasteries' : 'የደብረ ዳሞና የገዳማውያን ሕይወት ጥናት',
          description: isEn
            ? 'Living records of cliff-perched 6th-century hermitages accessible only by leather rope, preserving isolated monastic libraries.'
            : 'በገመድ ብቻ በሚደረስበት የደብረ ዳሞ አምባ ላይ የሚገኙትን ጥንታዊ መዛግብትና ገዳማዊ ሕይወት የሚያሳይ ዘገባ።',
        },
        {
          num: '04. ',
          title: isEn ? 'Ecclesiastical Frescoes & Iconography' : 'የቅዱሳት ሥዕላትና የሥነ-ቅርፅ ጥበቃ',
          description: isEn
            ? 'Conservation cataloging of mineral-pigment frescoes, processional bronze crosses, and imperial royal crowns.'
            : 'በተፈጥሮ ቀለማት የተሳሉ ጥንታዊ የግድግዳ ሥዕላት፣ የወርቅና የነሐስ መስቀሎች እንዲሁም የነገሥታት አክሊላት ምዝገባ።',
        },
        {
          num: '05. ',
          title: isEn ? 'Global Heritage Registry & Conservation' : 'ዓለም አቀፍ የቅርስ ጥበቃና ፈንድ',
          description: isEn
            ? 'Partnering with international cultural conservancies and patriarchate dioceses to safeguard imperiled monastery treasures.'
            : 'በአደጋ ላይ ያሉ ገዳማትንና ቅርሶችን ለመታደግ ከዓለም አቀፍ የቅርስ ጥበቃ ተቋማት ጋር በቅንጅት የሚሠራ የጥበቃ ፕሮጀክት።',
        },
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState<string>('manuscripts');
  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section className="relative py-24 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F7F5F0]">
      {/* 9 Architectural Vertical Grid Lines */}
      <GridLines count={9} opacity={0.08} />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* ========================================================
            DOOR DENNIS TWO-COLUMN EXPERTISES HEADER
            - Left: Kinetic Title
            - Right: Interactive Category Tabs
            ======================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 sm:pb-16 border-b border-[#201F1E]/10">
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-[#5C5A56] mb-3">
              {isEn ? 'CHAPTER 02 ・ SACRED PILLARS' : isGez ? 'ክፍል ፪ ・ ዐምደ ሃይማኖት' : 'ክፍል ፪ ・ የቤተክርስቲያን ምሰሶዎች'}
            </div>
            <KineticTitle
              plainText={title}
              italicWord={italicWord}
              as="h2"
              className="text-4xl sm:text-5xl lg:text-6xl text-[#201F1E] tracking-tight"
            />
          </div>

          {/* Door Dennis Signature Category Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {categories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`h-11 px-5 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 border select-none cursor-pointer ${
                    isActive
                      ? 'bg-[#201F1E] text-[#F7F5F0] border-[#201F1E] shadow-md scale-[1.02]'
                      : 'bg-[#FAF9F6] text-[#5C5A56] border-[#201F1E]/15 hover:border-[#201F1E]/40 hover:text-[#201F1E]'
                  }`}
                  type="button"
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#C89D3C]' : 'bg-transparent border border-[#5C5A56]/40'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            DOOR DENNIS NUMBERED EXPERTISES SLIDES
            ======================================================== */}
        <div className="mt-12 sm:mt-16">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#201F1E]/10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C89D3C] font-bold">
                {currentCategory.subtitle}
              </span>
              <span className="text-[#201F1E]/20">/</span>
              <span className="text-xs font-mono text-[#5C5A56]">
                {currentCategory.items.length} {isEn ? 'DEPARTMENTS' : 'ክፍላት'}
              </span>
            </div>

            <Link
              href={`/${locale}${currentCategory.href}`}
              className="group inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#201F1E] hover:text-[#C89D3C] transition-colors"
            >
              <span>{isEn ? 'Explore All' : 'ሁሉንም ይጎብኙ'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#C89D3C]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {currentCategory.items.map((item, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-[#FAF9F6] border border-[#201F1E]/10 hover:border-[#201F1E]/30 transition-all duration-300 flex flex-col justify-between group hover:shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-mono text-sm font-extrabold text-[#C89D3C]">
                      {item.num}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#201F1E] group-hover:text-[#C89D3C] transition-colors tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C5A56] leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#201F1E]/5 flex items-center justify-between text-[11px] font-mono text-[#7A7771]">
                  <span>{isEn ? 'Ecclesiastical Core' : 'የቤተክርስቲያን አገልግሎት'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#C89D3C]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            DOOR DENNIS SIGNATURE 8-COLOR DIVIDER BAR
            ======================================================== */}
        <div className="colorDivider" aria-hidden="true">
          <div className="color" />
          <div className="color" />
          <div className="color" />
          <div className="color" />
          <div className="color" />
          <div className="color" />
          <div className="color" />
          <div className="color" />
        </div>
      </div>
    </section>
  );
};
