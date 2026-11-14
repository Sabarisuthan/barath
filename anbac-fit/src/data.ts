export const IMG = (n: string) => `${import.meta.env.BASE_URL}img/${n}`;

export type Product = {
  id: string; name: string; category: 'Apparel' | 'Accessories' | 'Wellness' | 'Equipment' | 'Supplements' | 'Gift Cards';
  price: number; compare?: number; points: number; img: string; rating: number; reviews: number;
  stock: number; sku: string; desc: string; sold: number; earn: number; spend: number; discount: number; featured?: boolean;
};

export const PRODUCTS: Product[] = [
  { id: 'tee', name: 'Anbac Sport Tee', category: 'Apparel', price: 999, compare: 1299, points: 3500, img: 'tee.jpg', rating: 4.5, reviews: 124, stock: 45, sku: 'ABT-001', sold: 234, earn: 200, spend: 500, discount: 20, featured: true,
    desc: 'Lightweight, breathable athletic fabric crafted to dry quickly and support high-intensity workout performance. Made with 100% sustainable materials.' },
  { id: 'bottle', name: 'Anbac Stainless Bottle', category: 'Accessories', price: 1499, points: 2000, img: 'bottle.jpg', rating: 4.7, reviews: 88, stock: 60, sku: 'ABB-014', sold: 140, earn: 150, spend: 400, discount: 0,
    desc: 'Double-wall insulated stainless steel bottle that keeps drinks cold for 24 hours. Leak-proof lid with carry loop.' },
  { id: 'mat', name: 'Fitness Yoga Mat', category: 'Equipment', price: 2199, points: 4500, img: 'cat-wellness.jpg', rating: 4.4, reviews: 61, stock: 32, sku: 'AYM-210', sold: 97, earn: 250, spend: 600, discount: 10,
    desc: 'Non-slip 6mm cushioned mat for yoga, pilates and floor workouts. Includes carry strap.' },
  { id: 'socks', name: 'Premium Grip Socks', category: 'Apparel', price: 799, points: 1200, img: 'cat-apparel.jpg', rating: 4.3, reviews: 40, stock: 80, sku: 'AGS-033', sold: 76, earn: 80, spend: 200, discount: 0,
    desc: 'Anti-slip grip socks for studio workouts with arch support and breathable knit.' },
  { id: 'shake', name: 'Premium Protein Shake', category: 'Supplements', price: 1499, points: 3000, img: 'cat-supplements.jpg', rating: 4.6, reviews: 210, stock: 8, sku: 'APS-101', sold: 67, earn: 300, spend: 800, discount: 0,
    desc: '25g whey protein per serving with zero added sugar. Chocolate flavour.' },
  { id: 'duffle', name: 'Anbac Pro Duffle Bag', category: 'Accessories', price: 3499, points: 5000, img: 'duffle.jpg', rating: 4.8, reviews: 35, stock: 18, sku: 'ADB-500', sold: 41, earn: 350, spend: 900, discount: 0,
    desc: 'Limited edition premium gym duffle with shoe compartment and water-resistant base.' },
  { id: 'shoes', name: 'Running Shoes', category: 'Equipment', price: 3999, points: 8000, img: 'runner-road.jpg', rating: 4.5, reviews: 52, stock: 0, sku: 'ARS-010', sold: 45, earn: 400, spend: 1000, discount: 0,
    desc: 'Responsive cushioning running shoes built for daily training miles.' },
  { id: 'gift', name: 'Gift Card ₹5000', category: 'Gift Cards', price: 5000, points: 10000, img: 'cat-giftcards.jpg', rating: 5, reviews: 12, stock: 0, sku: 'AGC-5000', sold: 22, earn: 0, spend: 0, discount: 0,
    desc: 'Digital gift card redeemable on the Anbac store.' },
];

export const CATEGORIES = [
  { name: 'Apparel', count: 124, img: 'cat-apparel.jpg' },
  { name: 'Accessories', count: 82, img: 'cat-accessories.jpg' },
  { name: 'Wellness', count: 45, img: 'cat-wellness.jpg' },
  { name: 'Equipment', count: 36, img: 'cat-equipment.jpg' },
  { name: 'Supplements', count: 58, img: 'cat-supplements.jpg' },
  { name: 'Gift Cards', count: 12, img: 'cat-giftcards.jpg' },
];

export type Task = { id: string; name: string; unit: string; goal: number; done: number; streak: number; freq: 'Daily' | 'Weekly' | 'Monthly' };
export const TASKS: Task[] = [
  { id: 't1', name: 'Run 5K Daily', unit: 'km', goal: 5, done: 3.2, streak: 12, freq: 'Daily' },
  { id: 't2', name: 'Drink 8 Glasses Water', unit: 'glasses', goal: 8, done: 8, streak: 7, freq: 'Daily' },
  { id: 't3', name: 'Meditate 10 Minutes', unit: 'mins', goal: 10, done: 0, streak: 5, freq: 'Daily' },
  { id: 't4', name: 'Read 15 Pages', unit: 'pages', goal: 15, done: 15, streak: 2, freq: 'Weekly' },
  { id: 't5', name: 'Sleep 8 Hours', unit: 'hours', goal: 8, done: 7.5, streak: 4, freq: 'Daily' },
  { id: 't6', name: 'Morning Stretch', unit: '', goal: 1, done: 1, streak: 15, freq: 'Monthly' },
];

export type Activity = 'walking' | 'running' | 'cycling';
export const ACTIVITIES: Record<Activity, { name: string; desc: string; level: string; img: string; parts: string[]; kcal: number; tip: string }> = {
  walking: { name: 'Walking', desc: 'Low impact, great for daily habits', level: 'Easy', img: 'walking-trail.jpg', parts: ['Legs', 'Core', 'Glutes', 'Calves'], kcal: 200,
    tip: 'Keep a steady, brisk pace. Maintaining 5 km/h will maximize your muscle endurance and optimize step verification rewards!' },
  running: { name: 'Running', desc: 'Build endurance and speed', level: 'Medium', img: 'runner-forest.jpg', parts: ['Legs', 'Core', 'Glutes', 'Lungs'], kcal: 350,
    tip: 'Warm up for 5 minutes and keep your cadence near 170 steps per minute for efficient running.' },
  cycling: { name: 'Cycling', desc: 'Explore and burn calories', level: 'Hard', img: 'map-terrain.jpg', parts: ['Quads', 'Hamstrings', 'Calves', 'Core'], kcal: 450,
    tip: 'Keep a high cadence in lower gears on climbs to save your legs for the descent.' },
};

export type Plan = { id: string; name: string; activity: Activity; goal: string; days: string[]; time: string; reminders: boolean; reminderTime: string; pace?: string };
export const PLANS: Plan[] = [
  { id: 'p1', name: 'Morning Run', activity: 'running', goal: '5K goal', days: ['Mon', 'Wed', 'Fri'], time: 'Morning (6-9 AM)', reminders: true, reminderTime: '6:30 AM', pace: '6:00 min/km' },
  { id: 'p2', name: 'Evening Walk', activity: 'walking', goal: '30 min goal', days: ['Daily'], time: 'Evening (5-8 PM)', reminders: true, reminderTime: '5:30 PM' },
  { id: 'p3', name: 'Weekend Cycle', activity: 'cycling', goal: '15km goal', days: ['Sat', 'Sun'], time: 'Morning (6-9 AM)', reminders: false, reminderTime: '7:00 AM' },
];

export type Txn = { id: string; title: string; date: string; amount: number; kind: 'earn' | 'spend'; icon: string; period: 'today' | 'week' | 'month' | 'older' };
export const TXNS: Txn[] = [
  { id: 'x1', title: 'Daily Walk Challenge Completed', date: 'Today, 08:30 AM', amount: 450, kind: 'earn', icon: 'zap', period: 'today' },
  { id: 'x2', title: 'Redeemed Sport Tee', date: 'May 14, 04:15 PM', amount: -3500, kind: 'spend', icon: 'bag', period: 'week' },
  { id: 'x3', title: 'Water Intake Habit Met', date: 'May 14, 09:00 PM', amount: 100, kind: 'earn', icon: 'drop', period: 'week' },
  { id: 'x4', title: 'Yoga Streak Mastery', date: 'May 13, 06:10 PM', amount: 1200, kind: 'earn', icon: 'heart', period: 'week' },
  { id: 'x5', title: 'Redeemed Stainless Bottle', date: 'May 12, 02:00 PM', amount: -2000, kind: 'spend', icon: 'card', period: 'month' },
  { id: 'x6', title: 'Weekly Streak Bonus', date: 'May 10', amount: 1200, kind: 'earn', icon: 'trend', period: 'month' },
];

export type Notif = { id: string; title: string; body: string; ago: string; icon: string; group: 'today' | 'earlier'; read?: boolean };
export const NOTIFS: Notif[] = [
  { id: 'n1', title: 'Challenge Completed', body: 'You finished Run 5K! Amazing effort.', ago: '2h ago', icon: 'trophy', group: 'today' },
  { id: 'n2', title: 'New Reward Available', body: 'Anbac Sport Tee is back in stock in all sizes.', ago: '5h ago', icon: 'bag', group: 'today' },
  { id: 'n3', title: 'Streak Milestone', body: '7 day streak! Keep going and unlock the premium badge.', ago: '1d ago', icon: 'star', group: 'earlier' },
  { id: 'n4', title: 'Hydration Champion', body: 'You hit your water goal for 5 consecutive days!', ago: '2d ago', icon: 'heart', group: 'earlier' },
];

export type OrderStatus = 'Processing' | 'Delivered' | 'Shipped' | 'Cancelled' | 'Pending';
export type Order = { id: string; date: string; items: { pid: string; qty: number; size?: string; color?: string }[]; total: number; status: OrderStatus; customer?: string; discount?: number };
export const ORDERS: Order[] = [
  { id: 'ORD-2024-1892', date: 'May 14, 2024', items: [{ pid: 'tee', qty: 1, size: 'M', color: 'Green' }, { pid: 'bottle', qty: 1 }], total: 2498, status: 'Processing' },
  { id: 'ORD-2024-1542', date: 'Apr 28, 2024', items: [{ pid: 'bottle', qty: 1 }], total: 1499, status: 'Delivered' },
  { id: 'ORD-2024-1102', date: 'Mar 15, 2024', items: [{ pid: 'tee', qty: 1 }, { pid: 'socks', qty: 1 }, { pid: 'mat', qty: 1 }], total: 4297, status: 'Delivered' },
];

export const ADMIN_ORDERS: (Order & { customer: string; email: string; phone: string; address: string })[] = [
  { id: 'ORD-4521', date: 'Jul 28, 2025', items: [{ pid: 'tee', qty: 1, size: 'M' }, { pid: 'shake', qty: 1 }], total: 2498, discount: 250, status: 'Delivered', customer: 'Rahul Sharma', email: 'rahul@sharma.com', phone: '+91 98765 43210', address: 'Flat 402, MG Road, Mumbai 400001' },
  { id: 'ORD-4520', date: 'Jul 28, 2025', items: [{ pid: 'shake', qty: 1 }], total: 1499, status: 'Processing', customer: 'Aditi Rao', email: 'aditi@rao.in', phone: '+91 99887 76655', address: '12 Lake View, Pune 411001' },
  { id: 'ORD-4519', date: 'Jul 27, 2025', items: [{ pid: 'mat', qty: 1 }, { pid: 'socks', qty: 2 }], total: 2500, status: 'Shipped', customer: 'Vikram Sen', email: 'vikram@sen.co', phone: '+91 90000 12345', address: '7 Park Street, Kolkata 700016' },
  { id: 'ORD-4518', date: 'Jul 26, 2025', items: [{ pid: 'tee', qty: 1 }], total: 999, status: 'Delivered', customer: 'Kunal Patel', email: 'kunal@patel.in', phone: '+91 91234 56789', address: '45 Ring Road, Ahmedabad 380001' },
  { id: 'ORD-4517', date: 'Jul 26, 2025', items: [{ pid: 'bottle', qty: 1 }], total: 1499, status: 'Pending', customer: 'Priya Patel', email: 'priya@patel.in', phone: '+91 93456 78901', address: '9 MG Road, Bangalore 560001' },
];

export const CUSTOMERS = [
  { initials: 'RS', name: 'Rahul Sharma', tier: 'Gold Member', last: 'Jul 28', spent: 12450, orders: 8 },
  { initials: 'PP', name: 'Priya Patel', tier: 'Silver Member', last: 'Jul 27', spent: 8900, orders: 5 },
  { initials: 'AK', name: 'Amit Kumar', tier: 'Platinum Member', last: 'Jul 25', spent: 24200, orders: 15 },
  { initials: 'AR', name: 'Aditi Rao', tier: 'Silver Member', last: 'Jul 28', spent: 6100, orders: 4 },
];

export const BADGES = [
  { name: 'First Steps', unlocked: true }, { name: '7 Day Streak', unlocked: true }, { name: 'Hydrated', unlocked: true },
  { name: 'Early Bird', unlocked: true }, { name: '10K Club', unlocked: true }, { name: 'Zen Master', unlocked: true },
  { name: 'Fit Pro', unlocked: false }, { name: 'Marathoner', unlocked: false }, { name: 'Legend', unlocked: false },
];

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN');
export const num = (n: number) => n.toLocaleString('en-US');
