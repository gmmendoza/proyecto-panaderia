import { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  X,
  Tags,
  Coffee,
  Croissant,
  Scale,
  Ticket,
  ChevronRight,
  User,
  CreditCard,
  Banknote,
  Edit2,
  Check,
  MessageSquare,
  Printer,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { api } from '../services/api';

const PuntoDeVenta = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editType, setEditType] = useState(null); // 'price' or 'qty'
  const [editValue, setEditValue] = useState('');
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
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'Todos', label: 'Todo', icon: Tags },
    { id: 'Panadería', label: 'Panes', icon: Croissant },
    { id: 'Pastelería', label: 'Pasteles', icon: Croissant },
    { id: 'Cafetería', label: 'Café', icon: Coffee },
    { id: 'A Peso', label: 'Por Peso', icon: Scale },
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || 
                           (activeCategory === 'A Peso' ? p.porPeso : p.categoria === activeCategory);
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, cantidad: item.cantidad + (item.porPeso ? 0.25 : 1) } : item
        );
      }
      return [...prev, { ...product, cantidad: product.porPeso ? 0.25 : 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newCant = Math.max(item.porPeso ? 0.05 : 1, item.cantidad + delta);
        return { ...item, cantidad: parseFloat(newCant.toFixed(2)) };
      }
      return item;
    }));
  };

  const handleEditClick = (item, type) => {
    setEditingItemId(item.id);
    setEditType(type);
    setEditValue(type === 'price' ? item.precio.toString() : item.cantidad.toString());
  };

  const saveEdit = () => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val >= 0) {
      setCart(prev => prev.map(item => {
        if (item.id === editingItemId) {
          return editType === 'price' ? { ...item, precio: val } : { ...item, cantidad: val };
        }
        return item;
      }));
    }
    setEditingItemId(null);
    setEditType(null);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const total = subtotal;

  const handleCharge = async () => {
    if (cart.length === 0) return;
    try {
      const saleItems = cart.map(item => ({ id: item.id, nombre: item.nombre, qty: item.cantidad, precio: item.precio, total: item.precio * item.cantidad }));
      
      // Registrar venta
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

      // Descontar stock (en paralelo)
      await Promise.all(cart.map(item => 
        api.productos.update(item.id, { stock: Math.max(0, (item.stock || 0) - item.cantidad) })
      ));

      setShowSuccess(true);
      setCart([]);
      loadProducts(); // Recargar productos para reflejar nuevo stock
    } catch (err) {
      alert('Error al procesar la venta');
    }
  };

  const imprimirTicket = () => {
    if (!lastSaleData) return;
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>Ticket #2024</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 10px; color: #000; max-width: 250px; margin: 0 auto; line-height: 1.2; font-size: 12px; }
            .center { text-align: center; }
            .border { border-bottom: 1px dashed #000; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="center">
            <h3>EL AROMO</h3>
            <p>Panadería & Pastelería</p>
            <p>Ticket: ${lastSaleData.id}</p>
            <p>${lastSaleData.fecha}</p>
          </div>
          <div class="border"></div>
          ${lastSaleData.items.map(item => `
            <div class="row">
              <div style="flex: 1;">${item.nombre}</div>
              <div style="width: 40px; text-align: right;">v${item.qty}</div>
              <div style="width: 60px; text-align: right;">$${item.total.toLocaleString()}</div>
            </div>
          `).join('')}
          <div class="border"></div>
          <div class="row bold" style="font-size: 14px;">
            <span>TOTAL</span>
            <span>$${lastSaleData.total.toLocaleString()}</span>
          </div>
          <p class="center" style="margin-top: 10px;">Metodo: ${lastSaleData.metodoPago}</p>
          <div class="center" style="margin-top: 15px;">¡Gracias por su visita!</div>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  const shareWhatsApp = () => {
    if (!lastSaleData) return;
    const text = `Gracias por tu compra en El Aromo!\nTicket #${lastSaleData.id}\nImporte: $${lastSaleData.total.toLocaleString()}\nMetodo: ${lastSaleData.metodoPago}\n¡Que lo disfrutes!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="pos-maestro-container">
      <div className="pos-main">
        <header className="pos-header">
          <div className="pos-title">
            <h1 className="serif" style={{ fontSize: '3rem', color: 'var(--text-main)', margin: 0 }}>Terminal de Venta</h1>
            <p className="page-subtitle" style={{ margin: '0.5rem 0' }}>Sabor artesanal, gestión profesional.</p>
          </div>
          <div className="pos-search-wrapper glass" style={{ border: '1px solid var(--primary)', width: '400px' }}>
            <Search size={22} color="var(--primary)" />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: '1.1rem' }}
            />
          </div>
        </header>

        <nav className="pos-categories" style={{ marginBottom: '2rem' }}>
          {categories.map(cat => (
            <motion.button 
              key={cat.id} 
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`pos-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              style={{ padding: '12px 24px', borderRadius: '16px' }}
            >
              <cat.icon size={20} />
              {cat.label}
            </motion.button>
          ))}
        </nav>

        <div className="pos-grid-container">
          <div className="pos-products-grid">
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Cargando catálogo...</div>
            ) : (
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <motion.div 
                    key={product.id} 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -10 }}
                    className="bakery-card glass"
                    onClick={() => addToCart(product)}
                    style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}
                  >
                    <div style={{ height: '140px', position: 'relative', overflow: 'hidden' }}>
                      <img src={product.img || 'prod_pan.png'} alt={product.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {product.porPeso && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900 }}>POR PESO</div>
                      )}
                      {product.stock <= 5 && (
                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#E25E3E', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900 }}>BAJO STOCK</div>
                      )}
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{product.categoria}</span>
                      <h3 style={{ fontSize: '1.1rem', margin: '4px 0 10px 0' }}>{product.nombre}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="serif" style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>${product.precio}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ {product.unidad}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      <aside className="pos-sidebar">
        <div className="cart-surface glass" style={{ borderRadius: 'var(--radius-lg)', background: 'white' }}>
          <div className="cart-header" style={{ borderBottomColor: 'var(--primary-light)' }}>
            <div className="header-top">
              <div className="cart-icon-bg" style={{ background: 'var(--primary)', color: 'white' }}>
                <ShoppingCart size={24} />
              </div>
              <div>
                <h2 className="serif" style={{ fontSize: '1.6rem' }}>Ticket Virtual</h2>
                <p>{new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</p>
              </div>
            </div>
          </div>

          <div className="cart-items-list">
            <AnimatePresence initial={false}>
              {cart.map(item => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="cart-item-row glass"
                  style={{ background: 'rgba(253, 184, 19, 0.03)', border: '1px solid var(--primary-light)' }}
                >
                  <div className="item-main">
                    <div className="item-info">
                      <span className="item-name" style={{ fontSize: '1rem' }}>{item.nombre}</span>
                      
                      {editingItemId === item.id && editType === 'price' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <input 
                            autoFocus
                            type="number" 
                            className="inline-edit-input"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={saveEdit}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          />
                          <Check size={14} color="var(--success)" />
                        </div>
                      ) : (
                        <span 
                          className="item-price-unit" 
                          style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                          onClick={() => handleEditClick(item, 'price')}
                        >
                          ${item.precio} x {item.unidad} <Edit2 size={10} style={{ display: 'inline', marginLeft: '4px' }} />
                        </span>
                      )}
                    </div>
                    <button className="item-remove" onClick={() => removeFromCart(item.id)}>
                      <X size={16} />
                    </button>
                  </div>

                  <div className="item-controls" style={{ marginTop: '1rem' }}>
                    <div className="qty-picker" style={{ background: 'white', border: '1px solid var(--border-light)' }}>
                      <button onClick={() => updateQuantity(item.id, item.porPeso ? -0.1 : -1)}><Minus size={14} /></button>
                      
                      {editingItemId === item.id && editType === 'qty' ? (
                        <input 
                          autoFocus
                          type="number"
                          className="inline-edit-input-qty"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        />
                      ) : (
                        <span 
                          className="qty-val" 
                          style={{ cursor: 'pointer', borderBottom: '1px dashed var(--primary)' }}
                          onClick={() => handleEditClick(item, 'qty')}
                        >
                          {item.cantidad}{item.porPeso ? 'kg' : ''}
                        </span>
                      )}

                      <button onClick={() => updateQuantity(item.id, item.porPeso ? 0.1 : 1)}><Plus size={14} /></button>
                    </div>
                    <span className="serif" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {cart.length === 0 && (
              <div className="empty-cart-message">
                <Ticket size={60} style={{ color: 'var(--primary)', opacity: 0.2, marginBottom: '1.5rem' }} />
                <p className="serif" style={{ fontSize: '1.5rem' }}>Carrito Vacío</p>
                <p style={{ fontSize: '0.9rem' }}>Selecciona delicias para comenzar</p>
              </div>
            )}
          </div>

          <div className="cart-footer">
            <div className="totals-area" style={{ borderTop: '2px solid var(--primary-light)', paddingTop: '1.5rem' }}>
              <div className="tot-row main">
                <span>Total a Cobrar</span>
                <span className="grand-total">${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="payment-selector" style={{ marginBottom: '1.5rem' }}>
              <button 
                className={paymentMethod === 'Efectivo' ? 'active' : ''} 
                onClick={() => setPaymentMethod('Efectivo')}
                style={{ padding: '12px' }}
              >
                <Banknote size={20} /> Efectivo
              </button>
              <button 
                className={paymentMethod === 'Tarjeta' ? 'active' : ''}
                onClick={() => setPaymentMethod('Tarjeta')}
                style={{ padding: '12px' }}
              >
                <CreditCard size={20} /> Tarjeta
              </button>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="checkout-btn"
              disabled={cart.length === 0}
              onClick={handleCharge}
              style={{ background: 'var(--text-main)', borderRadius: '20px' }}
            >
              COBRAR AHORA <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="success-overlay"
          >
            <div className="glass-dark" style={{ padding: '3.5rem', borderRadius: '40px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.3)', minWidth: '400px' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                <CheckCircle size={90} color="var(--primary)" />
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ delay: 0.3 }}
                  style={{ position: 'absolute', bottom: 0, right: 0, background: '#10b981', borderRadius: '50%', padding: '6px' }}
                >
                  <Check color="white" size={24} />
                </motion.div>
              </div>
              <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'white' }}>¡Venta Exitosa!</h2>
              <p style={{ opacity: 0.8, color: 'white', marginBottom: '3rem', fontSize: '1.1rem' }}>Imprime el ticket o envíalo por WhatsApp.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={imprimirTicket}
                    className="btn btn-primary"
                    style={{ height: '60px', fontSize: '1rem', gap: '10px' }}
                  >
                    <Printer size={20} /> IMPRIMIR TICKET
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareWhatsApp}
                    style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: '14px', height: '60px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                  >
                    <MessageSquare size={20} /> WHATSAPP
                  </motion.button>
                </div>
                <button 
                  onClick={() => setShowSuccess(false)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '14px', height: '54px', fontWeight: 700, cursor: 'pointer', marginTop: '1rem' }}
                >
                  CERRAR Y CONTINUAR
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .pos-maestro-container { display: grid; grid-template-columns: 1fr 450px; gap: 2.5rem; height: calc(100vh - 120px); }
        .pos-main { display: flex; flex-direction: column; overflow: hidden; }
        .pos-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
        .pos-search-wrapper { display: flex; align-items: center; gap: 12px; padding: 1rem 1.5rem; border-radius: 20px; background: white; }
        .pos-search-wrapper input { border: none; background: transparent; outline: none; width: 100%; font-family: inherit; }
        .pos-categories { display: flex; gap: 1rem; overflow-x: auto; padding: 4px; }
        .pos-category-btn { background: white; border: 1px solid var(--border-light); cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 700; color: var(--text-muted); transition: all 0.2s; white-space: nowrap; }
        .pos-category-btn.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 8px 20px rgba(253, 184, 19, 0.25); }
        .pos-grid-container { flex: 1; overflow-y: auto; padding: 4px; }
        .pos-products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 2rem; }
        .pos-sidebar { display: flex; flex-direction: column; height: 100%; }
        .cart-surface { display: flex; flex-direction: column; height: 100%; overflow: hidden; box-shadow: var(--shadow-lg); }
        .cart-header { padding: 2rem; }
        .header-top { display: flex; align-items: center; gap: 1.25rem; }
        .cart-icon-bg { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 14px; }
        .cart-items-list { flex: 1; overflow-y: auto; padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .cart-item-row { padding: 1.25rem; border-radius: 20px; transition: transform 0.2s; }
        .item-main { display: flex; justify-content: space-between; }
        .item-remove { background: transparent; border: none; color: var(--danger); cursor: pointer; opacity: 0.6; }
        .qty-picker { display: flex; align-items: center; gap: 12px; border-radius: 12px; padding: 6px 10px; }
        .qty-picker button { border: none; background: none; cursor: pointer; color: var(--primary); display: flex; }
        .cart-footer { padding: 2rem; background: #fafafa; }
        .payment-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .payment-selector button { border: 1px solid var(--border-light); background: white; border-radius: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; cursor: pointer; }
        .payment-selector button.active { background: var(--primary); color: white; border-color: var(--primary); }
        .tot-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .tot-row.main { margin-bottom: 1.5rem; }
        .grand-total { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--primary); font-weight: 900; }
        .checkout-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; border: none; cursor: pointer; color: white; font-weight: 800; padding: 1rem; }
        .checkout-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .inline-edit-input { width: 80px; border: 1px solid var(--primary); border-radius: 4px; padding: 2px 6px; font-size: 0.9rem; }
        .inline-edit-input-qty { width: 60px; border: 1px solid var(--primary); border-radius: 4px; padding: 2px 6px; font-size: 0.9rem; text-align: center; }
        .success-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; }
      `}</style>
    </div>
  );
};

export default PuntoDeVenta;

