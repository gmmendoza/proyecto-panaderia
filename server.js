const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Rutas
const clienteRoutes = require('./routes/clienteRoutes');
const turnoRoutes = require('./routes/turnoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Main Endpoints
app.use('/api/clientes', clienteRoutes);
app.use('/api/turnos', turnoRoutes);

// Simple Health Check Root
app.get('/', (req, res) => {
    res.json({ message: "API Panadería en funcionamiento. Usa /api/clientes o /api/turnos" });
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
