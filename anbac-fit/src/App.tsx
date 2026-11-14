import { useEffect, type ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './store';
import { StatusBar, Toast } from './ui';
import * as A from './screens/Auth';
import * as H from './screens/Home';
import * as W from './screens/Workouts';
import * as S from './screens/Shop';
import * as R from './screens/Rewards';
import * as ST from './screens/Settings';
import * as AD from './screens/Admin';

function User({ children }: { children: ReactNode }) {
  const { s } = useStore();
  if (!s.authed) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}
function Admin({ children }: { children: ReactNode }) {
  const { s } = useStore();
  if (!s.authed) return <Navigate to="/login" replace />;
  if (s.role !== 'admin') return <Navigate to="/home" replace />;
  return <>{children}</>;
}

function OfflineWatcher() {
  const { setOnline } = useStore();
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return null;
}

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => { document.querySelectorAll('.scroll').forEach(e => (e.scrollTop = 0)); }, [pathname]);
  return null;
}

const u = (el: ReactNode) => <User>{el}</User>;
const ad = (el: ReactNode) => <Admin>{el}</Admin>;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<A.Splash />} />
      <Route path="/restore" element={<A.Restore />} />
      <Route path="/onboarding" element={<A.Onboarding />} />
      <Route path="/welcome" element={<A.Welcome />} />
      <Route path="/google" element={<A.GoogleSignIn />} />
      <Route path="/signup" element={<A.SignUp />} />
      <Route path="/verify" element={<A.Verify />} />
      <Route path="/check-email" element={<A.CheckEmail />} />
      <Route path="/account-created" element={<A.AccountCreated />} />
      <Route path="/login" element={<A.Login />} />
      <Route path="/forgot" element={<A.Forgot />} />
      <Route path="/reset" element={<A.Reset />} />
      <Route path="/session-expired" element={<A.SessionExpired />} />

      <Route path="/setup/1" element={u(<A.Setup1 />)} />
      <Route path="/setup/2" element={u(<A.Setup2 />)} />
      <Route path="/setup/3" element={u(<A.Setup3 />)} />
      <Route path="/setup/done" element={u(<A.SetupDone />)} />
      <Route path="/upload-photo" element={u(<A.UploadPhoto />)} />

      <Route path="/home" element={u(<H.HomeScreen />)} />
      <Route path="/search" element={u(<H.SearchScreen />)} />
      <Route path="/tasks" element={u(<H.Tasks />)} />
      <Route path="/notifications" element={u(<R.Notifications />)} />
      <Route path="/notifications/settings" element={u(<ST.NotificationSettings />)} />
      <Route path="/notifications/enable" element={u(<R.EnableNotifications />)} />

      <Route path="/workouts" element={u(<W.Planner />)} />
      <Route path="/workouts/plans" element={u(<W.Plans />)} />
      <Route path="/workouts/new" element={u(<W.NewPlan />)} />
      <Route path="/workouts/new/customize" element={u(<W.Customize />)} />
      <Route path="/workouts/new/schedule" element={u(<W.Schedule />)} />
      <Route path="/workouts/new/summary" element={u(<W.Summary />)} />
      <Route path="/workouts/activity/:kind" element={u(<W.ActivityDetail />)} />
      <Route path="/workouts/permission/:kind" element={u(<W.LocationPermission />)} />
      <Route path="/workouts/active/:kind" element={u(<W.ActiveWorkout />)} />

      <Route path="/shop" element={u(<S.ShopHome />)} />
      <Route path="/shop/store" element={u(<S.Store />)} />
      <Route path="/shop/product/:id" element={u(<S.ProductDetail />)} />
      <Route path="/shop/wishlist" element={u(<S.Wishlist />)} />
      <Route path="/shop/cart" element={u(<S.Cart />)} />
      <Route path="/shop/checkout" element={u(<S.Checkout />)} />
      <Route path="/shop/order-placed/:id" element={u(<S.OrderPlaced />)} />
      <Route path="/shop/order-failed" element={u(<S.OrderFailed />)} />
      <Route path="/shop/payment-failed" element={u(<S.PaymentFailed />)} />
      <Route path="/shop/orders" element={u(<S.Orders />)} />
      <Route path="/shop/orders/:id" element={u(<S.OrderDetail />)} />

      <Route path="/rewards" element={u(<R.RewardsHome />)} />
      <Route path="/rewards/wallet" element={u(<R.WalletScreen />)} />
      <Route path="/rewards/history" element={u(<R.History_ />)} />
      <Route path="/rewards/redeem/:id" element={u(<R.Redeem />)} />
      <Route path="/rewards/refer" element={u(<R.Refer />)} />
      <Route path="/rewards/achievements" element={u(<R.Achievements />)} />
      <Route path="/rewards/expired" element={u(<R.Expired />)} />

      <Route path="/settings" element={u(<ST.SettingsHome />)} />
      <Route path="/settings/edit-profile" element={u(<ST.EditProfile />)} />
      <Route path="/settings/password" element={u(<ST.ChangePassword />)} />
      <Route path="/settings/security" element={u(<ST.Security />)} />
      <Route path="/settings/notifications" element={u(<ST.NotificationSettings />)} />
      <Route path="/settings/privacy" element={u(<ST.Privacy />)} />
      <Route path="/settings/privacy-intro" element={u(<ST.PrivacyIntro />)} />
      <Route path="/settings/data-usage" element={u(<ST.DataUsage />)} />
      <Route path="/settings/permissions" element={u(<ST.Permissions />)} />
      <Route path="/settings/permission/activity" element={u(<W.PermissionScreen kind="activity" />)} />
      <Route path="/settings/permission/location" element={u(<W.PermissionScreen kind="location" />)} />
      <Route path="/settings/permission/camera" element={u(<W.PermissionScreen kind="camera" />)} />
      <Route path="/settings/permission/photos" element={u(<W.PermissionScreen kind="photos" />)} />
      <Route path="/settings/help" element={u(<ST.Help />)} />
      <Route path="/settings/faq" element={u(<ST.FAQ />)} />
      <Route path="/settings/contact" element={u(<ST.Contact />)} />
      <Route path="/settings/privacy-policy" element={<ST.Legal kind="privacy" />} />
      <Route path="/settings/terms" element={<ST.Legal kind="terms" />} />
      <Route path="/settings/about" element={u(<ST.About />)} />
      <Route path="/activity-history" element={u(<ST.ActivityHistory />)} />
      <Route path="/states" element={u(<ST.StatesIndex />)} />
      <Route path="/state/:kind" element={<ST.GlobalState />} />

      <Route path="/admin" element={ad(<AD.AdminDash />)} />
      <Route path="/admin/products" element={ad(<AD.AdminProducts />)} />
      <Route path="/admin/products/new" element={ad(<AD.AdminProductForm />)} />
      <Route path="/admin/products/:id" element={ad(<AD.AdminProductDetail />)} />
      <Route path="/admin/products/:id/edit" element={ad(<AD.AdminProductForm />)} />
      <Route path="/admin/orders" element={ad(<AD.AdminOrders />)} />
      <Route path="/admin/orders/:id" element={ad(<AD.AdminOrderDetail />)} />
      <Route path="/admin/analytics" element={ad(<AD.AdminAnalytics />)} />
      <Route path="/admin/inventory" element={ad(<AD.AdminInventory />)} />
      <Route path="/admin/customers" element={ad(<AD.AdminCustomers />)} />
      <Route path="/admin/notifications" element={ad(<AD.AdminNotifications />)} />
      <Route path="/admin/storage" element={ad(<AD.AdminStorage />)} />
      <Route path="/admin/settings" element={ad(<AD.AdminSettings />)} />
      <Route path="/admin/rewards" element={ad(<AD.AdminRewards />)} />
      <Route path="/admin/rewards/:id" element={ad(<AD.AdminSetReward />)} />
      <Route path="/admin/campaign/new" element={ad(<AD.AdminCampaign />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <OfflineWatcher />
        <ScrollReset />
        <div className="stage">
          <div className="device">
            <StatusBar />
            <AppRoutes />
            <Toast />
          </div>
        </div>
      </HashRouter>
    </StoreProvider>
  );
}
