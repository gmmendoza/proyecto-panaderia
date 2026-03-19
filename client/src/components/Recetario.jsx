import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Clock, 
  Layers,
  CheckCircle2,
  Check,
  Scale,
  Zap,
  X,
  FileText,
  PlusCircle,
  TrendingDown,
  Hammer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const ProductionCalculator = ({ recipe, onClose, showToast }) => {
  const [targetKg, setTargetKg] = useState(1);
  const [products, setProducts] = useState([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.productos.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const toggleIngredient = (idx) => {
    if (checkedIngredients.includes(idx)) {
      setCheckedIngredients(checkedIngredients.filter(i => i !== idx));
    } else {
      setCheckedIngredients([...checkedIngredients, idx]);
    }
  };

  const handleFinishProduction = async () => {
    try {
      setIsFinishing(true);
      const scaleFactor = Number(targetKg);
      
      const updatePromises = recipe.ingredientes.map(ing => {
        const product = products.find(p => p.nombre.toLowerCase() === ing.nombre.toLowerCase());
        if (product) {
          const usedAmount = Number(ing.base) * scaleFactor;
          let amountToDeduct = usedAmount;
          if (ing.unidad === 'g' && product.unidad === 'kg') {
            amountToDeduct = usedAmount / 1000;
          }
          return api.productos.update(product.id, { stock: Math.max(0, (product.stock || 0) - amountToDeduct) });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      if (showToast) showToast(`Producción de ${targetKg}kg de ${recipe.nombre} completada. Stock actualizado.`);
      onClose();
    } catch (err) {
      if (showToast) showToast('Error al actualizar stock de producción', 'error');
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <motion.div 
      initial={{ x: 600, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 600, opacity: 0 }}
      style={{ 
        position: 'fixed', right: 0, top: 0, height: '100vh', width: '450px', 
        zIndex: 2000, padding: '2rem', overflowY: 'auto', 
        borderLeft: '1px solid var(--border-light)', 
        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', 
        background: 'white'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 900 }}>Orden de Producción</h2>
        <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.4rem' }}><X size={20} /></button>
      </div>

      <div className="bakery-card" style={{ padding: '1.25rem', marginBottom: '2rem', border: '1px solid var(--primary-light)', background: '#fff7ed' }}>
        <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{recipe.nombre}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <input 
              type="number" 
              value={targetKg} 
              onChange={(e) => setTargetKg(e.target.value)} 
              style={{ width: '80px', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} 
           />
           <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Kg a producir</span>
        </div>
      </div>

      <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
        <PlusCircle size={16} color="var(--primary)" /> CHECKLIST DE INSUMOS (Tilde para marcar)
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        {recipe.ingredientes.map((ing, i) => {
          const amount = (Number(ing.base) * Number(targetKg));
          const isChecked = checkedIngredients.includes(i);
          return (
            <div 
              key={i} 
              onClick={() => toggleIngredient(i)}
              style={{ 
                display: 'flex', justifyContent: 'space-between', padding: '0.75rem', 
                borderRadius: '8px', border: isChecked ? '1.5px solid var(--success)' : '1px solid var(--border-light)', 
                fontSize: '0.85rem', cursor: 'pointer',
                background: isChecked ? 'var(--bg-app)' : 'white',
                opacity: isChecked ? 0.6 : 1,
                textDecoration: isChecked ? 'line-through' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '2px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isChecked ? 'var(--success)' : 'white' }}>
                  {isChecked && <Check size={12} color="white" />}
                </div>
                <span style={{ fontWeight: 600 }}>{ing.nombre}</span>
              </div>
              <span style={{ fontWeight: 800 }}>{amount.toLocaleString()} {ing.unidad}</span>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '1rem', background: 'var(--bg-app)', borderRadius: '12px' }}>
         <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800 }}>MÉTODO DE ELABORACIÓN</h4>
         {recipe.pasos?.map((p, i) => (
           <div key={i} style={{ fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', gap: '8px' }}>
             <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{i + 1}.</span>
             <span>{p}</span>
           </div>
         ))}
      </div>

      <button 
        disabled={isFinishing}
        onClick={handleFinishProduction}
        className="btn btn-primary" 
        style={{ width: '100%', marginTop: '2rem', height: '50px', letterSpacing: '0.1em' }}
      >
        <CheckCircle2 size={18} /> {isFinishing ? 'PROCESANDO...' : 'FINALIZAR Y DESCONTAR TOTAL'}
      </button>
    </motion.div>
  );
};

const Recetario = ({ showToast }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    nombre: '',
    categoria: 'Panes',
    descripcion: '',
    tiempo: '',
    ingredientes: [{ nombre: '', base: '', unidad: 'g' }],
    pasos: ['']
  });

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await api.recetas.getAll();
      setRecipes(data);
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Error al cargar fórmulas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    try {
      const resp = await api.recetas.create({
        ...newRecipe,
        img: 'gallery1.png',
        dificultad: 'Media',
        favorito: false
      });
      setRecipes([...recipes, resp]);
      setShowAddModal(false);
      setNewRecipe({ nombre: '', categoria: 'Panes', descripcion: '', tiempo: '', ingredientes: [{ nombre: '', base: '', unidad: 'g' }], pasos: [''] });
      if (showToast) showToast('Fórmula registrada con éxito');
    } catch (err) {
      if (showToast) showToast('Error al registrar fórmula', 'error');
    }
  };

  const addIngredientField = () => {
    setNewRecipe({ ...newRecipe, ingredientes: [...newRecipe.ingredientes, { nombre: '', base: '', unidad: 'g' }] });
  };

  const filteredRecipes = recipes.filter(r => 
    r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Gestión de Producción</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fórmulas industriales y control de insumos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <PlusCircle size={18} /> NUEVA FÓRMULA
        </button>
      </div>

      <div className="bakery-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Buscar fórmula..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>
      </div>

      <div className="bakery-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="system-table">
          <thead>
            <tr>
              <th>Fórmula</th>
              <th>Categoría</th>
              <th>Ingredientes Base</th>
              <th>Complejidad</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>Consultando laboratorio de fórmulas...</td></tr>
            ) : filteredRecipes.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>No hay fórmulas registradas</td></tr>
            ) : filteredRecipes.map(r => (
              <tr key={r.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{r.nombre}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tiempo: {r.tiempo}</div>
                </td>
                <td>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-app)', fontWeight: 600 }}>{r.categoria.toUpperCase()}</span>
                </td>
                <td>
                  <div style={{ fontSize: '0.8rem' }}>{r.ingredientes?.length} insumos registrados</div>
                </td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Hammer size={12} color="var(--primary)" /> {r.dificultad || 'Media'}
                   </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }} onClick={() => setSelectedRecipe(r)}>
                    INICIAR LOTE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bakery-card" 
              style={{ width: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <h2 style={{ marginTop: 0, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Nueva Fórmula Maestra</h2>
              <form onSubmit={handleAddRecipe} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>NOMBRE</label>
                    <input required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newRecipe.nombre} onChange={e => setNewRecipe({...newRecipe, nombre: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 700 }}>CATEGORÍA</label>
                    <select style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)' }} value={newRecipe.categoria} onChange={e => setNewRecipe({...newRecipe, categoria: e.target.value})}>
                      <option value="Panes">Panes</option>
                      <option value="Facturas">Facturas</option>
                      <option value="Pastelería">Pastelería</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>INGREDIENTES (PARA 1KG)</label>
                      <button type="button" onClick={addIngredientField} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>+ AGREGAR</button>
                   </div>
                   {newRecipe.ingredientes.map((ing, i) => (
                     <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input placeholder="Insumo" style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-light)' }} value={ing.nombre} onChange={e => {
                           const ins = [...newRecipe.ingredientes]; ins[i].nombre = e.target.value; setNewRecipe({...newRecipe, ingredientes: ins});
                        }} />
                        <input type="number" placeholder="Cant." style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-light)' }} value={ing.base} onChange={e => {
                           const ins = [...newRecipe.ingredientes]; ins[i].base = e.target.value; setNewRecipe({...newRecipe, ingredientes: ins});
                        }} />
                        <select style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-light)' }} value={ing.unidad} onChange={e => {
                           const ins = [...newRecipe.ingredientes]; ins[i].unidad = e.target.value; setNewRecipe({...newRecipe, ingredientes: ins});
                        }}>
                           <option value="g">g</option>
                           <option value="ml">ml</option>
                           <option value="un">un</option>
                        </select>
                     </div>
                   ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>CANCELAR</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>REGISTRAR</button>
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
            showToast={showToast}
            onClose={() => setSelectedRecipe(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recetario;

