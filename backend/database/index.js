const Sequelize = require('sequelize')
require('dotenv').config()

const instance = new Sequelize(
  process.env.BD,
  process.env.BD_USER,
  process.env.BD_PWD,
  {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
    dialect: 'postgres'

  });

module.exports = instance