'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { DoorDennisButton } from './DoorDennis/DoorDennisButton';
import { GridLines } from './DoorDennis/GridLines';
import { Model3DViewer } from './DoorDennis/Model3DViewer';

interface NavbarProps {
  currentLocale?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLocale = 'am' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isEn = currentLocale === 'en';
  const isGez = currentLocale === 'gez';

  // Navigation Items formatted matching Door Dennis Header Pills
  const navItems = [
    {
      href: `/${currentLocale}`,
      label: isGez ? 'መቅድም' : isEn ? 'HOME' : 'መነሻ',
      exact: true,
    },
    {
      href: `/${currentLocale}/articles`,
      label: isGez ? 'ትውፊት' : isEn ? 'ABOUT' : 'ስለ እኛ',
    },
    {
      href: `/${currentLocale}/library`,
      label: isGez ? 'መዛግብት' : isEn ? 'WERK' : 'መዛግብት',
      count: isEn ? '34' : '፫፬',
    },
    {
      href: `/${currentLocale}/mezmur`,
      label: isGez ? 'ማኅሌት' : isEn ? 'SERVICES' : 'አገልግሎት',
    },
    {
      href: `/${currentLocale}/churches`,
      label: isGez ? 'ገዳማት' : isEn ? 'SANCTUARIES' : 'ገዳማት',
    },
    {
      href: `/${currentLocale}/contact`,
      label: isGez ? 'ተራክቦ' : isEn ? 'CONTACT' : 'ግንኙነት',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#F7F5F0]/85 backdrop-blur-md border-b border-[#201F1E]/10 transition-all duration-300">
        {/* 9 Architectural Lines passing through Header */}
        <GridLines count={9} opacity={0.06} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-20">
            {/* Left: EOTC Monogram & Logo Wordmark */}
            <Link
              href={`/${currentLocale}`}
              className="flex items-center gap-3 group text-[#201F1E]"
              title="Ethiopian Orthodox Tewahedo Church"
            >
              <div className="relative w-11 h-11 rounded-xl bg-[#201F1E] text-[#F7F5F0] overflow-hidden flex items-center justify-center font-serif text-xl font-bold group-hover:scale-105 transition-transform shadow-sm border border-[#201F1E]/20">
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  <Model3DViewer
                    modelUrl="/hl._joachim.glb"
                    className="w-full h-full"
                    autoRotateSpeed={0.015}
                    scaleMultiplier={1.4}
                    interactive={false}
                    cameraDistance={2.6}
                    showShadows={false}
                    ambientIntensity={2.0}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-sm sm:text-base font-serif uppercase text-[#201F1E]">
                  {isEn ? 'EOTC PATRIARCHATE' : isGez ? 'ተዋሕዶ ቤተክርስቲያን' : 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ'}
                </span>
                <span className="text-[10px] text-[#5C5A56] font-mono uppercase tracking-wider">
                  {isEn ? 'DIGITAL ARCHIVE PLATFORM' : isGez ? 'ብሔራዊ ዲጂታል መዝገብ' : 'ብሔራዊ ዲጂታል መድረክ'}
                </span>
              </div>
            </Link>

            {/* Right: Signature Door Dennis Outline Pills & Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Rounded Rectangular Navigation Pills matching Screenshot 1 & 2 */}
              <nav className="hidden lg:flex items-center gap-2">
                {navItems.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`h-9 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1 border ${
                        isActive
                          ? 'border-[#C89D3C] text-[#C89D3C] bg-[#C89D3C]/5 shadow-sm'
                          : 'border-[#201F1E]/20 text-[#201F1E] hover:border-[#201F1E] hover:bg-[#201F1E]/5'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.count && (
                        <sup className="text-[9px] font-mono ml-0.5 font-bold">
                          {item.count}
                        </sup>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Language Switcher in matching clean pill style */}
              <div className="hidden sm:flex items-center border border-[#201F1E]/20 rounded-xl p-0.5 text-[11px] font-mono font-bold bg-[#FAF9F6]">
                <Link
                  href="/am"
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    currentLocale === 'am'
                      ? 'bg-[#201F1E] text-[#F7F5F0]'
                      : 'text-[#5C5A56] hover:text-[#201F1E]'
                  }`}
                >
                  አማ
                </Link>
                <Link
                  href="/gez"
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    currentLocale === 'gez'
                      ? 'bg-[#201F1E] text-[#F7F5F0]'
                      : 'text-[#5C5A56] hover:text-[#201F1E]'
                  }`}
                >
                  ግዕዝ
                </Link>
                <Link
                  href="/en"
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    currentLocale === 'en'
                      ? 'bg-[#201F1E] text-[#F7F5F0]'
                      : 'text-[#5C5A56] hover:text-[#201F1E]'
                  }`}
                >
                  EN
                </Link>
              </div>

              {/* Search Icon */}
              <Link
                href={`/${currentLocale}/search`}
                className="w-9 h-9 rounded-xl border border-[#201F1E]/20 flex items-center justify-center text-[#201F1E] hover:border-[#201F1E] hover:bg-[#201F1E]/5 transition-all"
                title="Search Archives"
                aria-label="Search Archives"
              >
                <Search className="w-3.5 h-3.5" />
              </Link>

              {/* Signature Door Dennis Dark Hamburger Button (matching Screenshot 1 & 2) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-xl bg-[#201F1E] text-[#F7F5F0] flex flex-col items-center justify-center gap-1.5 shadow-sm hover:bg-[#33312E] transition-all"
                aria-label="Toggle navigation drawer"
              >
                <span className="w-4 h-[2px] bg-[#F7F5F0] rounded-full transition-transform" />
                <span className="w-4 h-[2px] bg-[#F7F5F0] rounded-full transition-transform" />
                <span className="w-4 h-[2px] bg-[#F7F5F0] rounded-full transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen Overlay Navigation Drawer (Matching Door Dennis #menu.menu) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#F7F5F0] flex flex-col justify-between p-6 sm:p-12 overflow-y-auto animate-fadeIn">
          {/* Top Bar of Drawer */}
          <div className="flex items-center justify-between border-b border-[#201F1E]/10 pb-6">
            <Link
              href={`/${currentLocale}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#201F1E] text-[#F7F5F0] flex items-center justify-center font-serif text-xl font-bold">
                ✝
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold uppercase text-base text-[#201F1E]">
                  {isEn ? 'EOTC PATRIARCHATE' : 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ'}
                </span>
                <span className="text-[10px] font-mono text-[#5C5A56] uppercase tracking-wider">
                  {isEn ? 'DIGITAL ARCHIVE PLATFORM' : 'ብሔራዊ ዲጂታል መድረክ'}
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-xl bg-[#201F1E] text-[#F7F5F0] flex items-center justify-center hover:bg-[#33312E] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Door Dennis Dual-Column Menu Body */}
          <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Col (Span 8): Large Nav Items */}
            <div className="lg:col-span-8 space-y-3">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <div key={item.href} className="group">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`inline-flex items-baseline gap-4 text-3xl sm:text-5xl lg:text-6xl font-serif uppercase tracking-tight py-1.5 transition-colors ${
                        isActive
                          ? 'text-[#C89D3C]'
                          : 'text-[#201F1E] group-hover:text-[#C89D3C]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.count && (
                        <span className="text-sm sm:text-base font-mono text-[#5C5A56] font-normal">
                          {item.count}
                        </span>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Right Col (Span 4): Door Dennis Action Card */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#FAF9F6] border border-[#201F1E]/10 space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-[#5C5A56]">
                  {isEn ? 'PATRIARCHATE INITIATIVE' : 'የቅርስ ጥበቃ አደራ'}
                </div>
                <p className="text-sm text-[#5C5A56] leading-relaxed">
                  {isEn
                    ? 'Preserving ancient Ge\'ez parchments and Saint Yared\'s chant legacy freely for all generations.'
                    : 'ጥንታዊ የብራና መጻሕፍትንና ያሬዳዊ ዜማዎችን በዘመናዊ ጥራት ለትውልድ ማቆየት የሁላችንም ቅዱስ ኃላፊነት ነው።'}
                </p>
              </div>

              <div>
                <DoorDennisButton
                  href={`/${currentLocale}/donate`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C89D3C] animate-pulse" />
                    <span>{isEn ? 'Support Archives' : 'ቅርሶቹን ይደግፉ'}</span>
                  </span>
                </DoorDennisButton>
              </div>

              {/* Language Switcher in Drawer */}
              <div className="pt-4 border-t border-[#201F1E]/10">
                <span className="block text-xs font-mono uppercase text-[#5C5A56] mb-2.5">
                  ቋንቋ / Language:
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href="/am"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold ${
                      currentLocale === 'am'
                        ? 'bg-[#201F1E] text-[#F7F5F0] border-[#201F1E]'
                        : 'border-[#201F1E]/20 text-[#201F1E]'
                    }`}
                  >
                    አማርኛ
                  </Link>
                  <Link
                    href="/gez"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold ${
                      currentLocale === 'gez'
                        ? 'bg-[#201F1E] text-[#F7F5F0] border-[#201F1E]'
                        : 'border-[#201F1E]/20 text-[#201F1E]'
                    }`}
                  >
                    ግዕዝ
                  </Link>
                  <Link
                    href="/en"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold ${
                      currentLocale === 'en'
                        ? 'bg-[#201F1E] text-[#F7F5F0] border-[#201F1E]'
                        : 'border-[#201F1E]/20 text-[#201F1E]'
                    }`}
                  >
                    English
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Door Dennis Signature bottomCols */}
          <div className="pt-8 border-t border-[#201F1E]/10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
            <div className="flex items-center gap-4 text-[#5C5A56]">
              <span className="hover:text-[#201F1E] cursor-pointer">Instagram</span>
              <span>・</span>
              <span className="hover:text-[#201F1E] cursor-pointer">YouTube / EOTC TV</span>
              <span>・</span>
              <span className="hover:text-[#201F1E] cursor-pointer">Telegram</span>
            </div>

            <div className="flex flex-col sm:items-end gap-1 text-[#5C5A56]">
              <a
                href="mailto:heritage@eotc-archive.org"
                className="hover:text-[#C89D3C] transition-colors"
              >
                heritage@eotc-archive.org
              </a>
              <span className="text-[11px] text-[#7A7771]">
                +251 11 123 4567 ・ Addis Ababa, Ethiopia
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
