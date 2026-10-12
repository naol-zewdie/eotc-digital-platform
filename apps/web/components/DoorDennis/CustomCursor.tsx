'use client';

import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop/devices with a mouse (pointer: fine)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentRingX = -100;
    let currentRingY = -100;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, [role="button"], input, .badge-pill, .partner-pill, .dd-project-card');
        setIsHovered(!!interactive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth lerp loop for the outer ring
    const render = () => {
      currentRingX += (targetX - currentRingX) * 0.18;
      currentRingY += (targetY - currentRingY) * 0.18;
      setRingPos({ x: currentRingX, y: currentRingY });
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={isHovered ? 'custom-cursor-hover' : ''} aria-hidden="true">
      {/* Central crisp dot */}
      <div
        className="custom-cursor-dot"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />
      {/* Smooth trailing outer ring */}
      <div
        className="custom-cursor-ring"
        style={{
          left: `${ringPos.x}px`,
          top: `${ringPos.y}px`,
        }}
      />
    </div>
  );
};
