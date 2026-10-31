import React from 'react';
import { Mic, ShieldCheck, FileText, Database, Volume2, VolumeX, Flame, Sparkles } from 'lucide-react';

export default function Navbar({ 
  onOpenMessyIngest, 
  onOpenRules, 
  onOpenReport, 
  onOpenGuardrails,
  onOpenLinkedInToolkit,
  audioFeedback,
  setAudioFeedback,
  activeVoiceDenoisingCount
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E6E1D1] bg-[#FBF9F1]/85 backdrop-blur-2xl font-mono text-[#18191B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#385741] animate-ping"></div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold tracking-widest text-[#18191B] uppercase font-sans">
              FlowMoney<span className="text-[#385741]">.ai</span>
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full border border-[#D5CFBE] text-[#385741] bg-[#E9EFE9] uppercase tracking-widest font-semibold hidden sm:inline">
              Wispr Flow Theme
            </span>
          </div>
        </div>

        {/* Minimalist Editorial Action Bar */}
        <div className="flex items-center space-x-2 text-[10px] tracking-wider uppercase font-semibold">
          {/* Active Voice Memory */}
          <button 
            onClick={onOpenRules}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-[#D5CFBE] hover:border-[#385741] text-[#385741] bg-[#FFFFEB] hover:bg-[#E9EFE9] transition-all"
            title="View Persistent Memory Rules learned from voice corrections"
          >
            <span>RULES [{activeVoiceDenoisingCount}]</span>
          </button>

          {/* Ingest Messy Statements */}
          <button
            onClick={onOpenMessyIngest}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-[#385741] bg-[#385741] text-[#FFFFEB] hover:bg-[#2C4433] transition-all shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-[#A3E635]" />
            <span>DROP_SMS/CSV</span>
          </button>

          {/* Monthly Report */}
          <button
            onClick={onOpenReport}
            className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-full border border-[#D5CFBE] hover:border-[#385741] text-[#18191B] bg-[#FFFFEB] transition-all"
          >
            <span>AUDIT</span>
          </button>

          {/* Regulatory Guardrails */}
          <button
            onClick={onOpenGuardrails}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full border border-[#D5CFBE] text-[#385741] bg-[#E9EFE9] hover:bg-[#DFE7DF] transition-all"
            title="SEBI / SEC Compliant AI Financial Guardrails"
          >
            <ShieldCheck className="w-3 h-3" />
            <span className="hidden sm:inline">GUARDRAILS</span>
          </button>

          {/* Audio Response Toggle */}
          <button
            onClick={() => setAudioFeedback(!audioFeedback)}
            className="p-2 rounded-full border border-[#D5CFBE] hover:border-[#385741] text-[#18191B] bg-[#FFFFEB] transition-all"
            title={audioFeedback ? "Speech feedback on" : "Speech feedback off"}
          >
            {audioFeedback ? <Volume2 className="w-3.5 h-3.5 text-[#385741]" /> : <VolumeX className="w-3.5 h-3.5 text-[#88857B]" />}
          </button>

          {/* LinkedIn Hackathon Streak */}
          <button
            onClick={onOpenLinkedInToolkit}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-[#D97706]/40 bg-[#FFFBEB] text-[#B45309] hover:bg-[#FEF3C7] transition-all"
          >
            <Flame className="w-3 h-3 fill-current text-[#D97706]" />
            <span>+10 PTS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
