import React from 'react';
import { Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function DonatePage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'am';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-eotc-gold text-xs font-bold">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>{locale === 'am' ? 'የቅርስ ጥበቃና ልገሳ' : 'Preservation Fund'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold heading-font text-neutral-900 dark:text-white">
          {locale === 'am' ? 'ለቤተክርስቲያን ቅርስ ጥበቃና ዲጂታላይዜሽን ድጋፍ ያድርጉ' : 'Support Sacred Manuscript Digitisation & Heritage'}
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {locale === 'am'
            ? 'ይህ መድረክ ለሁሉም ሰው በነጻ ክፍት ነው። ልገሳዎ የጥንታውያን ገዳማት የብራና መጻሕፍትን በዲጂታል ቴክኖሎጂ ለመጠበቅ፣ ለሰርቨር ወጪዎችና ለምርምር ሥራዎች ይውላል።'
            : 'All religious resources remain 100% free and ungated. Voluntary donations sustain high-resolution manuscript scanning, cloud preservation, and public availability.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['500 ETB', '1,000 ETB', '5,000 ETB'].map((amount, idx) => (
          <button
            key={idx}
            className="p-6 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center hover:border-eotc-gold transition-all shadow-sm"
          >
            <div className="text-xl font-black text-neutral-900 dark:text-white">{amount}</div>
            <div className="text-xs text-neutral-400 mt-1">One-time / የአንድ ጊዜ ድጋፍ</div>
          </button>
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-eotc-gold/30 bg-white dark:bg-neutral-900 space-y-4 shadow-sm">
        <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>{locale === 'am' ? 'የገንዘብ ግልጽነትና መርሆዎች' : 'Governance & Financial Principles'}</span>
        </h3>
        <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Donations never gate core liturgical or doctrinal content.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encapsulated payment gateways (Telebirr, CBE Birr, Chapa, Stripe) via PaymentGateway adapter.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Immutable transaction references with server-side webhook signature reconciliation.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
