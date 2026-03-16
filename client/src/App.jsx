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
  Search,
  ChevronRight
} from 'lucide-react';
import ClientesList from './components/ClientesList';
import TurnosList from './components/TurnosList';
import PuntoDeVenta from './components/PuntoDeVenta';
import Inventario from './components/Inventario';
import Recetario from './components/Recetario';
import Estadisticas from './components/Estadisticas';
import Inicio from './components/Inicio';

// Placeholder components for new sections
const Placeholder = ({ name }) => (
  <div className="fade-in">
    <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{name}</h2>
    <div className="bakery-card" style={{ padding: '3rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--bakery-text-muted)' }}>La sección de {name} está siendo restaurada...</p>
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('pos');

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'pos', label: 'Punto de Venta', icon: Store },
    { id: 'clientes', label: 'Directorio Clientes', icon: UsersRound },
    { id: 'turnos', label: 'Agenda & Turnos', icon: Calendar },
    { id: 'inventario', label: 'Inventario & Stock', icon: Box },
    { id: 'produccion', label: 'Recetario & Producción', icon: BookOpen },
    { id: 'estadisticas', label: 'Estadísticas', icon: LineChart },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Store size={22} fill="white" />
          </div>
          <div className="logo-text">
            <h2>El Aromo</h2>
            <span>Bakery System</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">ADM</div>
          <div className="user-info">
            <h4>Admin</h4>
            <p>Administrador</p>
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
                  setActiveTab(item.id);
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'inicio' && <Inicio setActiveTab={setActiveTab} />}
            {activeTab === 'pos' && <PuntoDeVenta />}
            {activeTab === 'clientes' && <ClientesList />}
            {activeTab === 'turnos' && <TurnosList />}
            {activeTab === 'inventario' && <Inventario />}
            {activeTab === 'produccion' && <Recetario />}
            {activeTab === 'estadisticas' && <Estadisticas />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
