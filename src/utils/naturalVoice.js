// Natural Free In-Browser Indian English Voice Synthesizer
// Zero external API keys needed - 100% free and client-side instant!

let cachedVoice = null;

export function getBestNaturalIndianVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  if (cachedVoice) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Priority 1: Natural Microsoft Indian English Voices (Prabhat or Neerja)
  const prabhat = voices.find(v => 
    v.name.includes("Prabhat") && (v.name.includes("Natural") || v.lang.includes("IN"))
  );
  if (prabhat) {
    cachedVoice = prabhat;
    return prabhat;
  }

  // Priority 2: Any Natural Indian English voice
  const naturalIndian = voices.find(v => 
    (v.lang === 'en-IN' || v.lang === 'en_IN') && 
    (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Neural'))
  );
  if (naturalIndian) {
    cachedVoice = naturalIndian;
    return naturalIndian;
  }

  // Priority 3: Google Indian English or standard en-IN
  const anyIndian = voices.find(v => 
    v.lang === 'en-IN' || v.lang === 'en_IN' || v.name.includes('India')
  );
  if (anyIndian) {
    cachedVoice = anyIndian;
    return anyIndian;
  }

  // Priority 4: Natural English male voice (e.g. Natural Guy, Christopher, Andrew)
  const naturalMale = voices.find(v => 
    v.lang.startsWith('en') && 
    (v.name.includes('Natural') || v.name.includes('Online')) && 
    (v.name.includes('Guy') || v.name.includes('David') || v.name.includes('Male'))
  );
  if (naturalMale) {
    cachedVoice = naturalMale;
    return naturalMale;
  }

  // Fallback: Default system voice
  cachedVoice = voices[0];
  return cachedVoice;
}

export function speakNaturalIndianVoice(text, onEnd) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel();

    // Clean monetary symbols for smoother reading (e.g., ₹ -> "rupees")
    const cleanedText = text
      .replace(/₹\s*(\d+(?:,\d+)*)/g, "$1 rupees")
      .replace(/₹/g, " rupees ");

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    const voice = getBestNaturalIndianVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'en-IN';
    }

    // Natural conversational pace
    utterance.rate = 1.02;
    utterance.pitch = 0.98;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Speech synthesis notice:", err);
  }
}

// Pre-warm voices on load
if (typeof window !== 'undefined' && window.speechSynthesis) {
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      getBestNaturalIndianVoice();
    };
  }
}
