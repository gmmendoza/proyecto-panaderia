// detect if we should use mock data 
const isMock = localStorage.getItem('bakery_demo_mode') === 'true' || 
               (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

const initialClientes = [
    { id: 1, nombre: 'Guadalupe', apellido: 'Mendoza', telefono: '3764-123456', saldo: 0 },
    { id: 2, nombre: 'Ana', apellido: 'García', telefono: '3764-987654', saldo: 1500.50 },
    { id: 3, nombre: 'Juan', apellido: 'Pérez', telefono: '3764-000001', saldo: -500.00 },
    { id: 4, nombre: 'Roberto', apellido: 'Sánchez', telefono: '3764-555666', saldo: 240.00 },
];

const initialTurnos = [
    { 
        id: 1, 
        fechaHora: new Date(Date.now() + 86400000).toISOString(),
        estado: 'Pendiente',
        Cliente: { nombre: 'Guadalupe', apellido: 'Mendoza' },
        nota: 'Pedido de catering - 20 personas'
    },
    { 
        id: 2, 
        fechaHora: new Date(Date.now() + 172800000).toISOString(),
        estado: 'Pendiente',
        Cliente: { nombre: 'Roberto', apellido: 'Sánchez' },
        nota: 'Retiro de torta de cumpleaños'
    }
];

const initialProductos = [
    { id: 1, nombre: 'Pan Francés', precio: 1200, unidad: 'kg', categoria: 'Panadería', stock: 45, stockMax: 100 },
    { id: 2, nombre: 'Pan de Masa Madre', precio: 2800, unidad: 'kg', categoria: 'Panadería', stock: 12, stockMax: 80 },
    { id: 3, nombre: 'Baguette', precio: 950, unidad: 'un', categoria: 'Panadería', stock: 3, stockMax: 100 },
    { id: 4, nombre: 'Croissant Premium', precio: 1500, unidad: 'un', categoria: 'Pastelería', stock: 120, stockMax: 200 },
    { id: 5, nombre: 'Harina 000', precio: 850, unidad: 'kg', categoria: 'Insumos', stock: 500, stockMax: 1000 },
    { id: 6, nombre: 'Manteca', precio: 4500, unidad: 'kg', categoria: 'Insumos', stock: 5, stockMax: 50 },
    { id: 7, nombre: 'Levadura', precio: 1200, unidad: 'kg', categoria: 'Insumos', stock: 2, stockMax: 20 },
    { id: 8, nombre: 'Azúcar Blanca', precio: 1100, unidad: 'kg', categoria: 'Insumos', stock: 80, stockMax: 200 },
];

const initialVentas = [
    { id: 1, createdAt: new Date().toISOString(), total: 4500, metodoPago: 'Efectivo', items: [{ nombre: 'Pan Francés', qty: 2, total: 2400 }] },
];

const initialPedidos = [
    { id: 'PED-001', cliente: 'Marta R.', items: 'Torta de Cumpleaños (Vainilla/DDL)', fechaEntrega: new Date(Date.now() + 172800000).toISOString().split('T')[0], horaEntrega: '17:00', total: 15000, sena: 5000, estado: 'Pendiente', prioridad: 'Media' },
    { id: 'PED-002', cliente: 'Jorge S.', items: '5kg Bizcochos de Grasa', fechaEntrega: new Date(Date.now() + 86400000).toISOString().split('T')[0], horaEntrega: '09:00', total: 6500, sena: 2000, estado: 'Procesando', prioridad: 'Alta' }
];

const getStorage = (key, initial) => {
    const data = localStorage.getItem(key);
    if (!data) {
        localStorage.setItem(key, JSON.stringify(initial));
        return initial;
    }
    return JSON.parse(data);
};

const initialRecetas = [
    { 
        id: 1, 
        nombre: 'Pan Francés Tradicional', 
        categoria: 'Panes', 
        tiempo: '4h', 
        ingredientes: [
            { nombre: 'Harina 000', base: 1000, unidad: 'g' },
            { nombre: 'Agua', base: 650, unidad: 'ml' },
            { nombre: 'Sal', base: 20, unidad: 'g' },
            { nombre: 'Levadura Fresca', base: 25, unidad: 'g' }
        ],
        pasos: [
            'Amasado inicial (15 min) hasta lograr elasticidad.',
            'Primera fermentación en bloque (2h).',
            'División y preformado.',
            'Descanso y formado final.',
            'Segunda fermentación (1.5h).',
            'Horneado a 220°C.'
        ],
        img: 'gallery2.png',
        favorito: true,
        descripcion: 'Corteza crujiente y miga aireada.'
    }
];

export const api = {
    demo: {
        enable: () => {
            localStorage.setItem('bakery_demo_mode', 'true');
            // Populate all stores with initial data if empty
            localStorage.setItem('bakery_clientes', JSON.stringify(initialClientes));
            localStorage.setItem('bakery_productos', JSON.stringify(initialProductos));
            localStorage.setItem('bakery_pedidos', JSON.stringify(initialPedidos));
            localStorage.setItem('bakery_turnos', JSON.stringify(initialTurnos));
            localStorage.setItem('bakery_ventas', JSON.stringify(initialVentas));
            localStorage.setItem('bakery_recetas', JSON.stringify(initialRecetas));
            window.location.reload();
        },
        disable: () => {
            localStorage.setItem('bakery_demo_mode', 'false');
            window.location.reload();
        },
        isActive: () => isMock
    },
    clientes: {
        getAll: async () => {
            if (isMock) return getStorage('bakery_clientes', initialClientes);
            const res = await fetch('/api/clientes');
            return res.json();
        },
        create: async (data) => {
            if (isMock) {
                const list = getStorage('bakery_clientes', initialClientes);
                const newItem = { ...data, id: Date.now() };
                localStorage.setItem('bakery_clientes', JSON.stringify([newItem, ...list]));
                return newItem;
            }
            const res = await fetch('/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        }
    },
    productos: {
        getAll: async () => {
            if (isMock) return getStorage('bakery_productos', initialProductos);
            const res = await fetch('/api/productos');
            return res.json();
        },
        create: async (data) => {
            if (isMock) {
                const list = getStorage('bakery_productos', initialProductos);
                const newItem = { ...data, id: Date.now() };
                localStorage.setItem('bakery_productos', JSON.stringify([newItem, ...list]));
                return newItem;
            }
            const res = await fetch('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        update: async (id, data) => {
            if (isMock) {
                const list = getStorage('bakery_productos', initialProductos);
                const newList = list.map(p => p.id === id ? { ...p, ...data } : p);
                localStorage.setItem('bakery_productos', JSON.stringify(newList));
                return data;
            }
            const res = await fetch(`/api/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            if (isMock) {
                const list = getStorage('bakery_productos', initialProductos);
                localStorage.setItem('bakery_productos', JSON.stringify(list.filter(p => p.id !== id)));
                return true;
            }
            await fetch(`/api/productos/${id}`, { method: 'DELETE' });
            return true;
        }
    },
    ventas: {
        getAll: async () => {
            if (isMock) return getStorage('bakery_ventas', initialVentas);
            const res = await fetch('/api/ventas');
            return res.json();
        },
        create: async (data) => {
            if (isMock) {
                const list = getStorage('bakery_ventas', initialVentas);
                const newItem = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
                localStorage.setItem('bakery_ventas', JSON.stringify([newItem, ...list]));
                return newItem;
            }
            const res = await fetch('/api/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        }
    },
    pedidos: {
        getAll: async () => {
            if (isMock) return getStorage('bakery_pedidos', initialPedidos);
            const res = await fetch('/api/pedidos');
            return res.json();
        },
        create: async (data) => {
            if (isMock) {
                const list = getStorage('bakery_pedidos', initialPedidos);
                const newItem = { ...data, id: Date.now() };
                localStorage.setItem('bakery_pedidos', JSON.stringify([newItem, ...list]));
                return newItem;
            }
            const res = await fetch('/api/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        update: async (id, data) => {
            if (isMock) {
                const list = getStorage('bakery_pedidos', initialPedidos);
                const newList = list.map(p => p.id === id ? { ...p, ...data } : p);
                localStorage.setItem('bakery_pedidos', JSON.stringify(newList));
                return data;
            }
            const res = await fetch(`/api/pedidos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            if (isMock) {
                const list = getStorage('bakery_pedidos', initialPedidos);
                localStorage.setItem('bakery_pedidos', JSON.stringify(list.filter(p => p.id !== id)));
                return true;
            }
            await fetch(`/api/pedidos/${id}`, { method: 'DELETE' });
            return true;
        }
    },
    recetas: {
        getAll: async () => {
            if (isMock) return getStorage('bakery_recetas', initialRecetas);
            const res = await fetch('/api/recetas');
            return res.json();
        },
        create: async (data) => {
            if (isMock) {
                const list = getStorage('bakery_recetas', initialRecetas);
                const newItem = { ...data, id: Date.now() };
                localStorage.setItem('bakery_recetas', JSON.stringify([newItem, ...list]));
                return newItem;
            }
            const res = await fetch('/api/recetas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        update: async (id, data) => {
            if (isMock) {
                const list = getStorage('bakery_recetas', initialRecetas);
                const newList = list.map(r => r.id === id ? { ...r, ...data } : r);
                localStorage.setItem('bakery_recetas', JSON.stringify(newList));
                return data;
            }
            const res = await fetch(`/api/recetas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            if (isMock) {
                const list = getStorage('bakery_recetas', initialRecetas);
                localStorage.setItem('bakery_recetas', JSON.stringify(list.filter(r => r.id !== id)));
                return true;
            }
            await fetch(`/api/recetas/${id}`, { method: 'DELETE' });
            return true;
        }
    },
    turnos: {
        getAll: async () => {
            if (isMock) return getStorage('bakery_turnos', initialTurnos);
            const res = await fetch('/api/turnos');
            return res.json();
        },
        create: async (data) => {
            if (isMock) {
                const list = getStorage('bakery_turnos', initialTurnos);
                const newItem = { 
                    ...data, 
                    id: Date.now(),
                    Cliente: data.Cliente || { nombre: 'Cliente', apellido: 'Nuevo' }
                };
                localStorage.setItem('bakery_turnos', JSON.stringify([newItem, ...list]));
                return newItem;
            }
            const res = await fetch('/api/turnos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        update: async (id, data) => {
            if (isMock) {
                const list = getStorage('bakery_turnos', initialTurnos);
                const newList = list.map(t => t.id === id ? { ...t, ...data } : t);
                localStorage.setItem('bakery_turnos', JSON.stringify(newList));
                return data;
            }
            const res = await fetch(`/api/turnos/${id}/estado`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            if (isMock) {
                const list = getStorage('bakery_turnos', initialTurnos);
                localStorage.setItem('bakery_turnos', JSON.stringify(list.filter(t => t.id !== id)));
                return true;
            }
            // Add real delete if needed, for now just status update
            return true;
        }
    },
    stats: {
        get: async () => {
            if (isMock) {
                const clientes = getStorage('bakery_clientes', initialClientes);
                const productos = getStorage('bakery_productos', initialProductos);
                const pedidos = getStorage('bakery_pedidos', initialPedidos);
                const ventas = getStorage('bakery_ventas', initialVentas);
                
                const totalVentasHoy = ventas.length; // Simplified
                const ingresosEstimados = ventas.reduce((acc, v) => acc + (v.total || 0), 0);
                
                return {
                    ventasHoy: totalVentasHoy,
                    clientesTotal: clientes.length,
                    pedidosPendientes: pedidos.filter(p => p.estado !== 'Entregado').length,
                    ingresosEstimados: ingresosEstimados || 45000,
                    stockBajo: productos.filter(p => p.stock < p.stockMax * 0.2).length
                };
            }
            const res = await fetch('/api/stats');
            return res.json();
        }
    }
};

