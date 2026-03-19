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
    Filter,
    X,
    Clock,
    Calendar,
    PlusCircle,
    User
} from 'lucide-react';
import { api } from '../services/api';

const TurnosList = ({ showToast }) => {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        clienteNombre: '',
        fechaHora: '',
        nota: ''
    });

    useEffect(() => {
        fetchTurnos();
    }, []);

    const fetchTurnos = async () => {
        try {
            setLoading(true);
            const data = await api.turnos.getAll();
            setTurnos(data);
        } catch (err) {
            console.error(err);
            if (showToast) showToast('Error al cargar turnos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTurno = {
              ...formData,
              Cliente: { nombre: formData.clienteNombre, apellido: '' },
              estado: 'Pendiente'
            };
            const resp = await api.turnos.create(newTurno);
            setTurnos([resp, ...turnos]);
            setIsModalOpen(false);
            setFormData({ clienteNombre: '', fechaHora: '', nota: '' });
            if (showToast) showToast('Reserva creada con éxito');
        } catch (err) {
            if (showToast) showToast('Error al crear reserva', 'error');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.turnos.update(id, { estado: newStatus });
            setTurnos(prev => prev.map(t => t.id === id ? { ...t, estado: newStatus } : t));
            if (showToast) showToast(`Reserva ${newStatus.toLowerCase()}`);
        } catch (err) {
            if (showToast) showToast('Error al actualizar estado', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar esta reserva?')) {
            try {
                await api.turnos.delete(id);
                setTurnos(prev => prev.filter(t => t.id !== id));
                if (showToast) showToast('Reserva eliminada');
            } catch (err) {
                if (showToast) showToast('Error al eliminar', 'error');
            }
        }
    };

    const filteredTurnos = turnos.filter(t => 
      `${t.Cliente?.nombre || ''} ${t.Cliente?.apellido || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Agenda de Entregas</h1>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Control de retiros programados y citas de clientes</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <PlusCircle size={18} /> NUEVA CITA
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bakery-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input 
                        type="text" 
                        placeholder="Buscar por cliente..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', outline: 'none' }}
                    />
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>PENDIENTES: {turnos.filter(t => t.estado !== 'Completado').length}</span>
                    <span style={{ color: 'var(--border-dark)' }}>|</span>
                    <span>TOTAL: {turnos.length}</span>
                </div>
            </div>

            {/* Main Table */}
            <div className="bakery-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="system-table">
                    <thead>
                        <tr>
                            <th>Horario / Fecha</th>
                            <th>Cliente</th>
                            <th>Notas / Observaciones</th>
                            <th>Estado</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>Consultando agenda...</td></tr>
                        ) : filteredTurnos.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>No hay entregas programadas</td></tr>
                        ) : filteredTurnos.map(t => {
                            const date = new Date(t.fechaHora);
                            const isCompleted = t.estado === 'Completado';
                            return (
                                <tr key={t.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ 
                                                width: '32px', 
                                                height: '32px', 
                                                borderRadius: '6px', 
                                                background: isCompleted ? '#f0fdf4' : 'rgba(217, 119, 6, 0.1)',
                                                color: isCompleted ? 'var(--success)' : 'var(--primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Clock size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800 }}>{date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}hs</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{date.toLocaleDateString('es-AR')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700 }}>{t.Cliente?.nombre} {t.Cliente?.apellido}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {t.id}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', maxWidth: '300px' }}>{t.nota || 'Sin notas adicionales'}</div>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleStatusChange(t.id, isCompleted ? 'Pendiente' : 'Completado')}
                                            style={{ 
                                                padding: '4px 12px', 
                                                borderRadius: '20px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 800, 
                                                border: 'none',
                                                cursor: 'pointer',
                                                background: isCompleted ? '#f0fdf4' : '#fff7ed',
                                                color: isCompleted ? '#16a34a' : '#d97706',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            {isCompleted ? <CheckCircle2 size={12} /> : <Timer size={12} />}
                                            {t.estado.toUpperCase()}
                                        </button>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {!isCompleted && <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => handleStatusChange(t.id, 'Completado')}><CheckCircle2 size={16} color="var(--success)" /></button>}
                                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => handleDelete(t.id)}><Trash2 size={16} color="var(--danger)" /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bakery-card" 
                            style={{ width: '400px', padding: '2rem' }}
                        >
                            <h2 style={{ marginTop: 0, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Nueva Cita / Entrega</h2>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>CLIENTE</label>
                                    <input required name="clienteNombre" placeholder="Nombre completo" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={formData.clienteNombre} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>FECHA Y HORA</label>
                                    <input required type="datetime-local" name="fechaHora" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={formData.fechaHora} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>NOTAS</label>
                                    <textarea name="nota" placeholder="Opcional: detalles del retiro..." style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)', minHeight: '60px' }} value={formData.nota} onChange={handleInputChange} />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>CANCELAR</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>AGENDAR</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TurnosList;

export default TurnosList;
