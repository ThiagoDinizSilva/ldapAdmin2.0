import { IsArray, IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';
import { gerarHash } from 'src/common/auth';

export class Usuario {

    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsNumberString()
    identidade: string;
    @IsNotEmpty()
    private senha: string;
    @IsNotEmpty()
    nome: string;
    @IsNotEmpty()
    sobrenome: string;

    getSenha() {
        if (this.senha)
            return gerarHash(this.senha);
        return undefined;
    }
}