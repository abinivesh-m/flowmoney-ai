import React from 'react';
import { X, Database, Brain, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';

export default function LearnedRulesDrawer({ isOpen, onClose, rules, onDeleteRule }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-[#18191B]">
      <div className="w-full max-w-md h-full bg-[#FFFFEB] border-l border-[#E6E1D1] p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E6E1D1]">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#E9EFE9] text-[#385741]">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#18191B] font-sans">Learned Memory Rules</h3>
                <p className="text-xs text-[#6E726D]">Autonomous semantic memory (Pillar 2)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[#F4EFE2] text-[#88857B] hover:text-[#18191B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-[#4E524D] my-4 leading-relaxed bg-[#FBF9F1] p-3.5 rounded-xl border border-[#E6E1D1]">
            🧠 <strong className="text-[#18191B]">Continuous Learning Loop:</strong> When you correct a transaction via voice or edit its category, FlowMoney extracts the semantic pattern and remembers it permanently for all future transactions.
          </p>

          {/* Rules List */}
          <div className="space-y-3">
            {rules.map((rule) => (
              <div 
                key={rule.id}
                className="p-3.5 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1] text-xs"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="font-bold text-[#18191B] text-xs">
                    "{rule.pattern}"
                  </span>
                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="text-[#88857B] hover:text-rose-600 transition-colors p-0.5"
                    title="Remove rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-1.5 my-1.5">
                  <span className="text-[#6E726D] text-[11px]">Map to:</span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-[#E9EFE9] text-[#385741] text-[10px]">
                    {rule.category}
                  </span>
                </div>

                <p className="text-[10px] text-[#6E726D] italic bg-[#FFFFEB] p-2 rounded border border-[#E6E1D1] my-2">
                  {rule.reason}
                </p>

                <div className="flex items-center justify-between text-[10px] text-[#88857B] pt-1.5 border-t border-[#E6E1D1]">
                  <span className="flex items-center text-[#385741] font-bold font-mono">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {Math.round(rule.confidence * 100)}% Confidence
                  </span>
                  <span>Applied {rule.usageCount} times</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E6E1D1]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#385741] hover:bg-[#2C4433] text-[#FFFFEB] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
