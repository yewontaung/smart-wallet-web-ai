import { Shield, LogOut, Search } from 'lucide-react';
import { ManagerUser } from '../types';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface AdminHeaderProps {
  user: ManagerUser;
  onLogout: () => void;
  onSearchChange?: (val: string) => void;
}

export function AdminHeader({ user, onLogout, onSearchChange }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-zinc-950/90 border-b border-zinc-800 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-wide">
            Banking Admin Portal
          </h1>
          <p className="text-[10px] text-zinc-400">
            {user.department}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {onSearchChange && (
          <div className="relative hidden sm:block w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 z-10" />
            <Input
              type="text"
              placeholder="Search accounts, email..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-zinc-900 border-zinc-800 focus-visible:ring-purple-500"
            />
          </div>
        )}

        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover border border-zinc-700"
          />
          <div className="hidden md:block">
            <span className="text-xs font-bold text-white block leading-none">{user.username}</span>
            <Badge variant="success" className="mt-0.5 text-[9px] py-0 px-1.5">
              {user.role.replace('_', ' ')}
            </Badge>
          </div>

          <Button
            onClick={onLogout}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
            title="Log Out Manager Session"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
