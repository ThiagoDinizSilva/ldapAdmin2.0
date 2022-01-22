import { createHash } from 'crypto';

export function gerarHashDaSenha(input: string): string {
    const hashBase64 = createHash('md5').update(input).digest('base64');
    return `{MD5}${hashBase64}`
}