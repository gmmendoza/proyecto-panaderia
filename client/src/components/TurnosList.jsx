import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CalendarPlus,
    Trash2,
    CheckCircle2,
    Timer,
    ClipboardList
} from 'lucide-react';
import { api } from '../services/api';

export default function TurnosList() {
    const [turnos, setTurnos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        clienteId: '',
        fechaHora: '',
        estado: 'Pendiente'
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
            await api.turnos.create({ ...formData, clienteId: parseInt(formData.clienteId) });
            await fetchData();
            setIsModalOpen(false);
            setFormData({ clienteId: '', fechaHora: '', estado: 'Pendiente' });
        } catch (err) {
            alert('Error al crear turno');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.turnos.updateEstado(id, newStatus);
            await fetchData();
        } catch (err) {
            alert('Error al actualizar estado');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Confirmas la eliminación de este turno/pedido?')) return;
        try {
            await api.turnos.delete(id);
            setTurnos(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert('Error al eliminar turno');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">Turnos y Pedidos</h1>
                    <p className="page-subtitle">Visualiza y administra las entregas y reservas pendientes.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <CalendarPlus size={16} strokeWidth={2.5} />
                    Nuevo Registro
                </button>
            </header>

            <div className="card table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Programación</th>
                            <th>Estado</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="empty-state"><div className="empty-state-text">Cargando datos...</div></td></tr>
                        ) : turnos.length === 0 ? (
                            <tr>
                                <td colSpan="4">
                                    <div className="empty-state">
                                        <ClipboardList className="empty-state-icon" size={48} strokeWidth={1} />
                                        <p className="empty-state-text">No hay pedidos registrados.</p>
                                        <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setIsModalOpen(true)}>Programar primer pedido</button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            turnos.map((turno, index) => {
                                const isCompleted = turno.estado === 'Completado';
                                return (
                                    <tr key={turno.id} className="list-item-enter" style={{ animationDelay: `${index * 0.05}s` }}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '10px',
                                                    background: isCompleted ? 'var(--success-bg)' : 'var(--warning-bg)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: isCompleted ? 'var(--success-text)' : 'var(--warning-text)'
                                                }}>
                                                    <UsersRound size={18} strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                                        {turno.Cliente ? `${turno.Cliente.nombre} ${turno.Cliente.apellido}` : 'Cargando...'}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Ticket: #TK-{turno.id.toString().slice(-4)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 500 }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                                    <Timer size={14} strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <div>{new Date(turno.fechaHora).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(turno.fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`status-badge ${isCompleted ? 'status-completed' : 'status-pending'}`} style={{ gap: '6px', padding: '6px 12px' }}>
                                                {isCompleted ? <CheckCircle2 size={12} strokeWidth={3} /> : <Timer size={12} strokeWidth={3} />}
                                                {turno.estado}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                {!isCompleted && (
                                                    <button
                                                        className="btn btn-secondary"
                                                        style={{ padding: '8px', width: '36px', height: '36px', color: 'var(--success-text)', background: 'var(--success-bg)', borderColor: 'transparent' }}
                                                        onClick={() => handleStatusChange(turno.id, 'Completado')}
                                                        title="Marcar como Completado"
                                                    >
                                                        <CheckCircle2 size={16} strokeWidth={2.5} />
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-secondary btn-danger"
                                                    style={{ padding: '8px', width: '36px', height: '36px' }}
                                                    onClick={() => handleDelete(turno.id)}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} strokeWidth={2} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <motion.div
                        className="modal-content"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                        <div className="modal-header">
                            <h2 className="modal-title">Programar Nuevo Turno</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="input-label">Cliente Asociado</label>
                                <select className="input-field" required name="clienteId" value={formData.clienteId} onChange={handleInputChange}>
                                    <option value="" disabled>Selecciona un cliente...</option>
                                    {clientes.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre} {c.apellido} (ID: {c.id})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Fecha y Hora</label>
                                <input className="input-field" required type="datetime-local" name="fechaHora" value={formData.fechaHora} onChange={handleInputChange} />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Crear Registro</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
