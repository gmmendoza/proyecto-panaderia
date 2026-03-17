import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChefHat, ShieldCheck, User, ArrowLeft, Key } from 'lucide-react';

const Login = ({ setRole }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'ventas',
      title: 'Ventas y Atención',
      desc: 'Accede al punto de venta y gestión de clientes.',
      icon: <ShoppingBag size={32} />,
      img: 'role_ventas.png',
      color: 'var(--primary)',
      employees: [
        { name: 'Sofia M.', role: 'Cajera Senior', avatar: 'SM' },
        { name: 'Marcos P.', role: 'Turno Tarde', avatar: 'MP' }
      ]
    },
    {
      id: 'produccion',
      title: 'Producción y Horno',
      desc: 'Gestiona recetas, inventario y pedidos pendientes.',
      icon: <ChefHat size={32} />,
      img: 'role_produccion.png',
      color: '#D46A2A',
      employees: [
        { name: 'Chef Roberto', role: 'Maestro Panadero', avatar: 'CR' },
        { name: 'Elena G.', role: 'Especialista en Pastas', avatar: 'EG' }
      ]
    },
    {
      id: 'admin',
      title: 'Administración',
      desc: 'Control total de finanzas, personal y estadísticas.',
      icon: <ShieldCheck size={32} />,
      img: 'role_admin.png',
      color: '#4A3728',
      employees: [
        { name: 'Guadalupe', role: 'Gerente General', avatar: 'ADM' }
      ]
    }
  ];

  if (selectedRole) {
    const roleData = roles.find(r => r.id === selectedRole);
    return (
      <div className="login-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: '2rem' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: '400px', width: '100%' }}>
          <button 
            onClick={() => setSelectedRole(null)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '2rem', fontWeight: 600 }}
          >
            <ArrowLeft size={18} /> Volver a Roles
          </button>
          
          <div className="bakery-card glass" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{roleData.title}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Selecciona tu perfil de usuario</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {roleData.employees.map((emp, i) => (
                <motion.button
                  key={emp.name}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRole(selectedRole)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '1rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border-light)',
                    background: 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {emp.avatar}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{emp.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.role}</span>
                  </div>
                  <Key size={16} style={{ marginLeft: 'auto', opacity: 0.3 }} />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="login-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-app)',
      padding: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div className="logo-icon glass" style={{ width: '80px', height: '80px', fontSize: '2.5rem', background: 'var(--primary)', boxShadow: '0 20px 40px rgba(253, 184, 19, 0.3)' }}>🥨</div>
          <h1 className="serif" style={{ fontSize: '4.5rem', margin: 0, background: 'linear-gradient(135deg, #3D2C1E 0%, #8C7A6B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>El Aromo</h1>
        </div>
        <p className="serif" style={{ color: 'var(--text-muted)', fontSize: '1.4rem', fontStyle: 'italic' }}>Artesanos del Pan • Maestros del Sabor</p>
      </motion.div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '3rem', 
        width: '100%', 
        maxWidth: '1100px' 
      }}>
        {roles.map((role, i) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ y: -15 }}
            onClick={() => setSelectedRole(role.id)}
            className="bakery-card glass"
            style={{ 
              cursor: 'pointer', 
              padding: 0, 
              overflow: 'hidden', 
              background: 'white',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ 
              height: '220px', 
              backgroundImage: `url(${role.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to bottom, transparent, rgba(61,44,30,0.6))' 
              }}></div>
              <div style={{ position: 'absolute', bottom: '20px', left: '25px', color: 'white' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.9 }}>ÁREA DE TRABAJO</span>
                <h3 className="serif" style={{ fontSize: '1.8rem', margin: '4px 0 0 0' }}>{role.title}</h3>
              </div>
            </div>
            <div style={{ padding: '2rem' }}>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{role.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                INGRESAR AHORA <ChevronRight size={18} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <p style={{ marginTop: '5rem', color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
        © {new Date().getFullYear()} EL AROMO BAKERY · CORPORATE SYSTEM V2.4
      </p>
    </div>
  );
};

export default Login;
