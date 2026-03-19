import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Store,
  UsersRound,
  Calendar,
  Box,
  BookOpen,
  LineChart,
  LogOut,
  ChevronRight,
  Menu,
  X,
  MessageCircle,
  ShoppingBag
} from 'lucide-react';
import ClientesList from './components/ClientesList';
import TurnosList from './components/TurnosList';
import PuntoDeVenta from './components/PuntoDeVenta';
import Inventario from './components/Inventario';
import Recetario from './components/Recetario';
import Estadisticas from './components/Estadisticas';
import Inicio from './components/Inicio';
import Login from './components/Login';
import Pedidos from './components/Pedidos';

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const navItems = [
    { id: 'inicio', label: 'Dashboard', icon: Home, roles: ['admin', 'ventas', 'produccion'] },
    { id: 'pos', label: 'Punto de Venta', icon: Store, roles: ['admin', 'ventas'] },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag, roles: ['admin', 'ventas'] },
    { id: 'clientes', label: 'Clientes', icon: UsersRound, roles: ['admin', 'ventas'] },
    { id: 'turnos', label: 'Turnos', icon: Calendar, roles: ['admin', 'ventas', 'produccion'] },
    { id: 'inventario', label: 'Stock', icon: Box, roles: ['admin', 'produccion'] },
    { id: 'produccion', label: 'Producción', icon: BookOpen, roles: ['admin', 'produccion'] },
    { id: 'estadisticas', label: 'Analytics', icon: LineChart, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  const handleNavClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (role) => {
    setUserRole(role);
    // Role-based redirection logic
    if (role === 'produccion') setActiveTab('produccion');
    else if (role === 'ventas') setActiveTab('pos');
    else setActiveTab('inicio');
    
    addToast(`Sesión iniciada como ${role === 'admin' ? 'Administrador' : role.charAt(0).toUpperCase() + role.slice(1)}`);
  };

  const getUserInfo = () => {
    switch (userRole) {
      case 'ventas': return { name: 'Vendedor', roleName: 'Atención al Cliente', avatar: 'VE' };
      case 'produccion': return { name: 'Maestro Panadero', roleName: 'Producción de Planta', avatar: 'MA' };
      case 'admin': return { name: 'Admin Central', roleName: 'Gestión Total', avatar: 'AD' };
      default: return { name: 'Invitado', roleName: 'Modo Consulta', avatar: 'IN' };
    }
  };

  const userInfo = getUserInfo();

  if (!userRole) {
    return <Login setRole={handleLogin} />;
  }

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Top Professional Header */}
      <header className="system-top-bar" style={{ 
        position: 'fixed', top: 0, right: 0, left: 0, 
        marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-width)',
        height: '60px', background: 'white', borderBottom: '1px solid var(--border-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', zIndex: 900,
        transition: 'margin-left 0.3s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
            <Menu size={20} />
          </button>
          <div style={{ background: 'var(--primary-light)', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--accent)', color: 'var(--primary-dark)', fontSize: '0.8rem', fontWeight: 700 }}>
            <Store size={14} /> SUCURSAL CENTRAL - EL AROMO
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
             <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Turno: Mañana (ACTIVO)</div>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{userInfo.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--primary)' }}>{userInfo.roleName}</div>
            </div>
            <div className="user-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{userInfo.avatar}</div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ 
        background: 'var(--bg-sidebar)', 
        color: 'white',
        width: 'var(--sidebar-width)',
        position: 'fixed',
        left: 0,
        height: '100vh',
        zIndex: 1000,
        padding: '2rem 1.5rem',
        transition: 'all 0.3s ease'
      }}>
        <div className="logo-container" style={{ color: 'white' }}>
          <div className="logo-box" style={{ background: 'var(--primary)', color: 'white' }}>
            <Store size={24} />
          </div>
          <div className="logo-info">
            <h2 style={{ color: 'white' }}>El Aromo</h2>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>BAKERY ERP</span>
          </div>
        </div>

        <div className="sidebar-user" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem', margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="user-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{userInfo.avatar}</div>
          <div className="user-info">
            <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{userInfo.name}</h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{userInfo.roleName}</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1, color: 'var(--accent)' }}
            onClick={() => setUserRole(null)}
            style={{ marginLeft: 'auto', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}
          >
            <LogOut size={18} />
          </motion.div>
        </div>

        <nav className="nav-menu">
          {filteredNavItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                color: activeTab === item.id ? 'white' : 'rgba(255,255,255,0.6)',
                background: activeTab === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                marginBottom: '4px'
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {activeTab === item.id && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)', marginLeft: 'auto' }} />}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ 
        marginLeft: 'var(--sidebar-width)', 
        padding: '2rem 3rem',
        minHeight: '100vh',
        width: 'calc(100% - var(--sidebar-width))'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'inicio' && <Inicio setActiveTab={setActiveTab} userRole={userRole} showToast={addToast} />}
            {activeTab === 'pos' && <PuntoDeVenta showToast={addToast} />}
            {activeTab === 'pedidos' && <Pedidos showToast={addToast} />}
            {activeTab === 'clientes' && <ClientesList showToast={addToast} />}
            {activeTab === 'turnos' && <TurnosList showToast={addToast} />}
            {activeTab === 'inventario' && <Inventario showToast={addToast} />}
            {activeTab === 'produccion' && <Recetario showToast={addToast} />}
            {activeTab === 'estadisticas' && <Estadisticas showToast={addToast} />}
          </motion.div>
        </AnimatePresence>

        {/* Global Toasts */}
        <div className="toast-container">
          <AnimatePresence>
            {toasts.map(t => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                className="toast"
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.type === 'success' ? 'var(--success)' : 'var(--danger)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Floating WhatsApp Button */}
        <motion.div 
          className="whatsapp-float"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.open('https://wa.me/5491112345678', '_blank')}
          style={{ width: '56px', height: '56px' }}
        >
          <MessageCircle size={28} />
        </motion.div>

      </main>
    </div>
  );
}

export default App;
