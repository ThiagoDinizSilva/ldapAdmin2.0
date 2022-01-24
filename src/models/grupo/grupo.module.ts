import { Module } from "@nestjs/common";
import { UsuarioService } from "../usuario";
import { GrupoController } from "./grupo.controller";
import { GrupoService } from "./grupo.service";

@Module({
    controllers: [GrupoController],
    providers: [GrupoService,UsuarioService]
})
export class GrupoModule { }