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
  MessageCircle
} from 'lucide-react';
import ClientesList from './components/ClientesList';
import TurnosList from './components/TurnosList';
import PuntoDeVenta from './components/PuntoDeVenta';
import Inventario from './components/Inventario';
import Recetario from './components/Recetario';
import Estadisticas from './components/Estadisticas';
import Inicio from './components/Inicio';
import Login from './components/Login';

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const navItems = [
    { id: 'pos', label: 'Punto de Venta', icon: Store, roles: ['admin', 'ventas'] },
    { id: 'pos', label: 'Punto de Venta', icon: Store, roles: ['admin', 'ventas'] },
    { id: 'clientes', label: 'Directorio Clientes', icon: UsersRound, roles: ['admin', 'ventas'] },
    { id: 'turnos', label: 'Agenda & Turnos', icon: Calendar, roles: ['admin', 'ventas', 'produccion'] },
    { id: 'inventario', label: 'Inventario & Stock', icon: Box, roles: ['admin', 'produccion'] },
    { id: 'produccion', label: 'Recetario & Producción', icon: BookOpen, roles: ['admin', 'produccion'] },
    { id: 'estadisticas', label: 'Estadísticas', icon: LineChart, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  const handleNavClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getUserInfo = () => {
    switch (userRole) {
      case 'ventas': return { name: 'Cajero', roleName: 'Ventas y Atención', avatar: 'VN' };
      case 'produccion': return { name: 'Maestro Panadero', roleName: 'Producción', avatar: 'PR' };
      case 'admin': return { name: 'Guadalupe', roleName: 'Administrador Principal', avatar: 'ADM' };
      default: return { name: 'Usuario', roleName: 'Acceso Directo', avatar: 'U' };
    }
  };

  const userInfo = getUserInfo();

  if (!userRole) {
    return <Login setRole={(role) => {
      setUserRole(role);
      // Set default tab based on role
      if (role === 'admin') setActiveTab('estadisticas');
      else if (role === 'ventas') setActiveTab('pos');
      else if (role === 'produccion') setActiveTab('produccion');
    }} />;
  }

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Menu Trigger */}
      <button 
        className="mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Store size={22} color="white" />
          </div>
          <div className="logo-text">
            <h2>El Aromo</h2>
            <span>BAKERY SYSTEM</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{userInfo.avatar}</div>
          <div className="user-info">
            <h4>{userInfo.name}</h4>
            <p>{userInfo.roleName}</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1, color: 'var(--primary)' }}
            onClick={() => setUserRole(null)}
            style={{ marginLeft: 'auto', cursor: 'pointer' }}
          >
            <LogOut size={18} />
          </motion.div>
        </div>

        <nav className="nav-menu">
          {filteredNavItems.map((item) => (
            <div key={item.id} className="nav-item">
              <a
                href="#"
                className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {activeTab === item.id && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </a>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeTab === 'pos' && <PuntoDeVenta />}
            {activeTab === 'clientes' && <ClientesList />}
            {activeTab === 'turnos' && <TurnosList />}
            {activeTab === 'inventario' && <Inventario />}
            {activeTab === 'produccion' && <Recetario />}
            {activeTab === 'estadisticas' && <Estadisticas />}
          </motion.div>
        </AnimatePresence>

        {/* Floating WhatsApp Button */}
        <motion.div 
          className="whatsapp-float"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.open('https://wa.me/5491112345678', '_blank')}
        >
          <MessageCircle size={32} />
        </motion.div>

      </main>
    </div>
  );
}

export default App;
