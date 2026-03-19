import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus,
    Trash2,
    PhoneCall,
    Search,
    User,
    Mail,
    MapPin,
    AlertCircle,
    CheckCircle2,
    CreditCard
} from 'lucide-react';
import { api } from '../services/api';

export default function ClientesList({ showToast }) {
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        direccion: '',
        saldo: 0
    });

    const fetchClientes = async () => {
        try {
            setLoading(true);
            const data = await api.clientes.getAll();
            setClientes(data);
        } catch (err) {
            console.error(err);
            if (showToast) showToast('Error al cargar clientes', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClientes(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await api.clientes.create(formData);
            setClientes([resp, ...clientes]);
            setIsModalOpen(false);
            setFormData({ nombre: '', apellido: '', telefono: '', email: '', direccion: '', saldo: 0 });
            if (showToast) showToast('Cliente registrado con éxito');
        } catch (err) {
            if (showToast) showToast('Error al registrar cliente', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Está seguro de eliminar este cliente?')) return;
        try {
            await api.clientes.delete(id);
            setClientes(prev => prev.filter(c => c.id !== id));
            if (showToast) showToast('Cliente eliminado');
        } catch (err) {
            if (showToast) showToast('Error al eliminar', 'error');
        }
    };

    const filteredClientes = clientes.filter(c => 
      `${c.nombre} ${c.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalDeuda = clientes.reduce((acc, c) => acc + (Number(c.saldo) || 0), 0);

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Gestión de Clientes</h1>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Base de datos centralizada de cuentas</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <UserPlus size={18} /> NUEVO CLIENTE
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="bakery-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>TOTAL CLIENTES</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>{clientes.length}</div>
              </div>
              <div className="bakery-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CRÉDITO TOTAL</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: totalDeuda > 0 ? 'var(--danger)' : 'var(--success)' }}>${totalDeuda.toLocaleString()}</div>
              </div>
            </div>

            <div className="bakery-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative', width: '350px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input 
                      type="text" 
                      placeholder="Buscar por nombre o apellido..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', outline: 'none' }}
                    />
                </div>
            </div>

            <div className="bakery-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="system-table">
                    <thead>
                        <tr>
                            <th>IDENTIFICACIÓN</th>
                            <th>RESIDENCIA / CONTACTO</th>
                            <th>SITUACIÓN CREDITICIA</th>
                            <th style={{ textAlign: 'right' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '4rem' }}>Cargando base de datos...</td></tr>
                        ) : filteredClientes.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '4rem' }}>No se encontraron registros</td></tr>
                        ) : filteredClientes.map((cliente) => (
                            <tr key={cliente.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '8px',
                                            background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem'
                                        }}>
                                            {cliente.nombre[0]}{cliente.apellido[0]}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{cliente.nombre} {cliente.apellido}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: #{cliente.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><PhoneCall size={12} /> {cliente.telefono}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.7 }}><MapPin size={12} /> {cliente.direccion || 'No especificada'}</div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {cliente.saldo > 0 ? <AlertCircle size={14} color="var(--danger)" /> : <CheckCircle2 size={14} color="var(--success)" />}
                                        <span style={{ 
                                            fontSize: '0.85rem', fontWeight: 800,
                                            color: cliente.saldo > 0 ? 'var(--danger)' : 'var(--success)'
                                        }}>
                                            ${(Number(cliente.saldo) || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button onClick={() => handleDelete(cliente.id)} style={{ padding: '0.4rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bakery-card"
                            style={{ width: '500px', padding: '2rem' }}
                        >
                            <h2 style={{ marginTop: 0, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Alta de Cliente</h2>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>NOMBRE</label>
                                        <input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>APELLIDO</label>
                                        <input required value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>TELÉFONO</label>
                                    <input value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>DIRECCIÓN</label>
                                    <input value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>SALDO INICIAL ($)</label>
                                    <input type="number" value={formData.saldo} onChange={e => setFormData({...formData, saldo: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>CANCELAR</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>GUARDAR</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
