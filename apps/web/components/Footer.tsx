import React from 'react';
import Link from 'next/link';

export const Footer: React.FC<{ currentLocale?: string }> = ({ currentLocale = 'am' }) => {
  return (
    <footer className="mt-auto border-t border-eotc-gold/25 bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl text-eotc-gold">✝</span>
              <span className="font-bold text-white text-base">EOTC Platform</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ጥንታዊ ቅርሶችን፣ መጻሕፍትን፣ መዝሙራትንና ታሪክን በዲጂታል ቴክኖሎጂ ጠብቆ ለትውልድ የሚያስተላልፍ ይፋዊ መድረክ።
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-eotc-gold mb-3">
              {currentLocale === 'am' ? 'ዲጂታል ማዕከል' : 'Digital Center'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href={`/${currentLocale}/library`} className="hover:text-white transition-colors">{currentLocale === 'am' ? 'ዲጂታል ቤተ መጻሕፍት' : 'Digital Library'}</Link></li>
              <li><Link href={`/${currentLocale}/mezmur`} className="hover:text-white transition-colors">{currentLocale === 'am' ? 'የመዝሙር ማውጫ' : 'Mezmur & Lyrics'}</Link></li>
              <li><Link href={`/${currentLocale}/churches`} className="hover:text-white transition-colors">{currentLocale === 'am' ? 'የአብያተ ክርስቲያናት መመሪያ' : 'Church Directory'}</Link></li>
              <li><Link href={`/${currentLocale}/articles`} className="hover:text-white transition-colors">{currentLocale === 'am' ? 'መንፈሳዊ ጽሑፎች' : 'Spiritual Articles'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-eotc-gold mb-3">
              {currentLocale === 'am' ? 'መረጃና ግልጽነት' : 'Trust & Governance'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-neutral-400">Provenance & Copyright Policy</span></li>
              <li><span className="text-neutral-400">Editorial Review Workflow</span></li>
              <li><span className="text-neutral-400">Church Verification Process</span></li>
              <li><Link href={`/${currentLocale}/donate`} className="hover:text-white transition-colors">{currentLocale === 'am' ? 'የልገሳና ድጋፍ መረጃ' : 'Donations & Transparency'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-eotc-gold mb-3">
              {currentLocale === 'am' ? 'ስርዓት' : 'System'}
            </h4>
            <p className="text-xs text-neutral-400 mb-3">
              Production Architecture v1.0 • Built with Next.js, NestJS, PostgreSQL & S3 Storage.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-800 text-xs text-emerald-400 border border-emerald-900/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Ethiopian Orthodox Tewahedo Church Digital Platform. Free public access.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/admin" className="hover:text-neutral-300">Admin Portal</Link>
            <a href="http://localhost:4000/api/v1/health" target="_blank" rel="noreferrer" className="hover:text-neutral-300">API Health</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
