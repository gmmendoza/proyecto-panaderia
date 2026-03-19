import { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  X,
  Tags,
  Croissant,
  Scale,
  Ticket,
  ChevronRight,
  CreditCard,
  Banknote,
  Edit2,
  Check,
  MessageSquare,
  Printer,
  CheckCircle,
  Package,
  Star,
  ShoppingBag,
  QrCode,
  RefreshCcw,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const PuntoDeVenta = ({ showToast }) => {
  const [products, setProducts] = useState([]);
  const [ventasHoy, setVentasHoy] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [lastSaleData, setLastSaleData] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, vts] = await Promise.all([
        api.productos.getAll(),
        api.ventas.getAll()
      ]);
      setProducts(prods);
      
      const todayStr = new Date().toLocaleDateString();
      const filteredVts = vts.filter(v => {
        const d = v.createdAt || v.fecha;
        return d && new Date(d).toLocaleDateString() === todayStr;
      }).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setVentasHoy(filteredVts);
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    if (paymentMethod === 'QR' && !showQR) {
        setShowQR(true);
        return;
    }

    try {
      const saleItems = cart.map(item => ({ 
        id: item.id, 
        nombre: item.nombre, 
        qty: item.cantidad, 
        precio: item.precio, 
        total: item.precio * item.cantidad 
      }));
      
      const resp = await api.ventas.create({
        total,
        metodoPago: paymentMethod,
        items: saleItems
      });

      setLastSaleData({
        id: resp.id || 'T-' + Math.floor(Math.random() * 10000),
        total,
        metodoPago: paymentMethod,
        items: saleItems,
        fecha: new Date().toLocaleString()
      });

      // Update Stock
      await Promise.all(cart.map(item => 
        api.productos.update(item.id, { stock: Math.max(0, (item.stock || 0) - item.cantidad) })
      ));

      setShowSuccess(true);
      setShowQR(false);
      setCart([]);
      loadData();
      if (showToast) showToast('Venta procesada con éxito');
    } catch (err) {
      if (showToast) showToast('Error al procesar venta', 'error');
    }
  };

  const handleAnular = async (sale) => {
    if (!window.confirm(`¿Está seguro de anular la venta #${sale.id.toString().slice(-4)} por $${sale.total}?`)) return;
    
    try {
        // 1. Delete sale
        await api.ventas.delete(sale.id);
        
        // 2. Restore Stock
        if (sale.items) {
            await Promise.all(sale.items.map(async (item) => {
                const p = products.find(prod => prod.id === item.id || prod.nombre === item.nombre);
                if (p) {
                    await api.productos.update(p.id, { stock: (p.stock || 0) + (item.qty || 1) });
                }
            }));
        }
        
        loadData();
        if (showToast) showToast('Venta anulada y stock restaurado', 'warning');
    } catch (err) {
        if (showToast) showToast('Error al anular venta', 'error');
    }
  };

  const categories = ['Todos', 'Panadería', 'Pastelería', 'Insumos', 'Cafetería'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || p.categoria === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: newQty };
      }
      return item;
    }).filter(item => item.cantidad > 0));
  };

  const total = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 250px)', minHeight: '600px' }}>
        
        {/* Catalog */}
        <div className="bakery-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 900 }}>Catálogo de Productos</h2>
             <div style={{ position: 'relative', width: '250px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                />
             </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{ 
                  padding: '6px 16px', borderRadius: '20px', border: '1.5px solid var(--border-light)',
                  background: activeCategory === cat ? 'var(--primary)' : 'white',
                  color: activeCategory === cat ? 'white' : 'var(--text-main)',
                  fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.25rem' }}>
              {loading ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>Cargando...</div>
              ) : filteredProducts.map(p => (
                <motion.div 
                   key={p.id}
                   whileHover={{ y: -5 }}
                   onClick={() => addToCart(p)}
                   className="bakery-card"
                   style={{ cursor: 'pointer', padding: '1rem', textAlign: 'center' }}
                >
                  <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: 'var(--bg-app)', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    {p.categoria === 'Pastelería' ? <Star size={20} /> : <Package size={20} />}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.8rem', marginBottom: '4px' }}>{p.nombre}</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1rem' }}>${p.precio}</div>
                  <div style={{ fontSize: '0.65rem', color: (p.stock || 0) < 10 ? 'var(--danger)' : 'var(--text-muted)' }}>Stock: {p.stock || 0}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart & History Panel */}
        <aside style={{ width: '420px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Cart Section */}
          <div className="bakery-card" style={{ flex: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1.2rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-app)' }}>
              <ShoppingCart size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 900 }}>Carrito de Compras</h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-light)' }}>
                  <ShoppingBag size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.8rem' }}>Sin productos</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-app)', paddingBottom: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>{item.nombre}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>${item.precio}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <button style={{ border: 'none', background: 'var(--bg-app)', padding: '4px', borderRadius: '4px' }} onClick={() => updateQuantity(item.id, -1)}><Minus size={12} /></button>
                         <span style={{ fontWeight: 900, fontSize: '0.85rem' }}>{item.cantidad}</span>
                         <button style={{ border: 'none', background: 'var(--bg-app)', padding: '4px', borderRadius: '4px' }} onClick={() => updateQuantity(item.id, 1)}><Plus size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: '1.2rem', background: 'white', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>MÉTODO DE PAGO</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '1.5rem' }}>
                 {[
                   { id: 'Efectivo', icon: Banknote },
                   { id: 'Transferencia', icon: CreditCard },
                   { id: 'QR', icon: QrCode }
                 ].map(m => (
                   <button 
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    style={{ 
                      padding: '8px', borderRadius: '10px', border: '1.5px solid ' + (paymentMethod === m.id ? 'var(--primary)' : 'var(--border-light)'),
                      background: paymentMethod === m.id ? 'var(--primary-light)' : 'white',
                      color: paymentMethod === m.id ? 'var(--primary-dark)' : 'var(--text-muted)',
                      fontSize: '0.65rem', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer'
                    }}
                   >
                     <m.icon size={16} /> {m.id}
                   </button>
                 ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem' }}>TOTAL A COBRAR</span>
                <span style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--primary-dark)' }}>${total.toLocaleString()}</span>
              </div>
              <button disabled={cart.length === 0} onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: '50px', fontSize: '1rem' }}>
                <CheckCircle size={20} /> {paymentMethod === 'QR' ? 'GENERAR QR' : 'FINALIZAR VENTA'}
              </button>
            </div>
          </div>

          {/* Recent Sales History */}
          <div className="bakery-card" style={{ flex: 1, padding: '1.2rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900 }}>Ventas de la Sesión</h4>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '10px' }}>
                    {ventasHoy.length} Tick.
                </div>
             </div>
             
             <div style={{ flex: 1, overflowY: 'auto' }}>
                {ventasHoy.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', paddingTop: '1rem' }}>No hay ventas registradas</div>
                ) : ventasHoy.map(v => (
                    <div key={v.id} style={{ padding: '10px', borderBottom: '1px solid var(--bg-app)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>Venta #{v.id.toString().slice(-4)}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{v.metodoPago} • {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontWeight: 900, fontSize: '0.85rem' }}>${v.total?.toLocaleString()}</div>
                            <button 
                                onClick={() => handleAnular(v)}
                                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                                title="Anular Venta"
                            >
                                <RefreshCcw size={14} />
                            </button>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </aside>
      </div>

      {/* QR Code Modal Simulation */}
      <AnimatePresence>
        {showQR && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bakery-card" style={{ width: '380px', padding: '2.5rem', textAlign: 'center', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0 }}>Pago Interoperable</h3>
                        <button onClick={() => setShowQR(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                    </div>
                    
                    <div style={{ background: 'var(--bg-app)', padding: '2rem', borderRadius: '20px', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <QrCode size={200} strokeWidth={1.5} color="var(--primary-dark)" />
                    </div>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>TOTAL A PAGAR</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-dark)' }}>${total.toLocaleString()}</div>
                    </div>
                    
                    <button className="btn btn-primary" onClick={handleCheckout} style={{ width: '100%', justifyContent: 'center', height: '50px' }}>
                        <Smartphone size={20} /> CONFIRMAR RECEPCIÓN PAGO
                    </button>
                 </motion.div>
            </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bakery-card" style={{ width: '350px', padding: '2rem', textAlign: 'center' }}>
              <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
              <h3>Venta Exitosa</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Transacción guardada correctamente.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button className="btn btn-primary" onClick={() => { setShowSuccess(false); imprimirTicket(); }}><Printer size={16} /> IMPRIMIR TICKET</button>
                <button className="btn btn-secondary" onClick={() => setShowSuccess(false)}>NUEVA VENTA</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PuntoDeVenta;
