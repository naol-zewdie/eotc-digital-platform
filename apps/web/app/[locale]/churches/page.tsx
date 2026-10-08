import React from 'react';
import { Church, MapPin, CheckCircle, ExternalLink } from 'lucide-react';

export default function ChurchesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'am';

  const churches = [
    {
      nameAm: 'ደብረ ሊባኖስ ገዳም',
      nameEn: 'Debre Libanos Monastery',
      location: 'ሰሜን ሸዋ, ኢትዮጵያ',
      founded: '13ኛው ክፍለ ዘመን',
      verified: true,
      descriptionAm: 'በአቡነ ተክለ ሃይማኖት የተመሠረተ ታሪካዊ ገዳም እና የመንፈሳዊ ትምህርት ማዕከል።',
      slug: 'debre-libanos',
    },
    {
      nameAm: 'የአክሱም ጽዮን ማርያም ካቴድራል',
      nameEn: 'Axum Tsion Maryam Cathedral',
      location: 'ትግራይ, አክሱም',
      founded: '4ኛው ክፍለ ዘመን',
      verified: true,
      descriptionAm: 'የታቦተ ጽዮን ማደሪያ እና ጥንታዊቷ የኢትዮጵያ መንፈሳዊ ማዕከል።',
      slug: 'axum-tsion',
    },
    {
      nameAm: 'ደብረ ሮሃ ቅዱስ ላሊበላ አብያተ ክርስቲያናት',
      nameEn: 'Lalibela Rock-Hewn Churches',
      location: 'ላሊበላ, ወሎ',
      founded: '12ኛው ክፍለ ዘመን',
      verified: true,
      descriptionAm: 'በዓለም ቅርስነት የተመዘገቡ ከአንድ ድንጋይ የተፈለፈሉ አስራ አንድ ቅዱሳት አብያተ ክርስቲያናት።',
      slug: 'lalibela-churches',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-eotc-gold/30 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-eotc-crimson dark:text-eotc-gold mb-1">
          <Church className="w-4 h-4" />
          <span>{locale === 'am' ? 'የአብያተ ክርስቲያናት መመሪያ' : 'Global Church Directory'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold heading-font">
          {locale === 'am' ? 'ታሪካዊ አድባራት፣ ገዳማትና አጥቢያ አብያተ ክርስቲያናት' : 'Historical Monasteries & Dioceses'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {churches.map((church) => (
          <div
            key={church.slug}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{locale === 'am' ? 'የተረጋገጠ መገለጫ' : 'Verified'}</span>
              </span>
              <span className="text-[11px] text-neutral-400">{church.founded}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {locale === 'am' ? church.nameAm : church.nameEn}
              </h3>
              <p className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{church.location}</span>
              </p>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {church.descriptionAm}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
