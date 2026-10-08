import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function EventsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'am';

  const events = [
    {
      titleAm: 'የአቡነ አረጋዊ ዓመታዊ የንግሥ በዓል',
      titleEn: 'Annual Feast of Abuna Aregawi (Debre Damo)',
      date: 'ጥቅምት 14, 2026',
      venue: 'ደብረ ዳሞ ገዳም / በየአድባራቱ',
      descriptionAm: 'ከዘጠኙ ቅዱሳን አንዱ የሆኑት የአቡነ አረጋዊ ዓመታዊ የመታሰቢያ በዓል በድምቀት ይከበራል።',
    },
    {
      titleAm: 'የጥቅምት መድኃኔዓለም ዓመታዊ በዓል',
      titleEn: 'Feast of Medhane Alem (Savior of the World)',
      date: 'ጥቅምት 27, 2026',
      venue: 'በመላው የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ አብያተ ክርስቲያናት',
      descriptionAm: 'የመድኃኔዓለም ክብርና ቸርነት የሚዘከርበት ታላቅ የንግሥ በዓል።',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-eotc-gold/30 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-eotc-crimson dark:text-eotc-gold mb-1">
          <Calendar className="w-4 h-4" />
          <span>{locale === 'am' ? 'ክስተቶችና በዓላት' : 'Ecclesiastical Calendar & Events'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold heading-font">
          {locale === 'am' ? 'የዓመቱ ቅዱሳት በዓላትና ጉባኤያት' : 'Upcoming Liturgical Feasts & Assemblies'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((e, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-3 shadow-sm"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-neutral-800 text-eotc-crimson dark:text-eotc-gold text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{e.date}</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {locale === 'am' ? e.titleAm : e.titleEn}
            </h3>
            <p className="flex items-center gap-1 text-xs text-neutral-500">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{e.venue}</span>
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {e.descriptionAm}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
