import { 
  ShoppingBag, 
  ChevronRight,
  Star,
  Clock,
  MapPin,
  Heart,
  Quote,
  Zap,
  CalendarDays,
  TrendingUp,
  UserPlus,
  Store,
  Package,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

const Inicio = ({ setActiveTab, userRole }) => {
  const [stats, setStats] = useState({
    ventasHoy: 0,
    pedidosPendientes: 0,
    totalClientes: 0,
    inventarioCritico: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [ventas, pedidos, clientes, productos] = await Promise.all([
        api.ventas.getAll(),
        api.pedidos.getAll(),
        api.clientes.getAll(),
        api.productos.getAll()
      ]);

      // Calcular Ventas Hoy
      const hoy = new Date().toISOString().split('T')[0];
      const totalHoy = ventas
        .filter(v => (v.createdAt || v.fecha).startsWith(hoy))
        .reduce((sum, v) => sum + v.total, 0);

      // Pedidos Pendientes
      const pendientes = pedidos.filter(p => p.estado !== 'Entregado' && p.estado !== 'Cancelado').length;

      // Inventario Crítico
      const critico = productos.filter(p => (p.stock || 0) <= 5).length;

      setStats({
        ventasHoy: totalHoy,
        pedidosPendientes: pendientes,
        totalClientes: clientes.length,
        inventarioCritico: critico
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { title: 'Panes de Masa Madre', desc: 'Fermentación lenta y natural.', img: 'gallery2.png' },
    { title: 'Pastelería Premium', desc: 'Dulces momentos artesanales.', img: 'gallery3.png' },
    { title: 'Tradición y Aroma', desc: 'Recetas de la abuela.', img: 'gallery1.png' },
  ];

  const recentActivities = [
    { id: 1, type: 'venta', title: 'Venta Registrada', desc: 'Ticket #1024 - $12.500', time: 'hace 10 min', icon: ShoppingBag, color: 'var(--primary)' },
    { id: 2, type: 'produccion', title: 'Producción Finalizada', desc: '10kg Pan Francés', time: 'hace 45 min', icon: Zap, color: 'var(--success)' },
    { id: 3, type: 'cliente', title: 'Nuevo Cliente', desc: 'Mariana López registrada', time: 'hace 2 horas', icon: UserPlus, color: 'var(--accent)' },
  ];

  const getGreeting = () => {
    switch(userRole) {
      case 'ventas': return 'Bienvenid@, Cajero';
      case 'produccion': return 'Bienvenid@, Panadero';
      case 'admin': return 'Bienvenid@, Admin';
      default: return 'Bienvenid@';
    }
  };

  const today = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  return (
    <div className="fade-in">
      {/* Role-Based Greeting & Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0, WebkitTextFillColor: 'initial', background: 'none', color: 'var(--text-main)', fontSize: '3.8rem' }}>
            {getGreeting()} <span className="wave">👋</span>
          </h1>
          <p className="page-subtitle" style={{ margin: '0.5rem 0 0 0', fontSize: '1.2rem' }}>
            Análisis integral de <span style={{ fontWeight: 800, color: 'var(--primary)' }}>LA PANADERÍA EL AROMO</span>
          </p>
        </div>
        <div className="glass" style={{ padding: '0.8rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '18px', border: '1px solid var(--border-light)' }}>
          <Clock size={20} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', textTransform: 'capitalize', color: 'var(--text-main)', letterSpacing: '0.5px' }}>{today}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', marginBottom: '4rem' }}>
        <div>
          {/* Main Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bakery-card glass" style={{ padding: '2rem', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={24} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: '#ecfdf5', padding: '4px 10px', borderRadius: '20px' }}>HOY</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ingresos Totales</p>
              <h3 className="serif" style={{ margin: '0.5rem 0 0 0', fontSize: '2.4rem', fontWeight: 900 }}>${stats.ventasHoy.toLocaleString()}</h3>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bakery-card glass" style={{ padding: '2rem', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={24} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', background: '#fffbeb', padding: '4px 10px', borderRadius: '20px' }}>{stats.pedidosPendientes}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pedidos por Entregar</p>
              <h3 className="serif" style={{ margin: '0.5rem 0 0 0', fontSize: '2.4rem', fontWeight: 900 }}>En Proceso</h3>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bakery-card glass" style={{ padding: '2rem', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={24} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', background: '#fef2f2', padding: '4px 10px', borderRadius: '20px' }}>{stats.inventarioCritico} URGENTE</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Items Bajo Stock</p>
              <h3 className="serif" style={{ margin: '0.5rem 0 0 0', fontSize: '2.4rem', fontWeight: 900 }}>Alerta Stock</h3>
            </motion.div>
          </div>

          {/* Value Proposition / System Explanation */}
          <div className="bakery-card" style={{ background: 'var(--text-main)', padding: '3rem', borderRadius: '30px', color: 'white', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 className="serif" style={{ fontSize: '2.8rem', color: 'white', marginBottom: '1.5rem' }}>Sistema de Gestión Integral</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1.5rem' }}>
                  <h4 style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Optimización de Stock</h4>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.4 }}>Control real de insumos para evitar faltantes y mermas en producción.</p>
                </div>
                <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '1.5rem' }}>
                  <h4 style={{ color: '#10b981', fontWeight: 900, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Trazabilidad de Ventas</h4>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.4 }}>Histórico detallado de cada ticket para análisis financiero profundo.</p>
                </div>
                <div style={{ borderLeft: '3px solid #6366f1', paddingLeft: '1.5rem' }}>
                  <h4 style={{ color: '#6366f1', fontWeight: 900, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Compromiso con el Cliente</h4>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.4 }}>Gestión de pedidos con señas y fechas críticas de entrega sin errores.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 16px var(--primary-glow)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('pos')}
                  className="btn btn-primary"
                  style={{ padding: '14px 28px' }}
                >
                  IR A PUNTO DE VENTA
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('inventario')}
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '14px 28px', borderRadius: '14px', fontWeight: 800, cursor: 'pointer' }}
                >
                  VER INVENTARIO
                </motion.button>
              </div>
            </div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', right: '-50px', bottom: '-50px', opacity: 0.1, fontSize: '15rem' }}>⚙️</motion.div>
          </div>
        </div>

        {/* Improved Activity Sidebar */}
        <aside className="bakery-card glass" style={{ borderRadius: '30px', padding: '2.5rem', background: 'rgba(255,255,255,0.7)' }}>
          <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CalendarDays size={24} color="var(--primary)" /> Pulso del Negocio
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { label: 'Total Clientes Fieles', val: stats.totalClientes, icon: UserPlus, color: '#6366f1' },
              { label: 'Pedidos por Retirar', val: stats.pedidosPendientes, icon: ShoppingBag, color: '#f59e0b' },
              { label: 'Procesos de Horneado', val: 4, icon: Zap, color: '#10b981' },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', borderRadius: '20px', background: 'white', border: '1px solid var(--border-light)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${stat.color}10`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>{stat.val}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem', padding: '1.5rem', borderRadius: '20px', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
            <CheckCircle2 size={32} style={{ marginBottom: '1rem' }} />
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Sincronización Total</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '8px' }}>El sistema está operando en tiempo real con la base de datos centralizada.</p>
          </div>
        </aside>
      </div>

      {/* Hero Section */}
      <section 
        className="hero-section glass" 
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("hero.png")', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '4rem' }}
      >
        <div style={{ maxWidth: '600px', color: 'white', position: 'relative', zIndex: 2 }}>
          <h2 className="serif" style={{ fontSize: '3rem', color: 'white', marginBottom: '1.5rem', lineHeight: 1.1 }}>Impulsa tu Panadería con Tecnología</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>Gestiona tus recetas, controla el inventario y realiza ventas rápidas con un solo sistema diseñado para artesanos.</p>
          <button className="btn btn-primary" onClick={() => setActiveTab('produccion')}>Explorar Recetario</button>
        </div>
      </section>

      {/* Gallery Highlight */}
      <div style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '2.5rem', textAlign: 'center' }}>Nuestras Especialidades</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {categories.map((cat, i) => (
            <motion.div 
              key={i} 
              className="bakery-card glass"
              whileHover={{ y: -10 }}
              style={{ padding: '1.5rem' }}
            >
              <div style={{ height: '220px', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }}>
                <img src={cat.img} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{cat.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{cat.desc}</p>
              <motion.button 
                whileHover={{ x: 5 }}
                onClick={() => setActiveTab('produccion')}
                style={{ background: 'none', border: 'none', padding: 0, marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                VER DETALLES <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inicio;

