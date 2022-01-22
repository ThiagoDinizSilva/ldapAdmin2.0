import { IsArray, IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class Usuario {
    [x: string]: any;

    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsNumberString()
    identidade: string;
    @IsNotEmpty()
    senha: string;
    @IsNotEmpty()
    nome: string;
    @IsNotEmpty()
    sobrenome: string;
    @IsArray()
    grupo: Array<string | Usuario>;

}