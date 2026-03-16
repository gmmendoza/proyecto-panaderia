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
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

const Estadisticas = () => {
  const stats = [
    { label: 'Ventas Totales', value: '$245.800', change: '+12.5%', icon: DollarSign, color: '#4CAF50' },
    { label: 'Clientes Nuevos', value: '124', change: '+18%', icon: Users, color: '#2196F3' },
    { label: 'Pedidos Realizados', value: '42', change: '-3%', icon: ShoppingBag, color: '#FF9800' },
    { label: 'Ticket Promedio', value: '$5.850', change: '+5%', icon: TrendingUp, color: '#7B1FA2' },
  ];

  const topProducts = [
    { name: 'Pan Francés', sales: 450, growth: 12 },
    { name: 'Medialunas', sales: 380, growth: 8 },
    { name: 'Pan de Masa Madre', sales: 210, growth: 25 },
    { name: 'Baguette', sales: 180, growth: -5 },
  ];

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div className="logo-icon" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
              <LineChart size={22} />
            </div>
            <h1 className="serif" style={{ fontSize: '2.5rem' }}>Estadísticas & Reportes</h1>
          </div>
          <p style={{ color: 'var(--bakery-text-muted)', fontSize: '0.95rem' }}>
            Análisis de rendimiento y comportamiento del negocio.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="category-pill">
            <Calendar size={16} /> Últimos 30 días
          </button>
          <button className="btn-bakery" style={{ background: 'white', color: 'var(--bakery-text)', border: '1px solid var(--bakery-border)' }}>
            <Download size={16} /> EXPORTAR
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            className="bakery-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div className="logo-icon" style={{ background: `${stat.color}15`, color: stat.color, width: '40px', height: '40px' }}>
                <stat.icon size={20} />
              </div>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                color: stat.change.startsWith('+') ? '#4CAF50' : '#F44336',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}>
                {stat.change.startsWith('+') ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.change}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--bakery-text-muted)', fontWeight: 600 }}>{stat.label}</p>
            <h2 className="serif" style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>{stat.value}</h2>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Sales Chart Placeholder */}
        <div className="bakery-card">
          <h3 className="serif" style={{ marginBottom: '1.5rem' }}>Ventas por Día</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0' }}>
            {[40, 60, 45, 90, 65, 80, 95].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  style={{ 
                    width: '100%', 
                    background: i === 6 ? 'var(--bakery-primary)' : '#EED7C5', 
                    borderRadius: '8px 8px 0 0',
                    position: 'relative'
                  }}
                >
                  <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                    {h}k
                  </div>
                </motion.div>
                <span style={{ fontSize: '0.7rem', color: 'var(--bakery-text-muted)' }}>
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bakery-card">
          <h3 className="serif" style={{ marginBottom: '1.5rem' }}>Más Vendidos</h3>
          {topProducts.map((p, i) => (
            <div key={i} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                <span style={{ color: 'var(--bakery-text-muted)' }}>{p.sales} vtas</span>
              </div>
              <div style={{ background: '#f0f0f0', height: '6px', borderRadius: '3px' }}>
                <div style={{ 
                  width: `${(p.sales / 500) * 100}%`, 
                  background: 'var(--bakery-primary)', 
                  height: '100%',
                  borderRadius: '3px'
                }} />
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#4CAF50', marginTop: '0.25rem', fontWeight: 700 }}>
                ↑ {p.growth}% crecimiento
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
