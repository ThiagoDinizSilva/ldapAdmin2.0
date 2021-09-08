const TabelaUsuario = require('../database/Usuario/TabelaUsuario')

require('dotenv').config()

//usuarios com acesso ao sistema
// a autenticação dos usuarios no sistema
//é feita atravez de uma consulta
//no banco de dados

//a ideia inicial era criar um banco de dados
//com todos os usuarios/alunos e através do
//ldapts criar um 'servidor LDAP' para autenticação
// assim os sistemas poderiam consumir o protocolo
//LDAP e o cliente ainda teria a facilidade de ter
//todas as informações em um banco de dados
//mas por fim foi ultilizado o antigo serivor LDAP
// e o banco de dados ficou só para configurações do
//sistema
class UsuarioSistema {
    constructor({ login, password }) {
        this.login = login
        this.password = password
    }

    validar() {
        const campos = ['login', 'password']
        campos.forEach(campo => {
            const valor = this[campo]
            if (typeof valor !== 'string' || valor.length === 0)
                throw new Error(`O campo '${campo}' precisa ser preenchido`)
        })
    }

    async autenticar() {
        this.validar();
        let usuario = await TabelaUsuario.autenticarUsuario(this.login, this.password);
        return usuario
    }

    async criar() {
        this.validar();
        const usuario = await TabelaUsuario.criarUsuario(this.login, this.password)
        return usuario;
    }

    async alterar() {
        const usuario = await TabelaUsuario.alterarUsuario(this.login, this.password)
        return usuario;
    }

    async deletar() {
        const usuarioDeletar = this.login
        if (usuarioDeletar.length === 0)
            throw new Error('Algo não ocorreu como deveria')
        await TabelaUsuario.deletarUsuario(this.login)
        return
    }
}
module.exports = UsuarioSistema