import { useState, useCallback, useEffect } from 'react';
import { managerAuthService } from '../services/manager-auth.service';
import { accountService } from '../services/account.service';
import { ManagerUser, WalletUser } from '../types';
import { AdminAccountSearchFilterDto } from '../schemas/searches';
import { AdminAccountStatusUpdateDto } from '../schemas/inputs';

export function useAdmin() {
  const [session, setSession] = useState<{ user: ManagerUser; token: string } | null>(
    () => managerAuthService.getCurrentSession()
  );

  const [metrics, setMetrics] = useState(() => accountService.getSystemMetrics());

  const refreshSession = useCallback(() => {
    setSession(managerAuthService.getCurrentSession());
  }, []);

  const refreshMetrics = useCallback(() => {
    setMetrics(accountService.getSystemMetrics());
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = (username: string, passwordHash: string) => {
    const res = managerAuthService.login({ username, passwordHash });
    if (res.success && res.user && res.token) {
      setSession({ user: res.user, token: res.token });
    }
    return res;
  };

  const logout = () => {
    managerAuthService.logout();
    setSession(null);
  };

  const fetchAccounts = (filter: AdminAccountSearchFilterDto) => {
    return accountService.getAccounts(filter);
  };

  const fetchAccountDetail = (accountNumber: string) => {
    return accountService.getAccountByNumber(accountNumber);
  };

  const updateAccountStatus = (input: AdminAccountStatusUpdateDto): WalletUser => {
    const updated = accountService.updateAccountStatus(input);
    refreshMetrics();
    return updated;
  };

  return {
    session,
    isAuthenticated: !!session,
    currentUser: session?.user || null,
    metrics,
    login,
    logout,
    fetchAccounts,
    fetchAccountDetail,
    updateAccountStatus,
    refreshMetrics,
  };
}
