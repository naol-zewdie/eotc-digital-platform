'use client';

import React, { useEffect, useState, useRef } from 'react';

interface KineticTitleProps {
  children?: React.ReactNode;
  plainText?: string;
  italicWord?: string;
  afterText?: string;
  as?: 'h1' | 'h2' | 'h3' | 'div';
  className?: string;
}

export const KineticTitle: React.FC<KineticTitleProps> = ({
  plainText = '',
  italicWord = '',
  afterText = '',
  as = 'h1',
  className = '',
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const Component = as;

  let globalCharIndex = 0;

  const renderWords = (text: string, isItalic = false) => {
    const words = text.split(' ');
    return words.map((word, wIdx) => {
      const chars = word.split('');
      return (
        <span
          key={`${word}-${wIdx}`}
          className={`inline-block whitespace-nowrap ${isItalic ? 'italic' : ''}`}
          style={{ marginRight: '0.28em' }}
        >
          {chars.map((char, cIdx) => {
            const delay = (globalCharIndex * 0.022).toFixed(3);
            globalCharIndex++;
            return (
              <span
                key={cIdx}
                className="inline-block transition-all duration-700 ease-out"
                style={{
                  transform: inView
                    ? 'translateY(0) scale(1) rotateY(0deg)'
                    : 'translateY(-0.4em) scale(0.7) rotateY(-80deg)',
                  filter: inView ? 'blur(0)' : 'blur(8px)',
                  opacity: inView ? 1 : 0,
                  transitionDelay: `${delay}s`,
                  display: 'inline-block',
                  perspective: '1000px',
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      );
    });
  };

  return (
    <Component
      ref={ref as any}
      className={`hugeTitle ${className}`}
    >
      {plainText && renderWords(plainText, false)}
      {italicWord && <em>{renderWords(italicWord, true)}</em>}
      {afterText && renderWords(afterText, false)}
    </Component>
  );
};
