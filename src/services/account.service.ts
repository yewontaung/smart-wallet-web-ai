import { WalletUser, Transaction } from '../types';
import { AdminAccountSearchFilterDto } from '../schemas/searches';
import { AdminAccountStatusUpdateDto } from '../schemas/inputs';
import { AdminSystemMetricsOutputDto } from '../schemas/output';
import { walletService } from './wallet.service';

const MOCK_ADMIN_ACCOUNTS: WalletUser[] = [
  {
    id: 'usr_99812',
    name: 'Alexandre Mercer',
    email: 'alex.mercer@fintech.io',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phoneNumber: '+95 9 798 123 456',
    kycStatus: 'verified',
    accountNumber: '8829104822',
    tier: 'Gold',
    balance: 2456250,
    currency: 'MMK',
    dailyTransferLimit: 5000000,
    usedDailyLimit: 650000,
    isLocked: false,
    createdAt: '2024-01-15T08:30:00Z',
  },
  {
    id: 'usr_77102',
    name: 'Sophia Chen',
    email: 'sophia.chen@innovate.org',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phoneNumber: '+95 9 432 881 100',
    kycStatus: 'verified',
    accountNumber: '9920149102',
    tier: 'VIP',
    balance: 89420000,
    currency: 'MMK',
    dailyTransferLimit: 25000000,
    usedDailyLimit: 1200000,
    isLocked: false,
    createdAt: '2023-11-20T10:15:00Z',
  },
  {
    id: 'usr_33190',
    name: 'Marcus Vance',
    email: 'marcus.v@crypto-dev.io',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phoneNumber: '+95 9 883 992 110',
    kycStatus: 'pending',
    accountNumber: '4410298311',
    tier: 'Standard',
    balance: 2150000,
    currency: 'MMK',
    dailyTransferLimit: 2000000,
    usedDailyLimit: 0,
    isLocked: false,
    createdAt: '2024-06-10T14:22:00Z',
  },
  {
    id: 'usr_10284',
    name: 'Elena Rostova',
    email: 'elena@artstudio.org',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phoneNumber: '+95 9 771 002 900',
    kycStatus: 'verified',
    accountNumber: '7730192844',
    tier: 'Platinum',
    balance: 34100500,
    currency: 'MMK',
    dailyTransferLimit: 10000000,
    usedDailyLimit: 3400000,
    isLocked: false,
    createdAt: '2024-02-01T11:00:00Z',
  },
  {
    id: 'usr_88291',
    name: 'Liam Hemsworth',
    email: 'liam.h@unverified.net',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phoneNumber: '+95 9 332 119 000',
    kycStatus: 'rejected',
    accountNumber: '1102938475',
    tier: 'Standard',
    balance: 50000,
    currency: 'MMK',
    dailyTransferLimit: 500000,
    usedDailyLimit: 0,
    isLocked: true,
    createdAt: '2024-07-28T16:45:00Z',
  },
];

class AccountService {
  private accountsKey = 'smart_wallet_admin_accounts_v1';

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(this.accountsKey)) {
      localStorage.setItem(this.accountsKey, JSON.stringify(MOCK_ADMIN_ACCOUNTS));
    }
  }

  getAccounts(filter: AdminAccountSearchFilterDto): { items: WalletUser[]; total: number } {
    const raw = localStorage.getItem(this.accountsKey);
    let accounts: WalletUser[] = raw ? JSON.parse(raw) : MOCK_ADMIN_ACCOUNTS;

    // Sync current live user in case they transferred money
    const currentUser = walletService.getUser();
    accounts = accounts.map(a => a.id === currentUser.id ? currentUser : a);

    if (filter.searchKeyword) {
      const kw = filter.searchKeyword.toLowerCase();
      accounts = accounts.filter(
        a => a.name.toLowerCase().includes(kw) ||
             a.email.toLowerCase().includes(kw) ||
             a.accountNumber.includes(kw)
      );
    }

    if (filter.kycStatus && filter.kycStatus !== 'all') {
      accounts = accounts.filter(a => a.kycStatus === filter.kycStatus);
    }

    if (filter.isLockedFilter && filter.isLockedFilter !== 'all') {
      const lockedBool = filter.isLockedFilter === 'locked';
      accounts = accounts.filter(a => a.isLocked === lockedBool);
    }

    if (filter.tierFilter && filter.tierFilter !== 'all') {
      accounts = accounts.filter(a => a.tier === filter.tierFilter);
    }

    const total = accounts.length;
    const start = (filter.page - 1) * filter.pageSize;
    const paginated = accounts.slice(start, start + filter.pageSize);

    return { items: paginated, total };
  }

  getAccountByNumber(accountNumber: string): { user: WalletUser; transactions: Transaction[] } | null {
    const raw = localStorage.getItem(this.accountsKey);
    const accounts: WalletUser[] = raw ? JSON.parse(raw) : MOCK_ADMIN_ACCOUNTS;
    let found = accounts.find(a => a.accountNumber === accountNumber || a.id === accountNumber);

    if (!found && accountNumber === walletService.getUser().accountNumber) {
      found = walletService.getUser();
    }

    if (!found) return null;

    const txs = walletService.getTransactions().filter(
      t => t.userId === found?.id || t.recipientAccount?.includes(found?.accountNumber.slice(-4) || '')
    );

    return { user: found, transactions: txs };
  }

  updateAccountStatus(input: AdminAccountStatusUpdateDto): WalletUser {
    const raw = localStorage.getItem(this.accountsKey);
    let accounts: WalletUser[] = raw ? JSON.parse(raw) : MOCK_ADMIN_ACCOUNTS;

    const index = accounts.findIndex(a => a.accountNumber === input.accountNumber);
    if (index === -1) {
      throw new Error(`Account ${input.accountNumber} not found.`);
    }

    const updated = { ...accounts[index] };
    if (input.newKycStatus) updated.kycStatus = input.newKycStatus;
    if (typeof input.isLocked === 'boolean') updated.isLocked = input.isLocked;
    if (typeof input.overrideDailyLimit === 'number') updated.dailyTransferLimit = input.overrideDailyLimit;

    accounts[index] = updated;
    localStorage.setItem(this.accountsKey, JSON.stringify(accounts));

    if (updated.id === walletService.getUser().id) {
      walletService.updateUser(updated);
    }

    return updated;
  }

  getSystemMetrics(): AdminSystemMetricsOutputDto {
    const raw = localStorage.getItem(this.accountsKey);
    const accounts: WalletUser[] = raw ? JSON.parse(raw) : MOCK_ADMIN_ACCOUNTS;

    const totalReserveLiquidity = accounts.reduce((acc, curr) => acc + curr.balance, 0) + 1250000;
    const pendingKyc = accounts.filter(a => a.kycStatus === 'pending').length;
    const flaggedRisk = accounts.filter(a => a.isLocked || a.kycStatus === 'rejected').length;

    return {
      totalRegisteredUsers: accounts.length + 1420,
      activeAccountsCount: accounts.filter(a => !a.isLocked).length,
      totalReserveLiquidity,
      todayTransactionVolume: 284910.45,
      pendingKycApprovalsCount: pendingKyc,
      flaggedHighRiskCount: flaggedRisk,
    };
  }
}

export const accountService = new AccountService();
