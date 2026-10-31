import React from 'react';
import { X, Printer, Download, CheckCircle, TrendingUp, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';

export default function MonthlyReportModal({ isOpen, onClose, profile, goals, transactions, subscriptions, currency }) {
  if (!isOpen) return null;

  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netSaved = profile.monthlyIncome - totalExpenses;
  const savingsRate = Math.round((netSaved / profile.monthlyIncome) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 font-mono text-[#18191B]">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] p-6 sm:p-8 shadow-2xl print:bg-white print:text-black">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E1D1] print:border-black">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#E9EFE9] text-[#385741] print:hidden">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#18191B] font-['Plus_Jakarta_Sans']">
                FlowMoney Executive Monthly Financial Review
              </h2>
              <p className="text-xs text-[#6E726D]">
                Period: October 2026 • Prepared for {profile.name} (Pillar 7)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F4EFE2] hover:bg-[#EAE4D5] text-[#18191B] border border-[#D5CFBE] transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#385741]" />
              <span>Print / Export PDF</span>
            </button>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F4EFE2] text-[#88857B] hover:text-[#18191B]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-3.5 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1]">
            <span className="text-[10px] text-[#6E726D] uppercase tracking-wider font-bold block mb-1">
              Monthly Inflow
            </span>
            <span className="text-xl font-bold text-[#385741] font-sans">
              {currency}{profile.monthlyIncome.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1]">
            <span className="text-[10px] text-[#6E726D] uppercase tracking-wider font-bold block mb-1">
              Total Expenses
            </span>
            <span className="text-xl font-bold text-[#18191B] font-sans">
              {currency}{totalExpenses.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1]">
            <span className="text-[10px] text-[#6E726D] uppercase tracking-wider font-bold block mb-1">
              Net Surplus Saved
            </span>
            <span className="text-xl font-bold text-[#385741] font-sans">
              {currency}{netSaved.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1]">
            <span className="text-[10px] text-[#6E726D] uppercase tracking-wider font-bold block mb-1">
              Savings Rate
            </span>
            <span className="text-xl font-bold text-[#B45309] font-sans">
              {savingsRate}%
            </span>
          </div>
        </div>

        {/* Section 1: Goals Trajectory */}
        <div className="my-5">
          <h3 className="text-xs font-bold text-[#18191B] uppercase tracking-wider mb-2">
            1. Active Goals & Runway Trajectory
          </h3>
          <div className="space-y-2">
            {goals.map((g) => {
              const pct = Math.round((g.currentAmount / g.targetAmount) * 100);
              return (
                <div key={g.id} className="p-3 rounded-lg bg-[#FBF9F1] border border-[#E6E1D1] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#18191B] font-sans">{g.name}</span>
                    <span className="text-[11px] text-[#6E726D] ml-2">Target Date: {g.targetDate}</span>
                  </div>
                  <div className="flex items-center space-x-3 font-mono">
                    <span className="text-[#6E726D]">{currency}{g.currentAmount.toLocaleString()} / {currency}{g.targetAmount.toLocaleString()}</span>
                    <span className="font-bold text-[#385741]">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Audit of Subscriptions & Leaks */}
        <div className="my-5">
          <h3 className="text-xs font-bold text-[#18191B] uppercase tracking-wider mb-2">
            2. Recurring Payments & Leak Audit
          </h3>
          <div className="p-3.5 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1] text-xs text-[#2C302B] leading-relaxed space-y-1">
            <p>• <strong>Netflix 4K:</strong> Price hike flagged (+30% from ₹499 to ₹649).</p>
            <p>• <strong>Cult.fit Gym:</strong> Inactive for 38 days. Potential annual recapture: ₹21,000.</p>
            <p>• <strong>Total Recurring Monthly Burn:</strong> ₹{subscriptions.reduce((a, b) => a + b.amount, 0).toLocaleString()}.</p>
          </div>
        </div>

        {/* Section 3: Guardrail Notice */}
        <div className="mt-6 pt-4 border-t border-[#E6E1D1] text-[10px] text-[#6E726D] flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#385741] shrink-0" />
          <span>
            Compliance Guardrail Notice: This review provides scenario modeling and cashflow budgeting based on historical telemetry. It does not constitute specific investment advice or stock recommendations.
          </span>
        </div>
      </div>
    </div>
  );
}
