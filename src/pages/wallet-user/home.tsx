import { useState } from 'react';
import { useWallet } from '../../hooks/use-wallet';
import { BalanceCard } from '../../components/balance-card';
import { JunctionActionButtons } from '../../components/junction-action-buttons';
import { TransactionList } from '../../components/transaction-list';
import { FloatedHeaderActions } from '../../components/floated-header-actions';
import { FloatedNav, WalletNavTab } from '../../components/floated-nav';
import { NotificationDrawer } from '../../components/notification-drawer';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const {
    user,
    transactions,
    notifications,
    showBalance,
    toggleShowBalance,
    refreshData,
    markNotificationsRead,
  } = useWallet();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleNavChange = (tab: WalletNavTab) => {
    if (tab === 'home') navigate('/');
    if (tab === 'contact') navigate('/wallet/contact');
    if (tab === 'setting') navigate('/wallet/setting');
  };

  return (
    <div className="min-h-screen bg-[#16161a] text-white font-sans pb-28 relative overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* Main Container Frame */}
      <div className="relative max-w-[420px] mx-auto min-h-screen flex flex-col px-5">
        {/* BALANCE SECTION CARD with increased height & padding */}
        <div className="pt-4 pb-6">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 rounded-3xl p-7 sm:p-8 relative shadow-2xl mt-6 border border-sky-400/30 min-h-[170px] sm:min-h-[190px] flex flex-col justify-center">
            {/* Floated Header Actions overlaying top edge of balance card with their under half */}
            <div className="absolute -top-5 sm:-top-6 right-6 z-30">
              <FloatedHeaderActions
                user={user}
                notifications={notifications}
                onOpenNotifications={() => setIsNotifOpen(true)}
                onOpenProfile={() => navigate('/wallet/profile')}
                showProfile={true}
              />
            </div>

            <BalanceCard
              user={user}
              showBalance={showBalance}
              onToggleShowBalance={toggleShowBalance}
            />
          </div>

          {/* JUNCTION: Floated half on balance card bottom edge */}
          <div className="relative z-30 -mt-2 px-2">
            <JunctionActionButtons
              onSend={() => {}}
              onReceive={() => {}}
              onTopUp={() => {}}
              onPayBill={() => {}}
            />
          </div>
        </div>

        {/* TRANSACTION CONTENT: Header outside, list items inside lighter dark background container */}
        <div className="relative z-10 flex-1 pt-6 pb-10">
          <TransactionList
            transactions={transactions}
            onViewAll={() => navigate('/wallet/transactions')}
            showCategories={false}
          />
        </div>
      </div>

      {/* Floated Bottom Pill Navigation Bar */}
      <FloatedNav
        activeTab="home"
        onChangeTab={handleNavChange}
        onRefreshData={refreshData}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkRead={markNotificationsRead}
      />
    </div>
  );
}
