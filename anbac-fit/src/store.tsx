import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { PRODUCTS, TASKS, PLANS, TXNS, NOTIFS, ORDERS, ADMIN_ORDERS, type Product, type Task, type Plan, type Txn, type Notif, type Order, type Activity } from './data';

export type CartItem = { pid: string; qty: number; size?: string; color?: string };
export type Draft = { activity: Activity; name: string; goal: string; target: string; pace: string; duration: number; intensity: string; goalType: string; days: string[]; time: string; reminders: boolean; reminderTime: string };

type State = {
  onboarded: boolean;
  authed: boolean;
  role: 'user' | 'admin';
  accounts: { email: string; password: string; name: string }[];
  user: { name: string; email: string; phone: string; dob: string; gender: string; photo: boolean; goals: string[]; height: string; weight: string; activity: string; units: 'metric' | 'imperial' };
  balance: number;
  tasks: Task[];
  plans: Plan[];
  txns: Txn[];
  notifs: Notif[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  products: Product[];
  adminOrders: typeof ADMIN_ORDERS;
  useCoins: boolean;
  prefs: Record<string, boolean>;
  perms: Record<string, boolean>;
  draft: Draft | null;
  joined: string[];
  redeemed: { name: string; date: string; pts: number; status: string; img: string }[];
};

const initial: State = {
  onboarded: false, authed: false, role: 'user',
  accounts: [{ email: 'alex@email.com', password: 'password123', name: 'Alex Morgan' }],
  user: { name: 'Alex Morgan', email: 'alex.morgan@email.com', phone: '+1 (555) 019-2834', dob: '1995-10-14', gender: 'Male', photo: true, goals: ['Build Muscle', 'Stay Active'], height: '180', weight: '75', activity: 'Moderately Active', units: 'metric' },
  balance: 7234,
  tasks: TASKS, plans: PLANS, txns: TXNS, notifs: NOTIFS,
  cart: [{ pid: 'tee', qty: 1, size: 'M', color: 'Green' }, { pid: 'bottle', qty: 1 }],
  wishlist: ['tee', 'bottle', 'mat', 'socks'],
  orders: ORDERS, products: PRODUCTS, adminOrders: ADMIN_ORDERS,
  useCoins: true,
  prefs: {
    challenge: true, reward: true, streak: true, store: false, push: true,
    profileVisible: true, activityStatus: true, shareAchievements: false, marketing: false,
    fingerprint: true, face: false,
    maintenance: false, registrations: true, fitcoins: true, orderAlerts: true, stockAlerts: true, twofa: true, backup: true, autoUpload: true,
  },
  perms: { location: true, camera: true, push: false, storage: false, activity: false, photos: true },
  draft: null,
  joined: ['Early Bird Runner', 'Mindfulness Master'],
  redeemed: [
    { name: 'Redeemed Anbac Cap', date: 'Dec 8, 2026', pts: 1500, status: 'Shipped', img: 'tee.jpg' },
    { name: 'Gym Towel', date: 'Nov 30, 2026', pts: 1000, status: 'Delivered', img: 'bottle.jpg' },
  ],
};

const KEY = 'anbac-fit-state-v1';
type Ctx = { s: State; set: (fn: (s: State) => Partial<State>) => void; reset: () => void; toast: (m: string) => void; toastMsg: string | null; online: boolean; setOnline: (b: boolean) => void };
const StoreCtx = createContext<Ctx>(null!);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) return { ...initial, ...JSON.parse(raw) }; } catch { /* ignore */ }
    return initial;
  });
  const [toastMsg, setToast] = useState<string | null>(null);
  const [online, setOnline] = useState(true);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } }, [s]);
  const set = useCallback((fn: (s: State) => Partial<State>) => setS(prev => ({ ...prev, ...fn(prev) })), []);
  const reset = useCallback(() => { setS(initial); }, []);
  const toast = useCallback((m: string) => { setToast(m); window.clearTimeout((window as any).__t); (window as any).__t = window.setTimeout(() => setToast(null), 2200); }, []);
  return <StoreCtx.Provider value={{ s, set, reset, toast, toastMsg, online, setOnline }}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);
export const useProduct = (id?: string) => { const { s } = useStore(); return s.products.find(p => p.id === id); };
