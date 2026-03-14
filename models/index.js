const sequelize = require('../database');
const Cliente = require('./Cliente');
const Turno = require('./Turno');

// Define Relationships (One-to-Many)
Cliente.hasMany(Turno, { foreignKey: 'clienteId', as: 'turnos' });
Turno.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

module.exports = {
    sequelize,
    Cliente,
    Turno
};
