import { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle,
  X,
  Tags,
  Coffee,
  Croissant,
  Scale,
  Ticket,
  ChevronRight,
  User,
  CreditCard,
  Banknote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PRODUCTS = [
  { id: 1, nombre: 'Pan de Masa Madre', precio: 1200, categoria: 'Panadería', unidad: 'unidad', img: 'prod_pan.png' },
  { id: 2, nombre: 'Croissant Francés', precio: 850, categoria: 'Pastelería', unidad: 'unidad', img: 'prod_croissant.png' },
  { id: 3, nombre: 'Hogaza Integral', precio: 1500, categoria: 'Panadería', unidad: 'unidad', img: 'prod_pan.png' },
  { id: 4, nombre: 'Porción Torta Selva Negra', precio: 2200, categoria: 'Pastelería', unidad: 'porción', img: 'prod_cake.png' },
  { id: 5, nombre: 'Café Espresso', precio: 950, categoria: 'Cafetería', unidad: 'taza', img: 'gallery3.png' },
  { id: 6, nombre: 'Pan Casero por Peso', precio: 900, categoria: 'Panadería', unidad: 'kg', porPeso: true, img: 'prod_pan.png' },
  { id: 7, nombre: 'Facturas Surtidas', precio: 450, categoria: 'Pastelería', unidad: 'unidad', img: 'prod_croissant.png' },
  { id: 8, nombre: 'Budín de Limón', precio: 1800, categoria: 'Pastelería', unidad: 'unidad', img: 'prod_cake.png' },
];

const PuntoDeVenta = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');

  const categories = [
    { id: 'Todos', label: 'Todo', icon: Tags },
    { id: 'Panadería', label: 'Panes', icon: Croissant },
    { id: 'Pastelería', label: 'Pasteles', icon: Croissant },
    { id: 'Cafetería', label: 'Café', icon: Coffee },
    { id: 'A Peso', label: 'Por Peso', icon: Scale },
  ];

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
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
        const newCant = Math.max(item.porPeso ? 0.25 : 1, item.cantidad + delta);
        return { ...item, cantidad: newCant };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const total = subtotal;

  const handleCharge = () => {
    if (cart.length === 0) return;
    setShowSuccess(true);
    setCart([]);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="pos-maestro-container">
      <div className="pos-main">
        {/* Top bar with Search and Stats */}
        <header className="pos-header">
          <div className="pos-title">
            <h1 className="serif">Terminal de Venta</h1>
            <p>Maestro Panadero: <span>Guadalupe</span></p>
          </div>
          <div className="pos-search-wrapper">
            <Search size={20} color="var(--primary)" />
            <input 
              type="text" 
              placeholder="Buscar producto exquisito..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Categories Section */}
        <nav className="pos-categories">
          {categories.map(cat => (
            <motion.button 
              key={cat.id} 
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`pos-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
            >
              <cat.icon size={18} />
              {cat.label}
            </motion.button>
          ))}
        </nav>

        {/* Products Grid */}
        <div className="pos-grid-container">
          <div className="pos-products-grid">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div 
                  key={product.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  className="maestro-product-card"
                  onClick={() => addToCart(product)}
                >
                  <div className="card-img-wrapper">
                    <img src={product.img} alt={product.nombre} />
                    {product.porPeso && <span className="badge-weight">PESO</span>}
                    <div className="card-overlay">
                      <Plus size={32} color="white" />
                    </div>
                  </div>
                  <div className="card-content">
                    <span className="card-cat">{product.categoria}</span>
                    <h3>{product.nombre}</h3>
                    <div className="card-footer">
                      <span className="price">${product.precio.toLocaleString()}</span>
                      <span className="unit">/ {product.unidad}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Luxury Cart Sidebar - Parchment Aesthetic */}
      <aside className="pos-sidebar">
        <div className="cart-surface">
          <div className="cart-header">
            <div className="header-top">
              <div className="cart-icon-bg">
                <ShoppingCart size={22} />
              </div>
              <div>
                <h2>Su Pedido</h2>
                <p>{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
              </div>
            </div>
            <div className="item-count">{cart.length} productos</div>
          </div>

          <div className="cart-items-list">
            <AnimatePresence initial={false}>
              {cart.map(item => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, height: 0, x: 20 }}
                  animate={{ opacity: 1, height: 'auto', x: 0 }}
                  exit={{ opacity: 0, height: 0, x: -20 }}
                  className="cart-item-row"
                >
                  <div className="item-main">
                    <div className="item-info">
                      <span className="item-name">{item.nombre}</span>
                      <span className="item-price-unit">${item.precio} x {item.unidad}</span>
                    </div>
                    <button className="item-remove" onClick={() => removeFromCart(item.id)}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className="item-controls">
                    <div className="qty-picker">
                      <button onClick={() => updateQuantity(item.id, item.porPeso ? -0.25 : -1)}><Minus size={14} /></button>
                      <span className="qty-val">{item.cantidad}{item.porPeso ? 'kg' : ''}</span>
                      <button onClick={() => updateQuantity(item.id, item.porPeso ? 0.25 : 1)}><Plus size={14} /></button>
                    </div>
                    <span className="item-total-price">${(item.precio * item.cantidad).toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {cart.length === 0 && (
              <div className="empty-cart-message">
                <Ticket size={48} className="empty-icon" />
                <p>Esperando la selección del maestro...</p>
              </div>
            )}
          </div>

          <div className="cart-footer">
            <div className="payment-selector">
              <button 
                className={paymentMethod === 'Efectivo' ? 'active' : ''} 
                onClick={() => setPaymentMethod('Efectivo')}
              >
                <Banknote size={16} /> Efectivo
              </button>
              <button 
                className={paymentMethod === 'Tarjeta' ? 'active' : ''}
                onClick={() => setPaymentMethod('Tarjeta')}
              >
                <CreditCard size={16} /> Tarjeta
              </button>
            </div>

            <div className="totals-area">
              <div className="tot-row">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="tot-row main">
                <span>Total a Pagar</span>
                <span className="grand-total">${total.toLocaleString()}</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="checkout-btn"
              disabled={cart.length === 0}
              onClick={handleCharge}
            >
              FINALIZAR VENTA <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Floating Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="success-toast"
          >
            <div className="toast-icon"><CheckCircle size={24} /></div>
            <div className="toast-content">
              <h4>Venta Procesada</h4>
              <p>El ticket fue generado con éxito.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .pos-maestro-container {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 1.5rem;
          height: calc(100vh - 100px);
          max-height: 900px;
          color: var(--text-main);
        }

        .pos-main {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          overflow: hidden;
        }

        .pos-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 0.5rem 0;
        }

        .pos-title h1 {
          font-size: 2.25rem;
          margin: 0;
          color: var(--primary);
        }

        .pos-title p {
          margin: 4px 0 0 0;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .pos-title span {
          color: var(--text-main);
          font-weight: 700;
        }

        .pos-search-wrapper {
          background: white;
          padding: 0.75rem 1.25rem;
          border-radius: 16px;
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 12px;
          width: 350px;
          box-shadow: var(--shadow-sm);
        }

        .pos-search-wrapper input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 0.95rem;
          font-family: inherit;
        }

        .pos-categories {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .pos-category-btn {
          background: white;
          border: 1px solid var(--border-light);
          padding: 8px 18px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .pos-category-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(212, 106, 42, 0.2);
        }

        .pos-grid-container {
          flex: 1;
          overflow-y: auto;
          padding: 4px;
        }

        .pos-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1.25rem;
        }

        .maestro-product-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--border-light);
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }

        .maestro-product-card:hover {
          box-shadow: 0 12px 24px rgba(0,0,0,0.06);
          border-color: var(--primary-light);
        }

        .card-img-wrapper {
          height: 120px;
          position: relative;
          overflow: hidden;
        }

        .card-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .maestro-product-card:hover .card-img-wrapper img {
          transform: scale(1.1);
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(212, 106, 42, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .maestro-product-card:hover .card-overlay {
          opacity: 1;
        }

        .badge-weight {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(4px);
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--primary);
        }

        .card-content {
          padding: 1rem;
        }

        .card-cat {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .card-content h3 {
          margin: 4px 0 12px 0;
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1.3;
        }

        .card-footer {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .card-footer .price {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--primary);
        }

        .card-footer .unit {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Sidebar Styling */
        .pos-sidebar {
          display: flex;
          flex-direction: column;
        }

        .cart-surface {
          background: #fafafa;
          height: 100%;
          border-radius: 30px;
          border: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }

        .cart-header {
          padding: 1.5rem;
          background: white;
          border-bottom: 1px dashed var(--border-light);
        }

        .header-top {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .cart-icon-bg {
          width: 44px;
          height: 44px;
          background: var(--bg-app);
          color: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-header h2 {
          margin: 0;
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
        }

        .cart-header p {
          margin: 0;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        .item-count {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--primary);
          background: var(--primary-light);
          padding: 4px 12px;
          border-radius: 20px;
          display: inline-block;
        }

        .cart-items-list {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item-row {
          background: white;
          padding: 12px;
          border-radius: 16px;
          border: 1px solid #f0f0f0;
        }

        .item-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .item-name {
          display: block;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .item-price-unit {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .item-remove {
          background: transparent;
          border: none;
          color: #ef4444;
          cursor: pointer;
          opacity: 0.5;
        }

        .item-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .qty-picker {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-app);
          padding: 4px;
          border-radius: 8px;
        }

        .qty-picker button {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: none;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .qty-val {
          font-size: 0.85rem;
          font-weight: 800;
          min-width: 40px;
          text-align: center;
        }

        .item-total-price {
          font-weight: 800;
          color: var(--text-main);
        }

        .empty-cart-message {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0.3;
          text-align: center;
        }

        .empty-icon {
          margin-bottom: 1rem;
        }

        .cart-footer {
          padding: 1.5rem;
          background: white;
          border-top: 1px dashed var(--border-light);
        }

        .payment-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 1.5rem;
        }

        .payment-selector button {
          padding: 10px;
          border-radius: 12px;
          border: 1px solid var(--border-light);
          background: white;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .payment-selector button.active {
          background: var(--text-main);
          color: white;
          border-color: var(--text-main);
        }

        .totals-area {
          margin-bottom: 1.5rem;
        }

        .tot-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 6px;
        }

        .tot-row.main {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-light);
        }

        .grand-total {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          color: var(--primary);
          font-weight: 900;
        }

        .checkout-btn {
          width: 100%;
          padding: 1.25rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(212, 106, 42, 0.2);
        }

        .checkout-btn:disabled {
          background: #ccc;
          box-shadow: none;
          cursor: not-allowed;
        }

        .success-toast {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 1rem 2rem;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border: 1px solid var(--success);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          z-index: 5000;
        }

        .toast-icon {
          color: var(--success);
        }

        .toast-content h4 {
          margin: 0;
          font-size: 1rem;
        }

        .toast-content p {
          margin: 2px 0 0 0;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default PuntoDeVenta;
