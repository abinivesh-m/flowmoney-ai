import React, { useState } from 'react';
import { Sliders, Sparkles, TrendingUp, TrendingDown, Calendar, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WhatIfSimulator({ goals, currency, simulatedVoiceScenario, onApplyScenarioPermanently }) {
  const [rentDelta, setRentDelta] = useState(simulatedVoiceScenario?.rentDelta || 0);
  const [diningCutPercent, setDiningCutPercent] = useState(simulatedVoiceScenario?.diningCutPercent || 0);
  const [cancelGhostSubs, setCancelGhostSubs] = useState(false);
  const [monthlyRaise, setMonthlyRaise] = useState(0);

  React.useEffect(() => {
    if (simulatedVoiceScenario) {
      if (simulatedVoiceScenario.rentDelta !== undefined) setRentDelta(simulatedVoiceScenario.rentDelta);
      if (simulatedVoiceScenario.diningCutPercent !== undefined) setDiningCutPercent(simulatedVoiceScenario.diningCutPercent);
    }
  }, [simulatedVoiceScenario]);

  const averageMonthlyDining = 15000;
  const diningSavings = Math.round((diningCutPercent / 100) * averageMonthlyDining);
  const ghostSubSavings = cancelGhostSubs ? 1750 : 0;
  const netMonthlyImpact = (diningSavings + ghostSubSavings + monthlyRaise) - rentDelta;

  const macbookRemaining = 38000;
  const baseMonthlyContribution = 15000;
  const newMonthlyMacbookPace = Math.max(2000, baseMonthlyContribution + (netMonthlyImpact * 0.45));
  const baseMonths = (macbookRemaining / baseMonthlyContribution);
  const simulatedMonths = (macbookRemaining / newMonthlyMacbookPace);
  const daysDifference = Math.round((baseMonths - simulatedMonths) * 30);

  const handleApplyPermanent = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onApplyScenarioPermanently({
      rentDelta,
      diningCutPercent,
      cancelGhostSubs,
      monthlyRaise,
      netMonthlyImpact
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] shadow-md font-mono text-[#18191B]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-[#E6E1D1]">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#E9EFE9] text-[#385741]">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#18191B] font-sans">
              Dynamic Living What-If Scenario Sandbox
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E9EFE9] text-[#385741] rounded-full uppercase">
              Pillar 5
            </span>
          </div>
          <p className="text-xs text-[#6E726D] mt-1">
            Simulate real life shifts (rent hikes, lifestyle cuts, promotions) and see live goal date recalculations
          </p>
        </div>

        {simulatedVoiceScenario && (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E9EFE9] border border-[#C2D4C5] text-xs text-[#385741] font-bold">
            <Zap className="w-3.5 h-3.5 text-[#D97706] animate-pulse" />
            <span>VOICE DRIVEN: {simulatedVoiceScenario.targetGoal || "MacBook Pro"}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sliders */}
        <div className="lg:col-span-7 space-y-4">
          {/* Slider 1: Rent Change */}
          <div className="p-4 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#18191B] uppercase tracking-wider text-[11px]">Rent Shift / Hike</span>
              <span className={`font-mono font-bold ${rentDelta > 0 ? 'text-rose-600' : rentDelta < 0 ? 'text-[#385741]' : 'text-[#6E726D]'}`}>
                {rentDelta > 0 ? `+${currency}${rentDelta.toLocaleString()}` : `${currency}${rentDelta.toLocaleString()}`} / month
              </span>
            </div>
            <input 
              type="range"
              min="-10000"
              max="15000"
              step="1000"
              value={rentDelta}
              onChange={(e) => setRentDelta(parseInt(e.target.value))}
              className="w-full accent-[#385741] bg-[#E5E1D3] h-2 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#88857B] mt-1 font-mono">
              <span>-₹10k (downsize)</span>
              <span>Baseline</span>
              <span>+₹15k (hike)</span>
            </div>
          </div>

          {/* Slider 2: Dining Out Reduction % */}
          <div className="p-4 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#18191B] uppercase tracking-wider text-[11px]">Dining & Swiggy Cut</span>
              <span className="font-mono font-bold text-[#385741]">
                -{diningCutPercent}% (+{currency}{diningSavings.toLocaleString()} saved/mo)
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max="50"
              step="5"
              value={diningCutPercent}
              onChange={(e) => setDiningCutPercent(parseInt(e.target.value))}
              className="w-full accent-[#385741] bg-[#E5E1D3] h-2 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#88857B] mt-1 font-mono">
              <span>0% (no change)</span>
              <span>-25% (moderate)</span>
              <span>-50% (aggressive)</span>
            </div>
          </div>

          {/* Quick Checkbox: Cancel Cult.fit Ghost Subscription */}
          <div className="p-4 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#18191B] block uppercase tracking-wider">Cancel Ghost Subscriptions</span>
              <span className="text-[11px] text-[#6E726D]">Cult.fit gym unused 38 days (+{currency}1,750/mo)</span>
            </div>
            <input 
              type="checkbox"
              checked={cancelGhostSubs}
              onChange={(e) => setCancelGhostSubs(e.target.checked)}
              className="w-4 h-4 rounded accent-[#385741] cursor-pointer"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-bold">
            <span className="text-[#88857B] self-center mr-1">PRESETS:</span>
            <button
              onClick={() => { setRentDelta(5000); setDiningCutPercent(0); setCancelGhostSubs(false); }}
              className="px-3 py-1.5 rounded-full bg-[#F4EFE2] hover:bg-[#EAE4D5] text-[#18191B] border border-[#D5CFBE] transition-colors"
            >
              Rent Hikes ₹5k
            </button>
            <button
              onClick={() => { setRentDelta(0); setDiningCutPercent(30); setCancelGhostSubs(true); }}
              className="px-3 py-1.5 rounded-full bg-[#E9EFE9] hover:bg-[#DCE7DC] text-[#24422D] border border-[#C2D4C5] transition-colors"
            >
              Cut Dining 30% + Kill Gym
            </button>
            <button
              onClick={() => { setRentDelta(0); setDiningCutPercent(0); setCancelGhostSubs(false); }}
              className="px-3 py-1.5 rounded-full bg-[#F4EFE2] hover:bg-[#EAE4D5] text-[#88857B] border border-[#D5CFBE] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Projected Impact Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-[#FBF9F1] border border-[#E6E1D1]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#6E726D] uppercase tracking-wider">
                Simulated Outcome
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${netMonthlyImpact >= 0 ? 'bg-[#E9EFE9] text-[#385741]' : 'bg-[#FFF1F2] text-[#9F1239]'}`}>
                {netMonthlyImpact >= 0 ? `+${currency}${netMonthlyImpact.toLocaleString()}/mo` : `-${currency}${Math.abs(netMonthlyImpact).toLocaleString()}/mo`}
              </span>
            </div>

            {/* Impact on Target Goal 1: MacBook Pro */}
            <div className="p-3.5 rounded-xl bg-[#FFFFEB] border border-[#E6E1D1] mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#18191B]">MacBook Pro M3 Max Goal</span>
                <span className="text-[#88857B] text-[10px]">Target: Dec 15</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                {daysDifference >= 0 ? (
                  <div className="flex items-center text-xs font-bold text-[#385741]">
                    <TrendingUp className="w-4 h-4 mr-1 shrink-0" />
                    <span>Accelerates by ~{daysDifference} days!</span>
                  </div>
                ) : (
                  <div className="flex items-center text-xs font-bold text-rose-600">
                    <TrendingDown className="w-4 h-4 mr-1 shrink-0" />
                    <span>Delays by ~{Math.abs(daysDifference)} days</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-[#6E726D] mt-1 leading-relaxed">
                {netMonthlyImpact >= 0 
                  ? `Extra savings boost monthly allocation from ₹15k to ₹${Math.round(newMonthlyMacbookPace).toLocaleString()}.`
                  : `Higher burn reduces monthly savings allocation, extending timeline.`}
              </p>
            </div>

            {/* Impact on Japan 2027 Trip */}
            <div className="p-3.5 rounded-xl bg-[#FFFFEB] border border-[#E6E1D1]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#18191B]">Japan Cherry Blossom 2027</span>
                <span className="text-[#88857B] text-[10px]">Target: Apr 2027</span>
              </div>
              <p className="text-[11px] text-[#6E726D] mt-1 leading-relaxed">
                {netMonthlyImpact > 0 
                  ? `Creates ₹${(netMonthlyImpact * 6).toLocaleString()} surplus over next 6 months for flight bookings.`
                  : `Requires adjusting vacation buffer to keep safety runway intact.`}
              </p>
            </div>
          </div>

          <button
            onClick={handleApplyPermanent}
            className="w-full mt-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#385741] hover:bg-[#2C4433] text-[#FFFFEB] shadow-sm transition-all flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
            <span>Lock In This Scenario</span>
          </button>
        </div>
      </div>
    </div>
  );
}
