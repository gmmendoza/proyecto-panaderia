import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    UserPlus,
    Trash2,
    PhoneCall,
    Banknote,
    UsersRound
} from 'lucide-react';
import { api } from '../services/api';

export default function ClientesList() {
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        saldo: 0
    });

    const fetchClientes = async () => {
        try {
            setLoading(true);
            const data = await api.clientes.getAll();
            setClientes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClientes(); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.clientes.create(formData);
            await fetchClientes();
            setIsModalOpen(false);
            setFormData({ nombre: '', apellido: '', telefono: '', saldo: 0 });
        } catch (err) {
            alert('Error al crear cliente');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Confirmas la eliminación de este cliente?')) return;
        try {
            await api.clientes.delete(id);
            setClientes(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert('Error al eliminar cliente');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">Clientes</h1>
                    <p className="page-subtitle">Gestiona el directorio de clientes y sus saldos de cuenta.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <UserPlus size={16} strokeWidth={2.5} />
                    Nuevo Cliente
                </button>
            </header>

            <div className="card table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Contacto</th>
                            <th>Balance</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="empty-state"><div className="empty-state-text">Cargando datos...</div></td></tr>
                        ) : clientes.length === 0 ? (
                            <tr>
                                <td colSpan="4">
                                    <div className="empty-state">
                                        <UsersRound className="empty-state-icon" size={48} strokeWidth={1} />
                                        <p className="empty-state-text">No hay clientes registrados.</p>
                                        <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setIsModalOpen(true)}>Crear el primer cliente</button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            clientes.map((cliente, index) => (
                                <tr key={cliente.id} className="list-item-enter" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{
                                                width: '40px', height: '40px', borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #FFF9F5 0%, #F5E6DA 100%)',
                                                border: '1px solid var(--border-light)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 700,
                                                boxShadow: 'var(--shadow-sm)'
                                            }}>
                                                {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{cliente.nombre} {cliente.apellido}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Ref: #CL{cliente.id.toString().slice(-4)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369A1' }}>
                                                <PhoneCall size={14} strokeWidth={2.5} />
                                            </div>
                                            {cliente.telefono || 'Sin teléfono'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            fontWeight: 700, 
                                            padding: '4px 12px',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            background: cliente.saldo > 0 ? 'var(--danger-bg)' : 'var(--success-bg)',
                                            color: cliente.saldo > 0 ? 'var(--danger-text)' : 'var(--success-text)'
                                        }}>
                                            <Banknote size={16} strokeWidth={2.5} />
                                            ${Math.abs(Number(cliente.saldo)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                            {cliente.saldo > 0 && <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>(Deuda)</span>}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className="btn btn-secondary btn-danger" style={{ padding: '8px', minWidth: '36px', height: '36px' }} onClick={() => handleDelete(cliente.id)}>
                                            <Trash2 size={16} strokeWidth={2} />
                                        </button>
                                    </td>
                                </tr>
                            ))
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
                            <h2 className="modal-title">Registrar Cliente</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Nombre</label>
                                    <input className="input-field" required name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Ej. Juan" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Apellido</label>
                                    <input className="input-field" required name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Ej. Pérez" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Número de Teléfono</label>
                                <input className="input-field" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Opcional" />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Saldo Inicial ($)</label>
                                <input className="input-field" type="number" step="0.01" name="saldo" value={formData.saldo} onChange={handleInputChange} placeholder="0.00" />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Guardar</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
