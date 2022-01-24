import { Injectable } from '@nestjs/common';
import LdapConn from 'src/common/ldap.conn';
import { Usuario, UsuarioAtualizado } from 'src/models/usuario';

@Injectable()
export class UsuarioService {

  private usuarios: Array<Usuario> = [];
  private ldap = new LdapConn();

  /**
    * @param {string} [id] id do usuário
    * @example
    * listarUsuarios(123)
    * @returns {Array<Object>} retorna uma lista de usuários cuja id começa com 123
    **/
  async listarUsuarios(id?: string): Promise<Usuario[]> {
    if (id) return await this.ldap.find(`(uid=${id}*)`, ["initials", "sn", "displayName", "uid", "cn"])
    this.usuarios = await this.ldap.find('(uid=*)', ["displayName", "uid"])
    return this.usuarios
  }

  async detalharUsuario(id: string) {
    
    const usuario = await this.ldap.find(`(uid=${id})`, ["initials", "sn", "displayName", "uid", "cn"])
    if (usuario[0]) usuario[0].grupo = await this.ldap.find(`(memberUid=${id})`, ["cn"])
    return usuario
  }

  async adicionar(usuario: Usuario) {
    await this.ldap.add(usuario)
    return usuario;
  }

  async atualizar(usuario: UsuarioAtualizado) {

    await this.ldap.update(usuario)
    if (usuario.novaIdentidade && usuario.identidade != usuario.novaIdentidade)
      this.ldap.updateDN(usuario, usuario.novaIdentidade)
    return usuario
  }

  async deletar(id: string): Promise<void> {
    const usuario = await this.ldap.find(`(uid=${id})`)
    await this.ldap.delete(usuario)
  }
}