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
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

const Inicio = ({ setActiveTab, userRole }) => {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0, WebkitTextFillColor: 'initial', background: 'none', color: 'var(--text-main)', fontSize: '3.5rem' }}>
            {getGreeting()} <span className="wave">👋</span>
          </h1>
          <p className="page-subtitle" style={{ margin: '0.5rem 0 0 0' }}>
            Aquí tienes un resumen rápido de cómo marcha La Panadería hoy.
          </p>
        </div>
        <div className="glass" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
          <Clock size={18} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'capitalize', color: 'var(--text-main)' }}>{today}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', marginBottom: '3rem' }}>
        <div>
          {/* Control Panel Banner */}
          <section className="control-banner" style={{ borderRadius: 'var(--radius-lg)', padding: '3.5rem', marginBottom: '2.5rem' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 className="serif" style={{ fontSize: '3.5rem', color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Panel Central</h2>
              <p style={{ fontSize: '1.2rem', opacity: 0.95, maxWidth: '450px', lineHeight: 1.5 }}>
                Gestiona ventas, inventario, clientes y turnos desde un único lugar con herramientas premium.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                {userRole !== 'produccion' && (
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setActiveTab('pos')}
                    style={{ background: 'white', color: 'var(--text-main)', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  >
                    <Store size={18} /> ABRIR CAJA
                  </button>
                )}
                <button 
                  className="btn" 
                  onClick={() => setActiveTab('turnos')}
                  style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}
                >
                  VER PEDIDOS
                </button>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{ fontSize: '12rem', opacity: 0.2, position: 'absolute', right: '2%', bottom: '-10%', pointerEvents: 'none' }}
            >
              🥐
            </motion.div>
          </section>

          {/* Quick Stats Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="bakery-card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: '14px', background: 'var(--success-bg)', color: 'var(--success)' }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ventas Hoy</p>
                <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>$45.200</h3>
              </div>
            </div>
            <div className="bakery-card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: '14px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pendientes</p>
                <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>5</h3>
              </div>
            </div>
            <div className="bakery-card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: '14px', background: '#F0F2F5', color: '#65676B' }}>
                <CalendarDays size={22} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Clientes</p>
                <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>12</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <aside className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          <h3 className="serif" style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={20} color="var(--primary)" /> Actividad Reciente
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {recentActivities.map((act) => (
              <div key={act.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ padding: '0.6rem', borderRadius: '10px', background: `${act.color}15`, color: act.color, height: 'fit-content' }}>
                  <act.icon size={16} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>{act.title}</h4>
                  <p style={{ margin: '2px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{act.desc}</p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.8rem', padding: '0.75rem' }}>
            VER TODO EL REGISTRO
          </button>
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
              <button style={{ background: 'none', border: 'none', padding: 0, marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                VER DETALLES <ChevronRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inicio;

