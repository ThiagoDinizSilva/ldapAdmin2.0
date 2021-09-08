const { Client, Change, Attribute } = require('ldapts');
const md5Base64 = require('md5-base64');
require('dotenv').config()

const url = process.env.LDAP_URL;
const bindDN = process.env.LDAP_USER;
const password = process.env.LDAP_PASSWORD;
const diretorio = process.env.LDAP_USER_BASEDN;
const diretorioGrupos = process.env.LDAP_GROUP_BASEDN;

const client = new Client({
    url,
});

//Cria um usuario LDAP com base em alguns campos necessários
//não compatível com protocolo SAMBA por falta de tempo no
//desenvolvimento

//decidi centralizar as informações na pasta routes pois fica mais 
//pratico
class UsuarioLdap {
    constructor({ uid, givenName, sn, displayName, initials, grupo, grad, userPassword }) {
        this.uid = uid
        this.givenName = givenName
        this.sn = sn
        this.displayName = displayName
        this.initials = initials
        this.grupo = grupo
        this.grad = grad
        this.userPassword = userPassword
    }
    validar() {
        const campos = [['uid', 'Identidade'], ['displayName', 'Nome De Guerra'], ['givenName', 'Primeiro Nome'], ['sn', 'Sobrenome'], ['initials', 'tipo']]
        campos.forEach(campo => {
            const valor = this[campo[0]]
            if (typeof valor !== 'string' || valor.length < 1)
                throw new Error(`O campo '${campo[1]}' precisa ser preenchido`)
        })
    }
    ajusteLdap() {
        const oficiais = ['asp', 'ten', 'cap', 'maj', 'tc', 'cel', 'gen']
        if (this.initials == 'EsAO') {
            if (this.grad == 'sd' || this.grad == 'cb') {
                this.initials = 'CbSd'
            }
            if (this.grad == 'sgt' || this.grad == 'st') {
                this.initials = 'Pracas'
            }
            if (oficiais.includes(this.grad)) {
                this.initials = 'Oficiais'
            }
        }
    }

    async buscarUsuario() {
        const filtro = `(&${this.uid ? `(uid=${this.uid})` : '(uid=*)'}${this.givenName ? `(givenName=*${this.givenName}*)` : ''}${this.sn ? `(sn=*${this.sn}*)` : ''}${this.displayName ? `(displayName=*${this.displayName}*)` : ''})`
        await client.bind(bindDN, password);
        const {
            searchEntries,
            searchReferences,
        } = await client.search(diretorio, {
            scope: 'sub',
            filter: filtro,
            attributes: ['displayName', 'uid', 'givenName', 'sn']
        });
        await client.unbind();
        return searchEntries;


    }

    async adicionarUsuario() {
        try {
            this.validar();
            this.ajusteLdap();
            const baseDN = `${this.initials ? 'ou=' + this.initials + ',' : ''}${process.env.LDAP_USUARIO_BASEDN}`
            console.log(baseDN)
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
                initials: this.initials,
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
        return ({ 'status': true, 'message': "Usuario Adicionado com Sucesso" })
    }

    async deletarUsuario() {
        try {
            const usuario = await this.buscarUsuario();
            if (usuario.length > 1) throw new Error('Não é possível deletar mais de um usuário por vez')
            const deletar = usuario[0].dn
            await client.bind(bindDN, password);
            await client.del(deletar);
        } catch (err) {
            return (({ 'status': false, 'message': err.message }))
        } finally {
            await client.unbind();
        }
        return ({ 'status': true, 'message': "Usuario deletado com Sucesso" })

    }

    async atualizarUsuario(novoAtributo, valor) {
        if (novoAtributo === 'userPassword')
            valor = `{MD5}${md5Base64(valor)}`
        let change = await new Change({
            operation: 'replace',
            modification: new Attribute({
                type: novoAtributo,
                values: [valor]
            })
        })
        try {
            await client.bind(bindDN, password);
            const {
                searchEntries,
                searchReferences,
            } = await client.search(diretorio, {
                filter: `(uid=${this.uid})`,
                attributes: ['dn']
            })
            if (searchEntries.length > 1) throw new Error('Não é possível atualizar mais de um usuário por vez')
            const userDN = searchEntries[0].dn
            await client.modify(userDN, change)
            await client.modifyDN(userDN, `uid=${this.uid}`)
        } catch (err) {
            return (({ 'status': false, 'message': err.message }))
        } finally {
            await client.unbind();
        }
        return ({ 'status': true, 'message': "Usuario atualizado com Sucesso" })

    }

    async buscarGrupos() {
        let grupos = []
        const filtro = `(&(memberUid=${this.uid}))`
        try {
            await client.bind(bindDN, password);
            const {
                searchEntries,
                searchReferences,
            } = await client.search(diretorioGrupos, {
                filter: filtro,
                attributes: ['cn']
            });
            searchEntries.forEach(element => {
                grupos.push(element)
            });

            return grupos;
        } catch (err) {
            const error = new Error(err)
            error.code = err.code
            return error
        } finally {
            await client.unbind();
        }
    }

    async adicionarGrupo() {
        const filtro = `(&(objectClass=PosixGroup)(cn=${this.grupo}))`
        try {
            await client.bind(bindDN, password);
            const {
                searchEntries,
                searchReferences,
            } = await client.search(diretorioGrupos, {
                filter: filtro,
                attributes: ['dn']
            });
            const dnDoGrupo = searchEntries[0].dn
            await client.modify(dnDoGrupo, [
                new Change({
                    operation: 'add',
                    modification: new Attribute({
                        type: 'memberUid',
                        values: [this.uid]
                    })
                })
            ])

        } catch (err) {
            throw err
        } finally {
            await client.unbind();
        }
    }

    async removerGrupo() {
        const filtro = `(&(objectClass=PosixGroup)(cn=${this.grupo}))`
        try {
            await client.bind(bindDN, password);
            const {
                searchEntries,
                searchReferences,
            } = await client.search(diretorioGrupos, {
                filter: filtro,
                attributes: ['memberUid']
            });
            const membrosDoGrupo = searchEntries[0].memberUid
            const dnDoGrupo = searchEntries[0].dn
            const grupoSemUsuario = membrosDoGrupo.filter(e => e !== this.uid)
            await client.modify(dnDoGrupo, [
                new Change({
                    operation: 'replace',
                    modification: new Attribute({
                        type: 'memberUid',
                        values: grupoSemUsuario
                    })
                })
            ])
            return grupoSemUsuario
        } catch (err) {
            throw err
        } finally {
            await client.unbind();
        }
    }
}
module.exports = UsuarioLdap