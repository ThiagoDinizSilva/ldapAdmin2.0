import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { Auth } from "./auth.entity";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post()
    @HttpCode(200)
    async autentica(@Body() auth: Auth): Promise<any> {
        const autenticado = await this.authService.autenticar(auth)
        return autenticado
    }
}