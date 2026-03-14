const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Turno = sequelize.define('Turno', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fecha: {
        type: DataTypes.DATEONLY, // YYYY-MM-DD
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME, // HH:MM:SS
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('reservado', 'cancelado', 'completado'),
        allowNull: false,
        defaultValue: 'reservado'
    }
}, {
    tableName: 'turnos',
    timestamps: true
});

module.exports = Turno;
