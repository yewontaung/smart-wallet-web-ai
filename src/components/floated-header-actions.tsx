import { Bell, User } from 'lucide-react';
import { WalletUser, NotificationItem } from '../types';
import { LiquidGlass } from './glass/liquid-glass';

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
    <LiquidGlass
    depth={100}
    strength={100}
    backgroundColor='rgba(255, 255, 255, 0.1)'
    className="flex items-center gap-3 z-30">
      {/* Profile Button */}
      {showProfile && (
        <div
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all relative outline-none"
          aria-label="Profile"
        >
          <User className="w-4 h-4 text-white/80" />
        </div>
      )}

      {/* Notification Button */}
      <button
        onClick={onOpenNotifications}
        className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all relative outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-white/80" />
      </button>
    </LiquidGlass>
  );
}
