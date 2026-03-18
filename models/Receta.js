const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Receta = sequelize.define('Receta', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING,
    defaultValue: 'Panes'
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  tiempo: {
    type: DataTypes.STRING
  },
  dificultad: {
    type: DataTypes.STRING,
    defaultValue: 'Media'
  },
  ingredientes: {
    type: DataTypes.JSON, // Guardamos el array de ingredientes [{nombre, base, unidad}]
    allowNull: false
  },
  pasos: {
    type: DataTypes.JSON, // Guardamos el array de pasos ["paso 1", "paso 2"]
    allowNull: true
  },
  img: {
    type: DataTypes.STRING,
    defaultValue: 'gallery1.png'
  },
  favorito: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Receta;
