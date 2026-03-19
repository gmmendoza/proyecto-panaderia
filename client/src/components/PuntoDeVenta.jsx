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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [lastSaleData, setLastSaleData] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.productos.getAll();
      setProducts(data);
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Error al cargar catálogo', 'error');
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
      loadProducts();
      if (showToast) showToast('Venta procesada con éxito');
    } catch (err) {
      if (showToast) showToast('Error al procesar venta', 'error');
    }
  };

  const imprimirTicket = () => {
    if (showToast) showToast('Iniciando impresión de ticket...', 'info');
    // Basic mock print
    setTimeout(() => { if (showToast) showToast('Ticket impreso'); }, 1000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
      {/* Left: Product Catalog */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Terminal de Ventas</h1>
           <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input 
                type="text" 
                placeholder="Buscar producto..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none' }}
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
                border: '1px solid var(--border-light)',
                background: activeCategory === cat ? 'var(--primary)' : 'white',
                color: activeCategory === cat ? 'white' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.85rem',
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
                style={{ cursor: 'pointer', padding: '1rem', textAlign: 'center', border: '1px solid var(--border-light)' }}
              >
                <div style={{ 
                  width: '60px', height: '60px', borderRadius: '12px', background: 'var(--bg-app)', 
                  margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  {p.categoria === 'Cafetería' ? <Ticket size={24} /> : <Package size={24} />}
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</div>
                <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.1rem' }}>${p.precio}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>STOCK: {p.stock} {p.unidad}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Cart side */}
      <div className="bakery-card" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingCart size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Ticket de Venta</h2>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
               <Ticket size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
               <p style={{ fontSize: '0.9rem' }}>Carrito vacío</p>
             </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {cart.map(item => (
                 <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--bg-app)' }}>
                    <div style={{ flex: 1 }}>
                       <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.nombre}</div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${item.precio} x unid.</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '2px' }}>
                          <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex' }} onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }}><Minus size={14} /></button>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                          <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex' }} onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}><Plus size={14} /></button>
                       </div>
                       <div style={{ fontWeight: 800, fontSize: '1rem', minWidth: '60px', textAlign: 'right' }}>${(item.precio * item.cantidad).toLocaleString()}</div>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--bg-app)', borderTop: '1px solid var(--border-light)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL A COBRAR</span>
              <span style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--primary)' }}>${total.toLocaleString()}</span>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <button 
                onClick={() => setPaymentMethod('Efectivo')}
                style={{ 
                  padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', 
                  background: paymentMethod === 'Efectivo' ? 'var(--text-main)' : 'white',
                  color: paymentMethod === 'Efectivo' ? 'white' : 'var(--text-main)',
                  fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <Banknote size={16} /> EFECTIVO
              </button>
              <button 
                onClick={() => setPaymentMethod('Tarjeta')}
                style={{ 
                  padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', 
                  background: paymentMethod === 'Tarjeta' ? 'var(--text-main)' : 'white',
                  color: paymentMethod === 'Tarjeta' ? 'white' : 'var(--text-main)',
                  fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <CreditCard size={16} /> TARJETA
              </button>
           </div>

           <button 
             disabled={cart.length === 0}
             onClick={handleCharge}
             className="btn btn-primary" 
             style={{ width: '100%', height: '50px', fontSize: '1rem', fontWeight: 900 }}
           >
             CONFIRMAR COBRO
           </button>
        </div>
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

