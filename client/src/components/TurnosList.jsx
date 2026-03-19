import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarPlus,
    Trash2,
    CheckCircle2,
    Timer,
    ClipboardList,
    UsersRound,
    Search,
    Filter
} from 'lucide-react';
import { api } from '../services/api';

const MOCK_TURNOS = [
  { id: 101, Cliente: { nombre: 'Carlos', apellido: 'Pérez' }, fechaHora: '2026-03-17T09:00:00', estado: 'Pendiente', nota: 'Recoger 2kg pan francés' },
  { id: 102, Cliente: { nombre: 'Marta', apellido: 'Gómez' }, fechaHora: '2026-03-17T10:30:00', estado: 'Pendiente', nota: 'Pedido de facturas' },
  { id: 103, Cliente: { nombre: 'Juan', apellido: 'Rodríguez' }, fechaHora: '2026-03-16T08:00:00', estado: 'Completado', nota: '' },
  { id: 104, Cliente: { nombre: 'Lucía', apellido: 'Fernández' }, fechaHora: '2026-03-18T16:00:00', estado: 'Pendiente', nota: 'Torta de cumple' },
  { id: 105, Cliente: { nombre: 'Roberto', apellido: 'Sosa' }, fechaHora: '2026-03-17T17:45:00', estado: 'Pendiente', nota: 'Catering evento' },
];

export function TurnosList() {
    const [turnos, setTurnos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

    const [formData, setFormData] = useState({
        clienteNombre: '',
        fechaHora: '',
        estado: 'Pendiente',
        nota: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [turnosData, clientesData] = await Promise.all([
                api.turnos.getAll(),
                api.clientes.getAll()
            ]);
            setTurnos(turnosData);
            setClientes(clientesData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Mocking the relation for the UI
            const newTurno = {
              ...formData,
              id: Date.now(),
              Cliente: { nombre: formData.clienteNombre, apellido: '' }
            };
            const resp = await api.turnos.create(newTurno);
            setTurnos([resp, ...turnos]);
            setIsModalOpen(false);
            setFormData({ clienteNombre: '', fechaHora: '', estado: 'Pendiente', nota: '' });
        } catch (err) {
            alert('Error al crear registro');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.turnos.update(id, { estado: newStatus });
            setTurnos(prev => prev.map(t => t.id === id ? { ...t, estado: newStatus } : t));
        } catch (err) {
            alert('Error al actualizar');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este registro?')) {
            try {
                await api.turnos.delete(id);
                setTurnos(prev => prev.filter(t => t.id !== id));
            } catch (err) {
                alert('Error al eliminar');
            }
        }
    };

    const filteredTurnos = turnos.filter(t => 
      `${t.Cliente?.nombre} ${t.Cliente?.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 className="serif" style={{ fontSize: '2.5rem', margin: 0 }}>Turnos y Pedidos</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gestión estratégica de entregas y reservas.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <CalendarPlus size={18} />
                    NUEVA RESERVA
                </button>
            </header>

            <div className="bakery-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-app)' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border-light)', width: '300px' }}>
                      <Search size={18} color="var(--text-muted)" />
                      <input 
                        type="text" 
                        placeholder="Buscar por cliente o ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', background: 'white', borderRadius: '10px', border: '1px solid var(--border-light)', padding: '4px' }}>
                      <button 
                        onClick={() => setViewMode('list')}
                        style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: viewMode === 'list' ? 'var(--primary)' : 'transparent', color: viewMode === 'list' ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                      >
                        Lista
                      </button>
                      <button 
                        onClick={() => setViewMode('grid')}
                        style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: viewMode === 'grid' ? 'var(--primary)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                      >
                        Cuadrícula
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <Filter size={14} color="var(--primary)" />
                      <span>Total: {turnos.length}</span>
                    </div>
                  </div>
                </div>

                {viewMode === 'list' ? (

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#F8F9FB' }}>
                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>CLIENTE</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROGRAMACIÓN</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>ESTADO</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</td></tr>
                            ) : filteredTurnos.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                        <ClipboardList size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                        <p>No se encontraron registros.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTurnos.map((turno) => {
                                    const isCompleted = turno.estado === 'Completado';
                                    return (
                                        <motion.tr 
                                          key={turno.id} 
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }}
                                          className="table-row-hover"
                                        >
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ 
                                                  width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', 
                                                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700
                                                }}>
                                                  {turno.Cliente?.nombre?.[0]}{turno.Cliente?.apellido?.[0]}
                                                </div>
                                                <div>
                                                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{turno.Cliente?.nombre} {turno.Cliente?.apellido}</div>
                                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{turno.id}</div>
                                                </div>
                                              </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ background: '#f5f5f5', padding: '6px', borderRadius: '8px' }}>
                                                  <Timer size={14} color="var(--text-muted)" />
                                                </div>
                                                <div>
                                                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{new Date(turno.fechaHora).toLocaleDateString('es-AR')}</div>
                                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(turno.fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</div>
                                                </div>
                                              </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                              <span style={{ 
                                                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                                                background: isCompleted ? 'var(--success-bg)' : '#FFF0E6',
                                                color: isCompleted ? 'var(--success)' : 'var(--primary)'
                                              }}>
                                                {isCompleted ? <CheckCircle2 size={12} /> : <Timer size={12} />}
                                                {turno.estado.toUpperCase()}
                                              </span>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                {!isCompleted && (
                                                  <button 
                                                    onClick={() => handleStatusChange(turno.id, 'Completado')}
                                                    className="row-btn" style={{ color: 'var(--success)' }}
                                                  >
                                                    <CheckCircle2 size={18} />
                                                  </button>
                                                )}
                                                <button 
                                                  onClick={() => handleDelete(turno.id)}
                                                  className="row-btn" style={{ color: '#ff4d4d' }}
                                                >
                                                  <Trash2 size={18} />
                                                </button>
                                              </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                ) : (
                  <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', background: 'var(--bg-app)' }}>
                    {filteredTurnos.map(turno => {
                      const hour = new Date(turno.fechaHora).getHours();
                      const shift = hour < 12 ? 'Mañana' : hour < 19 ? 'Tarde' : 'Noche';
                      const isCompleted = turno.estado === 'Completado';
                      
                      return (
                        <motion.div 
                          key={turno.id}
                          whileHover={{ scale: 1.02 }}
                          className="bakery-card"
                          style={{ padding: '1.5rem', background: 'white', position: 'relative', borderLeft: `4px solid ${isCompleted ? 'var(--success)' : 'var(--primary)'}` }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{shift} · {new Date(turno.fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => handleDelete(turno.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          </div>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800 }}>{turno.Cliente?.nombre} {turno.Cliente?.apellido}</h4>
                          <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{turno.nota || 'Sin observaciones'}</p>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isCompleted ? 'var(--success)' : 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {isCompleted ? <CheckCircle2 size={14} /> : <Timer size={14} />}
                              {turno.estado}
                            </span>
                            {!isCompleted && (
                              <button 
                                onClick={() => handleStatusChange(turno.id, 'Completado')}
                                className="btn btn-primary" 
                                style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
                              >
                                ENTREGAR
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
              {isModalOpen && (
                  <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <motion.div
                          className="bakery-card"
                          initial={{ y: 50, opacity: 0, scale: 0.95 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{ y: 50, opacity: 0, scale: 0.95 }}
                          style={{ width: '500px', padding: '3.5rem', background: 'white', borderRadius: '40px', boxShadow: '0 30px 80px rgba(0,0,0,0.2)' }}
                      >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h2 className="serif" style={{ fontSize: '2.4rem', margin: 0 }}>Nueva Entrega</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'var(--bg-app)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
                          </div>

                          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                              <div className="form-group">
                                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Nombre del Cliente</label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-app)', padding: '1rem 1.5rem', borderRadius: '15px', border: '1px solid var(--border-light)' }}>
                                    <UsersRound size={20} color="var(--primary)" />
                                    <input 
                                      className="input-field-modal" 
                                      placeholder="Ej. Juan Pérez..."
                                      required 
                                      name="clienteNombre" 
                                      value={formData.clienteNombre}
                                      onChange={handleInputChange} 
                                      style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, fontSize: '1rem' }}
                                    />
                                  </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Fecha y Hora de Retiro</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-app)', padding: '1rem 1.5rem', borderRadius: '15px', border: '1px solid var(--border-light)' }}>
                                      <Timer size={20} color="var(--primary)" />
                                      <input 
                                        className="input-field-modal" 
                                        required 
                                        type="datetime-local" 
                                        name="fechaHora" 
                                        value={formData.fechaHora} 
                                        onChange={handleInputChange} 
                                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, fontSize: '1rem' }}
                                      />
                                    </div>
                                </div>
                              </div>

                              <div className="form-group">
                                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Observaciones / Notas</label>
                                  <textarea 
                                    name="nota"
                                    placeholder="Detalles especiales del pedido..."
                                    value={formData.nota}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '1.25rem', borderRadius: '15px', border: '1px solid var(--border-light)', background: 'var(--bg-app)', fontSize: '1rem', fontWeight: 600, minHeight: '100px', resize: 'none', outline: 'none' }}
                                  />
                              </div>

                              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, height: '60px', borderRadius: '18px' }}>CANCELAR</button>
                                  <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '60px', borderRadius: '18px', fontWeight: 900 }}>GUARDAR CITA</button>
                              </div>
                          </form>
                      </motion.div>
                  </div>
              )}
            </AnimatePresence>

            <style>{`
              .table-row-hover:hover {
                background: #FDFBF7;
              }
              .row-btn {
                background: white;
                border: 1px solid var(--border-light);
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
              }
              .row-btn:hover {
                transform: scale(1.1);
                box-shadow: var(--shadow-sm);
              }
              .input-field:focus {
                outline: none;
                border-color: var(--primary);
                box-shadow: 0 0 0 3px var(--primary-light);
              }
            `}</style>
        </motion.div>
    );
}

export default TurnosList;
