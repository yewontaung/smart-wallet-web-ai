import React, { useState } from 'react';
import { X, ArrowUpRight, Plus, Receipt, QrCode, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FormInput } from './form-input';
import { WalletUser, Contact } from '../types';
import { walletService } from '../services/wallet.service';
import { formatCurrency } from '../utils/formatters';

interface ActionModalProps {
  type: 'send' | 'receive' | 'top_up' | 'pay_bill' | null;
  onClose: () => void;
  onSuccess: () => void;
  user: WalletUser;
  contacts: Contact[];
}

export function ActionModal({
  type,
  onClose,
  onSuccess,
  user,
  contacts,
}: ActionModalProps) {
  const [recipientAcc, setRecipientAcc] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sourceBank, setSourceBank] = useState('Chase Checking');
  const [billerName, setBillerName] = useState('Pacific Power & Light');
  const [pin, setPin] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!type) return null;

  const handleSelectContact = (c: Contact) => {
    setRecipientAcc(c.accountNumber);
    setRecipientName(c.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Please enter a valid amount.');
      }

      if (type === 'send') {
        if (!recipientName.trim()) throw new Error('Recipient name is required.');
        const res = walletService.sendMoney({
          recipientAccountNumber: recipientAcc || '9920149102',
          recipientName,
          amount: parsedAmount,
          note,
          pin: pin || '****',
        });
        setSuccessMsg(res.message);
      } else if (type === 'top_up') {
        const res = walletService.topUp({
          sourceBankName: sourceBank,
          amount: parsedAmount,
          fundingSourceId: 'src_102',
        });
        setSuccessMsg(res.message);
      } else if (type === 'pay_bill') {
        const res = walletService.payBill({
          billerId: 'bil_001',
          billerName,
          accountReferenceNumber: 'UTIL-88291',
          amount: parsedAmount,
        });
        setSuccessMsg(res.message);
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Action failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border border-purple-500/30 rounded-3xl p-6 text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-purple-600/30 border border-purple-400/30 text-purple-200">
              {type === 'send' && <ArrowUpRight className="w-5 h-5 text-purple-300" />}
              {type === 'receive' && <QrCode className="w-5 h-5 text-emerald-300" />}
              {type === 'top_up' && <Plus className="w-5 h-5 text-amber-300" />}
              {type === 'pay_bill' && <Receipt className="w-5 h-5 text-sky-300" />}
            </div>
            <div>
              <h3 className="text-base font-bold capitalize">
                {type === 'send' && 'Send Money'}
                {type === 'receive' && 'Receive Money QR'}
                {type === 'top_up' && 'Top Up Balance'}
                {type === 'pay_bill' && 'Pay Utility Bill'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Wallet Balance: <strong className="text-white">{formatCurrency(user.balance, user.currency)}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Feedback overlay */}
        {successMsg ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Transaction Success!</h4>
            <p className="text-xs text-zinc-300">{successMsg}</p>
          </div>
        ) : type === 'receive' ? (
          /* Receive QR Display */
          <div className="space-y-4 text-center py-2">
            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg border-4 border-purple-500/40">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`smartwallet:${user.accountNumber}`)}`}
                alt="Receive QR"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block">Account Reference Number</span>
              <span className="text-sm font-mono font-bold text-purple-300">{user.accountNumber}</span>
            </div>

            <p className="text-xs text-zinc-400">
              Scan QR code or use account number to receive instant transfers.
            </p>
          </div>
        ) : (
          /* Form for Send, Top Up, Pay Bill */
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-xs text-rose-300 bg-rose-500/20 border border-rose-500/40 p-2.5 rounded-xl">
                {error}
              </div>
            )}

            {/* Send Money Specifics */}
            {type === 'send' && (
              <>
                <div>
                  <span className="text-xs font-semibold text-zinc-400 uppercase block mb-1.5">
                    Quick Beneficiaries
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {contacts.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectContact(c)}
                        className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border text-xs whitespace-nowrap transition-all ${
                          recipientName === c.name
                            ? 'bg-purple-600/40 border-purple-400 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <img src={c.avatarUrl} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <FormInput
                  label="Recipient Name"
                  placeholder="e.g. Sarah Jenkins"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                />

                <FormInput
                  label="Account Number (Optional)"
                  placeholder="e.g. 9920149102"
                  value={recipientAcc}
                  onChange={(e) => setRecipientAcc(e.target.value)}
                />
              </>
            )}

            {/* Top Up Specifics */}
            {type === 'top_up' && (
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase block mb-1.5">
                  Funding Bank Account
                </label>
                <select
                  value={sourceBank}
                  onChange={(e) => setSourceBank(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl p-3 text-sm outline-none focus:border-purple-400"
                >
                  <option value="Chase Checking">Chase Checking (•••• 8192)</option>
                  <option value="Bank of America">Bank of America (•••• 1029)</option>
                  <option value="Wells Fargo Savings">Wells Fargo Savings (•••• 4910)</option>
                </select>
              </div>
            )}

            {/* Pay Bill Specifics */}
            {type === 'pay_bill' && (
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase block mb-1.5">
                  Select Biller
                </label>
                <select
                  value={billerName}
                  onChange={(e) => setBillerName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl p-3 text-sm outline-none focus:border-purple-400"
                >
                  <option value="Pacific Power & Light">Pacific Power & Light ($124.50)</option>
                  <option value="Xfinity Broadband Internet">Xfinity Broadband Internet ($89.00)</option>
                  <option value="City Water & Waste">City Water & Waste ($45.20)</option>
                </select>
              </div>
            )}

            {/* Common Amount Input */}
            <FormInput
              label="Amount ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            {type === 'send' && (
              <FormInput
                label="Transaction Note"
                placeholder="e.g. Dinner share"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 font-bold text-sm text-white shadow-xl transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {loading ? 'Processing...' : 'Confirm Transaction'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
