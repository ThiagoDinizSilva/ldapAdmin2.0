const { Client, Change, Attribute } = require("ldapts");

class Ldap {

    constructor(url, login, senha, base, dirPessoas, dirGrupos) {
        this.url = url || 'ldap://127.0.0.1:389';
        this.login = login || 'cn=admin,dc=example,dc=com';
        this.senha = senha || 'admin';
        this.base = base || 'dc=example,dc=com';
        this.dirPessoas = dirPessoas && base ? `${dirPessoas},${base}` : `ou=people,dc=example,dc=com`;
        this.dirGrupos = dirGrupos || 'ou=groups,dc=example,dc=com';
        this.client = new Client({
            url: this.url,
        });
    }
    async executar(f) {
        const { client } = this
        await client.bind(this.login, this.senha);
        await f();
        await client.unbind();
        return true
    }

    async adicionarGrupo(grupo) {
        grupo.gidNumber = (Math.floor(Math.random() * 65534) + 1000).toString()
        await this.executar(() => this.client.add(`cn=${grupo.cn},${this.dirGrupos}`, {
            objectClass: grupo.objectClass,
            cn: grupo.cn,
            gidNumber: grupo.gidNumber
        }));
    }

    async adicionarUsuario(usuario) {
        const entry = {
            objectClass: ["posixAccount", "top", "inetOrgPerson"],
            givenName: usuario.givenName,
            sn: usuario.sn,
            displayName: usuario.displayName,
            userPassword: `{MD5}${CryptoJS.enc.Base64.stringify(usuario.uid)}`,
            uid: usuario.uid,
            cn: usuario.uid,
            homeDirectory: "/home/null",
            loginShell: "/bin/false",
            uidNumber: (Math.floor(Math.random() * 65534) + 1000).toString()
        };
        await this.executar(() => this.client.add(`uid=${usuario.uid},${this.dirPessoas}`, entry));

        const filtro = `(uid=${this.uid})`;

        return this.buscar(filtro)
    }

    async buscarGruposContendoUsuario(uid) {
        const grupos = [];
        const filtro = `(memberUid=${uid})`
        const listaDeGrupos = await this.buscar(filtro)
        if (!listaDeGrupos) {
            return listaDeGrupos;
        }
        listaDeGrupos.forEach(e => {
            grupos.push(e.cn)
        });
        return ({ status: true, data: grupos });
    }

    async deletar(nome, atributo) {
        const { client } = this
        const filtro = `(&(cn=${nome})(objectClass=${atributo}))`
        const atributos = ["cn"]
        const grupo = await this.buscar(filtro, atributos);
        if (!grupo[0].dn)
            throw new TypeError("dn Inexistente");
        const { dn } = grupo[0];
        if (dn.includes(nome)) {
            return await this.executar(() => client.del(`cn=${nome},${this.dirGrupos}`))
        }
        throw new TypeError("dn Inexistente");
    }

    async buscar(filtro, atributos) {
        const { client } = this
        await client.bind(this.login, this.senha);
        const {
            searchEntries
        } = await client.search(this.base, {
            scope: "sub",
            filter: filtro,
            attributes: atributos
        });
        await client.unbind();
        if (!searchEntries[0])
            return false;
        return (searchEntries);
    }

    async atualizarNome(registro, novoNome) {
        const { client } = this
        if (!registro.uid.length > 0) {
            return await this.executar(() => client.modifyDN(registro.dn, `cn=${novoNome}`))
        } else {
            //return await this.executar(() => client.modifyDN(registro.dn, `uid=${novoNome}`))
        }

    }

    async atualizarMembrosGrupo(grupo, membro) {
        const { client } = this

        if (grupo.memberUid.includes(membro)) {
            grupo.memberUid = grupo.memberUid.filter(e => e !== membro)
            return await this.executar(() =>
                client.modify(grupo.dn, [
                    new Change({
                        operation: 'replace',
                        modification: new Attribute({
                            type: 'memberUid',
                            values: grupo.memberUid
                        })
                    }),
                ])
            );
        } else {
            return await this.executar(() =>
                client.modify(grupo.dn, [
                    new Change({
                        operation: 'add',
                        modification: new Attribute({
                            type: 'memberUid',
                            values: [`${membro}`]
                        })
                    }),
                ])
            );
        }
    }




} module.exports = Ldap;