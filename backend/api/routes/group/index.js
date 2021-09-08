const express = require('express');
const routes = express();
const GrupoLdap = require('../../../helpers/GrupoLdap')

routes.get('/', async (req, res, next) => {
    try {
        req.body.cn = '*'
        const dadosRecebidos = req.body
        const grupo = new GrupoLdap(dadosRecebidos)
        const buscarGrupos = await grupo.buscarGrupos()
        res.status(200).send(buscarGrupos)
    } catch (e) {
        res.status(400).send(
            JSON.stringify({
                message: e.message
            })
        )
    }
});

//adiciona um grupo
//na requisição o body deve conter cn:NomeDoGrupo
routes.post('/adicionar', async (req, res, next) => {
    try {
        const dadosRecebidos = req.body
        const grupo = new GrupoLdap(dadosRecebidos)
        const grupoAdicionado = await grupo.adicionarGrupo()
        res.status(200).send(grupoAdicionado)
    } catch (e) {
        res.status(400).send(
            JSON.stringify({
                message: e.message
            })
        )
    }
});

//o mesmo vale para remover grupos
routes.post('/remover', async (req, res, next) => {
    try {
        const dadosRecebidos = req.body
        const grupo = new GrupoLdap(dadosRecebidos)
        const grupoDeletado = await grupo.removerGrupo()
        res.status(200).send(grupoDeletado)
    } catch (e) {
        res.status(400).send(
            JSON.stringify({
                message: e.message
            })
        )
    }
});

module.exports = routes;