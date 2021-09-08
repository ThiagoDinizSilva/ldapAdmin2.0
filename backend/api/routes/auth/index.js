const Usuario = require('../../../helpers/UsuarioSistema')
const express = require('express')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')

const TabelaUsuario = require('../../../database/Usuario/TabelaUsuario')
const routes = express()

//Intercepta a requisição e retorna 403 se o usuario
//Não estiver loado
function isValidRequest(req, res, next) {
    const bearerHeader = req.headers['authorization']
    try {
        if (!bearerHeader) throw new Error("unauthorized")

        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        jwt.verify(bearerToken, process.env.SECRET)
        req.token = jwt_decode(bearerToken)
        next();
    } catch (e) {
        res.status(403).send();
    }
}

//Todas essas rotas são para alterações no
//banco de dados; isValidRequest verifica se o
//usuario está logado e retorna 403 caso não esteja
//pode ser usado em qualquer rota para previnir acesso
//não autorizado

//o banco de dados só será ultilizado para este sistema
//o objetivo dessa API é possibilitar a criação de um
//front-end mais "amigável" para gerenciar um lDAP
//(não pergunte o porquê)

routes.get('/', isValidRequest, async (req, res, next) => {
    try {
        isAdmin(req);
        const listarUsuarios = await TabelaUsuario.listarUsuarios()
        res.status(200).send(listarUsuarios);

    } catch (e) {
        res.status(500).send(
            JSON.stringify({
                mensagem: e.message
            })
        );
    }
})

routes.post('/login', async (req, res, next) => {
    try {
        const dadosRecebidos = req.body
        const usuario = new Usuario(dadosRecebidos)
        const autenticado = await usuario.autenticar()
        if (!autenticado.error) {
            const token = jwt.sign(autenticado, process.env.SECRET, {
                expiresIn: '600' // expires in 10min
            })
            return res.status(200).send({ status: true, token })

        }
        return res.status(200).send(autenticado)

    } catch (e) {
        res.status(403).send(
            JSON.stringify({
                message: e.message
            })
        );
    }
})

routes.post('/adicionarUsuario', async (req, res, next) => {
    try {
        const dadosRecebidos = req.body
        const usuario = new Usuario(dadosRecebidos)
        const autenticado = await usuario.criar()
        res.status(200).send({
            autenticado
        });

    } catch (e) {
        res.status(400).send(
            JSON.stringify({
                mensagem: e.message
            })
        );
    }
})

routes.post('/deletarUsuario', isValidRequest, async (req, res, next) => {
    try {
        const dadosRecebidos = req.body
        const usuario = new Usuario(dadosRecebidos)
        await usuario.deletar()
        res.status(200).send();
    } catch (e) {
        res.status(500).send(
            JSON.stringify({
                mensagem: e.message
            })
        );
    }
})

routes.post('/atualizarUsuario', isValidRequest, async (req, res, next) => {
    try {
        const dadosRecebidos = req.body
        const usuario = new Usuario(dadosRecebidos)
        const autenticado = await usuario.alterar()
        res.status(200).send({
            autenticado
        });

    } catch (e) {
        res.status(304).send(
            JSON.stringify({
                mensagem: e.message
            })
        );
    }
});

module.exports = { routes, isValidRequest }