const Sequelize = require('Sequelize')
const instance = require('..')
require('dotenv').config()

const colunas = {
    login: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}

const opcoes = {
    freezeTableName: true,
    timestamps: true,
    schema: process.env.BD,
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}

module.exports = instance.define('tb_usuario', colunas, opcoes)

