export interface SendMoneyInputDto {
  recipientAccountNumber: string;
  recipientName: string;
  amount: number;
  note?: string;
  pin: string;
}

export interface TopUpInputDto {
  sourceBankName: string;
  amount: number;
  fundingSourceId: string;
}

export interface PayBillInputDto {
  billerId: string;
  billerName: string;
  accountReferenceNumber: string;
  amount: number;
}

export interface ManagerLoginInputDto {
  username: string;
  passwordHash: string;
  mfaCode?: string;
}

export interface NlpCommandInputDto {
  textCommand: string;
  voiceAudioSampleUrl?: string;
  contextUserId: string;
}

export interface AdminAccountStatusUpdateDto {
  accountNumber: string;
  newKycStatus?: 'verified' | 'pending' | 'rejected';
  isLocked?: boolean;
  overrideDailyLimit?: number;
  reason: string;
}
