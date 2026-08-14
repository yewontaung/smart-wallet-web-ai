import { ArrowUpRight, ArrowDownLeft, Plus, CreditCard } from 'lucide-react';

interface JunctionActionButtonsProps {
  onSend: () => void;
  onReceive: () => void;
  onTopUp: () => void;
  onPayBill: () => void;
}

export function JunctionActionButtons({
  onSend,
  onReceive,
  onTopUp,
  onPayBill,
}: JunctionActionButtonsProps) {
  const actions = [
    {
      label: 'Top up',
      icon: <Plus className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />,
      onClick: onTopUp,
    },
    {
      label: 'Receive',
      icon: <ArrowDownLeft className="w-5 h-5 text-white group-hover:translate-y-0.5 group-hover:-translate-x-0.5 transition-transform" />,
      onClick: onReceive,
    },
    {
      label: 'Send',
      icon: <ArrowUpRight className="w-5 h-5 text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />,
      onClick: onSend,
    },
    {
      label: 'Pay bill',
      icon: <CreditCard className="w-5 h-5 text-white group-hover:rotate-6 transition-transform" />,
      onClick: onPayBill,
    },
  ];

  return (
    <div className="relative z-20 px-2 -my-7">
      <div className="flex justify-between items-center px-3">
        {actions.map((act, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <button
              onClick={act.onClick}
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/30 active:scale-95 transition-all shadow-lg group"
            >
              {act.icon}
            </button>
            <span className="text-[11px] font-medium text-zinc-300">
              {act.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
