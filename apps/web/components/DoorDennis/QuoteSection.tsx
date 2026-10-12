'use client';

import dynamic from 'next/dynamic';
import { GridLines } from './GridLines';
import { TextScrambler } from './TextScrambler';

const SacredAtmosphereCanvas = dynamic(
  () => import('../SacredAtmosphereCanvas').then((mod) => mod.SacredAtmosphereCanvas),
  { ssr: false }
);

interface QuoteSectionProps {
  quote?: string;
  author?: string;
  role?: string;
  locale?: string;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({
  quote = 'በቅዱሳት መጻሕፍትና በያሬዳዊ ዜማ የታነጸችው ተዋሕዶ እምነታችን፣ ለትውልድ ሁሉ የሚተላለፍ የሕይወትና የብርሃን ቅርስ ናት።',
  author = 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን',
  role = 'ብሔራዊ ቅርስና መዛግብት',
  locale = 'am',
}) => {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center py-28 sm:py-44 px-6 overflow-hidden bg-[#F7F5F0]">
      {/* Three.js Fluted Glass Refraction Canvas (Door Dennis Signature) */}
      <SacredAtmosphereCanvas variant="quote" />

      {/* 9 Architectural Vertical Grid Lines */}
      <GridLines count={9} opacity={0.08} />

      <div className="relative max-w-5xl mx-auto text-center z-10 px-4">
        {/* Editorial Quote matching Screenshot 1 */}
        <blockquote className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#201F1E] leading-[1.2] tracking-tight">
          <p>
            {quote}
          </p>
        </blockquote>

        {/* Monospace Subcaption matching Screenshot 1 */}
        <div className="mt-12 sm:mt-16 flex items-center justify-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-wider text-[#5C5A56]">
          <TextScrambler
            text={author}
            automatic={true}
            intervalMs={4500}
            className="font-semibold text-[#201F1E]"
          />
          <span className="text-[#C89D3C]">・</span>
          <span>{role}</span>
        </div>
      </div>
    </section>
  );
};
