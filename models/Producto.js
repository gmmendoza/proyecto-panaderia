const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Producto = sequelize.define('Producto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoria: {
        type: DataTypes.ENUM('Insumos', 'Panadería', 'Pastelería', 'Cafetería'),
        defaultValue: 'Insumos'
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    stock: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    stockMax: {
        type: DataTypes.FLOAT,
        defaultValue: 100
    },
    unidad: {
        type: DataTypes.STRING,
        defaultValue: 'kg'
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Producto;
