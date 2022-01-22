import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { Usuario } from "./usuario.entity";
import { UsuarioService } from "./usuario.service";

@Controller("usuarios")
export class UsuariosController {
    constructor(private usuarioService: UsuarioService) { }

    @Get()
    async listarUsuarios(@Query('id') id): Promise<Usuario[]> {
        if (id) return await this.usuarioService.listarUsuarios(id);
        return await this.usuarioService.listarUsuarios();
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
        console.log(usuarioExiste)
        if (usuarioExiste[0])
            throw new HttpException('Ja existe um usuário com esta identidade', HttpStatus.BAD_REQUEST)
        return this.usuarioService.adicionar(usuario);
    }

    @Put(":id")
    async atualizar(@Body() usuario: Usuario) {
        return this.usuarioService.atualizar(usuario);
    }

    @Delete(":id")
    async deletar(@Param() usuario) {
        try {
            await this.usuarioService.deletar(usuario.id);
        } catch {
            throw new HttpException('usuário não existe no Ldap', HttpStatus.BAD_REQUEST)
        }
    }
}