const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Agendamento = sequelize.define('Agendamento', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  data: { type: DataTypes.DATEONLY, allowNull: false },
  horaInicio: { type: DataTypes.TIME, allowNull: false },
  status: {
    type: DataTypes.ENUM('pendente', 'confirmado', 'cancelado', 'concluido'),
    allowNull: false,
    defaultValue: 'pendente'
  },
  observacao: { type: DataTypes.STRING(255) }
}, { tableName: 'agendamento' });

module.exports = Agendamento;