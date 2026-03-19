import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  AlertTriangle,
  Package,
  Trash2,
  Edit,
  TrendingDown,
  Box,
  Truck,
  MoreVertical,
  ArrowUpDown,
  Check,
  X,
  Layers,
  ShoppingBag,
  Printer,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const MOCK_INVENTARIO = [
  { id: 1, nombre: 'Harina 0000', categoria: 'Insumos', precio: 850, stock: 15, stockMax: 100, unidad: 'kg' },
  { id: 2, nombre: 'Manteca Premium', categoria: 'Insumos', precio: 4200, stock: 8, stockMax: 50, unidad: 'kg' },
  { id: 3, nombre: 'Croissant Tradicional', categoria: 'Panadería', precio: 1200, stock: 45, stockMax: 200, unidad: 'un' },
  { id: 4, nombre: 'Pan de Masa Madre', categoria: 'Panadería', precio: 3500, stock: 12, stockMax: 80, unidad: 'un' },
  { id: 5, nombre: 'Azúcar Blanca', categoria: 'Insumos', precio: 950, stock: 50, stockMax: 150, unidad: 'kg' },
];

const Inventario = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [newItem, setNewItem] = useState({
    nombre: '',
    categoria: 'Insumos',
    precio: '',
    stock: '',
    unidad: 'kg'
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await api.productos.getAll();
      setItems(data);
    } catch (err) {
      console.error(err);
      showToast('Error al cargar inventario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditValue(item.stock.toString());
  };

  const saveStock = async (id) => {
    const val = parseFloat(editValue);
    if (!isNaN(val)) {
      try {
        await api.productos.update(id, { stock: val });
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, stock: val } : item
        ));
        showToast('Stock actualizado');
      } catch (err) {
        showToast('Error al actualizar stock', 'error');
      }
    }
    setEditingId(null);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const resp = await api.productos.create({
        ...newItem,
        precio: parseFloat(newItem.precio),
        stock: parseFloat(newItem.stock)
      });
      setItems([resp, ...items]);
      setShowAddModal(false);
      setNewItem({ nombre: '', categoria: 'Insumos', precio: '', stock: '', unidad: 'kg' });
      showToast('Producto agregado correctamente');
    } catch (err) {
      showToast('Error al agregar producto', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este artículo?')) {
      try {
        await api.productos.delete(id);
        setItems(items.filter(item => item.id !== id));
        showToast('Artículo eliminado');
      } catch (err) {
        showToast('Error al eliminar', 'error');
      }
    }
  };

  const printShoppingList = () => {
    const lowStockItems = items.filter(item => item.stock < ((item.stockMax || 100) * 0.25));
    if (lowStockItems.length === 0) {
      alert('No hay artículos con stock bajo para reponer.');
      return;
    }

    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>Lista de Compras - El Aromo</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { color: #D48806; border-bottom: 2px solid #D48806; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #f9f9f9; padding: 12px; border-bottom: 2px solid #eee; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .urgent { color: #E25E3E; font-weight: bold; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <h1>Lista de Reposición Urgente</h1>
          <p>Generada el: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Stock Actual</th>
                <th>Sugerencia Compra</th>
              </tr>
            </thead>
            <tbody>
              ${lowStockItems.map(item => `
                <tr>
                  <td>${item.nombre}</td>
                  <td class="urgent">${item.stock} ${item.unidad}</td>
                  <td>${(item.stockMax || 100) - item.stock} ${item.unidad}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Todos' || item.categoria === filter;
    return matchesSearch && matchesFilter;
  });

  const lowStockCount = items.filter(item => item.stock < ((item.stockMax || 100) * 0.2)).length;

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '3.5rem', margin: 0 }}>Inventario Maestro</h1>
          <p className="page-subtitle" style={{ fontSize: '1.1rem', margin: '0.5rem 0 0 0' }}>Control absoluto de materias primas y productos terminados.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary" 
          style={{ height: '54px', padding: '0 32px', borderRadius: '18px', fontSize: '1rem', fontWeight: 800, boxShadow: '0 10px 30px rgba(253, 184, 19, 0.4)' }}
        >
          <Plus size={22} /> NUEVO PRODUCTO
        </motion.button>
      </header>

      {/* Hero Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginBottom: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bakery-card glass" style={{ padding: '2.5rem', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Variedades</p>
              <div className="serif" style={{ fontSize: '3rem', fontWeight: 800 }}>{items.length}</div>
            </div>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(253, 184, 19, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={32} />
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bakery-card glass" style={{ padding: '2.5rem', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Reposición Urgente</p>
              <div className="serif" style={{ fontSize: '3rem', fontWeight: 800, color: '#E25E3E' }}>{lowStockCount}</div>
            </div>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#FFF5F5', color: '#E25E3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={32} />
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bakery-card glass" style={{ padding: '2.5rem', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Valor Estimado</p>
              <div className="serif" style={{ fontSize: '3rem', fontWeight: 800, color: '#10b981' }}>${items.reduce((acc, x) => acc + (x.precio * x.stock), 0).toLocaleString()}</div>
            </div>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#F0FAF7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={32} />
            </div>
          </div>
        </motion.div>
      </div>

      {lowStockCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ background: 'var(--text-main)', color: 'white', padding: '1.5rem 2.5rem', borderRadius: '24px', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '15px' }}>
              <Truck size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Sugerencia de Reposición</div>
              <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Tienes {lowStockCount} artículos por debajo del stock mínimo de seguridad.</div>
            </div>
          </div>
          <button 
            onClick={printShoppingList}
            className="btn btn-primary" 
            style={{ height: '50px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 24px' }}
          >
            <Printer size={18} /> IMPRIMIR LISTA DE COMPRAS
          </button>
        </motion.div>
      )}

      <div className="bakery-card glass" style={{ padding: '0', overflow: 'hidden', background: 'white', position: 'relative' }}>
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 10, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                zIndex: 2000,
                padding: '12px 24px',
                borderRadius: '12px',
                background: toast.type === 'success' ? '#10b981' : '#E25E3E',
                color: 'white',
                fontWeight: 800,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ padding: '2.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '2rem', alignItems: 'center', background: 'rgba(255,255,255,0.6)' }}>
          <div className="pos-search-wrapper glass" style={{ flex: 1, maxWidth: '600px', height: '56px' }}>
            <Search size={22} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Escribe para buscar cualquier artículo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: '1.1rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['Todos', 'Panadería', 'Insumos', 'Pastelería'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`nav-mode-btn ${filter === cat ? 'active' : ''}`}
                style={{ height: '48px', padding: '0 20px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: 'var(--bg-app)' }}>
                <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Descripción del Artículo</th>
                <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Categoría</th>
                <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Precio Base</th>
                <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Stock Actual</th>
                <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Gestión</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ padding: '8rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem' }}>Cargando registros...</td></tr>
              ) : filteredItems.map((item) => {
                const stockPercent = (item.stock / (item.stockMax || 100)) * 100;
                const isLow = item.stock < ((item.stockMax || 100) * 0.25);
                
                return (
                  <tr key={item.id} className="stock-row" style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '2rem 2.5rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '4px' }}>{item.nombre}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, opacity: 0.6 }}>SKU: ART-{item.id.toString().padStart(4, '0')}</div>
                    </td>
                    <td style={{ padding: '2rem 2.5rem' }}>
                      <span className="category-pill" style={{ background: item.categoria === 'Insumos' ? '#F3F4F6' : '#FDFAF5', color: item.categoria === 'Insumos' ? '#6B7280' : 'var(--primary)', border: 'none' }}>{item.categoria}</span>
                    </td>
                    <td style={{ padding: '2rem 2.5rem' }}>
                      <div className="serif" style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.4rem' }}>${item.precio.toLocaleString()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>por {item.unidad}</div>
                    </td>
                    <td style={{ padding: '2rem 2.5rem' }}>
                      {editingId === item.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input 
                            autoFocus
                            type="number" 
                            className="stock-edit-input"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveStock(item.id)}
                            onKeyDown={(e) => e.key === 'Enter' && saveStock(item.id)}
                            style={{ border: '2px solid var(--primary)', borderRadius: '12px' }}
                          />
                        </div>
                      ) : (
                        <div 
                          style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                          onClick={() => startEditing(item)}
                        >
                          <div style={{ fontWeight: 900, fontSize: '1.8rem', color: isLow ? '#E25E3E' : 'var(--text-main)', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            {item.stock}
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>{item.unidad}</span>
                          </div>
                          <div style={{ marginLeft: 'auto', width: '80px' }}>
                             <div style={{ height: '8px', background: '#F1F1F1', borderRadius: '10px', overflow: 'hidden' }}>
                               <div style={{ width: `${Math.min(stockPercent, 100)}%`, height: '100%', background: isLow ? '#E25E3E' : (stockPercent < 50 ? '#FDB813' : '#10b981'), borderRadius: '10px' }} />
                             </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '2rem 2.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button className="action-row-btn glass" style={{ border: '1px solid var(--border-light)' }}><Edit size={18} /></button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="action-row-btn glass" 
                          style={{ border: '1px solid #FEE2E2', color: '#E25E3E' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(61,44,30,0.4)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bakery-card glass" 
              style={{ width: '100%', maxWidth: '600px', padding: '3rem', background: 'white' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                <h2 className="serif" style={{ fontSize: '2.2rem' }}>Nuevo Artículo</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={28} /></button>
              </div>

              <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Nombre del Producto / Insumo</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ej. Harina de Trigo 000"
                    value={newItem.nombre}
                    onChange={(e) => setNewItem({...newItem, nombre: e.target.value})}
                    style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontSize: '1rem', fontWeight: 600 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Categoría</label>
                    <select 
                      value={newItem.categoria}
                      onChange={(e) => setNewItem({...newItem, categoria: e.target.value})}
                      style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontSize: '1rem', fontWeight: 600 }}
                    >
                      <option value="Insumos">Insumos</option>
                      <option value="Panadería">Panadería</option>
                      <option value="Pastelería">Pastelería</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Unidad</label>
                    <select 
                      value={newItem.unidad}
                      onChange={(e) => setNewItem({...newItem, unidad: e.target.value})}
                      style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontSize: '1rem', fontWeight: 600 }}
                    >
                      <option value="kg">Kilogramos (kg)</option>
                      <option value="un">Unidades (un)</option>
                      <option value="lt">Litros (lt)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Precio Base ($)</label>
                    <input 
                      required
                      type="number" 
                      placeholder="0.00"
                      value={newItem.precio}
                      onChange={(e) => setNewItem({...newItem, precio: e.target.value})}
                      style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontSize: '1rem', fontWeight: 600 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Stock Inicial</label>
                    <input 
                      required
                      type="number" 
                      placeholder="0"
                      value={newItem.stock}
                      onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
                      style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontSize: '1rem', fontWeight: 600 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ flex: 1, height: '56px' }}>CANCELAR</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '56px' }}>GUARDAR ARTÍCULO</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .stock-row:hover {
          background: #FDFAF5;
        }
        .category-pill {
          font-size: 0.85rem;
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .action-row-btn {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: white;
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-row-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          background: var(--text-main);
          color: white;
        }
        .stock-edit-input {
          width: 100px;
          padding: 8px 12px;
          font-size: 1.5rem;
          font-weight: 900;
          text-align: center;
          outline: none;
        }
        .nav-mode-btn {
          border: none;
          background: transparent;
          padding: 10px 24px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.3s;
        }
        .nav-mode-btn.active {
          background: var(--text-main);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Inventario;

