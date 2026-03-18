const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Venta = sequelize.define('Venta', {
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    metodoPago: {
        type: DataTypes.ENUM('Efectivo', 'Tarjeta', 'Transferencia'),
        defaultValue: 'Efectivo'
    },
    items: {
        type: DataTypes.JSON, // Para guardar los productos vendidos en esa transaccin
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Venta;
