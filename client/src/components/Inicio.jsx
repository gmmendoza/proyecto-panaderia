import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Clock, 
  Zap,
  ArrowUpRight,
  ChevronRight,
  Activity,
  AlertTriangle,
  Users
} from 'lucide-react';
import { api } from '../services/api';

const Inicio = ({ setActiveTab, userRole, showToast }) => {
  const [stats, setStats] = useState({
    ventasHoy: 0,
    ventasTotal: 0,
    pedidosPendientes: 0,
    productosTotal: 0,
    inventarioCritico: 0,
    clientesTotal: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [ventas, pedidos, productos, clientes] = await Promise.all([
        api.ventas.getAll(),
        api.pedidos.getAll(),
        api.productos.getAll(),
        api.clientes.getAll()
      ]);

      const hoy = new Date().toISOString().split('T')[0];
      const hoyVentas = ventas.filter(v => (v.createdAt || "").startsWith(hoy));
      
      setStats({
        ventasHoy: hoyVentas.reduce((acc, v) => acc + Number(v.total), 0),
        ventasTotal: ventas.reduce((acc, v) => acc + Number(v.total), 0),
        pedidosPendientes: pedidos.filter(p => !['Entregado', 'Cancelado'].includes(p.estado)).length,
        productosTotal: productos.length,
        inventarioCritico: productos.filter(p => (p.stock || 0) <= 5).length,
        clientesTotal: clientes.length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startDemo = () => {
    api.demo.enable();
  };

  const statCards = [
    { label: 'Ventas de Hoy', value: `$${stats.ventasHoy.toLocaleString()}`, icon: TrendingUp, color: 'var(--success)', trend: '+12%' },
    { label: 'Ingresos Totales', value: `$${stats.ventasTotal.toLocaleString()}`, icon: ArrowUpRight, color: 'var(--info)', trend: 'Total' },
    { label: 'Pedidos Activos', value: stats.pedidosPendientes, icon: ShoppingBag, color: 'var(--warning)', trend: 'En proceso' },
    { label: 'Stock Crítico', value: stats.inventarioCritico, icon: AlertTriangle, color: 'var(--danger)', trend: 'Urgente' },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Dashboard del Sistema</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Vista general del rendimiento y operaciones de <span style={{ fontWeight: 700, color: 'var(--primary)' }}>EL AROMO</span></p>
        </div>
        {!api.demo.isActive() && (
          <button onClick={startDemo} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <Zap size={18} /> CARGAR DATOS DEMO
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {statCards.map((stat, i) => (
          <div key={i} className="bakery-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={22} />
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: stat.color, background: `${stat.color}10`, padding: '2px 8px', borderRadius: '10px' }}>{stat.trend}</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{stat.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Left Column: Recent Pulse */}
        <div className="bakery-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} color="var(--primary)" /> Pulso del Negocio
            </h3>
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => setActiveTab('estadisticas')}>VER REPORTES</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface-soft)', border: '1px solid var(--border-light)' }}>
              <Users size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{stats.clientesTotal}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Clientes Registrados</div>
            </div>
            <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface-soft)', border: '1px solid var(--border-light)' }}>
              <Package size={24} color="var(--success)" style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{stats.productosTotal}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Productos en Catálogo</div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem' }}>SISTEMA DE GESTIÓN OPERATIVA</h4>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <button onClick={() => setActiveTab('pos')} className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '12px' }}>NUEVA VENTA</button>
              <button onClick={() => setActiveTab('pedidos')} className="btn btn-secondary" style={{ padding: '1rem 2rem', borderRadius: '12px' }}>GESTIONAR PEDIDOS</button>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="bakery-card" style={{ background: 'var(--text-main)', color: 'white' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Estado de Producción</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <Clock size={20} color="var(--primary)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{stats.pedidosPendientes} Pedidos Pendientes</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Requieren atención hoy</div>
              </div>
              <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
            </div>
          </div>

          <div className="bakery-card">
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Alertas Críticas</h3>
            {stats.inventarioCritico > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                <AlertTriangle size={20} color="var(--danger)" />
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--danger)', fontSize: '0.9rem' }}>Stock Crítico</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stats.inventarioCritico} productos bajo el mínimo</div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                No hay alertas activas
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;

