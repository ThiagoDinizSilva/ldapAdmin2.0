import { Allow, IsArray, IsNotEmpty, ValidateIf } from 'class-validator';
import { Usuario } from '../usuario/usuario.entity';

export class Grupo {

    constructor(nome, usuarios) {
        this.nome = nome;
        this.usuarios = usuarios;
    }
    @ValidateIf(x => x.nome)
    @IsNotEmpty()
    nome: string;
    @Allow()
    novoNome: string;

    @ValidateIf(x => x.usuarios)
    @IsArray()
    usuarios: Array<string>;

}