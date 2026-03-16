import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const Inicio = ({ setActiveTab }) => {
  const quickStats = [
    { label: 'Ventas de Hoy', value: '$45.200', icon: TrendingUp, color: '#4CAF50' },
    { label: 'Clientes Activos', value: '12', icon: Users, color: '#2196F3' },
    { label: 'Pedidos Pendientes', value: '5', icon: ShoppingBag, color: '#FF9800' },
    { label: 'Alertas Stock', value: '3', icon: AlertTriangle, color: '#F44336' },
  ];

  const recentActivity = [
    { title: 'Venta procesada', desc: 'Consumidor Final - $4.500', time: 'hace 5 min' },
    { title: 'Nuevo pedido', desc: 'Ana García - Entrega Mañana', time: 'hace 20 min' },
    { title: 'Producción iniciada', desc: 'Lote #105 - Pan Francés', time: 'hace 1h' },
  ];

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="serif" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Bienvenido, Admin</h1>
        <p style={{ color: 'var(--bakery-text-muted)' }}>Resumen general de El Aromo para el día de hoy.</p>
      </header>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {quickStats.map((stat, i) => (
          <motion.div 
            key={i} 
            className="bakery-card"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="logo-icon" style={{ background: `${stat.color}15`, color: stat.color, width: '40px', height: '40px' }}>
                <stat.icon size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--bakery-text-muted)', fontWeight: 600 }}>{stat.label}</p>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main Banner */}
        <div className="bakery-card" style={{ 
          background: 'linear-gradient(135deg, #D46A2A 0%, #E88F5A 100%)', 
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2.5rem'
        }}>
          <h2 className="serif" style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Impulsa tu Panadería</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '400px' }}>
            Gestiona tus recetas, controla el inventario y realiza ventas rápidas con un solo sistema.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn-bakery" 
              style={{ background: 'white', color: 'var(--bakery-primary)' }}
              onClick={() => setActiveTab('pos')}
            >
              Nueva Venta
            </button>
            <button 
              className="btn-bakery" 
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
              onClick={() => setActiveTab('produccion')}
            >
              Ver Recetario
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bakery-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="serif">Actividad Reciente</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--bakery-primary)', fontWeight: 700, cursor: 'pointer' }}>VER TODO</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {recentActivity.map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--bakery-primary)', marginTop: '0.4rem' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{act.title}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--bakery-text-muted)', margin: 0 }}>{act.desc}</p>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--bakery-text-muted)' }}>{act.time}</span>
              </div>
            ))}
          </div>
          <button 
            className="btn-bakery" 
            style={{ width: '100%', marginTop: '2rem', justifyContent: 'center', background: '#FDFBF7', color: 'var(--bakery-text)', border: '1px solid var(--bakery-border)' }}
          >
            Configuración <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
