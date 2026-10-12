'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Music,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ShieldCheck,
  Download,
  Share2,
  ArrowLeft,
  Users,
  Clock,
  Sparkles,
  Type,
  FileText,
  Check,
} from 'lucide-react';
import { MezmurDto, RightsStatus } from '@eotc/contracts';
import { GridLines } from '../../../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../../../components/DoorDennis/DoorDennisButton';
import { TextScrambler } from '../../../../components/DoorDennis/TextScrambler';

interface MezmurDetailPageProps {
  params: { locale: string; slug: string };
}

export default function MezmurDetailPage({ params }: MezmurDetailPageProps) {
  const locale = params.locale || 'am';
  const slug = params.slug;
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const [mezmur, setMezmur] = useState<MezmurDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [lyricsFontSize, setLyricsFontSize] = useState<number>(18);
  const [activeTab, setActiveTab] = useState<'LYRICS' | 'THEOLOGY' | 'DETAILS'>('LYRICS');
  const [copied, setCopied] = useState(false);

  // Fallback detail
  const fallbackMezmur: MezmurDto = {
    id: 'mezmur-mk-01',
    slug: 'selam-leki-maryam-kibrite',
    status: 'PUBLISHED' as any,
    playCount: 14200,
    viewCount: 28400,
    publishedAt: '2026-01-10T00:00:00.000Z',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-10',
    artist: {
      id: 'art-mk-choir',
      slug: 'mahbere-kidusan-choir',
      nameAm: 'ማኅበረ ቅዱሳን ማዕከላዊ መዘምራን',
      nameGez: 'ማኅበረ ቅዱሳን',
      nameEn: 'Mahbere Kidusan Central Choir',
      bioAm: 'ከ፲፱፻፹፬ ዓ.ም ጀምሮ በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ስብከተ ወንጌልና ያሬዳዊ ዜማን የሚያስፋፋ መንፈሳዊ ማኅበር።',
      bioEn: 'Pioneering Orthodox Christian choir and pastoral ministry founded in 1991.',
      isChoir: true,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    category: {
      id: 'cat-mariam',
      slug: 'mariam',
      nameAm: 'የእመቤታችን ማርያም ምስጋና',
      nameGez: 'ዘእግዝእትነ',
      nameEn: 'Hymns of St. Mary (Theotokos)',
    },
    rights: {
      id: 'rights-mk-01',
      status: RightsStatus.PERMISSION_GRANTED,
      rightsHolder: 'Mahbere Kidusan Audio Archive & EOTC Synod',
      downloadAllowed: true,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    translations: [
      {
        locale: 'am',
        title: 'ሰላም ለኪ ማርያም ክብርት እናቴ',
        lyrics: `[፩ኛ ክፍል]
ሰላም ለኪ ማርያም ክብርት እናቴ
የፍቅር እናት የሰላም ማደሪያዬ
በጸሎትሽ ጥላ ሥር አሳርፊኝ
ከክፉው ዓለም ማዕበል ጠብቂኝ።

[አዝማች]
በቀራንዮ መስቀል ሥር የቆምሽው
የሐዋርያት መጽናኛ የሆንሽው
ዛሬም ለልጆችሽ አማላጅ ሁኚልን
ከአንድ ልጅሽ ዘንድ ምሕረትን ለምኝልን።

[፪ኛ ክፍል]
የሙሴ ጽላት የአሮን በትር አንቺ ነሽ
የኤልያስ መሶብ የማትጎድይው ፍሬሽ
በድንግልና ጸንተሽ አምላክን የወለድሽ
ዓለም ከጨለማ በብርሃንሽ ወጣሽ።

[ማጠቃለያ]
ሰላም ለኪ እያልን እናመሰግንሻለን
በመንፈስ ቅዱስ ጸጋ እንዘምርልሻለን
እስከ ዘለዓለም ድረስ ስምሽ የተመሰገነ ይሁን።`,
      },
      {
        locale: 'en',
        title: 'Peace Be Unto You, O Blessed Mary My Mother',
        lyrics: `[Part 1]
Peace be unto you, Mary, my glorious mother,
Mother of love and sanctuary of peace,
Shelter me beneath the shadow of your prayers,
And guard me from the tempests of this fallen world.

[Refrain]
You who stood at the foot of Golgotha's Cross,
The steadfast comfort of the holy Apostles,
Be our intercessor today for your children,
Pleading for mercy from your only-begotten Son.

[Part 2]
You are the Tablet of Moses and the Rod of Aaron,
The Vessel of Elijah bearing fruit that never fails,
Remaining in perpetual virginity, you bore our God,
And from darkness, the world emerged into your light.

[Conclusion]
Singing "Peace be unto you," we magnify your name,
Through the grace of the Holy Spirit we offer our praise,
Blessed be your sacred memory throughout all generations.`,
      },
    ],
  };

  useEffect(() => {
    async function fetchMezmur() {
      try {
        const res = await fetch(`http://localhost:4000/api/v1/mezmur/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setMezmur(data);
        } else {
          setMezmur(fallbackMezmur);
        }
      } catch (err) {
        setMezmur(fallbackMezmur);
      } finally {
        setLoading(false);
      }
    }
    fetchMezmur();
  }, [slug]);

  const currentMezmur = mezmur || fallbackMezmur;
  const activeTranslation =
    currentMezmur.translations.find((t) => t.locale === locale) ||
    currentMezmur.translations[0];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
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
            href={`/${locale}/mezmur`}
            className="group inline-flex items-center gap-2 text-[#5C5A56] hover:text-[#201F1E] transition-colors"
          >
            <span className="w-6 h-6 rounded-lg border border-[#201F1E]/15 flex items-center justify-center group-hover:border-[#201F1E] group-hover:bg-[#201F1E] group-hover:text-[#F7F5F0] transition-all">
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
            <span className="uppercase tracking-wider font-semibold">
              {isEn ? 'Back to Hymnody' : isGez ? 'ተመየጥ ኀበ ማኅሌት' : 'ወደ መዝሙራት ዝርዝር ተመለስ'}
            </span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#201F1E]/15 text-[#5C5A56] hover:text-[#201F1E] hover:border-[#201F1E] hover:bg-[#FAF9F6] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">{isEn ? 'Copied Link' : 'ተቀድቷል!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Share Hymn' : 'አጋራ'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Column (Span 8): Streaming Audio Player & Lyrics */}
          <div className="lg:col-span-8 space-y-8">
            {/* Door Dennis Styled Audio Player Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#201F1E]/10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#201F1E] text-[#F7F5F0]">
                    <Music className="w-3 h-3 text-[#C89D3C]" />
                    <span>{currentMezmur.category?.nameAm || currentMezmur.category?.nameEn || 'ያሬዳዊ ዜማ'}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#201F1E] leading-tight">
                    {activeTranslation?.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#5C5A56] pt-1">
                    <span className="flex items-center gap-1.5 font-semibold text-[#201F1E]">
                      <Users className="w-3.5 h-3.5 text-[#C89D3C]" />
                      <span>{currentMezmur.artist?.nameAm || currentMezmur.artist?.nameEn}</span>
                    </span>
                    <span>・</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>4:20 min</span>
                    </span>
                  </div>
                </div>

                {/* Rights Verification Chip */}
                <div className="shrink-0 self-start">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#201F1E]/15 text-xs font-mono font-semibold text-[#201F1E]">
                    <ShieldCheck className="w-4 h-4 text-[#C89D3C]" />
                    <span>{isEn ? 'Archival Rights Verified' : 'በይፋ የተፈቀደ ይዘት'}</span>
                  </div>
                </div>
              </div>

              {/* Streaming Controls Bar */}
              <div className="space-y-4">
                {/* Progress Track */}
                <div className="w-full bg-[#EDEAE3] rounded-full h-2 overflow-hidden cursor-pointer">
                  <div className="bg-[#C89D3C] h-2 rounded-full w-2/5 transition-all" />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[#7A7771]">
                  <span>1:44</span>
                  <span>4:20</span>
                </div>

                {/* Main Player Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-12 h-12 rounded-2xl bg-[#201F1E] text-[#F7F5F0] hover:bg-[#33312E] flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-10 h-10 rounded-xl border border-[#201F1E]/15 hover:border-[#201F1E] flex items-center justify-center text-[#201F1E] transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Font Size Tuners */}
                  <div className="flex items-center gap-1 border border-[#201F1E]/15 rounded-xl p-1 bg-[#FAF9F6] text-xs font-mono">
                    <span className="px-2 text-[#7A7771] flex items-center gap-1">
                      <Type className="w-3.5 h-3.5" />
                      <span>{lyricsFontSize}px</span>
                    </span>
                    <button
                      onClick={() => setLyricsFontSize((prev) => Math.max(14, prev - 2))}
                      className="w-7 h-7 rounded-lg hover:bg-[#EDEAE3] flex items-center justify-center font-bold text-[#201F1E]"
                      title="Smaller Font"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setLyricsFontSize((prev) => Math.min(26, prev + 2))}
                      className="w-7 h-7 rounded-lg hover:bg-[#EDEAE3] flex items-center justify-center font-bold text-[#201F1E]"
                      title="Larger Font"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Tab Switcher matching Door Dennis Category Tabs */}
            <div className="flex items-center gap-2 border-b border-[#201F1E]/10 pb-4">
              {[
                { id: 'LYRICS', label: isEn ? 'Chant Lyrics' : 'የዜማ ግጥም / ንባብ' },
                { id: 'THEOLOGY', label: isEn ? 'Theological Insight' : 'ሥነ መለኮታዊ ትርጓሜ' },
                { id: 'DETAILS', label: isEn ? 'Liturgical Notes' : 'ሥርዓተ ዜማና ማብራሪያ' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#201F1E] text-[#F7F5F0] shadow-sm'
                        : 'text-[#5C5A56] hover:text-[#201F1E] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Sacred Lyrics Content */}
            {activeTab === 'LYRICS' && (
              <div className="p-6 sm:p-10 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-6">
                <div
                  className="font-serif leading-loose text-[#201F1E] whitespace-pre-line select-text"
                  style={{ fontSize: `${lyricsFontSize}px` }}
                >
                  {activeTranslation?.lyrics}
                </div>
              </div>
            )}

            {/* Tab 2: Theological Insight */}
            {activeTab === 'THEOLOGY' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-4">
                <h3 className="text-lg font-bold font-serif text-[#201F1E]">
                  {isEn ? 'Theological Exegesis of the Hymn' : 'የመዝሙሩ ሥነ መለኮታዊ ትርጓሜ'}
                </h3>
                <p className="text-sm text-[#5C5A56] leading-relaxed font-serif">
                  {isEn
                    ? 'This hymn draws directly upon the patristic typology of the Ark of the Covenant, Aaron\'s budding rod, and the bush that burned without being consumed, affirming the virgin birth and the mystery of the Incarnation.'
                    : 'ይህ መዝሙር በእመቤታችን በቅድስት ድንግል ማርያም ምሳሌነት የተነገሩትን የብሉይ ኪዳን ምሥጢራትን (የሙሴን ጽላት፣ የአሮንን በትርና የማይቃጠለውን ሐመልማል) ከመድኃኒታችን ከኢየሱስ ክርስቶስ ሰው መሆን ምሥጢር ጋር አጣምሮ የሚያስረዳ ጥልቅ የነገረ ማርያም ትምህርት ነው።'}
                </p>
              </div>
            )}

            {/* Tab 3: Liturgical Notes */}
            {activeTab === 'DETAILS' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#EDEAE3] space-y-1">
                    <span className="text-[#7A7771] uppercase">የዜማ ስልት / Mode:</span>
                    <div className="font-bold text-[#201F1E]">ግዕዝና ዕዝል (Ge'ez & Ezel)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#EDEAE3] space-y-1">
                    <span className="text-[#7A7771] uppercase">የበዓሉ ወቅት / Season:</span>
                    <div className="font-bold text-[#201F1E]">የልደትና የአስተርእዮ በዓላት</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#EDEAE3] space-y-1">
                    <span className="text-[#7A7771] uppercase">ማኅደር / Source:</span>
                    <div className="font-bold text-[#201F1E]">የማኅበረ ቅዱሳን ድምፅ ማኅደር</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#EDEAE3] space-y-1">
                    <span className="text-[#7A7771] uppercase">ፈቃድ / Canonical License:</span>
                    <div className="font-bold text-[#201F1E]">Ecclesiastical Audio Copyright 2026</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column (Span 4): Choir Profile & Support */}
          <div className="lg:col-span-4 space-y-6">
            {/* Choir Card */}
            <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#201F1E] text-[#F7F5F0] flex items-center justify-center font-serif text-lg font-bold shrink-0">
                  ✝
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#201F1E] font-serif">
                    {currentMezmur.artist?.nameAm || currentMezmur.artist?.nameEn}
                  </h2>
                  <span className="text-[11px] font-mono text-[#5C5A56]">
                    {isEn ? 'Patriarchate Recognized Choir' : 'የቤተክርስቲያን መዘምራን'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#5C5A56] leading-relaxed">
                {currentMezmur.artist?.bioAm || currentMezmur.artist?.bioEn}
              </p>

              <div className="pt-2 border-t border-[#201F1E]/10">
                <DoorDennisButton href={`/${locale}/mezmur`}>
                  {isEn ? 'More Sacred Chants' : 'ተጨማሪ መዝሙራት'}
                </DoorDennisButton>
              </div>
            </div>

            {/* Donation / Support Note */}
            <div className="p-6 rounded-3xl bg-[#EDEAE3] border border-[#201F1E]/10 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#201F1E] font-bold">
                {isEn ? 'Support Monastic Cantors' : 'የአብነት መምህራንን ይደግፉ'}
              </span>
              <p className="text-xs text-[#5C5A56] leading-relaxed">
                {isEn
                  ? 'All archival chant documentation directly aids rural monastery schools and master chant cantors across Ethiopia.'
                  : 'የዚህ መድረክ የድምፅ ማኅደር ገቢ በቀጥታ በአብነት ትምህርት ቤቶች ለሚገኙ የዜማ መምህራንና ደቀ መዛሙርት ድጋፍ ይውላል።'}
              </p>
              <div className="pt-1">
                <Link
                  href={`/${locale}/donate`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#201F1E] hover:text-[#C89D3C] transition-colors"
                >
                  <span>{isEn ? 'Contribute to Zema Fund' : 'የዜማ ፈንድ ይደግፉ'}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
