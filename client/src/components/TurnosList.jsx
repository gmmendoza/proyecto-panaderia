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
  { id: 101, Cliente: { nombre: 'Carlos', apellido: 'Pérez' }, fechaHora: '2026-03-17T09:00:00', estado: 'Pendiente' },
  { id: 102, Cliente: { nombre: 'Marta', apellido: 'Gómez' }, fechaHora: '2026-03-17T10:30:00', estado: 'Pendiente' },
  { id: 103, Cliente: { nombre: 'Juan', apellido: 'Rodríguez' }, fechaHora: '2026-03-16T08:00:00', estado: 'Completado' },
  { id: 104, Cliente: { nombre: 'Lucía', apellido: 'Fernández' }, fechaHora: '2026-03-18T11:00:00', estado: 'Pendiente' },
];

export function TurnosList() {
    const [turnos, setTurnos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        clienteId: '',
        fechaHora: '',
        estado: 'Pendiente'
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [turnosData, clientesData] = await Promise.all([
                api.turnos.getAll().catch(() => MOCK_TURNOS),
                api.clientes.getAll().catch(() => [])
            ]);
            setTurnos(turnosData);
            setClientes(clientesData);
        } catch (err) {
            setTurnos(MOCK_TURNOS);
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
            // Mock behavior for demo
            const newTurno = {
              id: Math.floor(Math.random() * 1000),
              Cliente: { nombre: 'Nuevo', apellido: 'Cliente' },
              fechaHora: formData.fechaHora,
              estado: 'Pendiente'
            };
            setTurnos([newTurno, ...turnos]);
            setIsModalOpen(false);
            setFormData({ clienteId: '', fechaHora: '', estado: 'Pendiente' });
        } catch (err) {
            alert('Error al crear registro');
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setTurnos(prev => prev.map(t => t.id === id ? { ...t, estado: newStatus } : t));
    };

    const handleDelete = (id) => {
        setTurnos(prev => prev.filter(t => t.id !== id));
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border-light)', width: '300px' }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input 
                      type="text" 
                      placeholder="Buscar por cliente..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem 1rem', background: 'white', borderRadius: '10px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <Filter size={14} color="var(--primary)" />
                      <span>Pendientes: {turnos.filter(t => t.estado === 'Pendiente').length}</span>
                    </div>
                  </div>
                </div>

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
            </div>

            {/* Modal */}
            <AnimatePresence>
              {isModalOpen && (
                  <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <motion.div
                          className="bakery-card"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 20, opacity: 0 }}
                          style={{ width: '400px', padding: '2.5rem' }}
                      >
                          <h2 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Programar Entrega</h2>
                          <form onSubmit={handleSubmit}>
                              <div style={{ marginBottom: '1.5rem' }}>
                                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>DNI / Cliente</label>
                                  <input 
                                    className="input-field" 
                                    placeholder="Nombre del cliente..."
                                    required name="clienteId" 
                                    onChange={(e) => setFormData({...formData, clienteId: e.target.value})} 
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
                                  />
                              </div>
                              <div style={{ marginBottom: '2rem' }}>
                                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Fecha y Hora</label>
                                  <input 
                                    className="input-field" 
                                    required type="datetime-local" 
                                    name="fechaHora" 
                                    value={formData.fechaHora} 
                                    onChange={handleInputChange} 
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
                                  />
                              </div>

                              <div style={{ display: 'flex', gap: '1rem' }}>
                                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>Cancelar</button>
                                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar</button>
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
