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
    { id: 'inicio', label: 'Panel de Control', icon: Home, roles: ['admin', 'ventas', 'produccion'] },
    { id: 'pos', label: 'Terminal de Ventas', icon: Store, roles: ['admin', 'ventas'] },
    { id: 'pedidos', label: 'Gestión de Pedidos', icon: ShoppingBag, roles: ['admin', 'ventas'] },
    { id: 'clientes', label: 'Base de Clientes', icon: UsersRound, roles: ['admin', 'ventas'] },
    { id: 'turnos', label: 'Agenda de Turnos', icon: Calendar, roles: ['admin', 'ventas', 'produccion'] },
    { id: 'inventario', label: 'Control de Stock', icon: Box, roles: ['admin', 'produccion'] },
    { id: 'produccion', label: 'Plan de Producción', icon: BookOpen, roles: ['admin', 'produccion'] },
    { id: 'estadisticas', label: 'Reportes y Auditoría', icon: LineChart, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  const handleNavClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (role) => {
    setUserRole(role);
    if (role === 'produccion') setActiveTab('produccion');
    else if (role === 'ventas') setActiveTab('pos');
    else setActiveTab('inicio');
    addToast(`Acceso concedido para perfil ${role === 'admin' ? 'Administrador' : role.charAt(0).toUpperCase() + role.slice(1)}`);
  };

  const getUserInfo = () => {
    switch (userRole) {
      case 'ventas': return { name: 'Vendedor', roleName: 'Gestión de Ventas', avatar: 'VE' };
      case 'produccion': return { name: 'Maestro Panadero', roleName: 'Jefe de Planta', avatar: 'MA' };
      case 'admin': return { name: 'Admin Central', roleName: 'Gerencia General', avatar: 'AD' };
      default: return { name: 'Visitante', roleName: 'Sin Perfil', avatar: 'VI' };
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
        height: '64px', background: 'white', borderBottom: '1px solid var(--border-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', zIndex: 900,
        transition: 'margin-left 0.3s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'var(--primary-light)', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--accent)', color: 'var(--primary-dark)', fontSize: '0.75rem', fontWeight: 800 }}>
              <Store size={14} /> SUCURSAL CENTRAL
            </div>
            <div style={{ background: 'var(--bg-app)', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>
              <Calendar size={14} /> {new Date().toLocaleDateString('es-AR')} • TURNO MAÑANA
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{userInfo.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 700 }}>{userInfo.roleName.toUpperCase()}</div>
            </div>
            <div className="user-avatar" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: '2px solid white', boxShadow: '0 0 0 1px var(--border-light)' }}>{userInfo.avatar}</div>
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
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="logo-container" style={{ color: 'white', marginBottom: '2rem' }}>
          <div className="logo-box" style={{ background: 'var(--primary)', color: 'white', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Store size={22} />
          </div>
          <div className="logo-info" style={{ marginLeft: '12px' }}>
            <h2 style={{ color: 'white', fontSize: '1.2rem', margin: 0, fontWeight: 900 }}>El Aromo</h2>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>ERP SYSTEM PRO</span>
          </div>
        </div>

        <nav className="nav-menu" style={{ flex: 1 }}>
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
                borderRadius: '12px',
                color: activeTab === item.id ? 'white' : 'rgba(255,255,255,0.5)',
                background: activeTab === item.id ? 'var(--primary)' : 'transparent',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                marginBottom: '6px',
                transition: 'all 0.2s'
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
            </a>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
           <button onClick={() => setUserRole(null)} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '0.85rem' }}>
              <LogOut size={18} /> CERRAR SESIÓN
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ 
        marginLeft: 'var(--sidebar-width)', 
        padding: '2rem 3rem',
        paddingTop: 'calc(64px + 2rem)',
        minHeight: '100vh',
        width: 'calc(100% - var(--sidebar-width))',
        background: 'var(--bg-app)'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.type === 'success' ? 'var(--success)' : 'var(--danger)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* System Footer Links */}
        <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 800 }}>
             © {new Date().getFullYear()} EL AROMO BAKERY SYSTEM • CORPORATE VERSION 2.5.0
           </div>
           <div style={{ display: 'flex', gap: '1.5rem' }}>
              <button onClick={() => addToast('Manual de Usuario abierto (MANUAL_USUARIO.md en raíz)', 'info')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>MANUAL DE USUARIO</button>
              <button onClick={() => addToast('Conectando con Soporte Central elaromo.com.ar...', 'info')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>SOPORTE CENTRAL</button>
              <a href="#" style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>POLÍTICA DE PRIVACIDAD</a>
           </div>
        </footer>

        {/* Floating Support */}
        <motion.div 
          className="whatsapp-float"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => addToast('Estableciendo conexión con Soporte Técnico...')}
          style={{ width: '56px', height: '56px', background: 'var(--primary)', color: 'white', cursor: 'pointer' }}
        >
          <MessageCircle size={28} />
        </motion.div>
      </main>
    </div>
  );
}

export default App;
