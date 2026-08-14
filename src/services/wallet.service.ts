import { Contact, NotificationItem, Transaction, WalletUser } from '../types';
import { PayBillInputDto, SendMoneyInputDto, TopUpInputDto } from '../schemas/inputs';
import { TransactionResultOutputDto, WalletBalanceOutputDto } from '../schemas/output';

const INITIAL_USER: WalletUser = {
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
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_101',
    userId: 'usr_99812',
    type: 'send',
    title: 'Transfer to Sarah Jenkins',
    recipientName: 'Sarah Jenkins',
    recipientAccount: '•••• 4910',
    amount: 150000,
    currency: 'MMK',
    fee: 0,
    status: 'completed',
    category: 'Transfer',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    referenceNumber: 'REF-88912',
    note: 'Dinner & drinks',
  },
  {
    id: 'tx_102',
    userId: 'usr_99812',
    type: 'receive',
    title: 'Salary Deposit - TechCorp Inc',
    recipientName: 'TechCorp Payroll',
    amount: 4200000,
    currency: 'MMK',
    fee: 0,
    status: 'completed',
    category: 'Income',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    referenceNumber: 'REF-77120',
  },
  {
    id: 'tx_103',
    userId: 'usr_99812',
    type: 'pay_bill',
    title: 'Yangon Electricity Supply',
    billerName: 'YESC Power',
    amount: 124500,
    currency: 'MMK',
    fee: 1500,
    status: 'completed',
    category: 'Utilities',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    referenceNumber: 'REF-65109',
  },
  {
    id: 'tx_104',
    userId: 'usr_99812',
    type: 'top_up',
    title: 'Top Up from KBZ Pay',
    amount: 500000,
    currency: 'MMK',
    fee: 0,
    status: 'completed',
    category: 'Deposit',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    referenceNumber: 'REF-54188',
  },
  {
    id: 'tx_105',
    userId: 'usr_99812',
    type: 'send',
    title: 'Payment to Foodpanda MM',
    recipientName: 'Foodpanda',
    amount: 32800,
    currency: 'MMK',
    fee: 0,
    status: 'completed',
    category: 'Food & Dining',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    referenceNumber: 'REF-33104',
  },
  {
    id: 'tx_106',
    userId: 'usr_99812',
    type: 'send',
    title: 'Payment to Foodpanda MM',
    recipientName: 'Foodpanda',
    amount: 32800,
    currency: 'MMK',
    fee: 0,
    status: 'completed',
    category: 'Food & Dining',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    referenceNumber: 'REF-33104',
  },
  {
    id: 'tx_107',
    userId: 'usr_99812',
    type: 'send',
    title: 'Payment to Foodpanda MM',
    recipientName: 'Foodpanda',
    amount: 32800,
    currency: 'MMK',
    fee: 0,
    status: 'completed',
    category: 'Food & Dining',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    referenceNumber: 'REF-33104',
  },
  {
    id: 'tx_108',
    userId: 'usr_99812',
    type: 'send',
    title: 'Payment to Foodpanda MM',
    recipientName: 'Foodpanda',
    amount: 32800,
    currency: 'MMK',
    fee: 0,
    status: 'completed',
    category: 'Food & Dining',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    referenceNumber: 'REF-33104',
  },
];

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cnt_1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@gmail.com',
    accountNumber: '9920149102',
    bankName: 'Smart Wallet',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    isFavorite: true,
    category: 'Frequent',
  },
  {
    id: 'cnt_2',
    name: 'Michael Vance',
    email: 'm.vance@work.com',
    accountNumber: '4410298311',
    bankName: 'Chase Bank',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isFavorite: true,
    category: 'Business',
  },
  {
    id: 'cnt_3',
    name: 'Elena Rostova',
    email: 'elena@artstudio.org',
    accountNumber: '7730192844',
    bankName: 'Smart Wallet',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    isFavorite: false,
    category: 'Frequent',
  },
  {
    id: 'cnt_4',
    name: 'David Miller (Dad)',
    email: 'david.miller@family.net',
    accountNumber: '1102938475',
    bankName: 'Bank of America',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isFavorite: true,
    category: 'Family',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'AI Agent Transfer Executed',
    message: 'Voice command "Send $150 to Sarah" was successfully fulfilled.',
    timestamp: '10 mins ago',
    isRead: false,
    type: 'ai_agent',
  },
  {
    id: 'notif_2',
    title: 'Security Notice',
    message: 'New sign-in detected from iOS Safari in Portland, OR.',
    timestamp: '2 hours ago',
    isRead: false,
    type: 'security',
  },
  {
    id: 'notif_3',
    title: 'Monthly Cash Back',
    message: 'You earned $24.80 cashback from Gold Tier benefits!',
    timestamp: '1 day ago',
    isRead: true,
    type: 'transaction',
  },
];

class WalletService {
  private userKey = 'smart_wallet_user_v1';
  private transactionsKey = 'smart_wallet_txs_v1';
  private contactsKey = 'smart_wallet_contacts_v1';
  private notifsKey = 'smart_wallet_notifs_v1';

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(this.userKey)) {
      localStorage.setItem(this.userKey, JSON.stringify(INITIAL_USER));
    }
    if (!localStorage.getItem(this.transactionsKey)) {
      localStorage.setItem(this.transactionsKey, JSON.stringify(INITIAL_TRANSACTIONS));
    }
    if (!localStorage.getItem(this.contactsKey)) {
      localStorage.setItem(this.contactsKey, JSON.stringify(INITIAL_CONTACTS));
    }
    if (!localStorage.getItem(this.notifsKey)) {
      localStorage.setItem(this.notifsKey, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  }

  getUser(): WalletUser {
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : INITIAL_USER;
  }

  updateUser(updates: Partial<WalletUser>): WalletUser {
    const current = this.getUser();
    const updated = { ...current, ...updates };
    localStorage.setItem(this.userKey, JSON.stringify(updated));
    return updated;
  }

  getBalance(): WalletBalanceOutputDto {
    const u = this.getUser();
    return {
      accountNumber: u.accountNumber,
      totalBalance: u.balance,
      availableBalance: u.isLocked ? 0 : u.balance,
      reservedBalance: 0,
      currency: u.currency,
      dailyRemainingLimit: u.dailyTransferLimit - u.usedDailyLimit,
      lastUpdated: new Date().toISOString(),
    };
  }

  getTransactions(): Transaction[] {
    const data = localStorage.getItem(this.transactionsKey);
    return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
  }

  getContacts(): Contact[] {
    const data = localStorage.getItem(this.contactsKey);
    return data ? JSON.parse(data) : INITIAL_CONTACTS;
  }

  addContact(contact: Omit<Contact, 'id'>): Contact {
    const contacts = this.getContacts();
    const newContact: Contact = { ...contact, id: `cnt_${Date.now()}` };
    contacts.unshift(newContact);
    localStorage.setItem(this.contactsKey, JSON.stringify(contacts));
    return newContact;
  }

  getNotifications(): NotificationItem[] {
    const data = localStorage.getItem(this.notifsKey);
    return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
  }

  markAllNotificationsRead(): void {
    const notifs = this.getNotifications().map(n => ({ ...n, isRead: true }));
    localStorage.setItem(this.notifsKey, JSON.stringify(notifs));
  }

  sendMoney(input: SendMoneyInputDto, isAgentic = false): TransactionResultOutputDto {
    const user = this.getUser();
    if (user.isLocked) {
      throw new Error('Account is currently locked by safety switch or admin.');
    }
    if (input.amount <= 0) {
      throw new Error('Amount must be greater than zero.');
    }
    if (input.amount > user.balance) {
      throw new Error('Insufficient wallet balance.');
    }

    const newBalance = user.balance - input.amount;
    this.updateUser({
      balance: newBalance,
      usedDailyLimit: user.usedDailyLimit + input.amount,
    });

    const refNo = `REF-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'send',
      title: `Send to ${input.recipientName}`,
      recipientName: input.recipientName,
      recipientAccount: input.recipientAccountNumber,
      amount: input.amount,
      currency: user.currency,
      fee: 0,
      status: 'completed',
      category: 'Transfer',
      createdAt: new Date().toISOString(),
      referenceNumber: refNo,
      note: input.note,
      agenticSource: isAgentic,
    };

    const txs = this.getTransactions();
    txs.unshift(newTx);
    localStorage.setItem(this.transactionsKey, JSON.stringify(txs));

    // Add notification
    const notifs = this.getNotifications();
    notifs.unshift({
      id: `notif_${Date.now()}`,
      title: isAgentic ? 'Agentic Transfer Completed' : 'Money Sent',
      message: `Successfully transferred ${input.amount.toLocaleString()} MMK to ${input.recipientName}.`,
      timestamp: 'Just now',
      isRead: false,
      type: isAgentic ? 'ai_agent' : 'transaction',
    });
    localStorage.setItem(this.notifsKey, JSON.stringify(notifs));

    return {
      transactionId: newTx.id,
      referenceNumber: refNo,
      status: 'completed',
      type: 'send',
      amount: input.amount,
      fee: 0,
      newBalance,
      timestamp: newTx.createdAt,
      message: `Transferred ${input.amount.toLocaleString()} MMK to ${input.recipientName}`,
    };
  }

  topUp(input: TopUpInputDto, isAgentic = false): TransactionResultOutputDto {
    const user = this.getUser();
    if (input.amount <= 0) {
      throw new Error('Amount must be greater than zero.');
    }

    const newBalance = user.balance + input.amount;
    this.updateUser({ balance: newBalance });

    const refNo = `REF-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'top_up',
      title: `Top Up via ${input.sourceBankName}`,
      amount: input.amount,
      currency: user.currency,
      fee: 0,
      status: 'completed',
      category: 'Deposit',
      createdAt: new Date().toISOString(),
      referenceNumber: refNo,
      agenticSource: isAgentic,
    };

    const txs = this.getTransactions();
    txs.unshift(newTx);
    localStorage.setItem(this.transactionsKey, JSON.stringify(txs));

    return {
      transactionId: newTx.id,
      referenceNumber: refNo,
      status: 'completed',
      type: 'top_up',
      amount: input.amount,
      fee: 0,
      newBalance,
      timestamp: newTx.createdAt,
      message: `Successfully topped up ${input.amount.toLocaleString()} MMK from ${input.sourceBankName}`,
    };
  }

  payBill(input: PayBillInputDto, isAgentic = false): TransactionResultOutputDto {
    const user = this.getUser();
    if (user.isLocked) {
      throw new Error('Account is currently locked.');
    }
    const fee = 500;
    const totalDeduction = input.amount + fee;

    if (totalDeduction > user.balance) {
      throw new Error('Insufficient wallet balance to cover bill and processing fee.');
    }

    const newBalance = user.balance - totalDeduction;
    this.updateUser({ balance: newBalance });

    const refNo = `REF-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'pay_bill',
      title: input.billerName,
      billerName: input.billerName,
      amount: input.amount,
      currency: user.currency,
      fee,
      status: 'completed',
      category: 'Bills',
      createdAt: new Date().toISOString(),
      referenceNumber: refNo,
      agenticSource: isAgentic,
    };

    const txs = this.getTransactions();
    txs.unshift(newTx);
    localStorage.setItem(this.transactionsKey, JSON.stringify(txs));

    return {
      transactionId: newTx.id,
      referenceNumber: refNo,
      status: 'completed',
      type: 'pay_bill',
      amount: input.amount,
      fee,
      newBalance,
      timestamp: newTx.createdAt,
      message: `Bill of ${input.amount.toLocaleString()} MMK paid to ${input.billerName}`,
    };
  }

  toggleWalletLock(): boolean {
    const u = this.getUser();
    const newStatus = !u.isLocked;
    this.updateUser({ isLocked: newStatus });
    return newStatus;
  }
}

export const walletService = new WalletService();
