'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { GridLines } from './GridLines';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BadgeLink {
  label: string;
  href: string;
}

interface BadgeLinkBlockProps {
  links: BadgeLink[];
  className?: string;
}

export const BadgeLinkBlock: React.FC<BadgeLinkBlockProps> = ({
  links,
  className = '',
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className={`relative py-16 sm:py-24 px-4 overflow-hidden bg-[#F7F5F0] ${className}`}>
      {/* 9 Architectural Vertical Grid Lines */}
      <GridLines count={9} opacity={0.07} />

      <div className="relative max-w-6xl mx-auto z-10">
        {/* Desktop View: Centered Badge Group with Dimming Hover */}
        <div className="hidden md:flex badge-group">
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="badge-pill"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile View: Swipeable Slider Track with Arrow Controls (Door Dennis .sliderWrapper) */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#5C5A56]">
              ቅድመ-ዕይታ ・ Quick Inquiries
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollSlider('left')}
                className="w-7 h-7 rounded-lg border border-[#201F1E]/20 flex items-center justify-center text-[#201F1E] active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scrollSlider('right')}
                className="w-7 h-7 rounded-lg border border-[#201F1E]/20 flex items-center justify-center text-[#201F1E] active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth snap-x snap-mandatory"
          >
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="shrink-0 snap-center badge-pill text-xs whitespace-nowrap shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
