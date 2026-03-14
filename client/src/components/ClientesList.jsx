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
                                        <UsersRound className="empty-state-icon" size={32} strokeWidth={1.5} />
                                        <p className="empty-state-text">No hay clientes registrados.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            clientes.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: 'var(--bg-surface-hover)',
                                                border: '1px solid var(--border-light)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600
                                            }}>
                                                {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{cliente.nombre} {cliente.apellido}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {cliente.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            <PhoneCall size={14} /> {cliente.telefono || '—'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500, color: cliente.saldo > 0 ? 'var(--danger)' : 'var(--text-main)' }}>
                                            <Banknote size={14} className={cliente.saldo > 0 ? '' : 'empty-state-icon'} style={{ marginBottom: 0 }} />
                                            ${Number(cliente.saldo).toFixed(2)}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className="btn btn-secondary btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDelete(cliente.id)}>
                                            <Trash2 size={14} />
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
