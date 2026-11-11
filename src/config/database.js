require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: false,    // as tabelas não têm createdAt/updatedAt
      underscored: true,    // senhaHash no JS = senha_hash no banco
      freezeTableName: true // não pluraliza nomes de tabela
    }
  }
);

module.exports = sequelize;