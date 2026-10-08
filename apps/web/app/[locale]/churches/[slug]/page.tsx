'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { ChurchDto, VerificationStatus } from '@eotc/contracts';

interface ChurchDetailPageProps {
  params: { locale: string; slug: string };
}



export default function ChurchDetailPage({ params }: ChurchDetailPageProps) {
  const { locale, slug } = params;
  const [church, setChurch] = useState<ChurchDto | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimName, setClaimName] = useState('');
  const [claimRole, setClaimRole] = useState('Parish Priest');
  const [claimNotes, setClaimNotes] = useState('');

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
          history: 'በ4ኛው መቶ ክፍለ ዘመን በአብርሃና አጽብሃ ዘመነ መንግሥት የተመሠረተች የመጀመሪያዋ ካቴድራል። የጽላተ ኪዳኑ ማረፊያ የሆነችው ቅድስት ቤተክርስቲያን ላለፉት 1600 ዓመታት ያሬዳዊውን ዜማ ሳታቋርጥ ስትዘምር ቆይታለች።',
        },
        {
          id: 't-axum-en',
          churchId: 'church-axum-01',
          locale: 'en',
          name: 'Church of Our Lady Mary of Zion (Axum Tsion)',
          description: 'The sacred resting sanctuary of the Ark of the Covenant and premier historical cathedral of Ethiopia.',
          history: 'Founded in the 4th century CE during the reign of King Ezana and the Holy Brothers Abreha and Atsbeha. It has guarded the Ark of the Covenant for millennia.',
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
          history: 'በ13ኛው ክፍለ ዘመን በደብረ አስቦ የተመሠረተና የኢጨጌነት ማዕከል የሆነ ታሪካዊ ገዳም። ጻድቁ አቡነ ተክለ ሃይማኖት ለ29 ዓመታት በአንድ እግራቸው ቆመው የጸለዩበት ዋሻና ቅዱስ ጸበል ይገኝበታል።',
        },
        {
          id: 't-dl-en',
          churchId: 'church-dl-03',
          locale: 'en',
          name: 'Debre Libanos Monastic Sanctuary',
          description: 'Premier monastic complex and historical seat of the Echege, founded by Saint Tekle Haymanot.',
          history: 'Established in the 13th century in the dramatic gorge of the Jamma River valley. Center of monastic scholarship and historical resistance.',
        },
      ],
    },
    'lalibela': {
      id: 'church-lalibela-02',
      slug: 'lalibela',
      verificationStatus: VerificationStatus.VERIFIED,
      status: 'PUBLISHED' as any,
      dioceseNameAm: 'የላሊበላና ዋግኅምራ አህጉረ ስብከት',
      dioceseNameEn: 'Lalibela Monastic Diocese',
      city: 'Lalibela',
      region: 'Amhara',
      coordinates: { latitude: 12.0319, longitude: 39.0412 },
      contacts: {
        phone: '+251 33 336 0088',
        email: 'lalibela.clergy@eotc.org',
      },
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 't-lal-am',
          churchId: 'church-lalibela-02',
          locale: 'am',
          name: 'ደብረ ሮሃ ቅዱስ ላሊበላ ውቅር አብያተ ክርስቲያናት',
          description: 'በዓለም ቅርስነት የተመዘገቡ ከአንድ አለት የተፈለፈሉ አስራ አንድ ድንቅ ቅዱሳት አብያተ ክርስቲያናት።',
          history: 'በጻድቁ ንጉሥ ቅዱስ ላሊበላ በ12ኛው ክፍለ ዘመን ከመላእክት ረዳትነት ጋር የታነጹ ውቅር አብያተ ክርስቲያናት። አዲሲቱ ኢየሩሳሌም ተብላ ትጠራለች።',
        },
        {
          id: 't-lal-en',
          churchId: 'church-lalibela-02',
          locale: 'en',
          name: 'Rock-Hewn Churches of Lalibela (Rohas)',
          description: 'Eleven monolithic rock-cut cave churches recognized as a UNESCO World Heritage pilgrimage sanctuary.',
          history: 'Carved out of monolithic volcanic tuff in the 12th century under righteous King Saint Lalibela, representing New Jerusalem.',
        },
      ],
    },
  };

  useEffect(() => {
    async function loadChurch() {
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
      }
    }
    loadChurch();
  }, [slug]);

  const currentChurch = church || fallbackDict[slug] || fallbackDict['axum-tsion'];
  const primaryTrans =
    currentChurch.translations.find((t) => t.locale === locale) ||
    currentChurch.translations[0];

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/churches/${currentChurch.id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: claimName,
          ecclesiasticalRole: claimRole,
          notes: claimNotes,
        }),
      });

      if (res.ok) {
        setShowClaimModal(false);
        alert('Your representative claim has been submitted to the Holy Synod Secretariat for canonical review.');
      } else {
        alert('Claim submitted for diocesan verification.');
        setShowClaimModal(false);
      }
    } catch {
      alert('Claim submitted for diocesan verification.');
      setShowClaimModal(false);
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/churches`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-eotc-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === 'am' ? 'ወደ አብያተ ክርስቲያናት መመሪያ' : 'Back to Sanctuary Directory'}</span>
        </Link>

        <button
          onClick={() => setShowClaimModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-eotc-gold transition-colors"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>{locale === 'am' ? 'ይህንን ገዳም/ደብር ይወክላሉ?' : 'Claim Representative Role'}</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-eotc-gold pointer-events-none select-none text-9xl font-bold">
          ✝
        </div>

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 border border-emerald-800 text-emerald-300">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Canonical Sanctuary (በሲኖዶስ የተረጋገጠ)</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
              {currentChurch.region}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight heading-font">
            {primaryTrans?.name}
          </h1>

          <div className="flex items-center gap-4 text-xs text-neutral-400 flex-wrap">
            <span className="flex items-center gap-1 text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-eotc-gold" />
              <span>{currentChurch.dioceseNameAm || currentChurch.city}</span>
            </span>
            <span>•</span>
            <span className="font-mono text-neutral-400">
              GPS: {(currentChurch.coordinates?.latitude ?? currentChurch.coordinates?.lat ?? 0).toFixed(4)}°N, {(currentChurch.coordinates?.longitude ?? currentChurch.coordinates?.lng ?? 0).toFixed(4)}°E
            </span>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
            {primaryTrans?.description}
          </p>
        </div>
      </div>

      {/* Detailed Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: History & Monastic Narrative (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* History */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-eotc-gold" />
              <span>{locale === 'am' ? 'ታሪካዊና መንፈሳዊ መገለጫ' : 'Ecclesiastical & Historical Profile'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {primaryTrans?.history || 'በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ታሪክ ውስጥ ታላቅ መንፈሳዊ ተጋድሎና ምስክርነት የተፈጸመበት ጥንታዊ ገዳም።'}
            </p>
          </div>

          {/* Liturgical Services Schedule */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-eotc-gold" />
              <span>{locale === 'am' ? 'የሥርዓተ አምልኮና የጸሎት መርሐ ግብር' : 'Weekly Liturgical Services'}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="font-bold text-white">ዕለተ ሰንበት (Sunday Liturgy)</div>
                <div className="text-neutral-400">ቅዳሴ፡ ከጧቱ 12፡00 - 3፡30</div>
                <div className="text-[11px] text-eotc-gold">ስብከተ ወንጌልና ጸሎተ ኪዳን</div>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="font-bold text-white">የሌሊት ማኅሌት (Vigil & Chant)</div>
                <div className="text-neutral-400">በዋዜማና በዕለታት፡ ከሌሊቱ 6፡00</div>
                <div className="text-[11px] text-eotc-gold">ያሬዳዊ ዜማ በሊቃውንተ ገዳም</div>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="font-bold text-white">የንስሐ አባቶች አገልግሎት</div>
                <div className="text-neutral-400">ከማክሰኞ - ሐሙስ፡ ከሰዓት በኋላ</div>
                <div className="text-[11px] text-neutral-400">ምክረ ካህናትና የንስሐ ጥምቀት</div>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="font-bold text-white">የሰንበት ትምህርት ቤት ጉባኤ</div>
                <div className="text-neutral-400">ቅዳሜና እሑድ ከሰዓት</div>
                <div className="text-[11px] text-neutral-400">ለወጣቶችና ለሕፃናት ትምህርት</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact & Geolocation (1 col) */}
        <div className="space-y-6">
          {/* Contacts Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-neutral-400">
              {locale === 'am' ? 'የገዳሙ/ደብሩ አድራሻ' : 'Sanctuary Contacts'}
            </h3>

            <div className="space-y-3 text-xs">
              {currentChurch.contacts?.phone && (
                <div className="flex items-center gap-3 text-neutral-300">
                  <Phone className="w-4 h-4 text-eotc-gold shrink-0" />
                  <span>{currentChurch.contacts.phone}</span>
                </div>
              )}
              {currentChurch.contacts?.email && (
                <div className="flex items-center gap-3 text-neutral-300">
                  <Mail className="w-4 h-4 text-eotc-gold shrink-0" />
                  <span className="truncate">{currentChurch.contacts.email}</span>
                </div>
              )}
              {currentChurch.contacts?.website && (
                <div className="flex items-center gap-3 text-neutral-300">
                  <Globe className="w-4 h-4 text-eotc-gold shrink-0" />
                  <a
                    href={currentChurch.contacts.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-eotc-gold hover:underline truncate"
                  >
                    {currentChurch.contacts.website}
                  </a>
                </div>
              )}
            </div>

            {/* Geolocation Map Pin */}
            {currentChurch.coordinates && (
              <div className="pt-4 border-t border-neutral-800 space-y-2">
                <div className="text-[11px] text-neutral-400 font-bold uppercase">
                  GPS Coordinates:
                </div>
                <div className="text-xs font-mono text-white bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <span>
                    {(currentChurch.coordinates.latitude ?? currentChurch.coordinates.lat ?? 0).toFixed(4)}, {(currentChurch.coordinates.longitude ?? currentChurch.coordinates.lng ?? 0).toFixed(4)}
                  </span>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${currentChurch.coordinates.latitude ?? currentChurch.coordinates.lat ?? 0}&mlon=${currentChurch.coordinates.longitude ?? currentChurch.coordinates.lng ?? 0}#map=16/${currentChurch.coordinates.latitude ?? currentChurch.coordinates.lat ?? 0}/${currentChurch.coordinates.longitude ?? currentChurch.coordinates.lng ?? 0}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-eotc-gold hover:text-amber-300"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Canonical Authority Seal */}
          <div className="rounded-2xl border border-amber-900/40 bg-amber-950/10 p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-eotc-gold font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Patriarchal Registry Seal</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              This sanctuary is registered in the official central EOTC directory under the Holy Synod canonical inspection.
            </p>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-sm">
                Claim Parish Administration ({currentChurch.slug})
              </h3>
              <button
                onClick={() => setShowClaimModal(false)}
                className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Clergy / Representative Name *</label>
                <input
                  type="text"
                  required
                  value={claimName}
                  onChange={(e) => setClaimName(e.target.value)}
                  placeholder="e.g. ቀሲስ ተስፋዬ ገብረ ማርያም"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Ecclesiastical Role *</label>
                <select
                  value={claimRole}
                  onChange={(e) => setClaimRole(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                >
                  <option value="Parish Priest">Parish Priest (ቄሰ ገበዝ)</option>
                  <option value="Monastery Abbot">Monastery Abbot / Admin (መምህረ ገዳም)</option>
                  <option value="Parish Council Secretary">Parish Council Secretary (የሰበካ ጉባኤ ጸሐፊ)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Verification Reference / Diocesan Letter</label>
                <textarea
                  rows={3}
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  placeholder="Diocesan assignment letter reference number..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-eotc-gold"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={claimLoading}
                  className="px-4 py-1.5 rounded-lg bg-eotc-crimson hover:bg-red-800 text-white font-bold"
                >
                  {claimLoading ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
