import React from 'react';
import { Crosshair, ArrowDownRight, Activity, Terminal, Sparkles, Mic } from 'lucide-react';

export default function EditorialHero({ profile, safeToSpend, currency = "₹" }) {
  return (
    <div className="relative pt-6 pb-6 border-b border-[#E6E1D1] font-mono text-[#18191B]">
      {/* Editorial Micro Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#6E726D] uppercase tracking-widest pb-3">
        <div className="flex items-center space-x-2">
          <Crosshair className="w-3 h-3 text-[#385741]" />
          <span>INDEX: SYS.04_FINANCIAL_COACH</span>
          <span className="text-[#C8C2AF]">/</span>
          <span className="text-[#18191B] font-semibold">PRODUCT SPACE × WISPR FLOW</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>LATENCY: <strong className="text-[#385741]">38MS</strong></span>
          <span className="text-[#C8C2AF]">•</span>
          <span>VOICE DE-NOISER: <strong className="text-[#18191B]">ACTIVE</strong></span>
        </div>
      </div>

      {/* Main Title Typography */}
      <div className="my-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#D5CFBE] text-[10px] uppercase tracking-widest text-[#385741] mb-3 bg-[#E9EFE9] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#385741] animate-pulse"></span>
          <span>WISPR FLOW LIVING MONEY MODEL</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-[#18191B] font-sans uppercase">
          FlowMoney <span className="font-serif italic font-normal text-[#385741]">ai</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#4E524D] font-mono tracking-wide mt-2 max-w-2xl leading-relaxed">
          The voice-first living money model built with Wispr Flow. Speaks, listens, and de-noises human speech—turning anxious, rambling voice queries into real-time cashflow simulations.
        </p>
      </div>

      {/* 4 Minimalist Hairline Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
        <div className="p-3.5 rounded-xl bg-[#FFFFEB] border border-[#E6E1D1] shadow-sm">
          <span className="text-[9px] uppercase tracking-widest text-[#6E726D] font-bold block mb-1">
            01 / MONTHLY_INFLOW
          </span>
          <div className="text-2xl font-light text-[#18191B] font-sans">
            {currency}{profile.monthlyIncome.toLocaleString()}
          </div>
          <span className="text-[9px] text-[#385741] font-semibold tracking-wider mt-0.5 block">VERIFIED PAYROLL</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFFFEB] border border-[#E6E1D1] shadow-sm">
          <span className="text-[9px] uppercase tracking-widest text-[#6E726D] font-bold block mb-1">
            02 / FIXED_BURN
          </span>
          <div className="text-2xl font-light text-[#18191B] font-sans">
            {currency}{profile.fixedCosts.toLocaleString()}
          </div>
          <span className="text-[9px] text-[#6E726D] tracking-wider mt-0.5 block">RENT, EMIS, UTILITIES</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFFFEB] border border-[#E6E1D1] shadow-sm">
          <span className="text-[9px] uppercase tracking-widest text-[#6E726D] font-bold block mb-1">
            03 / SAFE_TO_SPEND
          </span>
          <div className="text-2xl font-light text-[#385741] font-sans font-medium">
            {currency}{Math.max(0, safeToSpend).toLocaleString()}
          </div>
          <span className="text-[9px] text-[#385741] tracking-wider mt-0.5 block">LIVING CUSHION</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFFFEB] border border-[#E6E1D1] shadow-sm">
          <span className="text-[9px] uppercase tracking-widest text-[#6E726D] font-bold block mb-1">
            04 / RUNWAY_HEALTH
          </span>
          <div className="text-2xl font-light text-[#18191B] font-sans flex items-baseline">
            5.1 <span className="text-xs text-[#6E726D] ml-1 font-mono">/ 6.0 MOS</span>
          </div>
          <span className="text-[9px] text-[#4E524D] tracking-wider mt-0.5 block">HEALTH: {profile.financialHealthScore}/100</span>
        </div>
      </div>
    </div>
  );
}
