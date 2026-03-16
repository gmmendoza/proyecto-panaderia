import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle,
  Package,
  Save,
  Trash2,
  Edit
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const Inventario = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const data = await api.productos.getAll();
    setItems(data);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Todos' || item.categoria === filter;
    return matchesSearch && matchesFilter;
  });

  const lowStockItems = items.filter(item => item.stock < 20);

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div className="logo-icon" style={{ background: '#E3F2FD', color: '#1976D2' }}>
            <Package size={22} />
          </div>
          <h1 className="serif" style={{ fontSize: '2.5rem' }}>Inventario & Stock</h1>
        </div>
        <p style={{ color: 'var(--bakery-text-muted)', fontSize: '0.95rem' }}>
          Control de existencias y alertas de reposición.
        </p>
      </header>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="bakery-card">
          <p style={{ fontSize: '0.75rem', color: 'var(--bakery-text-muted)', fontWeight: 600 }}>TOTAL PRODUCTOS</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{items.length}</span>
            <span style={{ fontSize: '0.75rem', color: '#4CAF50' }}>+2 esta semana</span>
          </div>
        </div>
        <div className="bakery-card" style={{ borderLeft: '4px solid #FF9800' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--bakery-text-muted)', fontWeight: 600 }}>BAJO STOCK</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{lowStockItems.length}</span>
            <span style={{ fontSize: '0.75rem', color: '#FF9800' }}>Requieren atención</span>
          </div>
        </div>
        <div className="bakery-card">
          <p style={{ fontSize: '0.75rem', color: 'var(--bakery-text-muted)', fontWeight: 600 }}>VALOR ESTIMADO</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>$124k</span>
            <span style={{ fontSize: '0.75rem', color: '#2196F3' }}>Total inventario</span>
          </div>
        </div>
        <div className="bakery-card">
          <p style={{ fontSize: '0.75rem', color: 'var(--bakery-text-muted)', fontWeight: 600 }}>MOVIMIENTOS HOY</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>42</span>
            <span style={{ fontSize: '0.75rem', color: '#4CAF50' }}>↑ 12% vs ayer</span>
          </div>
        </div>
      </div>

      <div className="bakery-card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--bakery-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
            <div className="search-bar" style={{ maxWidth: '300px', margin: 0 }}>
              <Search size={18} color="var(--bakery-text-muted)" />
              <input 
                type="text" 
                placeholder="Buscar artículo..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="category-pill" 
              style={{ padding: '0 1rem', background: '#F8F9FA' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="Todos">Todas las categorías</option>
              <option value="Panadería">Panadería</option>
              <option value="Pastelería">Pastelería</option>
              <option value="Cafetería">Cafetería</option>
              <option value="Insumos">Insumos</option>
            </select>
          </div>
          <button className="btn-bakery">
            <Plus size={18} /> AGREGAR ARTÍCULO
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#FDFBF7', borderBottom: '1px solid var(--bakery-border)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--bakery-text-muted)', textTransform: 'uppercase' }}>Artículo</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--bakery-text-muted)', textTransform: 'uppercase' }}>Categoría</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--bakery-text-muted)', textTransform: 'uppercase' }}>Precio</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--bakery-text-muted)', textTransform: 'uppercase' }}>Stock</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--bakery-text-muted)', textTransform: 'uppercase' }}>Estado</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--bakery-text-muted)', textTransform: 'uppercase' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: idx === filteredItems.length - 1 ? 'none' : '1px solid var(--bakery-border)' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{item.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--bakery-text-muted)' }}>ID: #IN-{item.id}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ fontSize: '0.85rem' }}>{item.categoria}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 700 }}>${item.precio.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--bakery-text-muted)' }}>por {item.unidad}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 700 }}>{item.stock} {item.unidad}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    {item.stock < 20 ? (
                      <span style={{ background: '#FFF3E0', color: '#EF6C00', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <AlertTriangle size={12} /> Bajo Stock
                      </span>
                    ) : (
                      <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                        Normal
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="qty-btn" style={{ padding: '0.4rem' }}><Edit size={16} /></button>
                      <button className="qty-btn" style={{ padding: '0.4rem', color: '#ff4d4d' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventario;
