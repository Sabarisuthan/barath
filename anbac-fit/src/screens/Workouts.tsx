import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Activity as Pulse, Footprints, Bike, ShieldCheck, CircleX, MapPin, HeartPulse, Clock, SlidersHorizontal, Minus, Lightbulb } from 'lucide-react';
import { Screen, Header, Field, Select, Toggle, Seg, Bullets, Dialog } from '../ui';
import { useStore, type Draft } from '../store';
import { ACTIVITIES, IMG, type Activity } from '../data';

const ICON: Record<Activity, typeof Pulse> = { running: Pulse, walking: Footprints, cycling: Bike };
const fmt = (t: number) => [Math.floor(t / 3600), Math.floor(t / 60) % 60, t % 60].map(n => String(n).padStart(2, '0')).join(':');

export function Planner() {
  const nav = useNavigate(); const { s } = useStore();
  const [base, setBase] = useState(() => { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; });
  const [sel, setSel] = useState(() => new Date().toDateString());
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(base); d.setDate(base.getDate() + i); return d; });
  const selDate = days.find(d => d.toDateString() === sel) || days[0];
  const dn = selDate.toLocaleDateString('en-US', { weekday: 'short' });
  const todays = s.plans.filter(p => p.days.includes('Daily') || p.days.includes(dn));
  const shift = (n: number) => { const d = new Date(base); d.setDate(d.getDate() + n * 7); setBase(d); };
  return (
    <Screen nav>
      <div className="hdr"><h1>Workout Planner</h1><button className="icon-btn" onClick={() => nav('/workouts/plans')} aria-label="My plans"><SlidersHorizontal size={18} /></button></div>
      <div className="scroll">
        <div className="between" style={{ marginBottom: 12 }}>
          <b style={{ fontSize: 18, fontWeight: 600 }}>{base.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</b>
          <div className="row" style={{ gap: 8 }}><button className="back" style={{ width: 30, height: 30, background: '#fff', border: '1px solid var(--line)' }} onClick={() => shift(-1)}><ChevronLeft size={16} /></button><button className="back" style={{ width: 30, height: 30, background: '#fff', border: '1px solid var(--line)' }} onClick={() => shift(1)}><ChevronRight size={16} /></button></div>
        </div>
        <div className="cal">{days.map(d => <button key={d.toDateString()} className={d.toDateString() === sel ? 'on' : ''} onClick={() => setSel(d.toDateString())}>{d.toLocaleDateString('en-US', { weekday: 'short' })}<b>{d.getDate()}</b></button>)}</div>
        <h2 className="h2">{selDate.toDateString() === new Date().toDateString() ? "Today's Workouts" : `Workouts on ${dn}`}</h2>
        {todays.length ? <div className="list">{todays.map(p => {
          const I = ICON[p.activity]; const a = ACTIVITIES[p.activity];
          return <button key={p.id} className="card tint row" style={{ textAlign: 'left', alignItems: 'flex-start' }} onClick={() => nav(`/workouts/activity/${p.activity}`)}>
            <div style={{ width: 54, display: 'grid', placeItems: 'center', paddingTop: 10 }}><I size={26} color="var(--green)" /></div>
            <div className="flex1"><div className="between"><b>{p.name}</b><span className="small green">{p.goal.replace(' goal', '')}</span></div>
              <div className="small muted" style={{ margin: '4px 0 8px' }}>{a.parts.slice(0, 2).join(', ')}</div>
              <div className="row" style={{ gap: 6 }}>{a.parts.slice(0, 2).map(x => <span key={x} className="pill" style={{ background: '#fff' }}>{x}</span>)}</div></div>
          </button>;
        })}</div> : <div className="card soft center muted" style={{ padding: 30 }}>Rest day — no workouts scheduled.<br /><button className="link mt12" onClick={() => nav('/workouts/new')}>Add a workout plan</button></div>}
      </div>
      <button className="fab" onClick={() => nav('/workouts/new')} aria-label="New plan"><Plus size={26} /></button>
    </Screen>
  );
}

export function ActivityDetail() {
  const { kind = 'walking' } = useParams(); const nav = useNavigate(); const a = ACTIVITIES[kind as Activity];
  const { s } = useStore();
  const go = () => nav(s.perms.location ? `/workouts/active/${kind}` : `/workouts/permission/${kind}`);
  return (
    <Screen nav>
      <Header title={a.name} />
      <div className="scroll">
        <img src={IMG(a.img)} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 14 }} alt="" />
        <h2 className="h2">Body Parts Targeted</h2>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>{a.parts.map(p => <span key={p} className="chip" style={{ background: 'var(--green-100)', borderColor: 'var(--green-200)', display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--green)' }} />{p}</span>)}</div>
        <h2 className="h2">Workout Info</h2>
        <div className="grid3">
          <div className="card soft flat" style={{ padding: 12 }}><div className="stat-label">Duration</div><div className="stat-val" style={{ fontSize: 17 }}>30 min</div></div>
          <div className="card soft flat" style={{ padding: 12 }}><div className="stat-label">Calories</div><div className="stat-val" style={{ fontSize: 17 }}>~{a.kcal} kcal</div></div>
          <div className="card soft flat" style={{ padding: 12 }}><div className="stat-label">Difficulty</div><div className="stat-val green" style={{ fontSize: 17 }}>{a.level}</div></div>
        </div>
        <div className="card soft flat mt16"><div className="row bold" style={{ gap: 6 }}><Lightbulb size={16} color="#e0b13a" />Quick Tip</div><p className="small muted" style={{ lineHeight: 1.5, margin: '8px 0 0' }}>{a.tip}</p></div>
        <button className="btn mt16" onClick={go}>Start Workout</button>
      </div>
    </Screen>
  );
}

export function Plans() {
  const nav = useNavigate(); const { s } = useStore();
  return (
    <Screen nav>
      <Header title="My Workout Plans" back />
      <div className="scroll">
        <p className="sub" style={{ marginBottom: 16 }}>Manage and track your personalized physical activity routines.</p>
        <div className="list">{s.plans.map(p => {
          const I = ICON[p.activity];
          return <button key={p.id} className="card flat row" style={{ textAlign: 'left' }} onClick={() => nav(`/workouts/activity/${p.activity}`)}>
            <div className="ic round lg"><I size={22} /></div>
            <div className="flex1"><b>{p.name}</b><div className="small muted mt8">{p.goal} • <span className="green">{p.days.join(', ')}</span></div></div>
            <ChevronRight size={18} color="var(--muted)" />
          </button>;
        })}</div>
      </div>
      <button className="fab" onClick={() => nav('/workouts/new')} aria-label="New plan"><Plus size={26} /></button>
    </Screen>
  );
}

export function NewPlan() {
  const nav = useNavigate(); const { set } = useStore();
  const pick = (k: Activity) => {
    set(() => ({ draft: { activity: k, name: '', goal: k === 'running' ? '5K' : k === 'cycling' ? '15km' : 'Duration', target: k === 'walking' ? '30 min' : '', pace: '6:00 min/km', duration: 30, intensity: 'Brisk', goalType: 'Duration', days: ['Mon', 'Wed', 'Fri'], time: 'Morning (6-9 AM)', reminders: true, reminderTime: '06:30' } }));
    nav('/workouts/new/customize');
  };
  return (
    <Screen>
      <Header title="Create Workout Plan" />
      <div className="scroll">
        <div className="label-green" style={{ fontSize: 15 }}>Choose Activity</div>
        <p className="sub small" style={{ margin: '6px 0 18px' }}>Select your activity type to customize target metrics.</p>
        <div className="list">{(Object.keys(ACTIVITIES) as Activity[]).map(k => {
          const a = ACTIVITIES[k]; const I = ICON[k];
          return <button key={k} className="card tint row" style={{ textAlign: 'left', padding: 18 }} onClick={() => pick(k)}>
            <div className="soft-circle" style={{ width: 54, height: 54, background: '#fff' }}><I size={24} /></div>
            <div className="flex1"><b style={{ fontSize: 18 }}>{a.name}</b><div className="small muted" style={{ margin: '4px 0 6px' }}>{a.desc}</div><span className="pill" style={{ background: '#fff' }}>{a.level}</span></div>
            <ChevronRight size={18} />
          </button>;
        })}</div>
      </div>
    </Screen>
  );
}

function useDraft() {
  const { s, set } = useStore(); const nav = useNavigate();
  useEffect(() => { if (!s.draft) nav('/workouts/new', { replace: true }); }, []);
  const d = s.draft as Draft;
  const up = (p: Partial<Draft>) => set(st => ({ draft: { ...(st.draft as Draft), ...p } }));
  return { d, up };
}

export function Customize() {
  const nav = useNavigate(); const { d, up } = useDraft();
  if (!d) return null;
  const title = d.activity === 'running' ? 'Customize Running Plan' : d.activity === 'walking' ? 'Customize Walking Plan' : 'Customize Cycling Plan';
  return (
    <Screen>
      <Header title={title} step="1 of 3" />
      <div className="scroll">
        <Field label="Plan Name" variant="strong" placeholder={d.activity === 'walking' ? 'e.g. Evening Stroll' : d.activity === 'running' ? 'e.g. Morning Run' : 'e.g. Weekend Ride'} value={d.name} onChange={e => up({ name: e.target.value })} />
        {d.activity === 'walking' ? <>
          <div className="field"><label>Goal Type</label><Seg items={['Distance', 'Duration', 'Steps'] as const} value={d.goalType as 'Distance'} onChange={v => up({ goalType: v, target: v === 'Distance' ? '3 km' : v === 'Steps' ? '5,000 steps' : '30 min' })} /></div>
          <Field label="Target Value" variant="strong" value={d.target} onChange={e => up({ target: e.target.value })} />
          <div className="field"><label>Intensity</label><div className="row" style={{ gap: 8 }}>{['Casual', 'Brisk', 'Power Walk'].map(i => <button key={i} className={`chip ${d.intensity === i ? 'on' : ''}`} style={{ background: d.intensity === i ? undefined : 'var(--green-100)' }} onClick={() => up({ intensity: i })}>{i}</button>)}</div></div>
        </> : <>
          <div className="field"><label>Distance Goal</label><Seg items={(d.activity === 'running' ? ['3K', '5K', '10K', 'Custom'] : ['10km', '15km', '25km', 'Custom']) as readonly string[]} value={d.goal} onChange={v => up({ goal: v })} /></div>
          <Field label={d.activity === 'running' ? 'Target Pace' : 'Target Speed'} variant="strong" value={d.activity === 'running' ? d.pace : d.target || '20 km/h'} onChange={e => d.activity === 'running' ? up({ pace: e.target.value }) : up({ target: e.target.value })} />
          <div className="field"><label>Duration (minutes)</label><div className="input strong"><b className="flex1">{d.duration} min</b>
            <button className="ibtn" style={{ width: 26, height: 26, borderRadius: 13, background: '#fff', border: '1px solid var(--line)' }} onClick={() => up({ duration: Math.max(5, d.duration - 5) })}><Minus size={14} /></button>
            <button className="ibtn" style={{ width: 26, height: 26, borderRadius: 13, background: '#fff', border: '1px solid var(--line)' }} onClick={() => up({ duration: d.duration + 5 })}><Plus size={14} /></button></div></div>
        </>}
      </div>
      <div className="footer"><button className="btn" onClick={() => { if (!d.name.trim()) up({ name: d.activity === 'walking' ? 'Evening Stroll' : d.activity === 'running' ? 'Morning Run' : 'Weekend Ride' }); nav('/workouts/new/schedule'); }}>Next</button></div>
    </Screen>
  );
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export function Schedule() {
  const nav = useNavigate(); const { d, up } = useDraft();
  if (!d) return null;
  return (
    <Screen>
      <Header title="Set Schedule" step="2 of 3" />
      <div className="scroll">
        <div className="field"><label>Days of the Week</label><div className="daypick">{DAYS.map(x => <button key={x} className={d.days.includes(x) ? 'on' : ''} onClick={() => up({ days: d.days.includes(x) ? d.days.filter(y => y !== x) : DAYS.filter(y => [...d.days, x].includes(y)) })}>{x[0]}</button>)}</div></div>
        <Select label="Preferred Time" variant="strong" value={d.time} onChange={v => up({ time: v })} options={['Morning (6-9 AM)', 'Midday (11-2 PM)', 'Evening (5-8 PM)', 'Night (8-10 PM)']} />
        <div className="card tint between" style={{ marginBottom: 16 }}><b style={{ fontWeight: 500 }}>Workout Reminders</b><Toggle on={d.reminders} onChange={v => up({ reminders: v })} /></div>
        {d.reminders && <Field label="Reminder Time" type="time" variant="strong" value={d.reminderTime} onChange={e => up({ reminderTime: e.target.value })} />}
      </div>
      <div className="footer"><button className="btn" disabled={!d.days.length} onClick={() => nav('/workouts/new/summary')}>Next</button></div>
    </Screen>
  );
}

const t12 = (t: string) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
export function Summary() {
  const nav = useNavigate(); const { d } = useDraft(); const { set, toast } = useStore();
  if (!d) return null;
  const goal = d.activity === 'walking' ? d.target : `${d.goal} (${d.duration} min)`;
  const start = () => {
    set(st => ({ plans: [...st.plans, { id: 'p' + Date.now(), name: d.name, activity: d.activity, goal: (d.activity === 'walking' ? d.target : d.goal) + ' goal', days: d.days.length === 7 ? ['Daily'] : d.days, time: d.time, reminders: d.reminders, reminderTime: t12(d.reminderTime), pace: d.pace }], draft: null }));
    toast('Workout plan created'); nav('/workouts/plans', { replace: true });
  };
  return (
    <Screen>
      <Header title="Plan Summary" step="3 of 3" />
      <div className="scroll">
        <p className="sub small" style={{ marginBottom: 16 }}>Please review your customized workout plan details before active initialization.</p>
        <div className="card tint">
          <div className="label-green" style={{ marginBottom: 6 }}>{d.name} Setup</div>
          <div className="kv"><span>Plan Name</span><span>{d.name}</span></div>
          <div className="kv"><span>Activity</span><span>{ACTIVITIES[d.activity].name}</span></div>
          <div className="kv"><span>Goal</span><span>{goal}</span></div>
          {d.activity === 'running' && <div className="kv"><span>Target Pace</span><span>{d.pace}</span></div>}
          {d.activity === 'walking' && <div className="kv"><span>Intensity</span><span>{d.intensity}</span></div>}
          <div className="kv"><span>Schedule</span><span>{d.days.join(', ')}</span></div>
          <div className="kv"><span>Time</span><span>{d.time}</span></div>
          <div className="kv"><span>Reminders</span><span>{d.reminders ? `On at ${t12(d.reminderTime)}` : 'Off'}</span></div>
        </div>
      </div>
      <div className="footer"><button className="btn" onClick={start}>Start Plan</button><button className="btn ghost" onClick={() => nav('/workouts/new/customize')}>Edit Plan</button></div>
    </Screen>
  );
}

export function LocationPermission() {
  const { kind = 'walking' } = useParams(); const nav = useNavigate(); const { set } = useStore();
  const allow = () => {
    const ok = () => { set(st => ({ perms: { ...st.perms, location: true } })); nav(`/workouts/active/${kind}`, { replace: true }); };
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(ok, ok, { timeout: 3000 }); else ok();
  };
  return (
    <Screen>
      <Header title="Location Access Needed" />
      <div className="scroll center">
        <div className="soft-circle" style={{ margin: '20px auto 0', width: 110, height: 110 }}><ShieldCheck size={40} /></div>
        <h2 style={{ fontSize: 22, margin: '36px 0 12px' }}>Secure Workout Tracking</h2>
        <p className="sub">Anbac Fit needs location access ONLY while your workout is active to verify distance and calculate your rewards accurately.</p>
        <p className="sub small mt12">Location tracking stops immediately when you finish your workout. Indoor workouts never use location.</p>
        <div className="col gap12 mt24"><button className="btn" onClick={allow}>Allow Location</button><button className="btn white" style={{ color: 'var(--green)' }} onClick={() => nav(`/workouts/active/${kind}`, { replace: true })}>Use Without Location</button></div>
        <button className="small muted mt24" style={{ textDecoration: 'underline' }} onClick={() => nav('/settings/privacy-policy')}>Learn more about our Data Privacy Policy</button>
      </div>
    </Screen>
  );
}

export function PermissionScreen({ kind }: { kind: 'activity' | 'location' | 'camera' | 'photos' }) {
  const nav = useNavigate(); const { set, toast } = useStore();
  const cfg = {
    activity: { icon: <CircleX size={36} />, title: 'Activity Recognition', text: 'Anbac Fit uses activity recognition to automatically detect your workout type — walking, running, or cycling — so you earn accurate rewards without manual input.', bullets: ['Detects workout type automatically', 'Only active during active exercises', 'You can disable this anytime in Settings'], btn: 'Allow Activity Recognition' },
    location: { icon: <MapPin size={36} />, title: 'Location Access', text: 'Anbac Fit needs location access ONLY while your workout is active to verify distance and calculate your rewards accurately.', bullets: ['Used only during active outdoor workouts', 'Tracking stops immediately when exercise ends', 'Indoor treadmill or gym modes never log pathing', 'Configure authorizations easily in profile page'], btn: 'Allow Location' },
    camera: { icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10" /><path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" /></svg>, title: 'Camera Access', text: 'Your camera is used only to take a profile photo. We never access your camera in the background.', bullets: ['Used only for profile photo configuration', 'Never accessed in the background', 'Can be revoked at any time in device settings'], btn: 'Allow Camera' },
    photos: { icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-3.09-3.09a2 2 0 0 0-2.82 0L6 21" /></svg>, title: 'Photo Access', text: 'Allow Anbac Fit to access your photos to set a profile picture from your gallery.', bullets: ['Select your existing photos for profile set up', 'We never upload files without your explicit authorization', 'Completely revocable anytime via system settings'], btn: 'Allow Photo Access' },
  }[kind];
  const allow = async () => {
    try { if (kind === 'camera') { const st = await navigator.mediaDevices?.getUserMedia({ video: true }); st?.getTracks().forEach(t => t.stop()); } } catch { /* denied */ }
    set(st => ({ perms: { ...st.perms, [kind]: true } })); toast(`${cfg.title} allowed`); nav(-1);
  };
  return (
    <Screen>
      <Header title="Permissions" />
      <div className="scroll center" style={{ paddingTop: 40 }}>
        <div style={{ color: 'var(--green)' }}>{cfg.icon}</div>
        <h2 style={{ fontSize: 22, margin: '60px 0 12px' }}>{cfg.title}</h2>
        <p className="sub small" style={{ fontSize: 14.5 }}>{cfg.text}</p>
        <Bullets items={cfg.bullets} />
      </div>
      <div className="footer"><button className="btn" onClick={allow}>{cfg.btn}</button><button className="btn ghost" onClick={() => nav(-1)}>Not Now</button></div>
    </Screen>
  );
}

export function ActiveWorkout() {
  const { kind = 'walking' } = useParams(); const nav = useNavigate(); const { set, toast } = useStore();
  const k = kind as Activity;
  const [t, setT] = useState(k === 'running' ? 0 : 0); const [paused, setPaused] = useState(false); const [pauseT, setPauseT] = useState(0); const [confirm, setConfirm] = useState(false);
  useEffect(() => { const i = setInterval(() => paused ? setPauseT(v => v + 1) : setT(v => v + 1), 1000); return () => clearInterval(i); }, [paused]);
  const steps = Math.round(t * 1.9 + (k === 'walking' ? 0 : 0));
  const km = k === 'cycling' ? +(t * 0.0068).toFixed(1) : k === 'running' ? +(t * 0.0032).toFixed(2) : +(t * 0.0014).toFixed(2);
  const kcal = Math.round(t * (k === 'cycling' ? .22 : k === 'running' ? .18 : .07));
  const coins = Math.max(10, Math.round(km * 100));
  const end = () => {
    set(st => ({ balance: st.balance + coins, txns: [{ id: 'x' + Date.now(), title: `${ACTIVITIES[k].name} Workout Completed`, date: 'Today, now', amount: coins, kind: 'earn' as const, icon: 'zap', period: 'today' as const }, ...st.txns], tasks: k === 'running' ? st.tasks.map(x => x.unit === 'km' ? { ...x, done: Math.min(x.goal, +(x.done + km).toFixed(1)) } : x) : st.tasks }));
    toast(`Workout saved! +${coins} FitCoins`); nav('/home', { replace: true });
  };
  const splits = useMemo(() => [{ k: 'Km 1', t: '5:24', tag: 'Fastest' }, { k: 'Km 2', t: '5:32', tag: 'Steady' }, { k: 'Km 3', t: '5:40', tag: 'Slower' }], []);
  const Controls = () => <div className="grid2 mt16">
    {paused ? <button className="btn round" onClick={() => setPaused(false)}>Resume</button> : <button className="btn round" onClick={() => setPaused(true)}>Pause</button>}
    <button className="btn round danger-outline" onClick={() => setConfirm(true)}>{paused ? 'End Workout' : 'End'}</button>
  </div>;

  return (
    <Screen>
      <div className="hdr"><h1>{paused ? 'Workout Tracker' : `${ACTIVITIES[k].name} Active`}</h1></div>
      <div className="scroll">
        {paused ? <div className="center" style={{ paddingTop: 20 }}>
          <div style={{ fontSize: 54, fontWeight: 800, color: '#555' }}>{fmt(t)}</div>
          <span className="pill" style={{ background: 'var(--amber)', color: '#fff', marginTop: 8 }}>PAUSED</span>
          <div className="card soft flat" style={{ width: 120, margin: '30px 0', textAlign: 'left', opacity: .6, padding: 12 }}><div className="stat-label">Steps</div><b style={{ fontSize: 20 }}>{steps.toLocaleString()}</b> <span className="small muted">steps</span></div>
          <div className="row" style={{ justifyContent: 'center', gap: 6 }}><Clock size={16} color="var(--green)" />Pause Time: <b>{fmt(pauseT).slice(3)}</b></div>
          <Controls />
        </div>
        : k === 'walking' ? <>
          <p className="center" style={{ fontSize: 17, color: '#444', margin: '4px 0 18px' }}>Time Elapsed: {fmt(t)}</p>
          <div style={{ display: 'grid', placeItems: 'center' }}><RingBig pct={steps / 5000 * 100}><b style={{ fontSize: 30 }}>{steps.toLocaleString()}</b><div className="small muted">Steps</div><div className="small green bold">Goal: 5,000</div></RingBig></div>
          <div className="grid2 mt16"><Stat l="Distance" v={`${km} km`} /><Stat l="Avg Calories" v={`${kcal} kcal`} /></div>
          <MapBox img="map-park.jpg" />
          <Controls />
        </> : k === 'running' ? <>
          <div className="between mt8"><div><div className="stat-label">Time Elapsed</div><div style={{ fontSize: 30, fontWeight: 800 }}>{fmt(t)}</div></div>
            <div style={{ background: 'var(--red-50)', color: 'var(--red)', borderRadius: 10, padding: '8px 12px' }}><div className="row bold" style={{ gap: 6 }}><HeartPulse size={18} />{150 + (t % 9)} bpm</div><div style={{ fontSize: 11 }}>Zone 4 (Aerobic)</div></div></div>
          <div className="grid2 mt16"><Stat l="Distance" v={`${km} km`} /><Stat l="Current Pace" v={`5'32" /km`} /></div>
          <div className="card mt16"><b>Per-KM Splits</b>{splits.map(s => <div key={s.k} className="between" style={{ padding: '10px 0 0' }}><span>{s.k}</span><span className="row" style={{ gap: 12 }}><b>{s.t}</b><span className={`pill ${s.tag === 'Slower' ? 'amber' : s.tag === 'Steady' ? 'gray' : ''}`} style={{ width: 62, justifyContent: 'center', fontSize: 11 }}>{s.tag}</span></span></div>)}</div>
          <MapBox img="map-city.jpg" />
          <Controls />
        </> : <>
          <div className="center"><div className="stat-label">Current Speed</div><div><b style={{ fontSize: 52, fontWeight: 800 }}>{(22 + (t % 7) / 2.5).toFixed(1)}</b> <span className="muted">km/h</span></div><div className="small muted">Timer: <b style={{ color: 'var(--ink)' }}>{fmt(t)}</b></div></div>
          <div className="grid2 mt16"><Stat l="Distance" v={`${km} km`} /><Stat l="Elevation Gain" v={`+${Math.round(t / 4)} m`} green /></div>
          <div className="card mt12 grid2 center"><div><div className="stat-label">Avg Speed</div><b style={{ fontSize: 18 }}>21.2 km/h</b></div><div style={{ borderLeft: '1px solid var(--line)' }}><div className="stat-label">Max Speed</div><b style={{ fontSize: 18 }}>34.8 km/h</b></div></div>
          <MapBox img="map-terrain.jpg" />
          <Controls />
        </>}
      </div>
      <Dialog open={confirm} onClose={() => setConfirm(false)}>
        <h3 style={{ margin: '0 0 8px' }}>End workout?</h3>
        <p className="sub small">You'll earn <b className="green">{coins} FitCoins</b> for this session ({km} km, {fmt(t)}).</p>
        <div className="grid2 mt16"><button className="btn white" onClick={() => setConfirm(false)}>Keep Going</button><button className="btn" onClick={end}>End & Save</button></div>
      </Dialog>
    </Screen>
  );
}
const Stat = ({ l, v, green }: { l: string; v: string; green?: boolean }) => <div className="card flat" style={{ padding: 12 }}><div className="stat-label">{l}</div><div className={green ? 'green' : ''} style={{ fontSize: 19, fontWeight: 700, marginTop: 4 }}>{v}</div></div>;
const MapBox = ({ img }: { img: string }) => <div style={{ position: 'relative', marginTop: 16 }}><img src={IMG(img)} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 14 }} alt="Route map" /><span className="pill solid" style={{ position: 'absolute', top: 10, left: 10, opacity: .9 }}>GPS CONNECTED</span></div>;
function RingBig({ pct, children }: { pct: number; children: React.ReactNode }) {
  const size = 170, st = 12, r = (size - st) / 2, c = 2 * Math.PI * r;
  return <div className="ring" style={{ width: size, height: size }}><svg width={size} height={size}><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--green-100)" strokeWidth={st} /><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--green)" strokeWidth={st} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(100, pct) / 100)} /></svg><div className="lbl">{children}</div></div>;
}
