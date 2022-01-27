import { Allow, IsArray, IsEmail, IsString, MinLength, ValidateIf } from 'class-validator';
import { gerarHash } from 'src/common/auth';
import { Usuario } from '.';

export class UsuarioAtualizado {
    [x: string]: any;

    @Allow()
    novaIdentidade: string;

    @ValidateIf(x => x.email)
    @IsString()
    email: string;

    @ValidateIf(x => x.senha)
    @MinLength(5)
    private senha: string;

    @ValidateIf(x => x.nome)
    @IsString()
    nome: string;

    @ValidateIf(x => x.sobrenome)
    @IsString()
    sobrenome: string;

    getSenha() {
        if (this.senha)
            return gerarHash(this.senha);
        return undefined;
    }
}

