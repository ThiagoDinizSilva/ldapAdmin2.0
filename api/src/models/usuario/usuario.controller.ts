import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { UsuarioAtualizado } from "./usuario.atualizado.entity";
import { Usuario } from "./usuario.entity";
import { UsuarioService } from "./usuario.service";


@Controller("usuarios")
export class UsuariosController {
    constructor(private usuarioService: UsuarioService) { }

    @Get()
    async listarUsuarios(@Query('id') id, @Query('page') page) {
        let listaDeUsuarios;
        let primeiroRegistro;
        let ultimoRegistro;

        if (page <= 1) {
            primeiroRegistro = 0
        } else {
            primeiroRegistro = page * 50
            primeiroRegistro -= 1

        }

        ultimoRegistro = primeiroRegistro + 50;

        if (id)
            listaDeUsuarios = await this.usuarioService.listarUsuarios(id);
        else {
            listaDeUsuarios = await this.usuarioService.listarUsuarios();
        }

        return {
            count: listaDeUsuarios.length(),
            usuarios: listaDeUsuarios.slice(primeiroRegistro, ultimoRegistro)
        }
    }

    @Get(":id")
    async detalharUsuarios(@Param('id') id: string) {
        const usuarios = await this.usuarioService.detalharUsuario(id)
        if (usuarios.length >= 1) return usuarios
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND)
    }

    @Post()
    @HttpCode(201)
    async cria(@Body() usuario: Usuario): Promise<Usuario> {
        const usuarioExiste = await this.usuarioService.detalharUsuario(usuario.identidade)
        if (usuarioExiste[0])
            throw new HttpException('Ja existe um usuário com esta identidade', HttpStatus.BAD_REQUEST)
        return this.usuarioService.adicionar(usuario);
    }

    @Put(":id")
    async atualizar(@Param('id') id: string, @Body() usuario: UsuarioAtualizado) {
        usuario.identidade = id
        if (id.includes('admin') && usuario.novaIdentidade.includes('admin'))
            throw new HttpException('O usuario admin não pode ter sua identidade alterada', HttpStatus.BAD_REQUEST)

        const usuarioExiste = await this.usuarioService.detalharUsuario(usuario.identidade)
        if (!usuarioExiste[0])
            throw new HttpException('Não é possível atualizar um usuário que não foi cadastrado', HttpStatus.BAD_REQUEST)
        return this.usuarioService.atualizar(usuario);
    }

    @Delete(":id")
    async deletar(@Param('id') id: string) {
        if (id.includes('admin'))
            throw new HttpException('O usuario Admin não pode ser atualizado ou excluido', HttpStatus.BAD_REQUEST)
        if (id.includes('*'))
            throw new HttpException(`Algo não ocorreu como deveria, não é possível deletar o usuário: ${id}`, HttpStatus.BAD_REQUEST)
        try {
            await this.usuarioService.deletar(id);
        } catch {
            throw new HttpException('Usuário não existe no Ldap', HttpStatus.BAD_REQUEST)
        }
    }
}