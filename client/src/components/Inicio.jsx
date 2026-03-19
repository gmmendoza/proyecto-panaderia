import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Clock, 
  ArrowUpRight,
  ChevronRight,
  Activity,
  AlertTriangle,
  Users,
  Calendar,
  Zap,
  BarChart3,
  MousePointer2,
  FileText,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';

const Inicio = ({ setActiveTab, userRole, showToast }) => {
  const [stats, setStats] = useState({
    ventasHoy: 12540,
    clientesTotal: 450,
    pedidosPendientes: 12,
    ingresosEstimados: 85000,
    stockBajo: 3
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.stats.get();
        if (data) setStats(data);
      } catch (error) {
        console.error('Error stats:', error);
      }
    };
    loadStats();
  }, []);

  const recentActivity = [
    { id: 1, type: 'venta', title: 'Nueva Venta #1024', time: 'hace 5 min', amount: '$4,500', status: 'Completado' },
    { id: 2, type: 'pedido', title: 'Pedido Especial: Marta R.', time: 'hace 12 min', amount: '$15,000', status: 'Asignado' },
    { id: 3, type: 'stock', title: 'Insumo Crítico: Harina 000', time: 'hace 45 min', amount: 'Stock < 20%', status: 'Alerta' },
    { id: 4, type: 'turno', title: 'Reserva Confirmada: Juan P.', time: 'hace 1 h', amount: '12:30 PM', status: 'Pendiente' },
  ];

  const statCards = [
    { label: 'Ventas del Día', val: `$${stats.ventasHoy.toLocaleString()}`, icon: TrendingUp, color: 'var(--success)', trend: '+12.5%' },
    { label: 'Ingresos Mensuales', val: `$${stats.ingresosEstimados.toLocaleString()}`, icon: ShoppingBag, color: 'var(--primary)', trend: '+5.2%' },
    { label: 'Pedidos Activos', val: stats.pedidosPendientes, icon: Clock, color: 'var(--warning)', trend: '4 urgentes' },
    { label: 'Alertas de Stock', val: stats.stockBajo, icon: AlertTriangle, color: 'var(--danger)', trend: 'Crítico' },
  ];

  return (
    <div className="dashboard-wrapper" style={{ display: 'grid', gap: '2rem' }}>
      {/* Header Insight */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>
            {userRole === 'admin' ? 'Panel de Control Administrativo' : `Resumen Operativo: ${userRole === 'produccion' ? 'Jefe de Planta' : 'Vendedor'}`}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>Métricas consolidadas Sucursal Central • Perfil de {userRole === 'admin' ? 'Gerencia' : 'Operaciones'}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn" style={{ background: 'white', border: '1px solid var(--border-light)', fontSize: '0.8rem', fontWeight: 700 }}>EXCEL</button>
           <button className="btn" style={{ background: 'white', border: '1px solid var(--border-light)', fontSize: '0.8rem', fontWeight: 700 }}>PDF</button>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {statCards.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bakery-card"
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-light)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-app)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={20} />
              </div>
              <div style={{ color: s.color, fontSize: '0.7rem', fontWeight: 800, background: `${s.color}15`, padding: '4px 8px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {s.trend} <ArrowUpRight size={10} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, marginTop: '2px', color: 'var(--primary-dark)' }}>{s.val}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Main Visual Insight */}
          <div className="bakery-card" style={{ padding: '2rem', border: '1px solid var(--border-light)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <BarChart3 size={20} color="var(--primary)" /> Rendimiento de Ventas Semanal
                </h3>
             </div>
             <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '1.2rem', padding: '0 1rem' }}>
                {[65, 45, 80, 55, 95, 70, 85].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100%', position: 'relative' }}>
                       <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        style={{ width: '100%', background: i === 4 ? 'var(--accent)' : 'var(--primary)', borderRadius: '6px 6px 0 0', minHeight: '10px' }}
                      />
                      {i === 4 && <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary-dark)' }}>PICO</div>}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-light)' }}>{['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'][i]}</div>
                  </div>
                ))}
             </div>
          </div>

          {/* Activity Logs */}
          <div className="bakery-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-light)' }}>
             <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Registro de Operaciones Recientes</h3>
                <Clock size={18} color="var(--text-light)" />
             </div>
             <div>
                {recentActivity.map((a, i) => (
                  <div key={a.id} style={{ 
                    padding: '1.2rem 2rem', 
                    borderBottom: i === recentActivity.length -1 ? 'none' : '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    transition: 'background 0.2s'
                  }} className="activity-row">
                     <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {a.type === 'venta' ? <TrendingUp size={16} color="var(--primary)" /> : <Package size={16} color="var(--primary)" />}
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{a.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>{a.time} • ESTADO: <span style={{ color: a.status === 'Alerta' ? 'var(--danger)' : 'var(--success)' }}>{a.status.toUpperCase()}</span></div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--primary-dark)' }}>{a.amount}</div>
                     </div>
                     <ChevronRight size={16} color="var(--text-light)" />
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Quick Actions */}
          <div className="bakery-card" style={{ padding: '2rem', border: '1px solid var(--border-light)' }}>
             <h3 style={{ margin: 0, marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 900 }}>Accesos Rápidos</h3>
             <div style={{ display: 'grid', gap: '0.75rem' }}>
                <button onClick={() => setActiveTab('pos')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start', gap: '12px' }}>
                   <MousePointer2 size={18} /> Nueva Venta Directa
                </button>
                <button onClick={() => setActiveTab('pedidos')} className="btn" style={{ width: '100%', justifyContent: 'flex-start', gap: '12px', border: '1px solid var(--border-light)', background: 'white' }}>
                   <Clock size={18} /> Ver Pedidos Críticos
                </button>
                <button onClick={() => setActiveTab('inventario')} className="btn" style={{ width: '100%', justifyContent: 'flex-start', gap: '12px', border: '1px solid var(--border-light)', background: 'white' }}>
                   <Package size={18} /> Cargar Recepción Harina
                </button>
             </div>
          </div>

          <div className="bakery-card" style={{ padding: '2rem', border: '1px solid var(--border-light)' }}>
             <h3 style={{ margin: 0, marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 800 }}>Soporte del Sistema</h3>
             <div style={{ display: 'grid', gap: '1rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                   <FileText size={18} /> Manual de Usuario
                </a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                   <HelpCircle size={18} /> Reportar Incidencia
                </a>
                <div style={{ padding: '1rem', background: 'var(--bg-app)', borderRadius: '12px', marginTop: '0.5rem' }}>
                   <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '4px' }}>VERSIÓN ACTUAL</div>
                   <div style={{ fontSize: '0.85rem', fontWeight: 900 }}>2.5.0 STABLE (PRO)</div>
                </div>
             </div>
          </div>

          {/* Next Turn Reminder */}
          <div className="bakery-card" style={{ padding: '2rem', border: '1px solid var(--border-light)' }}>
             <h3 style={{ margin: 0, marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 800 }}>Próximos Turnos</h3>
             {[1, 2].map((i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
                   <div style={{ padding: '8px', background: 'var(--bg-app)', borderRadius: '10px', textAlign: 'center', minWidth: '50px', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 800 }}>{i === 1 ? 'MAÑ' : ' TAR'}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>2{i}</div>
                   </div>
                   <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Reserva Catering</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{i === 1 ? '10:30 AM' : '04:00 PM'} • {10 + i} pers.</div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
