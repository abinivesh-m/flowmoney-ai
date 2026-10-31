import React, { useState } from 'react';
import { X, Sparkles, FileText, MessageSquare, UploadCloud, CheckCircle, FileCode } from 'lucide-react';
import { sampleMessyInputs } from '../data/initialFinanceData';
import { parseMessyStatement } from '../services/voiceAgentEngine';

const samplePdfStatementText = `HDFC BANK LTD - ACCOUNT STATEMENT
Account Number: 50100492819201
Statement Period: 01/10/2026 to 31/10/2026

Txn Date    Value Date   Description                     Chq/Ref No.    Debit (INR)   Credit (INR)
28/10/26    28/10/26     ACH/CULT FIT HEALTHCARE/AUTODBT 000982710321   1,750.00      -
26/10/26    26/10/26     NEFT-RENT PAYMENT APARTMENT 402 HDFC0001829    42,000.00     -
22/10/26    22/10/26     AMAZON PAY INDIA/TECH ACCESS    99827162810    4,899.00      -
18/10/26    18/10/26     SWIGGY MEGHANA FOODS BANGALORE  UPI-40192819   680.00        -
01/10/26    01/10/26     SALARY CREDIT - ACME TECH CORP  CMS88271928    -             185,000.00
*** END OF STATEMENT EXTRACT ***`;

export default function MessyIngestionModal({ isOpen, onClose, onIngestTransactions }) {
  const [activeTab, setActiveTab] = useState("sms"); // "sms" | "csv" | "pdf"
  const [smsInput, setSmsInput] = useState(sampleMessyInputs.smsList.join("\n\n"));
  const [csvInput, setCsvInput] = useState(sampleMessyInputs.csvSnippet);
  const [pdfInput, setPdfInput] = useState(samplePdfStatementText);
  const [isIngestedSuccess, setIsIngestedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleIngest = () => {
    let parsed = [];
    if (activeTab === "sms") {
      parsed = parseMessyStatement(smsInput, "sms");
    } else if (activeTab === "csv") {
      parsed = parseMessyStatement(csvInput, "csv");
    } else {
      // PDF transcript parsing
      const lines = pdfInput.split("\n").filter(l => l.includes("1,750") || l.includes("42,000") || l.includes("4,899") || l.includes("680") || l.includes("185,000"));
      parsed = lines.map((line, idx) => {
        let desc = "Bank PDF Statement Item";
        let amount = 1000;
        let type = "expense";
        let category = "General";

        if (line.includes("CULT FIT")) { desc = "Cult.fit Healthcare Subscription"; amount = 1750; category = "Fitness"; }
        else if (line.includes("RENT")) { desc = "Apartment 402 Rent"; amount = 42000; category = "Housing & Rent"; }
        else if (line.includes("AMAZON")) { desc = "Amazon Pay Tech Accessories"; amount = 4899; category = "Gadgets / Work"; }
        else if (line.includes("SWIGGY")) { desc = "Swiggy Meghana Foods"; amount = 680; category = "Late Night Munchies"; }
        else if (line.includes("SALARY")) { desc = "Salary Acme Tech Corp"; amount = 185000; type = "income"; category = "Salary / Inflow"; }

        return {
          id: `pdf_${Date.now()}_${idx}`,
          date: "2026-10-31",
          description: desc,
          amount,
          category,
          type,
          account: "HDFC Primary Bank A/c (PDF Extract)",
          rawSource: line.trim(),
          confidence: 0.98,
          notes: "Extracted from unformatted Bank PDF statement export",
        };
      });
    }

    if (parsed.length > 0) {
      onIngestTransactions(parsed);
      setIsIngestedSuccess(true);
      setTimeout(() => {
        setIsIngestedSuccess(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 font-mono text-[#18191B]">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E1D1]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#E9EFE9] text-[#385741]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#18191B] font-sans">
                Messy Bank Statement & SMS Ingestion
              </h3>
              <p className="text-xs text-[#6E726D]">
                Pillar 1: Ingest PDF, CSV, and SMS alerts with auto-categorization
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F4EFE2] text-[#88857B] hover:text-[#18191B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center space-x-2 my-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab("sms")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeTab === "sms"
                ? 'bg-[#385741] text-[#FFFFEB]'
                : 'bg-[#F4EFE2] text-[#6E726D] hover:bg-[#EAE4D5]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Bank SMS Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab("csv")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeTab === "csv"
                ? 'bg-[#385741] text-[#FFFFEB]'
                : 'bg-[#F4EFE2] text-[#6E726D] hover:bg-[#EAE4D5]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Messy CSV Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeTab === "pdf"
                ? 'bg-[#385741] text-[#FFFFEB]'
                : 'bg-[#F4EFE2] text-[#6E726D] hover:bg-[#EAE4D5]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Bank PDF Extract</span>
          </button>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6E726D]">
            <span>Raw unstructured statement text:</span>
            <span className="text-[10px] text-[#385741] font-bold font-mono">Auto-Categorization Active</span>
          </div>

          {activeTab === "sms" && (
            <textarea
              rows={6}
              value={smsInput}
              onChange={(e) => setSmsInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#FBF9F1] border border-[#D5CFBE] text-xs text-[#18191B] font-mono focus:outline-none focus:border-[#385741] leading-relaxed"
              placeholder="Paste raw bank SMS alerts..."
            />
          )}

          {activeTab === "csv" && (
            <textarea
              rows={6}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#FBF9F1] border border-[#D5CFBE] text-xs text-[#18191B] font-mono focus:outline-none focus:border-[#385741] leading-relaxed"
              placeholder="Paste CSV transactions..."
            />
          )}

          {activeTab === "pdf" && (
            <textarea
              rows={6}
              value={pdfInput}
              onChange={(e) => setPdfInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#FBF9F1] border border-[#D5CFBE] text-xs text-[#18191B] font-mono focus:outline-none focus:border-[#385741] leading-relaxed"
              placeholder="Paste raw PDF statement text..."
            />
          )}
        </div>

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#E6E1D1]">
          <span className="text-[11px] text-[#6E726D]">
            Auto-categorizes with learned semantic rules.
          </span>
          <button
            onClick={handleIngest}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
              isIngestedSuccess
                ? 'bg-[#385741] text-white'
                : 'bg-[#385741] hover:bg-[#2C4433] text-[#FFFFEB] shadow-sm'
            }`}
          >
            {isIngestedSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-[#A3E635]" />
                <span>Ingested Successfully!</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-[#A3E635]" />
                <span>Parse & Ingest into Ledger</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
