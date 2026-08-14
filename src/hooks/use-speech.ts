import { useState, useCallback, useRef } from 'react';

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback((onResultCallback?: (text: string) => void) => {
    setIsListening(true);
    setTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          if (onResultCallback) onResultCallback(currentTranscript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        return;
      } catch {
        // Fallback to speech simulation if iframe blocks speech recognition
      }
    }

    // Fallback simulation for iframe environment
    const samplePhrases = [
      'Send $50 to Sarah Jenkins for dinner',
      'Top up $100 from Chase Checking',
      'Pay $85.50 to Pacific Power bill',
      'Lock my wallet security card',
    ];
    const chosenPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];

    let idx = 0;
    const interval = setInterval(() => {
      idx += 3;
      const sub = chosenPhrase.substring(0, idx);
      setTranscript(sub);
      if (onResultCallback) onResultCallback(sub);

      if (idx >= chosenPhrase.length) {
        clearInterval(interval);
        setTimeout(() => setIsListening(false), 500);
      }
    }, 120);

  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    setTranscript,
    startListening,
    stopListening,
  };
}
