'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface CookiePopupProps {
  locale?: string;
}

export const CookiePopup: React.FC<CookiePopupProps> = ({ locale = 'am' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isEn = locale === 'en';

  useEffect(() => {
    // Check if user has already accepted/dismissed
    const status = localStorage.getItem('eotc-cookie-consent');
    if (!status) {
      // Delay entrance for a smooth reveal
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('eotc-cookie-consent', 'accepted');
    setIsOpen(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('eotc-cookie-consent', 'dismissed');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      className="dd-cookie-banner"
      role="dialog"
      aria-label="Consent and Privacy Notice"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#201F1E]/10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C89D3C]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#201F1E]">
            {isEn ? 'Archival Privacy & Cookies' : 'የመረጃና ቅርስ ጥበቃ ማስታወሻ'}
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-[#5C5A56] hover:text-[#201F1E] transition-colors p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="py-3 text-xs text-[#5C5A56] leading-relaxed">
        {isEn
          ? 'We respect your privacy and employ minimal session cookies solely to preserve your preferred liturgical language, manuscript search filters, and audio progress.'
          : 'ይህ መድረክ የተመረጠውን ቋንቋ፣ የድምፅ ማጫወቻና የፍለጋ ምርጫዎችዎን ለማስታወስ ብቻ አስፈላጊ የሆኑ ቴክኖሎጂዎችን ይጠቀማል።'}
      </p>

      <div className="pt-2 flex items-center justify-end gap-2.5">
        <button
          onClick={handleDismiss}
          type="button"
          className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold text-[#5C5A56] hover:text-[#201F1E] border border-[#201F1E]/15 hover:border-[#201F1E]/30 transition-all cursor-pointer"
        >
          {isEn ? 'Dismiss' : 'ዝጋ'}
        </button>
        <button
          onClick={handleAccept}
          type="button"
          className="px-4 py-1.5 rounded-xl text-xs font-mono font-bold text-white bg-[#C89D3C] hover:bg-[#B58B2F] shadow-sm transition-all cursor-pointer"
        >
          {isEn ? 'Accept' : 'ተቀበል'}
        </button>
      </div>
    </aside>
  );
};
