import React from 'react';
import { Home, Bot, Users, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type WalletNavTab = 'home' | 'agent' | 'contact' | 'setting';

interface FloatedNavProps {
  activeTab: WalletNavTab;
  onChangeTab?: (tab: WalletNavTab) => void;
  onRefreshData?: () => void;
}

export function FloatedNav({ activeTab, onChangeTab }: FloatedNavProps) {
  const navigate = useNavigate();

  const tabs: { id: WalletNavTab; label: string; icon: React.ReactNode; path: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-[18px] h-[18px]" />, path: '/' },
    { id: 'agent', label: 'Agent', icon: <Bot className="w-[18px] h-[18px]" />, path: '/wallet/agent' },
    { id: 'contact', label: 'Contact', icon: <Users className="w-[18px] h-[18px]" />, path: '/wallet/contact' },
    { id: 'setting', label: 'Setting', icon: <Settings className="w-[18px] h-[18px]" />, path: '/wallet/setting' },
  ];

  const handleTabClick = (tabId: WalletNavTab, path: string) => {
    if (onChangeTab) {
      onChangeTab(tabId);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[390px] bg-[#1a1a20]/95 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 flex items-center justify-between gap-2 z-40 shadow-2xl shadow-black/70">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.path)}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all duration-200 outline-none gap-1 ${
              isActive
                ? 'bg-sky-500/20 text-sky-300 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5 font-normal'
            }`}
          >
            <div className={`transition-transform duration-200 ${isActive ? 'text-sky-300 scale-105' : 'text-zinc-400'}`}>
              {tab.icon}
            </div>
            <span className={`text-[10px] tracking-tight leading-none ${isActive ? 'text-sky-200 font-semibold' : 'text-zinc-400 font-normal'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
