const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Categoria = sequelize.define('Categoria', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING(60), allowNull: false, unique: true }
}, { tableName: 'categoria' });

module.exports = Categoria;