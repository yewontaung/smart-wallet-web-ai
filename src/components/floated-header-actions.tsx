import { Bell, User } from 'lucide-react';
import { WalletUser, NotificationItem } from '../types';
import { LiquidGlass } from './liquid-glass';

interface FloatedHeaderActionsProps {
  user: WalletUser;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  showProfile?: boolean;
}

export function FloatedHeaderActions({
  user,
  notifications,
  onOpenNotifications,
  onOpenProfile,
  showProfile = true,
}: FloatedHeaderActionsProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex items-center gap-3 z-30">
      {/* Profile Button */}
      {showProfile && (
        <button
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all relative outline-none"
          aria-label="Profile"
        >
          <User className="w-4 h-4 text-white/80" />
        </button>
      )}

      {/* Notification Button */}
      <button
        onClick={onOpenNotifications}
        className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all relative outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-white/80" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center border border-black animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
