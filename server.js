const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Routes
const clienteRoutes = require('./routes/clienteRoutes');
const turnoRoutes = require('./routes/turnoRoutes');
const productoRoutes = require('./routes/productoRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const recetaRoutes = require('./routes/recetaRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Endpoints
app.use('/api/clientes', clienteRoutes);
app.use('/api/turnos', turnoRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/recetas', recetaRoutes);

// Simple Health Check Root
app.get('/', (req, res) => {
    res.json({ message: "API Panaderia en funcionamiento. Endpoints: /api/clientes, /api/turnos, /api/productos, /api/ventas, /api/pedidos" });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        mensaje: "Ocurrió un error interno en el servidor",
        error: err.message
    });
});

// Sincronizar Base de Datos e Iniciar Servidor
sequelize.sync({ alter: true })
    .then(() => {
        console.log("Base de datos sincronizada.");
        app.listen(PORT, () => {
            console.log(`Servidor de Panadería corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error al sincronizar la base de datos:", err);
    });
