import { useState } from 'react';
import { 
  Plus, 
  ChefHat, 
  Clock, 
  Layers,
  ClipboardCheck,
  Zap,
  TrendingUp,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Recetario = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes] = useState([
    { id: 1, nombre: 'Pan Francés Tradicional', tiempo: '4h', rinde: '10kg', dificultad: 'Media', color: '#EED7C5', ingredientes: ['Harina (5kg)', 'Agua (3L)', 'Sal (100g)'] },
    { id: 2, nombre: 'Medialunas de Manteca', tiempo: '6h', rinde: '12 docenas', dificultad: 'Alta', color: '#D46A2A', ingredientes: ['Harina (4kg)', 'Manteca (2kg)', 'Leche (1.5L)'] },
    { id: 3, nombre: 'Baguette Rústica', tiempo: '5h', rinde: '20 unidades', dificultad: 'Media', color: '#8D6E63', ingredientes: ['Harina (6kg)', 'Masa Madre (500g)', 'Sal (120g)'] },
    { id: 4, nombre: 'Pain au Chocolat', tiempo: '7h', rinde: '8 docenas', dificultad: 'Alta', color: '#EED7C5', ingredientes: ['Harina (3kg)', 'Chocolate (1kg)', 'Manteca (1.5kg)'] },
  ]);

  const [activeProduction] = useState([
    { id: 101, receta: 'Pan Francés', inicio: '08:00', estado: 'Horneado', progreso: 85 },
    { id: 102, receta: 'Medialunas', inicio: '09:30', estado: 'Leudado', progreso: 40 },
  ]);

  const filteredRecipes = recipes.filter(r => r.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '2.5rem', margin: 0 }}>Recetario Maestro</h1>
          <p style={{ color: 'var(--text-muted)' }}>Fórmulas artesanales y control de procesos en tiempo real.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> NUEVA RECETA
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem' }}>
        {/* Main Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', background: 'white', padding: '0.75rem 1.5rem', borderRadius: '15px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por nombre de receta..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <AnimatePresence>
              {filteredRecipes.map(recipe => (
                <motion.div 
                  key={recipe.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bakery-card"
                  whileHover={{ y: -8, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                  style={{ cursor: 'pointer', borderTop: `4px solid ${recipe.color}`, padding: '1.5rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <ChefHat size={20} />
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'var(--bg-app)', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
                      DIF. {recipe.dificultad.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="serif" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{recipe.nombre}</h3>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Clock size={14} /> {recipe.tiempo}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Layers size={14} /> {recipe.rinde}
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Fórmula Base</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {recipe.ingredientes.map((ing, i) => (
                        <span key={i} style={{ fontSize: '0.75rem', background: '#F8F9FA', padding: '3px 10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>{ing}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="bakery-card" style={{ background: 'white', padding: '2rem' }}>
            <h3 className="serif" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TrendingUp size={22} color="var(--primary)" /> Producción Activa
            </h3>
            
            {activeProduction.map(prod => (
              <div key={prod.id} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{prod.receta}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lote #{prod.id} • {prod.inicio} hs</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '12px' }}>{prod.estado}</span>
                  </div>
                </div>
                <div style={{ height: '8px', background: '#F1F1F1', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${prod.progreso}%` }}
                    style={{ height: '100%', background: 'var(--primary)', borderRadius: '10px' }}
                  />
                </div>
                <div style={{ textAlign: 'right', marginTop: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{prod.progreso}%</div>
              </div>
            ))}

            <button className="btn btn-secondary" style={{ width: '100%', padding: '1rem', justifySelf: 'flex-end', marginTop: '1rem' }}>
              <ClipboardCheck size={18} /> CONTROL DE EXISTENCIAS
            </button>
          </div>

          <div style={{ background: 'rgba(212, 106, 42, 0.05)', border: '1px dashed var(--primary)', borderRadius: '20px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={16} fill="white" />
              </div>
              <h4 style={{ margin: 0 }}>Sugerencia IA</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              La demanda proyectada para mañana indica que deberías duplicar el lote de <strong>Masa Madre</strong> esta noche.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem', padding: '0.6rem' }}>PROGRAMAR LOTE</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Recetario;
