import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  ChefHat, 
  Clock, 
  Users, 
  Layers,
  ChevronRight,
  ClipboardCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const Recetario = () => {
  const [recipes, setRecipes] = useState([
    { id: 1, nombre: 'Pan Francés Tradicional', tiempo: '4h', rinde: '10kg', dificultad: 'Media', ingredientes: ['Harina (5kg)', 'Agua (3L)', 'Sal (100g)', 'Levadura (50g)'] },
    { id: 2, nombre: 'Medialunas de Manteca', tiempo: '6h', rinde: '12 docenas', dificultad: 'Alta', ingredientes: ['Harina (4kg)', 'Manteca (2kg)', 'Azúcar (800g)', 'Leche (1.5L)'] },
    { id: 3, nombre: 'Baguette Rústica', tiempo: '5h', rinde: '20 unidades', dificultad: 'Media', ingredientes: ['Harina (6kg)', 'Agua (4L)', 'Masa Madre (500g)', 'Sal (120g)'] },
  ]);

  const [activeProduction, setActiveProduction] = useState([
    { id: 101, receta: 'Pan Francés', inicio: '08:00', estado: 'Horneado', progreso: 85 },
    { id: 102, receta: 'Medialunas', inicio: '09:30', estado: 'Leudado', progreso: 40 },
  ]);

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div className="logo-icon" style={{ background: '#F3E5F5', color: '#7B1FA2' }}>
            <BookOpen size={22} />
          </div>
          <h1 className="serif" style={{ fontSize: '2.5rem' }}>Recetario & Producción</h1>
        </div>
        <p style={{ color: 'var(--bakery-text-muted)', fontSize: '0.95rem' }}>
          Gestión de recetas artesanales y control de producción en tiempo real.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Recipes List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="serif">Mis Recetas</h3>
            <button className="btn-bakery" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <Plus size={16} /> NUEVA RECETA
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {recipes.map(recipe => (
              <motion.div 
                key={recipe.id} 
                className="bakery-card"
                whileHover={{ y: -5 }}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div className="logo-icon" style={{ background: '#FFF7F2', color: 'var(--bakery-primary)', width: '32px', height: '32px' }}>
                    <ChefHat size={18} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {recipe.dificultad}
                  </span>
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>{recipe.nombre}</h4>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--bakery-text-muted)' }}>
                    <Clock size={14} /> {recipe.tiempo}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--bakery-text-muted)' }}>
                    <Layers size={14} /> {recipe.rinde}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--bakery-border)', paddingTop: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--bakery-text-muted)', marginBottom: '0.5rem' }}>INGREDIENTES CLAVE:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {recipe.ingredientes.map((ing, i) => (
                      <span key={i} style={{ fontSize: '0.7rem', background: '#FDFBF7', border: '1px solid var(--bakery-border)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Production */}
        <aside>
          <div className="bakery-card" style={{ height: 'fit-content' }}>
            <h3 className="serif" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={20} color="var(--bakery-primary)" /> En Producción
            </h3>
            
            {activeProduction.map(prod => (
              <div key={prod.id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--bakery-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{prod.receta}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--bakery-text-muted)' }}>Lote #{prod.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  <span>Inicio: {prod.inicio}</span>
                  <span style={{ color: 'var(--bakery-primary)', fontWeight: 700 }}>{prod.estado}</span>
                </div>
                <div style={{ background: '#eee', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${prod.progreso}%` }}
                    style={{ background: 'var(--bakery-primary)', height: '100%' }}
                  />
                </div>
                <p style={{ textAlign: 'right', fontSize: '0.7rem', marginTop: '0.25rem', color: 'var(--bakery-text-muted)' }}>
                  {prod.progreso}% completado
                </p>
              </div>
            ))}

            <button className="btn-bakery" style={{ width: '100%', padding: '0.85rem', justifyContent: 'center' }}>
              <ClipboardCheck size={18} /> CONTROL DE MERMAS
            </button>
          </div>

          <div className="bakery-card" style={{ marginTop: '1.5rem', background: 'var(--bakery-text)', color: 'white' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Sugerencia de Producción</h4>
            <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '1rem' }}>
              Basado en las ventas de hoy, se recomienda iniciar un lote extra de Medialunas.
            </p>
            <button style={{ background: 'white', color: 'var(--bakery-text)', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              GENERAR ORDEN
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Recetario;
