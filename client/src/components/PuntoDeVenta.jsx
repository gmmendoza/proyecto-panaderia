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
  Package
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
      
      // Filter sales for today
      const todayStr = new Date().toLocaleDateString();
      const filteredVts = vts.filter(v => new Date(v.fecha).toLocaleDateString() === todayStr);
      setVentasHoy(filteredVts);
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Error al cargar datos del Terminal', 'error');
    } finally {
      setLoading(false);
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
        const newCant = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: newCant };
      }
      return item;
    }).filter(item => item.cantidad > 0));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const handleCharge = async () => {
    if (cart.length === 0) return;
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

      // Update stock
      await Promise.all(cart.map(item => 
        api.productos.update(item.id, { stock: Math.max(0, (item.stock || 0) - item.cantidad) })
      ));

      setShowSuccess(true);
      setCart([]);
      loadData();
      if (showToast) showToast('Venta procesada con éxito');
    } catch (err) {
      if (showToast) showToast('Error al procesar venta', 'error');
    }
  };

  // Renamed handleCharge to handleCheckout to match the button's onClick
  const handleCheckout = handleCharge;

  const imprimirTicket = () => {
    if (showToast) showToast('Iniciando impresión de ticket...', 'info');
    // Basic mock print
    setTimeout(() => { if (showToast) showToast('Ticket impreso'); }, 1000);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 250px)', minHeight: '600px' }}>

        {/* Left Panel: Catalog */}
        <div className="bakery-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 900 }}>Catálogo de Productos</h2>
             <div style={{ position: 'relative', width: '250px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  type="text"
                  placeholder="Buscar producto..."
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
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: '1.5px solid var(--border-light)',
                  background: activeCategory === cat ? 'var(--primary)' : 'white',
                  color: activeCategory === cat ? 'white' : 'var(--text-main)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
              {loading ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>Cargando catálogo...</div>
              ) : filteredProducts.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>No se encontraron productos</div>
              ) : filteredProducts.map(p => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -5 }}
                  onClick={() => addToCart(p)}
                  className="bakery-card"
                  style={{ cursor: 'pointer', padding: '1rem', textAlign: 'center', border: '1.5px solid var(--border-light)' }}
                >
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '12px', background: 'var(--bg-app)',
                    margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    {p.categoria === 'Pastelería' ? <Star size={24} /> : <Package size={24} />}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.1rem' }}>${p.precio}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 800 }}>MÁX: {p.stock} UN.</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Cart & Stats */}
        <aside style={{ width: '420px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Session Info */}
          <div className="bakery-card" style={{ padding: '1.5rem', background: 'var(--bg-sidebar)', color: 'white' }}>
             <h4 style={{ margin: 0, fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '1.2rem' }}>RESUMEN DE SESIÓN ACTUAL</h4>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                   <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>TICKETS</div>
                   <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{ventasHoy.length}</div>
                </div>
                <div>
                   <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>CAJA ACUM.</div>
                   <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>${ventasHoy.reduce((acc, v) => acc + v.total, 0).toLocaleString()}</div>
                </div>
             </div>
             <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Ticket Promedio:</span>
                <span style={{ fontWeight: 800, color: 'var(--accent)' }}>${ventasHoy.length ? (ventasHoy.reduce((acc, v) => acc + v.total, 0) / ventasHoy.length).toFixed(0) : 0}</span>
             </div>
          </div>

          <div className="bakery-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1.5px solid var(--border-light)' }}>
            <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1.5px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingCart size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 900 }}>Ticket en Curso</h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-light)' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Seleccione productos del catálogo para iniciar el cobro.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: '1px solid var(--bg-app)' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary-dark)' }}>{item.nombre.toUpperCase()}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>${item.precio} x unid.</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-app)', borderRadius: '8px', padding: '2px 6px' }}>
                          <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }} onClick={() => updateQuantity(item.id, -1)}><Minus size={12} /></button>
                          <span style={{ fontWeight: 900, fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                          <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }} onClick={() => updateQuantity(item.id, 1)}><Plus size={12} /></button>
                        </div>
                        <div style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--primary-dark)' }}>${(item.precio * item.cantidad).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--bg-app)', borderTop: '2px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>TOTAL NETO A COBRAR</span>
                <span style={{ fontWeight: 900, fontSize: '1.8rem', color: 'var(--primary-dark)' }}>${total.toLocaleString()}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }}>
                {['Efectivo', 'Tarjeta', 'Mercado Pago'].map(m => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    style={{
                      padding: '10px', borderRadius: '10px', border: '2px solid',
                      borderColor: paymentMethod === m ? 'var(--primary)' : 'var(--border-light)',
                      background: paymentMethod === m ? 'var(--primary-light)' : 'white',
                      color: paymentMethod === m ? 'var(--primary-dark)' : 'var(--text-muted)',
                      fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="btn btn-primary"
                style={{ width: '100%', height: '54px', fontSize: '0.9rem', justifyContent: 'center' }}
              >
                <CheckCircle2 size={20} /> FINALIZAR FACTURACIÓN
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bakery-card"
              style={{ width: '400px', padding: '3rem', textAlign: 'center' }}
            >
              <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1.5rem' }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Venta Exitosa</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>El stock ha sido actualizado correctamente.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button className="btn btn-primary" onClick={imprimirTicket}><Printer size={18} /> IMPRIMIR TICKET</button>
                <button className="btn btn-secondary" onClick={() => setShowSuccess(false)}>CERRAR</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PuntoDeVenta;
