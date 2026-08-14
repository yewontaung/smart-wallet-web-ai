export interface TransactionSearchFilterDto {
  query?: string;
  type?: 'send' | 'receive' | 'top_up' | 'pay_bill' | 'all';
  status?: 'completed' | 'pending' | 'failed' | 'all';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page: number;
  pageSize: number;
}

export interface AdminAccountSearchFilterDto {
  searchKeyword?: string;
  kycStatus?: 'verified' | 'pending' | 'rejected' | 'all';
  isLockedFilter?: 'locked' | 'unlocked' | 'all';
  tierFilter?: 'Standard' | 'Gold' | 'Platinum' | 'VIP' | 'all';
  sortBy?: 'balance' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
