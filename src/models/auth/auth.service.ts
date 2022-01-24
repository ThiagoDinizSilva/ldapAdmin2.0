import { Injectable } from "@nestjs/common";
import { gerarToken } from "src/common/auth";
import LdapConn from "src/common/ldap.conn";
import { Auth } from ".";


@Injectable()
export class AuthService {

    private ldap = new LdapConn();


    async autenticar(usuario: Auth) {
        const autenticado = await this.ldap.find(`(uid=${usuario.login})`, ["uid", "givenName"])
        await this.ldap.bind(autenticado[0].dn, usuario.senha)
        if (autenticado[0])
            autenticado[0].grupo = await this.ldap.find(`(memberUid=${usuario.login})`, ["cn"])
        const jwt = gerarToken(autenticado[0])
        return jwt
    }

    async listarPermissoes(id: string) {

    }
}