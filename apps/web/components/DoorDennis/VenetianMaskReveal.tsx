'use client';

import React, { useEffect, useState, useRef } from 'react';

interface VenetianMaskRevealProps {
  children: React.ReactNode;
  linesCount?: number;
  className?: string;
  delayMs?: number;
}

export const VenetianMaskReveal: React.FC<VenetianMaskRevealProps> = ({
  children,
  linesCount = 20,
  className = '',
  delayMs = 250,
}) => {
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), delayMs);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={containerRef}
      className={`venetian-mask-wrap ${revealed ? 'revealed' : ''} ${className}`}
    >
      {/* Content / Image */}
      {children}

      {/* 20 to 24 Vertical Blinds Overlay */}
      <div className="venetian-blinds-overlay" aria-hidden="true">
        {Array.from({ length: linesCount }).map((_, i) => {
          const delay = (i * 0.018).toFixed(3);
          return (
            <div
              key={i}
              className="venetian-blind-slit"
              style={{
                transitionDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
