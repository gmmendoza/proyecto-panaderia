import { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download,
  PieChart,
  Target,
  History,
  ShieldCheck,
  AlertCircle,
  Package,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Estadisticas = () => {
  const [activeView, setActiveView] = useState('metrics'); // 'metrics' or 'audit'

  const stats = [
    { label: 'Ingresos Mensuales', value: '$1.482.000', change: '+15.2%', icon: DollarSign, color: '#FDB813' },
    { label: 'Nuevos Clientes', value: '124', change: '+22%', icon: Users, color: '#E25E3E' },
    { label: 'Órdenes Hoy', value: '38', change: '-4%', icon: ShoppingBag, color: '#3D2C1E' },
    { label: 'Ticket Promedio', value: '$12.500', change: '+18%', icon: TrendingUp, color: '#FDB813' },
  ];

  const topCategories = [
    { name: 'Panería Tradicional', value: 65, color: '#FDB813' },
    { name: 'Pastelería Boutique', value: 25, color: '#E25E3E' },
    { name: 'Especialidades de Masa Madre', value: 10, color: '#3D2C1E' },
  ];

  const auditLogs = [
    { id: 1, user: 'Guadalupe (Admin)', action: 'Modificó receta: Pan Francés', time: 'hace 10 min', type: 'recipe', icon: FileText },
    { id: 2, user: 'Chef Roberto (Prod)', action: 'Ajuste de stock: Harina Integral (+50kg)', time: 'hace 25 min', type: 'stock', icon: Package },
    { id: 3, user: 'Sofia M. (Ventas)', action: 'Venta anulada: Ticket #4829', time: 'hace 1 hora', type: 'alert', icon: AlertCircle },
    { id: 4, user: 'Admin System', action: 'Backup de base de datos completado', time: 'hace 2 horas', type: 'system', icon: ShieldCheck },
    { id: 5, user: 'Elena G. (Prod)', action: 'Nueva receta creada: Torta Balcarce', time: 'hace 4 horas', type: 'recipe', icon: FileText },
  ];

  return (
    <div className="fade-in" style={{ color: 'var(--text-main)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '3.5rem', margin: 0 }}>Panel de Inteligencia</h1>
          <p className="page-subtitle" style={{ fontSize: '1.2rem', margin: '0.5rem 0 0 0' }}>Supervisión en tiempo real de El Aromo.</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div className="glass" style={{ padding: '6px', borderRadius: '16px', border: '1px solid var(--primary-light)', background: 'white', display: 'flex', gap: '8px' }}>
            <button 
              className={`nav-mode-btn ${activeView === 'metrics' ? 'active' : ''}`}
              onClick={() => setActiveView('metrics')}
            >
              Métricas
            </button>
            <button 
              className={`nav-mode-btn ${activeView === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveView('audit')}
            >
              Auditoría
            </button>
          </div>
          <button className="btn btn-primary" style={{ height: '48px', padding: '0 24px' }}>
            <Download size={20} /> DESCARGAR PDF
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeView === 'metrics' ? (
          <motion.div 
            key="metrics" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Primary Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              {stats.map((stat, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.02 }}
                  className="bakery-card glass"
                  style={{ padding: '2rem', background: 'white', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyCenter: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <stat.icon size={28} />
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      fontSize: '0.85rem', 
                      fontWeight: 900,
                      color: stat.change.includes('+') ? '#10b981' : '#D94545',
                      padding: '8px 12px',
                      background: stat.change.includes('+') ? '#F0FAF7' : '#FFF5F5',
                      borderRadius: '20px',
                      height: 'fit-content'
                    }}>
                      {stat.change}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>{stat.label}</p>
                  <div className="serif" style={{ fontSize: '2.5rem', position: 'relative', zIndex: 1 }}>{stat.value}</div>
                  <div style={{ position: 'absolute', right: '-30px', bottom: '-30px', width: '120px', height: '120px', background: `${stat.color}05`, borderRadius: '50%', border: `1px solid ${stat.color}08` }} />
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2.5rem' }}>
              {/* Main Sales Chart */}
              <div className="bakery-card glass" style={{ padding: '2.5rem', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                  <h3 className="serif" style={{ fontSize: '1.8rem' }}>Tendencias de Venta Anual</h3>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                      <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '3px' }} /> 2026 (Actual)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#E5E7EB' }}>
                      <div style={{ width: '12px', height: '12px', background: '#E5E7EB', borderRadius: '3px' }} /> 2025
                    </div>
                  </div>
                </div>
                
                <div style={{ height: '320px', display: 'flex', alignItems: 'flex-end', gap: '14px', position: 'relative' }}>
                  {[35, 55, 42, 85, 68, 92, 75, 58, 82, 60, 45, 78].map((val, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', height: '100%', position: 'relative' }}>
                      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${val}%` }}
                          transition={{ duration: 1.2, delay: i * 0.05, ease: "circOut" }}
                          style={{ 
                            width: '100%', 
                            background: `linear-gradient(to top, var(--primary), ${i % 2 === 0 ? '#FDB813' : '#FFD93D'})`,
                            borderRadius: '10px 10px 4px 4px',
                            boxShadow: '0 8px 24px rgba(253, 184, 19, 0.1)'
                          }} 
                        >
                          <div style={{ position: 'absolute', top: '-30px', width: '100%', textAlign: 'center', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-main)' }}>{val}k</div>
                        </motion.div>
                      </div>
                      <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                        {['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'][i]}
                      </div>
                    </div>
                  ))}
                  <div style={{ position: 'absolute', bottom: '45px', left: 0, right: 0, height: '1px', background: 'var(--border-light)', zIndex: 0 }} />
                </div>
              </div>

              {/* Pie Breakdown & Target */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="bakery-card glass" style={{ padding: '2.5rem', background: 'white' }}>
                  <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Top Categorías</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    {topCategories.map((cat, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 700 }}>{cat.name}</span>
                          <span style={{ fontSize: '1rem', fontWeight: 900, color: cat.color }}>{cat.value}%</span>
                        </div>
                        <div style={{ height: '10px', background: 'var(--bg-app)', borderRadius: '20px', overflow: 'hidden' }}>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.value}%` }}
                            transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                            style={{ height: '100%', background: cat.color, borderRadius: '20px' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bakery-card" style={{ padding: '2rem', background: 'var(--text-main)', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                      <Target size={24} color="var(--primary)" />
                    </div>
                    <div>
                      <h4 className="serif" style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>Objetivo Q1</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6 }}>Enero - Marzo 2026</p>
                    </div>
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1rem' }}>$4.500.000</div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '82%' }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      style={{ width: '82%', height: '100%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem', fontWeight: 700 }}>
                    <span style={{ color: 'var(--primary)' }}>82% Alcanzado</span>
                    <span style={{ opacity: 0.6 }}>Faltan $810.000</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="audit" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="bakery-card glass"
            style={{ padding: '3rem', background: 'white' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <History size={32} color="var(--primary)" />
                <h3 className="serif" style={{ fontSize: '2rem', margin: 0 }}>Registro de Auditoría</h3>
              </div>
              <div className="pos-search-wrapper glass" style={{ border: '1px solid var(--border-light)', width: '300px', height: '48px' }}>
                <Search size={18} color="var(--text-muted)" />
                <input type="text" placeholder="Filtrar por usuario o acción..." style={{ fontSize: '0.9rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1.5fr 2fr 1fr', padding: '1.25rem 2rem', borderBottom: '2px solid var(--bg-app)', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <span>Ícono</span>
                <span>Usuario</span>
                <span>Acción Realizada</span>
                <span>Fecha / Hora</span>
              </div>
              {auditLogs.map((log, i) => (
                <motion.div 
                  key={log.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '80px 1.5fr 2fr 1fr', 
                    padding: '1.75rem 2rem', 
                    borderBottom: '1px solid var(--bg-app)', 
                    alignItems: 'center',
                    transition: 'background 0.2s'
                  }}
                  className="audit-row"
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-app)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <log.icon size={20} />
                  </div>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{log.user.split(' ')[0]}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{log.user.split(' ')[1] || ''}</span>
                  </div>
                  <div style={{ fontWeight: 600 }}>{log.action}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{log.time}</div>
                </motion.div>
              ))}
            </div>
            
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <button className="btn btn-secondary" style={{ padding: '12px 32px' }}>Cargar registros anteriores...</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-mode-btn {
          border: none;
          background: transparent;
          padding: 10px 24px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 800;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-mode-btn.active {
          background: var(--text-main);
          color: white;
          box-shadow: 0 4px 12px rgba(61,44,30,0.2);
        }
        .audit-row:hover {
          background: #FDFAF5;
        }
        .period-btn {
          border: none;
          background: transparent;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.2s;
        }
        .period-btn.active {
          background: var(--bg-app);
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default Estadisticas;
