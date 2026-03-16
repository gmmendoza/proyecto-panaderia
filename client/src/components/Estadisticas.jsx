import { useState } from 'react';
import { 
  LineChart, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download,
  PieChart,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

const Estadisticas = () => {
  const stats = [
    { label: 'Ingresos Mensuales', value: '$1.4M', change: '+15.2%', icon: DollarSign, color: '#D46A2A' },
    { label: 'Nuevos Clientes', value: '+84', change: '+12%', icon: Users, color: '#8D6E63' },
    { label: 'Ordenes Hoy', value: '38', change: '-4%', icon: ShoppingBag, color: '#EED7C5' },
    { label: 'Ticket Promedio', value: '$8.500', change: '+8%', icon: TrendingUp, color: '#D46A2A' },
  ];

  const topCategories = [
    { name: 'Panadería Tradicional', value: 65, color: '#D46A2A' },
    { name: 'Pastelería Creativa', value: 25, color: '#8D6E63' },
    { name: 'Cafetería Especialidad', value: 10, color: '#EED7C5' },
  ];

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '2.5rem', margin: 0 }}>Panel Analítico</h1>
          <p style={{ color: 'var(--text-muted)' }}>Métricas clave y proyecciones de rendimiento del negocio.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '4px', background: 'white', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <button className="period-btn active">MES</button>
            <button className="period-btn">SEM</button>
            <button className="period-btn">HOY</button>
          </div>
          <button className="btn btn-secondary">
            <Download size={18} /> REPORTES
          </button>
        </div>
      </header>

      {/* Primary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            className="bakery-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ padding: '2rem', overflow: 'hidden', position: 'relative' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={24} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  fontSize: '0.75rem', 
                  fontWeight: 800,
                  color: stat.change.includes('+') ? '#10b981' : '#ef4444',
                  background: stat.change.includes('+') ? '#ecfdf5' : '#fef2f2',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}>
                  {stat.change.includes('+') ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {stat.change}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{stat.label}</p>
            <div className="serif" style={{ fontSize: '2.25rem' }}>{stat.value}</div>
            
            {/* Soft decorative background shape */}
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '100px', height: '100px', background: `${stat.color}05`, borderRadius: '50%' }} />
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Sales Activity */}
        <div className="bakery-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <h3 className="serif" style={{ fontSize: '1.5rem' }}>Flujo de Ventas</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '100%', background: 'var(--primary)', borderRadius: '2px' }} /> ACTUAL
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                <div style={{ width: '10px', height: '10px', background: '#E5E7EB', borderRadius: '2px' }} /> PROMEDIO
              </div>
            </div>
          </div>
          
          <div style={{ height: '280px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            {[35, 55, 42, 85, 68, 92, 75, 58, 82, 60, 45, 78].map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    style={{ 
                      width: '100%', 
                      background: i % 2 === 0 ? 'var(--primary)' : 'var(--primary-light)', 
                      borderRadius: '6px 6px 0 0',
                      boxShadow: '0 4px 12px rgba(212, 106, 42, 0.1)'
                    }} 
                  >
                    <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-main)' }}>{val}</div>
                  </motion.div>
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bakery-card" style={{ padding: '2.5rem' }}>
          <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Distribución</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {topCategories.map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{cat.name}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: cat.color }}>{cat.value}%</span>
                </div>
                <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.value}%` }}
                    style={{ height: '100%', background: cat.color, borderRadius: '10px' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--bg-app)', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <Target size={18} color="var(--primary)" />
              <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Meta de Ventas</h4>
            </div>
            <div className="serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>$1.8M <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'sans-serif' }}>/ mes</span></div>
            <div style={{ height: '6px', background: 'white', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: '78%', height: '100%', background: 'var(--primary)' }} />
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.75rem', marginTop: '4px', fontWeight: 700, color: 'var(--primary)' }}>78% completado</div>
          </div>
        </div>
      </div>

      <style>{`
        .period-btn {
          border: none;
          background: transparent;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.2s;
        }
        .period-btn.active {
          background: var(--bg-app);
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default Estadisticas;
