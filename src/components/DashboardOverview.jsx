import React from 'react';
import { 
  TrendingUp, TrendingDown, Shield, Target, AlertTriangle, ArrowUpRight, 
  Sparkles, Wallet, Calendar, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import TiltCard from './TiltCard';

export default function DashboardOverview({ 
  profile, 
  goals, 
  nudges, 
  onTriggerNudgeAction,
  totalExpenses,
  currency 
}) {
  const safeToSpend = profile.monthlyIncome - profile.fixedCosts - totalExpenses;
  const emergencyCoverageMonths = (profile.emergencyFundCurrent / profile.fixedCosts).toFixed(1);

  return (
    <div className="space-y-6 font-mono text-[#18191B]">
      {/* Top 3D Metric TiltCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monthly Inflow */}
        <TiltCard maxTilt={6} className="rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] p-5 shadow-sm hover:border-[#385741] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#6E726D] uppercase tracking-wider">Monthly Inflow</span>
            <div className="p-2 rounded-xl bg-[#E9EFE9] text-[#385741]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-normal text-[#18191B] tracking-tight font-sans">
            {currency}{profile.monthlyIncome.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#385741] font-semibold mt-1 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> Direct payroll verified
          </p>
        </TiltCard>

        {/* Card 2: Fixed Living Burn */}
        <TiltCard maxTilt={6} className="rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] p-5 shadow-sm hover:border-[#385741] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#6E726D] uppercase tracking-wider">Fixed Living Burn</span>
            <div className="p-2 rounded-xl bg-[#F4EFE2] text-[#6E726D]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-normal text-[#18191B] tracking-tight font-sans">
            {currency}{profile.fixedCosts.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#6E726D] mt-1">
            Rent, EMIs, Bills ({Math.round((profile.fixedCosts / profile.monthlyIncome) * 100)}% of income)
          </p>
        </TiltCard>

        {/* Card 3: Safe-to-Spend Balance */}
        <TiltCard maxTilt={6} className="rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] p-5 shadow-sm hover:border-[#385741] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#6E726D] uppercase tracking-wider">Safe-to-Spend</span>
            <div className="p-2 rounded-xl bg-[#E9EFE9] text-[#385741]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-medium tracking-tight font-sans ${safeToSpend >= 0 ? 'text-[#385741]' : 'text-rose-600'}`}>
            {currency}{Math.max(0, safeToSpend).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#6E726D] mt-1">
            Dynamic living cashflow cushion
          </p>
        </TiltCard>

        {/* Card 4: Emergency Runway Health */}
        <TiltCard maxTilt={6} className="rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] p-5 shadow-sm hover:border-[#385741] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#6E726D] uppercase tracking-wider">Emergency Runway</span>
            <div className="p-2 rounded-xl bg-[#E9EFE9] text-[#385741]">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-normal text-[#18191B] tracking-tight flex items-baseline font-sans">
            {emergencyCoverageMonths} <span className="text-xs font-normal text-[#6E726D] ml-1 font-mono">/ 6.0 Mos</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#E5E1D3] h-2 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-[#385741] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (emergencyCoverageMonths / 6.0) * 100)}%` }}
            />
          </div>
        </TiltCard>
      </div>

      {/* Proactive Spending Drift Nudges (Hackathon Pillar #6) */}
      <div className="p-5 rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#D97706]" />
            <h3 className="text-xs font-bold text-[#18191B] uppercase tracking-wider">
              Autonomous Spending Drift Nudges & Alerts
            </h3>
          </div>
          <span className="text-[10px] text-[#6E726D] uppercase">Active Velocity Guard</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {nudges.map((nudge) => (
            <TiltCard 
              key={nudge.id}
              maxTilt={4}
              className={`p-4 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                nudge.level === 'warning'
                  ? 'bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]'
                  : nudge.level === 'opportunity'
                  ? 'bg-[#E9EFE9] border-[#C2D4C5] text-[#24422D]'
                  : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[12px]">{nudge.title}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-mono bg-white/80 border border-current/20">
                    {nudge.metric}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed mb-3 text-[#3F443E]">
                  {nudge.message}
                </p>
              </div>

              <button
                onClick={() => onTriggerNudgeAction(nudge)}
                className="w-full py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/80 hover:bg-white text-[#18191B] border border-current/15 flex items-center justify-center space-x-1 transition-colors shadow-xs"
              >
                <span>{nudge.actionPrompt}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* 3D Living Goals Vaults (Hackathon Pillar #4) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#18191B] flex items-center uppercase tracking-wider">
              <Target className="w-4 h-4 mr-2 text-[#385741]" />
              Living Financial Profile & Goals
            </h3>
            <p className="text-xs text-[#6E726D]">
              Dynamically affected by monthly savings velocity and voice what-if adjustments
            </p>
          </div>
          <span className="text-xs text-[#385741] font-bold">{goals.length} ACTIVE GOALS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const remaining = goal.targetAmount - goal.currentAmount;
            const monthsLeft = Math.ceil(remaining / (goal.monthlyContribution || 10000));

            return (
              <TiltCard 
                key={goal.id} 
                maxTilt={6}
                className="p-5 rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] hover:border-[#385741] shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#E9EFE9] text-[#385741]">
                      {goal.category}
                    </span>
                    <span className="text-xs font-bold text-[#385741] font-mono">{percent}%</span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-[#18191B] mb-1 font-sans">{goal.name}</h4>
                  
                  <div className="flex items-baseline space-x-1.5 my-2">
                    <span className="text-xl font-bold text-[#18191B] font-mono">
                      {currency}{goal.currentAmount.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#88857B] font-mono">
                      / {currency}{goal.targetAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Visual Progress Track */}
                  <div className="w-full bg-[#E5E1D3] h-2 rounded-full overflow-hidden my-2">
                    <div 
                      className="h-full rounded-full bg-[#385741] transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E6E1D1] flex items-center justify-between text-[11px] text-[#6E726D]">
                  <span className="flex items-center text-[10px]">
                    <Calendar className="w-3 h-3 mr-1 text-[#88857B]" />
                    Target: {goal.targetDate}
                  </span>
                  <span className="text-[#18191B] font-bold font-mono">~{monthsLeft} mos left</span>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
