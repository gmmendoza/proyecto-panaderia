import { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Clock, 
  ChevronRight, 
  Layers,
  CheckCircle2,
  AlertCircle,
  Scale,
  Zap,
  X,
  Type,
  FileText,
  Save,
  Bell,
  Star,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_RECIPES = [
  { 
    id: 1, 
    nombre: 'Pan Francés Tradicional', 
    categoria: 'Panes', 
    tiempo: '4h', 
    dificultad: 'Media', 
    img: 'gallery2.png',
    favorito: true,
    ingredientes: [
      { nombre: 'Harina 000', base: 1000, unidad: 'g' },
      { nombre: 'Agua', base: 650, unidad: 'ml' },
      { nombre: 'Sal', base: 20, unidad: 'g' },
      { nombre: 'Levadura Fresca', base: 25, unidad: 'g' }
    ],
    pasos: [
      'Amasado inicial (15 min) hasta lograr elasticidad.',
      'Primera fermentación en bloque (2h) a temperatura ambiente.',
      'División y preformado de bollos.',
      'Descanso de 20 min.',
      'Formado final de flautas/baguettes.',
      'Segunda fermentación (1.5h).',
      'Corte (greñado) y horneado a 220°C con vapor.'
    ],
    descripcion: 'Corteza crujiente y miga aireada. El clásico infaltable de la mesa argentina.'
  },
  { 
    id: 2, 
    nombre: 'Croissant Premium', 
    categoria: 'Facturería', 
    tiempo: '12h', 
    dificultad: 'Alta', 
    img: 'gallery3.png',
    favorito: false,
    ingredientes: [
      { nombre: 'Harina 0000', base: 500, unidad: 'g' },
      { nombre: 'Manteca (Hojaldre)', base: 250, unidad: 'g' },
      { nombre: 'Azúcar', base: 60, unidad: 'g' },
      { nombre: 'Leche fría', base: 150, unidad: 'ml' }
    ],
    pasos: [
      'Amasado de la masa base (detrempe).',
      'Repouso en frío (2h).',
      'Empastado de la manteca.',
      'Primer pliegue sencillo y frío (1h).',
      'Segundo pliegue doble y frío (1h).',
      'Laminado final y corte de triángulos.',
      'Formado y fermentación final (3h).',
      'Pintado con huevo y horneado a 180°C.'
    ],
    descripcion: 'Hojaldre artesanal con 48 capas de pura manteca. Textura sublime.'
  }
];

const ProductionCalculator = ({ recipe, onClose }) => {
  const [targetKg, setTargetKg] = useState(1);
  const [checkedItems, setCheckedItems] = useState({});

  const scaleFactor = targetKg;

  const toggleCheck = (index) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <motion.div 
      initial={{ x: 600, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 600, opacity: 0 }}
      className="production-sidebar"
      style={{ 
        position: 'fixed', right: 0, top: 0, height: '100vh', width: '550px', 
        zIndex: 1000, padding: '4rem', overflowY: 'auto', 
        borderLeft: '1px solid var(--border-light)', 
        boxShadow: '-30px 0 80px rgba(0,0,0,0.1)', 
        background: 'rgba(255,255,255,0.98)', 
        backdropFilter: 'blur(30px)' 
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '3px' }}>ORDEN DE PRODUCCIÓN</span>
          <h2 className="serif" style={{ fontSize: '2.8rem', margin: '4px 0 0 0', lineHeight: 1.1 }}>{recipe.nombre}</h2>
        </div>
        <button onClick={onClose} style={{ background: 'var(--bg-app)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={24} /></button>
      </div>

      <div style={{ padding: '2.5rem', background: '#FDFBF7', borderRadius: '30px', border: '1px solid var(--primary-light)', marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 15px rgba(253, 184, 19, 0.4)' }}>
            <Scale size={20} color="white" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Escalar Receta</span>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)' }}>Volumen del Lote</div>
          </div>
        </div>
        
        <div style={{ position: 'relative', height: '80px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <input 
            type="range" 
            min="0.5" 
            max="100" 
            step="0.5" 
            value={targetKg}
            onChange={(e) => setTargetKg(e.target.value)}
            style={{ 
              flex: 1, 
              accentColor: 'var(--primary)', 
              height: '6px',
              cursor: 'pointer'
            }}
          />
          <div style={{ textAlign: 'right', minWidth: '100px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>{targetKg}</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-muted)', marginLeft: '4px' }}>Kg</span>
          </div>
        </div>
      </div>

      <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Layers size={22} color="var(--primary)" /> Checklist de Insumos
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '4rem' }}>
        {recipe.ingredientes.map((ing, i) => (
          <motion.div 
            key={i} 
            whileHover={{ x: 5 }}
            onClick={() => toggleCheck(i)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem', 
              padding: '1.25rem 1.75rem', 
              borderRadius: '24px', 
              background: checkedItems[i] ? 'rgba(16, 185, 129, 0.05)' : '#fff',
              border: checkedItems[i] ? '1px solid #10b981' : '1px solid #eee',
              cursor: 'pointer', 
              transition: 'all 0.2s'
            }}
          >
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '8px', 
              border: '2px solid',
              borderColor: checkedItems[i] ? '#10b981' : '#ddd',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: checkedItems[i] ? '#10b981' : 'transparent'
            }}>
              {checkedItems[i] && <CheckCircle2 size={16} color="white" />}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ 
                fontWeight: 700, 
                fontSize: '1rem',
                color: checkedItems[i] ? '#6B7280' : 'var(--text-main)',
                textDecoration: checkedItems[i] ? 'line-through' : 'none'
              }}>
                {ing.nombre}
              </span>
            </div>
            <div style={{ 
              fontWeight: 900, 
              fontSize: '1.1rem',
              color: checkedItems[i] ? '#9CA3AF' : 'var(--text-main)'
            }}>
              {(ing.base * scaleFactor).toLocaleString()} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{ing.unidad}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <BookOpen size={22} color="var(--primary)" /> Proceso Artesanal
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {recipe.pasos?.map((paso, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem', background: '#F9FAFB', borderRadius: '20px', borderLeft: '4px solid var(--primary-light)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              {idx + 1}
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, lineHeight: '1.6', color: 'var(--text-main)' }}>{paso}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--bg-app)', borderRadius: '30px', textAlign: 'center' }}>
        <motion.button 
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary" 
          style={{ width: '100%', height: '70px', fontSize: '1.1rem', fontWeight: 900, borderRadius: '20px', boxShadow: '0 15px 35px rgba(253, 184, 19, 0.4)' }}
        >
          <Zap size={20} /> FINALIZAR Y ACTUALIZAR STOCK
        </motion.button>
        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Esto descontará automáticamente del stock de insumos.</p>
      </div>
    </motion.div>
  );
};

const Recetario = () => {
  const [recipes, setRecipes] = useState(MOCK_RECIPES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    nombre: '',
    categoria: 'Panes',
    descripcion: '',
    tiempo: '',
    ingredientes: [{ nombre: '', base: '', unidad: 'g' }]
  });

  const handleAddRecipe = (e) => {
    e.preventDefault();
    const id = recipes.length + 1;
    setRecipes([...recipes, { ...newRecipe, id, img: 'gallery1.png', dificultad: 'Media', favorito: false }]);
    setShowAddModal(false);
    setNewRecipe({ nombre: '', categoria: 'Panes', descripcion: '', tiempo: '', ingredientes: [{ nombre: '', base: '', unidad: 'g' }] });
  };

  const addIngredientField = () => {
    setNewRecipe({ ...newRecipe, ingredientes: [...newRecipe.ingredientes, { nombre: '', base: '', unidad: 'g' }] });
  };

  const toggleFavorite = (id) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, favorito: !r.favorito } : r));
  };

  const filteredRecipes = recipes.filter(r => 
    r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => (b.favorito ? 1 : 0) - (a.favorito ? 1 : 0));

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '3.8rem', margin: 0, fontWeight: 900 }}>Laboratorio Artesanal</h1>
          <p className="page-subtitle" style={{ fontSize: '1.3rem', margin: '0.5rem 0 0 0', opacity: 0.8 }}>Fórmulas secretas y procesos de calidad El Aromo.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary" 
          style={{ padding: '0 40px', height: '64px', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 900, boxShadow: '0 15px 35px rgba(253, 184, 19, 0.4)' }}
        >
          <Plus size={24} /> NUEVA FÓRMULA
        </motion.button>
      </header>

      <div className="pos-search-wrapper glass" style={{ maxWidth: '700px', height: '70px', marginBottom: '5rem', background: 'white', borderRadius: '24px', padding: '0 2rem', border: '1px solid var(--border-light)' }}>
        <Search size={24} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Buscar fórmulas por nombre, ingrediente o categoría..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ fontSize: '1.2rem', fontWeight: 500 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '3.5rem' }}>
        {filteredRecipes.map((recipe) => (
          <motion.div 
            key={recipe.id} 
            className="artisan-recipe-card"
            whileHover={{ y: -15 }}
            style={{ 
              borderRadius: '40px', 
              overflow: 'hidden', 
              background: '#fff', 
              padding: '0.85rem',
              boxShadow: '0 25px 70px rgba(0,0,0,0.06)',
              position: 'relative',
              border: '1px solid rgba(253, 184, 19, 0.1)'
            }}
          >
            <div style={{ position: 'relative', height: '280px', borderRadius: '32px', overflow: 'hidden' }}>
              <img src={recipe.img} alt={recipe.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Badges Overlay */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--text-main)', padding: '8px 16px', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', backdropFilter: 'blur(10px)' }}>{recipe.categoria}</span>
                {recipe.favorito && (
                  <span style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '14px', 
                    fontSize: '0.75rem', 
                    fontWeight: 900,
                    boxShadow: '0 5px 15px rgba(253, 184, 19, 0.4)'
                  }}>PREMIUM</span>
                )}
              </div>

              {/* Favorite Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe.id); }}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.95)', border: 'none', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: recipe.favorito ? '#ef4444' : '#ddd', transition: 'all 0.3s', backdropFilter: 'blur(10px)' }}
              >
                <Heart size={24} fill={recipe.favorito ? '#ef4444' : 'none'} stroke={recipe.favorito ? '#ef4444' : '#333'} />
              </button>

              {/* Bottom Info Overlay */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2.5rem 2rem', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', color: 'white' }}>
                 <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', fontWeight: 800 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16}/> {recipe.tiempo}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={16} fill="currentColor"/> {recipe.dificultad}</span>
                 </div>
              </div>
            </div>
            
            <div style={{ padding: '2.5rem 1.75rem 1.75rem' }}>
              <div style={{ width: '50px', height: '5px', background: 'var(--primary)', borderRadius: '3px', marginBottom: '1.5rem' }}></div>
              <h3 className="serif" style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 800 }}>{recipe.nombre}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '3rem', minHeight: '3.4rem', opacity: 0.8 }}>{recipe.descripcion}</p>
              
              <button 
                className="btn btn-primary" 
                onClick={() => setSelectedRecipe(recipe)}
                style={{ 
                  width: '100%', height: '60px', borderRadius: '20px', 
                  fontSize: '1rem', fontWeight: 900, 
                  background: 'var(--bg-app)', color: 'var(--text-main)', 
                  border: '1px solid var(--primary-light)', 
                  boxShadow: 'none',
                  transition: 'all 0.3s'
                }}
              >
                <Layers size={20} /> INICIAR PRODUCCIÓN
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Recipe Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(61,44,30,0.5)', backdropFilter: 'blur(15px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bakery-card" 
              style={{ width: '100%', maxWidth: '900px', padding: '4rem', background: 'white', maxHeight: '95vh', overflowY: 'auto', borderRadius: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem' }}>
                <h2 className="serif" style={{ fontSize: '3rem', fontWeight: 900 }}>Nueva Fórmula</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'var(--bg-app)', border: 'none', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={32} /></button>
              </div>

              <form onSubmit={handleAddRecipe} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Nombre Maestro</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ej. Sourdough de Nueces"
                      value={newRecipe.nombre}
                      onChange={(e) => setNewRecipe({...newRecipe, nombre: e.target.value})}
                      style={{ width: '100%', padding: '1.5rem', borderRadius: '20px', border: '1px solid #eee', background: '#F9FAFB', fontSize: '1.1rem', fontWeight: 600 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Categoría</label>
                    <select 
                      value={newRecipe.categoria}
                      onChange={(e) => setNewRecipe({...newRecipe, categoria: e.target.value})}
                      style={{ width: '100%', padding: '1.5rem', borderRadius: '20px', border: '1px solid #eee', background: '#F9FAFB', fontSize: '1.1rem', fontWeight: 600 }}
                    >
                      <option value="Panes">Panes Artesanales</option>
                      <option value="Facturería">Facturería Fina</option>
                      <option value="Pastelería">Pastelería Boutique</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Descripción del Producto</label>
                  <textarea 
                    required
                    placeholder="Describe los matices, aroma y textura..."
                    value={newRecipe.descripcion}
                    onChange={(e) => setNewRecipe({...newRecipe, descripcion: e.target.value})}
                    style={{ width: '100%', padding: '1.5rem', borderRadius: '20px', border: '1px solid #eee', background: '#F9FAFB', fontSize: '1.1rem', fontWeight: 600, minHeight: '120px', resize: 'none' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Fórmula Base (Insumos p/ 1kg)</label>
                    <button type="button" onClick={addIngredientField} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '1rem' }}>
                      <Plus size={20}Legacy /> AGREGAR LÍNEA
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {newRecipe.ingredientes.map((ing, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.5rem' }}>
                        <input 
                          required
                          placeholder="Nombre del insumo"
                          value={ing.nombre}
                          onChange={(e) => {
                            const newIngs = [...newRecipe.ingredientes];
                            newIngs[i].nombre = e.target.value;
                            setNewRecipe({...newRecipe, ingredientes: newIngs});
                          }}
                          style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid #eee', background: '#F9FAFB', fontSize: '1rem', fontWeight: 600 }}
                        />
                        <input 
                          required
                          type="number"
                          placeholder="Base"
                          value={ing.base}
                          onChange={(e) => {
                            const newIngs = [...newRecipe.ingredientes];
                            newIngs[i].base = e.target.value;
                            setNewRecipe({...newRecipe, ingredientes: newIngs});
                          }}
                          style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid #eee', background: '#F9FAFB', fontSize: '1rem', fontWeight: 600 }}
                        />
                        <select 
                          value={ing.unidad}
                          onChange={(e) => {
                            const newIngs = [...newRecipe.ingredientes];
                            newIngs[i].unidad = e.target.value;
                            setNewRecipe({...newRecipe, ingredientes: newIngs});
                          }}
                          style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid #eee', background: '#F9FAFB', fontSize: '1rem', fontWeight: 600 }}
                        >
                          <option value="g">gramos (g)</option>
                          <option value="ml">mililitros (ml)</option>
                          <option value="un">unidades (un)</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ flex: 1, height: '70px', borderRadius: '20px', fontWeight: 800 }}>CANCELAR</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '70px', borderRadius: '20px', fontWeight: 900 }}>REGISTRAR FÓRMULA</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRecipe && (
          <ProductionCalculator 
            recipe={selectedRecipe} 
            onClose={() => setSelectedRecipe(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recetario;

