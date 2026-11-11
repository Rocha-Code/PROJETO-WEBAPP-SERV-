const sequelize = require('../config/database');
const Usuario = require('./usuario');
const Profissional = require('./profissional');
const Categoria = require('./categoria');
const Servico = require('./servico');
const Agendamento = require('./agendamento');

// Usuario 1:1 Profissional
Usuario.hasOne(Profissional, { foreignKey: { name: 'usuarioId', allowNull: false } });
Profissional.belongsTo(Usuario, { foreignKey: { name: 'usuarioId', allowNull: false } });

// Profissional 1:N Servico
Profissional.hasMany(Servico, { foreignKey: { name: 'profissionalId', allowNull: false } });
Servico.belongsTo(Profissional, { foreignKey: { name: 'profissionalId', allowNull: false } });

// Categoria 1:N Servico
Categoria.hasMany(Servico, { foreignKey: { name: 'categoriaId', allowNull: false } });
Servico.belongsTo(Categoria, { foreignKey: { name: 'categoriaId', allowNull: false } });

// Usuario (cliente) 1:N Agendamento
Usuario.hasMany(Agendamento, { foreignKey: { name: 'clienteId', allowNull: false } });
Agendamento.belongsTo(Usuario, { as: 'cliente', foreignKey: { name: 'clienteId', allowNull: false } });

// Servico 1:N Agendamento
Servico.hasMany(Agendamento, { foreignKey: { name: 'servicoId', allowNull: false } });
Agendamento.belongsTo(Servico, { foreignKey: { name: 'servicoId', allowNull: false } });

// Profissional 1:N Agendamento
Profissional.hasMany(Agendamento, { foreignKey: { name: 'profissionalId', allowNull: false } });
Agendamento.belongsTo(Profissional, { foreignKey: { name: 'profissionalId', allowNull: false } });

module.exports = { sequelize, Usuario, Profissional, Categoria, Servico, Agendamento };