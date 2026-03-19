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
  Zap
} from 'lucide-react';
import { api } from '../services/api';

const Inicio = ({ setActiveTab, userRole, showToast }) => {
  const [stats, setStats] = useState({
    ventasHoy: 0,
    clientesTotal: 0,
    pedidosPendientes: 0,
    ingresosEstimados: 0,
    stockBajo: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.stats.get();
        setStats(data);
      } catch (error) {
        console.error('Error stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const handleDemo = () => {
    api.demo.enable();
    showToast('Software inicializado con datos de demo satisfactoriamente');
  };

  const recentActivity = [
    { id: 1, type: 'venta', title: 'Nueva Venta #1024', time: 'hace 5 min', amount: '$4,500', status: 'Completado' },
    { id: 2, type: 'pedido', title: 'Pedido Especial: Marta R.', time: 'hace 12 min', amount: '$15,000', status: 'Asignado' },
    { id: 3, type: 'stock', title: 'Insumo Crítico: Harina 000', time: 'hace 45 min', amount: 'Stock < 20%', status: 'Alerta' },
    { id: 4, type: 'turno', title: 'Reserva Confirmada: Juan P.', time: 'hace 1 h', amount: '12:30 PM', status: 'Pendiente' },
  ];

  const statCards = [
    { label: 'Ventas del Día', val: stats.ventasHoy, icon: TrendingUp, color: 'var(--success)', trend: '+12%' },
    { label: 'Ingresos (ARS)', val: `$${stats.ingresosEstimados.toLocaleString()}`, icon: ShoppingBag, color: 'var(--primary)', trend: '+5%' },
    { label: 'Pedidos Activos', val: stats.pedidosPendientes, icon: Clock, color: 'var(--warning)', trend: '4 urgentes' },
    { label: 'Alertas de Stock', val: stats.stockBajo, icon: AlertTriangle, color: 'var(--danger)', trend: 'Revisar' },
  ];

  return (
    <div className="dashboard-wrapper" style={{ display: 'grid', gap: '2rem' }}>
      {/* Header Insight */}
      <header style={{ marginBottom: '0.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>
          {userRole === 'admin' ? 'Panel de Control Administrativo' : `Bienvenido, ${userRole === 'produccion' ? 'Panadero' : 'Vendedor'}`}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Vista consolidada de la Sucursal Central • {new Date().toLocaleDateString('es-AR')}</p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {statCards.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bakery-card"
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={20} />
              </div>
              <div style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {s.trend} <ArrowUpRight size={12} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '2px' }}>{s.val}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Pulse Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Analysis View */}
          <div className="bakery-card" style={{ padding: '2rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <Activity size={20} color="var(--primary)" /> Rendimiento Semanal
                </h3>
             </div>
             <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '0 1rem' }}>
                {[65, 45, 80, 55, 95, 70, 85].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      style={{ width: '100%', background: i === 4 ? 'var(--accent)' : 'var(--primary)', borderRadius: '6px 6px 0 0', minHeight: '10px' }}
                    />
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)' }}>{['L', 'M', 'X', 'J', 'V', 'S', 'D'][i]}</div>
                  </div>
                ))}
             </div>
          </div>

          {/* Activity Logs */}
          <div className="bakery-card" style={{ padding: 0, overflow: 'hidden' }}>
             <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Actividad Reciente del Sistema</h3>
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
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }} className="activity-row">
                     <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {a.type === 'venta' ? <TrendingUp size={16} color="var(--primary)" /> : <Package size={16} color="var(--primary)" />}
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{a.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{a.time} • {a.status}</div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{a.amount}</div>
                     </div>
                     <ChevronRight size={16} color="var(--text-light)" />
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="bakery-card" style={{ background: 'var(--primary-light)', border: '1px solid var(--accent)', padding: '2rem' }}>
             <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Zap size={24} />
             </div>
             <h3 style={{ margin: 0, marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 800 }}>Modo Demo Senior</h3>
             <p style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Cargue datos realistas para simular un flujo completo de negocio y probar las capacidades del ERP.
             </p>
             <button onClick={handleDemo} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>INICIALIZAR DEMO</button>
          </div>

          <div className="bakery-card" style={{ padding: '2rem' }}>
             <h3 style={{ margin: 0, marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 800 }}>Próximos Turnos</h3>
             {[1, 2].map((i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
                   <div style={{ padding: '8px', background: 'var(--bg-app)', borderRadius: '10px', textAlign: 'center', minWidth: '50px' }}>
                      <div style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 800 }}>MAR</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>2{i}</div>
                   </div>
                   <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Reserva Catering</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>10:30 AM • {10 + i} pers.</div>
                   </div>
                </div>
             ))}
             <button className="btn" style={{ width: '100%', border: '1px solid var(--border-light)', fontSize: '0.75rem', fontWeight: 800, marginTop: '1rem' }}>VER CALENDARIO COMPLETO</button>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: '2rem', padding: '3rem 0', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
         <div style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em' }}>
            EL AROMO BAKERY ERP • SUITE PROFESIONAL VERSIÓN 2.5.0 • © {new Date().getFullYear()} DESARROLLADO PARA GESTIÓN ARTESANAL
         </div>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>ESTADO: <span style={{ color: 'var(--success)' }}>ONLINE</span></span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>SUCURSAL: <span style={{ color: 'var(--primary)' }}>CENTRAL</span></span>
         </div>
      </footer>
    </div>
  );
};

export default Inicio;
