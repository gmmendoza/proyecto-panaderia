import { 
  ShoppingBag, 
  ChevronRight,
  Star,
  Clock,
  MapPin,
  Heart,
  Quote
} from 'lucide-react';
import { motion } from 'framer-motion';

const Inicio = ({ setActiveTab }) => {
  const categories = [
    { title: 'Panes de Masa Madre', desc: 'Fermentación lenta y natural.', img: '/gallery2.png' },
    { title: 'Pastelería Premium', desc: 'Dulces momentos artesanales.', img: '/gallery3.png' },
    { title: 'Tradición y Aroma', desc: 'Recetas de la abuela.', img: '/gallery1.png' },
  ];

  const testimonials = [
    { name: 'Ana García', text: 'El mejor pan de la zona. El aroma al entrar es increíble.', role: 'Cliente frecuente' },
    { name: 'Marcos López', text: 'Las facturas son de otro nivel. Se nota la calidad de los ingredientes.', role: 'Vecino de El Aromo' },
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section 
        className="hero-section" 
        style={{ backgroundImage: 'url("/hero.png")' }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            Tradición que se siente en cada aroma
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Descubre el sabor auténtico del pan artesanal, horneado con pasión y los mejores ingredientes naturales.
          </motion.p>
          <motion.div 
            style={{ display: 'flex', gap: '1.5rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button 
              className="btn btn-primary" 
              onClick={() => setActiveTab('pos')}
              style={{ padding: '1rem 2rem', fontSize: '1rem' }}
            >
              Comprar Ahora <ShoppingBag size={18} />
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setActiveTab('produccion')}
              style={{ padding: '1rem 2rem', fontSize: '1rem' }}
            >
              Nuestras Recetas
            </button>
          </motion.div>
        </div>
      </section>

      {/* About Us / Story Section */}
      <section style={{ padding: '4rem 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
        >
          <img 
            src="/gallery1.png" 
            alt="Interior Panadería" 
            style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} 
          />
        </motion.div>
        <div>
          <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '1rem' }}>Sobre Nosotros</h4>
          <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Más que una panadería, somos una tradición</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
            En El Aromo, creemos que el pan es el corazón de cada hogar. Por eso, utilizamos procesos milenarios de fermentación y materias primas seleccionadas para entregarte un producto que no solo alimenta, sino que reconforta.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <div style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}><Heart size={24} /></div>
              <h4 style={{ marginBottom: '0.5rem' }}>Pura Pasión</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hecho a mano con dedicación absoluta.</p>
            </div>
            <div>
              <div style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}><Star size={24} /></div>
              <h4 style={{ marginBottom: '0.5rem' }}>Calidad Local</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ingredientes frescos de nuestra región.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section style={{ padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="serif" style={{ fontSize: '2.5rem' }}>Nuestras Especialidades</h2>
          <p style={{ color: 'var(--text-muted)' }}>Lo más destacado de nuestro horno para tu mesa.</p>
        </div>
        <div className="bakery-gallery">
          {categories.map((cat, i) => (
            <motion.div 
              key={i} 
              className="gallery-item-container"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="gallery-item" style={{ marginBottom: '1rem' }}>
                <img src={cat.img} alt={cat.title} />
              </div>
              <h3 className="serif">{cat.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '6rem 0', background: 'var(--primary-light)', margin: '0 -3rem', padding: '6rem 3rem', textAlign: 'center' }}>
         <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>Lo que dicen nuestros clientes</h2>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="bakery-card" style={{ textAlign: 'left', padding: '2.5rem' }}>
                <Quote size={40} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="user-avatar">{t.name[0]}</div>
                  <div>
                    <h5 style={{ margin: 0 }}>{t.name}</h5>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
         </div>
      </section>

      {/* Contact & Map Placeholder */}
      <section style={{ padding: '6rem 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        <div>
          <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Visítanos</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Estamos en el corazón del barrio, esperándote con pan caliente todos los días.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="logo-icon" style={{ width: '44px', height: '44px' }}><MapPin size={20} /></div>
              <span>Calle Falsa 123, El Aromo, Buenos Aires</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="logo-icon" style={{ width: '44px', height: '44px' }}><Clock size={20} /></div>
              <span>Lun - Sab: 07:00 - 20:00 | Dom: 08:30 - 13:00</span>
            </div>
          </div>
        </div>
        <div style={{ background: '#E8E2DE', borderRadius: 'var(--radius-lg)', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          [ Google Maps Placeholder ]
        </div>
      </section>
    </div>
  );
};

export default Inicio;
