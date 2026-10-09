'use client';

import React from 'react';
import Link from 'next/link';
import { GridLines } from './GridLines';

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
  return (
    <section className={`relative py-16 sm:py-24 px-4 overflow-hidden ${className}`}>
      {/* 9 Architectural Vertical Grid Lines */}
      <GridLines count={9} opacity={0.07} />

      <div className="relative max-w-5xl mx-auto z-10">
        <div className="badge-group">
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
      </div>
    </section>
  );
};
