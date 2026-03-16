import { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Calculator,
  CheckCircle,
  X,
  User,
  Tags,
  Coffee,
  Croissant,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const PuntoDeVenta = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { id: 'Todos', label: 'Todos', icon: Tags },
    { id: 'Panadería', label: 'Panadería', icon: Croissant },
    { id: 'Pastelería', label: 'Pastelería', icon: Croissant },
    { id: 'Cafetería', label: 'Cafetería', icon: Coffee },
    { id: 'Salados', label: 'Salados', icon: Tags },
    { id: 'A Peso', label: 'A Peso', icon: Scale },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (activeCategory === 'A Peso') {
      filtered = filtered.filter(p => p.porPeso);
    } else if (activeCategory !== 'Todos') {
      filtered = filtered.filter(p => p.categoria === activeCategory);
    }
    setFilteredProducts(filtered);
  }, [searchTerm, activeCategory, products]);

  const loadProducts = async () => {
    const data = await api.productos.getAll();
    setProducts(data);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, cantidad: item.cantidad + (item.porPeso ? 0.25 : 1) } : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
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
  const total = subtotal * (1 - discount / 100);

  const handleCharge = async () => {
    if (cart.length === 0) return;
    
    await api.ventas.create({
      cliente: 'Consumidor Final',
      total: total,
      items: cart.length
    });
    
    setShowSuccess(true);
    setCart([]);
    setDiscount(0);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', height: 'calc(100vh - 100px)' }}>
      {/* Products Area */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <header style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div className="logo-icon" style={{ background: '#EED7C5', color: 'var(--bakery-primary)' }}>
              <Calculator size={22} />
            </div>
            <h1 className="serif" style={{ fontSize: '2.5rem' }}>Caja & Ventas</h1>
          </div>
          <p style={{ color: 'var(--bakery-text-muted)', fontSize: '0.95rem' }}>
            Punto de venta. Productos por unidad y por peso.
          </p>
        </header>

        <div className="search-bar">
          <Search size={20} color="var(--bakery-text-muted)" />
          <input 
            type="text" 
            placeholder="Buscar producto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-pills">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <cat.icon size={16} />
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
          <div className="product-grid">
            {filteredProducts.map(product => (
              <motion.div 
                key={product.id} 
                className="bakery-card product-card"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(product)}
              >
                <div className="product-image-container">
                  {product.porPeso && <span className="badge-peso" style={{ position: 'absolute', top: '10px', right: '10px' }}>Peso</span>}
                  <div style={{ fontSize: '3rem' }}>{product.categoria === 'Panadería' ? '🥖' : product.categoria === 'Pastelería' ? '🍰' : '☕'}</div>
                </div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{product.nombre}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--bakery-text-muted)', marginBottom: '0.5rem' }}>$/{product.unidad}</p>
                <p className="serif" style={{ fontSize: '1.25rem', color: 'var(--bakery-primary)', fontWeight: 700 }}>
                  ${product.precio.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Sidebar */}
      <div className="bakery-card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--bakery-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingCart size={20} /> Ticket
          </h3>
          <span style={{ 
            background: 'var(--bakery-primary)', 
            color: 'white', 
            borderRadius: '50%', 
            width: '24px', 
            height: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            {cart.length}
          </span>
        </div>

        <div style={{ padding: '1.25rem', background: '#FDFBF7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'white', borderRadius: '12px', border: '1px solid var(--bakery-border)' }}>
              <User size={18} color="var(--bakery-primary)" />
              <select style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem', outline: 'none' }}>
                <option>Cliente Ocasional</option>
              </select>
            </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          <AnimatePresence>
            {cart.map(item => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--bakery-border)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.nombre}</div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--bakery-text-muted)' }}>
                      Precio unitario: <span style={{ color: 'var(--bakery-text)', fontWeight: 600 }}>${item.precio}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8f8f8', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.porPeso ? -0.25 : -1)}><Minus size={14} /></button>
                    <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                      {item.cantidad}{item.porPeso ? 'kg' : ''}
                    </span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.porPeso ? 0.25 : 1)}><Plus size={14} /></button>
                  </div>
                  <div style={{ fontWeight: 700 }}>${(item.precio * item.cantidad).toLocaleString()}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {cart.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--bakery-text-muted)' }}>
              <ShoppingCart size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <p>El ticket está vacío</p>
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', background: '#FFF7F2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tags size={14} /> Descuento</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <input 
                type="number" 
                value={discount} 
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                style={{ width: '40px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center', padding: '2px' }}
              /> %
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--bakery-text-muted)', fontSize: '0.9rem' }}>
            <span>Subtotal:</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Total:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--bakery-primary)' }}>${total.toLocaleString()}</span>
          </div>

          <button 
            className="btn-bakery" 
            style={{ width: '100%', padding: '1.25rem', justifyContent: 'center' }}
            onClick={handleCharge}
            disabled={cart.length === 0}
          >
            <CheckCircle size={22} /> COBRAR
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              zIndex: 1000, background: 'white', padding: '2rem', borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center'
            }}
          >
            <div style={{ color: '#4CAF50', marginBottom: '1rem' }}><CheckCircle size={64} /></div>
            <h2 className="serif">¡Venta Exitosa!</h2>
            <p style={{ color: 'var(--bakery-text-muted)' }}>El ticket ha sido procesado correctamente.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .qty-btn {
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .qty-btn:hover {
          background: var(--bakery-primary);
          color: white;
          border-color: var(--bakery-primary);
        }
      `}</style>
    </div>
  );
};

export default PuntoDeVenta;
