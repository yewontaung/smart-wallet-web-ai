import React, { useState } from 'react';
import { Sliders, Shield, Bot, Moon, BellRing, Save, Check } from 'lucide-react';
import { useWallet } from '../../hooks/use-wallet';
import { FormInput } from '../../components/form-input';
import { FloatedNav, WalletNavTab } from '../../components/floated-nav';
import { useNavigate } from 'react-router-dom';

export function SettingPage() {
  const navigate = useNavigate();
  const { user } = useWallet();
  const [dailyLimit, setDailyLimit] = useState(user.dailyTransferLimit.toString());
  const [aiAutoConfirm, setAiAutoConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleNavChange = (tab: WalletNavTab) => {
    if (tab === 'home') navigate('/');
    if (tab === 'contact') navigate('/wallet/contact');
    if (tab === 'setting') navigate('/wallet/setting');
  };

  return (
    <div className="min-h-screen bg-[#16161a] text-white font-sans pb-28 relative">
      <div className="max-w-[420px] mx-auto px-5 pt-6 space-y-5">
        <div>
          <h1 className="text-base font-semibold text-white">Wallet preferences</h1>
          <p className="text-xs text-sky-200/70">Security and NLP agent settings</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Daily Limits */}
          <div className="bg-[#1e1e24] border border-zinc-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-sky-200 tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" /> Transaction thresholds
            </h3>

            <FormInput
              label="Daily Transfer Limit ($)"
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
            />
            <p className="text-[10px] text-zinc-400">
              Maximum allowable transfers per 24 hours. Contact manager admin to override limits above $10,000.
            </p>
          </div>

          {/* Agentic AI Preferences */}
          <div className="bg-[#1e1e24] border border-zinc-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-sky-200 tracking-tight flex items-center gap-2">
              <Bot className="w-4 h-4 text-sky-400" /> Smart NLP agent controls
            </h3>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-xs font-semibold text-white block">Voice Command Auto-Confirm</span>
                <span className="text-[10px] text-zinc-400">Auto execute high confidence tool calls below $50</span>
              </div>
              <button
                type="button"
                onClick={() => setAiAutoConfirm(!aiAutoConfirm)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  aiAutoConfirm ? 'bg-sky-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  aiAutoConfirm ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 font-bold text-sm text-white shadow-md transition-colors flex items-center justify-center gap-2"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            {saved ? 'Settings Saved' : 'Save Changes'}
          </button>
        </form>
      </div>

      <FloatedNav activeTab="setting" onChangeTab={handleNavChange} />
    </div>
  );
}
