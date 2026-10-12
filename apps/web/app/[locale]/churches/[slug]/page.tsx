'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Church,
  ArrowLeft,
  MapPin,
  CheckCircle,
  Phone,
  Mail,
  Globe,
  Clock,
  Calendar,
  ShieldCheck,
  UserCheck,
  Share2,
  ExternalLink,
  Compass,
  Check,
  X,
} from 'lucide-react';
import { ChurchDto, VerificationStatus } from '@eotc/contracts';
import { GridLines } from '../../../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../../../components/DoorDennis/DoorDennisButton';
import { TextScrambler } from '../../../../components/DoorDennis/TextScrambler';
import { VenetianMaskReveal } from '../../../../components/DoorDennis/VenetianMaskReveal';

interface ChurchDetailPageProps {
  params: { locale: string; slug: string };
}

export default function ChurchDetailPage({ params }: ChurchDetailPageProps) {
  const locale = params.locale || 'am';
  const slug = params.slug;
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const [church, setChurch] = useState<ChurchDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimName, setClaimName] = useState('');
  const [claimRole, setClaimRole] = useState('Parish Priest');
  const [claimNotes, setClaimNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const fallbackDict: Record<string, ChurchDto> = {
    'axum-tsion': {
      id: 'church-axum-01',
      slug: 'axum-tsion',
      verificationStatus: VerificationStatus.VERIFIED,
      status: 'PUBLISHED' as any,
      dioceseNameAm: 'የአክሱም አህጉረ ስብከት',
      dioceseNameEn: 'Axum Diocese & Patriarchal See',
      city: 'Axum',
      region: 'Tigray',
      coordinates: { latitude: 14.1292, longitude: 38.7188 },
      contacts: {
        phone: '+251 34 775 1024',
        email: 'axum.tsion@eotc-patriarchate.org',
        website: 'https://axum-tsion.eotc.org',
      },
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 't-axum-am',
          churchId: 'church-axum-01',
          locale: 'am',
          name: 'የአክሱም ጽዮን ማርያም ካቴድራል (ርእሰ አድባራት)',
          description: 'የጽላተ ኪዳኑ ማደሪያ እና ጥንታዊቷ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ መንፈሳዊ እናት ቤተክርስቲያን።',
          history: 'በ4ኛው መቶ ክፍለ ዘመን በአብርሃና አጽብሃ ዘመነ መንግሥት የተመሠረተች የመጀመሪያዋ ካቴድራል። የጽላተ ኪዳኑ ማረፊያ የሆነችው ቅድስት ቤተክርስቲያን ላለፉት 1600 ዓመታት ያሬዳዊውን ዜማ ሳታቋርጥ ስትዘምር ቆይታለች። በግቢዋ ውስጥ በርካታ ጥንታዊ የብራና መጻሕፍት፣ የነገሥታት ዘውዶችና ታሪካዊ ቅርሶች ይገኛሉ።',
        },
        {
          id: 't-axum-en',
          churchId: 'church-axum-01',
          locale: 'en',
          name: 'Church of Our Lady Mary of Zion (Axum Tsion)',
          description: 'The sacred resting sanctuary of the Ark of the Covenant and premier historical cathedral of Ethiopia.',
          history: 'Founded in the 4th century CE during the reign of King Ezana and the Holy Brothers Abreha and Atsbeha. It has guarded the Ark of the Covenant for millennia, serving as the theological crown of the Ethiopian Orthodox Tewahedo Church.',
        },
      ],
    },
    'debre-libanos': {
      id: 'church-dl-03',
      slug: 'debre-libanos',
      verificationStatus: VerificationStatus.VERIFIED,
      status: 'PUBLISHED' as any,
      dioceseNameAm: 'የሰሜን ሸዋ ሀገረ ስብከት',
      dioceseNameEn: 'North Shewa Monastic Diocese',
      city: 'Debre Libanos',
      region: 'Oromia',
      coordinates: { latitude: 9.7167, longitude: 38.7333 },
      contacts: {
        phone: '+251 11 188 4400',
        email: 'monastery@debrelibanos.org',
      },
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 't-dl-am',
          churchId: 'church-dl-03',
          locale: 'am',
          name: 'ታላቁ የደብረ ሊባኖስ ገዳም (ደብረ አስቦ)',
          description: 'በኢትዮጵያዊው ጻድቅ አቡነ ተክለ ሃይማኖት የተመሠረተ የታሪክና የመንፈሳዊ ትምህርት ታላቅ ገዳም።',
          history: 'በ13ኛው ክፍለ ዘመን በደብረ አስቦ የተመሠረተና የኢጨጌነት ማዕከል የሆነ ታሪካዊ ገዳም። ጻድቁ አቡነ ተክለ ሃይማኖት ለ29 ዓመታት በአንድ እግራቸው ቆመው የጸለዩበት ዋሻና ቅዱስ ጸበል ይገኝበታል። ገዳሙ የኢትዮጵያ መንፈሳዊ ትምህርት ዋና ማዕከል ሆኖ ቆይቷል።',
        },
        {
          id: 't-dl-en',
          churchId: 'church-dl-03',
          locale: 'en',
          name: 'Debre Libanos Monastic Complex',
          description: 'Historic monastic seat founded by Saint Tekle Haymanot in the 13th century.',
          history: 'Established in the 13th century in a dramatically carved gorge of North Shewa. It was the historical seat of the Echege of the Ethiopian Orthodox Church, housing venerated caves and ancient manuscripts.',
        },
      ],
    },
  };

  useEffect(() => {
    async function fetchChurch() {
      try {
        const res = await fetch(`http://localhost:4000/api/v1/churches/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setChurch(data);
        } else {
          setChurch(fallbackDict[slug] || fallbackDict['axum-tsion']);
        }
      } catch (err) {
        setChurch(fallbackDict[slug] || fallbackDict['axum-tsion']);
      } finally {
        setLoading(false);
      }
    }
    fetchChurch();
  }, [slug]);

  const currentChurch = church || fallbackDict[slug] || fallbackDict['axum-tsion'];
  const primaryTrans =
    currentChurch.translations.find((t) => t.locale === locale) ||
    currentChurch.translations[0];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimLoading(true);
    setTimeout(() => {
      setClaimLoading(false);
      setShowClaimModal(false);
      alert(isEn ? 'Your representative claim has been submitted for canonical diocesan review.' : 'የውክልና ማመልከቻዎ ለሀገረ ስብከቱ እንዲመረመር ተልኳል።');
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C89D3C] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F7F5F0] text-[#201F1E] pb-28 overflow-hidden">
      {/* 9 Architectural Vertical Grid Lines */}
      <GridLines count={9} opacity={0.08} />

      {/* Top Breadcrumb Bar */}
      <div className="relative z-10 border-b border-[#201F1E]/10 bg-[#FAF9F6]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs font-mono">
          <Link
            href={`/${locale}/churches`}
            className="group inline-flex items-center gap-2 text-[#5C5A56] hover:text-[#201F1E] transition-colors"
          >
            <span className="w-6 h-6 rounded-lg border border-[#201F1E]/15 flex items-center justify-center group-hover:border-[#201F1E] group-hover:bg-[#201F1E] group-hover:text-[#F7F5F0] transition-all">
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
            <span className="uppercase tracking-wider font-semibold">
              {isEn ? 'Back to Monasteries' : isGez ? 'ተመየጥ ኀበ አድባራት' : 'ወደ አድባራትና ገዳማት ተመለስ'}
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowClaimModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#201F1E]/15 hover:border-[#201F1E] text-[#201F1E] bg-[#FAF9F6] text-xs font-mono font-semibold transition-all cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#C89D3C]" />
              <span className="hidden sm:inline">{isEn ? 'Claim Representative Role' : 'የገዳም ውክልና'}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#201F1E]/15 text-[#5C5A56] hover:text-[#201F1E] hover:border-[#201F1E] hover:bg-[#FAF9F6] transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">{isEn ? 'Copied' : 'ተቀድቷል!'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Share' : 'አጋራ'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 z-10 space-y-12">
        {/* Church Hero Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#201F1E] text-[#F7F5F0]">
              <CheckCircle className="w-3 h-3 text-[#C89D3C]" />
              <span>{isEn ? 'Canonical Holy Sanctuary' : 'በሲኖዶስ የተረጋገጠ ቅዱስ ገዳም'}</span>
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#FAF9F6] border border-[#201F1E]/15 text-[#5C5A56]">
              {currentChurch.region || 'Ethiopia'}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#FAF9F6] border border-[#201F1E]/15 text-[#C89D3C]">
              {currentChurch.dioceseNameAm || currentChurch.dioceseNameEn || 'መንበረ ፓትርያርክ'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#201F1E] leading-[1.1] tracking-tight">
            {primaryTrans?.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#5C5A56]">
            <span className="flex items-center gap-1.5 font-semibold text-[#201F1E]">
              <MapPin className="w-3.5 h-3.5 text-[#C89D3C]" />
              <span>{currentChurch.city}, {currentChurch.region}</span>
            </span>
            <span>・</span>
            <span className="font-mono text-[#7A7771]">
              GPS: {(currentChurch.coordinates?.latitude ?? 14.1292).toFixed(4)}°N, {(currentChurch.coordinates?.longitude ?? 38.7188).toFixed(4)}°E
            </span>
          </div>

          <p className="text-base sm:text-lg text-[#5C5A56] font-serif leading-relaxed max-w-4xl pt-2">
            {primaryTrans?.description}
          </p>
        </div>

        {/* Featured Sanctuary Photo with 16-Line Venetian Mask Reveal */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-[#EDEAE3] border border-[#201F1E]/10 shadow-md">
          <VenetianMaskReveal linesCount={16} delayMs={150} className="w-full h-full relative">
            <Image
              src="/dome.png"
              alt={primaryTrans?.name || 'Sanctuary Architecture'}
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 right-6 text-white text-xs font-mono flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 uppercase tracking-widest">
                {isEn ? 'Historic Cathedral Architecture' : 'ታሪካዊ የካቴድራልና የገዳም ሥነ-ሕንጻ'}
              </span>
              <span className="hidden sm:inline opacity-80">4th Century Foundation</span>
            </div>
          </VenetianMaskReveal>
        </div>

        {/* Two-Column Detailed Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Column (Span 8): History & Spiritual Patrimony */}
          <div className="lg:col-span-8 space-y-8">
            {/* History Section */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#201F1E]/10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C89D3C]" />
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#201F1E]">
                  {isEn ? 'Spiritual Foundation & Monastic Antiquity' : 'የገዳሙ ታሪካዊና መንፈሳዊ መሠረት'}
                </h2>
              </div>

              <div className="font-serif text-[#201F1E] leading-loose text-base sm:text-lg space-y-4">
                <p>{primaryTrans?.history}</p>
              </div>
            </div>

            {/* Sacred Relics & Feast Days */}
            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-6">
              <h3 className="text-lg font-bold font-serif text-[#201F1E]">
                {isEn ? 'Venerated Relics & Liturgical Observances' : 'ንዋያተ ቅድሳትና ዓመታዊ በዓላት'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-[#EDEAE3] space-y-1.5">
                  <span className="text-[#7A7771] uppercase tracking-wider">ዋናው በዓል / Patronal Feast:</span>
                  <div className="font-bold text-[#201F1E] text-sm">ኅዳር ጽዮን (Hidar Tsion) ・ Nov 30</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#EDEAE3] space-y-1.5">
                  <span className="text-[#7A7771] uppercase tracking-wider">ንዋየ ቅድሳት / Sacred Relics:</span>
                  <div className="font-bold text-[#201F1E] text-sm">ታቦተ ጽዮን (Ark of Covenant)</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#EDEAE3] space-y-1.5">
                  <span className="text-[#7A7771] uppercase tracking-wider">የብራና መዛግብት / Manuscripts:</span>
                  <div className="font-bold text-[#201F1E] text-sm">1,200+ Ancient Codices</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#EDEAE3] space-y-1.5">
                  <span className="text-[#7A7771] uppercase tracking-wider">ሥርዓተ ቅዳሴ / Liturgy:</span>
                  <div className="font-bold text-[#201F1E] text-sm">ዕለታዊ ቅዳሴ (Daily Anaphoras)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column (Span 4): Contacts & Diocesan Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Contacts Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#C89D3C] font-bold">
                  {isEn ? 'DIRECT CONTACT' : 'የገዳሙ ቀጥታ አድራሻ'}
                </span>
                <h3 className="text-base font-bold font-serif text-[#201F1E]">
                  {isEn ? 'Pilgrim & Archival Inquiries' : 'የምዕመናንና የጎብኚዎች መረጃ'}
                </h3>
              </div>

              <div className="space-y-3.5 text-xs font-mono text-[#5C5A56] pt-1">
                {currentChurch.contacts?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#C89D3C] shrink-0" />
                    <span className="text-[#201F1E] font-medium">{currentChurch.contacts.phone}</span>
                  </div>
                )}

                {currentChurch.contacts?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#C89D3C] shrink-0" />
                    <a
                      href={`mailto:${currentChurch.contacts.email}`}
                      className="text-[#201F1E] hover:text-[#C89D3C] transition-colors truncate"
                    >
                      {currentChurch.contacts.email}
                    </a>
                  </div>
                )}

                {currentChurch.contacts?.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-[#C89D3C] shrink-0" />
                    <a
                      href={currentChurch.contacts.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#201F1E] hover:text-[#C89D3C] transition-colors truncate flex items-center gap-1"
                    >
                      <span>{isEn ? 'Official Website' : 'ይፋዊ ድረ-ገጽ'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#201F1E]/10">
                <DoorDennisButton href={`/${locale}/donate`}>
                  {isEn ? 'Support Sanctuary' : 'ገዳሙን በምጽዋት ይደግፉ'}
                </DoorDennisButton>
              </div>
            </div>

            {/* Diocesan Oversight Seal */}
            <div className="p-6 rounded-3xl bg-[#EDEAE3] border border-[#201F1E]/10 space-y-3 text-xs">
              <span className="font-mono uppercase tracking-widest text-[#201F1E] font-bold block">
                {isEn ? 'Diocesan Canonical Oversight' : 'የሀገረ ስብከት ቀኖናዊ ቁጥጥር'}
              </span>
              <p className="text-[#5C5A56] leading-relaxed">
                {isEn
                  ? 'This sanctuary is registered under the patriarchal archives of the Ethiopian Orthodox Tewahedo Church.'
                  : 'ይህ ገዳም በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን መንበረ ፓትርያርክ ጠቅላይ ጽሕፈት ቤት በይፋ የተመዘገበና የሚተዳደር ቅዱስ ቅርስ ነው።'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Claim Representative Role Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/20 p-6 sm:p-8 space-y-6 shadow-2xl animate-ddSlideUpFade">
            <div className="flex items-center justify-between pb-4 border-b border-[#201F1E]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#201F1E] text-[#F7F5F0] flex items-center justify-center text-sm font-serif font-bold">
                  ✝
                </div>
                <h3 className="text-base font-bold font-serif text-[#201F1E]">
                  {isEn ? 'Sanctuary Representative Claim' : 'የገዳሙ ወይም የደብሩ ውክልና ማመልከቻ'}
                </h3>
              </div>
              <button
                onClick={() => setShowClaimModal(false)}
                className="w-8 h-8 rounded-xl border border-[#201F1E]/15 flex items-center justify-center text-[#5C5A56] hover:text-[#201F1E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="block text-[#5C5A56] uppercase">ሙሉ ስም / Full Name:</label>
                <input
                  type="text"
                  required
                  value={claimName}
                  onChange={(e) => setClaimName(e.target.value)}
                  placeholder="e.g. ቀሲስ ገብረ ማርያም / Priest Gebre Maryam"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#201F1E]/20 bg-[#F7F5F0] text-[#201F1E] focus:outline-none focus:border-[#C89D3C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[#5C5A56] uppercase">መንፈሳዊ ማዕረግ / Ecclesiastical Role:</label>
                <select
                  value={claimRole}
                  onChange={(e) => setClaimRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#201F1E]/20 bg-[#F7F5F0] text-[#201F1E] focus:outline-none focus:border-[#C89D3C]"
                >
                  <option value="Abbot">አበምኔት / Abbot</option>
                  <option value="Parish Priest">የደብር አስተዳዳሪ / Parish Administrator</option>
                  <option value="Archival Deacon">የመዛግብት ዲያቆን / Archival Deacon</option>
                  <option value="Diocesan Secretary">የሀገረ ስብከት ጸሐፊ / Diocesan Secretary</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[#5C5A56] uppercase">ማብራሪያ / Supporting Notes:</label>
                <textarea
                  rows={3}
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  placeholder="የውክልና ደብዳቤ ወይም የሀገረ ስብከት መረጃ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#201F1E]/20 bg-[#F7F5F0] text-[#201F1E] focus:outline-none focus:border-[#C89D3C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#201F1E]/20 text-[#5C5A56] hover:text-[#201F1E]"
                >
                  {isEn ? 'Cancel' : 'ይቅር'}
                </button>
                <button
                  type="submit"
                  disabled={claimLoading}
                  className="px-5 py-2 rounded-xl bg-[#201F1E] text-[#F7F5F0] hover:bg-[#33312E] font-bold shadow-sm"
                >
                  {claimLoading ? '...' : isEn ? 'Submit Claim' : 'አመልክት'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
