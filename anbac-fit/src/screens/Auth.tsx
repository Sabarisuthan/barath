import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Check, Lock, Camera, Scale, Dumbbell, Activity, HeartOff, Leaf, CheckCircle2, CircleX, CircleCheck } from 'lucide-react';
import { Screen, Header, Field, Select, Logo, Spinner, Avatar } from '../ui';
import { useStore } from '../store';
import { IMG } from '../data';

export function Splash() {
  const nav = useNavigate(); const { s } = useStore();
  useEffect(() => {
    const t = setTimeout(() => nav(s.authed ? '/restore' : s.onboarded ? '/welcome' : '/onboarding', { replace: true }), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <Screen className="white-bg">
      <div className="state">
        <Logo size={110} />
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: '20px 0 4px' }}>Anbac Fit</h1>
        <div className="label-green" style={{ fontSize: 14 }}>Habit Companion</div>
      </div>
    </Screen>
  );
}

export function Restore() {
  const nav = useNavigate(); const { s } = useStore(); const [p, setP] = useState(10);
  useEffect(() => {
    const i = setInterval(() => setP(v => Math.min(100, v + 15)), 150);
    const t = setTimeout(() => nav(s.role === 'admin' ? '/admin' : '/home', { replace: true }), 1300);
    return () => { clearInterval(i); clearTimeout(t); };
  }, []);
  return (
    <Screen className="white-bg">
      <div className="state">
        <Logo size={84} />
        <h2 style={{ margin: '12px 0 2px', fontSize: 26 }}>Anbac Fit</h2>
        <div className="label-green small">Habit Companion</div>
        <div className="card" style={{ width: '100%', margin: '40px 0 60px', padding: 24 }}>
          <div style={{ display: 'grid', placeItems: 'center' }}><Avatar size={72} /></div>
          <h3 style={{ margin: '12px 0 4px', fontSize: 20 }}>Welcome Back, {s.user.name.split(' ')[0]}</h3>
          <div className="label-green small">{s.role === 'admin' ? 'Administrator' : 'Active Member'}</div>
        </div>
        <p className="small" style={{ margin: '0 0 10px' }}>Restoring your session...</p>
        <div className="progress" style={{ width: '70%' }}><div style={{ width: p + '%' }} /></div>
      </div>
    </Screen>
  );
}

const SLIDES = [
  { img: 'onb-habits.jpg', title: 'Track Your Habits', text: 'Build healthy habits and earn rewards for staying consistent with your daily fitness journey.' },
  { img: 'onb-rewards.jpg', title: 'Earn Rewards', text: 'Complete challenges and redeem points for premium fitness gear and exclusive wellness experiences.' },
];
export function Onboarding() {
  const [i, setI] = useState(0); const nav = useNavigate(); const { set } = useStore();
  const done = () => { set(() => ({ onboarded: true })); nav('/welcome', { replace: true }); };
  const sl = SLIDES[i];
  return (
    <Screen>
      <div className="scroll" style={{ display: 'flex', flexDirection: 'column', paddingTop: 40 }}>
        <img key={sl.img} className="fade-in" src={IMG(sl.img)} style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 20 }} alt="" />
        <div style={{ flex: 1, textAlign: 'center', paddingTop: 48 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 14px' }}>{sl.title}</h1>
          <p className="sub" style={{ fontSize: 16 }}>{sl.text}</p>
        </div>
        <div className="dots" style={{ margin: '20px 0 28px' }}>{[0, 1, 2].map(d => <span key={d} className={d === i ? 'on' : ''} />)}</div>
      </div>
      <div className="footer">
        {i === 0 ? <button className="btn" onClick={() => setI(1)}>Next</button> :
          <div className="row"><button className="btn ghost muted" style={{ width: 120 }} onClick={done}>Skip</button><button className="btn" onClick={done}>Next</button></div>}
      </div>
    </Screen>
  );
}

export function Welcome() {
  const nav = useNavigate();
  return (
    <Screen>
      <div className="scroll" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 80 }}>
        <Logo size={84} />
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: '14px 0 2px' }}>Anbac Fit</h1>
        <div className="label-green small">Habit Companion</div>
        <h2 style={{ fontSize: 20, fontWeight: 500, margin: '44px 0 8px' }}>Your Fitness Journey Starts Here</h2>
        <p className="sub">Earn points for healthy habits, redeem rewards, and build a sustainable lifestyle.</p>
        <div className="col gap16" style={{ width: '100%', marginTop: 70 }}>
          <button className="btn" onClick={() => nav('/signup')}>Create Account</button>
          <button className="btn outline" onClick={() => nav('/login')}>Log In</button>
          <div className="small muted">or continue with</div>
          <button className="btn white" onClick={() => nav('/google')}><GoogleG /> Continue with Google</button>
        </div>
        <p className="muted" style={{ fontSize: 11, marginTop: 40 }}>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </Screen>
  );
}
const GoogleG = () => <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>;

export function GoogleSignIn() {
  const nav = useNavigate(); const { set } = useStore(); const [loading, setLoading] = useState(false);
  const go = () => { setLoading(true); setTimeout(() => { set(() => ({ authed: true, role: 'user' })); nav('/home', { replace: true }); }, 1200); };
  return (
    <Screen>
      <Header back />
      <div className="scroll" style={{ paddingTop: 100 }}>
        <div className="between"><b style={{ fontSize: 18, fontWeight: 600 }}>Anbac Fit</b><span className="small muted">Google Accounts</span></div>
        <button className="card flat" style={{ width: '100%', textAlign: 'left', marginTop: 50 }} onClick={go}>
          <div className="small muted" style={{ marginBottom: 12 }}>Sign in to Anbac Fit</div>
          <div className="row"><Avatar size={40} /><div className="flex1"><div className="bold">Alex Morgan</div><div className="small muted">alex.morgan@gmail.com</div></div><CircleCheck size={20} color="var(--green)" /></div>
        </button>
        {loading && <div className="col" style={{ alignItems: 'center', marginTop: 90, gap: 16 }}><Spinner /><div>Signing you in...</div></div>}
      </div>
    </Screen>
  );
}

export function SignUp() {
  const nav = useNavigate(); const { s, set } = useStore();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', ref: '' });
  const [err, setErr] = useState<Record<string, string>>({});
  const up = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const submit = () => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = 'Please enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Please enter a valid email address.';
    else if (s.accounts.some(a => a.email.toLowerCase() === f.email.toLowerCase())) e.email = 'exists';
    if (f.password.length < 8) e.password = 'Password must be at least 8 characters.';
    setErr(e);
    if (Object.keys(e).length) return;
    set(st => ({ accounts: [...st.accounts, { email: f.email, password: f.password, name: f.name }], user: { ...st.user, name: f.name, email: f.email, phone: f.phone || st.user.phone }, balance: st.balance + (f.ref ? 500 : 0) }));
    nav('/verify', { state: { email: f.email } });
  };
  return (
    <Screen>
      <Header />
      <div className="scroll">
        <h1 className="title-xl">Create Account</h1>
        <p className="sub" style={{ marginBottom: 24 }}>Start your healthy habits journey with Anbac Fit today.</p>
        <Field label="Full Name" placeholder="Enter your full name" value={f.name} onChange={up('name')} error={err.name} />
        <Field label="Email Address" type="email" placeholder="name@example.com" value={f.email} onChange={up('email')} error={err.email && err.email !== 'exists' ? err.email : undefined} />
        {err.email === 'exists' && <div className="err-text" style={{ marginTop: -10, marginBottom: 14 }}>An account with this email already exists. <button className="link" onClick={() => nav('/login', { state: { email: f.email } })}>Sign in instead</button></div>}
        <Field label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" value={f.phone} onChange={up('phone')} />
        <Field label="Password" type="password" placeholder="Create strong password" value={f.password} onChange={up('password')} error={err.password} />
        <Field label="Referral Code (Optional)" placeholder="Enter referral code" value={f.ref} onChange={up('ref')} />
        <p className="muted" style={{ fontSize: 12, marginTop: -8 }}>Have a friend's code? Enter it to earn bonus FitCoins!</p>
        <button className="btn mt16" onClick={submit}>Sign Up</button>
        <p className="center muted mt16">Already have an account? <button className="link" onClick={() => nav('/login')}>Login</button></p>
      </div>
    </Screen>
  );
}

export function Verify() {
  const nav = useNavigate(); const loc = useLocation() as { state?: { email?: string } };
  const [code, setCode] = useState(['', '', '', '']); const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifying, setVerifying] = useState(false); const [err, setErr] = useState('');
  const onChange = (i: number, v: string) => {
    v = v.replace(/\D/g, '').slice(-1); const c = [...code]; c[i] = v; setCode(c); setErr('');
    if (v && i < 3) refs.current[i + 1]?.focus();
  };
  const verify = () => {
    if (code.join('').length < 4) { setErr('Enter all 4 digits.'); return; }
    setVerifying(true); setTimeout(() => nav('/account-created', { replace: true }), 1500);
  };
  if (verifying) return (
    <Screen className="white-bg"><div className="state"><Logo size={84} /><h2 style={{ margin: '12px 0 2px' }}>Anbac Fit</h2><div className="label-green small">Habit Companion</div><div style={{ marginTop: 50 }}><Spinner /></div><p className="mt12">Verifying your account...</p></div></Screen>
  );
  return (
    <Screen>
      <Header plain />
      <div className="scroll">
        <h1 className="title-xl">Verify Your Email</h1>
        <p className="sub">Enter the 4-digit code sent to {loc.state?.email || 'your email'} to verify your companion profile.</p>
        <div className="otp">{code.map((c, i) => <input key={i} ref={el => { refs.current[i] = el; }} inputMode="numeric" value={c} onChange={e => onChange(i, e.target.value)} onKeyDown={e => { if (e.key === 'Backspace' && !c && i) refs.current[i - 1]?.focus(); }} />)}</div>
        {err && <p className="err-text center">{err}</p>}
        <button className="btn" onClick={verify}>Verify</button>
        <p className="center muted" style={{ marginTop: 160 }}>Didn't receive the code? <button className="link" onClick={() => nav('/check-email', { state: loc.state })}>Resend</button></p>
      </div>
    </Screen>
  );
}

export function CheckEmail() {
  const nav = useNavigate(); const loc = useLocation() as { state?: { email?: string } }; const [sec, setSec] = useState(45);
  useEffect(() => { const i = setInterval(() => setSec(v => Math.max(0, v - 1)), 1000); return () => clearInterval(i); }, []);
  return (
    <Screen>
      <Header plain />
      <div className="scroll center" style={{ paddingTop: 60 }}>
        <div className="soft-circle" style={{ margin: '0 auto', background: 'transparent', border: '2px solid var(--green-200)' }}><Mail size={40} /></div>
        <h1 className="title-lg" style={{ marginTop: 40, fontSize: 28, fontWeight: 800 }}>Check Your Email</h1>
        <p className="sub" style={{ marginTop: 12 }}>We sent a verification link to <b style={{ color: 'var(--ink)' }}>{loc.state?.email || 'alex@email.com'}</b>. Please verify to continue.</p>
        <button className="btn mt24" onClick={() => nav('/verify', { state: loc.state, replace: true })}>Open Email App</button>
        <button className="bold muted mt16" disabled={sec > 0} onClick={() => setSec(45)} style={{ display: 'block', margin: '18px auto 4px' }}>Resend Email</button>
        <div className="small muted">{sec > 0 ? `Resend in ${sec}s` : 'You can resend now'}</div>
      </div>
    </Screen>
  );
}

export function AccountCreated() {
  const nav = useNavigate(); const { set } = useStore();
  return (
    <Screen className="white-bg">
      <div className="state">
        <div className="halo"><div><Check size={36} /></div></div>
        <h2 style={{ fontSize: 28 }}>Account Created!</h2>
        <p>Welcome to Anbac Fit. Let's set up your profile to personalize your experience.</p>
      </div>
      <div className="footer">
        <button className="btn" onClick={() => { set(() => ({ authed: true, role: 'user' })); nav('/setup/1', { replace: true }); }}>Set Up Profile</button>
        <button className="btn ghost" onClick={() => { set(() => ({ authed: true, role: 'user' })); nav('/home', { replace: true }); }}>Skip for now</button>
      </div>
    </Screen>
  );
}

export function Login() {
  const nav = useNavigate(); const loc = useLocation() as { state?: { email?: string } }; const { s, set } = useStore();
  const [email, setEmail] = useState(loc.state?.email || ''); const [pw, setPw] = useState('');
  const [err, setErr] = useState<{ email?: string; pw?: string; banner?: boolean }>({});
  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr({ email: 'Please enter a valid email address.' }); return; }
    if (email.toLowerCase() === 'admin@anbac.com') {
      set(st => ({ authed: true, role: 'admin', user: { ...st.user } })); nav('/admin', { replace: true }); return;
    }
    const acc = s.accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!acc || acc.password !== pw) { setErr({ pw: 'Incorrect password. Please try again.', banner: true }); return; }
    set(st => ({ authed: true, role: 'user', user: { ...st.user, name: acc.name } })); nav('/home', { replace: true });
  };
  return (
    <Screen banner={err.banner && <div className="banner red"><CircleX size={18} />Authentication failed</div>}>
      <Header plain />
      <div className="scroll">
        <h1 className="title-xl">Welcome Back</h1>
        <p className="sub" style={{ marginBottom: 26 }}>Log in to continue tracking your fitness and habits.</p>
        <Field label="Email Address" type="email" placeholder="name@example.com" value={email} onChange={e => { setEmail(e.target.value); setErr({}); }} error={err.email} />
        <Field label="Password" type="password" placeholder="Enter your password" value={pw} onChange={e => { setPw(e.target.value); setErr({}); }} error={err.pw} />
        <div style={{ textAlign: 'right' }}><button className="link small" onClick={() => nav('/forgot')}>Forgot Password?</button></div>
        <button className="btn" style={{ marginTop: 28 }} disabled={!email || !pw} onClick={submit}>Log In</button>
        <div className="card soft small mt24" style={{ lineHeight: 1.6 }}>
          <b>Demo accounts</b><br />User: alex@email.com / password123<br />Admin: admin@anbac.com / any password
        </div>
        <p className="center muted" style={{ marginTop: 40 }}>Don't have an account? <button className="link" onClick={() => nav('/signup')}>Sign Up</button></p>
      </div>
    </Screen>
  );
}

export function Forgot() {
  const nav = useNavigate(); const [email, setEmail] = useState(''); const [err, setErr] = useState('');
  return (
    <Screen>
      <Header plain />
      <div className="scroll">
        <h1 className="title-xl">Forgot Password</h1>
        <p className="sub" style={{ marginBottom: 26 }}>Enter your email address below and we'll send you instructions to reset your password.</p>
        <Field label="Email Address" type="email" placeholder="name@example.com" value={email} onChange={e => { setEmail(e.target.value); setErr(''); }} error={err} />
        <button className="btn" onClick={() => /^\S+@\S+\.\S+$/.test(email) ? nav('/reset', { state: { email } }) : setErr('Please enter a valid email address.')}>Send Reset Link</button>
      </div>
    </Screen>
  );
}

export function Reset() {
  const nav = useNavigate(); const loc = useLocation() as { state?: { email?: string } }; const { set, toast } = useStore();
  const [a, setA] = useState(''); const [b, setB] = useState(''); const [err, setErr] = useState('');
  const go = () => {
    if (a.length < 8) return setErr('Password must be at least 8 characters.');
    if (a !== b) return setErr('Passwords do not match.');
    if (loc.state?.email) set(st => ({ accounts: st.accounts.map(x => x.email.toLowerCase() === loc.state!.email!.toLowerCase() ? { ...x, password: a } : x) }));
    toast('Password reset successfully'); nav('/login', { replace: true, state: { email: loc.state?.email } });
  };
  return (
    <Screen>
      <Header plain />
      <div className="scroll">
        <h1 className="title-xl">Reset Password</h1>
        <p className="sub" style={{ marginBottom: 26 }}>Please create a secure new password for your account.</p>
        <Field label="New Password" type="password" placeholder="Create strong password" value={a} onChange={e => { setA(e.target.value); setErr(''); }} />
        <Field label="Confirm Password" type="password" placeholder="Confirm your new password" value={b} onChange={e => { setB(e.target.value); setErr(''); }} error={err} />
        <button className="btn mt8" onClick={go}>Reset Password</button>
      </div>
    </Screen>
  );
}

export function SessionExpired() {
  const nav = useNavigate(); const { set } = useStore();
  return (
    <Screen>
      <div className="state">
        <div className="halo"><div><Lock size={30} /></div></div>
        <h2 style={{ fontSize: 28, fontWeight: 800 }}>Session Expired</h2>
        <p>Your session has expired for security reasons. Please log in again to continue your healthy habits.</p>
        <button className="btn" onClick={() => { set(() => ({ authed: false })); nav('/login', { replace: true }); }}>Log In</button>
      </div>
    </Screen>
  );
}

/* ---------------- Profile setup ---------------- */
export function Setup1() {
  const nav = useNavigate(); const { s, set } = useStore(); const [u, setU] = useState(s.user);
  return (
    <Screen>
      <div style={{ height: 40 }} />
      <Header title="Create Your Profile" step="1 of 3" plain />
      <div className="scroll">
        <button onClick={() => nav('/upload-photo')} style={{ display: 'block', margin: '30px auto 30px', position: 'relative' }}>
          <Avatar size={96} />
          <span style={{ position: 'absolute', right: -2, bottom: 2, width: 30, height: 30, borderRadius: 15, background: 'var(--green)', color: '#fff', display: 'grid', placeItems: 'center', border: '3px solid var(--bg)' }}><Camera size={14} /></span>
        </button>
        <Field label="Full Name" variant="strong" value={u.name} onChange={e => setU({ ...u, name: e.target.value })} />
        <Field label="Date of Birth" variant="strong" type="date" value={u.dob} onChange={e => setU({ ...u, dob: e.target.value })} />
        <Select label="Gender" variant="strong" value={u.gender} onChange={v => setU({ ...u, gender: v })} options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} />
      </div>
      <div className="footer"><button className="btn" onClick={() => { set(() => ({ user: u })); nav('/setup/2'); }}>Next</button></div>
    </Screen>
  );
}

const GOALS = [{ n: 'Lose Weight', i: Scale }, { n: 'Build Muscle', i: Dumbbell }, { n: 'Stay Active', i: Activity }, { n: 'Improve Endurance', i: HeartOff }, { n: 'Healthy Lifestyle', i: Leaf }];
export function Setup2() {
  const nav = useNavigate(); const { s, set } = useStore(); const [g, setG] = useState<string[]>(s.user.goals);
  return (
    <Screen>
      <div style={{ height: 40 }} />
      <Header title="Fitness Goals" step="2 of 3" plain />
      <div className="scroll">
        <p className="sub" style={{ margin: '50px 0 16px' }}>Select the goals that best describe what you want to achieve.</p>
        <div className="list">{GOALS.map(({ n, i: I }) => {
          const on = g.includes(n);
          return <button key={n} className="input strong" style={{ height: 50, fontWeight: 600, background: on ? 'var(--green-100)' : 'transparent' }} onClick={() => setG(on ? g.filter(x => x !== n) : [...g, n])}>
            <I size={18} color="var(--green-700)" /><span className="flex1" style={{ textAlign: 'left' }}>{n}</span>{on && <CheckCircle2 size={22} fill="var(--green)" color="#fff" />}
          </button>;
        })}</div>
      </div>
      <div className="footer"><button className="btn" disabled={!g.length} onClick={() => { set(st => ({ user: { ...st.user, goals: g } })); nav('/setup/3'); }}>Next</button></div>
    </Screen>
  );
}

export function Setup3() {
  const nav = useNavigate(); const { s, set } = useStore(); const [u, setU] = useState(s.user);
  const [ft, setFt] = useState('5'); const [inch, setIn] = useState('10');
  const imperial = u.units === 'imperial';
  return (
    <Screen>
      <div style={{ height: 40 }} />
      <Header title="Body Metrics" step="3 of 3" plain />
      <div className="scroll">
        <div className="grid2 mt16" style={{ marginBottom: 24 }}>
          <button className={`btn ${imperial ? 'outline' : ''}`} style={{ height: 42 }} onClick={() => setU({ ...u, units: 'metric' })}>Metric</button>
          <button className={`btn ${!imperial ? 'outline' : ''}`} style={{ height: 42 }} onClick={() => setU({ ...u, units: 'imperial' })}>Imperial</button>
        </div>
        {imperial ? <>
          <div className="field"><label>Height</label><div className="grid2">
            <div className="input strong"><input value={ft} onChange={e => setFt(e.target.value)} inputMode="numeric" /><span className="suffix">ft</span></div>
            <div className="input strong"><input value={inch} onChange={e => setIn(e.target.value)} inputMode="numeric" /><span className="suffix">in</span></div>
          </div></div>
          <Field label="Weight" variant="strong" value={String(Math.round(+u.weight * 2.2046))} onChange={e => setU({ ...u, weight: String(Math.round(+e.target.value / 2.2046)) })} suffix="lbs" inputMode="numeric" />
        </> : <>
          <Field label="Height" variant="strong" value={u.height} onChange={e => setU({ ...u, height: e.target.value })} suffix="cm" inputMode="numeric" />
          <Field label="Weight" variant="strong" value={u.weight} onChange={e => setU({ ...u, weight: e.target.value })} suffix="kg" inputMode="numeric" />
        </>}
        <Select label="Activity Level" variant="strong" value={u.activity} onChange={v => setU({ ...u, activity: v })} options={['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active']} />
      </div>
      <div className="footer"><button className="btn" onClick={() => {
        const height = imperial ? String(Math.round((+ft * 12 + +inch) * 2.54)) : u.height;
        set(() => ({ user: { ...u, height } })); nav('/setup/done', { replace: true });
      }}>Complete Setup</button></div>
    </Screen>
  );
}

export function SetupDone() {
  const nav = useNavigate(); const { s } = useStore();
  return (
    <Screen>
      <div className="scroll center" style={{ paddingTop: 90 }}>
        <div className="halo" style={{ margin: '0 auto' }}><div><Check size={36} /></div></div>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: '40px 0 12px' }}>You're All Set!</h1>
        <p className="sub">Your personalized fitness journey begins now. We've optimized your tracker based on your preferences.</p>
        <div className="card soft" style={{ textAlign: 'left', marginTop: 40 }}>
          <div className="label-green" style={{ marginBottom: 6 }}>Your Profile Summary</div>
          <div className="kv"><span>Primary Goals</span><span>{s.user.goals.join(', ')}</span></div>
          <div className="kv"><span>Activity Level</span><span>{s.user.activity}</span></div>
        </div>
      </div>
      <div className="footer"><button className="btn" onClick={() => nav('/home', { replace: true })}>Go to Dashboard</button></div>
    </Screen>
  );
}

export function UploadPhoto() {
  const nav = useNavigate(); const { set, toast } = useStore(); const file = useRef<HTMLInputElement>(null); const [failed, setFailed] = useState(false);
  const pick = (f?: File) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024 || !/image\/(png|jpe?g|webp)/.test(f.type)) { setFailed(true); return; }
    set(st => ({ user: { ...st.user, photo: true } })); toast('Profile photo updated'); nav(-1);
  };
  return (
    <Screen>
      <Header title="Upload Photo" plain />
      <div className="scroll center" style={{ paddingTop: 20 }}>
        <div style={{ position: 'relative', width: 120, margin: '0 auto' }}>
          <div className="initials" style={{ width: 120, height: 120, fontSize: 36, border: '2px solid var(--green-200)' }}>AM</div>
          {failed && <span style={{ position: 'absolute', right: -4, bottom: 6, width: 34, height: 34, borderRadius: 17, background: 'var(--red)', color: '#fff', display: 'grid', placeItems: 'center', border: '3px solid var(--bg)' }}><CircleX size={18} /></span>}
        </div>
        {failed ? <><h3 style={{ fontSize: 20, margin: '30px 0 10px' }}>Photo Upload Failed</h3><p className="sub">Photo upload failed. File may be too large or format unsupported.</p></>
          : <><h3 style={{ fontSize: 20, margin: '30px 0 10px' }}>Choose a profile photo</h3><p className="sub">JPG, PNG or WEBP up to 5MB.</p></>}
        <input ref={file} type="file" accept="image/*" hidden onChange={e => pick(e.target.files?.[0])} />
      </div>
      <div className="footer">
        <button className="btn" onClick={() => file.current?.click()}>{failed ? 'Try Again' : 'Choose Photo'}</button>
        <button className="btn ghost muted" style={{ textDecoration: 'underline' }} onClick={() => nav(-1)}>Skip for Now</button>
      </div>
    </Screen>
  );
}

