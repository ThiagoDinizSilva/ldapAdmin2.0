import { createHash } from 'crypto';
const jwt = require('jsonwebtoken');

export function gerarHash(input: string): string {
    const hashBase64 = createHash('md5').update(input).digest('base64');
    return `{MD5}${hashBase64}`
}

export function gerarToken(usuario: any) {
    const role = usuario.grupo[0]?.cn || 'user'
    const token = jwt.sign({
        uid: usuario.uid,
        usuario: usuario.name,
        role: role
    }, process.env.SECRET || 'secret', {
        expiresIn: "6000000"
    });
    return token
}