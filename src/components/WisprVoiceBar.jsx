import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Sparkles, Play, CheckCircle, ArrowRight, CornerDownLeft, 
  Eye, RefreshCw, Volume2, ShieldAlert, Cpu, Activity, Zap
} from 'lucide-react';
import { showcaseVoicePresets } from '../data/initialFinanceData';
import { soundEffects } from '../utils/soundEffects';
import { speakNaturalIndianVoice } from '../utils/naturalVoice';

export default function WisprVoiceBar({ onProcessVoice, lastParsedResult, onOpenInspector, isProcessing, onListeningChange }) {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [activePresetId, setActivePresetId] = useState(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    onListeningChange?.(isListening);
  }, [isListening, onListeningChange]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recog.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }
  }, []);

  const toggleMic = () => {
    if (!speechSupported) {
      alert("Browser microphone not supported. Please use your Wispr Flow Pro desktop shortcut to dictate directly into the text box!");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      soundEffects.playWisprActivate();
      setInputText("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    soundEffects.playWisprProcess();
    onProcessVoice(inputText);
  };

  const handleRunPreset = (preset) => {
    soundEffects.playWisprProcess();
    setActivePresetId(preset.id);
    setInputText(preset.rawVoice);
    onProcessVoice(preset.rawVoice);
  };

  const handleReplayVoice = () => {
    if (lastParsedResult) {
      speakNaturalIndianVoice(lastParsedResult.responseSpeech);
    }
  };

  return (
    <div className="w-full my-6 font-mono">
      <div className="rounded-2xl bg-[#FFFFEB] border-2 border-[#D5CFBE] p-4 sm:p-6 shadow-lg transition-all hover:border-[#385741]/50">
        {/* Header Telemetry HUD */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#E6E1D1] text-[10px] uppercase tracking-wider text-[#6E726D]">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#385741] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#385741]"></span>
            </span>
            <span className="text-[#18191B] font-bold text-xs tracking-widest font-sans flex items-center">
              WISPR FLOW PRO <span className="ml-1.5 px-1.5 py-0.2 rounded bg-[#385741] text-[#FFFFEB] text-[9px] font-mono">NEURAL RECEPTOR</span>
            </span>
            <span className="text-[#C8C2AF] hidden sm:inline">•</span>
            <span className="text-[#385741] font-semibold hidden md:inline">Continuous De-noising Active</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#F4EFE2] border border-[#D5CFBE] text-[9px] text-[#6E726D]">
              <Activity className="w-3 h-3 text-[#385741]" />
              <span>LATENCY: 142ms</span>
            </div>

            {lastParsedResult && (
              <button
                onClick={onOpenInspector}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-full border border-[#385741] text-[#385741] bg-[#E9EFE9] hover:bg-[#385741] hover:text-[#FFFFEB] transition-all text-[10px] font-bold shadow-xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>INSPECT DE-NOISING PIPELINE</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Wispr Waveform Animation when Active */}
        {(isListening || isProcessing) && (
          <div className="mb-3 p-3 rounded-xl bg-[#E9EFE9] border border-[#C2D4C5] flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[#D97706] animate-pulse" />
              <span className="text-xs font-bold text-[#18191B] font-sans">
                {isListening ? "Listening with Wispr Flow Audio Stream..." : "Wispr Neural De-noiser Processing Natural Voice..."}
              </span>
            </div>
            {/* Visualizer Waveform Bars */}
            <div className="flex items-end space-x-1 h-5">
              <span className="w-1 bg-[#385741] rounded-full animate-bounce h-3"></span>
              <span className="w-1 bg-[#385741] rounded-full animate-bounce h-5" style={{ animationDelay: '100ms' }}></span>
              <span className="w-1 bg-[#4A6E55] rounded-full animate-bounce h-4" style={{ animationDelay: '200ms' }}></span>
              <span className="w-1 bg-[#385741] rounded-full animate-bounce h-2" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 bg-[#4A6E55] rounded-full animate-bounce h-5" style={{ animationDelay: '250ms' }}></span>
            </div>
          </div>
        )}

        {/* Main Input Dock */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Dictate with Wispr Flow (e.g. 'I spent 650 at Starbucks... wait no, make it 300 for coffee, and what if rent goes up by 4k?')"
              className="w-full py-3.5 pl-4 pr-12 rounded-xl bg-[#FBF9F1] border border-[#D5CFBE] text-[#18191B] placeholder-[#88857B] text-xs focus:outline-none focus:border-[#385741] focus:ring-1 focus:ring-[#385741] font-mono transition-all shadow-inner"
            />

            <button
              type="button"
              onClick={toggleMic}
              className={`absolute right-2 p-2 rounded-lg transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-[#E9EFE9] text-[#385741] hover:bg-[#385741] hover:text-[#FFFFEB]'
              }`}
              title={isListening ? "Listening... click to stop" : "Start speaking with microphone"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-sm ${
              inputText.trim() && !isProcessing
                ? 'bg-[#385741] text-[#FFFFEB] hover:bg-[#2C4433] cursor-pointer'
                : 'bg-[#E5E1D3] text-[#88857B] border border-[#D5CFBE] cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>DE-NOISING...</span>
              </>
            ) : (
              <>
                <span>PROCESS_VOICE</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Real-Time Dual-Stream Deconstruction Display */}
        {lastParsedResult && (
          <div className="mt-4 p-4 rounded-xl bg-[#FBF9F1] border border-[#D5CFBE] text-xs font-mono animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-[#E6E1D1]">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#385741]" />
                <span className="font-bold text-[#18191B] font-sans text-xs">
                  WISPR FLOW PIPELINE DISSECTION
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleReplayVoice}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#FFFFEB] hover:bg-[#E9EFE9] border border-[#D5CFBE] text-[#385741] text-[10px] font-bold transition-all cursor-pointer"
                  title="Replay Voice Response"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#385741]" />
                  <span>REPLAY_AUDIO</span>
                </button>
              </div>
            </div>

            {/* Side-by-Side De-noising Transformation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-2 text-[11px]">
              {/* Raw Messy Voice */}
              <div className="p-3 rounded-lg bg-[#FFFFEB] border border-rose-200">
                <div className="flex items-center justify-between mb-1 text-rose-800 font-bold text-[10px] uppercase">
                  <span>Raw Human Dictation (Messy)</span>
                  <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[9px]">Input</span>
                </div>
                <p className="text-[#591B24] italic leading-relaxed">
                  "{lastParsedResult.rawSpeech}"
                </p>
                {lastParsedResult.foundFillers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {lastParsedResult.foundFillers.map((filler, idx) => (
                      <span key={idx} className="line-through text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded text-[9px] border border-rose-200">
                        {filler}
                      </span>
                    ))}
                    <span className="text-[9px] text-[#6E726D] self-center ml-1">← Stripped by Wispr Flow</span>
                  </div>
                )}
              </div>

              {/* Resolved Action */}
              <div className="p-3 rounded-lg bg-[#E9EFE9] border border-[#C2D4C5]">
                <div className="flex items-center justify-between mb-1 text-[#24422D] font-bold text-[10px] uppercase">
                  <span>Wispr Flow Resolved Intent</span>
                  <span className="bg-[#385741] text-[#FFFFEB] px-1.5 py-0.5 rounded text-[9px]">Output</span>
                </div>
                <p className="text-[#18191B] font-medium leading-relaxed font-sans">
                  "{lastParsedResult.cleanedSpeech}"
                </p>
                {lastParsedResult.selfCorrections.length > 0 && (
                  <div className="mt-2 flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#385741] text-[#FFFFEB] font-bold text-[9px]">
                      {lastParsedResult.selfCorrections[0].from ? `₹${lastParsedResult.selfCorrections[0].from} → ₹${lastParsedResult.selfCorrections[0].to}` : lastParsedResult.selfCorrections[0].to}
                    </span>
                    <span className="text-[9px] text-[#24422D]">Self-correction resolved cleanly</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Agent Speech Feedback */}
            <div className="mt-2 p-2.5 rounded-lg bg-[#FFFFEB] border border-[#D5CFBE] text-[#2B4232] text-[11px] flex items-start space-x-2">
              <Volume2 className="w-4 h-4 text-[#385741] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#18191B]">Voice Feedback: </span>
                <span>{lastParsedResult.responseSpeech}</span>
              </div>
            </div>
          </div>
        )}

        {/* 1-Click Showcase Presets */}
        <div className="mt-4 pt-3 border-t border-[#E6E1D1]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-[#6E726D] uppercase tracking-widest font-bold">
              1-CLICK REAL-WORLD WISPR FLOW BENCHMARKS:
            </span>
            <span className="text-[9px] text-[#385741] font-semibold hidden sm:inline">
              Click any scenario to see instant de-noising & execution
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {showcaseVoicePresets.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleRunPreset(preset)}
                  className={`text-left p-3 rounded-xl border transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#E9EFE9] border-[#385741] shadow-xs'
                      : 'bg-[#FBF9F1] hover:bg-[#E9EFE9] border-[#E6E1D1] hover:border-[#385741]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-[#18191B] group-hover:text-[#385741] uppercase tracking-wider font-sans">
                      {preset.title}
                    </span>
                    <Play className={`w-3 h-3 ${isActive ? 'text-[#385741] fill-current' : 'text-[#6E726D] group-hover:text-[#385741]'}`} />
                  </div>
                  <p className="text-[10px] text-[#555953] line-clamp-2 leading-relaxed">
                    "{preset.rawVoice}"
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between text-[9px] text-[#385741] font-bold">
                    <span>{preset.corrections ? preset.corrections[0] : "Multi-Intent Action"}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
