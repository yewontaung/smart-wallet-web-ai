import { X, CheckCheck, Sparkles, Bell, Shield, ArrowUpRight } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: () => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
}: NotificationDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-zinc-950 border border-purple-500/30 rounded-3xl p-5 text-white shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkRead}
              className="text-[11px] font-semibold text-purple-300 hover:text-white flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark Read
            </button>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-2xl border transition-all ${
                n.isRead
                  ? 'bg-zinc-900/40 border-zinc-800/60 opacity-70'
                  : 'bg-purple-950/40 border-purple-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  {n.type === 'ai_agent' && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                  {n.type === 'security' && <Shield className="w-3.5 h-3.5 text-rose-400" />}
                  {n.type === 'transaction' && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />}
                  {n.title}
                </span>
                <span className="text-[10px] text-zinc-400">{n.timestamp}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
