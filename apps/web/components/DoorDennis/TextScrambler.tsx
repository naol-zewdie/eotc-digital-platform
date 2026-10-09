'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TextScramblerProps {
  text: string;
  automatic?: boolean;
  intervalMs?: number;
  className?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';
}

const SCRAMBLE_SYMBOLS = [
  '✝', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱', '፲',
  'α', 'ω', '✦', '✧', '†', '•', '·', 'x', 'z', 'k', 'm', 'w'
];

export const TextScrambler: React.FC<TextScramblerProps> = ({
  text,
  automatic = false,
  intervalMs = 3500,
  className = '',
  as = 'span',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);

  const triggerScramble = () => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;

    const original = text;
    const length = original.length;
    let iteration = 0;
    const maxIterations = 5;

    const interval = setInterval(() => {
      iteration++;
      const scrambled = original
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '\n') return char;
          if (iteration >= maxIterations || Math.random() < iteration / maxIterations) {
            return char;
          }
          return SCRAMBLE_SYMBOLS[Math.floor(Math.random() * SCRAMBLE_SYMBOLS.length)];
        })
        .join('');

      setDisplayText(scrambled);

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(original);
        isScramblingRef.current = false;
      }
    }, 65);
  };

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    if (!automatic) return;
    const timer = setInterval(() => {
      triggerScramble();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [automatic, intervalMs, text]);

  const Component = as;

  return (
    <Component
      className={`inline-block cursor-default ${className}`}
      onMouseEnter={triggerScramble}
    >
      {displayText}
    </Component>
  );
};
