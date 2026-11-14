import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { User, Bell, Shield, CircleHelp, Info, Gift, LogOut, ChevronRight, ChevronDown, ChevronUp, Camera, Fingerprint, Mail, CircleAlert, FileText, Search, Paperclip, Trash2, ArrowRight, Image, ShieldCheck, Activity, MapPin, Smartphone, Check, WifiOff, TriangleAlert, Unlink, Clock, KeyRound, Database, Wifi } from 'lucide-react';
import { Screen, Header, Field, Select, Toggle, Sheet, Avatar, CheckRow, Empty } from '../ui';
import { useStore } from '../store';

export function SettingsHome() {
  const nav = useNavigate(); const { s, set, reset } = useStore(); const [out, setOut] = useState(false); const [photo, setPhoto] = useState(false);
  const items = [
    { i: User, l: 'Edit Profile', to: '/settings/edit-profile' }, { i: Bell, l: 'Notifications', to: '/settings/notifications' },
    { i: Shield, l: 'Privacy', to: '/settings/privacy' }, { i: KeyRound, l: 'Security', to: '/settings/security' },
    { i: Smartphone, l: 'Permissions', to: '/settings/permissions' }, { i: CircleHelp, l: 'Help & Support', to: '/settings/help' },
    { i: Info, l: 'About', to: '/settings/about' }, { i: Gift, l: 'Refer & Earn', to: '/rewards/refer', badge: '500 FC' },
  ];
  return (
    <Screen nav>
      <div className="hdr"><h1>Settings</h1></div>
      <div className="scroll">
        <button className="card flat row" style={{ width: '100%', textAlign: 'left' }} onClick={() => setPhoto(true)}><Avatar size={60} /><div><b style={{ fontSize: 18 }}>{s.user.name}</b><div className="small muted">{s.user.email}</div></div></button>
        <div className="menu mt16">
          {items.map(it => <button key={it.l} className="menu-item" onClick={() => nav(it.to)}><span className="ic"><it.i size={18} /></span><span className="flex1">{it.l}</span>{it.badge && <span className="pill">{it.badge}</span>}<ChevronRight size={18} color="var(--muted)" /></button>)}
          <button className="menu-item red" onClick={() => setOut(true)}><span className="ic red"><LogOut size={18} /></span><span className="flex1">Log Out</span></button>
        </div>
        <div className="card soft mt16 small">
          <b>Demo tools</b>
          <div className="col gap8 mt8">
            <button className="link" style={{ textAlign: 'left' }} onClick={() => nav('/states')}>Preview global states (errors, offline…)</button>
            <button className="link" style={{ textAlign: 'left', color: 'var(--red)' }} onClick={() => { reset(); nav('/', { replace: true }); }}>Reset app data</button>
          </div>
        </div>
      </div>
      <Sheet open={out} onClose={() => setOut(false)}>
        <h3 className="row" style={{ margin: '0 0 8px', gap: 10 }}><span className="ic round"><LogOut size={16} /></span>Log Out?</h3>
        <p className="sub small">Are you sure you want to log out of Anbac Fit? You will need to log back in to access your habits.</p>
        <div className="grid2 mt16"><button className="btn white" onClick={() => setOut(false)}>Cancel</button><button className="btn" onClick={() => { set(() => ({ authed: false })); nav('/welcome', { replace: true }); }}>Log Out</button></div>
      </Sheet>
      <PhotoSheet open={photo} onClose={() => setPhoto(false)} />
    </Screen>
  );
}

function PhotoSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nav = useNavigate(); const { s, set, toast } = useStore();
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="menu">
        <button className="menu-item" onClick={() => { onClose(); nav(s.perms.camera ? '/upload-photo' : '/settings/permission/camera'); }}><span className="ic"><Camera size={18} /></span>Take Photo</button>
        <button className="menu-item" onClick={() => { onClose(); nav(s.perms.photos ? '/upload-photo' : '/settings/permission/photos'); }}><span className="ic"><Image size={18} /></span>Choose from Gallery</button>
        <button className="menu-item red" onClick={() => { set(st => ({ user: { ...st.user, photo: false } })); toast('Photo removed'); onClose(); }}><span className="ic red"><Trash2 size={18} /></span>Remove Current Photo</button>
      </div>
    </Sheet>
  );
}

export function EditProfile() {
  const nav = useNavigate(); const { s, set, toast, online } = useStore(); const [u, setU] = useState(s.user); const [err, setErr] = useState(false); const [photo, setPhoto] = useState(false);
  const save = () => { if (!online) { setErr(true); return; } set(() => ({ user: u })); toast('Profile updated'); nav(-1); };
  return (
    <Screen banner={err && <div className="banner amber"><TriangleAlert size={18} />Unable to save changes. Please check your connection and try again.</div>}>
      <Header title="Edit Profile" />
      <div className="scroll">
        <button style={{ display: 'block', margin: '6px auto 20px', position: 'relative' }} onClick={() => setPhoto(true)}><Avatar size={100} /><span style={{ position: 'absolute', right: 0, bottom: 4, width: 30, height: 30, borderRadius: 15, background: 'var(--green)', color: '#fff', display: 'grid', placeItems: 'center', border: '3px solid var(--bg)' }}><Camera size={14} /></span></button>
        <Field label="Full Name" value={u.name} onChange={e => setU({ ...u, name: e.target.value })} />
        <Field label="Email Address" type="email" value={u.email} onChange={e => setU({ ...u, email: e.target.value })} />
        <Field label="Phone Number" type="tel" value={u.phone} onChange={e => setU({ ...u, phone: e.target.value })} />
        <Field label="Date of Birth" type="date" value={u.dob} onChange={e => setU({ ...u, dob: e.target.value })} />
        <Select label="Gender" value={u.gender} onChange={v => setU({ ...u, gender: v })} options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} />
      </div>
      <div className="footer"><button className="btn" onClick={save}>{err ? 'Retry Save' : 'Save Changes'}</button></div>
      <PhotoSheet open={photo} onClose={() => setPhoto(false)} />
    </Screen>
  );
}

export function ChangePassword() {
  const nav = useNavigate(); const { s, set, toast } = useStore(); const [a, setA] = useState(''); const [b, setB] = useState(''); const [c, setC] = useState(''); const [err, setErr] = useState('');
  const len = b.length >= 8, spec = /[^A-Za-z0-9]/.test(b);
  const go = () => {
    const acc = s.accounts.find(x => x.name === s.user.name) || s.accounts[0];
    if (acc && a !== acc.password) return setErr('Current password is incorrect.');
    if (!len || !spec) return setErr('New password does not meet the requirements.');
    if (b !== c) return setErr('Passwords do not match.');
    set(st => ({ accounts: st.accounts.map(x => x === acc ? { ...x, password: b } : x) })); toast('Password updated'); nav(-1);
  };
  return (
    <Screen nav>
      <Header title="Change Password" plain center />
      <div className="scroll">
        <Field label="Current Password" type="password" variant="white" value={a} onChange={e => { setA(e.target.value); setErr(''); }} placeholder="••••••••" />
        <Field label="New Password" type="password" variant="white" value={b} onChange={e => { setB(e.target.value); setErr(''); }} placeholder="••••••••" />
        <Field label="Confirm New Password" type="password" variant="white" value={c} onChange={e => { setC(e.target.value); setErr(''); }} placeholder="••••••••" error={err} />
        <div className="small muted bold" style={{ margin: '10px 0 8px' }}>REQUIREMENTS</div>
        <CheckRow ok={len}>At least 8 characters long</CheckRow><CheckRow ok={spec}>Includes at least one special character</CheckRow>
        <button className="btn mt24" onClick={go}>Update Password</button>
      </div>
    </Screen>
  );
}

export function Security() {
  const nav = useNavigate(); const { s, set, toast } = useStore();
  const p = (k: string) => (v: boolean) => set(st => ({ prefs: { ...st.prefs, [k]: v } }));
  return (
    <Screen>
      <Header title="Security" plain />
      <div className="scroll center">
        <div className="soft-circle" style={{ margin: '10px auto 0', background: 'transparent', border: '2px solid var(--green-200)' }}><Fingerprint size={40} /></div>
        <h2 style={{ fontSize: 22, margin: '30px 0 8px' }}>Enable Biometric Login</h2>
        <p className="sub">Use your fingerprint or face recognition for quick and secure access to your Anbac Fit account.</p>
        <div className="list mt24" style={{ textAlign: 'left' }}>
          <div className="card flat between">Fingerprint Login<Toggle on={s.prefs.fingerprint} onChange={p('fingerprint')} /></div>
          <div className="card flat between">Face Recognition<Toggle on={s.prefs.face} onChange={p('face')} /></div>
          <button className="card flat between" onClick={() => nav('/settings/password')}>Change Password<ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="footer"><button className="btn" onClick={() => { set(st => ({ prefs: { ...st.prefs, fingerprint: true } })); toast('Biometric login enabled'); nav(-1); }}>Enable Biometric</button><button className="btn ghost" onClick={() => nav(-1)}>Skip for now</button></div>
    </Screen>
  );
}

export function NotificationSettings() {
  const nav = useNavigate(); const { s, set } = useStore();
  const rows = [['challenge', 'Challenge Updates', 'Get notified when new fitness challenges begin.'], ['reward', 'Reward Alerts', 'Know when you earn FitCoins or new rewards drop.'], ['streak', 'Streak Reminders', 'Daily nudges to keep your streak alive.'], ['store', 'Store Drops', 'Be first to see new discount items.']] as const;
  return (
    <Screen nav>
      <Header title="Notification Settings" plain />
      <div className="scroll">
        {!s.perms.push && <button className="card tint row" style={{ width: '100%', textAlign: 'left', marginBottom: 14 }} onClick={() => nav('/notifications/enable')}><Bell size={18} color="var(--green)" /><span className="flex1 small"><b>Push notifications are off.</b> Tap to enable.</span><ChevronRight size={18} /></button>}
        <div className="list">{rows.map(([k, t, d]) =>
          <div key={k} className="card flat between"><div><b style={{ fontWeight: 500 }}>{t}</b><div className="small muted mt8" style={{ marginTop: 4 }}>{d}</div></div><Toggle on={!!s.prefs[k]} onChange={v => set(st => ({ prefs: { ...st.prefs, [k]: v } }))} /></div>)}</div>
      </div>
    </Screen>
  );
}

export function Privacy() {
  const nav = useNavigate(); const { s, set } = useStore();
  const rows = [['profileVisible', 'Profile Visibility', 'Allow other members of Anbac Fit to see your profile details and workouts.'], ['activityStatus', 'Show Activity Status', 'Show your active/inactive status to your gym friends.'], ['shareAchievements', 'Share Achievements', 'Automatically share fitness milestones to the community board.'], ['marketing', 'Marketing Notifications', 'Receive updates, customized tips, and partner discount deals.']] as const;
  return (
    <Screen nav>
      <Header title="Privacy" plain center />
      <div className="scroll">
        <div className="list">{rows.map(([k, t, d]) =>
          <div key={k} className="card flat"><div className="between"><b>{t}</b><Toggle on={!!s.prefs[k]} onChange={v => set(st => ({ prefs: { ...st.prefs, [k]: v } }))} /></div><div className="small muted mt12" style={{ lineHeight: 1.45 }}>{d}</div></div>)}</div>
        <div className="menu mt16">
          <button className="menu-item" onClick={() => nav('/settings/data-usage')}><span className="ic"><Database size={18} /></span><span className="flex1">Data Usage</span><ChevronRight size={18} /></button>
          <button className="menu-item" onClick={() => nav('/settings/privacy-policy')}><span className="ic"><ShieldCheck size={18} /></span><span className="flex1">Privacy Policy</span><ChevronRight size={18} /></button>
        </div>
      </div>
    </Screen>
  );
}

export function PrivacyIntro() {
  const nav = useNavigate();
  return (
    <Screen className="white-bg">
      <div className="state"><div className="soft-circle"><ShieldCheck size={40} /></div><h2 style={{ fontSize: 28, fontWeight: 600, marginTop: 50 }}>Your Privacy Matters</h2><p>We collect your body metrics solely to personalize your fitness plan. Your health data is securely encrypted, stored privately, and never sold to third parties.</p></div>
      <div className="footer"><button className="btn" onClick={() => nav(-1)}>Accept and Continue</button></div>
    </Screen>
  );
}

export function DataUsage() {
  const nav = useNavigate();
  const rows = [[User, 'Body Metrics', 'Personalization', 'Collected during profile setup to adjust target algorithms and calorie calculations based on your physical build.'], [MapPin, 'Location Data', 'Distance Verification', 'Monitored exclusively during active outdoor exercises to authenticate route lengths and reward precision.'], [Activity, 'Activity Data', 'Accurate Rewards', 'Aggregated step counts and cadence levels to generate and verify daily reward tokens automatically.'], [Smartphone, 'Device Info', 'Security Safeguards', 'Logged at active authentication sessions to flag multi-account exploits and coordinate device authorization.']] as const;
  return (
    <Screen>
      <Header title="Data Usage" />
      <div className="scroll"><div className="list">{rows.map(([I, t, tag, d]) =>
        <div key={t} className="card flat row" style={{ alignItems: 'flex-start' }}><span className="ic round lg" style={{ width: 40, height: 40 }}><I size={18} /></span><div className="flex1"><div className="between"><b>{t}</b><span className="label-green" style={{ fontSize: 10.5 }}>{tag}</span></div><div className="small muted mt8" style={{ lineHeight: 1.45 }}>{d}</div></div></div>)}</div>
        <button className="small muted mt24" style={{ display: 'block', margin: '24px auto 0', textDecoration: 'underline' }} onClick={() => nav('/settings/privacy-policy')}>Read Privacy Policy</button>
      </div>
    </Screen>
  );
}

export function Permissions() {
  const nav = useNavigate(); const { s, set, toast } = useStore();
  const rows = [['location', 'Location Access', 'Needed to track outdoor runs, walks, and calculated distances.'], ['camera', 'Camera & Gallery', 'Required to upload profile avatars and submit challenge proofs.'], ['push', 'Push Notifications', 'Get alerts for daily streaks, friend milestones, and reward releases.'], ['storage', 'Storage Permission', 'Saves offline map assets and your local workout metrics cached.'], ['activity', 'Activity Recognition', 'Detect walking, running and cycling automatically.']] as const;
  return (
    <Screen nav>
      <Header title="Permissions" plain center />
      <div className="scroll"><div className="list">{rows.map(([k, t, d]) => {
        const on = !!s.perms[k];
        return <button key={k} className="card flat row" style={{ textAlign: 'left' }} onClick={() => {
          if (on) { set(st => ({ perms: { ...st.perms, [k]: false } })); toast(`${t} revoked`); }
          else if (k === 'push') nav('/notifications/enable'); else if (k === 'storage') { set(st => ({ perms: { ...st.perms, storage: true } })); toast('Storage allowed'); } else nav(`/settings/permission/${k}`);
        }}>
          <div className="flex1"><b>{t}</b><div className="small muted mt8" style={{ marginTop: 4, lineHeight: 1.4 }}>{d}</div></div>
          <span className={`pill ${on ? '' : 'red'}`} style={{ height: 28, padding: '0 12px', fontWeight: 600 }}>{on ? 'Allowed' : 'Denied'}</span>
        </button>;
      })}</div><p className="small muted center mt16">Tap a permission to change it.</p></div>
    </Screen>
  );
}

export function Help() {
  const nav = useNavigate(); const [q, setQ] = useState('');
  const items = [[CircleHelp, 'FAQs', '/settings/faq'], [Mail, 'Contact Us', '/settings/contact'], [CircleAlert, 'Report a Problem', '/settings/contact?problem=1'], [FileText, 'Terms of Service', '/settings/terms'], [Shield, 'Privacy Policy', '/settings/privacy-policy']] as const;
  return (
    <Screen nav>
      <Header title="Help & Support" plain center />
      <div className="scroll">
        <form className="search" onSubmit={e => { e.preventDefault(); nav(`/settings/faq?q=${encodeURIComponent(q)}`); }}><Search size={18} color="var(--muted)" /><input placeholder="Search help articles..." value={q} onChange={e => setQ(e.target.value)} /></form>
        <div className="menu mt16">{items.map(([I, l, to]) => <button key={l} className="menu-item" onClick={() => nav(to)}><span className="ic"><I size={18} /></span><span className="flex1">{l}</span><ChevronRight size={18} color="var(--muted)" /></button>)}</div>
        <div className="center" style={{ marginTop: 60 }}><b>Anbac Fit</b><div className="small muted">v1.0.0</div></div>
      </div>
    </Screen>
  );
}

const FAQS = [
  ['What are FitCoins?', 'FitCoins (also called Anbac Money) are reward points you earn by completing habits, workouts and challenges. Spend them in the Rewards Store or use them for discounts at checkout.'],
  ['Is tracking automatic?', 'With location permissions enabled, the app syncs and automatically calculates outdoor activities when you start a session.'],
  ['How can I redeem rewards?', 'Open Rewards, pick an item you have enough FitCoins for, choose size and colour and tap Confirm Redemption.'],
  ['Can I invite gym friends?', 'Yes! Go to Refer & Earn, share your code, and you both receive 500 FitCoins after their first workout.'],
  ['How do streaks work?', 'Complete at least one daily task every day to extend your streak. Missing a day resets it to zero.'],
];
export function FAQ() {
  const [sp] = useSearchParams(); const [q, setQ] = useState(sp.get('q') || ''); const [open, setOpen] = useState(1);
  const list = FAQS.filter(([a, b]) => (a + b).toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen>
      <Header title="FAQ" plain center />
      <div className="scroll">
        <div className="search"><Search size={18} color="var(--muted)" /><input placeholder="Search help articles..." value={q} onChange={e => setQ(e.target.value)} /></div>
        <div className="list mt16">{list.map(([t, d], i) =>
          <button key={t} className="card flat" style={{ textAlign: 'left' }} onClick={() => setOpen(open === i ? -1 : i)}>
            <div className="between"><b>{t}</b>{open === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
            {open === i && <p className="small muted" style={{ margin: '10px 0 0', lineHeight: 1.5 }}>{d}</p>}
          </button>)}
          {!list.length && <p className="center muted">No articles match “{q}”.</p>}</div>
      </div>
    </Screen>
  );
}

export function Contact() {
  const nav = useNavigate(); const { s, toast } = useStore(); const [sp] = useSearchParams(); const problem = sp.has('problem');
  const [subject, setSubject] = useState(problem ? '' : 'Trouble redeeming FitCoins reward'); const [email, setEmail] = useState(s.user.email); const [msg, setMsg] = useState(''); const [file, setFile] = useState<string | null>(null);
  return (
    <Screen nav>
      <Header title={problem ? 'Report a Problem' : 'Contact Support'} plain center />
      <div className="scroll">
        <div className="label-caps" style={{ marginTop: 6 }}>Subject</div><div className="input white"><input value={subject} onChange={e => setSubject(e.target.value)} placeholder="What's this about?" /></div>
        <div className="label-caps">Contact Email</div><div className="input white"><input value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="label-caps">Detailed Description</div><textarea className="input white" rows={5} style={{ width: '100%' }} value={msg} onChange={e => setMsg(e.target.value)} placeholder="Describe the issue..." />
        <label className="row small muted" style={{ border: '1.5px dashed var(--line)', borderRadius: 10, padding: 14, marginTop: 16, cursor: 'pointer' }}>
          <Paperclip size={16} color="var(--green)" /><span className="flex1">{file || 'Attach a screenshot (optional)'}</span>
          {file ? <button onClick={e => { e.preventDefault(); setFile(null); }}><Trash2 size={16} color="var(--red)" /></button> : null}
          <input type="file" accept="image/*" hidden onChange={e => setFile(e.target.files?.[0]?.name || null)} />
        </label>
        <button className="btn mt16" disabled={!subject || !msg} onClick={() => { toast('Message sent — we\'ll reply within 24h'); nav(-1); }}><ArrowRight size={18} />Send Message</button>
      </div>
    </Screen>
  );
}

export function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const nav = useNavigate();
  const sections = kind === 'privacy' ? [
    ['Information We Collect', 'We collect health and physical metrics, location data for route logging, and technical device metadata to power the fitness calculation engine.'],
    ['How We Use Your Data', 'Your information allows us to calculate step conversions, prevent exploitation of distance rewards, and customize daily target parameters.'],
    ['Data Storage & Security', 'All captured fitness signals are strictly hashed and synchronized via standard private tunnels. We never trade or rent personal tracking profiles.'],
    ['Third-Party Services', 'Our partner protocols handle credential verification and secure storage backends under fully audited cryptographic standards.'],
    ['Your Rights', 'You hold absolute authority to review, update, or permanently delete your complete telemetry data footprint directly within the settings hub.'],
    ['Contact Us', 'For technical concerns or direct security inquiries, reach our privacy office at privacy@anbacfit.io anytime.'],
  ] : [
    ['', 'Please read these terms of service carefully before using the Anbac Fit application. By accessing or using our services, you agree to be bound by these terms.'],
    ['1. Acceptance of Terms', 'By registering for an account, you represent that you are at least 18 years of age and that all registration information you submit is truthful and accurate.'],
    ['2. Fitness & Health Disclaimer', 'Anbac Fit is not a medical organization. You should consult your physician before starting any diet or exercise program. Our tracking metrics and suggestions are for fitness motivation only.'],
    ['3. FitCoins & Rewards', 'FitCoins earned within the app hold no real-world monetary value. Rewards offered in the store are subject to availability and verification of legitimate physical activity.'],
    ['4. Account Termination', 'We may suspend accounts found to be manipulating activity data or exploiting the rewards system.'],
  ];
  return (
    <Screen>
      <Header title={kind === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} />
      <div className="scroll">
        <p className="small muted">Last updated: January 20, 2026</p>
        {sections.map(([h, b], i) => <div key={i}>{h && <h3 style={{ fontSize: 17, margin: '18px 0 6px' }}>{h}</h3>}<p className="muted" style={{ lineHeight: 1.55, margin: h ? 0 : '14px 0 0', color: h ? undefined : 'var(--ink)' }}>{b}</p></div>)}
      </div>
      {kind === 'privacy' && <div className="footer"><button className="btn" onClick={() => nav(-1)}>I Understand</button></div>}
    </Screen>
  );
}

export function About() {
  const nav = useNavigate();
  return (
    <Screen>
      <Header title="About" plain center />
      <div className="state">
        <img src={`${import.meta.env.BASE_URL}img/logo.png`} width={110} alt="Anbac" />
        <h2>Anbac Fit</h2><p>Habit Companion • Version 1.0.0<br />Build healthy habits and earn rewards for staying consistent.</p>
        <div className="menu" style={{ width: '100%', textAlign: 'left' }}>
          <button className="menu-item" onClick={() => nav('/settings/terms')}><span className="flex1">Terms of Service</span><ChevronRight size={18} /></button>
          <button className="menu-item" onClick={() => nav('/settings/privacy-intro')}><span className="flex1">Your Privacy</span><ChevronRight size={18} /></button>
          <button className="menu-item" onClick={() => nav('/activity-history')}><span className="flex1">Activity History</span><ChevronRight size={18} /></button>
        </div>
      </div>
    </Screen>
  );
}

export function ActivityHistory() {
  const nav = useNavigate(); const { s } = useStore();
  const items = s.txns.filter(t => t.kind === 'earn');
  return (
    <Screen nav>
      <Header title="Activity History" plain />
      {items.length ? <div className="scroll"><div className="list">{items.map(t => <div key={t.id} className="card flat row"><span className="ic round"><Check size={16} /></span><div className="flex1"><b style={{ fontWeight: 500 }}>{t.title}</b><div className="small muted">{t.date}</div></div><span className="green small">+{t.amount}</span></div>)}</div></div>
        : <Empty icon={<Clock size={40} />} title="No Activity Yet" text="Start completing healthy challenges and fitness routines to build up your companion history." action="View Challenges" onAction={() => nav('/rewards')} />}
    </Screen>
  );
}

/* ---------- Global states ---------- */
export function GlobalState() {
  const { kind = 'success' } = useParams(); const nav = useNavigate(); const { setOnline, online } = useStore();
  const cfg: Record<string, { icon: React.ReactNode; title: string; text: string; primary: string; secondary?: string; onPrimary?: () => void; onSecondary?: () => void }> = {
    success: { icon: <Check size={34} />, title: 'Success!', text: 'Your action was completed successfully. Everything is updated on your companion app.', primary: 'Continue', onPrimary: () => nav('/home', { replace: true }) },
    offline: { icon: <WifiOff size={30} />, title: 'No Internet Connection', text: 'Please check your cellular data or wifi connection and try again.', primary: 'Try Again', secondary: 'Go Back', onPrimary: () => { if (navigator.onLine) { setOnline(true); nav(-1); } } },
    error: { icon: <TriangleAlert size={30} />, title: 'Something Went Wrong', text: 'An unexpected error occurred. Please try again later.', primary: 'Try Again', secondary: 'Contact Support', onPrimary: () => nav(-1), onSecondary: () => nav('/settings/contact') },
    'no-connection': { icon: <Wifi size={30} />, title: 'No Connection', text: 'Anbac Fit requires active internet to sync earned FitCoins and update daily store offers. Check your cellular data or Wi-Fi.', primary: 'Try Again', secondary: 'Go Back', onPrimary: () => { setOnline(true); nav(-1); } },
    'connection-failed': { icon: <Unlink size={30} />, title: 'Connection Failed', text: 'Unable to reach our servers. Please check your internet connection and try again.', primary: 'Try Again', secondary: 'Go Back', onPrimary: () => nav(-1) },
  };
  const c = cfg[kind] || cfg.success;
  return (
    <Screen>
      <div className="state">
        <div className="halo"><div>{c.icon}</div></div>
        <h2 style={{ fontSize: 28, fontWeight: 800 }}>{c.title}</h2>
        <p>{c.text}</p>
        <button className="btn" onClick={c.onPrimary}>{c.primary}</button>
        {c.secondary && <button className="btn ghost mt8" onClick={c.onSecondary || (() => nav(-1))}>{c.secondary}</button>}
        {kind === 'offline' && !online && <p className="small muted mt16">Simulated offline mode is on. <button className="link" onClick={() => setOnline(true)}>Go online</button></p>}
      </div>
    </Screen>
  );
}

export function StatesIndex() {
  const nav = useNavigate(); const { online, setOnline } = useStore();
  const links = [['Success', '/state/success'], ['No Internet Connection', '/state/offline'], ['Something Went Wrong', '/state/error'], ['No Connection', '/state/no-connection'], ['Connection Failed', '/state/connection-failed'], ['Session Expired', '/session-expired'], ['Order Failed', '/shop/order-failed'], ['Payment Not Processed', '/shop/payment-failed'], ['Expired Rewards', '/rewards/expired'], ['Upload Photo', '/upload-photo'], ['Your Privacy Matters', '/settings/privacy-intro']];
  return (
    <Screen>
      <Header title="Global States" />
      <div className="scroll">
        <div className="card flat between"><div><b>Simulate offline</b><div className="small muted">Triggers sync-failed and save errors</div></div><Toggle on={!online} onChange={v => setOnline(!v)} /></div>
        <div className="menu mt16">{links.map(([l, to]) => <button key={l} className="menu-item" onClick={() => nav(to)}><span className="flex1">{l}</span><ChevronRight size={18} /></button>)}</div>
      </div>
    </Screen>
  );
}
