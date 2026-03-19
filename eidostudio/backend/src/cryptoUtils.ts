/**
 * cryptoUtils.ts — Utilitários de criptografia para hash de senhas (PBKDF2)
 */

/**
 * Gera um hash da senha usando PBKDF2 com salt aleatório e 100 mil iterações.
 * O formato de saída é "saltHex:iterations:hashHex".
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iterations = 100000;

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    const hashBuffer = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: iterations,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    return `${saltHex}:${iterations}:${hashHex}`;
}

/**
 * Verifica se a senha fornecida corresponde ao hash armazenado.
 * Também suporta migração de senhas em plain-text (se não houver ":", assume string direta).
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    // Fallback: se o storedHash não tiver ':' assumimos que é uma senha antiga em texto plano.
    if (!storedHash.includes(':')) {
        return password === storedHash;
    }

    try {
        const parts = storedHash.split(':');
        if (parts.length !== 3) return false;

        const [saltHex, iterationsStr, hashHex] = parts;
        const iterations = parseInt(iterationsStr, 10);

        let saltArray = saltHex.match(/.{1,2}/g);
        if (!saltArray) return false;

        const salt = new Uint8Array(saltArray.map(byte => parseInt(byte, 16)));

        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );

        const hashBuffer = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: iterations,
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        );

        const newHashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        return newHashHex === hashHex;
    } catch (e) {
        console.error("Erro ao verificar senha", e);
        return false;
    }
}
