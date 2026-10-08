import React from 'react';
import Link from 'next/link';
import { BookOpen, Music, Church, Calendar, Newspaper, ArrowRight, ShieldCheck, Heart, Sparkles, Globe, DownloadCloud } from 'lucide-react';

interface HomePageProps {
  params: { locale: string };
}

export default function HomePage({ params }: HomePageProps) {
  const locale = params.locale || 'am';

  const translations = {
    am: {
      badge: 'ይፋዊ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ዲጂታል ማዕከል',
      heroTitle1: 'የቅድስት ቤተክርስቲያን መንፈሳዊና',
      heroTitle2: 'ታሪካዊ ቅርሶች በዲጂታል ዓለም',
      heroSubtitle:
        'ጥንታዊ መጻሕፍትን፣ ቅዱሳት ዜማዎችንና መዝሙራትን፣ የአብያተ ክርስቲያናት መመሪያንና አስተማማኝ ትምህርቶችን በአንድ ቦታ በነጻ ያግኙ።',
      searchPlaceholder: 'መጻሕፍት፣ መዝሙር፣ አድባራትና ገዳማት ይፈልጉ...',
      searchBtn: 'ፈልግ',
      domainsTitle: 'ዋና ዋና አገልግሎቶች',
      domainsSubtitle: 'የቤተክርስቲያኗን መንፈሳዊ ሃብት በቀላሉ የሚያገኙባቸው ዘርፎች',
      statsBooks: 'ዲጂታል መጻሕፍት',
      statsMezmur: 'የመዝሙር ግጥሞች',
      statsChurches: 'አድባራትና ገዳማት',
      statsLanguages: 'ቋንቋዎች (ግዕዝ፣ አማርኛ፣ እንግሊዝኛ)',
      learnMore: 'ተጨማሪ ይመልከቱ',
    },
    gez: {
      badge: 'ማኅደር ዲጂታል ዘኦርቶዶክሳዊት ተዋሕዶ ቤተ ክርስቲያን ዘኢትዮጵያ',
      heroTitle1: 'መንፈሳዊ ወታሪካዊ ቅርስ',
      heroTitle2: 'ዘቅድስት ቤተ ክርስቲያን',
      heroSubtitle:
        'መጻሕፍት ጥንታውያን፣ ማኅሌታት ወመዛሙር፣ ዜና አድባራት ወገዳማት በነጻ ይትረከብ።',
      searchPlaceholder: 'ኅሥሥ መጻሕፍተ፣ መዛሙረ ወአድባራተ...',
      searchBtn: 'ኅሥሥ',
      domainsTitle: 'አዕማደ አገልግሎት',
      domainsSubtitle: 'ሃብተ መንፈስ ዘቤተ ክርስቲያን',
      statsBooks: 'መጻሕፍት',
      statsMezmur: 'መዛሙር',
      statsChurches: 'አድባራት ወገዳማት',
      statsLanguages: 'ልሳናት',
      learnMore: 'ርኢ ፈድፋደ',
    },
    en: {
      badge: 'Official EOTC Digital Platform & Heritage Archive',
      heroTitle1: 'Preserving Sacred Heritage &',
      heroTitle2: 'Knowledge for the Global Church',
      heroSubtitle:
        'Freely explore verified liturgical texts, ancient Ge\'ez manuscripts, Mezmur lyrics, church directory, and orthodox teachings.',
      searchPlaceholder: 'Search books, mezmurs, monasteries, articles...',
      searchBtn: 'Search',
      domainsTitle: 'Core Digital Services',
      domainsSubtitle: 'Open, verified, and preserved for future generations',
      statsBooks: 'Preserved Manuscripts',
      statsMezmur: 'Mezmur & Lyrics',
      statsChurches: 'Monasteries & Parishes',
      statsLanguages: 'Supported Languages (Amharic, Ge\'ez, English)',
      learnMore: 'Explore',
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  const services = [
    {
      title: locale === 'am' ? 'ዲጂታል ቤተ መጻሕፍት' : locale === 'gez' ? 'ቤተ መጻሕፍት' : 'Digital Library',
      desc:
        locale === 'am'
          ? 'የግዕዝ እና የአማርኛ ጥንታዊ መጻሕፍት፣ ድርሳናት፣ ተአምራት እና የጸሎት መጻሕፍት በነጻ አንባቢና ማውረጃ።'
          : 'Liturgical books, ancient Geez manuscripts, prayers, and scholarly publications with in-browser reader.',
      icon: BookOpen,
      href: `/${locale}/library`,
      accent: 'from-amber-600 to-amber-800',
      badge: 'PDF / Text',
    },
    {
      title: locale === 'am' ? 'የመዝሙር ማውጫ' : locale === 'gez' ? 'መዛሙር' : 'Mezmur & Lyrics',
      desc:
        locale === 'am'
          ? 'የዘመነ ጽጌ፣ ፋሲካ፣ መስቀል እና በዓላት መዝሙራት ከግጥሞቻቸው እና ከተፈቀዱ የድምፅ ማጣቀሻዎች ጋር።'
          : 'Categorized hymnody, lyrics, choir profiles, and liturgical chants across seasons and feasts.',
      icon: Music,
      href: `/${locale}/mezmur`,
      accent: 'from-eotc-crimson to-red-900',
      badge: 'Lyrics & Audio',
    },
    {
      title: locale === 'am' ? 'የአብያተ ክርስቲያናት መመሪያ' : locale === 'gez' ? 'አድባራት ወገዳማት' : 'Church Directory',
      desc:
        locale === 'am'
          ? 'በሀገር ውስጥና በመላው ዓለም የሚገኙ አድባራት፣ ገዳማት፣ አድራሻዎች፣ ታሪካዊ መረጃዎችና አገልግሎቶች።'
          : 'Verified profiles of historical monasteries and diaspora churches with locations and contacts.',
      icon: Church,
      href: `/${locale}/churches`,
      accent: 'from-emerald-700 to-green-900',
      badge: 'Verified Parishes',
    },
    {
      title: locale === 'am' ? 'ትምህርተ ሃይማኖትና ዜና' : locale === 'gez' ? 'ትምህርት ወዜና' : 'Articles & News',
      desc:
        locale === 'am'
          ? 'በሊቃውንተ ቤተክርስቲያን የተረጋገጡ ትምህርቶች፣ ወቅታዊ የቤተክርስቲያን መግለጫዎችና ዜናዎች።'
          : 'Theologically reviewed educational articles, patristic writings, and verified ecclesiastical news.',
      icon: Newspaper,
      href: `/${locale}/articles`,
      accent: 'from-blue-700 to-indigo-900',
      badge: 'Editorial Trust',
    },
    {
      title: locale === 'am' ? 'ክስተቶችና ቅዱሳት በዓላት' : locale === 'gez' ? 'በዓላት' : 'Feasts & Events',
      desc:
        locale === 'am'
          ? 'የቀን መቁጠሪያ፣ የዓመቱ አጽዋማትና በዓላት፣ የንግሥና ጉባኤያት መርሃ-ግብር።'
          : 'Liturgical calendar, upcoming feast days, annual pilgrimages, and parish gatherings.',
      icon: Calendar,
      href: `/${locale}/events`,
      accent: 'from-purple-700 to-indigo-950',
      badge: 'Liturgical Calendar',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-eotc-gold/20 bg-gradient-to-b from-amber-500/10 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-eotc-gold/15 border border-eotc-gold/40 text-eotc-crimson dark:text-eotc-gold text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 max-w-4xl mx-auto leading-tight heading-font">
            <span>{t.heroTitle1}</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-eotc-crimson via-red-700 to-eotc-gold">
              {t.heroTitle2}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
            {t.heroSubtitle}
          </p>

          {/* Global Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <form action={`/${locale}/search`} method="GET" className="relative flex items-center shadow-lg rounded-2xl overflow-hidden glass-panel border border-eotc-gold/50">
              <input
                type="text"
                name="q"
                placeholder={t.searchPlaceholder}
                className="w-full py-4 pl-5 pr-28 bg-transparent text-sm sm:text-base outline-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-eotc-crimson text-white hover:bg-eotc-crimson-light text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>{t.searchBtn}</span>
              </button>
            </form>
          </div>

          {/* Key Trust Pillars */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
              <div className="text-xl font-bold text-eotc-crimson dark:text-eotc-gold">100% Free</div>
              <div className="text-xs text-neutral-500">{t.statsBooks}</div>
            </div>
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
              <div className="text-xl font-bold text-eotc-crimson dark:text-eotc-gold">Verified</div>
              <div className="text-xs text-neutral-500">{t.statsChurches}</div>
            </div>
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
              <div className="text-xl font-bold text-eotc-crimson dark:text-eotc-gold">Tri-Lingual</div>
              <div className="text-xs text-neutral-500">ግዕዝ • አማርኛ • English</div>
            </div>
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
              <div className="text-xl font-bold text-eotc-crimson dark:text-eotc-gold">Rights Tracked</div>
              <div className="text-xs text-neutral-500">Strict Provenance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white heading-font">
            {t.domainsTitle}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            {t.domainsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className="group relative flex flex-col p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-xl hover:border-eotc-gold/60 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.accent} text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-eotc-crimson dark:group-hover:text-eotc-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">
                  {item.desc}
                </p>
                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-eotc-crimson dark:text-eotc-gold">
                  <span>{t.learnMore}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}

          {/* Support / Stewardship Card */}
          <div className="flex flex-col p-6 rounded-2xl border border-eotc-gold/40 bg-gradient-to-br from-amber-50/50 via-white to-amber-100/30 dark:from-neutral-900 dark:to-neutral-950 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-eotc-gold to-amber-600 text-neutral-950 shadow-md">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-200/60 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
                Non-Profit
              </span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
              {locale === 'am' ? 'የቤተክርስቲያንን ቅርስ ይደግፉ' : 'Support Heritage Preservation'}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">
              {locale === 'am'
                ? 'ይህ መድረክ ከክፍያ ነፃ ነው። ልገሳዎ የብራና መጻሕፍት ቅኝትን፣ ዲጂታላይዜሽንንና የቴክኖሎጂ አገልግቱን ለመጠበቅ ይውላል።'
                : '100% free and open. Voluntary gifts directly fund ancient manuscript digitisation, server hosting, and research development.'}
            </p>
            <div className="mt-5 pt-4 border-t border-amber-200/40 dark:border-neutral-800">
              <Link
                href={`/${locale}/donate`}
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-eotc-gold text-neutral-950 text-xs font-bold hover:brightness-105 transition-all shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{locale === 'am' ? 'በልገሳ ይደግፉ' : 'Make a Contribution'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Governance & Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 text-white border border-eotc-gold/30 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-eotc-gold">
                <ShieldCheck className="w-4 h-4" />
                <span>Content Provenance & Rights Governance (Section 14)</span>
              </div>
              <h3 className="text-2xl font-bold heading-font">
                {locale === 'am' ? 'የተረጋገጠ መንፈሳዊ አስተምህሮና የቅርስ ጥበቃ' : 'Faithful Stewardship & Verified Authorship'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
                Every published manuscript, prayer book, and Mezmur entry carries an immutable RightsRecord, source attribution, and multi-tier reviewer approval.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin"
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-all border border-neutral-700"
              >
                Editorial Portal
              </Link>
              <Link
                href={`/${locale}/library`}
                className="px-5 py-2.5 rounded-xl bg-eotc-gold hover:brightness-105 text-xs font-bold text-neutral-950 transition-all"
              >
                Browse Archive
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
