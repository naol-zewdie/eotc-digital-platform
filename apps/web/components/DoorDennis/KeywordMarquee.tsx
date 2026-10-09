'use client';

import React from 'react';

interface KeywordMarqueeProps {
  items: string[];
  direction?: 'left' | 'right';
  speedSec?: number;
  className?: string;
}

export const KeywordMarquee: React.FC<KeywordMarqueeProps> = ({
  items,
  direction = 'right',
  speedSec = 35,
  className = '',
}) => {
  const trackClass = direction === 'right' ? 'marquee-track-right' : 'marquee-track-left';

  const renderItemsGroup = (keyPrefix: string) => (
    <div className={`flex items-center gap-6 sm:gap-10 shrink-0 ${trackClass}`} style={{ animationDuration: `${speedSec}s` }}>
      {items.map((item, idx) => (
        <div
          key={`${keyPrefix}-${idx}`}
          className="flex items-center gap-4 sm:gap-6 text-neutral-800 shrink-0"
        >
          <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono">
            {item}
          </span>
          <span className="text-neutral-400 text-xs select-none">✦</span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`relative w-full overflow-hidden border-y border-neutral-300/70 bg-neutral-200/50 py-3.5 sm:py-4.5 select-none ${className}`}
      aria-label="Topics"
    >
      <div className="marquee-container flex">
        {renderItemsGroup('group-1')}
        {renderItemsGroup('group-2')}
        {renderItemsGroup('group-3')}
        {renderItemsGroup('group-4')}
      </div>
    </div>
  );
};
