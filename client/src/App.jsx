import { useState } from 'react';
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

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'pos', label: 'Punto de Venta', icon: Store },
    { id: 'clientes', label: 'Directorio Clientes', icon: UsersRound },
    { id: 'turnos', label: 'Agenda & Turnos', icon: Calendar },
    { id: 'inventario', label: 'Inventario & Stock', icon: Box },
    { id: 'produccion', label: 'Recetario & Producción', icon: BookOpen },
    { id: 'estadisticas', label: 'Estadísticas', icon: LineChart },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Menu Trigger */}
      <button 
        className="mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 2001,
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '50%',
          display: 'none', // Shown via CSS in media query
          boxShadow: 'var(--shadow-md)'
        }}
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
            <span>Artesanal & Natural</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">ADM</div>
          <div className="user-info">
            <h4>Guadalupe</h4>
            <p>Admin Principal</p>
          </div>
          <LogOut size={16} style={{ marginLeft: 'auto', cursor: 'pointer', opacity: 0.5 }} />
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => (
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
            {activeTab === 'inicio' && <Inicio setActiveTab={handleNavClick} />}
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

        {/* Footer for Landing Page */}
        {activeTab === 'inicio' && (
          <footer style={{ marginTop: '6rem', padding: '4rem 0', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
            <div className="serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>El Aromo Panadería</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              &copy; {new Date().getFullYear()} El Aromo. Hecho con amor y masa madre.
            </p>
          </footer>
        )}
      </main>
    </div>
  );
}

export default App;
