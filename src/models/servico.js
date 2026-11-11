const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Servico = sequelize.define('Servico', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING(100), allowNull: false },
  descricao: { type: DataTypes.TEXT },
  duracaoMinutos: { type: DataTypes.INTEGER, allowNull: false },
  preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'servico' });

module.exports = Servico;