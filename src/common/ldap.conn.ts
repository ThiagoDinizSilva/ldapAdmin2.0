import { Client } from "ldapts";
import { type } from "os";
import { Grupo } from "src/models/grupo/grupo.entity";
import { Usuario } from "src/models/usuario/usuario.entity";
import { gerarHashDaSenha } from "./auth";

export default class LdapConn {

    public client;
    private url = 'ldap://127.0.0.1:389';
    private bindDN = 'cn=admin,dc=example,dc=com';
    private bindCredentials = 'admin';
    private searchBase = 'dc=example,dc=com';
    private userSearchFilter = `(&(uid=*)(objectClass=posixAccount))`;
    private userSearchBase = 'ou=people,dc=example,dc=com';
    private groupSearchBase = 'ou=groups,dc=example,dc=com';
    private groupSearchFilter = '(objectClass=posixGroup)';

    constructor() {
        this.client = new Client({
            url: this.url,
            timeout: 0,
            connectTimeout: 0,
            strictDN: true,
        });
    }

    async run(operation) {
        const { client } = this
        await client.bind(this.bindDN, this.bindCredentials);
        const result = await operation();
        await client.unbind();
        return result
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
    async find(filtro: string = '(&(uid=*)(cn=*))', atributos: Array<string> = null): Promise<Usuario[]> {
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
                userPassword: await gerarHashDaSenha(registro.senha),
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

        }

        /*   const pass = CryptoJS.enc.Utf8.parse(usuario.uid);
        const entry = {
            objectClass: ["posixAccount", "top", "inetOrgPerson"],
            givenName: usuario.givenName,
            sn: usuario.sn,
            displayName: usuario.displayName,
            userPassword: `{MD5}${CryptoJS.enc.Base64.stringify(pass)}`,
            uid: usuario.uid,
            cn: usuario.uid,
            homeDirectory: "/home/null",
            loginShell: "/bin/false",
            uidNumber: (Math.floor(Math.random() * 65534) + 1000).toString(),
            gidNumber: (Math.floor(Math.random() * 65534) + 1000).toString()

        };
        const dn = this.gerarCn(usuario);
        await this.executar(() => this.client.add(dn, entry));

        const filtro = `(uid=${this.uid})`;
        return this.buscar(filtro) */
    }

    async update() {

    }

    async delete(usuario: Usuario[]): Promise<void> {
        const { client } = this

        await this.run(() => client.del(usuario[0].dn))

    }


}