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
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand" style={{ padding: '32px 24px', borderBottom: 'none' }}>
          <div className="brand-icon" style={{ 
            width: '44px', 
            height: '44px', 
            background: 'linear-gradient(135deg, var(--primary), #EBB05E)',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(209, 90, 29, 0.2)'
          }}>
            <PastryBagIcon size={22} strokeWidth={2.5} color="white" />
          </div>
          <div className="brand-text">
            <h2 style={{ 
              fontFamily: 'Playfair Display, serif', 
              fontSize: '1.4rem', 
              color: 'var(--secondary, #1C1512)',
              lineHeight: 1.1 
            }}>El Aromo</h2>
            <span style={{ 
              fontSize: '0.65rem', 
              textTransform: 'uppercase', 
              color: 'var(--text-muted)',
              fontWeight: 700,
              letterSpacing: '1.5px'
            }}>Panadería & Pastelería</span>
          </div>
        </div>

        <nav className="nav-menu">
          <div
            className={`nav-item ${activeTab === 'clientes' ? 'active' : ''}`}
            onClick={() => setActiveTab('clientes')}
          >
            <UsersRound size={18} strokeWidth={2} />
            Clientes
          </div>
          <div
            className={`nav-item ${activeTab === 'turnos' ? 'active' : ''}`}
            onClick={() => setActiveTab('turnos')}
          >
            <ClipboardList size={18} strokeWidth={2} />
            Turnos y Pedidos
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
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
