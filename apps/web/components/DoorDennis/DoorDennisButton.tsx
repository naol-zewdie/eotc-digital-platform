'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface DoorDennisButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'solid' | 'ghost';
  className?: string;
  title?: string;
  target?: string;
}

export const DoorDennisButton: React.FC<DoorDennisButtonProps> = ({
  href,
  onClick,
  children,
  variant = 'solid',
  className = '',
  title,
  target,
}) => {
  const isGhost = variant === 'ghost';
  const baseClass = isGhost ? 'dd-button-ghost' : 'dd-button';

  const content = (
    <>
      <span className="arrows" aria-hidden="true">
        <ArrowUpRight className="w-4 h-4 arrow-icon-1" strokeWidth={2.4} />
        <ArrowUpRight className="w-4 h-4 arrow-icon-2" strokeWidth={2.4} />
      </span>
      <span className="innerText">
        <span className="innerLabels">
          <span className="innerLabel innerLabel-main">{children}</span>
          <span className="innerLabel innerLabel-clone" aria-hidden="true">
            {children}
          </span>
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClass} ${className}`}
        title={title}
        target={target}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${className}`}
      title={title}
      type="button"
    >
      {content}
    </button>
  );
};
