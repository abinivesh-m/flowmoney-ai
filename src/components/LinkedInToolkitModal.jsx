import React, { useState } from 'react';
import { X, Copy, Check, Flame, ExternalLink } from 'lucide-react';

export default function LinkedInToolkitModal({ isOpen, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const posts = [
    {
      title: "Post 1: Kickoff (Post Today!)",
      timing: "Now / Afternoon (Oct 31)",
      text: `Building something new today! 🎙️⚡

I’m participating in the Agentic AI Hackathon organized by Product Space in collaboration with Wispr Flow.

The problem I’m solving:
Most personal finance apps are passive spreadsheets disguised as charts. They force tedious manual categorization, break down on messy SMS notifications, and can’t answer the questions that actually cause financial anxiety: "If my rent goes up next month, will I still hit my goal?"

The product: "FlowMoney AI" — A Living Money Model powered by Wispr Flow.

Instead of typing and tapping 50 buttons, you just talk. Real human speech has filler words, self-corrections, and rambling thoughts ("I paid 650... wait no, Rohan paid half, make it 300"). FlowMoney strips the noise, extracts multi-intent actions, updates persistent memory rules, and runs real-time what-if simulations on your goals.

Tech stack & constraints:
Voice-first input via Wispr Flow → Agentic intent & correction parser → Living financial balance sheet & scenario simulation.

Building it all today before 11:59 PM IST. Follow along for progress clips and demo updates! 🚀

@Product Space @Wispr Flow

#AIHackathon #ProductSpace #WisprFlow #BuildInPublic #AgenticAI #VoiceAI #Fintech`
    },
    {
      title: "Post 2: Mid-Hackathon Progress (Show Wispr Flow in Action)",
      timing: "Evening (Around 6:00 PM IST)",
      text: `Quick progress update on FlowMoney AI! ⚡🎙️

Here’s Wispr Flow handling something traditional voice assistants hate: rambling human speech with real-time self-corrections.

I dictated:
"Hey Wispr, so um yesterday I was at Blue Tokai with Rohan and paid 650... wait no, actually 350 was Rohan's share that he UPI'd back, so only log 300 under Coffee and meetings. Oh, and also what if my rent goes up by 4,000 next month? Can I still buy the MacBook by December?"

What happened behind the scenes:
1. Stripped 4 filler words ("so", "um", "wait no", "actually").
2. Detected the verbal amendment from ₹650 → ₹300.
3. Created a persistent memory rule: "Blue Tokai = Coffee & Work".
4. Ran a dynamic What-If simulation against my MacBook Pro goal in real time!

Building with voice instead of typing changes everything. 5 hours left before the midnight deadline. On to subscription leak detection next!

@Product Space @Wispr Flow

#BuildInPublic #WisprFlow #ProductSpace #AIHackathon #VoiceAI`
    },
    {
      title: "Post 3: We Shipped It! (Submission & Demo Video)",
      timing: "Night (Before 11:59 PM IST)",
      text: `We shipped it! 🚀🏆

Over the past 10 hours, I built FlowMoney AI for the Product Space × Wispr Flow Agentic AI Hackathon.

The Problem:
Budgeting apps fail because manual entry is friction, bank SMS alerts are messy, and static graphs don't model life changes.

What I built:
FlowMoney AI is a voice-first living money model powered by Wispr Flow Pro:
- 🎙️ Voice-First Living Ingestion: Speak messy thoughts, self-corrections, and multi-intent queries effortlessly.
- 🧠 Learned Memory Loop: Correct a category once by voice, and the agent permanently remembers it.
- 📉 Dynamic What-If Goal Sandbox: Real-time simulation of rent hikes or dining cuts against timeline goals.
- 🚨 Subscription Leak Radar: Flagged an unused gym membership bleeding ₹21,000/yr and a +30% Netflix hike.
- 📄 Executive Monthly Review & Regulatory Guardrails: Ready-to-print financial health review.

Wispr Flow made voice feel like a natural extension of thought rather than a gimmick.

Huge thanks to @Product Space and @Wispr Flow for hosting an intense, high-energy hackathon!

Check out the demo clip below 👇 Would you manage your money by voice?

#AIHackathon #ProductSpace #WisprFlow #BuildInPublic #Fintech #VoiceAI #AgenticAI`
    }
  ];

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 font-mono text-[#18191B]">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E1D1]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#18191B] font-sans">LinkedIn +10 Bonus Streak Toolkit</h3>
              <p className="text-xs text-[#6E726D]">Posts ranked by likes + comments. Highest engagement earns +10 bonus points!</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F4EFE2] text-[#88857B] hover:text-[#18191B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="my-4 p-3.5 rounded-xl bg-[#E9EFE9] border border-[#C2D4C5] text-xs text-[#24422D] flex items-center justify-between">
          <span>Remember to tag <strong>@Product Space</strong> and <strong>@Wispr Flow</strong> on LinkedIn!</span>
          <a
            href="https://www.linkedin.com/company/theproductspace/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 text-[#385741] hover:underline font-bold text-[11px]"
          >
            <span>Product Space Page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#FBF9F1] border border-[#E6E1D1]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-bold text-[#18191B] font-sans">{post.title}</h4>
                  <span className="text-[10px] text-[#88857B]">{post.timing}</span>
                </div>
                <button
                  onClick={() => handleCopy(post.text, idx)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    copiedIndex === idx
                      ? 'bg-[#385741] text-white'
                      : 'bg-[#385741] hover:bg-[#2C4433] text-[#FFFFEB]'
                  }`}
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-[#FFFFEB] border border-[#E6E1D1] text-[11px] text-[#3F443E] font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {post.text}
              </pre>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-[#E6E1D1] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F4EFE2] hover:bg-[#EAE4D5] text-[#18191B]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
