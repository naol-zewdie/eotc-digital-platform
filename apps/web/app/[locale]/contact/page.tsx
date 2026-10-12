'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { GridLines } from '../../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../../components/DoorDennis/DoorDennisButton';
import { TextScrambler } from '../../../components/DoorDennis/TextScrambler';

interface ContactPageProps {
  params: { locale: string };
}

export default function ContactPage({ params }: ContactPageProps) {
  const locale = params.locale || 'am';
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const topics = isEn
    ? [
        'Illuminated Manuscripts Archiving',
        'Sacred Yared Chant Recordings',
        'Historic Monastery Preservation',
        'Patristic Academic Research',
        'Charitable Heritage Donation',
        'Ecclesiastical Partnership',
      ]
    : isGez
    ? [
        'መጻሕፍተ ብራና',
        'ማኅሌት ዘቅዱስ ያሬድ',
        'ዕቀባ አድባራት ወገዳማት',
        'ምርምር ሃይማኖት',
        'ምጽዋት ወድጋፍ',
        'ኅብረት መንፈሳዊ',
      ]
    : [
        'የብራና መጻሕፍት ጥናትና ምዝገባ',
        'ያሬዳዊ ዜማና ማኅሌት ቅጂ',
        'የገዳማትና አድባራት ቅርስ ጥበቃ',
        'የነገረ መለኮት ምርምር ትብብር',
        'በጎ አድራጎትና የቅርስ ድጋፍ',
        'የአብነት ትምህርት ቤቶች ድጋፍ',
      ];

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="relative min-h-screen bg-[#F7F5F0] text-[#201F1E] pb-32 overflow-hidden">
      {/* 9 Architectural Vertical Grid Lines */}
      <GridLines count={9} opacity={0.08} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 z-10 space-y-16">
        {/* Header Block matching Door Dennis Contact Header */}
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C89D3C] animate-pulse" />
            <TextScrambler
              text={
                isEn
                  ? 'Let\'s Connect ・ Patriarchate Inquiries'
                  : 'የቀጥታ ግንኙነት መስመር ・ ክፍት 24/7'
              }
              className="text-xs font-mono uppercase tracking-widest text-[#5C5A56] font-semibold"
            />
          </div>

          <KineticTitle
            plainText={isEn ? 'Reach Out &' : 'ከቤተክርስቲያን ጋር'}
            italicWord={isEn ? 'Connect' : 'ይገናኙ'}
            afterText={isEn ? 'with the Patriarchate' : ''}
            as="h1"
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#201F1E] leading-[1.08]"
          />

          <p className="text-base sm:text-lg text-[#5C5A56] max-w-2xl font-normal leading-relaxed">
            {isEn
              ? 'Whether seeking manuscript research access, liturgical consultation, or supporting endangered monastery archives, we welcome your inquiry.'
              : 'ስለ ጥንታዊ የብራና መጻሕፍት፣ ያሬዳዊ ዜማዎች፣ የገዳማት ታሪክ ወይም ስለ ቅርስ ጥበቃ ትብብር ማንኛውም ጥያቄና አስተያየት ካለዎት መልእክትዎን ይላኩልን።'}
          </p>
        </div>

        {/* Form and Contact Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Form (Span 7) */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-8">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h2 className="text-2xl font-bold font-serif text-[#201F1E]">
                  {isEn ? 'Message Delivered with Blessings' : 'መልእክትዎ ደርሶናል! እናመሰግናለን'}
                </h2>
                <p className="text-sm text-[#5C5A56] max-w-md mx-auto leading-relaxed">
                  {isEn
                    ? 'The Patriarchate Secretariat has received your message and our archival team will respond promptly.'
                    : 'የመንበረ ፓትርያርክ ጠቅላይ ጽሕፈት ቤት የመዛግብት ክፍል መልእክትዎን ተቀብሏል፤ በአጭር ጊዜ ውስጥ ምላሽ እንሰጣለን።'}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', message: '' });
                      setSelectedTopics([]);
                    }}
                    className="px-6 py-2.5 rounded-xl border border-[#201F1E]/20 text-xs font-mono font-bold text-[#201F1E] hover:bg-[#201F1E] hover:text-[#F7F5F0] transition-all cursor-pointer"
                  >
                    {isEn ? 'Send Another Inquiry' : 'ተጨማሪ መልእክት ላክ'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Topic selection pills */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono uppercase tracking-widest text-[#5C5A56] font-semibold">
                    {isEn ? 'What can we assist you with?' : 'በምን ልንተባበር እንችላለን? (ምርጫዎን ይጫኑ)'}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {topics.map((topic, i) => {
                      const isSelected = selectedTopics.includes(topic);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleTopic(topic)}
                          className={`px-3.5 py-2 rounded-2xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer border ${
                            isSelected
                              ? 'bg-[#201F1E] text-[#F7F5F0] border-[#201F1E] shadow-sm scale-[1.02]'
                              : 'bg-[#F7F5F0] text-[#5C5A56] border-[#201F1E]/15 hover:border-[#201F1E]/40 hover:text-[#201F1E]'
                          }`}
                        >
                          {isSelected && <span className="text-[#C89D3C] mr-1.5 font-bold">✓</span>}
                          <span>{topic}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Input Fields with Door Dennis Minimal Floating Aesthetics */}
                <div className="space-y-6 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-[#5C5A56] uppercase tracking-wider">
                        {isEn ? 'Full Name *' : 'ሙሉ ስም *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={isEn ? 'e.g. Deacon Michael' : 'ምሳሌ፦ ዲያቆን ሚካኤል'}
                        className="w-full px-4 py-3 rounded-2xl border border-[#201F1E]/15 bg-[#F7F5F0] text-[#201F1E] placeholder:text-[#7A7771] focus:outline-none focus:border-[#C89D3C] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[#5C5A56] uppercase tracking-wider">
                        {isEn ? 'Email Address *' : 'ኢሜይል *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.org"
                        className="w-full px-4 py-3 rounded-2xl border border-[#201F1E]/15 bg-[#F7F5F0] text-[#201F1E] placeholder:text-[#7A7771] focus:outline-none focus:border-[#C89D3C] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[#5C5A56] uppercase tracking-wider">
                      {isEn ? 'Phone Number (Optional)' : 'ስልክ ቁጥር (ከተፈለገ)'}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+251 91 123 4567"
                      className="w-full px-4 py-3 rounded-2xl border border-[#201F1E]/15 bg-[#F7F5F0] text-[#201F1E] placeholder:text-[#7A7771] focus:outline-none focus:border-[#C89D3C] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[#5C5A56] uppercase tracking-wider">
                      {isEn ? 'Your Message *' : 'መልእክትዎ *'}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        isEn
                          ? 'Describe your archival inquiry or collaboration idea...'
                          : 'ስለሚፈልጉት የቅርስ ጥናት፣ መዝገብ ወይም ትብብር በዝርዝር ይጻፉ...'
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-[#201F1E]/15 bg-[#F7F5F0] text-[#201F1E] placeholder:text-[#7A7771] focus:outline-none focus:border-[#C89D3C] transition-colors leading-relaxed"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <DoorDennisButton onClick={() => {}}>
                    {submitting ? '...' : isEn ? 'Send Ecclesiastical Inquiry' : 'መልእክቱን ላክ'}
                  </DoorDennisButton>
                </div>
              </form>
            )}
          </div>

          {/* Direct Channels Sidebar (Span 5) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Patriarchate Info Card */}
            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#201F1E]/10 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#201F1E] text-[#F7F5F0] flex items-center justify-center font-serif text-lg font-bold">
                  ✝
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-[#201F1E]">
                    {isEn ? 'Patriarchate Supreme Secretariat' : 'መንበረ ፓትርያርክ ጠቅላይ ጽሕፈት ቤት'}
                  </h3>
                  <span className="text-[11px] font-mono text-[#5C5A56]">
                    {isEn ? 'Holy Synod Digital Archives' : 'የቅዱስ ሲኖዶስ ዲጂታል መዛግብት'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs font-mono text-[#5C5A56] pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C89D3C] shrink-0 mt-0.5" />
                  <span className="text-[#201F1E] leading-relaxed">
                    መንበረ ፓትርያርክ ቅዱስ ሲኖዶስ፣ ዮሐንስ አደባባይ፣ አዲስ አበባ፣ ኢትዮጵያ
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C89D3C] shrink-0" />
                  <a href="tel:+251111234567" className="text-[#201F1E] hover:text-[#C89D3C] transition-colors">
                    +251 11 123 4567
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C89D3C] shrink-0" />
                  <a
                    href="mailto:heritage@eotc-archive.org"
                    className="text-[#201F1E] hover:text-[#C89D3C] transition-colors"
                  >
                    heritage@eotc-archive.org
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#C89D3C] shrink-0" />
                  <span>ሰኞ - ዓርብ ከጠዋቱ 2:30 - 11:30 (EAT UTC+3)</span>
                </div>
              </div>
            </div>

            {/* Canonical Assistance Notice */}
            <div className="p-8 rounded-3xl bg-[#EDEAE3] border border-[#201F1E]/10 space-y-3 text-xs">
              <span className="font-mono uppercase tracking-widest text-[#201F1E] font-bold block">
                {isEn ? 'Global Diaspora Archival Support' : 'የዲያስፖራ አህጉረ ስብከት ድጋፍ'}
              </span>
              <p className="text-[#5C5A56] leading-relaxed">
                {isEn
                  ? 'For international dioceses, parishes, and universities requesting microfilms or digital parchment scans, please state your diocesan affiliation in your inquiry.'
                  : 'በውጭ ሀገር የሚገኙ አህጉረ ስብከት፣ አድባራትና ዩኒቨርሲቲዎች ጥንታዊ የብራና ማይክሮፊልሞችንና ዲጂታል ቅጂዎችን ለመጠየቅ የሀገረ ስብከቱን ስም በማመልከቻው ላይ ይጥቀሱ።'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
