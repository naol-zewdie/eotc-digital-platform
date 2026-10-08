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
    <div className="flex flex-col min-h-screen">
      <Navbar currentLocale={currentLocale} />
      <main className="flex-1">{children}</main>
      <Footer currentLocale={currentLocale} />
    </div>
  );
}
