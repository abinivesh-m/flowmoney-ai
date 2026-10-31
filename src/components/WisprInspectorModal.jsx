import React from 'react';
import { X, Mic, Sparkles, Check, Brain, Zap } from 'lucide-react';

export default function WisprInspectorModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 font-mono text-[#18191B]">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E1D1]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#E9EFE9] text-[#385741]">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#18191B] font-['Plus_Jakarta_Sans'] flex items-center">
                Wispr Flow Pro Deep Speech Pipeline
                <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9EFE9] text-[#385741] border border-[#C2D4C5]">
                  TELEMETRY INSPECTOR
                </span>
              </h2>
              <p className="text-xs text-[#6E726D]">
                Visualizing how raw natural voice with fillers & self-corrections converts into clean multi-intent execution.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F4EFE2] text-[#88857B] hover:text-[#18191B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid: Raw Input vs Cleaned Intent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Step 1: Raw Wispr Flow Dictation */}
          <div className="p-4 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center">
                <Mic className="w-3.5 h-3.5 mr-1" />
                Step 1: Raw Voice Input (Wispr Flow)
              </span>
              <span className="text-[10px] text-[#88857B]">Unfiltered Stream</span>
            </div>
            <p className="text-xs font-serif text-[#18191B] leading-relaxed p-3 rounded-lg bg-[#FFFFEB] border border-[#E6E1D1]">
              "{data.rawSpeech}"
            </p>

            {/* Identified Fillers & Hesitations */}
            <div className="mt-3">
              <span className="text-[11px] font-bold text-[#6E726D] block mb-1">
                Detected Fillers & Hesitations ({data.foundFillers.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.foundFillers.length > 0 ? (
                  data.foundFillers.map((filler, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#FFF1F2] text-rose-800 border border-rose-200"
                    >
                      ~ {filler}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#88857B]">None detected</span>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Denoised & Intent Stream */}
          <div className="p-4 rounded-xl bg-[#E9EFE9] border border-[#C2D4C5]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#385741] uppercase tracking-wider flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Step 2: Denoised & Resolved Intent
              </span>
              <span className="text-[10px] text-[#385741] font-bold">100% Parsed</span>
            </div>
            <p className="text-xs font-sans text-[#18191B] leading-relaxed p-3 rounded-lg bg-[#FFFFEB] border border-[#C2D4C5] font-medium">
              "{data.cleanedSpeech}"
            </p>

            {/* Self-Corrections Resolved */}
            <div className="mt-3">
              <span className="text-[11px] font-bold text-[#385741] block mb-1">
                Resolved Self-Corrections ({data.selfCorrections.length}):
              </span>
              {data.selfCorrections.length > 0 ? (
                <div className="space-y-1">
                  {data.selfCorrections.map((sc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 text-xs p-2 rounded bg-[#FFFFEB] text-[#18191B] border border-[#C2D4C5]"
                    >
                      <Check className="w-3.5 h-3.5 text-[#385741] shrink-0" />
                      <div>
                        <span className="font-bold">{sc.type}: </span>
                        {sc.from && <span className="line-through text-[#88857B] mr-1.5">₹{sc.from}</span>}
                        <span className="text-[#385741] font-bold">{sc.to ? `₹${sc.to}` : sc.to}</span>
                        <span className="text-[10px] text-[#6E726D] ml-2">({sc.reason})</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-[#6E726D]">No verbal contradictions in this segment</span>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Multi-Intent Agentic Actions */}
        <div className="mt-5 p-4 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1]">
          <h3 className="text-xs font-bold text-[#18191B] uppercase tracking-wider mb-2 flex items-center">
            <Zap className="w-3.5 h-3.5 mr-1 text-[#D97706]" />
            Step 3: Multi-Intent Dissection & Living Model Updates ({data.actions.length} Actions)
          </h3>
          <div className="space-y-2">
            {data.actions.map((act, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#FFFFEB] border border-[#E6E1D1] text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#E9EFE9] text-[#385741]">
                    {act.action}
                  </span>
                  <span className="text-[#18191B]">{act.details}</span>
                </div>
                <span className="text-[10px] text-[#385741] font-bold flex items-center">
                  <Check className="w-3 h-3 mr-0.5" /> Applied to Model
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 4: Voice Synthesizer Audio Response */}
        <div className="mt-4 p-4 rounded-xl bg-[#E9EFE9] border border-[#C2D4C5]">
          <span className="text-xs font-bold text-[#385741] block mb-1">
            Agent Voice Speech Synthesis Response:
          </span>
          <p className="text-xs text-[#2A3B2F] italic leading-relaxed">
            "{data.responseSpeech}"
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#385741] hover:bg-[#2C4433] text-[#FFFFEB] transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
