import React from 'react';
import { Newspaper, Calendar, User } from 'lucide-react';

export default function ArticlesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'am';

  const articles = [
    {
      titleAm: 'የዘመነ ጽጌ ትምህርታዊና መንፈሳዊ ምስጢር',
      titleEn: 'The Spiritual Significance of Zemene Tsigie',
      author: 'ቀሲስ ዶ/ር ቴዎድሮስ',
      date: 'ጥቅምት 2026',
      summaryAm: 'በቤተክርስቲያናችን ስርዓት ከመስከረም 26 እስከ ህዳር 6 ያለው ወቅት ዘመነ ጽጌ ተብሎ ይጠራል። በዚህ ወቅት ስለ እመቤታችን ቅድስት ድንግል ማርያምና ስለ ልጇ...',
    },
    {
      titleAm: 'የቅዱስ ያሬድ ዜማ ታሪክና የዜማ ስልቶች',
      titleEn: 'Saint Yared and the Traditions of Sacred Chant',
      author: 'ሊቀ ኅሩያን',
      date: 'መስከረም 2026',
      summaryAm: 'ቅዱስ ያሬድ በ6ኛው ክፍለ ዘመን ሦስቱን የዜማ ስልቶች (ግዕዝ፣ ዕዝል፣ አራራይ) ያዘጋጀበት ጥንታዊ ታሪክና መንፈሳዊ ረቂቅ ፍልስፍና።',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-eotc-gold/30 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-eotc-crimson dark:text-eotc-gold mb-1">
          <Newspaper className="w-4 h-4" />
          <span>{locale === 'am' ? 'ትምህርተ ሃይማኖትና ዜና' : 'Articles & Ecclesiastical News'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold heading-font">
          {locale === 'am' ? 'የተረጋገጡ ጽሑፎችና ወቅታዊ መግለጫዎች' : 'Theological Articles & Verified Publications'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((item, idx) => (
          <article
            key={idx}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{item.author}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.date}</span>
              </span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              {locale === 'am' ? item.titleAm : item.titleEn}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {item.summaryAm}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
