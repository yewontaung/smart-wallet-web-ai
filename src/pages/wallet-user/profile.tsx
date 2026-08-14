import { ArrowLeft, ShieldCheck, Lock, Unlock, Mail, Phone, CreditCard, ChevronRight, ShieldAlert, Bot, LogOut } from 'lucide-react';
import { useWallet } from '../../hooks/use-wallet';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, toggleLock } = useWallet();

  return (
    <div className="min-h-screen bg-[#16161a] text-white font-sans pb-10 relative">
      <div className="max-w-[420px] mx-auto px-5 pt-6 space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-white hover:bg-zinc-700/80 active:scale-95 transition-all outline-none"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-300" />
          </button>

          <h1 className="text-base font-semibold text-white tracking-wide">
            My Profile
          </h1>

          <div className="w-10" />
        </div>

        {/* Profile Card Header */}
        <div className="bg-[#1e3568] p-6 rounded-3xl border border-sky-900/30 text-center relative overflow-hidden shadow-lg">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 p-1 bg-sky-500/20 border border-sky-400/40 shadow-xl relative">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <h2 className="text-lg font-bold text-white">{user.name}</h2>
          <p className="text-xs text-sky-200/80">{user.email}</p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" />
              {user.tier} Member
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              KYC Verified
            </span>
          </div>
        </div>

        {/* Security Lock Toggle */}
        <div className="bg-[#1e1e24] border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${user.isLocked ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {user.isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Wallet Safety Lock</h4>
              <p className="text-[11px] text-zinc-400">
                {user.isLocked ? 'Outward transactions blocked' : 'Wallet active for transfers'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleLock}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              user.isLocked
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-rose-600/40 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40'
            }`}
          >
            {user.isLocked ? 'Unlock Card' : 'Lock Card'}
          </button>
        </div>

        {/* Account Details List */}
        <div className="bg-[#1e1e24] border border-zinc-800 rounded-3xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-sky-300 uppercase tracking-wider">Account Credentials</h3>

          <div className="flex items-center justify-between py-2 border-b border-zinc-800 text-xs">
            <span className="text-zinc-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-sky-400" /> Account Number
            </span>
            <span className="font-mono font-bold text-white">{user.accountNumber}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-zinc-800 text-xs">
            <span className="text-zinc-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-400" /> Phone Number
            </span>
            <span className="text-white">{user.phoneNumber}</span>
          </div>

          <div className="flex items-center justify-between py-2 text-xs">
            <span className="text-zinc-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400" /> Registered Email
            </span>
            <span className="text-white">{user.email}</span>
          </div>
        </div>

        {/* Admin Navigation Shortcut */}
        <button
          onClick={() => navigate('/admin/login')}
          className="w-full p-4 rounded-3xl bg-[#1e1e24] hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-sky-300 flex items-center justify-between transition-colors shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-sky-500/20 text-sky-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block text-white">Switch to Banking Admin Portal</span>
              <span className="text-[10px] text-zinc-400 font-normal">Manage accounts, risk audits, liquidity</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>
      </div>
    </div>
  );
}
