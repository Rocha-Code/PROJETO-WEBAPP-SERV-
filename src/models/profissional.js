const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profissional = sequelize.define('Profissional', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  bio: { type: DataTypes.TEXT },
  bairro: { type: DataTypes.STRING(80) }
}, { tableName: 'profissional' });

module.exports = Profissional;