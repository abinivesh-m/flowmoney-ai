import React from 'react';
import { X, ShieldCheck, AlertCircle, Lock, BookOpen } from 'lucide-react';

export default function GuardrailsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 font-mono text-[#18191B]">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E1D1]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#E9EFE9] text-[#385741]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#18191B] font-sans">AI Financial Guardrails & Ethics</h3>
              <p className="text-xs text-[#6E726D]">Pillar 8: Regulatory compliance & responsible scenario modeling</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F4EFE2] text-[#88857B] hover:text-[#18191B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 my-5 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1] flex items-start space-x-3">
            <BookOpen className="w-4 h-4 text-[#385741] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#18191B] font-sans">Scenario Modeling, Not Stock Advice</h4>
              <p className="text-[11px] text-[#6E726D] mt-0.5 leading-relaxed">
                FlowMoney strictly models personal budgeting, cashflow trajectories, and expense allocations. The agent is strictly prohibited from recommending individual equities, crypto assets, or investment securities.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1] flex items-start space-x-3">
            <Lock className="w-4 h-4 text-[#385741] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#18191B] font-sans">Privacy & Voice Stream Safety</h4>
              <p className="text-[11px] text-[#6E726D] mt-0.5 leading-relaxed">
                Speech captured via Wispr Flow Pro is parsed locally. Your bank statement texts and transaction SMS alerts never leak into public training corpora.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1] flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#18191B] font-sans">Human-In-The-Loop Confirmation</h4>
              <p className="text-[11px] text-[#6E726D] mt-0.5 leading-relaxed">
                Every learned categorization rule and simulation adjustment is explicitly presented for user verification and can be edited or revoked at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E6E1D1] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#385741] hover:bg-[#2C4433] text-[#FFFFEB] transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}
