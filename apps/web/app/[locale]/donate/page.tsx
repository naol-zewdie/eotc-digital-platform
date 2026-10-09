'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Building,
  Smartphone,
  Globe2,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { GridLines } from '../../../components/DoorDennis/GridLines';
import { KineticTitle } from '../../../components/DoorDennis/KineticTitle';
import { DoorDennisButton } from '../../../components/DoorDennis/DoorDennisButton';
import { VenetianMaskReveal } from '../../../components/DoorDennis/VenetianMaskReveal';

interface DonatePageProps {
  params: { locale: string };
}

export default function DonatePage({ params }: DonatePageProps) {
  const locale = params.locale || 'am';
  const isEn = locale === 'en';
  const isGez = locale === 'gez';

  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [selectedGateway, setSelectedGateway] = useState<string>('telebirr');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const campaigns = [
    {
      id: 'c1',
      title: isEn ? 'Debre Damo Monastery Restoration' : 'የደብረ ዳሞ ጥንታዊ ገዳም እድሳትና ቅርስ ጥበቃ',
      desc: isEn
        ? 'Restoring the 6th-century cliff monastery and preserving illuminated manuscripts.'
        : 'በ፮ኛው መቶ ክፍለ ዘመን በአቡነ አረጋዊ የተመሠረተውን ታላቅ ገዳምና የጥንት ብራና መጻሕፍት ቅርስ የመጠበቅ ፕሮጀክት።',
      raised: '6,840,000 ETB',
      target: '15,000,000 ETB',
      progress: 45,
      tag: 'Monastery & Manuscripts',
    },
    {
      id: 'c2',
      title: isEn ? 'Synod Humanitarian Relief Fund' : 'የቅዱስ ሲኖዶስ የሰብአዊ እርዳታና የተፈናቀሉ ወገኖች ፈንድ',
      desc: isEn
        ? 'Emergency assistance and sustenance for displaced Orthodox families across dioceses.'
        : 'በተለያዩ አህጉረ ስብከት በችግርና በመፈናቀል ውስጥ ለሚገኙ ምእመናን የምግብና የመጠለያ እርዳታ ማድረሻ ፈንድ።',
      raised: '14,200,000 ETB',
      target: '25,000,000 ETB',
      progress: 57,
      tag: 'Humanitarian Care',
    },
    {
      id: 'c3',
      title: isEn ? 'Traditional Church Scholars & Schools' : 'የአብነት ትምህርት ቤቶችና የመምህራን ድጋፍ',
      desc: isEn
        ? 'Sustaining masters of poetry (Qine), chanting (Zema), and liturgy across historical scriptoria.'
        : 'የቅኔ፣ የዜማና የመጻሕፍት መምህራንንና ደቀ መዛሙርትን በቋሚነት የመደገፍና የአብነት ትምህርትን የማስቀጠል ፈንድ።',
      raised: '9,150,000 ETB',
      target: '12,000,000 ETB',
      progress: 76,
      tag: 'Traditional Education',
    },
  ];

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  return (
    <div className="relative min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F0F0F0]">
      {/* 9 Architectural Lines */}
      <GridLines count={9} opacity={0.07} />

      <div className="relative max-w-7xl mx-auto z-10 space-y-16">
        {/* Header */}
        <div className="border-b border-neutral-300/70 pb-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
            <Heart className="w-4 h-4 text-neutral-800" />
            <span>{isEn ? 'Ecclesiastical Giving' : 'ምጽዋትና ድጋፍ'}</span>
            <span>・</span>
            <span className="text-neutral-400">Canonical Synodal Oversight</span>
          </div>

          <KineticTitle
            plainText={isEn ? 'Preserve Our Heritage &' : 'ለቤተክርስቲያን ቅርስና'}
            italicWord={isEn ? 'Support Living Sanctuaries' : 'አገልግሎት ምጽዋት'}
            afterText=""
            as="h1"
            className="text-4xl sm:text-5xl lg:text-6xl text-neutral-900"
          />

          <p className="text-base text-neutral-600 max-w-2xl leading-relaxed">
            {isEn
              ? 'Every canonical donation directly protects ancient parchments, feeds monastic communities, and supports traditional schools of liturgical knowledge.'
              : 'የሚሰጡት መንፈሳዊ ምጽዋት በቀጥታ ለጥንታዊ የብራና መጻሕፍት ጥበቃ፣ ለገዳማውያን አበው ድጋፍና ለአብነት ትምህርት ቤቶች ቀጣይነት ይውላል።'}
          </p>
        </div>

        {/* 2-Column Donation Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Campaigns */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">
              ክፍል ፩ ・ Active Preservation Campaigns
            </div>

            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="dd-project-card p-6 bg-white border border-neutral-200/90 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-semibold">
                    {camp.tag}
                  </span>
                  <span>{camp.progress}% Funded</span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900">
                  {camp.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {camp.desc}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 rounded-full"
                      style={{ width: `${camp.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span>Raised: {camp.raised}</span>
                    <span>Goal: {camp.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Donation Form Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h3 className="text-xl font-bold text-neutral-900">
                  {isEn ? 'Direct Contribution' : 'ቀጥታ የድጋፍ መስጫ'}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  100% verified ecclesiastical transaction
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-neutral-900">
                    {isEn ? 'Thank you for your generosity!' : 'እግዚአብሔር ያክብርልን!'}
                  </h4>
                  <p className="text-xs text-neutral-600">
                    {isEn
                      ? 'Your pledge has been received with canonical apostolic blessing.'
                      : 'የተሰጠው ምጽዋት በቤተክርስቲያኗ በረከትና ምስጋና ተመዝግቧል።'}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-neutral-800 underline mt-2"
                  >
                    {isEn ? 'Make another pledge' : 'ሌላ ድጋፍ ይስጡ'}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-6"
                >
                  {/* Select Amount */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                      {isEn ? 'Select Amount (ETB)' : 'የመጠኑ ምርጫ (ብር)'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {presetAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setSelectedAmount(amt)}
                          className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                            selectedAmount === amt
                              ? 'bg-neutral-900 text-white shadow-sm'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                          }`}
                        >
                          {amt.toLocaleString()} ብር
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Gateway Options */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                      {isEn ? 'Payment Method' : 'የክፍያ አማራጭ'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'telebirr', name: 'ቴሌብር (Telebirr)' },
                        { id: 'cbe', name: 'ሲቢኢ ብር (CBE)' },
                        { id: 'chapa', name: 'ቻፓ (Chapa)' },
                        { id: 'card', name: 'International Card' },
                      ].map((gw) => (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => setSelectedGateway(gw.id)}
                          className={`p-3 rounded-xl border text-xs font-medium transition-all text-left ${
                            selectedGateway === gw.id
                              ? 'border-neutral-900 bg-neutral-50 text-neutral-900 font-bold'
                              : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {gw.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <DoorDennisButton
                      onClick={() => setSubmitted(true)}
                      className="w-full justify-center !py-3"
                    >
                      {isEn
                        ? `Proceed with ${selectedAmount.toLocaleString()} ETB`
                        : `${selectedAmount.toLocaleString()} ብር በምጽዋት ይስጡ`}
                    </DoorDennisButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
