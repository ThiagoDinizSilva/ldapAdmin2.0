const { Client, Change, Attribute } = require('ldapts');
require('dotenv').config()

const url = process.env.LDAP_URL;
const bindDN = process.env.LDAP_USER;
const password = process.env.LDAP_PASSWORD;
const diretorioGrupos = process.env.LDAP_GROUP_BASEDN;

const client = new Client({
    url,
});

class GrupoLdap {
    constructor({ cn }) {
        this.cn = cn
    }

    //busca um grupo ou todos
    //para buscar todos basta adicionar cn:* 
    // no body da requisição
    async buscarGrupos() {
        const filtro = `(&(cn=${this.cn}))`
        try {
            await client.bind(bindDN, password);
            const {
                searchEntries,
                searchReferences,
            } = await client.search(diretorioGrupos, {
                filter: filtro,
                attributes: ['cn']
            });
            return searchEntries;
        } catch (err) {
            const error = new Error(err)
            error.code = err.code
            return error
        } finally {
            await client.unbind();
        }
    }

    //adiciona um grupo 
    async adicionarGrupo() {
        const grupoDN = `cn=${this.cn},${diretorioGrupos}`
        const gidNumber = (Math.floor(Math.random() * 65534) + 1000).toString()
        const entry = {
            objectClass: ['posixGroup', 'top'],
            cn: this.cn,
            gidNumber: gidNumber
        }
        try {
            await client.bind(bindDN, password);
            await client.add(grupoDN, entry);
        } catch (err) {
            throw err
        } finally {
            await client.unbind();
        }
        return ("Grupo Adicionado com Sucesso!")
    }

    //busca o DN do grupo e deleta-o 
    async removerGrupo() {
        const grupo = await this.buscarGrupos();
        if (grupo.length > 1) throw new Error('Não é possível deletar mais de um usuário por vez')
        const remover = grupo[0].dn
        await client.bind(bindDN, password);
        await client.del(remover);
        await client.unbind();
        return ("Grupo Removido com Sucesso!")
    }
}
module.exports = GrupoLdap