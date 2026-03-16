import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UsersRound,
  ClipboardList
} from 'lucide-react';
import ClientesList from './components/ClientesList';
import TurnosList from './components/TurnosList';

const PastryBagIcon = ({ size = 24, strokeWidth = 2, color = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 2.5c-4.5 4.5-9 9-9 9l-4 4 4 4 4-4s4.5-4.5 9-9V2.5h-4z" />
    <path d="M16 2.5l5.5 5.5" />
    <path d="M7 11l6 6" />
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState('clientes');

  return (
    <div className="app-container">
      <div className="demo-banner">
        Interactive Demo - Persistencia con LocalStorage - El Aromo Bakery
      </div>
      
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <PastryBagIcon size={24} strokeWidth={2.5} color="white" />
          </div>
          <div className="brand-text">
            <h2>El Aromo</h2>
            <span style={{ 
              fontSize: '0.65rem', 
              textTransform: 'uppercase', 
              color: 'var(--text-muted)',
              fontWeight: 700,
              letterSpacing: '1.5px',
              display: 'block'
            }}>Panadería & Pastelería</span>
          </div>
        </div>

        <nav className="nav-menu">
          <div
            className={`nav-item ${activeTab === 'clientes' ? 'active' : ''}`}
            onClick={() => setActiveTab('clientes')}
          >
            <UsersRound size={20} strokeWidth={2.5} />
            <span>Clientes</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'turnos' ? 'active' : ''}`}
            onClick={() => setActiveTab('turnos')}
          >
            <ClipboardList size={20} strokeWidth={2.5} />
            <span>Pedidos</span>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {activeTab === 'clientes' && <ClientesList />}
            {activeTab === 'turnos' && <TurnosList />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );

}

export default App;
