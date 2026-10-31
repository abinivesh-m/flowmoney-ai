import React from 'react';
import { 
  Radio, AlertTriangle, AlertCircle, CheckCircle, Clock, Trash2, ArrowRight, 
  Sparkles, DollarSign, RefreshCw, XCircle
} from 'lucide-react';

export default function SubscriptionRadar({ 
  subscriptions, 
  currency, 
  onCancelSubscription,
  onReallocateSavingsToGoals 
}) {
  const totalMonthlySubBurn = subscriptions.reduce((sum, s) => sum + s.amount, 0);
  const ghostLeaks = subscriptions.filter(s => s.status === 'ghost_leak');
  const priceHikes = subscriptions.filter(s => s.alert && s.alert.includes('hike'));

  return (
    <div className="rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] p-6 shadow-md font-mono text-[#18191B]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E6E1D1]">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#E9EFE9] text-[#385741]">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-[#18191B] font-sans">
              Subscription & Ghost-Charge Radar
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E9EFE9] text-[#385741] rounded-full uppercase">
              Pillar 3
            </span>
          </div>
          <p className="text-xs text-[#6E726D] mt-1">
            Detects recurring payments, unused leaks, and stealth billing price changes
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-full bg-[#F4EFE2] border border-[#D5CFBE]">
            <span className="text-[#6E726D] mr-1.5">Monthly Burn:</span>
            <span className="font-mono font-bold text-[#18191B]">{currency}{totalMonthlySubBurn.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner if Ghost Leaks Exist */}
      {ghostLeaks.length > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-900">
                Ghost Leak Detected: {ghostLeaks[0].name}
              </h4>
              <p className="text-[11px] text-[#4A1521] mt-0.5">
                Zero visits/usage detected in {ghostLeaks[0].lastUsedDaysAgo} days. You are bleeding {currency}{(ghostLeaks[0].amount * 12).toLocaleString()}/year.
              </p>
            </div>
          </div>
          <button
            onClick={() => onReallocateSavingsToGoals(ghostLeaks[0])}
            className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all flex items-center space-x-1"
          >
            <span>Cancel & Divert to Japan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Subscription Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {subscriptions.map((sub) => {
          const isLeak = sub.status === 'ghost_leak';
          const hasHike = sub.alert && sub.alert.includes('hike');

          return (
            <div
              key={sub.id}
              className={`p-4 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                isLeak
                  ? 'bg-[#FFF1F2] border-[#FECDD3]'
                  : hasHike
                  ? 'bg-[#FFFBEB] border-[#FDE68A]'
                  : 'bg-[#FBF9F1] border-[#E6E1D1]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <h4 className="font-bold text-[#18191B] text-xs font-sans">{sub.name}</h4>
                    <span className="text-[10px] text-[#88857B]">{sub.category}</span>
                  </div>
                  <span className="font-mono font-bold text-[#18191B]">
                    {currency}{sub.amount.toLocaleString()} <span className="text-[10px] text-[#88857B] font-normal">/mo</span>
                  </span>
                </div>

                {/* Status / Alert */}
                {sub.alert ? (
                  <div className={`p-2 rounded-lg text-[10px] my-2 leading-relaxed ${
                    isLeak 
                      ? 'bg-white/80 text-rose-900 border border-rose-200' 
                      : 'bg-white/80 text-amber-900 border border-amber-200'
                  }`}>
                    {sub.alert}
                  </div>
                ) : (
                  <div className="flex items-center text-[10px] text-[#385741] my-2 font-semibold">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    <span>Active usage (last used {sub.lastUsedDaysAgo === 0 ? 'today' : `${sub.lastUsedDaysAgo}d ago`})</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px] text-[#6E726D]">
                <span className="flex items-center text-[10px]">
                  <Clock className="w-3 h-3 mr-1 text-[#88857B]" />
                  Renews monthly
                </span>

                <button
                  onClick={() => onCancelSubscription(sub.id)}
                  className="text-[#88857B] hover:text-rose-600 transition-colors p-1"
                  title="Pause or cancel subscription"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
