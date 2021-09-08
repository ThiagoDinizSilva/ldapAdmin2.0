const express = require('express');
const routes = express();
const AlunoLdap = require('../../../helpers/AlunoLdap')
const UsuarioLdap = require('../../../helpers/UsuariosLdap')

//lista um ou mais usuarios
routes.get('/', async (req, res, next) => {
    const dadosRecebidos = req.query
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const salto = (pagina - 1) * limite;
    const ultimoRegistro = (limite * pagina)

    try {
        const usuario = new UsuarioLdap(dadosRecebidos)
        const listaDeUsuarios = await usuario.buscarUsuario()
        const listaPaginada = listaDeUsuarios.slice(salto, ultimoRegistro)
        res.status(200).send(listaPaginada)

    } catch (e) {
        res.status(500).send(e)

    }
});
//adiciona um usuario comum ou aluno
// para adicionar um aluno é preciso ter aluno:true no body da requisição
// para adicionar um usuario comum é preciso ter aluno:false
// os campos necessários para adicionar qualquer um dos dois:
//uid, givenName, sn, displayName, initials
//sem um desses campos, a rota vai retornar um erro
// agradecimentos aos desenvolvedores do ldapts pelo
//trabalho excepcional, me pouparam muito tempo

routes.post('/adicionar', async (req, res, next) => {
    const aluno = req.body.aluno
    if (!aluno) {
        return next()
    }
    try {
        const dadosRecebidos = req.query
        const aluno = new AlunoLdap(dadosRecebidos)
        const alunoAdicionado = await aluno.adicionarAluno()
        const { message } = alunoAdicionado
        if (message.includes('0x44'))
            usuarioAdicionado.message = 'Erro, Identidade ja existe no Ldap'
        if (message.includes('0x20'))
            usuarioAdicionado.message = 'Algo não ocorreu como deveria, entre em contato com o Administrador'

        res.status(200).send(alunoAdicionado)
    } catch (e) {
        res.status(400).send(
            JSON.stringify({
                message: e.message
            })
        )
    }
});
routes.post('/adicionar', async (req, res, next) => {
    try {
        const dadosRecebidos = req.query
        const usuario = new UsuarioLdap(dadosRecebidos)
        const usuarioAdicionado = await usuario.adicionarUsuario()
        const { message } = usuarioAdicionado
        if (message.includes('0x44'))
            usuarioAdicionado.message = 'Erro, Identidade ja existe no Ldap'
        if (message.includes('0x20'))
            usuarioAdicionado.message = 'Algo não ocorreu como deveria, entre em contato com o Administrador'

        res.status(200).send(usuarioAdicionado)
    } catch (e) {
        res.status(400).send(
            JSON.stringify({
                message: e.message
            })
        )
    }
});

//busca e deleta um usuario usando a id como parametro
//se mais de um usuario retornar na busca, nada é deletado
// e uma mensagem de erro é retornada
routes.post('/deletarUsuario', async (req, res, next) => {
    try {
        const dadosRecebidos = req.query
        const usuario = new UsuarioLdap(dadosRecebidos)
        const usuarioDeletado = await usuario.deletarUsuario()
        res.status(200).send(usuarioDeletado)

    } catch (e) {
        res.status(400).send(
            JSON.stringify({
                message: e.message
            })
        )
    }
});

//atualiza as informações do usuarios
//for in lê cada atributo e atualizarUsuario cuida do resto
//por conta dessa rota os atributos da classe UsuarioLdap
//devem ser iguais aos do LDAP mesmo
//se não for assim, dificultaria o trabalho de atualizar os campos
routes.post('/atualizarUsuario', async (req, res, next) => {
    try {
        const dadosRecebidos = req.query
        const usuario = new UsuarioLdap(dadosRecebidos)
        let usuarioAtualizado;
        for (atributo in usuario) {
            if (usuario[atributo])
                usuarioAtualizado = await usuario.atualizarUsuario(atributo, usuario[atributo])

        }
        res.status(200).send(usuarioAtualizado)
    } catch (e) {
        res.status(400).send(
            JSON.stringify({
                message: e.message
            })
        )
    }
});



//diferente da rota de grupos, essa rota traz todos os
//grupos aos quais o uid informado faz parte
routes.post('/grupos', async (req, res, next) => {
    try {
        const dadosRecebidos = req.body
        const usuario = new UsuarioLdap(dadosRecebidos)
        const grupos = await usuario.buscarGrupos()
        res.status(200).send(grupos)
    } catch (e) {
        res.status(400).send(
            JSON.stringify({
                message: e.message
            })
        )
    }

});

//remove o usuario do grupo, só é preciso informar
// o cn do grupo e o uid que quer remover do mesmo;
// o cn do grupo é obtido através da rota acima;
// removerGrupo() cuida obter todos os memberUid daquele
//grupo, remove a memberUid do usuario da lista obtida e
// sobrescreve todos os memberUid daquele grupo com a nova
// lista sem o usuario atual
//parece complicado a primeira vista, mas é só uma questão de
//obter um array, filtrar o item que você não quer
//e inserir o array de volta no LDAP
routes.post('/grupos/remover', async (req, res, next) => {
    try {
        const dadosRecebidos = req.body
        const usuario = new UsuarioLdap(dadosRecebidos)
        grupoRemovido = await usuario.removerGrupo()
        res.status(200).send(grupoRemovido)
    } catch (e) {
        res.status(400).send(
            JSON.stringify({
                message: e.message
            })
        )
    }
});

//adiciona um usuario no grupo
//é mais facil inserir pois o LDAP só insere um valor a mais
//na lista de memberUid
routes.post('/grupos/adicionar', async (req, res, next) => {
    try {
        const dadosRecebidos = req.body
        const usuario = new UsuarioLdap(dadosRecebidos)
        grupoAdicionado = await usuario.adicionarGrupo()
        res.status(200).send(grupoAdicionado)
    } catch (e) {
        res.status(400).send(
            JSON.stringify({
                message: e.message
            })
        )
    }
});

module.exports = routes;