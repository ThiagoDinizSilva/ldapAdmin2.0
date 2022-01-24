import { Allow, IsArray, IsNotEmpty, Length, ValidateIf } from 'class-validator';
import { Usuario } from '../usuario/usuario.entity';

export class Grupo {

    @ValidateIf(x => x.nome)
    @IsNotEmpty()
    nome: string;
    @Allow()
    novoNome: string;

    @ValidateIf(x => x.usuarios.length >= 0)
    @IsArray()
    usuarios: Array<string>;

}