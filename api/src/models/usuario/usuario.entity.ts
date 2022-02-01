import { IsNotEmpty, IsNumberString, Allow } from 'class-validator';
import { gerarHash } from 'src/common/auth';

export class Usuario {

    @Allow()
    email: string;
    @IsNotEmpty()
    identidade: string;
    @IsNotEmpty()
    private senha: string;
    @IsNotEmpty()
    nome: string;
    @IsNotEmpty()
    sobrenome: string;
    @IsNotEmpty()
    display: string;
    @Allow()
    grupo: string;

    getSenha() {
        if (this.senha)
            return gerarHash(this.senha);
        return undefined;
    }
}