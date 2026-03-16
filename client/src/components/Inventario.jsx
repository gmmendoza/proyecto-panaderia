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
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const MOCK_INVENTARIO = [
  { id: 1, nombre: 'Harina 0000', categoria: 'Insumos', precio: 850, stock: 15, unidad: 'kg' },
  { id: 2, nombre: 'Manteca Premium', categoria: 'Insumos', precio: 4200, stock: 8, unidad: 'kg' },
  { id: 3, nombre: 'Croissant Tradicional', categoria: 'Panadería', precio: 1200, stock: 45, unidad: 'un' },
  { id: 4, nombre: 'Pan de Masa Madre', categoria: 'Panadería', precio: 3500, stock: 12, unidad: 'un' },
  { id: 5, nombre: 'Azúcar Blanca', categoria: 'Insumos', precio: 950, stock: 50, unidad: 'kg' },
];

const Inventario = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await api.productos.getAll().catch(() => MOCK_INVENTARIO);
      setItems(data || MOCK_INVENTARIO);
    } catch (err) {
      setItems(MOCK_INVENTARIO);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Todos' || item.categoria === filter;
    return matchesSearch && matchesFilter;
  });

  const lowStockItems = items.filter(item => item.stock < 10);

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '2.5rem', margin: 0 }}>Control de Inventario</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gestión centralizada de insumos y productos terminados.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> AGREGAR ARTÍCULO
        </button>
      </header>

      {/* Hero Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="bakery-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>TOTAL ITEMS</p>
              <div className="serif" style={{ fontSize: '2rem' }}>{items.length}</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} />
            </div>
          </div>
        </div>
        <div className="bakery-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>BAJO STOCK</p>
              <div className="serif" style={{ fontSize: '2rem', color: '#ef4444' }}>{lowStockItems.length}</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown size={20} />
            </div>
          </div>
        </div>
        <div className="bakery-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>VALOR STOCK</p>
              <div className="serif" style={{ fontSize: '2rem' }}>$1.2M</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="bakery-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '1rem', background: '#F9FAFB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-light)', flex: 1, maxWidth: '400px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '0.5rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'white', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
          >
            <option value="Todos">Categorías</option>
            <option value="Panadería">Panadería</option>
            <option value="Insumos">Insumos</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: '#F3F4F6' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>ARTÍCULO</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>CATEGORÍA</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>PRECIO</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>STOCK ACTUAL</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>ESTADO</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Sincronizando inventario...</td></tr>
              ) : filteredItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)', verticalAlign: 'middle' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 700 }}>{item.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {item.id.toString().padStart(6, '0')}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ fontSize: '0.85rem', background: '#F3F4F6', padding: '4px 10px', borderRadius: '8px' }}>{item.categoria}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 700 }}>${item.precio.toLocaleString()}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>x {item.unidad}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{item.stock}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.unidad}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    {item.stock < 10 ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', background: '#fef2f2', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                        <AlertTriangle size={12} /> CRÍTICO
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#059669', background: '#ecfdf5', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                        OPTIMO
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="row-btn"><Edit size={16} /></button>
                      <button className="row-btn" style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem' }}>
        <div className="bakery-card" style={{ flex: 1, border: '2px dashed var(--border-light)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'transparent' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Truck size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0 }}>Pedidos a Proveedores</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gestiona órdenes de compra automáticas según el stock.</p>
          </div>
          <button className="btn btn-secondary" style={{ marginLeft: 'auto' }}>GESTIONAR</button>
        </div>
      </div>

      <style>{`
        .row-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border-light);
          background: white;
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .row-btn:hover {
          background: #f9fafb;
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
      `}</style>
    </div>
  );
};

export default Inventario;
