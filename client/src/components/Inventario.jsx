import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  AlertTriangle,
  Package,
  Trash2,
  Edit,
  Box,
  Layers,
  ShoppingBag,
  Printer,
  X,
  PlusCircle,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const Inventario = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    nombre: '',
    categoria: 'Panadería',
    precio: '',
    stock: '',
    unidad: 'un'
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await api.productos.getAll();
      setItems(data);
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Error al cargar inventario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const resp = await api.productos.create({
        ...newItem,
        precio: Number(newItem.precio),
        stock: Number(newItem.stock)
      });
      setItems([resp, ...items]);
      setShowAddModal(false);
      setNewItem({ nombre: '', categoria: 'Panadería', precio: '', stock: '', unidad: 'un' });
      if (showToast) showToast('Producto agregado correctamente');
    } catch (err) {
      if (showToast) showToast('Error al agregar producto', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este artículo?')) {
      try {
        await api.productos.delete(id);
        setItems(items.filter(item => item.id !== id));
        if (showToast) showToast('Artículo eliminado');
      } catch (err) {
        if (showToast) showToast('Error al eliminar', 'error');
      }
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.nombre || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Todos' || item.categoria === filter;
    return matchesSearch && matchesFilter;
  });

  const lowStockCount = items.filter(item => (item.stock || 0) <= 5).length;

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Gestión de Inventario</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Control de existencias y catálogo de productos</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={18} /> IMPRIMIR LISTA
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <PlusCircle size={18} /> NUEVO PRODUCTO
          </button>
        </div>
      </div>

      {/* Mini Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="bakery-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Skus</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{items.length}</div>
          </div>
        </div>
        <div className="bakery-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bajo Stock</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--danger)' }}>{lowStockCount} Alertas</div>
          </div>
        </div>
        <div className="bakery-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdf4', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Valorización</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>${items.reduce((acc, x) => acc + (Number(x.precio) * Number(x.stock)), 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bakery-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Todos', 'Insumos', 'Panadería', 'Pastelería'].map(cat => (
              <button 
                key={cat} 
                className={`btn ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(cat)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bakery-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="system-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>Sincronizando datos...</td></tr>
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>No se encontraron productos</td></tr>
            ) : filteredItems.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 600 }}>{item.nombre}</td>
                <td>
                  <span style={{ fontSize: '0.75rem', background: 'var(--bg-surface-soft)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{item.categoria}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontWeight: 800, color: (item.stock || 0) <= 5 ? 'var(--danger)' : 'var(--text-main)' }}>{item.stock} {item.unidad}</div>
                    {(item.stock || 0) <= 5 && <AlertTriangle size={14} color="var(--danger)" />}
                  </div>
                </td>
                <td style={{ fontWeight: 700 }}>${Number(item.precio).toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem' }}><Edit size={16} /></button>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Product */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bakery-card" 
              style={{ width: '400px', padding: '2rem' }}
            >
              <h2 style={{ marginTop: 0, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Nuevo Producto</h2>
              <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>NOMBRE</label>
                  <input required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newItem.nombre} onChange={e => setNewItem({...newItem, nombre: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>CATEGORÍA</label>
                    <select style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newItem.categoria} onChange={e => setNewItem({...newItem, categoria: e.target.value})}>
                      <option value="Panadería">Panadería</option>
                      <option value="Pastelería">Pastelería</option>
                      <option value="Insumos">Insumos</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>UNIDAD</label>
                    <input style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newItem.unidad} onChange={e => setNewItem({...newItem, unidad: e.target.value})} placeholder="un, kg, lt" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>PRECIO ($)</label>
                    <input required type="number" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newItem.precio} onChange={e => setNewItem({...newItem, precio: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>STOCK INICIAL</label>
                    <input required type="number" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>CANCELAR</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>GUARDAR</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventario;

