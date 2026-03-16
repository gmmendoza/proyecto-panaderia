import { 
  ShoppingBag, 
  ChevronRight,
  Star,
  Clock,
  MapPin,
  Heart,
  Quote,
  Zap,
  CalendarDays
} from 'lucide-react';
import { motion } from 'framer-motion';

const Inicio = ({ setActiveTab, userRole }) => {
  const categories = [
    { title: 'Panes de Masa Madre', desc: 'Fermentación lenta y natural.', img: '/gallery2.png' },
    { title: 'Pastelería Premium', desc: 'Dulces momentos artesanales.', img: '/gallery3.png' },
    { title: 'Tradición y Aroma', desc: 'Recetas de la abuela.', img: '/gallery1.png' },
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '3rem', margin: 0 }}>
            {getGreeting()} <span role="img" aria-label="wave">👋</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Aquí tienes un resumen rápido de cómo marcha La Panadería hoy.
          </p>
        </div>
        <div className="bakery-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
          <Clock size={18} color="var(--primary)" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>{today}</span>
        </div>
      </div>

      {/* Control Panel Banner */}
      <section className="control-banner">
        <div>
          <h1>Panel de Control Central</h1>
          <p>Gestiona ventas, inventario, clientes y turnos desde un único lugar.</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            {userRole !== 'produccion' && (
              <button 
                className="btn btn-secondary" 
                onClick={() => setActiveTab('pos')}
                style={{ background: 'white', color: 'var(--primary)', border: 'none' }}
              >
                <ShoppingBag size={18} /> ABRIR CAJA
              </button>
            )}
            <button 
              className="btn" 
              onClick={() => setActiveTab('turnos')}
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              VER PEDIDOS
            </button>
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ fontSize: '10rem', opacity: 0.15, position: 'absolute', right: '5%', pointerEvents: 'none' }}
        >
          🥖
        </motion.div>
      </section>

      {/* Quick Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="bakery-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--success-bg)', color: 'var(--success)' }}>
            <Zap size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ventas de Hoy</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>$45.200</h3>
          </div>
        </div>
        <div className="bakery-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pedidos Pendientes</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>5</h3>
          </div>
        </div>
        <div className="bakery-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: '#F0F2F5', color: '#65676B' }}>
            <CalendarDays size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Clientes Atendidos</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>12</h3>
          </div>
        </div>
      </div>

      {/* Hero Section (Abridged for Dashboard) */}
      <section 
        className="hero-section" 
        style={{ backgroundImage: 'url("/hero.png")', height: '350px' }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2 className="serif" style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem' }}>Impulsa tu Panadería</h2>
          <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Gestiona tus recetas, controla el inventario y realiza ventas rápidas con un solo sistema.</p>
          <button className="btn btn-primary" onClick={() => setActiveTab('produccion')}>Ver Recetario</button>
        </div>
      </section>

      {/* Gallery Highlight */}
      <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Nuestras Especialidades</h2>
      <div className="bakery-gallery" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {categories.map((cat, i) => (
          <motion.div 
            key={i} 
            className="gallery-item-container"
            whileHover={{ y: -5 }}
          >
            <div className="gallery-item" style={{ height: '180px' }}>
              <img src={cat.img} alt={cat.title} />
            </div>
            <h3 className="serif" style={{ fontSize: '1.2rem', marginTop: '1rem', marginBottom: '0.5rem' }}>{cat.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cat.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Inicio;
