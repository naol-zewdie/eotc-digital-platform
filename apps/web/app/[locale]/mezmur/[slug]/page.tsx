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
  Lock,
} from 'lucide-react';
import { MezmurDto, RightsStatus } from '@eotc/contracts';

interface MezmurDetailPageProps {
  params: { locale: string; slug: string };
}

export default function MezmurDetailPage({ params }: MezmurDetailPageProps) {
  const locale = params.locale || 'am';
  const slug = params.slug;

  const [mezmur, setMezmur] = useState<MezmurDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [lyricsFontSize, setLyricsFontSize] = useState<number>(18);
  const [activeTab, setActiveTab] = useState<'LYRICS' | 'THEOLOGY' | 'DETAILS'>('LYRICS');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(locale);
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

[፫ኛ ክፍል]
ድንግል ሆይ ስምሽን ስጠራው ይጣፍጣል
የልቤ ሐዘን ሁሉ በምልጃሽ ይረሳል
በሰማይ መላእክት ያመሰግኑሻል
በምድርም የሰው ዘር ብፅዕት ይሉሻል።`,
        description: 'በዓመታዊና በወርሃዊ የበዓላት ዋዜማ የሚዘመር የታወቀ ያሬዳዊ የምስጋና መዝሙር።',
      },
      {
        locale: 'gez',
        title: 'ሰላም ለኪ ማርያም እመ አምላክ ንጽሕት',
        lyrics: `[፩]
ሰላም ለኪ ማርያም ድንግል
እመ ብርሃን ወእመ መድኅን
ተማኅፀነ በኪ ኩሎሙ ደቂቅኪ
ዕቀቢ አኃዊነ ወአኃቲነ በረድኤትኪ።

[ተቀብሎ]
ኦ ማርያም እመ አዶናይ
ስብሐት ለኪ በውስተ ሰማይ
ወዕረፍት ለነ ውስተ ምድር።`,
        description: 'ግዕዛዊ ማሕሌት ዘእግዝእትነ ማርያም።',
      },
      {
        locale: 'en',
        title: 'Peace Be Unto You, Blessed Mary Mother of God',
        lyrics: `[Stanza 1]
Peace be unto thee, Mary holy Mother of grace and refuge,
Dwelling place of love and eternal light.
Shelter us beneath the shadow of your intercession,
Preserve us from the storms of this present age.

[Refrain]
Thou who stood at the foot of Golgotha's Cross,
Comforter of the Holy Apostles,
Stand as intercessor for your faithful servants,
Pleading for mercy before your only-begotten Son.`,
        description: 'Authorized English translation of traditional Marian hymnody.',
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
        console.warn('Fallback to demo mezmur data:', err);
        setMezmur(fallbackMezmur);
      } finally {
        setLoading(false);
      }
    }
    fetchMezmur();
  }, [slug]);

  const activeTranslation =
    mezmur?.translations.find((t) => t.locale === selectedLanguage) ||
    mezmur?.translations.find((t) => t.locale === locale) ||
    mezmur?.translations[0];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0B0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  const currentMezmur = mezmur || fallbackMezmur;

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-neutral-100 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#24201A] bg-[#14120F]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/mezmur`}
              className="hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{locale === 'am' ? 'ወደ መዝሙራት ዝርዝር ተመለስ' : 'Back to Mezmurs'}</span>
            </Link>
            <span>/</span>
            <span className="text-white truncate max-w-xs">{activeTranslation?.title}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? (locale === 'am' ? 'ተቀድቷል!' : 'Copied!') : locale === 'am' ? 'አጋራ' : 'Share'}</span>
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content: Lyrics Player */}
          <div className="lg:col-span-8 space-y-6">
            {/* Audio Player Card */}
            <div className="rounded-2xl bg-gradient-to-b from-[#1C1914] to-[#12100E] border border-[#332C20] p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2B251B]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 mb-2">
                    <Music className="w-3 h-3" />
                    <span>{currentMezmur.category?.nameAm || currentMezmur.category?.nameEn || 'መዝሙር'}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {activeTranslation?.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-400">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="font-medium text-neutral-300">
                      {currentMezmur.artist?.nameAm || currentMezmur.artist?.nameEn}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      4:20
                    </span>
                  </div>
                </div>

                {/* Rights Authorization Seal */}
                <div className="self-start sm:self-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F291E] border border-[#166534] text-emerald-400 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <div>
                      <div>{locale === 'am' ? 'የተፈቀደ ይዘት' : 'Rights Verified'}</div>
                      <div className="text-[10px] text-emerald-500/80 font-normal">
                        {currentMezmur.rights?.rightsHolder || 'Mahbere Kidusan'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Streaming Audio Controls */}
              <div className="pt-6">
                {/* Progress bar simulator */}
                <div className="w-full bg-[#2A241A] rounded-full h-1.5 mb-3 overflow-hidden cursor-pointer">
                  <div className="bg-gradient-to-r from-[#D4AF37] to-amber-500 h-1.5 rounded-full w-1/3" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-4">
                  <span>1:28</span>
                  <span>4:20</span>
                </div>

                {/* Main player buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:brightness-110 text-black flex items-center justify-center shadow-lg transition-transform active:scale-95"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>

                    <button
                      onClick={() => setIsPlaying(false)}
                      className="p-2.5 rounded-full bg-[#241F18] hover:bg-[#302A21] text-neutral-300 transition-colors"
                      title="Rewind"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2.5 rounded-full bg-[#241F18] hover:bg-[#302A21] text-neutral-300 transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Rights-Gated Download */}
                  {currentMezmur.rights?.downloadAllowed ? (
                    <a
                      href="#download"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(locale === 'am' ? 'የመዝሙር ኦዲዮ ፋይል በማውረድ ላይ...' : 'Downloading verified audio file...');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#881337] hover:bg-[#9F1239] text-white shadow transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{locale === 'am' ? 'ኦዲዮ አውርድ' : 'Download Audio'}</span>
                    </a>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 text-xs">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{locale === 'am' ? 'ማውረድ የተገደበ' : 'Protected Stream'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lyrics Section */}
            <div className="rounded-2xl bg-[#14120F] border border-[#262118] p-6 shadow-md">
              {/* Lyrics Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#241E15]">
                {/* Language Switcher for Lyrics */}
                <div className="flex items-center gap-1.5 bg-[#1C1813] p-1 rounded-xl border border-[#2F291E]">
                  <button
                    onClick={() => setSelectedLanguage('am')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedLanguage === 'am' ? 'bg-[#881337] text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    አማርኛ
                  </button>
                  <button
                    onClick={() => setSelectedLanguage('gez')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedLanguage === 'gez' ? 'bg-[#881337] text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    ግዕዝ
                  </button>
                  <button
                    onClick={() => setSelectedLanguage('en')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedLanguage === 'en' ? 'bg-[#881337] text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>

                {/* Font Size Adjusters */}
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Type className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{locale === 'am' ? 'የፊደል መጠን፦' : 'Font Size:'}</span>
                  <button
                    onClick={() => setLyricsFontSize(Math.max(14, lyricsFontSize - 2))}
                    className="w-7 h-7 rounded bg-[#201B14] hover:bg-[#2C251C] text-white flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono text-white text-xs px-1">{lyricsFontSize}px</span>
                  <button
                    onClick={() => setLyricsFontSize(Math.min(28, lyricsFontSize + 2))}
                    className="w-7 h-7 rounded bg-[#201B14] hover:bg-[#2C251C] text-white flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Lyrics Content Display */}
              <div className="pt-6">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-[#D4AF37] flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>{locale === 'am' ? 'የመዝሙር ግጥም (ስንኞች)' : 'Lyric Stanzas'}</span>
                  </h2>
                  {activeTranslation?.description && (
                    <p className="text-xs text-neutral-400 mt-1 italic">
                      {activeTranslation.description}
                    </p>
                  )}
                </div>

                <div
                  className="p-6 rounded-xl bg-[#0E0C0A] border border-[#1E1912] font-serif leading-loose whitespace-pre-line text-neutral-200 transition-all select-text"
                  style={{ fontSize: `${lyricsFontSize}px` }}
                >
                  {activeTranslation?.lyrics || (
                    <div className="text-neutral-500 italic">
                      {locale === 'am' ? 'ለዚህ ቋንቋ የተመዘገበ ግጥም የለም።' : 'No lyrics registered for this language.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Choir Bio & Canonical Metadata */}
          <div className="lg:col-span-4 space-y-6">
            {/* Choir Card */}
            <div className="rounded-2xl bg-[#14120F] border border-[#262118] p-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 text-[#D4AF37]">
                {locale === 'am' ? 'ስለ መዘምራኑ / ዘማሪው' : 'About Choir & Artist'}
              </h3>
              <div className="p-4 rounded-xl bg-[#0E0C0A] border border-[#201B14] mb-3">
                <div className="font-bold text-white text-base mb-1">
                  {currentMezmur.artist?.nameAm}
                </div>
                {currentMezmur.artist?.nameEn && (
                  <div className="text-xs text-neutral-400 mb-2">
                    {currentMezmur.artist.nameEn}
                  </div>
                )}
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {(locale === 'am' ? currentMezmur.artist?.bioAm : currentMezmur.artist?.bioEn) ||
                    currentMezmur.artist?.bioAm}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#1E1912] text-neutral-400">
                  <span>{locale === 'am' ? 'የመዘምራን ዓይነት' : 'Artist Type'}</span>
                  <span className="font-semibold text-white">
                    {currentMezmur.artist?.isChoir ? (locale === 'am' ? 'የሰንበት ት/ቤት መዘምራን' : 'Choir Ensemble') : (locale === 'am' ? 'ዘማሪ' : 'Soloist')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#1E1912] text-neutral-400">
                  <span>{locale === 'am' ? 'ድምር እይታዎች' : 'Total Plays'}</span>
                  <span className="font-semibold text-white">
                    {currentMezmur.playCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 text-neutral-400">
                  <span>{locale === 'am' ? 'የቀኖና ምዝገባ' : 'Canonical Status'}</span>
                  <span className="font-semibold text-emerald-400">
                    {locale === 'am' ? 'የተረጋገጠ' : 'Canonical'}
                  </span>
                </div>
              </div>
            </div>

            {/* Liturgical Guidance Note */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1C1115] to-[#120B0E] border border-[#4C1221] p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-300 mb-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>{locale === 'am' ? 'ሥርዓተ ማሕሌትና ዜማ' : 'Liturgical Guidance'}</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {locale === 'am'
                  ? 'ይህ መዝሙር በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ሥርዓተ አምልኮ መሠረት በዓበይት በዓላትና በሰንበት ዋዜማ ለመዘመር የተፈቀደ ቀኖናዊ ይዘት ያለው ነው።'
                  : 'Authorized for use in liturgical services, Sunday schools, and holy feasts according to the canonical hymnody traditions of the EOTC.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
