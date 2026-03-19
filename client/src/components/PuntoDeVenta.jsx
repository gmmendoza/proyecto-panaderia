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
  Smartphone,
  Percent,
  Calculator
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
  const [globalDiscount, setGlobalDiscount] = useState(0);

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

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, cantidad: item.cantidad + (item.unidad === 'kg' ? 0.5 : 1) } : item
        );
      }
      return [...prev, { ...product, cantidad: product.unidad === 'kg' ? 0.5 : 1, discount: 0 }];
    });
  };

  const updateQuantity = (id, newQty) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, cantidad: Math.max(0, newQty) };
      }
      return item;
    }).filter(item => item.cantidad > 0));
  };

  const updateItemDiscount = (id, discount) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, discount: Math.min(100, Math.max(0, discount)) };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => {
    const itemTotal = item.precio * item.cantidad;
    const itemDiscount = itemTotal * (item.discount / 100);
    return acc + (itemTotal - itemDiscount);
  }, 0);

  const totalDiscountAmount = subtotal * (globalDiscount / 100);
  const total = subtotal - totalDiscountAmount;

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
        discount: item.discount,
        total: (item.precio * item.cantidad) * (1 - item.discount / 100)
      }));
      
      const resp = await api.ventas.create({
        subtotal,
        descuentoGlobal: globalDiscount,
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
      setGlobalDiscount(0);
      loadData();
      if (showToast) showToast('Venta procesada con éxito');
    } catch (err) {
      if (showToast) showToast('Error al procesar venta', 'error');
    }
  };

  const handleAnular = async (sale) => {
    if (!window.confirm(`¿Está seguro de anular la venta #${sale.id.toString().slice(-4)}?`)) return;
    
    try {
        await api.ventas.delete(sale.id);
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

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 250px)', minHeight: '650px' }}>
        
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

          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.25rem' }}>
              {loading ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>Cargando...</div>
              ) : filteredProducts.map(p => (
                <motion.div 
                   key={p.id}
                   whileHover={{ y: -5 }}
                   onClick={() => addToCart(p)}
                   className="bakery-card"
                   style={{ cursor: 'pointer', padding: '1rem', textAlign: 'center', position: 'relative' }}
                >
                  <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--bg-app)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                    {p.unidad.toUpperCase()}
                  </div>
                  <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: 'var(--bg-app)', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    {p.unidad === 'kg' ? <Scale size={20} /> : (p.categoria === 'Pastelería' ? <Star size={20} /> : <Package size={20} />)}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.8rem', marginBottom: '4px' }}>{p.nombre}</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1rem' }}>${p.precio}</div>
                  <div style={{ fontSize: '0.6rem', color: (p.stock || 0) < 10 ? 'var(--danger)' : 'var(--text-muted)' }}>Stock: {p.stock || 0} {p.unidad}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Professional Cart Column */}
        <aside style={{ width: '450px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="bakery-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '2px solid var(--primary-light)' }}>
            <div style={{ padding: '1.2rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-app)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '8px' }}><ShoppingCart size={18} /></div>
                <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 900 }}>Detalle de Venta</h3>
              </div>
              <button onClick={() => setCart([])} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700 }}>VACIAR</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-light)' }}>
                  <ShoppingCart size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>El carrito está vacío</p>
                  <p style={{ fontSize: '0.75rem' }}>Seleccione productos del catálogo</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cart.map(item => (
                    <motion.div layout key={item.id} style={{ padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{item.nombre}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Precio unitario: ${item.precio}</div>
                        </div>
                        <button onClick={() => updateQuantity(item.id, 0)} style={{ color: 'var(--text-light)', border: 'none', background: 'none', cursor: 'pointer' }}><X size={14} /></button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-app)', padding: '4px 10px', borderRadius: '8px' }}>
                           {item.unidad === 'kg' ? (
                             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                               <input 
                                type="number" 
                                step="0.05"
                                value={item.cantidad} 
                                onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
                                style={{ width: '60px', border: 'none', background: 'transparent', fontWeight: 900, fontSize: '0.85rem', textAlign: 'center' }} 
                               />
                               <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--primary)' }}>KG</span>
                             </div>
                           ) : (
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                               <button style={qtyBtnStyle} onClick={() => updateQuantity(item.id, item.cantidad - 1)}><Minus size={12} /></button>
                               <span style={{ fontWeight: 900, fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                               <button style={qtyBtnStyle} onClick={() => updateQuantity(item.id, item.cantidad + 1)}><Plus size={12} /></button>
                             </div>
                           )}
                         </div>
                         
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                               <Percent size={12} color="var(--success)" />
                               <input 
                                 type="number" 
                                 value={item.discount} 
                                 onChange={(e) => updateItemDiscount(item.id, parseInt(e.target.value))}
                                 style={{ width: '35px', border: 'none', borderBottom: '1px dashed var(--success)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--success)', background: 'transparent' }}
                                />
                            </div>
                            <div style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--primary-dark)' }}>
                               ${((item.precio * item.cantidad) * (1 - item.discount / 100)).toLocaleString()}
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Billing Summary */}
            <div style={{ padding: '1.5rem', background: 'var(--bg-app)', borderTop: '2px dashed var(--border-light)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    <span>SUBTOTAL</span>
                    <span>${subtotal.toLocaleString()}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--success)', fontWeight: 800 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>DESC. GLOBAL (%)</span>
                        <input 
                            type="number" 
                            value={globalDiscount}
                            onChange={(e) => setGlobalDiscount(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                            style={{ width: '45px', border: '1px solid var(--success)', borderRadius: '4px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 900, background: 'white' }}
                        />
                    </div>
                    <span>-${totalDiscountAmount.toLocaleString()}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 950, color: 'var(--primary-dark)', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <span>TOTAL</span>
                    <span>${total.toLocaleString()}</span>
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
                 {['Efectivo', 'Transferencia', 'QR'].map(m => (
                   <button 
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    style={{ 
                      padding: '10px', borderRadius: '10px', border: '1.5px solid ' + (paymentMethod === m ? 'var(--primary)' : 'var(--border-light)'),
                      background: paymentMethod === m ? 'var(--primary)' : 'white',
                      color: paymentMethod === m ? 'white' : 'var(--text-muted)',
                      fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer'
                    }}
                   >
                     {m.toUpperCase()}
                   </button>
                 ))}
              </div>

              <button disabled={cart.length === 0} onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: '54px', fontSize: '1.1rem', boxShadow: '0 4px 12px var(--shadow)' }}>
                {paymentMethod === 'QR' ? <QrCode size={20} /> : <CheckCircle size={20} />} 
                {paymentMethod === 'QR' ? 'GENERAR QR' : 'COBRAR OPERACIÓN'}
              </button>
            </div>
          </div>

          {/* Session Feed */}
          <div className="bakery-card" style={{ height: '200px', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
             <h4 style={{ margin: '0 0 10px 0', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)' }}>ÚLTIMOS TICKETS</h4>
             <div style={{ flex: 1, overflowY: 'auto' }}>
                {ventasHoy.map(v => (
                  <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--bg-app)', alignItems: 'center' }}>
                     <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>#{v.id.toString().slice(-4)} • {v.metodoPago}</div>
                     <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                       <div style={{ fontWeight: 900, fontSize: '0.8rem' }}>${v.total?.toLocaleString()}</div>
                       <button onClick={() => handleAnular(v)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}><RefreshCcw size={12} /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </aside>
      </div>

      {/* QR & Success Modals */}
      <AnimatePresence>
        {showQR && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bakery-card" style={{ width: '400px', padding: '3rem', textAlign: 'center', background: 'white' }}>
                    <QrCode size={240} style={{ margin: '0 auto 2rem', color: 'var(--primary-dark)' }} />
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '5px' }}>TOTAL A COBRAR</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--primary)', marginBottom: '2rem' }}>${total.toLocaleString()}</div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowQR(false)}>CANCELAR</button>
                       <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleCheckout}>CONFIRMAR PAGO</button>
                    </div>
                 </motion.div>
            </div>
        )}

        {showSuccess && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bakery-card" style={{ width: '380px', padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ background: 'var(--success-light)', color: 'var(--success)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>¡Venta Exitosa!</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Ticket #${lastSaleData?.id.slice(-4)} registrado correctamente.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button className="btn btn-primary" onClick={() => setShowSuccess(false)} style={{ height: '48px' }}>NUEVA VENTA</button>
                <button className="btn btn-secondary" onClick={() => { setShowSuccess(false); window.print(); }}>IMPRIMIR COMPROBANTE</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const qtyBtnStyle = {
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white',
  border: '1px solid var(--border-light)',
  borderRadius: '6px',
  cursor: 'pointer',
  color: 'var(--text-main)'
};

export default PuntoDeVenta;
