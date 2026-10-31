import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Play, CheckCircle, ArrowRight, CornerDownLeft, Eye, RefreshCw } from 'lucide-react';
import { showcaseVoicePresets } from '../data/initialFinanceData';
import { soundEffects } from '../utils/soundEffects';

export default function WisprVoiceBar({ onProcessVoice, lastParsedResult, onOpenInspector, isProcessing, onListeningChange }) {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
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
    setInputText(preset.rawVoice);
    onProcessVoice(preset.rawVoice);
  };

  return (
    <div className="w-full my-6 font-mono">
      <div className="rounded-2xl bg-[#FFFFEB] border border-[#E6E1D1] p-4 sm:p-5 shadow-md">
        {/* Header telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E6E1D1] text-[10px] uppercase tracking-wider text-[#6E726D]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#385741]"></span>
            <span className="text-[#18191B] font-bold">WISPR FLOW PRO REAL-TIME RECEPTOR</span>
            <span className="text-[#C8C2AF]">•</span>
            <span className="text-[#6E726D] hidden sm:inline">TALK WITH WISPR HOTKEY OR CLICK MIC</span>
          </div>

          {lastParsedResult && (
            <button
              onClick={onOpenInspector}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full border border-[#D5CFBE] text-[#385741] hover:bg-[#E9EFE9] transition-all text-[9px] font-semibold"
            >
              <Eye className="w-3 h-3 text-[#385741]" />
              <span>INSPECT DE-NOISING</span>
            </button>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full flex items-center">
            {isListening && (
              <div className="absolute left-4 flex items-center space-x-1 z-10">
                <div className="w-1 bg-[#385741] rounded-full voice-bar-1"></div>
                <div className="w-1 bg-[#4A6E55] rounded-full voice-bar-2"></div>
                <div className="w-1 bg-[#385741] rounded-full voice-bar-3"></div>
                <div className="w-1 bg-[#4A6E55] rounded-full voice-bar-4"></div>
              </div>
            )}

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Dictate via Wispr Flow (e.g. 'I spent 650 at Blue Tokai, wait no make it 300, and what if rent goes up by 4k?')"
              className={`w-full py-3.5 ${isListening ? 'pl-16' : 'pl-4'} pr-12 rounded-xl bg-[#FBF9F1] border border-[#D5CFBE] text-[#18191B] placeholder-[#88857B] text-xs focus:outline-none focus:border-[#385741] font-mono transition-all shadow-inner`}
            />

            <button
              type="button"
              onClick={toggleMic}
              className={`absolute right-2.5 p-2 rounded-lg transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-[#E9EFE9] text-[#385741] hover:bg-[#385741] hover:text-white'
              }`}
              title={isListening ? "Listening... click to stop" : "Start speaking or dictate with Wispr Flow"}
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
                <span>PROCESSING...</span>
              </>
            ) : (
              <>
                <span>PROCESS_VOICE</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Live Dissection Pill */}
        {lastParsedResult && (
          <div className="mt-3 p-3 rounded-xl bg-[#E9EFE9] border border-[#C2D4C5] text-xs font-mono text-[#18191B]">
            <div className="flex flex-wrap items-center gap-2 mb-1.5 text-[10px]">
              <span className="text-[#385741] font-bold flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                SPEECH PARSED:
              </span>
              {lastParsedResult.foundFillers.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFFFEB] text-[#385741] border border-[#D5CFBE]">
                  DROPPED {lastParsedResult.foundFillers.length} FILLERS ({lastParsedResult.foundFillers.join(", ")})
                </span>
              )}
              {lastParsedResult.selfCorrections.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFFFEB] text-[#385741] border border-[#D5CFBE] font-bold">
                  RESOLVED AMENDMENT: {lastParsedResult.selfCorrections[0].from ? `₹${lastParsedResult.selfCorrections[0].from} → ₹${lastParsedResult.selfCorrections[0].to}` : lastParsedResult.selfCorrections[0].to}
                </span>
              )}
            </div>
            <p className="text-[#2A3B2F] text-[11px] italic bg-[#FFFFEB] p-2 rounded-lg border border-[#D5CFBE]">
              "{lastParsedResult.responseSpeech}"
            </p>
          </div>
        )}

        {/* 1-Click Test Presets */}
        <div className="mt-4 pt-3 border-t border-[#E6E1D1]">
          <span className="text-[10px] text-[#6E726D] uppercase tracking-widest font-bold block mb-2">
            PRESETS // TEST REAL-WORLD SCENARIOS:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {showcaseVoicePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleRunPreset(preset)}
                className="text-left p-3 rounded-xl bg-[#FBF9F1] hover:bg-[#E9EFE9] border border-[#E6E1D1] hover:border-[#385741] transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#18191B] group-hover:text-[#385741] uppercase tracking-wider">
                    {preset.title}
                  </span>
                  <Play className="w-2.5 h-2.5 text-[#6E726D] group-hover:text-[#385741]" />
                </div>
                <p className="text-[10px] text-[#555953] line-clamp-2 leading-relaxed">
                  "{preset.rawVoice}"
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
