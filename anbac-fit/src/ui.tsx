import { useState, type ReactNode, type InputHTMLAttributes } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Home, ClipboardList, ShoppingBag, Award, Settings, LayoutDashboard, LineChart, ChevronDown, Signal, Wifi, BatteryFull, Check } from 'lucide-react';
import { IMG } from './data';
import { useStore } from './store';

export function StatusBar() {
  const [t] = useState(() => { const d = new Date(); return `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`; });
  return <div className="statusbar"><span>{t}</span><span className="icons"><Signal size={15} strokeWidth={3} /><Wifi size={15} strokeWidth={3} /><BatteryFull size={20} /></span></div>;
}

export function Screen({ children, nav, admin, className = '', banner }: { children: ReactNode; nav?: boolean; admin?: boolean; className?: string; banner?: ReactNode }) {
  return <div className={`screen fade-in ${className}`}>{banner}{children}{nav && (admin ? <AdminNav /> : <TabBar />)}</div>;
}

export function Header({ title, back = true, step, right, center, plain, onBack }: { title?: ReactNode; back?: boolean; step?: string; right?: ReactNode; center?: boolean; plain?: boolean; onBack?: () => void }) {
  const nav = useNavigate();
  return (
    <div className={`hdr ${center ? 'center' : ''}`}>
      {back && <button className={`back ${plain ? 'plain' : ''}`} onClick={onBack || (() => nav(-1))} aria-label="Back"><ArrowLeft size={20} /></button>}
      {center && back && !right && <span style={{ width: 0 }} />}
      <h1>{title}</h1>
      {step && <span className="step">{step}</span>}
      {right}
      {center && back && !right && <span style={{ width: 38 }} />}
    </div>
  );
}

export function TabBar() {
  const items = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/tasks', label: 'Tasks', icon: ClipboardList },
    { to: '/shop', label: 'Products', icon: ShoppingBag },
    { to: '/rewards', label: 'Rewards', icon: Award },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];
  return <nav className="tabbar">{items.map(i => <NavLink key={i.to} to={i.to} className={({ isActive }) => isActive ? 'on' : ''}><i.icon size={22} strokeWidth={1.8} />{i.label}</NavLink>)}</nav>;
}

export function AdminNav() {
  const items = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: ShoppingBag },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { to: '/admin/analytics', label: 'Analytics', icon: LineChart },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];
  return <nav className="tabbar">{items.map(i => <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => isActive ? 'on' : ''}><i.icon size={22} strokeWidth={1.8} />{i.label}</NavLink>)}</nav>;
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; suffix?: ReactNode; variant?: 'white' | 'strong' | '' };
export function Field({ label, error, suffix, variant = '', type, ...rest }: FieldProps) {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div className={`input ${variant} ${error ? 'error' : ''}`}>
        <input type={isPw && show ? 'text' : type} {...rest} />
        {suffix && <span className="suffix">{suffix}</span>}
        {isPw && <button type="button" className="ibtn" onClick={() => setShow(!show)} aria-label="Toggle password">{show ? <Eye size={20} /> : <EyeOff size={20} />}</button>}
      </div>
      {error && <div className="err-text">{error}</div>}
    </div>
  );
}

export function Select({ label, value, onChange, options, variant = '' }: { label?: string; value: string; onChange: (v: string) => void; options: string[]; variant?: string }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div className={`input ${variant}`}>
        <select value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select>
        <ChevronDown size={18} />
      </div>
    </div>
  );
}

export const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) =>
  <button className={`toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)} role="switch" aria-checked={on} />;

export function Chips<T extends string>({ items, value, onChange }: { items: readonly T[]; value: T; onChange: (v: T) => void }) {
  return <div className="chips">{items.map(i => <button key={i} className={`chip ${value === i ? 'on' : ''}`} onClick={() => onChange(i)}>{i}</button>)}</div>;
}

export function Seg<T extends string>({ items, value, onChange }: { items: readonly T[]; value: T; onChange: (v: T) => void }) {
  return <div className="seg">{items.map(i => <button key={i} className={value === i ? 'on' : ''} onClick={() => onChange(i)}>{i}</button>)}</div>;
}

export const Logo = ({ size = 96 }: { size?: number }) =>
  <div style={{ width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle, #fff 60%, #eef6e8)', display: 'grid', placeItems: 'center' }}>
    <img src={IMG('logo.png')} style={{ width: size * .82 }} alt="Anbac" />
  </div>;

export function Avatar({ size = 56 }: { size?: number }) {
  const { s } = useStore();
  if (!s.user.photo) return <div className="initials" style={{ width: size, height: size, fontSize: size * .36 }}>{s.user.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>;
  return <img className="avatar" src={IMG('avatar.jpg')} width={size} height={size} style={{ width: size, height: size }} alt="" />;
}

export function Empty({ icon, title, text, action, onAction, halo }: { icon: ReactNode; title: string; text: string; action?: string; onAction?: () => void; halo?: boolean }) {
  return (
    <div className="state">
      {halo ? <div className="halo"><div>{icon}</div></div> : <div style={{ color: 'var(--green)' }}>{icon}</div>}
      <h2>{title}</h2>
      <p>{text}</p>
      {action && <button className="btn sm round" onClick={onAction}>{action}</button>}
    </div>
  );
}

export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return <div className="overlay" onClick={onClose}><div className="sheet" onClick={e => e.stopPropagation()}><div className="grab" />{children}</div></div>;
}

export function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return <div className="overlay mid" onClick={onClose}><div className="dialog" onClick={e => e.stopPropagation()}>{children}</div></div>;
}

export function Ring({ pct, size = 64, stroke = 6, children }: { pct: number; size?: number; stroke?: number; children?: ReactNode }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--green-100)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--green)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(pct, 100) / 100)} style={{ transition: 'stroke-dashoffset .4s' }} />
      </svg>
      <div className="lbl">{children}</div>
    </div>
  );
}

export const Bullets = ({ items }: { items: string[] }) =>
  <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', textAlign: 'left' }}>{items.map(i =>
    <li key={i} className="row" style={{ alignItems: 'flex-start', gap: 10, marginBottom: 12, color: 'var(--muted)', fontSize: 14.5 }}><span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--green)', marginTop: 7, flex: '0 0 auto' }} />{i}</li>)}</ul>;

export const CheckRow = ({ ok, children }: { ok: boolean; children: ReactNode }) =>
  <div className="row small" style={{ gap: 6, color: ok ? 'var(--green)' : 'var(--muted)', marginBottom: 6 }}><Check size={14} />{children}</div>;

export function Toast() {
  const { toastMsg } = useStore();
  if (!toastMsg) return null;
  return <div className="toast"><Check size={18} color="#8fd27b" />{toastMsg}</div>;
}

export function Spinner({ size = 40 }: { size?: number }) {
  return <svg className="spin" width={size} height={size} viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeDasharray="70 100" /></svg>;
}
