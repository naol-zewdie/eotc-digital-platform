import React from 'react';
import { Music, Search, Disc3, ShieldCheck } from 'lucide-react';

export default function MezmurPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'am';

  const mezmurs = [
    {
      titleAm: 'በስመ አብ ወወልድ',
      titleEn: 'Besime Ab Weweld',
      artist: 'ሊቀ መዘምራን ቴዎድሮስ ዮሴፍ',
      category: 'የዘመነ ጽጌ',
      rights: 'CHURCH_OWNED',
      lyricsAm: 'በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን። ቅድስት ሥላሴ ክብር ምስጋና ይግባችሁ...',
    },
    {
      titleAm: 'ክነፈ ርግብ',
      titleEn: 'Kinefe Rigb',
      artist: 'የደብረ ሰላም መድኃኔዓለም ሰንበት ትምህርት ቤት',
      category: 'የእመቤታችን',
      rights: 'PERMISSION_GRANTED',
      lyricsAm: 'ክነፈ ርግብ በብሩር ዘግቡር ወገበዋቲሃኒ በሐመልማለ ወርቅ...',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-eotc-gold/30 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-eotc-crimson dark:text-eotc-gold mb-1">
          <Music className="w-4 h-4" />
          <span>{locale === 'am' ? 'የመዝሙር ማውጫ' : 'Mezmur & Lyrics Repository'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold heading-font">
          {locale === 'am' ? 'የቅዱሳት ዜማዎችና የመዝሙር ግጥሞች ማኅደር' : 'Liturgical Chants & Mezmur Hymns'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mezmurs.map((m, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-900 dark:bg-neutral-800 dark:text-eotc-gold">
                {m.category}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{m.rights}</span>
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {locale === 'am' ? m.titleAm : m.titleEn}
              </h3>
              <p className="text-xs text-neutral-500">{m.artist}</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 text-xs text-neutral-700 dark:text-neutral-300 font-serif leading-relaxed italic border border-neutral-200 dark:border-neutral-800">
              {m.lyricsAm}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
