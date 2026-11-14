import { useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Plus, Search, MoreVertical, ChevronRight, ChevronLeft, Pencil, Upload, TriangleAlert, RefreshCw, CalendarDays, CircleCheck, Cloud, TrendingUp, Tag, Minus, Package, Users, Bell, Gift, LogOut } from 'lucide-react';
import { Screen, Header, Field, Select, Toggle, Chips, Seg, Sheet, Dialog, Empty } from '../ui';
import { useStore } from '../store';
import { IMG, inr, CUSTOMERS, type OrderStatus, type Product } from '../data';
import { statusPill } from './Shop';

export function AdminDash() {
  const nav = useNavigate(); const { s } = useStore();
  const revenue = 245800 + s.adminOrders.slice(5).reduce((a, o) => a + o.total, 0);
  return (
    <Screen nav admin>
      <div className="hdr" style={{ paddingTop: 16 }}>
        <div className="flex1"><h1 style={{ fontSize: 24, fontWeight: 800 }}>Welcome, Admin</h1><div className="sub small">Managing the Anbac Fit App</div></div>
        <button className="initials" style={{ width: 44, height: 44, background: 'var(--green)', color: '#fff' }} onClick={() => nav('/admin/settings')}>A</button>
      </div>
      <div className="scroll">
        <div className="grid2">
          <div className="card tint"><div className="stat-label">Total Revenue</div><div className="stat-val">{inr(revenue)}</div><div className="green" style={{ fontSize: 11, marginTop: 4 }}>↑ 12% up</div></div>
          <div className="card tint"><div className="stat-label">Orders Today</div><div className="stat-val">{47 + s.adminOrders.length - 5}</div><div className="green" style={{ fontSize: 11, marginTop: 4 }}>↑ 8% up</div></div>
          <button className="card tint" style={{ textAlign: 'left' }} onClick={() => nav('/admin/customers')}><div className="stat-label">Active Users</div><div className="stat-val">1,284</div></button>
          <button className="card tint" style={{ textAlign: 'left' }} onClick={() => nav('/admin/products')}><div className="stat-label">Products</div><div className="stat-val">{148 + s.products.length}</div></button>
        </div>
        <h2 className="h2">Quick Actions</h2>
        <div className="chips">
          <button className="chip" style={{ borderColor: 'var(--green)', color: 'var(--green)' }} onClick={() => nav('/admin/products/new')}>+ Add Product</button>
          <button className="chip" style={{ background: 'var(--green-100)' }} onClick={() => nav('/admin/orders')}>View Orders</button>
          <button className="chip" style={{ background: 'var(--green-100)' }} onClick={() => nav('/admin/analytics')}>Analytics</button>
        </div>
        <div className="grid3 mt12">
          {[['Inventory', Package, '/admin/inventory'], ['Customers', Users, '/admin/customers'], ['Rewards', Gift, '/admin/rewards'], ['Notify', Bell, '/admin/notifications'], ['Storage', Cloud, '/admin/storage'], ['Campaign', Tag, '/admin/campaign/new']].map(([l, I, to]: any) =>
            <button key={l} className="card flat center" style={{ padding: 12 }} onClick={() => nav(to)}><I size={20} color="var(--green)" style={{ margin: '0 auto 6px' }} /><span className="small">{l}</span></button>)}
        </div>
        <h2 className="h2">Recent Orders</h2>
        <div className="list">{s.adminOrders.slice(0, 3).map(o => { const p = s.products.find(x => x.id === o.items[0].pid)!;
          return <button key={o.id} className="card flat row" style={{ textAlign: 'left', alignItems: 'flex-start' }} onClick={() => nav(`/admin/orders/${o.id}`)}>
            <img src={IMG(p.img)} className="thumb sm" alt="" />
            <div className="flex1"><div className="between"><b>#{o.id}</b><b>{inr(o.total)}</b></div><div className="small muted" style={{ margin: '4px 0 6px' }}>{o.customer} • {p.name.replace('Premium ', '')}</div><div className="between">{statusPill(o.status)}<ChevronRight size={16} color="var(--green)" /></div></div>
          </button>; })}</div>
      </div>
    </Screen>
  );
}

export function AdminProducts() {
  const nav = useNavigate(); const { s, set, toast } = useStore(); const [q, setQ] = useState(''); const [cat, setCat] = useState('All'); const [menu, setMenu] = useState<Product | null>(null); const [del, setDel] = useState<Product | null>(null);
  const list = s.products.filter(p => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen nav admin>
      <Header title="Products" center right={<button className="icon-btn" onClick={() => nav('/admin/products/new')} aria-label="Add"><Plus size={18} /></button>} />
      <div style={{ padding: '0 20px' }}>
        <div className="search" style={{ background: 'var(--green-100)' }}><Search size={18} /><input placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)} /></div>
        <div className="mt12"><Chips items={['All', 'Apparel', 'Supplements', 'Equipment', 'Accessories', 'Wellness'] as const} value={cat as 'All'} onChange={setCat} /></div>
      </div>
      <div className="scroll" style={{ paddingTop: 14 }}>
        {list.length ? <div className="list">{list.map(p =>
          <div key={p.id} className="card flat row" style={{ padding: 12 }}>
            <button className="row flex1" style={{ textAlign: 'left' }} onClick={() => nav(`/admin/products/${p.id}`)}>
              <img src={IMG(p.img)} className="thumb sm" alt="" />
              <div className="flex1"><div className="between"><b className="ellipsis">{p.name}</b><span>{inr(p.price)}</span></div>
                <div className="between small mt8" style={{ marginTop: 4 }}><span className="muted">{p.category}</span><span className={p.stock === 0 ? 'red' : p.stock < 10 ? '' : 'green'} style={{ color: p.stock > 0 && p.stock < 10 ? '#d98a00' : undefined }}>{p.stock === 0 ? 'Out of Stock' : `Stock: ${p.stock}${p.stock < 10 ? ' (low)' : ''}`}</span></div></div>
            </button>
            <button onClick={() => setMenu(p)} aria-label="More"><MoreVertical size={18} /></button>
          </div>)}</div> : <Empty icon={<Package size={40} />} title="No products" text="Try a different search or add a new product." />}
      </div>
      <button className="fab" onClick={() => nav('/admin/products/new')} aria-label="Add product"><Plus size={26} /></button>
      <Sheet open={!!menu} onClose={() => setMenu(null)}>
        <b>{menu?.name}</b>
        <div className="menu mt12">
          <button className="menu-item" onClick={() => { nav(`/admin/products/${menu!.id}/edit`); setMenu(null); }}>Edit Product</button>
          <button className="menu-item" onClick={() => { nav(`/admin/rewards/${menu!.id}`); setMenu(null); }}>Set Reward</button>
          <button className="menu-item" onClick={() => { set(st => ({ products: st.products.map(x => x.id === menu!.id ? { ...x, stock: x.stock + 50 } : x) })); toast('Restocked +50 units'); setMenu(null); }}>Restock +50</button>
          <button className="menu-item red" onClick={() => { setDel(menu); setMenu(null); }}>Delete Product</button>
        </div>
      </Sheet>
      <DeleteDialog p={del} onClose={() => setDel(null)} />
    </Screen>
  );
}

function DeleteDialog({ p, onClose, after }: { p: Product | null; onClose: () => void; after?: () => void }) {
  const { set, toast } = useStore();
  return <Dialog open={!!p} onClose={onClose}>
    <h3 style={{ margin: '0 0 8px' }}>Delete Product?</h3><p className="sub small">“{p?.name}” will be removed from the store. This action cannot be undone.</p>
    <div className="grid2 mt16"><button className="btn white" onClick={onClose}>Cancel</button><button className="btn danger" onClick={() => { set(st => ({ products: st.products.filter(x => x.id !== p!.id), cart: st.cart.filter(c => c.pid !== p!.id), wishlist: st.wishlist.filter(w => w !== p!.id) })); toast('Product deleted'); onClose(); after?.(); }}>Delete</button></div>
  </Dialog>;
}

export function AdminProductForm() {
  const { id } = useParams(); const nav = useNavigate(); const { s, set, toast } = useStore();
  const existing = s.products.find(p => p.id === id);
  const [f, setF] = useState<Product>(existing || { id: '', name: '', category: 'Apparel', price: 0, compare: undefined, points: 1000, img: 'tee.jpg', rating: 0, reviews: 0, stock: 10, sku: 'ABT-' + String(Math.floor(Math.random() * 900) + 100), desc: '', sold: 0, earn: 200, spend: 500, discount: 0 });
  const [avail, setAvail] = useState(true); const [err, setErr] = useState(''); const file = useRef<HTMLInputElement>(null); const [upload, setUpload] = useState<string | null>(null);
  const save = () => {
    if (!f.name.trim() || !f.price) { setErr('Product name and price are required.'); return; }
    const p = { ...f, id: f.id || f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36), stock: avail ? f.stock : 0, img: upload || f.img };
    set(st => ({ products: existing ? st.products.map(x => x.id === p.id ? p : x) : [...st.products, p] }));
    toast(existing ? 'Product updated' : 'Product added'); nav('/admin/products', { replace: true });
  };
  return (
    <Screen>
      <Header title={existing ? 'Edit Product' : 'Add Product'} center right={<button className="action" onClick={save}>Save</button>} />
      <div className="scroll">
        <button className="dashed col center" style={{ width: '100%', padding: upload ? 0 : 22, gap: 6, alignItems: 'center', marginBottom: 18, overflow: 'hidden' }} onClick={() => file.current?.click()}>
          {upload ? <img src={upload} style={{ width: '100%', height: 140, objectFit: 'cover' }} alt="" /> : <><span className="ic round"><Upload size={16} /></span><span className="green bold small">Tap to upload product image</span><span className="muted" style={{ fontSize: 11 }}>Supports JPG, PNG up to 5MB — Auto-syncs</span></>}
        </button>
        <input ref={file} type="file" accept="image/*" hidden onChange={e => { const fl = e.target.files?.[0]; if (fl) { const r = new FileReader(); r.onload = () => setUpload(r.result as string); r.readAsDataURL(fl); } }} />
        <Field label="Product Name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="e.g. Anbac Sport Tee" />
        <div className="field"><label>Description</label><textarea className="input" rows={3} value={f.desc} onChange={e => setF({ ...f, desc: e.target.value })} placeholder="Describe the product" /></div>
        <div className="grid2"><Field label="Price (₹)" inputMode="numeric" value={f.price || ''} onChange={e => setF({ ...f, price: +e.target.value || 0 })} /><Field label="Compare Price (₹)" inputMode="numeric" value={f.compare || ''} onChange={e => setF({ ...f, compare: +e.target.value || undefined })} /></div>
        <Select label="Category" value={f.category} onChange={v => setF({ ...f, category: v as Product['category'] })} options={['Apparel', 'Accessories', 'Wellness', 'Equipment', 'Supplements', 'Gift Cards']} />
        <div className="grid2">
          <div className="field"><label>Stock Quantity</label><div className="input"><button onClick={() => setF({ ...f, stock: Math.max(0, f.stock - 1) })}><Minus size={14} /></button><input style={{ textAlign: 'center' }} value={f.stock} onChange={e => setF({ ...f, stock: +e.target.value || 0 })} /><button onClick={() => setF({ ...f, stock: f.stock + 1 })}><Plus size={14} /></button></div></div>
          <Field label="SKU" value={f.sku} onChange={e => setF({ ...f, sku: e.target.value })} />
        </div>
        <div className="between" style={{ margin: '4px 0 14px' }}><b style={{ fontWeight: 500 }}>Available for Purchase</b><Toggle on={avail} onChange={setAvail} /></div>
        <div className="between" style={{ marginBottom: 14 }}><b style={{ fontWeight: 500 }}>Featured Product</b><Toggle on={!!f.featured} onChange={v => setF({ ...f, featured: v })} /></div>
        <h3 style={{ fontSize: 17, margin: '8px 0 12px' }}>Rewards & Discount</h3>
        <Field label="FitCoins Earned" inputMode="numeric" value={f.earn} onChange={e => setF({ ...f, earn: +e.target.value || 0 })} />
        <p className="muted" style={{ fontSize: 12, marginTop: -10 }}>Coins customers earn on purchase</p>
        <Field label="Points to Redeem" inputMode="numeric" value={f.points} onChange={e => setF({ ...f, points: +e.target.value || 0 })} />
        {err && <p className="err-text">{err}</p>}
        <button className="btn mt8" onClick={save}>Save Product</button>
      </div>
    </Screen>
  );
}

export function AdminProductDetail() {
  const { id } = useParams(); const nav = useNavigate(); const { s } = useStore(); const p = s.products.find(x => x.id === id); const [del, setDel] = useState<Product | null>(null);
  if (!p) return <Screen nav admin><Header title="Product Details" /><Empty icon={<Package size={40} />} title="Not found" text="This product was removed." /></Screen>;
  return (
    <Screen nav admin>
      <Header title="Product Details" center right={<button className="icon-btn" onClick={() => nav(`/admin/products/${p.id}/edit`)} aria-label="Edit" style={{ background: 'var(--amber-50)', color: '#c9971a' }}><Pencil size={16} /></button>} />
      <div className="scroll" style={{ padding: 0 }}>
        <img src={IMG(p.img)} style={{ width: '100%', height: 190, objectFit: 'cover' }} alt="" />
        <div style={{ padding: '16px 20px' }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{p.name}</h2>
          <div className="row mt8" style={{ gap: 6 }}><span className="price" style={{ fontSize: 18 }}>{inr(p.price)}</span>{p.compare && <><span className="strike">{inr(p.compare)}</span><span className="small muted">• {p.discount}% OFF</span></>}</div>
          <div className="grid2 mt16">
            <div className="card flat"><div className="small muted">Inventory</div><b className={p.stock ? 'green' : 'red'} style={{ fontSize: 18 }}>Stock: {p.stock}</b><div className="muted" style={{ fontSize: 11 }}>SKU: {p.sku}</div></div>
            <div className="card flat"><div className="small muted">Performance</div><b style={{ fontSize: 18 }}>{p.sold} Sold</b><div className="muted" style={{ fontSize: 11 }}>Revenue: ₹{(p.sold * p.price / 100000).toFixed(1)}L</div></div>
          </div>
          <b className="small" style={{ display: 'block', marginTop: 16 }}>Description</b><p className="small muted" style={{ lineHeight: 1.5 }}>{p.desc}</p>
          <b className="small">Tags</b><div className="row mt8" style={{ gap: 6, flexWrap: 'wrap' }}>{[p.category, 'Fitness', 'Sustainable', 'New'].map(t => <span key={t} className="pill">{t}</span>)}</div>
          <button className="btn mt24" onClick={() => nav(`/admin/products/${p.id}/edit`)}>Edit Product</button>
          <button className="btn danger-outline mt12" onClick={() => setDel(p)}>Delete Product</button>
        </div>
      </div>
      <DeleteDialog p={del} onClose={() => setDel(null)} after={() => nav('/admin/products', { replace: true })} />
    </Screen>
  );
}

export function AdminOrders() {
  const nav = useNavigate(); const { s } = useStore(); const [f, setF] = useState('All');
  const [month, setMonth] = useState(new Date(2025, 6, 1));
  const counts = (st: string) => s.adminOrders.filter(o => o.status === st).length;
  const tabs = [`All (${234})`, `Pending (${12 + counts('Pending') - 1})`, `Processing (${28 + counts('Processing') - 1})`, `Shipped (${counts('Shipped')})`, `Delivered (${counts('Delivered')})`];
  const list = s.adminOrders.filter(o => f.startsWith('All') || f.startsWith(o.status));
  return (
    <Screen nav admin>
      <Header title="Orders" center right={<span style={{ width: 38 }} />} />
      <div className="scroll">
        <div className="between"><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}><ChevronLeft size={18} color="var(--green)" /></button><b style={{ fontSize: 17 }}>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</b><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}><ChevronRight size={18} color="var(--green)" /></button></div>
        <div className="card tint mt12" style={{ padding: 12 }}><div className="small muted">Month Performance</div><b>Total: 342 orders • ₹4,56,780 revenue</b></div>
        <div className="mt12"><Chips items={tabs} value={tabs.find(t => t.startsWith(f.split(' ')[0])) || tabs[0]} onChange={v => setF(v)} /></div>
        <div className="list mt12">{list.map(o =>
          <button key={o.id} className="card flat" style={{ textAlign: 'left' }} onClick={() => nav(`/admin/orders/${o.id}`)}>
            <div className="between"><span><b>#{o.id}</b> <span className="small muted">{o.date}</span></span>{statusPill(o.status)}</div>
            <div className="between mt8"><div><b style={{ fontWeight: 500 }}>{o.customer}</b><div className="small muted">{o.items.reduce((a, i) => a + i.qty, 0)} items</div></div><b style={{ fontSize: 17 }}>{inr(o.total)}</b></div>
            <div className="row mt8" style={{ gap: 6 }}>{o.items.slice(0, 3).map((it, i) => <img key={i} src={IMG(s.products.find(p => p.id === it.pid)?.img || 'tee.jpg')} className="thumb" style={{ width: 32, height: 32, borderRadius: 6 }} alt="" />)}</div>
          </button>)}</div>
      </div>
    </Screen>
  );
}

export function AdminOrderDetail() {
  const { id } = useParams(); const { s, set, toast } = useStore(); const o = s.adminOrders.find(x => x.id === id); const [open, setOpen] = useState(false);
  if (!o) return null;
  const stages: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const idx = stages.indexOf(o.status);
  const sub = o.items.reduce((a, it) => a + (s.products.find(p => p.id === it.pid)?.price || 0) * it.qty, 0);
  const disc = o.discount || 0;
  return (
    <Screen nav admin>
      <Header title={`Order #${o.id}`} center right={<span style={{ width: 38 }} />} />
      <div className="scroll">
        <div className="card flat"><div className="small muted">Order Progress</div>
          <div className="between mt8 small">{['Placed', 'Confirmed', 'Shipped', 'Delivered'].map((l, i) => <span key={l} className="row" style={{ gap: 5, color: i <= idx ? 'var(--green)' : 'var(--muted)' }}><span style={{ width: 7, height: 7, borderRadius: 4, background: i <= idx ? 'var(--green)' : '#ccc' }} />{l}</span>)}</div></div>
        <div className="card flat mt12"><div className="small muted">Customer Details</div>
          <div className="row mt8"><div className="initials" style={{ width: 40, height: 40 }}>{o.customer.split(' ').map(w => w[0]).join('')}</div><div><b style={{ fontWeight: 500 }}>{o.customer}</b><div className="muted" style={{ fontSize: 12 }}>{o.email} • {o.phone}</div></div></div>
          <div className="small muted mt12">Shipping Address</div><div className="small">{o.address}</div></div>
        <div className="card flat mt12"><div className="small muted">Items ({o.items.length})</div>
          {o.items.map((it, i) => { const p = s.products.find(x => x.id === it.pid)!; return <div key={i} className="row mt12"><img src={IMG(p.img)} className="thumb" style={{ width: 36, height: 36 }} alt="" /><div className="flex1"><b style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</b><div className="muted" style={{ fontSize: 12 }}>Quantity: {it.qty}{it.size ? ` • Size: ${it.size}` : ''}</div></div><b style={{ fontWeight: 500 }}>{inr(p.price * it.qty)}</b></div>; })}</div>
        <div className="card flat mt12 small">
          <div className="between" style={{ padding: '4px 0' }}><span className="muted">Subtotal</span><span>{inr(sub)}</span></div>
          <div className="between" style={{ padding: '4px 0' }}><span className="muted">Discount</span><span className="red">-{inr(disc)}</span></div>
          <div className="between" style={{ padding: '4px 0' }}><span className="muted">Delivery</span><span className="green">₹0</span></div>
          <div className="divider" /><div className="between"><b style={{ fontSize: 16 }}>Total</b><b style={{ fontSize: 17 }}>{inr(sub - disc)}</b></div>
          <div className="muted" style={{ fontSize: 11, marginTop: 8 }}>Paid via UPI • {o.date}</div>
        </div>
        <button className="btn mt16" onClick={() => setOpen(true)}>Update Status</button>
        <div className="grid2 mt12"><button className="btn outline" style={{ height: 42, fontSize: 14 }} onClick={() => window.print()}>Print Invoice</button><a className="btn outline" style={{ height: 42, fontSize: 14 }} href={`mailto:${o.email}?subject=Your Anbac order ${o.id}`}>Contact Customer</a></div>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)}>
        <h3 style={{ margin: '0 0 12px' }}>Update Status</h3>
        <div className="menu">{(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map(st => <button key={st} className="menu-item" onClick={() => { set(x => ({ adminOrders: x.adminOrders.map(y => y.id === o.id ? { ...y, status: st } : y) })); setOpen(false); toast(`Order marked ${st}`); }}><span className="flex1">{st}</span>{o.status === st && <CircleCheck size={18} color="var(--green)" />}</button>)}</div>
      </Sheet>
    </Screen>
  );
}

export function AdminAnalytics() {
  const { s } = useStore(); const [r, setR] = useState<'Today' | 'Week' | 'Month' | 'Year'>('Month');
  const mult = { Today: .04, Week: .24, Month: 1, Year: 11.6 }[r];
  const bars = { Today: [3, 5, 2, 6, 4, 7, 5], Week: [40, 55, 72, 45, 80, 70, 95], Month: [45, 60, 85, 50, 95, 80, 110], Year: [70, 64, 88, 90, 76, 100, 112] }[r];
  const max = Math.max(...bars);
  const top = [...s.products].sort((a, b) => b.sold * b.price - a.sold * a.price).slice(0, 4);
  return (
    <Screen nav admin>
      <div className="hdr" style={{ paddingTop: 14 }}><h1 style={{ fontSize: 24, fontWeight: 800 }}>Analytics</h1><span className="icon-btn"><CalendarDays size={18} /></span></div>
      <div style={{ padding: '0 20px' }}><Chips items={['Today', 'Week', 'Month', 'Year'] as const} value={r} onChange={setR} /></div>
      <div className="scroll" style={{ paddingTop: 14 }}>
        <div className="card tint"><div className="small muted">Total Revenue — {r === 'Month' ? 'July 2025' : r}</div><div style={{ fontSize: 30, fontWeight: 800, margin: '6px 0' }}>{inr(Math.round(456780 * mult))}</div><div className="row small green" style={{ gap: 6 }}><TrendingUp size={16} />+18% vs last {r.toLowerCase()}</div></div>
        <div className="grid3 mt12"><div className="card flat" style={{ padding: 12 }}><div className="stat-label">Orders</div><b>{Math.round(342 * mult)}</b></div><div className="card flat" style={{ padding: 12 }}><div className="stat-label">Avg Order</div><b>₹1,335</b></div><div className="card flat" style={{ padding: 12 }}><div className="stat-label">Returns</div><b>{Math.round(8 * mult)}</b></div></div>
        <div className="card flat mt12"><b>Weekly Performance</b><div className="bars mt16">{bars.map((b, i) => <div key={i}><i style={{ height: `${b / max * 100}%` }} title={String(b)} />W{i + 1}</div>)}</div></div>
        <h2 className="h2">Top Selling Products</h2>
        <div className="list">{top.map((p, i) => <div key={p.id} className="card flat row" style={{ padding: 12 }}><span className="ic round" style={{ width: 26, height: 26, fontSize: 12, fontWeight: 700 }}>{i + 1}</span><div className="flex1"><b style={{ fontWeight: 500 }}>{p.name}</b><div className="small muted">{p.sold} sold</div></div><b className="green" style={{ fontWeight: 500 }}>{inr(p.sold * p.price)}</b></div>)}</div>
      </div>
    </Screen>
  );
}

export function AdminInventory() {
  const nav = useNavigate(); const { s, set, toast } = useStore();
  const low = s.products.filter(p => p.stock > 0 && p.stock < 20); const out = s.products.filter(p => p.stock === 0);
  const restock = (id: string) => { set(st => ({ products: st.products.map(p => p.id === id ? { ...p, stock: p.stock + 50 } : p) })); toast('Restocked +50 units'); };
  return (
    <Screen nav admin>
      <div className="hdr" style={{ paddingTop: 14 }}><h1 style={{ fontSize: 24, fontWeight: 800 }}>Inventory</h1><button className="icon-btn" onClick={() => toast('Inventory refreshed')} aria-label="Refresh"><RefreshCw size={18} /></button></div>
      <div className="scroll">
        {(low.length + out.length) > 0 && <div className="banner amber" style={{ borderRadius: 10, padding: 12 }}><TriangleAlert size={18} />{low.length + out.length} products low on stock</div>}
        <div className="grid3 mt12" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>{[['Total Items', s.products.length + 148, ''], ['In Stock', s.products.filter(p => p.stock >= 20).length + 134, 'green'], ['Low Stock', low.length, 'amber'], ['Out', out.length, 'red']].map(([l, v, c]) =>
          <div key={l as string} className="card flat" style={{ padding: 10 }}><b className={c as string} style={{ fontSize: 18, color: c === 'amber' ? '#e08a00' : undefined }}>{v}</b><div className="muted" style={{ fontSize: 10.5 }}>{l}</div></div>)}</div>
        <h2 className="h2">Low Stock Alerts</h2>
        <div className="list">{low.length ? low.map(p => <div key={p.id} className="card flat between" style={{ padding: 12 }}><div><b style={{ fontWeight: 500 }}>{p.name}</b><div className="small muted">Stock: {p.stock} • Reorder needed</div></div><button className="pill solid" style={{ height: 30, padding: '0 12px' }} onClick={() => restock(p.id)}>Restock</button></div>) : <p className="muted small">All good — no low stock.</p>}</div>
        <h2 className="h2">Out of Stock</h2>
        <div className="list">{out.length ? out.map(p => <div key={p.id} className="card flat between" style={{ padding: 12 }}><div><b style={{ fontWeight: 500 }}>{p.name}</b><div className="small muted">Stock: 0 • Last sold Jul 25</div></div><button className="pill solid" style={{ height: 30, padding: '0 12px' }} onClick={() => restock(p.id)}>Restock</button></div>) : <p className="muted small">Nothing is out of stock.</p>}</div>
        <h2 className="h2">All Products</h2>
        <div className="list">{s.products.map(p => <button key={p.id} className="card flat between" style={{ padding: 12 }} onClick={() => nav(`/admin/products/${p.id}`)}><span>{p.name}</span><span className="small muted">{p.stock} units</span></button>)}</div>
      </div>
    </Screen>
  );
}

export function AdminCustomers() {
  const { toast } = useStore(); const [q, setQ] = useState(''); const [sort, setSort] = useState('Recent Orders');
  let list = CUSTOMERS.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
  if (sort === 'Total Spent') list = [...list].sort((a, b) => b.spent - a.spent); if (sort === 'Name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  const exportCsv = () => {
    const csv = 'Name,Tier,Last Order,Spent,Orders\n' + CUSTOMERS.map(c => [c.name, c.tier, c.last, c.spent, c.orders].join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'anbac-customers.csv'; a.click(); toast('Customer data exported');
  };
  return (
    <Screen nav admin>
      <div className="hdr" style={{ paddingTop: 14 }}><h1 style={{ fontSize: 24, fontWeight: 800 }}>Customers</h1></div>
      <div className="scroll">
        <div className="search" style={{ background: 'var(--green-100)' }}><Search size={18} /><input placeholder="Search customers..." value={q} onChange={e => setQ(e.target.value)} /></div>
        <div className="grid3 mt12">{[['1,284', 'Total Customers'], ['1,156', 'Active'], ['89', 'New (July)']].map(([v, l]) => <div key={l} className="card flat" style={{ padding: 12 }}><b>{v}</b><div className="muted" style={{ fontSize: 11 }}>{l}</div></div>)}</div>
        <div className="mt12" style={{ width: 200 }}><Select value={sort} onChange={setSort} options={['Recent Orders', 'Total Spent', 'Name']} /></div>
        <div className="list">{list.map(c =>
          <div key={c.name} className="card flat row">
            <div className="initials" style={{ width: 44, height: 44 }}>{c.initials}</div>
            <div className="flex1"><div className="between"><b style={{ fontWeight: 500 }}>{c.name}</b><span className={`pill ${c.tier.startsWith('Gold') ? 'amber' : c.tier.startsWith('Platinum') ? 'blue' : 'gray'}`} style={{ fontSize: 10.5 }}>{c.tier}</span></div>
              <div className="small muted">Last order: {c.last} • {inr(c.spent)} spent • {c.orders} orders</div></div>
          </div>)}</div>
        <button className="btn outline mt16" onClick={exportCsv}>Export Customer Data</button>
      </div>
    </Screen>
  );
}

export function AdminNotifications() {
  const { toast } = useStore(); const [title, setTitle] = useState('Summer Flash Sale! ⚡'); const [msg, setMsg] = useState('Get 20% off all sportswear tee purchases this weekend. Use code FIT20 at checkout!'); const [aud, setAud] = useState('Active Users'); const [later, setLater] = useState(false);
  const [sent, setSent] = useState([{ t: 'Summer Sale — 20% Off Everything', d: 'Sent Jul 27 • 1,284 recipients', o: '78%' }, { t: 'New Product Alert — Anbac Sport Tee', d: 'Sent Jul 25 • 1,156 recipients', o: '65%' }, { t: 'Workout Reminder — Complete streak!', d: 'Sent Jul 24 • 892 recipients', o: '82%' }]);
  const send = () => { if (!title.trim()) return; const n = aud === 'All Users' ? '1,284' : aud === 'Active Users' ? '1,156' : '89'; setSent([{ t: title, d: `${later ? 'Scheduled' : 'Sent today'} • ${n} recipients`, o: later ? '—' : '0%' }, ...sent]); toast(later ? 'Notification scheduled' : 'Notification sent'); setTitle(''); setMsg(''); };
  return (
    <Screen nav admin>
      <div className="hdr" style={{ paddingTop: 14 }}><h1 style={{ fontSize: 24, fontWeight: 800 }}>Notifications</h1><span className="pill solid" style={{ height: 28, padding: '0 12px', borderRadius: 14 }}>New</span></div>
      <div className="scroll">
        <div className="card flat"><b>Send Notification</b>
          <div className="field mt12"><label className="small muted">Title</label><div className="input"><input value={title} onChange={e => setTitle(e.target.value)} /></div></div>
          <div className="field"><label className="small muted">Message</label><textarea className="input" rows={3} value={msg} onChange={e => setMsg(e.target.value)} /></div>
          <Select label="Target Audience" value={aud} onChange={setAud} options={['All Users', 'Active Users', 'New Users']} />
          <div className="between" style={{ marginBottom: 14 }}><span style={{ fontWeight: 500 }}>Schedule for later</span><Toggle on={later} onChange={setLater} /></div>
          <button className="btn" disabled={!title.trim()} onClick={send}>{later ? 'Schedule Notification' : 'Send Notification'}</button>
        </div>
        <h2 className="h2">Sent Notifications</h2>
        <div className="list">{sent.map((n, i) => <div key={i} className="card flat row" style={{ padding: 12, alignItems: 'flex-start' }}><span className="ic round" style={{ width: 26, height: 26 }}><CircleCheck size={14} /></span><div className="flex1"><b style={{ fontWeight: 500, fontSize: 14.5 }}>{n.t}</b><div className="between"><span className="muted" style={{ fontSize: 12 }}>{n.d}</span><span className="green" style={{ fontSize: 11 }}>{n.o} opened</span></div></div></div>)}</div>
      </div>
    </Screen>
  );
}

export function AdminStorage() {
  const { s, set, toast } = useStore(); const [syncing, setSyncing] = useState(false); const [last, setLast] = useState('2 minutes ago'); const [used, setUsed] = useState(12.4);
  return (
    <Screen nav admin>
      <div className="hdr" style={{ paddingTop: 14 }}><h1 style={{ fontSize: 24, fontWeight: 800 }}>Cloud Storage</h1><Cloud size={22} color="var(--green)" /></div>
      <div className="scroll">
        <div className="card tint row"><CircleCheck size={28} color="var(--green)" /><div><b style={{ fontWeight: 500 }}>{syncing ? 'Syncing…' : 'All Synced'}</b><div className="small muted">Last sync: {last}</div></div></div>
        <div className="card flat mt12"><b>Firebase Storage</b>
          <div className="between mt12"><b style={{ fontWeight: 500 }}>{used.toFixed(1)} GB used</b><span className="small muted">of 50 GB</span></div>
          <div className="progress mt8"><div style={{ width: `${used / 50 * 100}%` }} /></div>
          {[['Product Images', '342 files', '8.2 GB'], ['User Avatars', '1,284 files', '2.1 GB'], ['Banners', '24 files', '1.8 GB']].map(([a, b, c]) => <div key={a} className="between mt12"><div><div style={{ fontWeight: 500 }}>{a}</div><div className="small muted">{b}</div></div><span className="green">{c}</span></div>)}
        </div>
        <div className="between mt16"><b style={{ fontWeight: 500 }}>Auto-upload product images</b><Toggle on={s.prefs.autoUpload} onChange={v => set(st => ({ prefs: { ...st.prefs, autoUpload: v } }))} /></div>
        <h2 className="h2">Recent Uploads</h2>
        <div className="list">{[['sport-tee-hero.jpg', '2.4 MB • Jul 28, 14:32'], ['protein-shake-thumb.png', '1.1 MB • Jul 28, 12:15'], ['banner-summer-sale.jpg', '3.8 MB • Jul 27']].map(([a, b]) => <div key={a} className="card flat between" style={{ padding: 12 }}><div><div style={{ fontWeight: 500 }}>{a}</div><div className="small muted">{b}</div></div><CircleCheck size={18} color="var(--green)" /></div>)}</div>
        <button className="btn mt16" disabled={syncing} onClick={() => { setSyncing(true); setTimeout(() => { setSyncing(false); setLast('just now'); toast('Storage synced'); }, 1200); }}>{syncing ? 'Syncing…' : 'Sync Now'}</button>
        <button className="btn danger-outline mt12" onClick={() => { setUsed(u => Math.max(10.9, u - 1.5)); toast('Cache cleared'); }}>Clear Cache</button>
      </div>
    </Screen>
  );
}

export function AdminSettings() {
  const nav = useNavigate(); const { s, set, toast } = useStore(); const [out, setOut] = useState(false);
  const T = ({ k, l }: { k: string; l: string }) => <div className="between" style={{ padding: '8px 0' }}><span>{l}</span><Toggle on={!!s.prefs[k]} onChange={v => set(st => ({ prefs: { ...st.prefs, [k]: v } }))} /></div>;
  const exportAll = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify({ products: s.products, orders: s.adminOrders }, null, 2)], { type: 'application/json' })); a.download = 'anbac-export.json'; a.click(); toast('Data exported'); };
  return (
    <Screen nav admin>
      <div className="hdr" style={{ paddingTop: 14 }}><h1 style={{ fontSize: 24, fontWeight: 800 }}>Settings</h1></div>
      <div className="scroll">
        <div className="card flat row"><div className="initials" style={{ width: 48, height: 48, background: 'var(--green)', color: '#fff' }}>A</div><div className="flex1"><div className="row" style={{ gap: 6 }}><b>Admin One</b><span className="pill" style={{ fontSize: 10 }}>Super Admin</span></div><div className="small muted">admin@anbac.com</div></div></div>
        <div className="card flat mt12"><b>App Configuration</b><div className="mt8"><T k="maintenance" l="Maintenance Mode" /><T k="registrations" l="Allow New Registrations" /><T k="fitcoins" l="Enable FitCoins Rewards" /></div></div>
        <div className="card flat mt12"><b>Notifications</b><div className="mt8"><T k="orderAlerts" l="New Order Alerts" /><T k="stockAlerts" l="Low Stock Alerts" /></div></div>
        <div className="card flat mt12"><b>Security & Data</b><div className="mt8"><T k="twofa" l="Two-Factor Auth" /><T k="backup" l="Auto Backup" /></div></div>
        <div className="menu mt12">
          <button className="menu-item" onClick={() => nav('/admin/rewards')}><span className="flex1">Rewards & Discounts</span><ChevronRight size={18} /></button>
          <button className="menu-item" onClick={() => nav('/admin/inventory')}><span className="flex1">Inventory</span><ChevronRight size={18} /></button>
          <button className="menu-item" onClick={() => nav('/admin/customers')}><span className="flex1">Customers</span><ChevronRight size={18} /></button>
          <button className="menu-item" onClick={() => nav('/admin/notifications')}><span className="flex1">Push Notifications</span><ChevronRight size={18} /></button>
          <button className="menu-item" onClick={() => nav('/admin/storage')}><span className="flex1">Cloud Storage</span><ChevronRight size={18} /></button>
        </div>
        <button className="btn outline mt16" onClick={exportAll}>Export All Data</button>
        <button className="btn ghost mt8" style={{ color: 'var(--red)' }} onClick={() => setOut(true)}><LogOut size={16} />Logout</button>
        <p className="center small muted">Anbac Admin v1.0.0</p>
      </div>
      <Sheet open={out} onClose={() => setOut(false)}>
        <h3 style={{ margin: '0 0 8px' }}>Log Out?</h3><p className="sub small">You will need to sign in again to manage the store.</p>
        <div className="grid2 mt16"><button className="btn white" onClick={() => setOut(false)}>Cancel</button><button className="btn" onClick={() => { set(() => ({ authed: false, role: 'user' })); nav('/welcome', { replace: true }); }}>Log Out</button></div>
      </Sheet>
    </Screen>
  );
}

export function AdminRewards() {
  const nav = useNavigate(); const { s, set } = useStore();
  return (
    <Screen nav admin>
      <Header title="Rewards & Discounts" plain />
      <div className="scroll">
        <div className="grid2"><div className="card tint"><div className="stat-label">Active Offers</div><div className="between"><b className="stat-val">{s.products.filter(p => p.discount).length + 9}</b><span className="pill solid">Live</span></div></div><div className="card tint"><div className="stat-label">Redeemed</div><b className="stat-val">34,500</b><div className="muted" style={{ fontSize: 10.5 }}>FitCoins / month</div></div></div>
        <div className="between"><h2 className="h2">Product Rewards</h2><Link to="/admin/products" className="small link">View All</Link></div>
        <div className="list">{s.products.slice(0, 5).map(p =>
          <div key={p.id} className="card flat">
            <div className="row"><img src={IMG(p.img)} className="thumb sm" alt="" /><div className="flex1"><div className="between"><b>{p.name}</b><b>{inr(p.price)}</b></div><div className="row small muted" style={{ gap: 4 }}><Tag size={12} color="var(--green)" />FitCoins: Earn {p.earn} / Spend {p.spend}</div></div></div>
            <div className="between mt12"><span className="row" style={{ gap: 10 }}><span className={`pill ${p.discount ? '' : 'gray'}`}>{p.discount ? `${p.discount}% OFF Active` : 'No Discount'}</span><button className="small link" onClick={() => nav(`/admin/rewards/${p.id}`)}>Edit</button></span>
              <Toggle on={!!p.discount} onChange={v => set(st => ({ products: st.products.map(x => x.id === p.id ? { ...x, discount: v ? (x.discount || 10) : 0 } : x) }))} /></div>
          </div>)}</div>
        <h2 className="h2">Active Campaigns</h2>
        <div className="card flat"><div className="between"><b>Summer Fitness Sale</b><span className="pill">Jul 15-31</span></div><div className="small muted mt8">20% off all Apparel items</div><div className="between small muted mt12"><span>Campaign Progress</span><span>156 / 500 claimed</span></div><div className="progress mt8"><div style={{ width: '31%' }} /></div></div>
      </div>
      <button className="fab" onClick={() => nav('/admin/campaign/new')} aria-label="New campaign"><Plus size={26} /></button>
    </Screen>
  );
}

const Stepper = ({ v, set }: { v: number; set: (n: number) => void }) => <div className="input"><button onClick={() => set(Math.max(0, v - 50))}><Minus size={14} /></button><input style={{ textAlign: 'center' }} value={v} onChange={e => set(+e.target.value || 0)} /><button onClick={() => set(v + 50)}><Plus size={14} /></button></div>;

export function AdminSetReward() {
  const { id } = useParams(); const nav = useNavigate(); const { s, set, toast } = useStore(); const p = s.products.find(x => x.id === id);
  const [earn, setEarn] = useState(p?.earn || 200); const [spend, setSpend] = useState(p?.spend || 500); const [off, setOff] = useState(100);
  const [discOn, setDiscOn] = useState(!!p?.discount); const [type, setType] = useState<'Percentage' | 'Flat Amount'>('Percentage'); const [val, setVal] = useState(p?.discount || 20);
  const [from, setFrom] = useState('2025-07-15'); const [to, setTo] = useState('2025-07-31'); const [showP, setShowP] = useState(true); const [showS, setShowS] = useState(true);
  if (!p) return null;
  const save = () => { set(st => ({ products: st.products.map(x => x.id === p.id ? { ...x, earn, spend, discount: discOn ? val : 0 } : x) })); toast('Reward saved'); nav(-1); };
  return (
    <Screen>
      <Header title="Set Reward" center right={<button className="action" onClick={save}>Save</button>} />
      <div className="scroll">
        <div className="card flat row"><img src={IMG(p.img)} className="thumb sm" alt="" /><div className="flex1"><div className="between"><b>{p.name}</b><span>{inr(p.price)}</span></div><div className="small muted">Category: {p.category}</div></div></div>
        <h3 style={{ fontSize: 16, margin: '20px 0 10px' }}>FitCoins Settings</h3>
        <div className="field"><label className="small">Coins Earned on Purchase</label><Stepper v={earn} set={setEarn} /><span className="muted" style={{ fontSize: 11 }}>Customers earn these FitCoins when they buy this product</span></div>
        <div className="field"><label className="small">Coins Required to Redeem</label><Stepper v={spend} set={setSpend} /><span className="muted" style={{ fontSize: 11 }}>Customers spend these FitCoins for a discount</span></div>
        <Field label="Discount on Redemption (₹)" value={off} onChange={e => setOff(+e.target.value || 0)} />
        <div className="between" style={{ margin: '8px 0 12px' }}><h3 style={{ fontSize: 16, margin: 0 }}>Discount Settings</h3><Toggle on={discOn} onChange={setDiscOn} /></div>
        {discOn && <>
          <div className="field"><label className="small">Discount Type</label><Seg items={['Percentage', 'Flat Amount'] as const} value={type} onChange={setType} /></div>
          <Field label={type === 'Percentage' ? 'Discount Value (%)' : 'Discount Value (₹)'} value={val} onChange={e => setVal(+e.target.value || 0)} />
          <div className="grid2"><Field label="Valid From" type="date" value={from} onChange={e => setFrom(e.target.value)} /><Field label="Valid Until" type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
        </>}
        <h3 style={{ fontSize: 16, margin: '8px 0 10px' }}>Offer Visibility</h3>
        <div className="between" style={{ padding: '6px 0' }}><span>Show on Product Page</span><Toggle on={showP} onChange={setShowP} /></div>
        <div className="between" style={{ padding: '6px 0' }}><span>Show in Rewards Store</span><Toggle on={showS} onChange={setShowS} /></div>
        <button className="btn mt16" onClick={save}>Save Reward</button>
      </div>
    </Screen>
  );
}

export function AdminCampaign() {
  const nav = useNavigate(); const { toast } = useStore();
  const [name, setName] = useState('Summer Fitness Sale'); const [desc, setDesc] = useState('Get 20% off on all apparel items this summer!');
  const [type, setType] = useState<'Percentage' | 'Flat' | 'BOGO'>('Percentage'); const [val, setVal] = useState('20%'); const [apply, setApply] = useState('Apparel');
  const [min, setMin] = useState('499'); const [max, setMax] = useState('500'); const [code, setCode] = useState('SUMMER20'); const [limit, setLimit] = useState('500 total uses'); const [per, setPer] = useState('2 uses'); const [mult, setMult] = useState(true);
  return (
    <Screen>
      <Header title="New Campaign" center right={<span style={{ width: 38 }} />} />
      <div className="scroll">
        <Field label="Campaign Name" value={name} onChange={e => setName(e.target.value)} />
        <Field label="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <div className="field"><label>Discount Type</label><Seg items={['Percentage', 'Flat', 'BOGO'] as const} value={type} onChange={setType} /></div>
        {type !== 'BOGO' && <Field label={`Discount Value (${type === 'Percentage' ? '%' : '₹'})`} value={val} onChange={e => setVal(e.target.value)} />}
        <div className="field"><label>Apply To</label><div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>{['All Products', 'Apparel', 'Supplements', 'Equipment'].map(a => <button key={a} className={`chip ${apply === a ? 'on' : ''}`} style={{ height: 32, fontSize: 13 }} onClick={() => setApply(a)}>{a}</button>)}</div></div>
        <div className="grid2"><Field label="Min Order (₹)" value={min} onChange={e => setMin(e.target.value)} /><Field label="Max Discount (₹)" value={max} onChange={e => setMax(e.target.value)} /></div>
        <div className="field"><div className="between"><label style={{ fontSize: 14, fontWeight: 500 }}>Coupon Code</label><button className="small link" style={{ fontWeight: 400 }} onClick={() => setCode('FIT' + Math.random().toString(36).slice(2, 7).toUpperCase())}>Auto-generate</button></div><div className="input"><input value={code} onChange={e => setCode(e.target.value.toUpperCase())} style={{ fontWeight: 600 }} /></div></div>
        <div className="grid2"><Field label="Usage Limit" value={limit} onChange={e => setLimit(e.target.value)} /><Field label="Per User Limit" value={per} onChange={e => setPer(e.target.value)} /></div>
        <div className="between" style={{ marginBottom: 10 }}><b style={{ fontWeight: 500 }}>FitCoins Multiplier Bonus</b><Toggle on={mult} onChange={setMult} /></div>
        {mult && <div className="input"><span className="flex1 muted">Extra Multiplier</span><b className="green">2x</b></div>}
        <button className="btn mt24" disabled={!name || !code} onClick={() => { toast(`Campaign “${name}” launched`); nav('/admin/rewards', { replace: true }); }}>Launch Campaign</button>
      </div>
    </Screen>
  );
}
