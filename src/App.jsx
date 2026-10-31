import React, { useState } from 'react';
import Navbar from './components/Navbar';
import NeuralTicker from './components/NeuralTicker';
import Interactive3DWorld from './components/Interactive3DWorld';
import EditorialHero from './components/EditorialHero';
import WisprVoiceBar from './components/WisprVoiceBar';
import WisprInspectorModal from './components/WisprInspectorModal';
import DashboardOverview from './components/DashboardOverview';
import WhatIfSimulator from './components/WhatIfSimulator';
import TransactionsTable from './components/TransactionsTable';
import SubscriptionRadar from './components/SubscriptionRadar';
import LearnedRulesDrawer from './components/LearnedRulesDrawer';
import MessyIngestionModal from './components/MessyIngestionModal';
import MonthlyReportModal from './components/MonthlyReportModal';
import GuardrailsModal from './components/GuardrailsModal';

import { 
  initialProfile, 
  initialGoals, 
  initialSubscriptions, 
  initialLearnedRules, 
  initialTransactions, 
  initialNudges 
} from './data/initialFinanceData';

import { parseWisprVoiceInput } from './services/voiceAgentEngine';
import { soundEffects } from './utils/soundEffects';

export default function App() {
  // Living State
  const [profile, setProfile] = useState(initialProfile);
  const [goals, setGoals] = useState(initialGoals);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [learnedRules, setLearnedRules] = useState(initialLearnedRules);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [nudges, setNudges] = useState(initialNudges);

  // Voice & Telemetry State
  const [lastParsedResult, setLastParsedResult] = useState(null);
  const [activeVoiceScenario, setActiveVoiceScenario] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);

  // Modals
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isMessyIngestOpen, setIsMessyIngestOpen] = useState(false);
  const [isRulesDrawerOpen, setIsRulesDrawerOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isGuardrailsOpen, setIsGuardrailsOpen] = useState(false);

  // Voice Audio Speech Synthesizer
  const speakResponse = (text) => {
    if (!audioFeedback || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  // Process Voice Stream from Wispr Flow Pro or Mic
  const handleProcessVoice = (rawText) => {
    setIsProcessing(true);
    soundEffects.playWisprProcess();

    setTimeout(() => {
      const parsed = parseWisprVoiceInput(rawText, { profile, goals, transactions, learnedRules });
      setLastParsedResult(parsed);

      // Execute extracted actions
      if (parsed.newTransaction) {
        setTransactions(prev => [parsed.newTransaction, ...prev]);
        soundEffects.playSuccess();
      }

      if (parsed.learnedRule) {
        setLearnedRules(prev => [parsed.learnedRule, ...prev]);
        soundEffects.playSuccess();
      }

      if (parsed.simulatedScenario) {
        setActiveVoiceScenario(parsed.simulatedScenario);
        soundEffects.playSuccess();
      }

      // Voice Audio Response
      speakResponse(parsed.responseSpeech);

      setIsProcessing(false);
    }, 450);
  };

  // Correction Learning Loop (Pillar 2)
  const handleUpdateCategoryAndLearnRule = (txn, newCategory, reason) => {
    soundEffects.playSuccess();
    setTransactions(prev => prev.map(t => t.id === txn.id ? { ...t, category: newCategory, notes: `Rule trained: ${reason}` } : t));

    const newRule = {
      id: `rule_${Date.now()}`,
      pattern: txn.description,
      category: newCategory,
      reason: reason || `Learned from manual correction on ${new Date().toLocaleDateString()}`,
      confidence: 0.97,
      usageCount: 1,
      source: "User Correction Loop",
    };

    setLearnedRules(prev => [newRule, ...prev]);

    if (audioFeedback) {
      speakResponse(`Rule learned! All transactions for ${txn.description} will now be categorized under ${newCategory}.`);
    }
  };

  // Ingest messy statement SMS / CSV (Pillar 1)
  const handleIngestTransactions = (newTxns) => {
    soundEffects.playSuccess();
    setTransactions(prev => [...newTxns, ...prev]);
    if (audioFeedback) {
      speakResponse(`Ingested ${newTxns.length} transactions from your statement dump and mapped them using active category rules.`);
    }
  };

  // Cancel subscription
  const handleCancelSubscription = (subId) => {
    soundEffects.playWarning();
    setSubscriptions(prev => prev.filter(s => s.id !== subId));
  };

  // Reallocate ghost leak to goal
  const handleReallocateSavingsToGoals = (sub) => {
    soundEffects.playSuccess();
    setSubscriptions(prev => prev.filter(s => s.id !== sub.id));

    setGoals(prev => prev.map(g => {
      if (g.id === 'g2') {
        return {
          ...g,
          monthlyContribution: g.monthlyContribution + sub.amount,
          currentAmount: g.currentAmount + sub.amount
        };
      }
      return g;
    }));

    if (audioFeedback) {
      speakResponse(`Canceled ${sub.name}! Diverted ₹${sub.amount} monthly towards your Japan Cherry Blossom trip.`);
    }
  };

  // Apply permanent simulation
  const handleApplyScenarioPermanently = (scenario) => {
    soundEffects.playSuccess();
    setProfile(prev => ({
      ...prev,
      fixedCosts: prev.fixedCosts + scenario.rentDelta,
    }));

    if (scenario.cancelGhostSubs) {
      setSubscriptions(prev => prev.filter(s => s.status !== 'ghost_leak'));
    }

    if (audioFeedback) {
      speakResponse(`Updated your living budget model with this scenario. Monthly runway trajectory recalculated.`);
    }
  };

  // Trigger nudge actions
  const handleTriggerNudgeAction = (nudge) => {
    if (nudge.id === 'n1') {
      soundEffects.playWarning();
      setActiveVoiceScenario({ rentDelta: 0, diningCutPercent: 25, targetGoal: "MacBook Pro M3 Max" });
      speakResponse("Activated 25% dining reduction scenario. Check the What-If Sandbox to see the timeline gain.");
    } else if (nudge.id === 'n2') {
      soundEffects.playSuccess();
      const gym = subscriptions.find(s => s.id === 's2');
      if (gym) handleReallocateSavingsToGoals(gym);
    } else if (nudge.id === 'n3') {
      soundEffects.playWisprProcess();
      speakResponse("Your safety net covers 5.1 months. Fully on track for complete 6-month buffer by January.");
    }
  };

  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const safeToSpend = profile.monthlyIncome - profile.fixedCosts - totalExpenses;
  const ghostLeakCount = subscriptions.filter(s => s.status === 'ghost_leak').length;

  return (
    <div className="min-h-screen bg-transparent text-[#18191B] flex flex-col font-['Plus_Jakarta_Sans'] antialiased selection:bg-[#385741] selection:text-[#FFFFEB] relative">
      {/* FULL-SCREEN 3D INTERACTIVE WORLD RUNNING ACROSS THE ENTIRE APP */}
      <Interactive3DWorld 
        isListening={isListening} 
        isProcessing={isProcessing} 
      />

      {/* 24/7 Monospace Telemetry Ticker */}
      <NeuralTicker 
        learnedRulesCount={learnedRules.length} 
        ghostLeakCount={ghostLeakCount} 
      />

      {/* Top Navbar */}
      <Navbar
        onOpenMessyIngest={() => setIsMessyIngestOpen(true)}
        onOpenRules={() => setIsRulesDrawerOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenGuardrails={() => setIsGuardrailsOpen(true)}
        audioFeedback={audioFeedback}
        setAudioFeedback={setAudioFeedback}
        activeVoiceDenoisingCount={learnedRules.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 z-10">
        {/* Editorial Hero Header */}
        <EditorialHero
          profile={profile}
          safeToSpend={safeToSpend}
          currency={profile.currency}
        />

        {/* Hero Wispr Voice Input Dock */}
        <WisprVoiceBar
          onProcessVoice={handleProcessVoice}
          lastParsedResult={lastParsedResult}
          onOpenInspector={() => setIsInspectorOpen(true)}
          isProcessing={isProcessing}
          onListeningChange={setIsListening}
        />

        {/* Living Dashboard: Metrics, Nudges, Goals */}
        <DashboardOverview
          profile={profile}
          goals={goals}
          nudges={nudges}
          onTriggerNudgeAction={handleTriggerNudgeAction}
          totalExpenses={totalExpenses}
          currency={profile.currency}
        />

        {/* Dynamic Living What-If Scenario Sandbox (Pillar 5) */}
        <WhatIfSimulator
          goals={goals}
          currency={profile.currency}
          simulatedVoiceScenario={activeVoiceScenario}
          onApplyScenarioPermanently={handleApplyScenarioPermanently}
        />

        {/* Subscriptions & Ghost Leaks Radar (Pillar 3) */}
        <SubscriptionRadar
          subscriptions={subscriptions}
          currency={profile.currency}
          onCancelSubscription={handleCancelSubscription}
          onReallocateSavingsToGoals={handleReallocateSavingsToGoals}
        />

        {/* Living Transactions Ledger & Correction Learning Loop (Pillar 1 & 2) */}
        <TransactionsTable
          transactions={transactions}
          currency={profile.currency}
          onUpdateCategoryAndLearnRule={handleUpdateCategoryAndLearnRule}
          onOpenRulesDrawer={() => setIsRulesDrawerOpen(true)}
        />
      </main>

      {/* Minimalist Editorial Footer */}
      <footer className="border-t border-[#E6E1D1] bg-[#FFFFEB]/85 backdrop-blur-md py-6 text-center text-[10px] text-[#6E726D] font-mono z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SYS.04 // FLOWMONEY AI • PRODUCT SPACE × WISPR FLOW</span>
          <div className="flex items-center space-x-3 uppercase tracking-wider font-semibold">
            <button onClick={() => setIsGuardrailsOpen(true)} className="hover:text-[#18191B] transition-colors">
              GUARDRAILS
            </button>
            <span>•</span>
            <button onClick={() => setIsReportOpen(true)} className="hover:text-[#18191B] transition-colors">
              AUDIT_REPORT
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <WisprInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        data={lastParsedResult}
      />

      <MessyIngestionModal
        isOpen={isMessyIngestOpen}
        onClose={() => setIsMessyIngestOpen(false)}
        onIngestTransactions={handleIngestTransactions}
      />

      <LearnedRulesDrawer
        isOpen={isRulesDrawerOpen}
        onClose={() => setIsRulesDrawerOpen(false)}
        rules={learnedRules}
        onDeleteRule={(id) => setLearnedRules(prev => prev.filter(r => r.id !== id))}
      />

      <MonthlyReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        profile={profile}
        goals={goals}
        transactions={transactions}
        subscriptions={subscriptions}
        currency={profile.currency}
      />

      <GuardrailsModal
        isOpen={isGuardrailsOpen}
        onClose={() => setIsGuardrailsOpen(false)}
      />
    </div>
  );
}
