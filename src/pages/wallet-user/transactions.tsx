import { useState } from 'react';
import { ArrowLeft, Search, Filter, ArrowUpRight, ArrowDownLeft, Plus, Receipt, Bot, X, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../../hooks/use-wallet';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

export function AllTransactionsPage() {
  const navigate = useNavigate();
  const { transactions } = useWallet();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = transactions.filter(tx => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch = searchQuery === '' ||
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTxIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="w-4 h-4 text-rose-400" />;
      case 'receive':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'top_up':
        return <Plus className="w-4 h-4 text-purple-400" />;
      case 'pay_bill':
        return <Receipt className="w-4 h-4 text-sky-400" />;
      default:
        return <Bot className="w-4 h-4 text-purple-400" />;
    }
  };

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

          <h1 className="text-base font-semibold text-white tracking-wide">
            Transaction history
          </h1>

          <div className="w-10" />
        </div>

        {/* Redesigned Search & Category Filter Section */}
        <div className="space-y-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search history, reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800/60 text-xs text-white pl-10 pr-9 py-2.5 rounded-full border border-zinc-700/60 focus:outline-none focus:border-sky-500/80 transition-all placeholder:text-zinc-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-white p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
            {[
              { id: 'all', label: 'All', icon: Bot },
              { id: 'send', label: 'Sent', icon: ArrowUpRight },
              { id: 'receive', label: 'Received', icon: ArrowDownLeft },
              { id: 'top_up', label: 'Top-up', icon: Plus },
              { id: 'pay_bill', label: 'Bills', icon: Receipt },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = filterType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`text-[11px] font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-sky-500 border-sky-400 text-white shadow-md shadow-sky-950/30'
                      : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-white hover:bg-zinc-700/60'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Wrapped Sheet */}
        <div className="bg-[#1e1e24] border-t border-zinc-800 rounded-t-[36px] pt-6 px-5 pb-8 -mx-5 shadow-2xl min-h-[450px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-300">
              Filtered records
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 text-xs flex flex-col items-center gap-2">
              <Filter className="w-8 h-8 stroke-1 opacity-40" />
              <span>No transactions match your search filter.</span>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/80">
              {filtered.map((tx) => {
                const isNegative = tx.type === 'send' || tx.type === 'pay_bill';
                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="group flex items-center justify-between py-3.5 px-1 hover:bg-zinc-800/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                        {getTxIcon(tx.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-white group-hover:text-sky-300 transition-colors">
                            {tx.title}
                          </p>
                          {tx.agenticSource && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center gap-0.5">
                              <Bot className="w-2.5 h-2.5" /> AI
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          {formatDate(tx.createdAt)} • <span className="font-mono">{tx.referenceNumber}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-semibold ${isNegative ? 'text-white' : 'text-emerald-400'}`}>
                        {isNegative ? '-' : '+'}{formatCurrency(tx.amount, tx.currency)}
                      </div>
                      <div className="text-[10px] text-zinc-400 capitalize font-medium">
                        {tx.category}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-white shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute right-4 top-4 text-white/50 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pt-2 space-y-1">
              <div className="w-12 h-12 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs text-white/50 uppercase tracking-widest font-semibold block">
                Transaction Detail
              </span>
              <h3 className="text-xl font-bold text-white">{selectedTx.title}</h3>
              <p className="text-2xl font-black text-white pt-1">
                {formatCurrency(selectedTx.amount, selectedTx.currency)}
              </p>
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Reference:</span>
                <span className="font-mono text-white font-semibold">{selectedTx.referenceNumber}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Date & Time:</span>
                <span className="text-white">{formatDate(selectedTx.createdAt)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Category:</span>
                <span className="text-white capitalize">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold capitalize">{selectedTx.status}</span>
              </div>
              {selectedTx.recipientAccount && (
                <div className="flex justify-between text-zinc-400">
                  <span>Recipient Account:</span>
                  <span className="font-mono text-white">{selectedTx.recipientAccount}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white shadow-lg transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
