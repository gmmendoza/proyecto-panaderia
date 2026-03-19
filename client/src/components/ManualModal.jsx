import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, Printer, ChevronRight, Info, Shield, ShoppingBag, Settings } from 'lucide-react';

const ManualModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(45, 36, 28, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 5000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bakery-card"
          style={{
            width: '100%',
            maxWidth: '900px',
            height: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: 'none',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'var(--bg-sidebar)',
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
                <Book size={24} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'white', fontFamily: 'var(--font-serif)' }}>Manual de Operaciones ERP</h2>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.1em' }}>SISTEMA EL AROMO • VERSIÓN CORPORATIVA 2.5.2</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '10px', borderRadius: '50%', display: 'flex' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Area */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Sidebar Navigation */}
            <aside style={{ 
              width: '260px', 
              background: 'var(--bg-app)', 
              borderRight: '1px solid var(--border-light)',
              padding: '2rem 1rem',
              overflowY: 'auto'
            }}>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#intro" style={navItemStyle}> <Info size={16} /> Introducción</a>
                <a href="#acceso" style={navItemStyle}> <Shield size={16} /> Seguridad y Roles</a>
                <a href="#ventas" style={navItemStyle}> <ShoppingBag size={16} /> Ventas y Cobros</a>
                <a href="#produccion" style={navItemStyle}> <Book size={16} /> Producción</a>
                <a href="#admin" style={navItemStyle}> <Settings size={16} /> Administración</a>
              </nav>
              
              <div style={{ marginTop: '3rem', padding: '1rem', background: 'var(--primary-light)', borderRadius: '12px', border: '1px solid var(--accent)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '8px' }}>CENTRO DE AYUDA</div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>¿Necesitas asistencia inmediata? Contacta al soporte central.</p>
                <button 
                  onClick={() => window.open('mailto:soporte@elaromo.com.ar')}
                  style={{ marginTop: '10px', background: 'var(--primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  CONTACTAR
                </button>
              </div>
            </aside>

            {/* Main Content View */}
            <main style={{ flex: 1, overflowY: 'auto', padding: '3rem', background: 'white' }}>
              <section id="intro">
                <h3 style={sectionTitleStyle}>1. Introducción al Ecosistema</h3>
                <p style={paragraphStyle}>Bienvenido al sistema de gestión El Aromo. Esta plataforma ha sido diseñada para unificar todos los procesos de la panadería, desde el control de insumos básicos hasta el análisis de rentabilidad gerencial.</p>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '1.5rem 0' }}>
                   <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}> <Info size={16} /> RECOMENDACIÓN</div>
                   <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>El sistema está optimizado para su uso en computadoras centrales de mostrador. Se recomienda el uso de navegadores modernos como Chrome o Edge.</p>
                </div>
              </section>

              <hr style={dividerStyle} />

              <section id="acceso">
                <h3 style={sectionTitleStyle}>2. Seguridad y Perfiles</h3>
                <p style={paragraphStyle}>El ERP adapta sus herramientas según el rol de quien inicia sesión:</p>
                <ul style={listStyle}>
                  <li><strong>Ventas:</strong> Acceso a Terminal y Pedidos de Clientes.</li>
                  <li><strong>Producción:</strong> Plan de horneado, recetas y control de mermas.</li>
                  <li><strong>Administración:</strong> Monitorización de KPIs y exportación de auditorías.</li>
                </ul>
              </section>

              <hr style={dividerStyle} />

              <section id="ventas">
                <h3 style={sectionTitleStyle}>3. Operativa de Ventas (POS)</h3>
                <p style={paragraphStyle}>Para realizar una venta efectiva:</p>
                <ol style={listStyle}>
                  <li>Seleccione los productos del catálogo mediante clics o búsqueda por nombre.</li>
                  <li>Verifique que el stock sea suficiente (indicado en cada ficha de producto).</li>
                  <li>Elija el método de pago correcto para mantener la integridad del arqueo de caja.</li>
                  <li>Pulse <strong>Finalizar Facturación</strong> para dar de baja el stock automáticamente.</li>
                </ol>
              </section>

              <hr style={dividerStyle} />

              <section id="produccion">
                <h3 style={sectionTitleStyle}>4. Gestión de Producción</h3>
                <p style={paragraphStyle}>El módulo de producción permite transformar materia prima en productos finales:</p>
                <ul style={listStyle}>
                  <li><strong>Recetario Digital:</strong> Consulte las proporciones exactas para cada lote.</li>
                  <li><strong>Modo Checklist:</strong> Marque los ingredientes a medida que se incorporan al proceso de amasado para evitar errores.</li>
                  <li><strong>Baja de Stock:</strong> Al completar un lote, los insumos (harina, manteca, levadura) se descuentan globalmente.</li>
                </ul>
              </section>

              <hr style={dividerStyle} />

              <section id="admin">
                <h3 style={sectionTitleStyle}>5. Reportes y Exportación</h3>
                <p style={paragraphStyle}>Desde el Panel de Control, puede exportar los datos operativos:</p>
                <ul style={listStyle}>
                  <li><strong>Exportación PDF:</strong> Ideal para imprimir cierres de caja firmados.</li>
                  <li><strong>Exportación Excel:</strong> Análisis avanzado de rotación de productos e inventarios.</li>
                </ul>
              </section>
            </main>
          </div>

          {/* Footer */}
          <div style={{ 
            padding: '1.2rem 2rem', 
            background: 'var(--bg-app)', 
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              © 2026 El Aromo Panadería Artesanal. Todos los derechos reservados.
            </div>
            <button 
              onClick={() => window.print()}
              className="btn btn-secondary" 
              style={{ padding: '0.6rem 1.2rem', gap: '10px' }}
            >
              <Printer size={16} /> IMPRIMIR MANUAL
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Internal styles
const navItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '0.8rem 1rem',
  borderRadius: '10px',
  color: 'var(--text-main)',
  textDecoration: 'none',
  fontSize: '0.85rem',
  fontWeight: 700,
  transition: 'all 0.2s',
  background: 'white',
  marginBottom: '4px',
  border: '1px solid transparent'
};

const sectionTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: 900,
  color: 'var(--primary-dark)',
  marginBottom: '1.2rem',
  fontFamily: 'var(--font-serif)'
};

const paragraphStyle = {
  fontSize: '0.95rem',
  color: 'var(--text-main)',
  lineHeight: 1.6,
  marginBottom: '1.5rem'
};

const listStyle = {
  fontSize: '0.95rem',
  color: 'var(--text-main)',
  lineHeight: 1.8,
  marginBottom: '1.5rem',
  paddingLeft: '1.5rem'
};

const dividerStyle = {
  border: 'none',
  borderTop: '1px solid var(--border-light)',
  margin: '2.5rem 0'
};

export default ManualModal;
