import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChefHat, ShieldCheck } from 'lucide-react';

const Login = ({ setRole }) => {
  const roles = [
    {
      id: 'ventas',
      title: 'Ventas y Atención',
      desc: 'Accede al punto de venta y gestión de clientes.',
      icon: <ShoppingBag size={32} />,
      img: '/role_ventas.png',
      color: 'var(--primary)'
    },
    {
      id: 'produccion',
      title: 'Producción y Horno',
      desc: 'Gestiona recetas, inventario y pedidos pendientes.',
      icon: <ChefHat size={32} />,
      img: '/role_produccion.png',
      color: '#D46A2A'
    },
    {
      id: 'admin',
      title: 'Panel de Control',
      desc: 'Administración total, estadísticas y finanzas.',
      icon: <ShieldCheck size={32} />,
      img: '/role_admin.png',
      color: '#4A3728'
    }
  ];

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <div className="logo-icon" style={{ width: '60px', height: '60px' }}>🥖</div>
          <h1 className="serif" style={{ fontSize: '3.5rem', margin: 0 }}>El Aromo</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Selecciona tu área de trabajo para comenzar</p>
      </motion.div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2.5rem', 
        width: '100%', 
        maxWidth: '1200px' 
      }}>
        {roles.map((role, i) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10 }}
            onClick={() => setRole(role.id)}
            className="bakery-card"
            style={{ 
              cursor: 'pointer', 
              padding: 0, 
              overflow: 'hidden', 
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ 
              height: '200px', 
              backgroundImage: `url(${role.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))' 
              }}></div>
            </div>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'var(--primary-light)', 
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '-3.5rem auto 1.5rem',
                position: 'relative',
                boxShadow: 'var(--shadow-md)',
                zIndex: 2
              }}>
                {role.icon}
              </div>
              <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{role.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{role.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <p style={{ marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        © {new Date().getFullYear()} El Aromo · Sistema de Gestión Artesanal
      </p>
    </div>
  );
};

export default Login;
