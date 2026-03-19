import { useState, useEffect } from 'react';
import {
  Search, ShoppingCart, Plus, Minus, X,
  Scale, CreditCard, Banknote, Check,
  Printer, CheckCircle, Package, Star,
  ShoppingBag, QrCode, RefreshCcw,
  Smartphone, Percent, AlertTriangle,
  ChevronDown, ChevronUp, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────
const fmt = (n) => (isNaN(n) ? '0' : Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

const PAYMENT_METHODS = [
  { id: 'Efectivo',      icon: Banknote,    label: 'Efectivo'      },
  { id: 'Transferencia', icon: CreditCard,  label: 'Transferencia' },
  { id: 'QR',            icon: QrCode,      label: 'QR / Billetera'},
];

const CATEGORIES = ['Todos', 'Panadería', 'Pastelería', 'Insumos', 'Cafetería'];

// ────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────
const PuntoDeVenta = ({ showToast }) => {
  const [products,       setProducts]       = useState([]);
  const [ventasHoy,      setVentasHoy]      = useState([]);
  const [searchTerm,     setSearchTerm]     = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cart,           setCart]           = useState([]);
  const [globalDiscount, setGlobalDiscount] = useState('');
  const [paymentMethod,  setPaymentMethod]  = useState('Efectivo');
  const [loading,        setLoading]        = useState(true);
  const [showQR,         setShowQR]         = useState(false);
  const [showSuccess,    setShowSuccess]    = useState(false);
  const [lastSaleData,   setLastSaleData]   = useState(null);

  useEffect(() => { loadData(); }, []);

  // ── Data ────────────────────────────────────
  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, vts] = await Promise.all([api.productos.getAll(), api.ventas.getAll()]);
      setProducts(prods);
      const today = new Date().toLocaleDateString();
      setVentasHoy(
        vts
          .filter(v => { const d = v.createdAt || v.fecha; return d && new Date(d).toLocaleDateString() === today; })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (e) {
      console.error(e);
      showToast?.('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Cart actions ─────────────────────────────
  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      const step  = product.unidad === 'kg' ? 0.5 : 1;
      if (found) return prev.map(i => i.id === product.id ? { ...i, cantidad: +(i.cantidad + step).toFixed(3) } : i);
      return [...prev, { ...product, cantidad: step, discount: 0 }];
    });
  };

  const setQty = (id, raw) => {
    const qty = parseFloat(raw);
    if (isNaN(qty) || qty < 0) return;
    setCart(prev => prev.map(i => i.id === id ? { ...i, cantidad: qty } : i).filter(i => i.cantidad > 0));
  };

  const setDisc = (id, raw) => {
    const d = Math.min(100, Math.max(0, parseInt(raw) || 0));
    setCart(prev => prev.map(i => i.id === id ? { ...i, discount: d } : i));
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

  // ── Totals ────────────────────────────────────
  const lineTotal  = (item) => item.precio * item.cantidad * (1 - (item.discount || 0) / 100);
  const subtotal   = cart.reduce((s, i) => s + lineTotal(i), 0);
  const gdPct      = Math.min(100, Math.max(0, parseInt(globalDiscount) || 0));
  const gdAmount   = subtotal * gdPct / 100;
  const total      = subtotal - gdAmount;
  const totalItems = cart.reduce((s, i) => s + i.cantidad, 0);

  // ── Checkout ─────────────────────────────────
  const handleCheckout = async () => {
    if (!cart.length) return;
    if (paymentMethod === 'QR' && !showQR) { setShowQR(true); return; }
    try {
      const items = cart.map(i => ({
        id: i.id, nombre: i.nombre, qty: i.cantidad,
        precio: i.precio, discount: i.discount, total: lineTotal(i),
        unidad: i.unidad
      }));
      const resp = await api.ventas.create({ subtotal, descuentoGlobal: gdPct, total, metodoPago: paymentMethod, items });
      setLastSaleData({ id: resp.id || ('T-' + Math.floor(Math.random() * 9999)), total, metodoPago: paymentMethod, items, fecha: new Date().toLocaleString() });
      await Promise.all(cart.map(i => api.productos.update(i.id, { stock: Math.max(0, (i.stock || 0) - i.cantidad) })));
      setCart([]); setGlobalDiscount(''); setShowQR(false); setShowSuccess(true);
      loadData();
      showToast?.('Venta procesada con éxito');
    } catch { showToast?.('Error al procesar venta', 'error'); }
  };

  const handleAnular = async (sale) => {
    if (!window.confirm(`¿Anular venta #${String(sale.id).slice(-4)} por $${fmt(sale.total)}?`)) return;
    try {
      await api.ventas.delete(sale.id);
      if (sale.items) {
        await Promise.all(sale.items.map(async it => {
          const p = products.find(pr => pr.id === it.id || pr.nombre === it.nombre);
          if (p) await api.productos.update(p.id, { stock: (p.stock || 0) + (it.qty || 1) });
        }));
      }
      loadData();
      showToast?.('Venta anulada y stock restaurado', 'warning');
    } catch { showToast?.('Error al anular', 'error'); }
  };

  const filteredProducts = products.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeCategory === 'Todos' || p.categoria === activeCategory)
  );

  // ── Render ────────────────────────────────────
  return (
    <div className="fade-in" style={{ display: 'flex', gap: '1.75rem', height: 'calc(100vh - 240px)', minHeight: 660 }}>

      {/* ═══ LEFT: Product Catalog ═══ */}
      <div className="bakery-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Catálogo</h2>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar producto..."
              style={{ paddingLeft: '2.2rem', padding: '0.55rem 0.75rem 0.55rem 2.2rem', borderRadius: 8, border: '1px solid var(--border-light)', fontSize: '0.82rem', width: 220 }}
            />
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', overflowX: 'auto', paddingBottom: 3 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '5px 14px', borderRadius: 20, border: `1.5px solid ${activeCategory === cat ? 'var(--primary)' : 'var(--border-light)'}`,
              background: activeCategory === cat ? 'var(--primary)' : 'white',
              color: activeCategory === cat ? 'white' : 'var(--text-main)',
              fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
            }}>
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>Cargando catálogo...</div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>Sin resultados</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: '1rem' }}>
              {filteredProducts.map(p => {
                const low = (p.stock || 0) < 5;
                return (
                  <motion.div
                    key={p.id}
                    whileHover={{ y: -4, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => addToCart(p)}
                    className="bakery-card"
                    style={{ cursor: 'pointer', padding: '0.9rem', textAlign: 'center', position: 'relative', userSelect: 'none' }}
                  >
                    {/* Unit badge */}
                    <div style={{ position: 'absolute', top: 7, right: 7, background: 'var(--primary-light)', color: 'var(--primary)', padding: '1px 7px', borderRadius: 8, fontSize: '0.55rem', fontWeight: 900 }}>
                      {(p.unidad || 'un').toUpperCase()}
                    </div>
                    {/* Icon */}
                    <div style={{ width: 46, height: 46, borderRadius: 10, background: 'var(--bg-app)', margin: '0 auto 0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: low ? 'var(--danger)' : 'var(--primary)' }}>
                      {p.unidad === 'kg' ? <Scale size={20} /> : p.categoria === 'Pastelería' ? <Star size={20} /> : <Package size={20} />}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.78rem', marginBottom: 3, lineHeight: 1.25 }}>{p.nombre}</div>
                    <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.95rem' }}>${fmt(p.precio)}</div>
                    <div style={{ fontSize: '0.6rem', marginTop: 3, color: low ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 700 }}>
                      {low && <AlertTriangle size={9} style={{ marginRight: 2 }} />}
                      Stock: {p.stock ?? 0} {p.unidad}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ═══ RIGHT: Cart + Summary + Tickets ═══ */}
      <aside style={{ width: 480, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* ── Cart Card ── */}
        <div className="bakery-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Cart Header */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-sidebar)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px 16px 0 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShoppingCart size={18} />
              <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>Detalle de Venta</span>
              {cart.length > 0 && (
                <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900 }}>
                  {cart.length}
                </span>
              )}
            </div>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', borderRadius: 6 }}>
                VACIAR
              </button>
            )}
          </div>

          {/* Cart Table Header — only visible when cart has items */}
          {cart.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 60px 50px 80px 28px', gap: 4, padding: '8px 1rem', background: 'var(--bg-app)', fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-light)' }}>
              <span>PRODUCTO</span>
              <span style={{ textAlign: 'center' }}>CANT / PESO</span>
              <span style={{ textAlign: 'center' }}>PRECIO</span>
              <span style={{ textAlign: 'center' }}>DESC%</span>
              <span style={{ textAlign: 'right' }}>SUBTOTAL</span>
              <span />
            </div>
          )}

          {/* Cart Items */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-light)', gap: 12 }}>
                <ShoppingBag size={52} style={{ opacity: 0.12 }} />
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>El carrito está vacío</div>
                <div style={{ fontSize: '0.72rem' }}>Haz clic en un producto para agregarlo</div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {cart.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 90px 60px 50px 80px 28px',
                      gap: 4,
                      alignItems: 'center',
                      padding: '10px 1rem',
                      borderBottom: '1px solid var(--bg-app)',
                      background: idx % 2 === 0 ? 'white' : '#fafafa',
                    }}
                  >
                    {/* Name + unit tag */}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.78rem', lineHeight: 1.2 }}>{item.nombre}</div>
                      <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '1px 5px', borderRadius: 4 }}>
                        {(item.unidad || 'un').toUpperCase()}
                      </span>
                    </div>

                    {/* Quantity / Weight */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      {item.unidad === 'kg' ? (
                        <input
                          type="number"
                          step="0.05"
                          min="0"
                          value={item.cantidad}
                          onChange={e => setQty(item.id, e.target.value)}
                          style={{ width: 64, textAlign: 'center', border: '1px solid var(--border-light)', borderRadius: 6, padding: '3px 4px', fontSize: '0.78rem', fontWeight: 800 }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <button onClick={() => setQty(item.id, item.cantidad - 1)} style={qBtnSt}><Minus size={10} /></button>
                          <span style={{ minWidth: 22, textAlign: 'center', fontWeight: 900, fontSize: '0.82rem' }}>{item.cantidad}</span>
                          <button onClick={() => setQty(item.id, item.cantidad + 1)} style={qBtnSt}><Plus size={10} /></button>
                        </div>
                      )}
                    </div>

                    {/* Unit price */}
                    <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      ${fmt(item.precio)}
                    </div>

                    {/* Discount % */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={e => setDisc(item.id, e.target.value)}
                        style={{ width: 38, textAlign: 'center', border: '1px dashed var(--success)', borderRadius: 5, padding: '3px 2px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--success)', background: 'transparent' }}
                      />
                    </div>

                    {/* Line total */}
                    <div style={{ textAlign: 'right', fontWeight: 900, fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                      ${fmt(lineTotal(item))}
                    </div>

                    {/* Remove */}
                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}>
                      <X size={13} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* ── Billing Summary ── */}
          <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-app)', borderTop: '2px dashed var(--border-light)' }}>

            {/* Subtotal + global discount row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SUBTOTAL ({cart.length} ítem{cart.length !== 1 ? 's' : ''})</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>${fmt(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Percent size={12} color="var(--success)" />
                <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700 }}>DESCUENTO GLOBAL</span>
                <input
                  type="number"
                  value={globalDiscount}
                  onChange={e => setGlobalDiscount(e.target.value)}
                  placeholder="0"
                  style={{ width: 42, border: '1px solid var(--success)', borderRadius: 5, textAlign: 'center', fontSize: '0.72rem', fontWeight: 900, padding: '2px 4px', color: 'var(--success)' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700 }}>%</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 800 }}>-${fmt(gdAmount)}</span>
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-sidebar)', borderRadius: 12, marginBottom: 12, color: 'white' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', opacity: 0.8 }}>TOTAL A COBRAR</span>
              <span style={{ fontWeight: 900, fontSize: '1.4rem' }}>${fmt(total)}</span>
            </div>

            {/* Payment selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 10 }}>
              {PAYMENT_METHODS.map(m => (
                <button key={m.id} onClick={() => setPaymentMethod(m.id)} style={{
                  padding: '8px 4px', borderRadius: 10,
                  border: `2px solid ${paymentMethod === m.id ? 'var(--primary)' : 'var(--border-light)'}`,
                  background: paymentMethod === m.id ? 'var(--primary)' : 'white',
                  color: paymentMethod === m.id ? 'white' : 'var(--text-muted)',
                  fontSize: '0.62rem', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3
                }}>
                  <m.icon size={15} />
                  {m.label}
                </button>
              ))}
            </div>

            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: 52, fontSize: '1rem', fontWeight: 900, boxShadow: '0 4px 14px rgba(var(--primary-rgb),0.35)', letterSpacing: '0.04em', borderRadius: 12, opacity: cart.length === 0 ? 0.5 : 1 }}
            >
              {paymentMethod === 'QR' ? <QrCode size={20} /> : <CheckCircle size={20} />}
              {paymentMethod === 'QR' ? 'GENERAR QR' : 'FINALIZAR VENTA'}
            </button>
          </div>
        </div>

        {/* ── Session Tickets panel ── */}
        <div className="bakery-card" style={{ padding: '0.9rem', maxHeight: 190 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ margin: 0, fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)' }}>OPERACIONES DEL TURNO</h4>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: 10 }}>
              ${fmt(ventasHoy.reduce((s, v) => s + (v.total || 0), 0))} hoy
            </span>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 130 }}>
            {ventasHoy.length === 0 ? (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '1rem 0', textAlign: 'center' }}>Sin ventas registradas en este turno</div>
            ) : ventasHoy.map(v => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--bg-app)' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>#{String(v.id).slice(-4)}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: 6 }}>{v.metodoPago}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 900, fontSize: '0.78rem' }}>${fmt(v.total)}</span>
                  <button onClick={() => handleAnular(v)} title="Anular venta" style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 2, display: 'flex' }}>
                    <RefreshCcw size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ═══ MODALS ═══ */}
      <AnimatePresence>
        {showQR && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bakery-card" style={{ width: 400, padding: '3rem', textAlign: 'center' }}>
              <button onClick={() => setShowQR(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.1em' }}>ESCANEAR PARA PAGAR</div>
              <div style={{ background: '#f8f4f0', borderRadius: 16, padding: '1.5rem', display: 'inline-block', marginBottom: '1.5rem' }}>
                <QrCode size={200} strokeWidth={1.4} color="var(--primary-dark)" />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Total a pagar</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--primary)', marginBottom: '2rem' }}>${fmt(total)}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowQR(false)}>CANCELAR</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleCheckout}>
                  <Smartphone size={16} /> CONFIRMAR PAGO
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showSuccess && lastSaleData && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bakery-card" style={{ width: 420, padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle size={32} />
              </div>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem' }}>¡Venta Completada!</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                Ticket <strong>#{String(lastSaleData.id).slice(-4)}</strong> • {lastSaleData.metodoPago} • ${fmt(lastSaleData.total)}
              </p>

              {/* Mini item list */}
              <div style={{ background: 'var(--bg-app)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', textAlign: 'left', maxHeight: 160, overflowY: 'auto' }}>
                {lastSaleData.items.map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '3px 0', borderBottom: i < lastSaleData.items.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <span style={{ fontWeight: 700 }}>{it.nombre} × {it.qty}</span>
                    <span style={{ fontWeight: 800 }}>${fmt(it.total)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn btn-primary" onClick={() => setShowSuccess(false)} style={{ height: 48 }}>NUEVA VENTA</button>
                <button className="btn btn-secondary" onClick={() => { setShowSuccess(false); window.print(); }}>IMPRIMIR COMPROBANTE</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Quantity button style
const qBtnSt = {
  width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'white', border: '1px solid var(--border-light)', borderRadius: 5, cursor: 'pointer', color: 'var(--text-main)', padding: 0
};

export default PuntoDeVenta;
