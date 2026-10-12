'use client';

import React from 'react';

interface ReviewItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  stars: number;
}

interface ReviewsMarqueeProps {
  locale?: string;
}

export const ReviewsMarquee: React.FC<ReviewsMarqueeProps> = ({ locale = 'am' }) => {
  const isEn = locale === 'en';

  const reviews: ReviewItem[] = isEn
    ? [
        {
          id: '1',
          name: 'Megabe Hadis Eshetu',
          role: 'Member of the Ecclesiastical Council',
          quote: 'This digital platform is a historic achievement, ensuring ancient parchment manuscripts are preserved without distortion for posterity.',
          stars: 5,
        },
        {
          id: '2',
          name: 'Abba Gebre Selassie',
          role: 'Abbot, Debre Damo Monastery',
          quote: 'It offers the world an open window to our ancient heritage while safeguarding our remote mountaintop monastic treasures.',
          stars: 5,
        },
        {
          id: '3',
          name: 'Dr. Yared Gebremedhin',
          role: 'Ge\'ez Philology & Archival Scholar',
          quote: 'An unparalleled digital repository offering high-fidelity manuscript folios for international patristic research.',
          stars: 5,
        },
        {
          id: '4',
          name: 'Deacon Yohannes',
          role: 'Holy Trinity Theological University',
          quote: 'An invaluable ecclesiastical resource for learning Saint Yared\'s musical modes and authentic liturgical rubrics.',
          stars: 5,
        },
      ]
    : [
        {
          id: '1',
          name: 'መጋቤ ሐዲስ እሸቱ',
          role: 'የሊቃውንት ጉባኤ አባል',
          quote: 'ይህ የዲጂታል መድረክ ጥንታውያኑን የብራና መጻሕፍት ለትውልድ ሳያዛንፍ ለማስተላለፍ የተሠራ ታላቅ ታሪካዊ ሥራ ነው።',
          stars: 5,
        },
        {
          id: '2',
          name: 'አባ ገብረ ሥላሴ',
          role: 'የደብረ ዳሞ ገዳም አበምኔት',
          quote: 'የገዳማችንን ጥንታዊ ቅርሶች ዓለም እንዲያውቃቸውና ተጠብቀው እንዲቆዩ ትልቅ ዕድል ከፍቷል።',
          stars: 5,
        },
        {
          id: '3',
          name: 'ዶ/ር ያሬድ ገብረ መድኅን',
          role: 'የግዕዝ ሥነ-ጽሑፍ ተመራማሪ',
          quote: 'የማኑስክሪፕት ጥናትን በዲጂታል ጥራት ለማግኘት ወደር የሌለው ዘመናዊና የተሟላ ቤተ መዛግብት ነው።',
          stars: 5,
        },
        {
          id: '4',
          name: 'ዲያቆን ዮሐንስ',
          role: 'የቅድስት ሥላሴ ዩኒቨርሲቲ ተማሪ',
          quote: 'ያሬዳዊ ዜማዎችን በስርዓታቸውና በድምፃቸው ለማጥናት እጅግ በጣም ጠቃሚ የሆነ መንፈሳዊ ድጋፍ ነው።',
          stars: 5,
        },
      ];

  const renderCards = (keyPrefix: string) => (
    <div className="flex items-center gap-6 shrink-0 marquee-track-left" style={{ animationDuration: '45s' }}>
      {reviews.map((rev) => (
        <div
          key={`${keyPrefix}-${rev.id}`}
          className="w-[320px] sm:w-[380px] p-6 rounded-2xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm shrink-0 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-1 text-[#C89D3C] text-sm mb-3">
              {'★'.repeat(rev.stars)}
            </div>
            <p className="text-xs sm:text-sm text-[#201F1E] leading-relaxed italic">
              "{rev.quote}"
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#201F1E]/5 flex items-center justify-between">
            <span className="text-xs font-bold text-[#201F1E] font-mono">
              {rev.name}
            </span>
            <span className="text-[11px] text-[#5C5A56] font-mono">
              {rev.role}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden py-10 select-none">
      <div className="marquee-container flex gap-6">
        {renderCards('set-1')}
        {renderCards('set-2')}
        {renderCards('set-3')}
      </div>
    </div>
  );
};
