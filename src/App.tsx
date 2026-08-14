import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/wallet-user/home';
import { ProfilePage } from './pages/wallet-user/profile';
import { ContactPage } from './pages/wallet-user/contact';
import { SettingPage } from './pages/wallet-user/setting';
import { AllTransactionsPage } from './pages/wallet-user/transactions';
import { ManagerLoginPage } from './pages/manager/login';
import { ManagerOverviewPage } from './pages/manager/overview';
import { AccountListPage } from './pages/manager/accounts/account.list';
import { AccountDetailPage } from './pages/manager/accounts/account.detail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Wallet User Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/wallet" element={<HomePage />} />
        <Route path="/wallet/transactions" element={<AllTransactionsPage />} />
        <Route path="/wallet/profile" element={<ProfilePage />} />
        <Route path="/wallet/contact" element={<ContactPage />} />
        <Route path="/wallet/setting" element={<SettingPage />} />

        {/* Banking Admin Manager Routes */}
        <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/admin/login" element={<ManagerLoginPage />} />
        <Route path="/admin/overview" element={<ManagerOverviewPage />} />
        <Route path="/admin/accounts" element={<AccountListPage />} />
        <Route path="/admin/accounts/:id" element={<AccountDetailPage />} />
        <Route path="/admin/risk" element={<AccountListPage />} />
        <Route path="/admin/ledger" element={<AccountListPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
