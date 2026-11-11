require('dotenv').config();
const { Sequelize } = require('sequelize');

const opcoes = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  }
};

// Bancos na nuvem exigem conexão segura
if (process.env.DB_SSL === 'true') {
  opcoes.dialectOptions = { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } };
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  opcoes
);

module.exports = sequelize;