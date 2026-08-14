import { useState, useEffect } from 'react';
import { Bot, Mic, MicOff, ArrowRight, CheckCircle2, AlertCircle, X, Terminal, Play, ShieldAlert } from 'lucide-react';
import { LiquidGlass } from './liquid-glass';
import { useSpeech } from '../hooks/use-speech';
import { nlpAgentService } from '../services/nlp-agent.service';
import { NlpAgenticToolCallOutputDto } from '../schemas/output';

interface AiCommandPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
  onTransactionSuccess?: () => void;
}

export function AiCommandPopup({ isOpen: controlledIsOpen, onClose, onTransactionSuccess }: AiCommandPopupProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
    resetAll();
  };

  const [commandText, setCommandText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedToolCall, setParsedToolCall] = useState<NlpAgenticToolCallOutputDto | null>(null);
  const [executionResult, setExecutionResult] = useState<{ success: boolean; message: string } | null>(null);

  const { isListening, transcript, startListening, stopListening } = useSpeech();

  // Sync transcript to commandText when listening
  useEffect(() => {
    if (transcript) {
      setCommandText(transcript);
    }
  }, [transcript]);

  const handleProcessNLP = async (textToProcess?: string) => {
    const input = textToProcess || commandText;
    if (!input.trim()) return;

    setIsProcessing(true);
    setExecutionResult(null);

    try {
      // Simulate slight model latency for agentic tool parsing
      await new Promise(r => setTimeout(r, 400));
      const result = await nlpAgentService.processCommand(input);
      setParsedToolCall(result);
    } catch {
      setParsedToolCall(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteTool = () => {
    if (!parsedToolCall) return;
    const res = nlpAgentService.executeToolCall(parsedToolCall);
    setExecutionResult(res);
    if (res.success && onTransactionSuccess) {
      onTransactionSuccess();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setCommandText(prompt);
    handleProcessNLP(prompt);
  };

  const resetAll = () => {
    setCommandText('');
    setParsedToolCall(null);
    setExecutionResult(null);
  };

  return (
    <>
      {/* Pop-up AI Modal / Drawer Interface */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#1e1e24] border border-zinc-800 rounded-3xl p-6 text-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-sky-300">
                  <Bot className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">
                    Smart NLP Agent
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Agentic Tool Calling & Command Engine
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Sample Prompts */}
            <div className="mb-4">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                Sample Voice & Text Intent Commands
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Send 50000 MMK to Sarah Jenkins',
                  'Top up 100000 MMK from KBZ Pay',
                  'Pay 85000 MMK YESC Power',
                  'Lock my wallet card',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-[11px] px-3 py-1 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-left"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            {/* Command Input Box with Voice Ghost Button & Circle Send Button */}
            <div className="bg-zinc-900/90 border border-zinc-800 focus-within:border-sky-500/80 rounded-2xl p-3 shadow-inner transition-all space-y-2 mb-4">
              <input
                type="text"
                placeholder={isListening ? 'Listening to voice command...' : 'Type command (e.g. Send 50000 MMK to Sarah)...'}
                value={commandText}
                onChange={(e) => setCommandText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleProcessNLP()}
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none px-1 py-1"
              />

              {/* Action Row Inside Border: Ghost Mic Icon Button + Circle Send Button */}
              <div className="flex items-center justify-between pt-1.5 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={isListening ? stopListening : () => startListening((t) => setCommandText(t))}
                  className={`p-2 rounded-full transition-all outline-none ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-300 animate-pulse'
                      : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={isListening ? 'Listening...' : 'Voice Dictation'}
                >
                  {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-zinc-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleProcessNLP()}
                  disabled={!commandText.trim() || isProcessing}
                  className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-white flex items-center justify-center transition-all shadow-md active:scale-95 outline-none"
                  title="Send Command"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {isListening && (
                <div className="flex items-center gap-2 text-xs text-rose-300 font-medium px-2 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Voice active... Speak command like "Send $50 to Sarah"
                </div>
              )}
            </div>

            {/* Processing State */}
            {isProcessing && (
              <div className="py-8 text-center text-blue-200 text-xs flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span>NLP Model parsing intent & constructing Tool Call...</span>
              </div>
            )}

            {/* Agentic Tool Call Inspection Display */}
            {parsedToolCall && !isProcessing && (
              <div className="space-y-3 bg-blue-950/60 border border-blue-400/30 rounded-2xl p-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-200">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    Structured Tool Call Identified
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {(parsedToolCall.confidenceScore * 100).toFixed(0)}% Confidence
                  </span>
                </div>

                {/* Intent Summary */}
                <div className="text-xs text-blue-100 font-medium">
                  <strong>Intent:</strong> {parsedToolCall.intentDetected}
                </div>

                <div className="text-xs text-blue-200/80 bg-blue-900/40 p-2.5 rounded-xl border border-blue-500/20 font-mono text-[11px] space-y-1">
                  <div className="text-blue-300 font-bold">
                    Tool: <span className="text-amber-300">{parsedToolCall.toolCallName}()</span>
                  </div>
                  <div className="text-blue-200/90">
                    Params: {JSON.stringify(parsedToolCall.toolArguments, null, 2)}
                  </div>
                </div>

                {/* Execution Result or Confirmation Button */}
                {executionResult ? (
                  <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
                    executionResult.success
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-500/20 border border-rose-500/40 text-rose-200'
                  }`}>
                    {executionResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span>{executionResult.message}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={resetAll}
                      className="px-3.5 py-2 rounded-xl text-xs text-blue-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleExecuteTool}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg flex items-center gap-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Execute Tool Call
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
