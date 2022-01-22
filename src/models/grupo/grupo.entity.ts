import { IsArray, isArray, IsNotEmpty, isNotEmpty } from 'class-validator';
import { Usuario } from '../usuario/usuario.entity';

export class Grupo {

    @IsNotEmpty()
    private nome: string;

    private membros: Array<Usuario> = [];
    @IsArray()
    private objectClass: Array<String>;

}