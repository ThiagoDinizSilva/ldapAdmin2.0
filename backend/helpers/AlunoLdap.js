const { Client } = require('ldapts');
const md5Base64 = require('md5-base64');
require('dotenv').config()

const url = process.env.LDAP_URL;
const bindDN = process.env.LDAP_USER;
const password = process.env.LDAP_PASSWORD;
const client = new Client({
    url,
});

class UsuarioLdap {
    constructor({ uid, givenName, sn, displayName, initials, ano, tipo, curso }) {
        this.uid = uid
        this.givenName = givenName
        this.sn = sn
        this.displayName = displayName
        this.initials = initials
        this.ano = ano
        this.curso = curso
    }
    validar() {
        const campos = ['uid', 'givenName', 'sn', 'displayName', 'initials', 'ano', 'tipo', 'curso']
        campos.forEach(campo => {
            const valor = this[campo]
            if (typeof valor !== 'string' || valor.length === 0)
                throw new Error(`O campo '${campo}' precisa ser preenchido`)
        })
    }

    //Adiciona um aluno usando como base os atributos da classe UsuarioLdap
    async  adicionarAluno() {
        try {
            this.validar()
            const baseDN = `${this.curso ? 'ou=' + this.curso + ',' : ''}${this.initials ? 'ou=' + this.initials + ',' : ''}${this.ano ? 'ou=' + this.ano + ',' : ''}${process.env.LDAP_ALUNO_BASEDN}`
            const userDN = `uid=${this.uid},${baseDN}`
            const uidNumber = (Math.floor(Math.random() * 65534) + 1000).toString()
            const gidNumber = (Math.floor(Math.random() * 65534) + 1000).toString()
            const entry = {
                objectClass: ['posixAccount', 'top', 'inetOrgPerson'],
                givenName: this.givenName,
                cn: this.uid,
                displayName: this.displayName,
                sn: this.sn,
                homeDirectory: '/home/null',
                initials: 'al',
                loginShell: '/bin/false',
                uidNumber: uidNumber,
                gidNumber: gidNumber,
                userPassword: `{MD5}${md5Base64(this.uid)}`
            }
            await client.bind(bindDN, password);
            await client.add(userDN, entry);
        } catch (err) {
            return (({ 'status': false, 'message': err.message }))
        } finally {
            await client.unbind();
        }
        return ({ 'status': true, 'message': "Aluno Adicionado com Sucesso" })
    }
}
module.exports = UsuarioLdap