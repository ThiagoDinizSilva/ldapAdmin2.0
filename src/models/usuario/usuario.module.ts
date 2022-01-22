import { Module } from "@nestjs/common";
import { UsuariosController } from "./usuario.controller";
import { UsuarioService } from "./usuario.service";

@Module({
    controllers: [UsuariosController],
    providers: [UsuarioService]
})
export class UsuarioModule { }