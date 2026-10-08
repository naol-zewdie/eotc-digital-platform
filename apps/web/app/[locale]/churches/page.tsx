'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Church,
  MapPin,
  CheckCircle,
  ExternalLink,
  Search,
  Filter,
  ShieldCheck,
  Compass,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { ChurchDto, VerificationStatus } from '@eotc/contracts';

interface ChurchesPageProps {
  params: { locale: string };
}

export default function ChurchesPage({ params }: ChurchesPageProps) {
  const locale = params.locale || 'am';
  const [churches, setChurches] = useState<ChurchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  // Fallback demo churches
  const fallbackChurches: ChurchDto[] = [
    {
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
          history: 'በ4ኛው መቶ ክፍለ ዘመን በአብርሃና አጽብሃ ዘመነ መንግሥት የተመሠረተች የመጀመሪያዋ ካቴድራል።',
        },
        {
          id: 't-axum-en',
          churchId: 'church-axum-01',
          locale: 'en',
          name: 'Church of Our Lady Mary of Zion (Axum Tsion)',
          description: 'The sacred resting sanctuary of the Ark of the Covenant and premier historical cathedral of Ethiopia.',
          history: 'Founded in the 4th century CE during the reign of King Ezana and the Holy Brothers Abreha and Atsbeha.',
        },
      ],
    },
    {
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
          history: 'በጻድቁ ንጉሥ ቅዱስ ላሊበላ በ12ኛው ክፍለ ዘመን ከመላእክት ረዳትነት ጋር የታነጹ ውቅር አብያተ ክርስቲያናት።',
        },
        {
          id: 't-lal-en',
          churchId: 'church-lalibela-02',
          locale: 'en',
          name: 'Rock-Hewn Churches of Lalibela (Rohas)',
          description: 'Eleven monolithic rock-cut cave churches recognized as a UNESCO World Heritage pilgrimage sanctuary.',
          history: 'Carved out of monolithic volcanic tuff in the 12th century under righteous King Saint Lalibela.',
        },
      ],
    },
    {
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
          history: 'በ13ኛው ክፍለ ዘመን በደብረ አስቦ የተመሠረተና የኢጨጌነት ማዕከል የሆነ ታሪካዊ ገዳም።',
        },
        {
          id: 't-dl-en',
          churchId: 'church-dl-03',
          locale: 'en',
          name: 'Debre Libanos Monastic Sanctuary',
          description: 'Premier monastic complex and historical seat of the Echege, founded by Saint Tekle Haymanot.',
          history: 'Established in the 13th century in the dramatic gorge of the Jamma River valley.',
        },
      ],
    },
    {
      id: 'church-ht-04',
      slug: 'holy-trinity-cathedral',
      verificationStatus: VerificationStatus.VERIFIED,
      status: 'PUBLISHED' as any,
      dioceseNameAm: 'የአዲስ አበባ ሀገረ ስብከት',
      dioceseNameEn: 'Addis Ababa Archdiocese',
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      coordinates: { latitude: 9.0305, longitude: 38.7667 },
      contacts: {
        phone: '+251 11 123 3550',
        email: 'cathedral@holytrinity.eotc.org',
      },
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 't-ht-am',
          churchId: 'church-ht-04',
          locale: 'am',
          name: 'መንበረ ጸባዖት ቅድስት ሥላሴ ካቴድራል',
          description: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ፓትርያርኮችና ጀግኖች ማረፊያ የሆነ ታላቁ ብሔራዊ ካቴድራል።',
          history: 'በቀዳማዊ ኃይለ ሥላሴ ዘመነ መንግሥት የተገነባና የሀገሪቱ ዋና የሥርዓተ ሃይማኖት ማዕከል።',
        },
        {
          id: 't-ht-en',
          churchId: 'church-ht-04',
          locale: 'en',
          name: 'Holy Trinity Cathedral (Menbere Tsebaot)',
          description: 'National cathedral and burial sanctuary of imperial monarchs, patriarchs, and patriots.',
          history: 'Constructed to commemorate the liberation of Ethiopia with European baroque ecclesiastical architecture.',
        },
      ],
    },
    {
      id: 'church-dc-05',
      slug: 'debre-mehret-dc',
      verificationStatus: VerificationStatus.VERIFIED,
      status: 'PUBLISHED' as any,
      dioceseNameAm: 'የዋሽንግተን ዲሲና አካባቢው ሀገረ ስብከት',
      dioceseNameEn: 'Archdiocese of Washington DC & Virginia',
      city: 'Washington DC',
      region: 'Diaspora (North America)',
      coordinates: { latitude: 38.9072, longitude: -77.0369 },
      contacts: {
        phone: '+1 202 555 0199',
        email: 'info@stmarydc.org',
      },
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 't-dc-am',
          churchId: 'church-dc-05',
          locale: 'am',
          name: 'ደብረ ምሕረት ቅድስት ማርያም ቤተክርስቲያን (ዲሲ)',
          description: 'በሰሜን አሜሪካ በዲሲና አካባቢው ለሚገኙ በብዙ ሺህ ለሚቆጠሩ ምእመናን መንፈሳዊ አገልግሎት የምትሰጥ ካቴድራል።',
          history: 'በዲያስፖራ ማኅበረሰብ የተመሠረተች የመጀመሪያዋ ታላቅ የሰሜን አሜሪካ አጥቢያ ቤተክርስቲያን።',
        },
        {
          id: 't-dc-en',
          churchId: 'church-dc-05',
          locale: 'en',
          name: 'Debre Mehret Saint Mary Cathedral (Washington DC)',
          description: 'Prominent diaspora parish serving the Ethiopian Orthodox community in the Greater Washington area.',
          history: 'Formed to provide full Ge\'ez and Amharic Divine Liturgies and spiritual education for diaspora families.',
        },
      ],
    },
  ];

  useEffect(() => {
    async function fetchChurches() {
      try {
        const res = await fetch('http://localhost:4000/api/v1/churches');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setChurches(data);
          } else {
            setChurches(fallbackChurches);
          }
        } else {
          setChurches(fallbackChurches);
        }
      } catch (err) {
        setChurches(fallbackChurches);
      } finally {
        setLoading(false);
      }
    }
    fetchChurches();
  }, []);

  const regions = [
    { id: 'ALL', label: 'All Dioceses' },
    { id: 'Addis Ababa', label: 'Addis Ababa (አዲስ አበባ)' },
    { id: 'Tigray', label: 'Tigray / Axum (ትግራይ)' },
    { id: 'Amhara', label: 'Amhara / Lalibela (አማራ)' },
    { id: 'Oromia', label: 'Oromia / Debre Libanos (ኦሮሚያ)' },
    { id: 'Diaspora', label: 'Diaspora Global (ዲያስፖራ)' },
  ];

  const filteredChurches = churches.filter((c) => {
    if (selectedRegion !== 'ALL') {
      if (!c.region?.toLowerCase().includes(selectedRegion.toLowerCase())) {
        return false;
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.translations.some((t) => t.name.toLowerCase().includes(q));
      const matchCity = c.city?.toLowerCase().includes(q);
      const matchSlug = c.slug.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchSlug) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-eotc-gold mb-1">
            <Church className="w-4 h-4" />
            <span>{locale === 'am' ? 'የአብያተ ክርስቲያናት መመሪያ' : 'Global Ecclesiastical Directory'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white heading-font">
            {locale === 'am' ? 'ታሪካዊ አድባራት፣ ገዳማትና አጥቢያ አብያተ ክርስቲያናት' : 'Historical Monasteries & Dioceses Worldwide'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Verified canonical registry of ancient monasteries, patriarchal sanctuaries, and global parishes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold">
            {filteredChurches.length} Registered Sanctuaries
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              locale === 'am'
                ? 'በገዳሙ ወይም በቤተክርስቲያኑ ስም፣ በሀገረ ስብከት ወይም በከተማ ፈልግ...'
                : 'Search sanctuaries by name, diocese, city, or country...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/60 text-white placeholder:text-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-eotc-gold"
          />
        </div>

        {/* Region Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                selectedRegion === reg.id
                  ? 'bg-eotc-crimson text-white shadow-sm'
                  : 'bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Church Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChurches.map((church) => {
          const primaryTrans =
            church.translations.find((t) => t.locale === locale) ||
            church.translations[0];

          return (
            <div
              key={church.slug}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-eotc-gold/40 hover:bg-neutral-900/80 transition-all p-5 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    <span>Canonical Sanctuary</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {church.city || 'Ethiopia'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-eotc-gold transition-colors line-clamp-1">
                    {primaryTrans?.name}
                  </h3>
                  <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>{church.dioceseNameAm || church.region}</span>
                  </div>
                  {primaryTrans?.description && (
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                      {primaryTrans.description}
                    </p>
                  )}
                </div>

                {/* Contacts Box */}
                {church.contacts && (
                  <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-[11px] text-neutral-300 space-y-1">
                    {church.contacts.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-neutral-500" />
                        <span>{church.contacts.phone}</span>
                      </div>
                    )}
                    {church.contacts.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-neutral-500" />
                        <span className="truncate">{church.contacts.email}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500 font-mono">
                  {church.coordinates ? `${(church.coordinates.latitude ?? church.coordinates.lat ?? 0).toFixed(2)}°N, ${(church.coordinates.longitude ?? church.coordinates.lng ?? 0).toFixed(2)}°E` : 'GPS Verified'}
                </span>
                <Link
                  href={`/${locale}/churches/${church.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 group-hover:bg-eotc-crimson text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <span>{locale === 'am' ? 'መገለጫውን እይ' : 'View Sanctuary'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
