import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import LdapConn from "src/common/ldap.conn";
import { Usuario } from "../usuario";
import { Grupo } from "./grupo.entity";


@Injectable()
export class GrupoService {

    private ldap = new LdapConn();
    private grupos: Array<Grupo> = [];

    /**
    * @param {string} [id] id do grupo
    * @example
    * listarGrupo(123)
    * @returns {Array<Object>} retorna uma lista de grupos cuja id começa com 123
    **/
    async listarGrupos(id?: string): Promise<Grupo[]> {
        if (id) return await this.ldap.find(`(&(cn=${id}*)(objectClass=posixGroup))`, ["cn"])
        this.grupos = await this.ldap.find('(&(cn=*)(objectClass=posixGroup))', ["cn"])
        return this.grupos
    }

    async detalharGrupo(id: string) {
        return await this.ldap.find(`(&(cn=${id})(objectClass=posixGroup))`, ["memberUid", "cn"])
    }

    async adicionar(grupo: Grupo) {
        await this.ldap.add(grupo)
        return grupo;
    }

    async validarUsuarios(usuarios: Array<string>) {

        for (const usuario of usuarios) {
            const usuarioExiste = await this.ldap.find(`(&(uid=${usuario}*)`);
            if (!usuarioExiste[0])
                throw new HttpException('Não é possível inserir um usuário não cadastrado no grupo', HttpStatus.BAD_REQUEST)
        }
    }
    async atualizar(grupo: Grupo) {

        await this.ldap.update(grupo)
        if (grupo.novoNome && grupo.nome != grupo.nome)
            await this.ldap.updateDN(grupo, grupo.novoNome)
        return grupo
    }

    async deletar(id: string): Promise<void> {
        const grupo = await this.ldap.find(`(&(cn=${id}*)(objectClass=posixGroup))`, ["dn"])
        await this.ldap.delete(grupo)
    }
}