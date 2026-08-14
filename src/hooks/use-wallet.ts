import { useState, useCallback, useEffect } from 'react';
import { walletService } from '../services/wallet.service';
import { WalletUser, Transaction, Contact, NotificationItem } from '../types';
import { SendMoneyInputDto, TopUpInputDto, PayBillInputDto } from '../schemas/inputs';

export function useWallet() {
  const [user, setUser] = useState<WalletUser>(() => walletService.getUser());
  const [balance, setBalance] = useState(() => walletService.getBalance());
  const [transactions, setTransactions] = useState<Transaction[]>(() => walletService.getTransactions());
  const [contacts, setContacts] = useState<Contact[]>(() => walletService.getContacts());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => walletService.getNotifications());
  const [showBalance, setShowBalance] = useState(true);

  const refreshData = useCallback(() => {
    setUser(walletService.getUser());
    setBalance(walletService.getBalance());
    setTransactions(walletService.getTransactions());
    setContacts(walletService.getContacts());
    setNotifications(walletService.getNotifications());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const toggleShowBalance = () => setShowBalance(prev => !prev);

  const handleSendMoney = (input: SendMoneyInputDto, isAgentic = false) => {
    const res = walletService.sendMoney(input, isAgentic);
    refreshData();
    return res;
  };

  const handleTopUp = (input: TopUpInputDto, isAgentic = false) => {
    const res = walletService.topUp(input, isAgentic);
    refreshData();
    return res;
  };

  const handlePayBill = (input: PayBillInputDto, isAgentic = false) => {
    const res = walletService.payBill(input, isAgentic);
    refreshData();
    return res;
  };

  const handleToggleLock = () => {
    const isLocked = walletService.toggleWalletLock();
    refreshData();
    return isLocked;
  };

  const handleAddContact = (contact: Omit<Contact, 'id'>) => {
    const newC = walletService.addContact(contact);
    refreshData();
    return newC;
  };

  const handleMarkNotificationsRead = () => {
    walletService.markAllNotificationsRead();
    refreshData();
  };

  return {
    user,
    balance,
    transactions,
    contacts,
    notifications,
    showBalance,
    toggleShowBalance,
    refreshData,
    sendMoney: handleSendMoney,
    topUp: handleTopUp,
    payBill: handlePayBill,
    toggleLock: handleToggleLock,
    addContact: handleAddContact,
    markNotificationsRead: handleMarkNotificationsRead,
  };
}
