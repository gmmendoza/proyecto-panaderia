import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus,
    Trash2,
    PhoneCall,
    Banknote,
    UsersRound,
    Search,
    ChevronDown
} from 'lucide-react';
import { api } from '../services/api';

const MOCK_CLIENTES = [
  { id: 201, nombre: 'Ana', apellido: 'López', telefono: '11 4455-6677', saldo: -1500 },
  { id: 202, nombre: 'Roberto', apellido: 'García', telefono: '11 2233-4455', saldo: 2500 },
  { id: 203, nombre: 'Elena', apellido: 'Paz', telefono: '11 9988-7766', saldo: 0 },
  { id: 204, nombre: 'Mariano', apellido: 'Sosa', telefono: '11 5566-7788', saldo: 4200 },
];

export default function ClientesList() {
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        saldo: 0
    });

    const fetchClientes = async () => {
        try {
            setLoading(true);
            const data = await api.clientes.getAll().catch(() => MOCK_CLIENTES);
            setClientes(data);
        } catch (err) {
            setClientes(MOCK_CLIENTES);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClientes(); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCliente = {
          ...formData,
          id: Math.floor(Math.random() * 1000)
        };
        setClientes([newCliente, ...clientes]);
        setIsModalOpen(false);
        setFormData({ nombre: '', apellido: '', telefono: '', saldo: 0 });
    };

    const handleDelete = (id) => {
        setClientes(prev => prev.filter(c => c.id !== id));
    };

    const filteredClientes = clientes.filter(c => 
      `${c.nombre} ${c.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalDeuda = clientes.reduce((acc, c) => acc + (c.saldo > 0 ? c.saldo : 0), 0);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 className="serif" style={{ fontSize: '2.5rem', margin: 0 }}>Directorio de Clientes</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gestión integral de cuentas y contactos.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <UserPlus size={18} />
                    NUEVO CLIENTE
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="bakery-card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>TOTAL CLIENTES</div>
                <div className="serif" style={{ fontSize: '2rem', color: 'var(--primary)' }}>{clientes.length}</div>
              </div>
              <div className="bakery-card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CRÉDITO EN CALLE</div>
                <div className="serif" style={{ fontSize: '2rem', color: 'var(--danger)' }}>${totalDeuda.toLocaleString()}</div>
              </div>
            </div>

            <div className="bakery-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-app)', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border-light)', width: '300px' }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input 
                      type="text" 
                      placeholder="Buscar cliente..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F8F9FB', textAlign: 'left' }}>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>CLIENTE</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>CONTACTO</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>ESTADO DE CUENTA</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '4rem' }}>Cargando...</td></tr>
                            ) : filteredClientes.map((cliente) => (
                                <tr key={cliente.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '40px', height: '40px', borderRadius: '50%',
                                                background: 'var(--primary-light)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'var(--primary)', fontWeight: 700
                                            }}>
                                                {cliente.nombre[0]}{cliente.apellido[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{cliente.nombre} {cliente.apellido}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{cliente.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                            <PhoneCall size={14} color="var(--primary)" />
                                            {cliente.telefono}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{ 
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                                            background: cliente.saldo > 0 ? 'var(--danger-bg)' : 'var(--success-bg)',
                                            color: cliente.saldo > 0 ? 'var(--danger)' : 'var(--success)'
                                        }}>
                                            {cliente.saldo > 0 ? `DEBE $${cliente.saldo}` : cliente.saldo < 0 ? `SALDO $${Math.abs(cliente.saldo)}` : 'AL DÍA'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                        <button className="row-btn" style={{ color: '#ff4d4d', marginLeft: 'auto' }} onClick={() => handleDelete(cliente.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div
                            className="bakery-card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            style={{ width: '450px', padding: '2.5rem' }}
                        >
                            <h2 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Registrar Nuevo Cliente</h2>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Nombre</label>
                                        <input className="input-field" required name="nombre" value={formData.nombre} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Apellido</label>
                                        <input className="input-field" required name="apellido" value={formData.apellido} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)' }} />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Teléfono</label>
                                    <input className="input-field" name="telefono" value={formData.telefono} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)' }} />
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Saldo Inicial ($)</label>
                                    <input className="input-field" type="number" name="saldo" value={formData.saldo} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-light)' }} />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>CANCELAR</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>GUARDAR</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
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
