'use client';

import React, { useEffect, useState } from 'react';

interface GridLinesProps {
  count?: number;
  opacity?: number;
  className?: string;
}

export const GridLines: React.FC<GridLinesProps> = ({
  count = 9,
  opacity = 0.08,
  className = '',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`architectural-lines ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => {
        // Stagger delays matching Door Dennis cubic-bezier entrance
        const delay = (i * 0.035).toFixed(3);
        return (
          <div
            key={i}
            className="line"
            style={{
              opacity,
              transform: mounted ? 'scaleY(1)' : 'scaleY(0)',
              transitionDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
};
