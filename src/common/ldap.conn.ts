import { Attribute, Change, Client } from "ldapts";
import { Grupo } from "src/models/grupo/grupo.entity";
import { Usuario, UsuarioAtualizado } from "src/models/usuario";

export default class LdapConn {

    public client;
    private url = process.env.url;
    private bindDN = process.env.bindDN;
    private bindCredentials = process.env.bindCredentials;
    private searchBase = process.env.searchBase;
    private userSearchFilter = process.env.userSearchFilter;
    private userSearchBase = process.env.userSearchBase;
    private groupSearchBase = process.env.groupSearchBase;
    private groupSearchFilter = process.env.groupSearchFilter;

    constructor() {
        this.client = new Client({
            url: this.url,
            timeout: 0,
            connectTimeout: 0,
            strictDN: true,
        });
    }

    /** 
    * Recebe uma funcão do client do pacote ldapts e cuida de
    * realizar as operações de bind e unbind
    * 
    * @param {async function} [f]
    * @example
    * await this.run(() => this.client.modify(registroLdap[0].dn, change));
    * @returns {promise} retorna o resultado da funçao passada por parâmetro 
    **/
    async run(operation) {
        const { client } = this
        await client.bind(this.bindDN, this.bindCredentials);
        const result = await operation();
        await client.unbind();
        return result
    }

    async bind(login, senha) {
        const { client } = this
        await client.bind(login, senha);
        await client.unbind();
        return
    }
    /** 
    * Recebe dois parâmetros e realiza uma busca, caso um dos parâmetros não
    * seja recebido, um valor padrão é ultilizado
    * @param {string} [filtro] @default '(&(uid=*)(cn=*))'
    * @param {Array<String>} [atributos] @default null 
    * @example
    * ldap.find('(uid=123*)', ["initials", "sn", "displayName", "uid", "cn"]);
    * @returns {Array<Object>} retorna uma lista de usuários cuja uid começa com 123 
    **/
    async find(filtro: string = '(&(uid=*)(cn=*))', atributos: Array<string> = null): Promise<Array<any>> {
        const { client } = this
        await client.bind(this.bindDN, this.bindCredentials);

        const {
            searchEntries
        } = await client.search(this.searchBase, {
            scope: "sub",
            filter: filtro || this.userSearchFilter,
            attributes: atributos
        });
        await client.unbind();
        return searchEntries;

    }

    /** 
    * Recebe um Objeto do tipo Usuario ou Grupo, cria uma ldap entry 
    * e insere o registro no LDAP
    * @param {Usuario | Grupo} [registro] corresponde aos filtros aplicados na busca, exemplos no npm ldapts
    * @example
    * ldap.add(usuario)
    * @returns {Usuario} um usuario com as informações cadastradas 
    **/
    async add(registro: Usuario | Grupo) {
        if (registro instanceof Usuario) {
            const entry = {
                objectClass: ["posixAccount", "top", "inetOrgPerson"],
                givenName: registro.nome,
                sn: registro.sobrenome,
                displayName: registro.nome,
                userPassword: registro.getSenha(),
                uid: registro.identidade,
                cn: registro.identidade,
                mail: registro.email,
                homeDirectory: "/home/null",
                loginShell: "/bin/false",
                uidNumber: (Math.floor(Math.random() * 65534) + 1000).toString(),
                gidNumber: (Math.floor(Math.random() * 65534) + 1000).toString()
            };
            const dn = `uid=${registro.identidade},${this.userSearchBase}`
            await this.run(() => this.client.add(dn, entry));

        } else if (registro instanceof Grupo) {
            const entry = {
                objectClass: ["posixGroup", "top"],
                cn: registro.nome,
                gidNumber: (Math.floor(Math.random() * 65534) + 1000).toString(),
            };
            const dn = `cn=${registro.nome},${this.groupSearchBase}`
            await this.run(() => this.client.add(dn, entry));
        }
    }

    /** 
    * Recebe um Objeto do tipo UsuarioAtualizado ou Grupo, atualiza um ldap entry 
    * caso receba um usuário não existente, estoura um erro. 
    * @param {UsuarioAtualizado | Grupo} [registro] corresponde aos filtros aplicados na busca, exemplos no npm ldapts
    * @example
    * const usuarioExiste = await this.ldap.find(`(uid=${id})`)
    * if (!usuarioExiste[0])
    *   throw new HttpException('Não é possível atualizar um usuário que não foi cadastrado', HttpStatus.BAD_REQUEST)
    * await this.ldap.update(usuario);
    * @returns {void}
    **/
    async update(registro: UsuarioAtualizado | Grupo) {
        if (registro instanceof UsuarioAtualizado) {
            const registroLdap = await this.find(`(uid=${registro.identidade})`, ["dn"])
            const camposParaAtualizar = {
                mail: registro.email,
                userPassword: registro.getSenha(),
                name: registro.nome,
                sn: registro.sobrenome
            };
            for (const key in camposParaAtualizar) {
                const element = camposParaAtualizar[key];
                if (element) {
                    const change = await new Change({
                        operation: 'replace',
                        modification: new Attribute({
                            type: key,
                            values: [element]
                        }),
                    });
                    await this.run(() => this.client.modify(registroLdap[0].dn, change));
                }
            };
        } else if (registro instanceof Grupo) {
            const registroLdap = await this.find(`(&(cn=${registro.nome})(objectClass=posixGroup))`, ["dn", "memberUid"])
            let usuariosNoGrupo: Array<string> = registroLdap[0].memberUid
            if (typeof usuariosNoGrupo == 'string')
                usuariosNoGrupo = [usuariosNoGrupo]
            const usuariosParaAtualizar: Array<string> = registro.usuarios
            usuariosParaAtualizar?.forEach(usuario => {
                if (usuariosNoGrupo.includes(usuario)) {
                    usuariosNoGrupo = usuariosNoGrupo.filter(x => (x != usuario))
                } else {
                    usuariosNoGrupo.push(usuario)
                }
            })

            const change = new Change({
                operation: 'replace',
                modification: new Attribute({
                    type: 'memberUid',
                    values: usuariosNoGrupo
                })
            });

            await this.run(() => this.client.modify(registroLdap[0].dn, change));
        }
    }

    async updateDN(registro: UsuarioAtualizado | Grupo, novoNome: string) {
        if (registro instanceof UsuarioAtualizado) {

            const registroLdap = await this.find(`(uid=${registro.identidade})`, ["dn"])
            return await this.run(() => this.client.modifyDN(registroLdap[0].dn, `uid=${novoNome}`));

        } else if (registro instanceof Grupo) {
            const registroLdap = await this.find(`(cn=${registro.nome})`)
            console.log(registroLdap,'  registro:',registro)
            return await this.run(() => this.client.modifyDN(registroLdap[0].dn, `cn=${registro.novoNome}`));

        }

    }

    async delete(usuario): Promise<void> {
        const { client } = this
        await this.run(() => client.del(usuario[0].dn))

    }


}