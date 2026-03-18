const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Pedido = sequelize.define('Pedido', {
    clienteNombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fechaEntrega: {
        type: DataTypes.DATE,
        allowNull: false
    },
    total: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    senia: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    saldo: {
        type: DataTypes.FLOAT, // A ser calculado: total - senia
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Recibido', 'En Proceso', 'Listo para Retiro', 'Entregado'),
        defaultValue: 'Recibido'
    }
}, {
    timestamps: true
});

module.exports = Pedido;
