import React, { useState } from 'react';
import { 
  ArrowDownLeft, ArrowUpRight, Tag, Edit3, Check, Filter, Search, 
  Sparkles, Database, Plus, RefreshCw, AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  "Late Night Munchies",
  "Dining & Nightlife",
  "Groceries & Household",
  "Housing & Rent",
  "Work & Networking",
  "Business Travel (Reimbursable)",
  "Fitness",
  "Entertainment",
  "Gadgets / Work",
  "Salary / Inflow",
  "Subscriptions & Cloud",
  "Fuel & Commute"
];

export default function TransactionsTable({ 
  transactions, 
  currency, 
  onUpdateCategoryAndLearnRule,
  onOpenRulesDrawer 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingTxnId, setEditingTxnId] = useState(null);
  const [newCategoryVal, setNewCategoryVal] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          txn.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "all" || txn.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleStartEdit = (txn) => {
    setEditingTxnId(txn.id);
    setNewCategoryVal(txn.category);
    setCorrectionReason(`Always classify '${txn.description}' under this category`);
  };

  const handleSaveCorrection = (txn) => {
    if (!newCategoryVal) return;
    onUpdateCategoryAndLearnRule(txn, newCategoryVal, correctionReason);
    setEditingTxnId(null);
  };

  return (
    <div className="rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] shadow-md overflow-hidden font-mono text-[#18191B]">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-[#E6E1D1] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-[#18191B] font-sans">Living Transaction Ledger</h3>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E9EFE9] text-[#385741] font-bold">
              {transactions.length} RECORDS
            </span>
          </div>
          <p className="text-xs text-[#6E726D] mt-0.5">
            Real-time feed with active correction learning loop (Pillar 2)
          </p>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#88857B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ledger..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-full bg-[#FBF9F1] border border-[#D5CFBE] text-xs text-[#18191B] placeholder-[#88857B] focus:outline-none focus:border-[#385741]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-1.5 px-3 rounded-full bg-[#FBF9F1] border border-[#D5CFBE] text-xs text-[#18191B] focus:outline-none focus:border-[#385741]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            onClick={onOpenRulesDrawer}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#E9EFE9] text-[#385741] border border-[#C2D4C5] hover:bg-[#DCE7DC] transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Memory Rules</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FBF9F1] text-[#6E726D] uppercase tracking-wider text-[10px] font-bold border-b border-[#E6E1D1]">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Merchant / Description</th>
              <th className="py-3 px-4">Category (Learned Memory)</th>
              <th className="py-3 px-4">Account / Source</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Correction Loop</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E1D1] text-[#18191B]">
            {filteredTransactions.map((txn) => {
              const isEditing = editingTxnId === txn.id;

              return (
                <tr key={txn.id} className="hover:bg-[#FBF9F1] transition-colors">
                  <td className="py-3 px-4 font-mono text-[#6E726D] whitespace-nowrap">
                    {txn.date}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-[#18191B] font-sans">{txn.description}</div>
                    {txn.notes && (
                      <div className="text-[10px] text-[#6E726D] flex items-center mt-0.5">
                        <Sparkles className="w-2.5 h-2.5 mr-1 text-[#385741]" />
                        {txn.notes}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {isEditing ? (
                      <div className="space-y-1.5 py-1">
                        <select
                          value={newCategoryVal}
                          onChange={(e) => setNewCategoryVal(e.target.value)}
                          className="w-full py-1 px-2 rounded bg-[#FFFFEB] border border-[#385741] text-xs text-[#18191B]"
                        >
                          {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={correctionReason}
                          onChange={(e) => setCorrectionReason(e.target.value)}
                          placeholder="Reason for rule..."
                          className="w-full py-1 px-2 rounded bg-[#FFFFEB] border border-[#D5CFBE] text-[10px] text-[#18191B]"
                        />
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#E9EFE9] border border-[#C2D4C5] text-[#385741]">
                        <Tag className="w-2.5 h-2.5 mr-1" />
                        {txn.category}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-[#6E726D] whitespace-nowrap">
                    {txn.account}
                  </td>

                  <td className={`py-3 px-4 text-right font-mono font-bold whitespace-nowrap ${
                    txn.type === 'income' ? 'text-[#385741]' : 'text-[#18191B]'
                  }`}>
                    {txn.type === 'income' ? '+' : '-'}{currency}{txn.amount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleSaveCorrection(txn)}
                          className="p-1 rounded bg-[#385741] text-white hover:bg-[#2C4433] transition-colors"
                          title="Save category & train memory rule"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingTxnId(null)}
                          className="p-1 rounded bg-[#E5E1D3] text-[#18191B] text-[10px] px-1.5 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(txn)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#F4EFE2] hover:bg-[#E9EFE9] text-[#6E726D] hover:text-[#385741] border border-[#D5CFBE] hover:border-[#385741] text-[10px] font-bold transition-all"
                        title="Fix category to teach the AI a permanent rule"
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                        <span>Teach Rule</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
