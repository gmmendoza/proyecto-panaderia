// detect if we should use mock data (e.g. running from file:// or on a static host like GitHub Pages)
const isMock = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? false : true;

const initialClientes = [
    { id: 1, nombre: 'Guadalupe', apellido: 'Mendoza', telefono: '3764-123456', saldo: 0 },
    { id: 2, nombre: 'Ana', apellido: 'García', telefono: '3764-987654', saldo: 1500 },
    { id: 3, nombre: 'Juan', apellido: 'Pérez', telefono: '3764-000001', saldo: -500 }
];

const initialTurnos = [
    { id: 1, clienteId: 1, fecha: '2024-03-20', hora: '10:00', descripcion: 'Torta de cumpleaños', estado: 'Pendiente' },
    { id: 2, clienteId: 2, fecha: '2024-03-21', hora: '16:00', descripcion: 'Docena de facturas', estado: 'Completado' }
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
                const newItem = { ...data, id: Date.now() };
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
        updateEstado: async (id, estado) => {
            if (isMock) {
                const list = getStorage('bakery_turnos', initialTurnos);
                const item = list.find(t => t.id === id);
                if (item) item.estado = estado;
                localStorage.setItem('bakery_turnos', JSON.stringify(list));
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
    }
};
