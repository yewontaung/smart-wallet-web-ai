import { TransactionStatus, TransactionType } from '../types';

export interface WalletBalanceOutputDto {
  accountNumber: string;
  totalBalance: number;
  availableBalance: number;
  reservedBalance: number;
  currency: string;
  dailyRemainingLimit: number;
  lastUpdated: string;
}

export interface TransactionResultOutputDto {
  transactionId: string;
  referenceNumber: string;
  status: TransactionStatus;
  type: TransactionType;
  amount: number;
  fee: number;
  newBalance: number;
  timestamp: string;
  message: string;
}

export interface NlpAgenticToolCallOutputDto {
  intentDetected: string;
  confidenceScore: number;
  toolCallName: string;
  toolArguments: Record<string, any>;
  promptSummary: string;
  executionStatus: 'ready_for_confirmation' | 'auto_executed' | 'validation_error';
  errorMessage?: string;
}

export interface AdminSystemMetricsOutputDto {
  totalRegisteredUsers: number;
  activeAccountsCount: number;
  totalReserveLiquidity: number;
  todayTransactionVolume: number;
  pendingKycApprovalsCount: number;
  flaggedHighRiskCount: number;
}
