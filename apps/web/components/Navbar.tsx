'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Music, Church, Calendar, Newspaper, Search, Heart, Menu, X, Shield } from 'lucide-react';

interface NavbarProps {
  currentLocale?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLocale = 'am' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${currentLocale}/library`, labelEn: 'Library', labelAm: 'መጻሕፍት ቤት', icon: BookOpen },
    { href: `/${currentLocale}/mezmur`, labelEn: 'Mezmur', labelAm: 'መዝሙር', icon: Music },
    { href: `/${currentLocale}/churches`, labelEn: 'Churches', labelAm: 'አብያተ ክርስቲያናት', icon: Church },
    { href: `/${currentLocale}/articles`, labelEn: 'Articles & News', labelAm: 'ትምህርተ ሃይማኖትና ዜና', icon: Newspaper },
    { href: `/${currentLocale}/events`, labelEn: 'Events', labelAm: 'ክስተቶችና በዓላት', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-eotc-gold/30 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Platform Name */}
          <Link href={`/${currentLocale}`} className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-eotc-crimson to-eotc-crimson-dark flex items-center justify-center text-eotc-gold shadow-md border border-eotc-gold/40 group-hover:scale-105 transition-transform">
              <span className="heading-font text-2xl font-bold tracking-wider">✝</span>
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-eotc-crimson dark:text-eotc-gold flex items-center gap-2">
                <span>EOTC Digital Platform</span>
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 ethiopic-font font-medium">
                የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ዲጂታል መድረክ
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-2 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-eotc-crimson dark:hover:text-eotc-gold hover:bg-eotc-gold/10 transition-colors flex items-center gap-1.5"
                >
                  <Icon className="w-4 h-4 opacity-75" />
                  <span>{currentLocale === 'am' ? item.labelAm : item.labelEn}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions & Locale switcher */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={`/${currentLocale}/search`}
              className="p-2.5 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Search / ፈልግ"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Locale selector */}
            <div className="flex items-center border border-eotc-gold/40 rounded-full text-xs font-semibold overflow-hidden p-0.5 bg-neutral-50 dark:bg-neutral-900">
              <Link
                href="/am"
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  currentLocale === 'am' ? 'bg-eotc-crimson text-white shadow-sm' : 'text-neutral-600 hover:text-black dark:text-neutral-400'
                }`}
              >
                አማ
              </Link>
              <Link
                href="/gez"
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  currentLocale === 'gez' ? 'bg-eotc-crimson text-white shadow-sm' : 'text-neutral-600 hover:text-black dark:text-neutral-400'
                }`}
              >
                ግዕዝ
              </Link>
              <Link
                href="/en"
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  currentLocale === 'en' ? 'bg-eotc-crimson text-white shadow-sm' : 'text-neutral-600 hover:text-black dark:text-neutral-400'
                }`}
              >
                EN
              </Link>
            </div>

            <Link
              href={`/${currentLocale}/donate`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-eotc-gold to-amber-500 text-neutral-950 hover:brightness-105 shadow-sm transition-all"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{currentLocale === 'am' ? 'ይደግፉ' : 'Support / Donate'}</span>
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-eotc-crimson border border-neutral-300 dark:border-neutral-700 rounded-md transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href={`/${currentLocale}/search`}
              className="p-2 rounded-full text-neutral-700 dark:text-neutral-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-eotc-gold/20 bg-background/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3">
          <div className="flex justify-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <Link href="/am" className="px-3 py-1 text-xs rounded-full bg-neutral-200 dark:bg-neutral-800">አማርኛ</Link>
            <Link href="/gez" className="px-3 py-1 text-xs rounded-full bg-neutral-200 dark:bg-neutral-800">ግዕዝ</Link>
            <Link href="/en" className="px-3 py-1 text-xs rounded-full bg-neutral-200 dark:bg-neutral-800">English</Link>
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Icon className="w-5 h-5 text-eotc-crimson dark:text-eotc-gold" />
                <span>{currentLocale === 'am' ? item.labelAm : item.labelEn}</span>
              </Link>
            );
          })}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href={`/${currentLocale}/donate`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-eotc-gold text-black font-semibold text-sm"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>{currentLocale === 'am' ? 'ይደግፉ' : 'Support / Donate'}</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-400"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal / የቁጥጥር ማዕከል</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
