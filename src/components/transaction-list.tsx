import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Plus, Receipt, Bot, Search, Filter, X, ArrowRight, Sparkles } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  onSelectTransaction?: (tx: Transaction) => void;
  onViewAll?: () => void;
  showCategories?: boolean;
}

export function TransactionList({
  transactions,
  onSelectTransaction,
  onViewAll,
  showCategories = false,
}: TransactionListProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);

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
        return <Plus className="w-4 h-4 text-blue-400" />;
      case 'pay_bill':
        return <Receipt className="w-4 h-4 text-sky-400" />;
      default:
        return <Bot className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-0.5">
        <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
          Recent transactions
        </h2>

        {/* Search Icon & View List Icon in order */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearchBox(!showSearchBox)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shadow-md ${
              showSearchBox ? 'bg-sky-500/20 border-sky-400 text-sky-300' : 'bg-zinc-800/80 hover:bg-zinc-700/80 border-zinc-700/80 text-white'
            }`}
            title="Search transactions"
            aria-label="Search transactions"
          >
            <Search className="w-4 h-4" />
          </button>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 active:scale-95 border border-zinc-700/80 flex items-center justify-center text-white transition-all shadow-md group"
              title="View all transactions"
              aria-label="View all transactions"
            >
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Conditionally Toggleable Search Input Bar */}
      {showSearchBox && (
        <div className="relative w-full animate-in fade-in">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search transactions, bills, reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-zinc-800/60 text-xs text-white pl-10 pr-9 py-2.5 rounded-full border border-zinc-700/60 focus:outline-none focus:border-sky-500/80 transition-all placeholder:text-zinc-500 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-zinc-500 hover:text-white p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Category Quick Search Filter Pills (Shown ONLY when showCategories is true) */}
      {showCategories && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          {[
            { id: 'all', label: 'All', icon: Sparkles },
            { id: 'send', label: 'Sent', icon: ArrowUpRight },
            { id: 'receive', label: 'Received', icon: ArrowDownLeft },
            { id: 'top_up', label: 'Top-Ups', icon: Plus },
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
                <Icon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-white/40'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Transaction Items Container in lighter dark bg */}
      <div className="bg-[#1e1e26] border border-white/5 rounded-3xl p-4 shadow-xl">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-zinc-400 text-xs flex flex-col items-center gap-2">
            <Filter className="w-7 h-7 stroke-1 opacity-40" />
            <span>No matching transactions found.</span>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {filtered.map((tx) => {
              const isNegative = tx.type === 'send' || tx.type === 'pay_bill';
              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction?.(tx)}
                  className="group flex items-center justify-between py-3.5 px-2 hover:bg-white/5 transition-colors cursor-pointer rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                      {getTxIcon(tx.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                          {tx.title}
                        </p>
                        {tx.agenticSource && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-0.5">
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
  );
}

