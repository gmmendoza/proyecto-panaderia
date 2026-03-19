import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag,
  Download,
  Target,
  History,
  ShieldCheck,
  AlertCircle,
  Package,
  FileText,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const Estadisticas = ({ showToast }) => {
  const [activeView, setActiveView] = useState('metrics'); // 'metrics' or 'audit'
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState({
    ventasHoy: 0,
    clientesTotal: 0,
    pedidosPendientes: 0,
    ingresosEstimados: 0
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.stats.get();
      setStatsData(data);
      if (showToast) showToast('Datos actualizados');
    } catch (err) {
      if (showToast) showToast('Error al sincronizar métricas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = [
    { label: 'Ingresos Mensuales', value: `$${(statsData.ingresosEstimados * 30).toLocaleString()}`, change: '+15.2%', icon: DollarSign, color: '#FDB813' },
    { label: 'Base de Clientes', value: statsData.clientesTotal, change: '+22%', icon: Users, color: '#E25E3E' },
    { label: 'Ventas de Hoy', value: statsData.ventasHoy, change: '-4%', icon: ShoppingBag, color: '#3D2C1E' },
    { label: 'Meta Diaria', value: '85%', change: '+18%', icon: Target, color: '#FDB813' },
  ];

  const auditLogs = [
    { id: 1, user: 'Admin', action: 'Cierre de caja terminal #1', time: 'hace 10 min', type: 'system', icon: ShieldCheck },
    { id: 2, user: 'Producción', action: 'Lote #482 iniciado: Pan Francés', time: 'hace 25 min', type: 'stock', icon: Package },
    { id: 3, user: 'Ventas', action: 'Pedido #9921 cobrado', time: 'hace 1 hora', type: 'sale', icon: DollarSign },
    { id: 4, user: 'Sistema', action: 'Backup automatizado exitoso', time: 'hace 2 horas', type: 'system', icon: ShieldCheck },
  ];

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Panel de Inteligencia</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Monitoreo analítico de operaciones</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={fetchStats} disabled={loading}>
            <RefreshCcw size={18} className={loading ? 'spin' : ''} /> REFRESCAR
          </button>
          <div style={{ background: 'var(--bg-app)', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px' }}>
            <button 
              onClick={() => setActiveView('metrics')}
              style={{ padding: '6px 16px', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', background: activeView === 'metrics' ? 'white' : 'transparent', boxShadow: activeView === 'metrics' ? 'var(--shadow-sm)' : 'none', color: activeView === 'metrics' ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              Métricas
            </button>
            <button 
              onClick={() => setActiveView('audit')}
              style={{ padding: '6px 16px', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', background: activeView === 'audit' ? 'white' : 'transparent', boxShadow: activeView === 'audit' ? 'var(--shadow-sm)' : 'none', color: activeView === 'audit' ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              Auditoría
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeView === 'metrics' ? (
          <motion.div 
            key="metrics" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {stats.map((stat, i) => (
                <div key={i} className="bakery-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${stat.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ color: stat.color }}><stat.icon size={24} /></div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: stat.change.includes('+') ? 'var(--success)' : 'var(--danger)' }}>{stat.change}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{stat.label}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
              <div className="bakery-card" style={{ padding: '2rem' }}>
                <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.1rem' }}>Proyección Semanal</h3>
                <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                  {[45, 60, 52, 85, 68, 92, 75].map((val, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', background: 'var(--bg-app)', borderRadius: '6px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${val}%` }}
                          style={{ width: '100%', background: 'var(--primary)', opacity: 0.8 }}
                        />
                      </div>
                      <div style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bakery-card" style={{ padding: '2rem', background: 'var(--text-main)', color: 'white' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'white' }}>Desempeño Operativo</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
                      <span>Producción Panadería</span>
                      <span>92%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: '92%', height: '100%', background: 'var(--primary)' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
                      <span>Eficiencia Entrega</span>
                      <span>85%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', background: 'white' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="audit" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bakery-card"
            style={{ padding: 0, overflow: 'hidden' }}
          >
            <table className="system-table">
              <thead>
                <tr>
                  <th>EVENTO</th>
                  <th>USUARIO</th>
                  <th>DESCRIPCIÓN</th>
                  <th style={{ textAlign: 'right' }}>HORA</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ color: 'var(--primary)' }}>
                        <log.icon size={18} />
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 700 }}>{log.user}</span></td>
                    <td style={{ fontSize: '0.9rem' }}>{log.action}</td>
                    <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default Estadisticas;
