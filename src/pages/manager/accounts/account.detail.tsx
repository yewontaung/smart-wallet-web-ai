import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Unlock, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../../hooks/use-admin';
import { AdminHeader } from '../../../components/admin-header';
import { AdminSidebar } from '../../../components/admin-sidebar';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';

export function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, logout, fetchAccountDetail, updateAccountStatus } = useAdmin();

  const [overrideLimit, setOverrideLimit] = useState('');
  const [reason, setReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!currentUser) {
    navigate('/admin/login');
    return null;
  }

  const detail = fetchAccountDetail(id || '');

  if (!detail) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold">Account Record Not Found</h2>
          <p className="text-xs text-zinc-400">Account number or ID "{id}" was not located in manager database.</p>
          <Button
            onClick={() => navigate('/admin/accounts')}
            size="sm"
          >
            Return to Accounts List
          </Button>
        </div>
      </div>
    );
  }

  const { user, transactions } = detail;

  const handleKycChange = (newStatus: 'verified' | 'pending' | 'rejected') => {
    updateAccountStatus({
      accountNumber: user.accountNumber,
      newKycStatus: newStatus,
      reason: `KYC status manually changed to ${newStatus} by admin manager.`,
    });
    setSuccessMsg(`KYC status updated to ${newStatus}.`);
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleToggleLock = () => {
    const newLockState = !user.isLocked;
    updateAccountStatus({
      accountNumber: user.accountNumber,
      isLocked: newLockState,
      reason: `Account lock state toggled to ${newLockState} by admin manager.`,
    });
    setSuccessMsg(`Account safety switch updated.`);
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleOverrideLimitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(overrideLimit);
    if (isNaN(parsed) || parsed < 0) return;
    updateAccountStatus({
      accountNumber: user.accountNumber,
      overrideDailyLimit: parsed,
      reason: reason || 'Manager limit override.',
    });
    setOverrideLimit('');
    setReason('');
    setSuccessMsg('Daily transfer limit overridden successfully.');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      <AdminHeader user={currentUser} onLogout={logout} />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-5xl">
          <Button
            onClick={() => navigate('/admin/accounts')}
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white p-0 h-auto gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Account Directory
          </Button>

          {successMsg && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" /> {successMsg}
            </div>
          )}

          {/* Profile Header Banner */}
          <Card className="bg-zinc-900 border-zinc-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30" />
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  {user.name}
                  {user.kycStatus === 'verified' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                </h1>
                <p className="text-xs text-zinc-400">{user.email} • {user.phoneNumber}</p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="font-mono bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800 text-purple-300">
                    Acc: {user.accountNumber}
                  </span>
                  <Badge variant="outline" className="text-amber-300 border-amber-500/30 bg-amber-500/10">
                    {user.tier} Tier
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-right space-y-1">
              <span className="text-[11px] text-zinc-400 block uppercase tracking-wider">Current Wallet Balance</span>
              <span className="text-2xl font-extrabold text-white">{formatCurrency(user.balance, user.currency)}</span>
            </div>
          </Card>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KYC & Lock Manager Controls */}
            <Card className="bg-zinc-900 border-zinc-800 p-5 space-y-4">
              <CardTitle className="text-sm font-bold text-white">Manager Compliance Actions</CardTitle>

              {/* KYC Selector */}
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase block mb-1.5">KYC Verification State</label>
                <div className="flex gap-2">
                  {(['verified', 'pending', 'rejected'] as const).map((status) => (
                    <Button
                      key={status}
                      onClick={() => handleKycChange(status)}
                      size="sm"
                      variant={user.kycStatus === status ? (status === 'verified' ? 'default' : status === 'pending' ? 'secondary' : 'destructive') : 'outline'}
                      className="flex-1 capitalize text-xs h-9"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Safety Switch */}
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Wallet Lock Switch</span>
                  <span className="text-[11px] text-zinc-400">
                    {user.isLocked ? 'Account is blocked by manager' : 'Account is active for transactions'}
                  </span>
                </div>
                <Button
                  onClick={handleToggleLock}
                  variant={user.isLocked ? 'default' : 'destructive'}
                  size="sm"
                  className="gap-1.5"
                >
                  {user.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  {user.isLocked ? 'Unfreeze' : 'Freeze Account'}
                </Button>
              </div>
            </Card>

            {/* Daily Limit Override Form */}
            <Card className="bg-zinc-900 border-zinc-800 p-5 space-y-3">
              <CardTitle className="text-sm font-bold text-white">Daily Transfer Limit Override</CardTitle>
              <p className="text-[11px] text-zinc-400">Current Daily Limit: {formatCurrency(user.dailyTransferLimit, user.currency)}</p>

              <form onSubmit={handleOverrideLimitSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">New Daily Limit ({user.currency})</label>
                  <Input
                    type="number"
                    placeholder="e.g. 5000000"
                    value={overrideLimit}
                    onChange={(e) => setOverrideLimit(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Override Justification Reason</label>
                  <Input
                    type="text"
                    placeholder="e.g. Verified high-net-worth VIP"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full text-xs font-bold"
                >
                  Apply Limit Override
                </Button>
              </form>
            </Card>
          </div>

          {/* Customer Transaction Ledger */}
          <Card className="bg-zinc-900 border-zinc-800 p-5 space-y-3">
            <CardTitle className="text-sm font-bold text-white">Customer Transaction History Audit</CardTitle>

            <div className="space-y-2">
              {transactions.length === 0 ? (
                <div className="text-xs text-zinc-500 py-6 text-center">No transactions on ledger for this account.</div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{tx.title}</span>
                        {tx.agenticSource && (
                          <Badge variant="purple" className="text-[9px] gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> AI Executed
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">{formatDate(tx.createdAt)} • {tx.referenceNumber}</span>
                    </div>

                    <div className="text-right font-bold text-white">
                      {formatCurrency(tx.amount, tx.currency)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
