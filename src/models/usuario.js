const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  telefone: { type: DataTypes.STRING(20) },
  senhaHash: { type: DataTypes.STRING(255), allowNull: false },
  tipo: { type: DataTypes.ENUM('cliente', 'profissional'), allowNull: false }
}, { tableName: 'usuario' });

module.exports = Usuario;