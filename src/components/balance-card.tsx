import { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { WalletUser } from '../types';
import { splitBalance, maskAccountNumber } from '../utils/formatters';

interface BalanceCardProps {
  user: WalletUser;
  showBalance: boolean;
  onToggleShowBalance: () => void;
  onQuickAction?: (type: 'send' | 'top_up' | 'pay_bill' | 'receive') => void;
}

export function BalanceCard({
  user,
  showBalance,
  onToggleShowBalance,
}: BalanceCardProps) {
  const [copied, setCopied] = useState(false);

  const copyAcc = () => {
    navigator.clipboard.writeText(user.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { integerPart, decimalPart, currency } = splitBalance(user.balance, user.currency);

  return (
    <div className="w-full flex flex-col gap-3 text-white py-1">
      {/* Account Info & Status Row (Above Balance) */}
      <div className="flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="tracking-wider text-zinc-200 font-medium">
            Acc: {maskAccountNumber(user.accountNumber)}
          </span>
          <button
            onClick={copyAcc}
            className="text-zinc-400 hover:text-white transition-colors p-1"
            title="Copy Account Number"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onToggleShowBalance}
            className="text-zinc-400 hover:text-white transition-colors outline-none p-1 ml-0.5"
            title={showBalance ? 'Hide Balance' : 'Show Balance'}
          >
            {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Balance Display with Mini Elevated Decimals */}
      <div className="pt-1 pb-2">
        {showBalance ? (
          <div className="flex items-baseline flex-wrap gap-1 font-bold text-white tracking-tight">
            <span className="text-4xl sm:text-5xl font-extrabold text-white leading-none">
              {integerPart}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-zinc-300 tracking-tight leading-none">
              {decimalPart}
            </span>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-0.5">
              {currency}
            </span>
          </div>
        ) : (
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-none">
            ••••••••
          </h1>
        )}
      </div>
    </div>
  );
}


