import React from 'react';
import { Mic, Zap, Shield, Sparkles, TrendingUp, Radio } from 'lucide-react';

export default function NeuralTicker({ learnedRulesCount = 3, ghostLeakCount = 1 }) {
  const items = [
    { icon: Mic, label: "WISPR FLOW PRO ACTIVE", detail: "42ms Latency", color: "text-[#385741]" },
    { icon: Sparkles, label: "SPEECH DE-NOISER", detail: "Resolving Fillers & Self-Corrections", color: "text-[#385741]" },
    { icon: Zap, label: "AUTONOMOUS MEMORY", detail: `${learnedRulesCount} Semantic Rules Trained`, color: "text-[#4A6E55]" },
    { icon: Radio, label: "SUBSCRIPTION RADAR", detail: `${ghostLeakCount} Leak Flagged (Cult.fit 38d)`, color: "text-[#BE123C]" },
    { icon: Shield, label: "SEBI / SEC GUARDRAILS", detail: "Educational Scenario Modeling Only", color: "text-[#385741]" },
    { icon: TrendingUp, label: "WHAT-IF SIMULATION", detail: "Real-time Goal Recalculations", color: "text-[#B45309]" },
  ];

  return (
    <div className="w-full bg-[#FFFFEB] border-b border-[#E6E1D1] overflow-hidden py-1.5 text-[#18191B]">
      <div className="flex space-x-8 animate-marquee whitespace-nowrap">
        {items.concat(items).map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-wider">
              <Icon className={`w-3 h-3 ${item.color}`} />
              <span className="font-bold text-[#18191B]">{item.label}:</span>
              <span className="text-[#6E726D]">{item.detail}</span>
              <span className="text-[#C8C2AF]">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
