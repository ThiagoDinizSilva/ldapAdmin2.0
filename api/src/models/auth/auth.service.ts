import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { gerarToken } from "src/common/auth";
import LdapConn from "src/common/ldap.conn";
import { Auth } from ".";


@Injectable()
export class AuthService {

    private ldap = new LdapConn();


    async autenticar(usuario: Auth) {
        const autenticado = await this.ldap.find(`(uid=${usuario.login})`, ["uid", "givenName"])
        try {
	    if (!autenticado[0])
           	throw new Error("");
            
	    await this.ldap.bind(autenticado[0].dn, usuario.senha)
            autenticado[0].grupo = await this.ldap.find(`(memberUid=${usuario.login})`, ["cn"])
            if (autenticado[0].grupo.some(e => e.cn === 'admin')) {
                const jwt = { type: 'Bearer', token: gerarToken(autenticado[0]), session: autenticado[0].givenName }
                return jwt
            } else {
                throw new Error("");
            }
        } catch (error) {
            throw new HttpException('Usuário ou senha inválidos', HttpStatus.UNAUTHORIZED)
        }
    }

    async listarPermissoes(id: string) {

    }
}
