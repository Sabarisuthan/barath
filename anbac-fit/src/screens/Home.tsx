import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, Search as SearchIcon, CheckCircle2, Clock, Play, ChevronRight, CircleX, TriangleAlert, User, Flame } from 'lucide-react';
import { Screen, Avatar, Ring, Chips, Empty } from '../ui';
import { useStore } from '../store';
import { IMG, type Task } from '../data';

const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening'; };

export function HomeScreen() {
  const nav = useNavigate(); const { s, online, toast } = useStore();
  const [loading, setLoading] = useState(true); const [syncFailed, setSyncFailed] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);
  useEffect(() => { setSyncFailed(!online); }, [online]);
  const today = s.tasks.filter(t => t.freq === 'Daily').slice(0, 3);
  const pct = Math.round(s.tasks.reduce((a, t) => a + Math.min(1, t.done / t.goal), 0) / s.tasks.length * 100);
  const unread = s.notifs.filter(n => !n.read).length;
  const first = s.user.name.split(' ')[0];

  if (loading) return (
    <Screen nav>
      <div className="scroll" style={{ paddingTop: 16 }}>
        <div className="between"><div className="col gap8"><div className="skel" style={{ width: 140, height: 26 }} /><div className="skel" style={{ width: 180, height: 14 }} /></div><div className="skel" style={{ width: 48, height: 48, borderRadius: 24 }} /></div>
        <div className="card mt24"><div className="skel" style={{ height: 130 }} /><div className="skel mt16" style={{ height: 14 }} /><div className="skel mt8" style={{ height: 12, width: '60%' }} /></div>
        {[0, 1].map(i => <div key={i} className="card mt16 row"><div className="skel" style={{ width: 56, height: 56 }} /><div className="flex1 col gap8"><div className="skel" style={{ height: 14 }} /><div className="skel" style={{ height: 12, width: '60%' }} /></div></div>)}
      </div>
    </Screen>
  );

  if (!s.tasks.length) return (
    <Screen nav>
      <div className="scroll" style={{ paddingTop: 16 }}>
        <h1 className="title-lg">{greet()}, {first}</h1><p className="sub">Ready to crush your goals today?</p>
        <Empty icon={<div className="soft-circle" style={{ background: '#fff', border: '1px solid var(--line)' }}><User size={36} /></div>} title="No Activity Yet" text="Start your first workout to see your activity data here." action="Start Workout" onAction={() => nav('/workouts/new')} />
      </div>
    </Screen>
  );

  return (
    <Screen nav banner={syncFailed && <div className="banner amber between"><span className="row" style={{ gap: 8 }}><TriangleAlert size={18} />Sync Failed — 2h ago</span><button className="pill solid" style={{ height: 28, padding: '0 12px' }} onClick={() => { if (online) { setSyncFailed(false); toast('Synced successfully'); } else toast('Still offline — try again later'); }}>Retry Sync</button></div>}>
      <div className="scroll" style={{ paddingTop: 12, opacity: syncFailed ? .75 : 1 }}>
        <div className="between">
          <div className="flex1"><h1 className="title-lg" style={{ fontSize: 21 }}>{greet()}, {first}</h1><p className="sub small">Ready to crush your goals today?</p></div>
          <div className="row" style={{ gap: 6 }}>
            <button className="icon-btn" onClick={() => nav('/search')} aria-label="Search"><SearchIcon size={18} /></button>
            <button className="icon-btn" onClick={() => nav('/notifications')} aria-label="Notifications"><Bell size={18} />{unread > 0 && <span className="badge-dot">{unread}</span>}</button>
            <button onClick={() => nav('/settings')}><Avatar size={44} /></button>
          </div>
        </div>
        <Link to="/rewards/achievements" className="card flat between mt16" style={{ display: 'flex' }}>
          <div><div style={{ fontSize: 20, fontWeight: 700 }}>7 Day Streak <Flame size={18} color="#f08a24" fill="#f6b24a" style={{ verticalAlign: -2 }} /></div><div className="small muted mt8">{syncFailed ? 'Last sync was incomplete.' : 'Top 10% of active members this week!'}</div></div>
          <Ring pct={pct} size={58}><b style={{ fontSize: 12 }}>{pct}%</b></Ring>
        </Link>
        <div className="between"><h2 className="h2">Today's Tasks</h2><Link to="/tasks" className="small link">See All</Link></div>
        <div className="list">{today.map(t => <TodayTask key={t.id} t={t} />)}</div>
        <h2 className="h2">Active Challenges</h2>
        <Link to="/rewards" className="card flat row">
          <img src={IMG('challenge.jpg')} className="thumb sm" style={{ objectFit: 'cover' }} alt="" />
          <div className="flex1"><div className="bold">30 Day Run Streak</div><div className="small muted mt8">Ends in 12 days • 500 Anbac Money</div></div>
          <ChevronRight size={18} color="var(--muted)" />
        </Link>
        <h2 className="h2">Quick Start</h2>
        <div className="grid2">
          <button className="card flat" style={{ textAlign: 'left' }} onClick={() => nav('/workouts')}><div className="bold">Workout Planner</div><div className="small muted mt8">Plan your week</div></button>
          <button className="card flat" style={{ textAlign: 'left' }} onClick={() => nav('/rewards/wallet')}><div className="bold">My Wallet</div><div className="small green mt8">{s.balance.toLocaleString()} FitCoins</div></button>
        </div>
      </div>
    </Screen>
  );
}

function TodayTask({ t }: { t: Task }) {
  const nav = useNavigate();
  const done = t.done >= t.goal;
  if (t.unit === 'km') return (
    <button className="card flat" style={{ textAlign: 'left' }} onClick={() => nav('/workouts/active/running')}>
      <div className="between"><span className="bold" style={{ fontSize: 16 }}>{t.name.replace(' Daily', '')}</span><span className="small muted">{t.done} / {t.goal} {t.unit}</span></div>
      <div className="progress mt12"><div style={{ width: `${t.done / t.goal * 100}%` }} /></div>
    </button>
  );
  return (
    <button className="card flat row" style={{ textAlign: 'left' }} onClick={() => nav('/tasks')}>
      {done ? <CheckCircle2 size={22} color="var(--green)" fill="var(--green-100)" /> : <Clock size={22} color="var(--green)" />}
      <div className="flex1"><div className="bold" style={{ textDecoration: done ? 'underline' : 'none' }}>{t.name}</div><div className="small muted">{done ? `${t.done} of ${t.goal} completed` : t.done ? `${t.done} / ${t.goal} ${t.unit}` : 'Not started yet'}</div></div>
      {!done && <Play size={20} color="var(--green)" />}
    </button>
  );
}

const FREQ = ['All', 'Daily', 'Weekly', 'Monthly'] as const;
export function Tasks() {
  const { s, set, toast } = useStore(); const [f, setF] = useState<typeof FREQ[number]>('All');
  const list = s.tasks.filter(t => f === 'All' || t.freq === f);
  const bump = (t: Task) => {
    if (t.done >= t.goal) return;
    const step = t.goal >= 5 ? (t.unit === 'km' ? 0.5 : 1) : t.goal / 4;
    const done = Math.min(t.goal, +(t.done + step).toFixed(1));
    set(st => ({
      tasks: st.tasks.map(x => x.id === t.id ? { ...x, done } : x),
      ...(done >= t.goal ? { balance: st.balance + 100, txns: [{ id: 'x' + Date.now(), title: `${t.name} Completed`, date: 'Today, now', amount: 100, kind: 'earn' as const, icon: 'zap', period: 'today' as const }, ...st.txns] } : {}),
    }));
    if (done >= t.goal) toast(`${t.name} done! +100 FitCoins`);
  };
  return (
    <Screen nav>
      <div className="hdr center"><h1>My Tasks</h1></div>
      <div style={{ padding: '0 20px 12px' }}><Chips items={FREQ} value={f} onChange={setF} /></div>
      <div className="scroll">
        <div className="list">{list.map(t => {
          const done = t.done >= t.goal; const pct = Math.round(t.done / t.goal * 100);
          return (
            <div key={t.id} className="card flat between">
              <div>
                <div className="bold" style={{ fontSize: 16 }}>{t.name}</div>
                <div className="small muted" style={{ margin: '4px 0 8px' }}>{t.done} / {t.goal}{t.unit ? ' ' + t.unit : ''} completed Today</div>
                <span className="pill" style={{ fontSize: 11, height: 20 }}>{t.streak} Days <Flame size={11} color="#f08a24" fill="#f6b24a" /></span>
              </div>
              {done ? <span className="pill solid" style={{ height: 30, padding: '0 14px', fontSize: 13 }}>Done</span>
                : <button className="pill" style={{ height: 30, padding: '0 12px', fontSize: 13, fontWeight: 600 }} onClick={() => bump(t)} title="Log progress">{pct}% +</button>}
            </div>
          );
        })}</div>
        <Link to="/workouts" className="btn outline mt24">Open Workout Planner</Link>
      </div>
    </Screen>
  );
}

const RESULTS = [
  { type: 'Product', name: 'Anbac Sport Tee', sub: '3,500 PTS • Apparel', img: 'tee.jpg', to: '/shop/product/tee' },
  { type: 'Product', name: 'Anbac Stainless Bottle', sub: '2,000 PTS • Accessories', img: 'bottle.jpg', to: '/shop/product/bottle' },
  { type: 'Challenge', name: 'Anbac 100K Run Challenge', sub: 'Join to earn 1,000 PTS', img: 'challenge.jpg', to: '/rewards' },
  { type: 'Product', name: 'Anbac Wellness Guide', sub: '500 PTS • Wellness', img: 'avatar2.jpg', to: '/shop/store' },
  { type: 'Product', name: 'Anbac Pro Duffle Bag', sub: '5,000 PTS • Accessories', img: 'duffle.jpg', to: '/shop/product/duffle' },
  { type: 'Challenge', name: '30 Day Run Streak', sub: '500 Anbac Money', img: 'challenge.jpg', to: '/rewards' },
];
export function SearchScreen() {
  const nav = useNavigate(); const [q, setQ] = useState('Anbac'); const [f, setF] = useState<'All Results' | 'Products' | 'Challenges'>('All Results');
  const res = RESULTS.filter(r => r.name.toLowerCase().includes(q.toLowerCase().trim()) && (f === 'All Results' || r.type + 's' === f));
  return (
    <Screen nav>
      <div className="hdr center"><h1>Search</h1></div>
      <div style={{ padding: '0 20px' }}>
        <div className="search"><SearchIcon size={18} color="var(--green)" /><input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search products, challenges..." />{q && <button onClick={() => setQ('')}><CircleX size={18} color="var(--muted)" /></button>}</div>
        <div className="mt12"><Chips items={['All Results', 'Products', 'Challenges'] as const} value={f} onChange={setF} /></div>
      </div>
      <div className="scroll" style={{ paddingTop: 14 }}>
        {res.length ? <div className="list">{res.map(r =>
          <button key={r.name} className="card flat row" style={{ textAlign: 'left', padding: 12 }} onClick={() => nav(r.to)}>
            <img src={IMG(r.img)} className="thumb sm" alt="" />
            <div className="flex1"><div className="label-green" style={{ fontSize: 11 }}>{r.type}</div><div className="bold">{r.name}</div><div className="small muted">{r.sub}</div></div>
            <ChevronRight size={18} color="var(--muted)" />
          </button>)}</div>
          : <Empty icon={<SearchIcon size={40} />} title="No Results Found" text="Try checking for typos or searching with different keywords to find what you need." />}
      </div>
    </Screen>
  );
}
