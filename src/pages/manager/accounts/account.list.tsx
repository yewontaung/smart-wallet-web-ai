import { useState } from 'react';
import { Search, Lock, Unlock, ChevronRight } from 'lucide-react';
import { useAdmin } from '../../../hooks/use-admin';
import { AdminHeader } from '../../../components/admin-header';
import { AdminSidebar } from '../../../components/admin-sidebar';
import { formatCurrency } from '../../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export function AccountListPage() {
  const navigate = useNavigate();
  const { currentUser, logout, fetchAccounts, updateAccountStatus } = useAdmin();

  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [lockFilter, setLockFilter] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [page] = useState(1);

  if (!currentUser) {
    navigate('/admin/login');
    return null;
  }

  const { items, total } = fetchAccounts({
    searchKeyword: search,
    kycStatus: kycFilter,
    isLockedFilter: lockFilter,
    page,
    pageSize: 10,
  });

  const handleToggleLock = (accountNumber: string, currentIsLocked: boolean) => {
    updateAccountStatus({
      accountNumber,
      isLocked: !currentIsLocked,
      reason: 'Admin manager status toggle from account list.',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      <AdminHeader user={currentUser} onLogout={logout} onSearchChange={setSearch} />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 space-y-5 overflow-y-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Customer Accounts Management
              </h1>
              <p className="text-xs text-zinc-400">
                Found {total} customer profiles matching filters
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 z-10" />
                <Input
                  type="text"
                  placeholder="Search name, email or account number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-zinc-950 border-zinc-800"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-[11px]">KYC:</span>
                <select
                  value={kycFilter}
                  onChange={(e: any) => setKycFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-white text-xs px-2.5 py-1.5 rounded-md outline-none"
                >
                  <option value="all">All KYC</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>

                <span className="text-zinc-400 text-[11px]">Lock:</span>
                <select
                  value={lockFilter}
                  onChange={(e: any) => setLockFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-white text-xs px-2.5 py-1.5 rounded-md outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="locked">Locked Only</option>
                  <option value="unlocked">Unlocked Only</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Table */}
          <Card className="bg-zinc-900 border-zinc-800 p-1">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Account No</TableHead>
                    <TableHead>KYC State</TableHead>
                    <TableHead>Lock Switch</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((acc) => (
                    <TableRow key={acc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={acc.avatarUrl} alt={acc.name} className="w-8 h-8 rounded-full object-cover border border-zinc-700" />
                          <div>
                            <span className="font-bold text-white block">{acc.name}</span>
                            <span className="text-[10px] text-zinc-500">{acc.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-semibold text-zinc-300">{acc.accountNumber}</TableCell>
                      <TableCell>
                        <Badge variant={
                          acc.kycStatus === 'verified' ? 'success' :
                          acc.kycStatus === 'pending' ? 'warning' : 'destructive'
                        }>
                          {acc.kycStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleToggleLock(acc.accountNumber, acc.isLocked)}
                          size="sm"
                          variant={acc.isLocked ? "destructive" : "outline"}
                          className="h-7 text-[10px] px-2.5 gap-1"
                        >
                          {acc.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          {acc.isLocked ? 'Locked' : 'Active'}
                        </Button>
                      </TableCell>
                      <TableCell className="font-bold text-white">{formatCurrency(acc.balance, acc.currency)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => navigate(`/admin/accounts/${acc.accountNumber}`)}
                          size="sm"
                          className="h-7 text-xs px-3 gap-1"
                        >
                          Details <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
