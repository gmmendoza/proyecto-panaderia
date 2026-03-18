import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  User, 
  Calendar,
  ChevronRight,
  MoreVertical,
  X,
  Printer,
  Bell
} from 'lucide-react';

const MOCK_PEDIDOS = [
  { 
    id: 'PED-001', 
    cliente: 'Sofía Martínez', 
    items: 'Tarta de Frutillas Especial (Personalizada)', 
    total: 15000, 
    sena: 5000, 
    fechaEntrega: '2026-03-20', 
    horaEntrega: '16:00',
    estado: 'Procesando',
    prioridad: 'Alta'
  },
  { 
    id: 'PED-002', 
    cliente: 'Marcos Ruiz', 
    items: '10kg Facturas Surtidas, 5 Pan de Campo', 
    total: 28000, 
    sena: 10000, 
    fechaEntrega: '2026-03-18', 
    horaEntrega: '09:00',
    estado: 'Pendiente',
    prioridad: 'Media'
  },
  { 
    id: 'PED-003', 
    cliente: 'Elena Paz', 
    items: 'Torta de Bodas (3 pisos) - Vainilla y Dulce de Leche', 
    total: 85000, 
    sena: 40000, 
    fechaEntrega: '2026-03-25', 
    horaEntrega: '11:00',
    estado: 'Listo para Retiro',
    prioridad: 'Alta'
  }
];

import { api } from '../services/api';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPedido, setNewPedido] = useState({
    cliente: '',
    items: '',
    total: '',
    sena: '',
    fechaEntrega: '',
    horaEntrega: '',
    estado: 'Pendiente',
    prioridad: 'Media'
  });

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const data = await api.pedidos.getAll();
      setPedidos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPedido = async (e) => {
    e.preventDefault();
    try {
      const resp = await api.pedidos.create({
        ...newPedido,
        total: parseFloat(newPedido.total),
        sena: parseFloat(newPedido.sena)
      });
      setPedidos([resp, ...pedidos]);
      setShowAddModal(false);
      setNewPedido({ cliente: '', items: '', total: '', sena: '', fechaEntrega: '', horaEntrega: '', estado: 'Pendiente', prioridad: 'Media' });
    } catch (err) {
      alert('Error al registrar pedido');
    }
  };

  const deletePedido = async (id) => {
    if (window.confirm('¿Eliminar este pedido?')) {
      try {
        await api.pedidos.delete(id);
        setPedidos(pedidos.filter(p => p.id !== id));
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  };

  const updateEstado = async (id, nuevoEstado) => {
    try {
      await api.pedidos.update(id, { estado: nuevoEstado });
      setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
    } catch (err) {
      alert('Error al actualizar estado');
    }
  };

  const filteredPedidos = pedidos.filter(p => 
    p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.items && p.items.toLowerCase().includes(searchTerm.toLowerCase())) ||
    p.id.toString().includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Listo para Retiro': return 'var(--success)';
      case 'Procesando': return 'var(--primary)';
      case 'Cancelado': return '#ff4d4d';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '3.5rem', margin: 0 }}>Gestión de Pedidos</h1>
          <p className="page-subtitle" style={{ fontSize: '1.2rem', margin: '0.5rem 0 0 0' }}>Control estratégico de reservas y encargos especiales.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary" 
            style={{ padding: '0 32px', height: '54px', borderRadius: '18px', fontSize: '1rem', fontWeight: 800, boxShadow: '0 10px 30px rgba(253, 184, 19, 0.4)' }}
          >
            <Plus size={22} /> NUEVO ENCARGO
          </motion.button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Activos', value: pedidos.length, icon: ShoppingBag, color: 'var(--primary)' },
          { label: 'Ingresos por Señas', value: '$' + pedidos.reduce((acc, p) => acc + Number(p.sena), 0).toLocaleString(), icon: DollarSign, color: '#10b981' },
          { label: 'Pendientes de Entrega', value: pedidos.filter(p => p.estado !== 'Listo para Retiro').length, icon: Clock, color: '#f59e0b' },
          { label: 'Prioridad Alta', value: pedidos.filter(p => p.prioridad === 'Alta').length, icon: Bell, color: '#ef4444' }
        ].map((stat, i) => (
          <div key={i} className="bakery-card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'white' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pos-search-wrapper glass" style={{ maxWidth: '600px', height: '60px', marginBottom: '4rem', background: 'white' }}>
        <Search size={22} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Buscar pedidos por cliente, ID o producto..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ fontSize: '1.1rem' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
        {filteredPedidos.map((pedido) => (
          <motion.div 
            key={pedido.id} 
            layout
            className="bakery-card glass"
            whileHover={{ y: -10 }}
            style={{ padding: '2rem', background: 'white', border: '1px solid var(--border-light)', position: 'relative' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '1px' }}>{pedido.id}</span>
                <h3 className="serif" style={{ fontSize: '1.6rem', margin: '4px 0' }}>{pedido.cliente}</h3>
              </div>
              <span style={{ 
                padding: '6px 14px', 
                borderRadius: '10px', 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                background: pedido.prioridad === 'Alta' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.05)',
                color: pedido.prioridad === 'Alta' ? '#ef4444' : 'var(--text-muted)'
              }}>
                {pedido.prioridad.toUpperCase()}
              </span>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-main)', fontWeight: 600, fontSize: '1rem', lineHeight: '1.5' }}>
                <ShoppingBag size={18} style={{ marginTop: '4px', flexShrink: 0 }} />
                {pedido.items}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1.5rem', background: 'var(--bg-app)', borderRadius: '16px', marginBottom: '2rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Entrega Programada</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Calendar size={14} color="var(--primary)" /> {pedido.fechaEntrega}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>
                  <Clock size={14} color="var(--primary)" /> {pedido.horaEntrega} hs
                </div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Estado Financiero</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>${Number(pedido.total).toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>Seña: ${Number(pedido.sena).toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444' }}>Saldo: ${(pedido.total - pedido.sena).toLocaleString()}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <select 
                value={pedido.estado}
                onChange={(e) => updateEstado(pedido.id, e.target.value)}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-light)', 
                  fontWeight: 800, 
                  fontSize: '0.85rem',
                  color: getStatusColor(pedido.estado),
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Procesando">En Producción</option>
                <option value="Listo para Retiro">Listo para Retiro</option>
                <option value="Entregado">Entregado / Finalizado</option>
                <option value="Cancelado">Cancelado</option>
              </select>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary" style={{ width: '40px', height: '40px', padding: 0, borderRadius: '10px' }} title="Imprimir Comprobante">
                  <Printer size={18} />
                </button>
                <button 
                  onClick={() => deletePedido(pedido.id)}
                  className="btn btn-secondary" 
                  style={{ width: '40px', height: '40px', padding: 0, borderRadius: '10px', color: '#ff4d4d' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(61,44,30,0.5)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bakery-card glass" 
              style={{ width: '100%', maxWidth: '700px', padding: '3rem', background: 'white' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                <h2 className="serif" style={{ fontSize: '2.2rem' }}>Nuevo Encargo Especial</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={32} /></button>
              </div>

              <form onSubmit={handleAddPedido} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Cliente</label>
                    <input required type="text" placeholder="Nombre completo" value={newPedido.cliente} onChange={e => setNewPedido({...newPedido, cliente: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontWeight: 600 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Prioridad</label>
                    <select value={newPedido.prioridad} onChange={e => setNewPedido({...newPedido, prioridad: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontWeight: 600 }}>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Detalle del Pedido / Productos</label>
                  <textarea required placeholder="Ej: Torta 2kg Temática Spiderman, con mucho dulce de leche..." value={newPedido.items} onChange={e => setNewPedido({...newPedido, items: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontWeight: 600, minHeight: '80px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Total ($)</label>
                    <input required type="number" placeholder="0.00" value={newPedido.total} onChange={e => setNewPedido({...newPedido, total: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontWeight: 600 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Seña ($)</label>
                    <input required type="number" placeholder="0.00" value={newPedido.sena} onChange={e => setNewPedido({...newPedido, sena: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontWeight: 600 }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Fecha de Entrega</label>
                    <input required type="date" value={newPedido.fechaEntrega} onChange={e => setNewPedido({...newPedido, fechaEntrega: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontWeight: 600 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Hora</label>
                    <input required type="time" value={newPedido.horaEntrega} onChange={e => setNewPedido({...newPedido, horaEntrega: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontWeight: 600 }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ flex: 1, height: '54px' }}>CANCELAR</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '54px' }}>REGISTRAR PEDIDO</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pedidos;
