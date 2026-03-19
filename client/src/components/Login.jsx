import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChefHat, ShieldCheck, Key, ChevronRight, Store, Calendar, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

const Login = ({ setRole }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: 'ventas',
      title: 'Ventas y Atención',
      desc: 'Acceso al terminal de ventas, caja y base de clientes.',
      icon: <ShoppingBag size={28} />,
      img: 'role_ventas.png',
      employees: [
        { name: 'Sofia M.', role: 'Cajera Turno Mañana', avatar: 'SM' },
        { name: 'Marcos P.', role: 'Atención Público', avatar: 'MP' }
      ]
    },
    {
      id: 'produccion',
      title: 'Planta y Horno',
      desc: 'Gestión de recetas, stock de insumos y pedidos pendientes.',
      icon: <ChefHat size={28} />,
      img: 'role_produccion.png',
      employees: [
        { name: 'Roberto K.', role: 'Maestro Panadero', avatar: 'RK' },
        { name: 'Elena G.', role: 'Producción Pastelería', avatar: 'EG' }
      ]
    },
    {
      id: 'admin',
      title: 'Administración Central',
      desc: 'Control de finanzas, auditoría y estadísticas de sucursal.',
      icon: <ShieldCheck size={28} />,
      img: 'role_admin.png',
      employees: [
        { name: 'Guadalupe M.', role: 'Gerente General', avatar: 'GM' }
      ]
    }
  ];

  const handleEnter = (roleId) => {
    setLoading(true);
    setTimeout(() => {
      setRole(roleId);
      setLoading(false);
    }, 600);
  };

  if (selectedRole) {
    const roleData = roles.find(r => r.id === selectedRole);
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: '2rem' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '420px', width: '100%' }}>
          <button onClick={() => setSelectedRole(null)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 800 }}>
             <ArrowLeft size={18} /> VOLVER A ROLES
          </button>
          <div className="bakery-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>{roleData.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>Seleccione su usuario para iniciar turno</p>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {roleData.employees.map(emp => (
                <motion.button
                  key={emp.name}
                  whileHover={{ scale: 1.02, background: 'var(--primary-light)' }}
                  onClick={() => handleEnter(selectedRole)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                    borderRadius: '12px', border: '1px solid var(--border-light)',
                    background: 'white', cursor: 'pointer', width: '100%', textAlign: 'left'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{emp.avatar}</div>
                  <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{emp.name}</div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.role}</div>
                  </div>
                  <Key size={16} color="var(--primary)" style={{ opacity: 0.5 }} />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', padding: '3rem 2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '14px', color: 'white' }}>
            <Store size={36} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0, letterSpacing: '-0.02em' }}>EL AROMO</h1>
        </motion.div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '0.1em', fontWeight: 600 }}>GESTIÓN INTEGRAL DE PANADERÍA Y PASTELERÍA</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        {roles.map((role, i) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bakery-card"
            style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ height: '200px', background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${role.img})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '2rem' }}>
               <h3 style={{ color: 'white', margin: 0, fontSize: '1.6rem', fontWeight: 900 }}>{role.title}</h3>
            </div>
            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{role.desc}</p>
               <button 
                 onClick={() => setSelectedRole(role.id)}
                 className="btn btn-primary"
                 style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
               >
                 INGRESAR AHORA <ChevronRight size={18} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      <footer style={{ marginTop: '5rem', textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
        <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 800 }}>SERVIDOR CENTRAL • TRANSMISIÓN ENCRIPTADA • VERSIÓN 2.5.0</p>
      </footer>

      {loading && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(62,44,28,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white', gap: '1rem' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.2)', borderTopColor: 'white', borderRadius: '50%' }} />
          <p style={{ letterSpacing: '0.1em', fontWeight: 700 }}>VERIFICANDO CREDENCIALES...</p>
        </div>
      )}
    </div>
  );
};

export default Login;
