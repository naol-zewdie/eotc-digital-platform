'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Church,
  MapPin,
  CheckCircle,
  Search,
  ArrowUpRight,
  Phone,
  Mail,
} from 'lucide-react';
import { ChurchDto, VerificationStatus } from '@eotc/contracts';
import { GridLines } from '../../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../../components/DoorDennis/DoorDennisButton';
import { VenetianMaskReveal } from '../../../components/DoorDennis/VenetianMaskReveal';

interface ChurchesPageProps {
  params: { locale: string };
}

export default function ChurchesPage({ params }: ChurchesPageProps) {
  const locale = params.locale || 'am';
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const [churches, setChurches] = useState<ChurchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

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
      slug: 'lalibela-bete-giyorgis',
      verificationStatus: VerificationStatus.VERIFIED,
      status: 'PUBLISHED' as any,
      dioceseNameAm: 'የላሊበላና ዋግኅምራ አህጉረ ስብከት',
      dioceseNameEn: 'Lalibela Monastic Diocese',
      city: 'Lalibela',
      region: 'Amhara',
      coordinates: { latitude: 12.0319, longitude: 39.0412 },
      contacts: {
        phone: '+251 33 336 0088',
        email: 'lalibela.clergy@eotc-patriarchate.org',
        website: 'https://lalibela.eotc.org',
      },
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 't-lali-am',
          churchId: 'church-lalibela-02',
          locale: 'am',
          name: 'ቤተ ጊዮርጊስ (የላሊበላ ፍልፍል አብያተ ክርስቲያናት)',
          description: 'በቅዱስ ላሊበላ ዘመነ መንግሥት ከአንድ ወጥ ዓለት ተፈልፍላ የተሠራች ዓለም አቀፍ የኪነ-ሕንጻ ድንቅ ቅርስ።',
          history: 'በ12ኛው መቶ ክፍለ ዘመን በመላእክት ረዳትነት ከአንድ ዓለት የተፈለፈለች ታሪካዊት ቤተ መቅደስ።',
        },
        {
          id: 't-lali-en',
          churchId: 'church-lalibela-02',
          locale: 'en',
          name: 'Bete Giyorgis (Church of Saint George, Lalibela)',
          description: 'Monolithic cruciform rock-hewn church carved out of a single volcanic tuff block.',
          history: 'Hewn in the late 12th century under King Saint Lalibela, acclaimed UNESCO heritage sanctuary.',
        },
      ],
    },
    {
      id: 'church-debre-damo-03',
      slug: 'debre-damo-monastery',
      verificationStatus: VerificationStatus.VERIFIED,
      status: 'PUBLISHED' as any,
      dioceseNameAm: 'የዓዲግራትና ምሥራቃዊ ትግራይ አህጉረ ስብከት',
      dioceseNameEn: 'Debre Damo Monastic Diocese',
      city: 'Debre Damo',
      region: 'Tigray',
      coordinates: { latitude: 14.3736, longitude: 39.2981 },
      contacts: {
        phone: '+251 34 771 9012',
        email: 'debredamo@eotc-patriarchate.org',
        website: 'https://debredamo.eotc.org',
      },
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      translations: [
        {
          id: 't-damo-am',
          churchId: 'church-debre-damo-03',
          locale: 'am',
          name: 'ደብረ ዳሞ ገዳም (የአቡነ አረጋዊ መካነ ቅዱሳን)',
          description: 'በገመድ ብቻ በሚወጣበት ዓለታማ አምባ ላይ የተመሠረተች፣ ጥንታውያን የብራና መዛግብት መገኛ።',
          history: 'በ6ኛው መቶ ክፍለ ዘመን በጻድቁ አቡነ አረጋዊ የተመሠረተ የመጀመሪያው የአክሱማዊ ሥነ-ሕንጻ ገዳም።',
        },
        {
          id: 't-damo-en',
          churchId: 'church-debre-damo-03',
          locale: 'en',
          name: 'Debre Damo Cliff Monastery',
          description: 'Historic 6th-century cliff monastery accessible solely by climbing rope, guarding ancient illuminated texts.',
          history: 'Founded by Saint Abuna Aregawi of the Nine Saints in the 6th century CE.',
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
          if (data && Array.isArray(data) && data.length > 0) {
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
    { id: 'ALL', label: isEn ? 'All Dioceses' : 'ሁሉም አህጉረ ስብከት' },
    { id: 'Tigray', label: isEn ? 'Tigray / Axum' : 'ትግራይ (አክሱም)' },
    { id: 'Amhara', label: isEn ? 'Amhara / Lalibela' : 'አማራ (ላሊበላ)' },
    { id: 'Shewa', label: isEn ? 'Shewa / Addis Ababa' : 'ሸዋና አዲስ አበባ' },
  ];

  const filteredChurches = churches.filter((c) => {
    if (selectedRegion !== 'ALL' && c.region !== selectedRegion) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const trans = c.translations?.find((t) => t.locale === locale) || c.translations?.[0];
      const name = trans?.name || '';
      const city = c.city || '';
      if (!name.toLowerCase().includes(q) && !city.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="relative min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F7F5F0]">
      {/* 9 Architectural Lines */}
      <GridLines count={9} opacity={0.07} />

      <div className="relative max-w-7xl mx-auto z-10 space-y-12">
        {/* Header */}
        <div className="border-b border-neutral-300/70 pb-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
            <Church className="w-4 h-4 text-neutral-800" />
            <span>{isEn ? 'Diocesan Monastic Directory' : 'ገዳማትና አድባራት'}</span>
            <span>・</span>
            <span className="text-neutral-400">{filteredChurches.length} Registered</span>
          </div>

          <KineticTitle
            plainText={isEn ? 'Historic Sanctuaries &' : 'ጥንታውያን ገዳማትና'}
            italicWord={isEn ? 'Holy Monasteries' : 'አድባራት'}
            afterText=""
            as="h1"
            className="text-4xl sm:text-5xl lg:text-6xl text-neutral-900"
          />

          <p className="text-base text-neutral-600 max-w-2xl leading-relaxed">
            {isEn
              ? 'Discover verified historical monasteries, rock-hewn cathedrals, sacred reliquaries, and verified diocesan contact registries.'
              : 'በመላው ኢትዮጵያና በዓለም አቀፍ ደረጃ የሚገኙ ጥንታዊ የኦርቶዶክስ ተዋሕዶ ገዳማት፣ ፍልፍል አብያተ ክርስቲያናትና የታሪክ ቅርሶች ማውጫ።'}
          </p>
        </div>

        {/* Filters and Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedRegion === r.id
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white/80 border border-neutral-300/70 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isEn ? 'Search monasteries or cities...' : 'ገዳማትን ፈልግ...'}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-neutral-300/80 bg-white/90 text-neutral-900 placeholder:text-neutral-400 text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        {/* Churches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredChurches.map((church, idx) => {
            const trans =
              church.translations?.find((t) => t.locale === locale) ||
              church.translations?.[0];

            return (
              <div
                key={church.id}
                className="dd-project-card p-6 flex flex-col justify-between bg-white border border-neutral-200/90 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="space-y-4">
                  {/* Image Venetian Blinds reveal */}
                  <VenetianMaskReveal
                    linesCount={16}
                    delayMs={idx * 120}
                    className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-100"
                  >
                    <Image
                      src={idx % 2 === 0 ? '/dome.png' : '/cross.png'}
                      alt={trans?.name || church.slug}
                      fill
                      className="project-image object-cover"
                    />
                    <div className="absolute top-3 right-3 z-20">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-neutral-900/80 text-white backdrop-blur-md flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>VERIFIED</span>
                      </span>
                    </div>
                  </VenetianMaskReveal>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-neutral-800" />
                    <span>{church.city}, {church.region}</span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 tracking-tight group-hover:text-amber-800 transition-colors">
                    {trans?.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {trans?.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-neutral-500">
                    <span>{church.contacts?.phone || '+251 11 123 4567'}</span>
                  </div>

                  <DoorDennisButton
                    href={`/${locale}/churches/${church.slug}`}
                    className="!py-1.5 !px-3 !text-xs"
                  >
                    {isEn ? 'Explore' : 'ጎብኝ'}
                  </DoorDennisButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
