import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export function generateStaticParams() {
  return [{ locale: 'am' }, { locale: 'gez' }, { locale: 'en' }];
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const currentLocale = params.locale || 'am';

  return (
    <div className="relative flex flex-col min-h-screen bg-[#F7F5F0] text-[#201F1E] selection:bg-[#C89D3C] selection:text-[#F7F5F0]">
      {/* 9 Architectural Continuous Vertical Grid Lines (Exact Door Dennis Structure) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[2] flex justify-between select-none max-w-full overflow-hidden"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="w-[1px] h-full bg-[#201F1E] opacity-[0.07]"
          />
        ))}
      </div>

      <Navbar currentLocale={currentLocale} />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer currentLocale={currentLocale} />
    </div>
  );
}
