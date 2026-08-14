import { useState } from 'react';
import { Users, DollarSign, ShieldAlert, Activity, ArrowRight } from 'lucide-react';
import { useAdmin } from '../../hooks/use-admin';
import { AdminHeader } from '../../components/admin-header';
import { AdminSidebar } from '../../components/admin-sidebar';
import { AdminStatCard } from '../../components/admin-stat-card';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export function ManagerOverviewPage() {
  const navigate = useNavigate();
  const { currentUser, metrics, logout, fetchAccounts } = useAdmin();
  const [searchKw, setSearchKw] = useState('');

  if (!currentUser) {
    navigate('/admin/login');
    return null;
  }

  const { items: recentAccounts } = fetchAccounts({
    searchKeyword: searchKw,
    page: 1,
    pageSize: 5,
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      <AdminHeader
        user={currentUser}
        onLogout={logout}
        onSearchChange={setSearchKw}
      />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              System Operations Overview
            </h1>
            <p className="text-xs text-zinc-400">
              Real-time liquidity, compliance status & customer accounts audit
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminStatCard
              title="Reserve Liquidity"
              value={formatCurrency(metrics.totalReserveLiquidity)}
              subtitle="Vault balance & client holdings"
              icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
              trend="+4.2%"
              isPositive={true}
            />

            <AdminStatCard
              title="Registered Accounts"
              value={metrics.totalRegisteredUsers.toLocaleString()}
              subtitle={`${metrics.activeAccountsCount} active non-locked`}
              icon={<Users className="w-5 h-5 text-purple-400" />}
              trend="+12 today"
              isPositive={true}
            />

            <AdminStatCard
              title="Today Volume"
              value={formatCurrency(metrics.todayTransactionVolume)}
              subtitle="2,840 ledger settlements"
              icon={<Activity className="w-5 h-5 text-amber-400" />}
              trend="+8.5%"
              isPositive={true}
            />

            <AdminStatCard
              title="Pending KYC Queue"
              value={metrics.pendingKycApprovalsCount}
              subtitle={`${metrics.flaggedHighRiskCount} flagged risk accounts`}
              icon={<ShieldAlert className="w-5 h-5 text-rose-400" />}
              trend="Requires Action"
              isPositive={false}
            />
          </div>

          {/* Customer Accounts Quick Table */}
          <Card className="bg-zinc-900 border-zinc-800 p-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold text-white">Recent Customer Accounts</CardTitle>
                <CardDescription className="text-xs text-zinc-400">Live monitoring of user wallet balances and KYC states</CardDescription>
              </div>

              <Button
                onClick={() => navigate('/admin/accounts')}
                variant="ghost"
                size="sm"
                className="text-purple-400 hover:text-purple-300 gap-1.5"
              >
                View All Accounts <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Account No</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAccounts.map((acc) => (
                    <TableRow key={acc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <img src={acc.avatarUrl} alt={acc.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-white block">{acc.name}</span>
                            <span className="text-[10px] text-zinc-500">{acc.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-zinc-300">{acc.accountNumber}</TableCell>
                      <TableCell>
                        <Badge variant={
                          acc.kycStatus === 'verified' ? 'success' :
                          acc.kycStatus === 'pending' ? 'warning' : 'destructive'
                        }>
                          {acc.kycStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-amber-300">{acc.tier}</TableCell>
                      <TableCell className="font-bold text-white">{formatCurrency(acc.balance, acc.currency)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => navigate(`/admin/accounts/${acc.accountNumber}`)}
                          size="sm"
                          variant="secondary"
                          className="h-7 text-[11px] px-2.5 hover:bg-purple-600 hover:text-white"
                        >
                          Audit Details
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
