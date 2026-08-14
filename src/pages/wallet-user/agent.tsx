import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, Mic, MicOff, ArrowRight, CheckCircle2, AlertCircle, Terminal, Play, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { useSpeech } from '../../hooks/use-speech';
import { nlpAgentService } from '../../services/nlp-agent.service';
import { NlpAgenticToolCallOutputDto } from '../../schemas/output';
import { FloatedNav } from '../../components/floated-nav';
import { useWallet } from '../../hooks/use-wallet';

export function AgentPage() {
  const navigate = useNavigate();
  const { refreshData } = useWallet();

  const [commandText, setCommandText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedToolCall, setParsedToolCall] = useState<NlpAgenticToolCallOutputDto | null>(null);
  const [executionResult, setExecutionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [commandHistory, setCommandHistory] = useState<Array<{ id: string; command: string; toolName: string; time: string; success: boolean }>>([
    { id: '1', command: 'Send 25,000 MMK to Sarah', toolName: 'transfer_funds', time: '10 mins ago', success: true },
    { id: '2', command: 'Check account balance', toolName: 'get_balance', time: '1 hour ago', success: true },
  ]);

  const { isListening, transcript, startListening, stopListening } = useSpeech();

  // Sync speech recognition transcript
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
      await new Promise((r) => setTimeout(r, 450));
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

    if (res.success) {
      refreshData();
      setCommandHistory((prev) => [
        {
          id: Date.now().toString(),
          command: commandText || parsedToolCall.confidenceMessage,
          toolName: parsedToolCall.toolName,
          time: 'Just now',
          success: true,
        },
        ...prev,
      ]);
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

  const quickPrompts = [
    'Send 50000 MMK to Sarah',
    'Top up 10000 MMK to 09987654321',
    'Pay bill 25000 MMK for Electricity',
    'Lock my wallet for security',
  ];

  return (
    <div className="min-h-screen bg-[#16161a] text-white font-sans pb-28 relative overflow-x-hidden selection:bg-sky-500 selection:text-white">
      <div className="relative max-w-[420px] mx-auto px-5 pt-6 space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-white hover:bg-zinc-700/80 active:scale-95 transition-all outline-none"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-300" />
          </button>

          <div className="text-center">
            <h1 className="text-base font-semibold text-white tracking-wide">
              Smart AI Agent
            </h1>
            <p className="text-[11px] text-sky-400 font-medium flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Engine Online & Ready
            </p>
          </div>

          <button
            onClick={resetAll}
            className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/80 active:scale-95 transition-all outline-none"
            title="Reset Console"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Card */}
        <div className="bg-[#1e3568] p-5 rounded-3xl border border-sky-900/40 relative overflow-hidden shadow-xl space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300">
              <Bot className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                Agentic Natural Language Engine <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </h2>
              <p className="text-[11px] text-sky-200/80 leading-snug">
                Type or speak commands in plain English to execute transfers, top-ups, or bill payments.
              </p>
            </div>
          </div>
        </div>

        {/* Command Input Container */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-zinc-300 block">
            Command Input
          </label>

          <div className="bg-zinc-900/90 border border-zinc-800 focus-within:border-sky-500/80 rounded-2xl p-3 shadow-inner transition-all space-y-2">
            <input
              type="text"
              placeholder={isListening ? 'Listening to voice command...' : 'Type command (e.g. Send 50000 MMK to Sarah)...'}
              value={commandText}
              onChange={(e) => setCommandText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleProcessNLP()}
              className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none px-1 py-1"
            />

            {/* Action Row Inside Border: Ghost Mic Button + Circle Send Button */}
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
          </div>

          {/* Quick Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-zinc-400 font-medium">Try asking:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-[11px] px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-zinc-300 hover:text-white transition-all text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Processing Spinner State */}
        {isProcessing && (
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center space-y-2 animate-pulse">
            <Bot className="w-6 h-6 text-sky-400 mx-auto animate-bounce" />
            <p className="text-xs text-sky-300 font-medium">
              Parsing natural language intent & structuring tool parameters...
            </p>
          </div>
        )}

        {/* Parsed Tool Execution Output Card */}
        {parsedToolCall && !executionResult && !isProcessing && (
          <div className="p-4 rounded-2xl bg-[#1e1e24] border border-sky-500/40 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> Structured Tool Call Detected
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Confidence: {Math.round(parsedToolCall.confidenceScore * 100)}%
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <div className="text-zinc-400">
                Function: <span className="text-amber-300 font-bold">{parsedToolCall.toolName}</span>
              </div>
              <div className="text-zinc-400">
                Parameters:{' '}
                <pre className="text-sky-300 text-[11px] mt-1 whitespace-pre-wrap">
                  {JSON.stringify(parsedToolCall.parameters, null, 2)}
                </pre>
              </div>
            </div>

            <p className="text-xs text-zinc-300 italic">
              "{parsedToolCall.confidenceMessage}"
            </p>

            <button
              onClick={handleExecuteTool}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" /> Confirm & Execute Tool
            </button>
          </div>
        )}

        {/* Execution Result Banner */}
        {executionResult && (
          <div
            className={`p-4 rounded-2xl border ${
              executionResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            } flex items-start gap-3 animate-in fade-in`}
          >
            {executionResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="text-xs font-bold">
                {executionResult.success ? 'Execution Successful' : 'Execution Error'}
              </p>
              <p className="text-xs opacity-90">{executionResult.message}</p>
            </div>
          </div>
        )}

        {/* Agent Activity History */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Agent Execution Logs
          </h3>

          <div className="space-y-2">
            {commandHistory.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#1e1e24] border border-zinc-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{log.command}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      Tool: {log.toolName} • {log.time}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                  Success
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FloatedNav activeTab="agent" />
    </div>
  );
}
