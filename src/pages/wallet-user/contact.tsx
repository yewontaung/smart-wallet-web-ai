import React, { useState } from 'react';
import { Plus, Search, Star, Send, Building, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../../hooks/use-wallet';
import { FormInput } from '../../components/form-input';
import { FloatedNav, WalletNavTab } from '../../components/floated-nav';
import { useNavigate } from 'react-router-dom';

export function ContactPage() {
  const navigate = useNavigate();
  const { contacts, addContact } = useWallet();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAcc, setNewAcc] = useState('');
  const [newBank, setNewBank] = useState('Smart Wallet');

  const filtered = contacts.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) ||
         c.accountNumber.includes(search)
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAcc) return;
    addContact({
      name: newName,
      email: newEmail || 'contact@wallet.com',
      accountNumber: newAcc,
      bankName: newBank,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      isFavorite: true,
      category: 'Frequent',
    });
    setNewName('');
    setNewEmail('');
    setNewAcc('');
    setIsAddOpen(false);
  };

  const handleNavChange = (tab: WalletNavTab) => {
    if (tab === 'home') navigate('/');
    if (tab === 'contact') navigate('/wallet/contact');
    if (tab === 'setting') navigate('/wallet/setting');
  };

  return (
    <div className="min-h-screen bg-[#16161a] text-white font-sans pb-28 relative">
      <div className="max-w-[420px] mx-auto px-5 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-white">Contacts & beneficiaries</h1>
            <p className="text-xs text-sky-200/70">Saved transfer recipients</p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-white shadow-md flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search contacts or account number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-800/60 border border-zinc-700/60 text-xs text-white pl-10 pr-4 py-2.5 rounded-full outline-none focus:border-sky-500/80 placeholder:text-zinc-500"
          />
        </div>

        {/* Contact List */}
        <div className="space-y-2.5">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-2xl bg-[#1e1e24] border border-zinc-800 flex items-center justify-between hover:bg-zinc-800/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={c.avatarUrl} alt={c.name} className="w-11 h-11 rounded-full object-cover border border-sky-400/30" />
                  {c.isFavorite && (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-black p-0.5 rounded-full">
                      <Star className="w-2.5 h-2.5 fill-black" />
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{c.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                    <span className="font-mono">•••• {c.accountNumber.slice(-4)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building className="w-2.5 h-2.5" /> {c.bankName}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white transition-colors"
                title="Send Transfer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Contact Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm bg-zinc-950 border border-blue-500/30 rounded-3xl p-5 text-white shadow-2xl space-y-4">
            <h3 className="text-base font-bold">Add New Beneficiary</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <FormInput label="Full Name" placeholder="e.g. John Doe" value={newName} onChange={(e) => setNewName(e.target.value)} required />
              <FormInput label="Account Number" placeholder="e.g. 882910492" value={newAcc} onChange={(e) => setNewAcc(e.target.value)} required />
              <FormInput label="Bank Name" placeholder="e.g. Chase Bank" value={newBank} onChange={(e) => setNewBank(e.target.value)} />
              <FormInput label="Email (Optional)" placeholder="e.g. john@mail.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-xl text-xs text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FloatedNav activeTab="contact" onChangeTab={handleNavChange} />
    </div>
  );
}
