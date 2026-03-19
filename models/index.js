const sequelize = require('../database');
const Cliente = require('./Cliente');
const Turno = require('./Turno');
const Producto = require('./Producto');
const Venta = require('./Venta');
const Pedido = require('./Pedido');
const Receta = require('./Receta');

// Define Relationships
Cliente.hasMany(Turno, { foreignKey: 'clienteId', as: 'turnos' });
Turno.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

module.exports = {
    sequelize,
    Cliente,
    Turno,
    Producto,
    Venta,
    Pedido,
    Receta
};
