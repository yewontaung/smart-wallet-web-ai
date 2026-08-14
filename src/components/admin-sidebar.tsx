import { LayoutDashboard, Users, ShieldAlert, ArrowLeftRight, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/admin/overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Customer Accounts', path: '/admin/accounts', icon: <Users className="w-4 h-4" /> },
    { label: 'Risk & KYC Audit', path: '/admin/risk', icon: <ShieldAlert className="w-4 h-4" /> },
    { label: 'Transactions Ledger', path: '/admin/ledger', icon: <ArrowLeftRight className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-3 block mb-2">
            Management Console
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-800/80">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-3 block mb-2">
            System Environment
          </span>
          <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-[11px] space-y-1 text-zinc-400">
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="text-emerald-400 font-mono">Sandbox Dev</span>
            </div>
            <div className="flex justify-between">
              <span>NLP Tool Engine:</span>
              <span className="text-purple-300 font-mono">Agentic v2.4</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="w-full gap-2 border-zinc-800 text-purple-300 hover:text-purple-200 hover:bg-zinc-900"
        >
          <Settings className="w-3.5 h-3.5" />
          Switch to User Wallet UI
        </Button>
      </div>
    </aside>
  );
}
