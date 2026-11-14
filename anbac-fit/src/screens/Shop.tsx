import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { ShoppingCart, Search, Heart, Trash2, Minus, Plus, Wallet, MapPin, Pencil, Truck, Check, CircleX, CreditCard, ShoppingBag, ChevronRight, Star, Coins } from 'lucide-react';
import { Screen, Header, Chips, Toggle, Empty, Dialog, Sheet, Field } from '../ui';
import { useStore, useProduct } from '../store';
import { CATEGORIES, IMG, inr, num, type Order, type OrderStatus } from '../data';

const CartBtn = () => {
  const { s } = useStore(); const nav = useNavigate(); const n = s.cart.reduce((a, c) => a + c.qty, 0);
  return <button className="icon-btn" onClick={() => nav('/shop/cart')} aria-label="Cart"><ShoppingCart size={19} />{n > 0 && <span className="badge-dot">{n}</span>}</button>;
};

export function ShopHome() {
  const nav = useNavigate(); const [q, setQ] = useState('');
  return (
    <Screen nav>
      <div className="hdr"><button className="icon-btn" onClick={() => nav('/shop/wishlist')} aria-label="Wishlist"><Heart size={18} /></button><h1 style={{ textAlign: 'center' }}>Shop</h1><CartBtn /></div>
      <div className="scroll">
        <form className="search" onSubmit={e => { e.preventDefault(); nav(`/shop/store?q=${encodeURIComponent(q)}`); }}><Search size={18} color="var(--muted)" /><input placeholder="Search premium gear..." value={q} onChange={e => setQ(e.target.value)} /></form>
        <div className="grid2 mt16">{CATEGORIES.map(c =>
          <button key={c.name} className="cat-card" onClick={() => nav(`/shop/store?cat=${encodeURIComponent(c.name)}`)}><img src={IMG(c.img)} alt="" /><div className="b"><b style={{ fontWeight: 500 }}>{c.name}</b><div className="small muted">{c.count} Items</div></div></button>)}</div>
        <div className="grid2 mt16"><Link to="/shop/orders" className="btn outline">My Orders</Link><Link to="/shop/store" className="btn">Rewards Store</Link></div>
      </div>
    </Screen>
  );
}

export function Store() {
  const nav = useNavigate(); const { s, set, toast } = useStore(); const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || ''); const initCat = sp.get('cat');
  const tabs = ['All', 'Apparel', 'Accessories', 'Wellness', 'Equipment', 'Supplements', 'Gift Cards'] as const;
  const [cat, setCat] = useState<typeof tabs[number]>((tabs as readonly string[]).includes(initCat || '') ? initCat as typeof tabs[number] : 'All');
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 400); return () => clearTimeout(t); }, []);
  const list = s.products.filter(p => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen nav>
      <div className="hdr"><Link to="/shop" className="back" aria-label="Back"><ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} /></Link><h1 style={{ textAlign: 'center' }}>Rewards Store</h1><CartBtn /></div>
      <div style={{ padding: '0 20px' }}>
        <div className="search"><Search size={18} color="var(--muted)" /><input placeholder="Search premium gear..." value={q} onChange={e => setQ(e.target.value)} /></div>
        <div className="mt12"><Chips items={tabs} value={cat} onChange={setCat} /></div>
      </div>
      <div className="row small bold" style={{ margin: '12px 20px 0', padding: '10px 12px', background: 'var(--green-100)', borderRadius: 10 }}><Coins size={16} color="var(--green)" />Use FitCoins for extra savings</div>
      <div className="scroll" style={{ paddingTop: 14 }}>
        {loading ? <div className="grid2">{[0, 1, 2, 3].map(i => <div key={i} className="prod-card"><div className="skel" style={{ height: 120, borderRadius: 0 }} /><div className="b col gap8"><div className="skel" style={{ height: 12 }} /><div className="skel" style={{ height: 12, width: '50%' }} /></div></div>)}</div>
          : list.length ? <div className="grid2">{list.map(p => {
            const fav = s.wishlist.includes(p.id);
            return <div key={p.id} className="prod-card" style={{ position: 'relative' }}>
              <button onClick={() => nav(`/shop/product/${p.id}`)}><img src={IMG(p.img)} alt="" /></button>
              <button style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, background: '#fff', display: 'grid', placeItems: 'center' }} onClick={() => { set(st => ({ wishlist: fav ? st.wishlist.filter(x => x !== p.id) : [...st.wishlist, p.id] })); toast(fav ? 'Removed from wishlist' : 'Added to wishlist'); }} aria-label="Wishlist"><Heart size={16} color="var(--red)" fill={fav ? 'var(--red)' : 'none'} /></button>
              <button className="b" style={{ textAlign: 'left' }} onClick={() => nav(`/shop/product/${p.id}`)}>
                <b style={{ fontSize: 14 }}>{p.name}</b>
                <div className="row" style={{ gap: 6, margin: '4px 0' }}><span className="price">{inr(p.price)}</span>{p.compare && <span className="strike">{inr(p.compare)}</span>}</div>
                {p.discount && p.compare ? <span className="pill red">{p.discount}% OFF</span> : p.stock === 0 ? <span className="pill gray">Out of stock</span> : <div className="muted" style={{ fontSize: 12 }}>Use 200 FitCoins for ₹100 off</div>}
              </button>
            </div>;
          })}</div>
            : <Empty icon={<ShoppingBag size={44} color="var(--ink)" strokeWidth={1.4} />} title="No Products Available" text="New products are added regularly. Check back soon!" action="Refresh" onAction={() => { setQ(''); setCat('All'); }} />}
      </div>
    </Screen>
  );
}

export function ProductDetail() {
  const { id } = useParams(); const p = useProduct(id); const { s, set, toast } = useStore();
  const [size, setSize] = useState('M'); const [color, setColor] = useState('Green'); const [coins, setCoins] = useState(s.useCoins); const [img, setImg] = useState(0);
  if (!p) return <Screen><Header title="Product" /><Empty icon={<ShoppingBag size={40} />} title="Product not found" text="This item is no longer available." /></Screen>;
  const fav = s.wishlist.includes(p.id);
  const imgs = [p.img, p.id === 'tee' ? 'tee-light.jpg' : 'tee-bottle.jpg', 'cat-accessories.jpg'];
  const add = () => {
    set(st => {
      const ex = st.cart.find(c => c.pid === p.id && c.size === size && c.color === color);
      return { useCoins: coins, cart: ex ? st.cart.map(c => c === ex ? { ...c, qty: c.qty + 1 } : c) : [...st.cart, { pid: p.id, qty: 1, size: p.category === 'Apparel' ? size : undefined, color }] };
    });
    toast('Added to cart');
  };
  return (
    <Screen>
      <Header title="Product Details" plain right={<button className="icon-btn" onClick={() => set(st => ({ wishlist: fav ? st.wishlist.filter(x => x !== p.id) : [...st.wishlist, p.id] }))} aria-label="Wishlist"><Heart size={18} color="var(--red)" fill={fav ? 'var(--red)' : 'none'} /></button>} />
      <div className="scroll" style={{ padding: 0 }}>
        <div style={{ padding: '0 16px' }}><img src={IMG(imgs[img])} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 16, background: '#eee' }} alt={p.name} /></div>
        <div className="dots mt8">{imgs.map((_, i) => <span key={i} className={i === img ? 'on' : ''} onClick={() => setImg(i)} style={{ cursor: 'pointer', width: i === img ? 16 : 6, height: 6 }} />)}</div>
        <div className="card flat" style={{ margin: '10px 0 0', borderRadius: '16px 16px 0 0', borderBottom: 0 }}>
          <div className="between"><span className="row bold" style={{ gap: 6 }}><Coins size={16} color="var(--green)" />Apply FitCoins</span><span className="pill">200 pts = ₹100 off</span></div>
          <div className="between mt8"><span className="small muted">Apply 200 FitCoins for ₹100 off</span><Toggle on={coins} onChange={setCoins} /></div>
        </div>
        <div style={{ padding: '18px 20px 24px' }}>
          <div className="between"><h2 style={{ margin: 0, fontSize: 22 }}>{p.name}</h2></div>
          <div className="row mt8" style={{ gap: 6 }}><span className="price" style={{ fontSize: 18 }}>{inr(p.price)}</span>{p.compare && <><span className="strike">{inr(p.compare)}</span><span className="small muted">• {p.discount}% OFF</span></>}</div>
          <div className="row small mt8" style={{ gap: 2 }}>{[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} color="#e0a020" fill={i <= Math.round(p.rating) ? '#f2b630' : 'none'} />)}<b style={{ marginLeft: 6 }}>{p.rating}</b><span className="muted">({p.reviews} reviews)</span></div>
          {p.category === 'Apparel' && <><div className="bold small mt16" style={{ marginBottom: 8 }}>Select Size</div><div className="sizes">{['S', 'M', 'L', 'XL'].map(x => <button key={x} className={size === x ? 'on' : ''} onClick={() => setSize(x)}>{x}</button>)}</div></>}
          <div className="bold small mt16" style={{ marginBottom: 8 }}>Color Options</div>
          <div className="row">{[['Green', '#4f9a45'], ['Black', '#15200f'], ['Grey', '#a3ad9e']].map(([n, c]) => <button key={n} className={`swatch ${color === n ? 'on' : ''}`} style={{ background: c }} onClick={() => setColor(n)} aria-label={n} />)}</div>
          <div className="bold small mt16">Description</div>
          <p className="muted" style={{ lineHeight: 1.55, fontSize: 14.5, margin: '6px 0 0' }}>{p.desc}</p>
        </div>
      </div>
      <div className="footer">{p.stock === 0 ? <button className="btn" disabled>Out of Stock</button> : <button className="btn" onClick={add}>Add to Cart</button>}</div>
    </Screen>
  );
}

export function Wishlist() {
  const nav = useNavigate(); const { s, set, toast } = useStore();
  const items = s.wishlist.map(id => s.products.find(p => p.id === id)!).filter(Boolean);
  return (
    <Screen nav>
      <Header title={items.length ? 'My Wishlist' : 'Favorites'} plain />
      {items.length ? <>
        <div className="scroll"><div className="grid2">{items.map(p =>
          <div key={p.id} className="prod-card">
            <button onClick={() => nav(`/shop/product/${p.id}`)}><img src={IMG(p.img)} alt="" /></button>
            <div className="b"><b style={{ fontSize: 13.5, fontWeight: 500 }}>{p.name}</b>
              <div className="between mt8"><span className="price">{inr(p.price)}</span>
                <span className="row" style={{ gap: 8 }}><button aria-label="Remove" onClick={() => { set(st => ({ wishlist: st.wishlist.filter(x => x !== p.id) })); toast('Removed from wishlist'); }}><Trash2 size={16} color="var(--red)" /></button><Heart size={16} color="var(--red)" fill="var(--red)" /></span></div></div>
          </div>)}</div></div>
        <div className="footer"><button className="btn" onClick={() => nav('/shop/store')}>Browse Shop</button></div>
      </> : <Empty icon={<Heart size={40} />} title="No Favorites Yet" text="Save wellness rewards, companion challenges, and products here." action="Explore Rewards" onAction={() => nav('/shop/store')} />}
    </Screen>
  );
}

export function Cart() {
  const nav = useNavigate(); const { s, set } = useStore(); const [del, setDel] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 400); return () => clearTimeout(t); }, []);
  const lines = s.cart.map(c => ({ ...c, p: s.products.find(p => p.id === c.pid)! })).filter(l => l.p);
  const subtotal = lines.reduce((a, l) => a + l.p.price * l.qty, 0);
  const disc = s.useCoins && subtotal ? 100 : 0;
  const qty = (i: number, d: number) => set(st => ({ cart: st.cart.map((c, j) => j === i ? { ...c, qty: Math.max(1, c.qty + d) } : c) }));
  if (loading) return <Screen><Header title="My Cart" plain /><div className="scroll">{[0, 1].map(i => <div key={i} className="card flat row" style={{ marginBottom: 12 }}><div className="skel" style={{ width: 64, height: 64 }} /><div className="flex1 col gap8"><div className="skel" style={{ height: 14, width: '70%' }} /><div className="skel" style={{ height: 12, width: '30%' }} /></div></div>)}</div></Screen>;
  if (!lines.length) return <Screen nav><Header title="My Cart" plain /><Empty icon={<ShoppingBag size={40} />} title="Your Cart is Empty" text="Explore the rewards store and redeem your hard-earned companion points." action="Browse Store" onAction={() => nav('/shop/store')} /></Screen>;
  return (
    <Screen>
      <Header title={<span className="row" style={{ gap: 8 }}>My Cart <span className="pill solid" style={{ borderRadius: 10 }}>{lines.length}</span></span>} />
      <div className="scroll"><div className="list">{lines.map((l, i) =>
        <div key={i} className="card flat row" style={{ padding: 12 }}>
          <img src={IMG(l.p.img)} className="thumb" alt="" />
          <div className="flex1"><b style={{ fontSize: 14.5 }}>{l.p.name}</b>{l.size && <div className="small muted">Size {l.size} • {l.color}</div>}
            <div className="between mt8"><span className="price">{inr(l.p.price)}</span><span className="qty"><button onClick={() => qty(i, -1)} aria-label="Less"><Minus size={14} /></button>{l.qty}<button onClick={() => qty(i, 1)} aria-label="More"><Plus size={14} /></button></span></div></div>
          <button onClick={() => setDel(i)} aria-label="Remove"><Trash2 size={19} /></button>
        </div>)}</div></div>
      <div className="footer" style={{ background: '#fff', borderRadius: '24px 24px 0 0', boxShadow: '0 -4px 20px rgba(0,0,0,.05)', paddingTop: 20 }}>
        <div className="between"><b>Total</b><b className="green" style={{ fontSize: 20 }}>{inr(subtotal)}</b></div>
        <div className="row small" style={{ background: 'var(--green-50)', borderRadius: 8, padding: '10px 12px', gap: 8 }}><Wallet size={16} color="var(--green)" /><span className="muted">Your balance:</span><b>{num(s.balance)} Anbac Money</b></div>
        <div className="between small"><span className="row" style={{ gap: 8 }}><Toggle on={s.useCoins} onChange={v => set(() => ({ useCoins: v }))} /><span className="muted">FitCoins Discount</span></span><b className="green">-{inr(disc)}</b></div>
        <button className="btn" onClick={() => nav('/shop/checkout')}>Proceed to Checkout</button>
      </div>
      <Sheet open={del !== null} onClose={() => setDel(null)}>
        <h3 className="row" style={{ margin: '0 0 8px', gap: 10 }}><span className="ic red round"><Trash2 size={16} /></span>Delete Item?</h3>
        <p className="sub small">Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className="grid2 mt16"><button className="btn white" onClick={() => setDel(null)}>Cancel</button><button className="btn danger" onClick={() => { set(st => ({ cart: st.cart.filter((_, j) => j !== del) })); setDel(null); }}>Delete</button></div>
      </Sheet>
    </Screen>
  );
}

export function Checkout() {
  const nav = useNavigate(); const { s, set, online } = useStore(); const [addr, setAddr] = useState('123 Fitness St, Bangalore 560001'); const [edit, setEdit] = useState(false); const [placing, setPlacing] = useState(false);
  const lines = s.cart.map(c => ({ ...c, p: s.products.find(p => p.id === c.pid)! })).filter(l => l.p);
  const subtotal = lines.reduce((a, l) => a + l.p.price * l.qty, 0); const disc = s.useCoins ? 100 : 0; const total = subtotal - disc;
  useEffect(() => { if (!lines.length) nav('/shop/cart', { replace: true }); }, []);
  const place = () => {
    if (!online) { nav('/shop/order-failed', { replace: true }); return; }
    setPlacing(true);
    setTimeout(() => {
      const id = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const order: Order = { id, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), items: s.cart, total, status: 'Processing', discount: disc };
      set(st => ({ orders: [order, ...st.orders], cart: [], balance: st.balance - (disc ? 200 : 0), txns: disc ? [{ id: 'x' + Date.now(), title: 'FitCoins Discount Applied', date: 'Today, now', amount: -200, kind: 'spend' as const, icon: 'bag', period: 'today' as const }, ...st.txns] : st.txns }));
      nav(`/shop/order-placed/${id}`, { replace: true });
    }, 900);
  };
  return (
    <Screen>
      <Header title="Confirm Order" />
      <div className="scroll">
        <div className="label-caps">Delivery Address</div>
        <div className="card flat row"><div className="ic round"><MapPin size={16} /></div><div className="flex1"><b>{s.user.name}</b><div className="small muted">{addr}</div></div><button onClick={() => setEdit(true)} aria-label="Edit address"><Pencil size={18} /></button></div>
        <div className="label-caps">Order Summary</div>
        <div className="card flat">
          {lines.map((l, i) => <div key={i} className="between" style={{ padding: '6px 0' }}><span className="muted">{l.p.name}{l.qty > 1 ? ` × ${l.qty}` : ''}</span><b>{inr(l.p.price * l.qty)}</b></div>)}
          <div className="divider" />
          <div className="between" style={{ padding: '4px 0' }}><span className="muted">FitCoins Discount</span><b className="green">-{inr(disc)}</b></div>
          <div className="between" style={{ padding: '4px 0' }}><b>Total Cost</b><b className="green" style={{ fontSize: 20 }}>{inr(total)}</b></div>
        </div>
        <div className="card tint row small mt16"><Truck size={18} color="var(--green)" /><span><b>Estimated delivery:</b> <b className="green">5-7 business days</b></span></div>
      </div>
      <div className="footer"><button className="btn" disabled={placing} onClick={place}>{placing ? 'Placing order…' : 'Place Order'}</button><button className="btn ghost muted small" onClick={() => nav('/shop/payment-failed')}>Pay with card instead</button></div>
      <Sheet open={edit} onClose={() => setEdit(false)}>
        <h3 style={{ margin: '0 0 14px' }}>Delivery Address</h3>
        <Field label="Address" value={addr} onChange={e => setAddr(e.target.value)} />
        <button className="btn" onClick={() => setEdit(false)}>Save Address</button>
      </Sheet>
    </Screen>
  );
}

export function OrderPlaced() {
  const { id } = useParams(); const nav = useNavigate();
  return (
    <Screen className="white-bg">
      <div className="state">
        <div className="halo" style={{ width: 110, height: 110 }}><div style={{ width: 84, height: 84 }}><Check size={40} /></div></div>
        <h2 style={{ fontSize: 32, fontWeight: 800 }}>Order Placed!</h2>
        <p>Your order has been placed successfully. You will receive a confirmation shortly.</p>
        <div className="dashed green" style={{ padding: '10px 18px', fontWeight: 500 }}>Order ID: <b>#{id}</b></div>
      </div>
      <div className="footer"><button className="btn outline" onClick={() => nav(`/shop/orders/${id}`, { replace: true })}>Track Order</button><button className="btn" onClick={() => nav('/home', { replace: true })}>Back to Home</button></div>
    </Screen>
  );
}

export function OrderFailed() {
  const nav = useNavigate();
  return (
    <Screen>
      <Header title="Checkout Status" plain />
      <div className="state"><div className="soft-circle" style={{ background: 'var(--red-50)', color: 'var(--red)', width: 80, height: 80 }}><CircleX size={34} /></div><h2>Order Failed</h2><p>We could not process your order. Your FitCoins have not been deducted.</p></div>
      <div className="footer"><button className="btn" onClick={() => nav('/shop/checkout', { replace: true })}>Try Again</button><button className="btn ghost muted" style={{ textDecoration: 'underline' }} onClick={() => nav('/shop/cart', { replace: true })}>Return to Cart</button></div>
    </Screen>
  );
}

export function PaymentFailed() {
  const nav = useNavigate();
  return (
    <Screen>
      <Header title="Payment Screen" plain />
      <div className="state"><div className="soft-circle" style={{ background: 'var(--red-50)', color: 'var(--red)', width: 80, height: 80 }}><CreditCard size={34} /></div><h2>Payment Not Processed</h2><p>There was an issue processing your payment method. Please try a different payment option.</p></div>
      <div className="footer"><button className="btn" onClick={() => nav('/shop/checkout', { replace: true })}>Change Payment Method</button><button className="btn ghost muted" style={{ textDecoration: 'underline' }} onClick={() => nav('/shop/cart', { replace: true })}>Cancel Order</button></div>
    </Screen>
  );
}

const statusPill = (st: OrderStatus) => <span className={`pill ${st === 'Processing' || st === 'Pending' ? 'amber' : st === 'Shipped' ? 'blue' : st === 'Cancelled' ? 'red' : ''}`}>{st}</span>;
export { statusPill };

export function Orders() {
  const nav = useNavigate(); const { s } = useStore(); const [f, setF] = useState<'All' | 'Active' | 'Delivered' | 'Cancelled'>('All');
  const list = s.orders.filter(o => f === 'All' || (f === 'Active' ? ['Processing', 'Shipped', 'Pending'].includes(o.status) : o.status === f));
  return (
    <Screen nav>
      <Header title="My Orders" plain />
      <div style={{ padding: '0 20px 12px' }}><Chips items={['All', 'Active', 'Delivered', 'Cancelled'] as const} value={f} onChange={setF} /></div>
      <div className="scroll">
        {list.length ? <div className="list">{list.map(o =>
          <button key={o.id} className="card flat" style={{ textAlign: 'left' }} onClick={() => nav(`/shop/orders/${o.id}`)}>
            <div className="between" style={{ paddingBottom: 10, borderBottom: '1px solid var(--line)' }}><b>#{o.id}</b>{statusPill(o.status)}</div>
            <div className="between mt12"><div><div className="small muted">{o.date} • {o.items.reduce((a, i) => a + i.qty, 0)} items</div><b className="green">{inr(o.total)}</b></div><ChevronRight size={18} /></div>
          </button>)}</div> : <Empty icon={<ShoppingBag size={40} />} title="No orders here" text="Orders matching this filter will appear here." />}
      </div>
    </Screen>
  );
}

export function OrderDetail() {
  const { id } = useParams(); const nav = useNavigate(); const { s, set, toast } = useStore(); const o = s.orders.find(x => x.id === id); const [cancel, setCancel] = useState(false);
  if (!o) return <Screen><Header title="Order Detail" plain /><Empty icon={<ShoppingBag size={40} />} title="Order not found" text="We couldn't find this order." /></Screen>;
  const stages = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const idx = o.status === 'Delivered' ? 3 : o.status === 'Shipped' ? 2 : 1;
  return (
    <Screen>
      <Header title="Order Detail" plain />
      <div className="scroll">
        <b style={{ fontSize: 17 }}>Order #{o.id}</b><div className="small muted">Placed on {o.date}</div>
        <div className="label-caps">Status Timeline</div>
        {o.status === 'Cancelled' ? <div className="card soft red">This order was cancelled. FitCoins have been refunded.</div> :
          <div className="timeline">{stages.map((st, i) => <div key={st} className={`t ${i < idx ? '' : i === idx && o.status !== 'Delivered' ? 'pending' : i === idx ? '' : 'future'}`}>
            <div className="bold">{st}</div><div className="small muted">{i < idx || o.status === 'Delivered' ? o.date : i === idx ? 'In progress' : 'Pending'}</div></div>)}</div>}
        <div className="label-caps">Items</div>
        <div className="list">{o.items.map((it, i) => { const p = s.products.find(x => x.id === it.pid)!; return <div key={i} className="card flat row" style={{ padding: 12 }}><img src={IMG(p.img)} className="thumb sm" alt="" /><div className="flex1"><b>{p.name}</b><div className="small muted">{it.size ? `Size: ${it.size} • ` : ''}{it.color ? `Color: ${it.color}` : `Qty: ${it.qty}`}</div></div><b>{inr(p.price * it.qty)}</b></div>; })}</div>
        <div className="label-caps">Delivery Address</div>
        <div className="card flat"><b>{s.user.name}</b><div className="small muted">123 Fitness St, Bangalore 560001</div></div>
        {['Processing', 'Pending'].includes(o.status) && <button className="btn danger-outline mt16" onClick={() => setCancel(true)}>Cancel Order</button>}
        <p className="center muted mt16">Have issues? <button className="link" style={{ textDecoration: 'underline' }} onClick={() => nav('/settings/contact')}>Contact Support</button></p>
      </div>
      <Dialog open={cancel} onClose={() => setCancel(false)}>
        <h3 style={{ margin: '0 0 8px' }}>Cancel this order?</h3><p className="sub small">Any FitCoins used will be refunded to your wallet.</p>
        <div className="grid2 mt16"><button className="btn white" onClick={() => setCancel(false)}>Keep</button><button className="btn danger" onClick={() => { set(st => ({ orders: st.orders.map(x => x.id === o.id ? { ...x, status: 'Cancelled' } : x) })); setCancel(false); toast('Order cancelled'); }}>Cancel Order</button></div>
      </Dialog>
    </Screen>
  );
}
