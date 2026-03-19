const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Pedido = sequelize.define('Pedido', {
    cliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    items: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fechaEntrega: {
        type: DataTypes.STRING, // Almacenamos como string 'YYYY-MM-DD' para simplicidad con input date
        allowNull: false
    },
    horaEntrega: {
        type: DataTypes.STRING,
        defaultValue: '09:00'
    },
    total: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    sena: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    estado: {
        type: DataTypes.ENUM('Pendiente', 'Procesando', 'Listo para Retiro', 'Entregado', 'Cancelado'),
        defaultValue: 'Pendiente'
    },
    prioridad: {
        type: DataTypes.ENUM('Baja', 'Media', 'Alta'),
        defaultValue: 'Media'
    }
}, {
    timestamps: true
});

module.exports = Pedido;
