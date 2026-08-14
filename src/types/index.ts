export type UserRole = 'wallet_user' | 'admin_manager';

export interface WalletUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  phoneNumber: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
  accountNumber: string;
  tier: 'Standard' | 'Gold' | 'Platinum' | 'VIP';
  balance: number;
  currency: string;
  dailyTransferLimit: number;
  usedDailyLimit: number;
  isLocked: boolean;
  createdAt: string;
}

export interface ManagerUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'compliance_officer' | 'risk_analyst';
  department: string;
  avatarUrl: string;
  lastLogin: string;
}

export type TransactionType = 'send' | 'receive' | 'top_up' | 'pay_bill' | 'fee' | 'cashback';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'reversed';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  title: string;
  recipientName?: string;
  recipientAccount?: string;
  billerName?: string;
  amount: number;
  currency: string;
  fee: number;
  status: TransactionStatus;
  category: string;
  createdAt: string;
  referenceNumber: string;
  note?: string;
  agenticSource?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  bankName: string;
  avatarUrl: string;
  isFavorite: boolean;
  category: 'Frequent' | 'Family' | 'Bills' | 'Business';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'transaction' | 'security' | 'system' | 'ai_agent';
  actionUrl?: string;
}

export interface AgenticToolCallPayload {
  toolName: 'wallet_send_money' | 'wallet_top_up' | 'wallet_pay_bill' | 'wallet_toggle_lock' | 'wallet_get_analytics';
  parameters: Record<string, any>;
  confidenceScore: number;
  intentExplanation: string;
  requiresConfirmation: boolean;
}
