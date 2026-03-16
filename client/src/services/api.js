// detect if we should use mock data (e.g. running from file:// or on a static host like GitHub Pages)
const isMock = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? (window.location.pathname.includes('demo') ? true : false) 
    : true;

const initialClientes = [
    { id: 1, nombre: 'Guadalupe', apellido: 'Mendoza', telefono: '3764-123456', saldo: 0 },
    { id: 2, nombre: 'Ana', apellido: 'García', telefono: '3764-987654', saldo: 1500.50 },
    { id: 3, nombre: 'Juan', apellido: 'Pérez', telefono: '3764-000001', saldo: -500.00 },
    { id: 4, nombre: 'Roberto', apellido: 'Sánchez', telefono: '3764-555666', saldo: 240.00 },
    { id: 5, nombre: 'Marta', apellido: 'Rodríguez', telefono: '3764-111222', saldo: 0 },
    { id: 6, nombre: 'Carlos', apellido: 'Gómez', telefono: '3764-333444', saldo: 4500.00 },
    { id: 7, nombre: 'Lucía', apellido: 'López', telefono: '3764-777888', saldo: -120.50 },
    { id: 8, nombre: 'Fernando', apellido: 'Torres', telefono: '3764-999000', saldo: 0 },
    { id: 9, nombre: 'Elena', apellido: 'Díaz', telefono: '3764-222333', saldo: 890.00 },
    { id: 10, nombre: 'Ricardo', apellido: 'Vázquez', telefono: '3764-444555', saldo: 0 }
];

const initialTurnos = [
    { 
        id: 1, 
        clienteId: 1, 
        fechaHora: new Date(Date.now() + 86400000).toISOString(),
        estado: 'Pendiente',
        Cliente: { id: 1, nombre: 'Guadalupe', apellido: 'Mendoza' }
    },
    { 
        id: 2, 
        clienteId: 2, 
        fechaHora: new Date(Date.now() - 3600000).toISOString(),
        estado: 'Completado',
        Cliente: { id: 2, nombre: 'Ana', apellido: 'García' }
    }
];

const initialProductos = [
    { id: 1, nombre: 'Pan Francés', precio: 1200, unidad: 'kg', categoria: 'Panadería', porPeso: true, stock: 45 },
    { id: 2, nombre: 'Pan de Masa Madre', precio: 2800, unidad: 'kg', categoria: 'Panadería', porPeso: true, stock: 12 },
    { id: 3, nombre: 'Baguette', precio: 950, unidad: 'u', categoria: 'Panadería', porPeso: false, stock: 30 },
    { id: 4, nombre: 'Pan de Campo', precio: 1500, unidad: 'u', categoria: 'Panadería', porPeso: false, stock: 15 },
    { id: 5, nombre: 'Medialunas', precio: 450, unidad: 'u', categoria: 'Pastelería', porPeso: false, stock: 120 },
    { id: 6, nombre: 'Tarta de Fresa', precio: 8500, unidad: 'u', categoria: 'Pastelería', porPeso: false, stock: 8 },
    { id: 7, nombre: 'Café Expresso', precio: 1200, unidad: 'u', categoria: 'Cafetería', porPeso: false, stock: 999 },
    { id: 8, nombre: 'Sándwich de Miga', precio: 800, unidad: 'u', categoria: 'Salados', porPeso: false, stock: 50 }
];

const initialVentas = [
    { id: 1, fecha: new Date().toISOString(), cliente: 'Consumidor Final', total: 4500, items: 3 },
    { id: 2, fecha: new Date(Date.now() - 86400000).toISOString(), cliente: 'Ana García', total: 2800, items: 1 }
];

const getStorage = (key, initial) => {
    const data = localStorage.getItem(key);
    if (!data) {
        localStorage.setItem(key, JSON.stringify(initial));
        return initial;
    }
    return JSON.parse(data);
};

export const api = {
    clientes: {
        getAll: async () => {
            if (isMock) {
                // Return a copy to avoid mutating initial storage directly in-memory
                return getStorage('bakery_clientes', initialClientes);
            }
            const res = await fetch('/api/clientes');
            return res.json();
        },
        create: async (data) => {
            if (isMock) {
                const list = getStorage('bakery_clientes', initialClientes);
                const newItem = { ...data, id: Date.now() };
                const newList = [newItem, ...list];
                localStorage.setItem('bakery_clientes', JSON.stringify(newList));
                return newItem;
            }
            const res = await fetch('/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        delete: async (id) => {
            if (isMock) {
                const list = getStorage('bakery_clientes', initialClientes);
                localStorage.setItem('bakery_clientes', JSON.stringify(list.filter(c => c.id !== id)));
                return true;
            }
            await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
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
                const clientes = getStorage('bakery_clientes', initialClientes);
                const cliente = clientes.find(c => c.id === data.clienteId);
                const newItem = { 
                    ...data, 
                    id: Date.now(),
                    Cliente: cliente ? { id: cliente.id, nombre: cliente.nombre, apellido: cliente.apellido } : null
                };
                const newList = [newItem, ...list];
                localStorage.setItem('bakery_turnos', JSON.stringify(newList));
                return newItem;
            }
            const res = await fetch('/api/turnos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        },
        updateEstado: async (id, estado) => {
            if (isMock) {
                const list = getStorage('bakery_turnos', initialTurnos);
                const newList = list.map(item => 
                    item.id === id ? { ...item, estado } : item
                );
                localStorage.setItem('bakery_turnos', JSON.stringify(newList));
                return true;
            }
            await fetch(`/api/turnos/${id}/estado`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado })
            });
            return true;
        },
        delete: async (id) => {
            if (isMock) {
                const list = getStorage('bakery_turnos', initialTurnos);
                localStorage.setItem('bakery_turnos', JSON.stringify(list.filter(t => t.id !== id)));
                return true;
            }
            await fetch(`/api/turnos/${id}`, { method: 'DELETE' });
            return true;
        }
    },
    productos: {
        getAll: async () => {
            if (isMock) return getStorage('bakery_productos', initialProductos);
            const res = await fetch('/api/productos');
            return res.json();
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
                const newItem = { ...data, id: list.length + 1, fecha: new Date().toISOString() };
                const newList = [newItem, ...list];
                localStorage.setItem('bakery_ventas', JSON.stringify(newList));
                return newItem;
            }
            const res = await fetch('/api/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        }
    }
};

