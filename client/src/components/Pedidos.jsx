import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Trash2, 
  Calendar,
  X,
  Printer,
  Bell,
  MessageSquare,
  Clock,
  DollarSign,
  ChevronRight,
  User,
  MoreVertical,
  PlusCircle,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

const Pedidos = ({ showToast }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
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
      if (showToast) showToast('Error al cargar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPedido = async (e) => {
    e.preventDefault();
    try {
      const resp = await api.pedidos.create({
        ...newPedido,
        total: Number(newPedido.total),
        sena: Number(newPedido.sena)
      });
      setPedidos([resp, ...pedidos]);
      setShowAddModal(false);
      setNewPedido({ cliente: '', items: '', total: '', sena: '', fechaEntrega: '', horaEntrega: '', estado: 'Pendiente', prioridad: 'Media' });
      if (showToast) showToast('Pedido registrado con éxito');
    } catch (err) {
      if (showToast) showToast('Error al registrar pedido', 'error');
    }
  };

  const deletePedido = async (id) => {
    if (window.confirm('¿Eliminar este pedido definitivamente?')) {
      try {
        await api.pedidos.delete(id);
        setPedidos(pedidos.filter(p => p.id !== id));
        if (showToast) showToast('Pedido eliminado');
      } catch (err) {
        if (showToast) showToast('Error al eliminar', 'error');
      }
    }
  };

  const updateEstado = async (id, nuevoEstado) => {
    try {
      setUpdatingId(id);
      await api.pedidos.update(id, { estado: nuevoEstado });
      setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
      if (showToast) showToast(`Estado actualizado: ${nuevoEstado}`);
    } catch (err) {
      if (showToast) showToast('Error al actualizar estado', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const sendWhatsApp = (pedido) => {
    const total = Number(pedido.total || 0);
    const sena = Number(pedido.sena || 0);
    const text = `Hola ${pedido.cliente}! Te escribimos de Panadería El Aromo. Tu pedido #${pedido.id} está: ${pedido.estado}. Saldo a pagar: $${(total - sena).toLocaleString()}. ¡Saludos!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredPedidos = pedidos.filter(p => 
    (p.cliente || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.id || "").toString().includes(searchTerm)
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Listo para Retiro': return { bg: '#f0fdf4', color: '#16a34a' };
      case 'Procesando': return { bg: '#eff6ff', color: '#2563eb' };
      case 'Cancelado': return { bg: '#fef2f2', color: '#dc2626' };
      default: return { bg: '#f8fafc', color: '#64748b' };
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Gestión de Pedidos</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Seguimiento de encargos y estados de entrega</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <PlusCircle size={18} /> NUEVO ENCARGO
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Activos', val: pedidos.length, icon: ShoppingBag, color: 'var(--primary)' },
          { label: 'Señas Recibidas', val: '$' + pedidos.reduce((acc, p) => acc + Number(p.sena || 0), 0).toLocaleString(), icon: DollarSign, color: 'var(--success)' },
          { label: 'Hoy entrega', val: pedidos.filter(p => p.fechaEntrega === new Date().toISOString().split('T')[0]).length, icon: Calendar, color: '#f59e0b' },
          { label: 'Prioridad Alta', val: pedidos.filter(p => p.prioridad === 'Alta').length, icon: Bell, color: 'var(--danger)' }
        ].map((s, i) => (
          <div key={i} className="bakery-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bakery-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Buscar por cliente o ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bakery-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="system-table">
          <thead>
            <tr>
              <th>ID / Fecha</th>
              <th>Cliente</th>
              <th>Detalle Pedido</th>
              <th>Total / Saldo</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>Consultando base de datos de pedidos...</td></tr>
            ) : filteredPedidos.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>No hay pedidos registrados</td></tr>
            ) : filteredPedidos.map(p => {
              const st = getStatusStyle(p.estado);
              const total = Number(p.total || 0);
              const sena = Number(p.sena || 0);
              const saldo = total - sena;
              
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--primary)' }}>{p.id}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.fechaEntrega} {p.horaEntrega}hs</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{p.cliente}</div>
                    {p.prioridad === 'Alta' && <span style={{ fontSize: '0.65rem', background: '#fef2f2', color: '#dc2626', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>ALTA PRIORIDAD</span>}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.items}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800 }}>${total.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: saldo > 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {saldo > 0 ? `Pagó: $${sena.toLocaleString()} (Debe: $${saldo.toLocaleString()})` : 'PAGADO'}
                    </div>
                  </td>
                  <td>
                    <select 
                      value={p.estado} 
                      onChange={(e) => updateEstado(p.id, e.target.value)}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        border: '1px solid var(--border-light)',
                        background: st.bg,
                        color: st.color,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Procesando">En Producción</option>
                      <option value="Listo para Retiro">Listo</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => sendWhatsApp(p)}><MessageSquare size={16} color="#25D366" /></button>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => deletePedido(p.id)}><Trash2 size={16} color="var(--danger)" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bakery-card" 
              style={{ width: '500px', padding: '2rem' }}
            >
              <h2 style={{ marginTop: 0, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Nuevo Encargo</h2>
              <form onSubmit={handleAddPedido} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>CLIENTE</label>
                    <input required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newPedido.cliente} onChange={e => setNewPedido({...newPedido, cliente: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>PRIORIDAD</label>
                    <select style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newPedido.prioridad} onChange={e => setNewPedido({...newPedido, prioridad: e.target.value})}>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>DETALLE PRODUCTOS</label>
                   <textarea placeholder="Ej: Torta temática, 2kg de facturas..." style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)', minHeight: '60px' }} value={newPedido.items} onChange={e => setNewPedido({...newPedido, items: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>FECHA ENTREGA</label>
                    <input required type="date" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newPedido.fechaEntrega} onChange={e => setNewPedido({...newPedido, fechaEntrega: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>HORA</label>
                    <input required type="time" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newPedido.horaEntrega} onChange={e => setNewPedido({...newPedido, horaEntrega: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>TOTAL ($)</label>
                    <input required type="number" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newPedido.total} onChange={e => setNewPedido({...newPedido, total: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>SEÑA ($)</label>
                    <input required type="number" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newPedido.sena} onChange={e => setNewPedido({...newPedido, sena: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>CANCELAR</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>REGISTRAR</button>
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
