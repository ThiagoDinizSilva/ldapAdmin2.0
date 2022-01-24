import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { GrupoService } from "./grupo.service";
import { Grupo } from "./grupo.entity";


@Controller("grupo")
export class GrupoController {
    constructor(private grupoService: GrupoService) { }

    @Get()
    async listarUsuarios(@Query('id') id): Promise<Grupo[]> {
        if (id) return await this.grupoService.listarGrupos(id);
        return await this.grupoService.listarGrupos();
    }

    @Get(":id")
    async detalharUsuarios(@Param('id') id: string) {
        const grupos = await this.grupoService.detalharGrupo(id)
        if (grupos.length >= 1) return grupos
        throw new HttpException('Grupo não encontrado', HttpStatus.NOT_FOUND)
    }

    @Post()
    @HttpCode(201)
    async cria(@Body() grupo: Grupo): Promise<Grupo> {
        const grupoExiste = await this.grupoService.detalharGrupo(grupo.nome)
        if (grupoExiste[0])
            throw new HttpException('Ja existe um grupo com este nome', HttpStatus.BAD_REQUEST)
        return this.grupoService.adicionar(grupo);
    }

    @Put(":id")
    async atualizar(@Param('id') id: string, @Body() grupo: Grupo) {
        grupo.nome = id
        const grupoExiste = await this.grupoService.detalharGrupo(grupo.nome)
        if (!grupoExiste[0])
            throw new HttpException('Não é possível atualizar um usuário que não foi cadastrado', HttpStatus.BAD_REQUEST)
        await this.grupoService.validarUsuarios(grupo.usuarios)
        return this.grupoService.atualizar(grupo);
    }

    @Delete(":id")
    async deletar(@Param('id') id: string) {
        const grupoExiste = await this.grupoService.detalharGrupo(id)
        if (!grupoExiste[0])
            throw new HttpException('Não é possível deletar um grupo que não foi cadastrado', HttpStatus.BAD_REQUEST)
        await this.grupoService.deletar(id);
    }

}